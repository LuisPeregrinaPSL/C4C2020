import { Injectable } from '@angular/core';
import { Plugins, Capacitor, CallbackID, GeolocationPosition } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
import { SimpleCoordinates } from '../simple-coordinates';
import { AppConfiguration } from '../app-configuration';
import { GpsHistory } from '../gps-history';
import { AppStorageService } from './app-storage.service';

const { Geolocation, App, BackgroundTask, LocalNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class GpsService {
  public static DISTANCE_TO_HOME_EVENT: string = 'isFarFromHome';
  public static BACK_IN_HOME_EVENT: string = 'isBackInHome';

  history: Array<GpsHistory>;
  geoFence: any;
  coordinate: SimpleCoordinates;
  watchCoordinate: any;
  watchId: CallbackID;
  backgroundMode: boolean = false;

  constructor(
    public alertCtrl: AlertController,
    public appStorageSvc: AppStorageService) {
    if (this.requestPermissions()) {
      this.setEvent();
      this.checkPosition();
    }
  }

  private setEvent() {
    App.addListener('appStateChange', (state) => {
      if (state.isActive) {
        console.log('Going to front...');
        this.backgroundMode = false;
      }
      else {
        console.log('Going to the background...');
        this.backgroundMode = true;
        let taskId = BackgroundTask.beforeExit(async () => {

          const notifs = LocalNotifications.schedule({
            notifications: [
              {
                title: "Application continues working on background",
                body: "Latitude:" + this.coordinate.latitude + "\nLongitude: " + this.coordinate.longitude + "\nWill resume tracking once the app is open again",
                id: 1,
                sound: null,
                attachments: null,
                actionTypeId: "",
                extra: null
              }
            ]
          });

          BackgroundTask.finish({
            taskId
          });
        });
      }
    });
  }

  async checkPosition() {
    console.log('checking position...')
    var previousCoord = this.coordinate;
    this.coordinate = await this.getCurrentPosition();
    if (previousCoord != undefined) {
      var meters = this.convertToMeters(previousCoord.latitude, previousCoord.longitude, this.coordinate.latitude, this.coordinate.longitude);
      if (meters >= AppConfiguration.DISTANCE_THRESHOLD) {
        await this.appStorageSvc.addHistory(new GpsHistory(this.coordinate));
      }
      let casa = (await this.appStorageSvc.getConfiguration()).casa;
      meters = this.convertToMeters(casa.latitude, casa.longitude, this.coordinate.latitude, this.coordinate.longitude);
      if (meters >= AppConfiguration.DISTANCE_TO_HOUSE_THRESHOLD) {
        this.notifyUser('More than ' + AppConfiguration.DISTANCE_THRESHOLD + ' meters', 'You have passed more than ' + AppConfiguration.DISTANCE_THRESHOLD + ' meters');
      }
    }

    setTimeout(() => {
      this.checkPosition();
    }, (this.backgroundMode ? AppConfiguration.GPS_CHECK_POSITION_BACKGROUND_TIMEOUT : AppConfiguration.GPS_CHECK_POSITION_TIMEOUT));
  }

  async requestPermissions() {
    return await Plugins.Geolocation.requestPermissions();
  }

  public async getCurrentPosition(): Promise<SimpleCoordinates> {
    let coords = (await Geolocation.getCurrentPosition()).coords;
    return new SimpleCoordinates(coords.latitude, coords.longitude);
  }

  private notifyUser(header: string, message: string) {
    if (this.backgroundMode) {
      this.showLocalNotification(header, message);
    }
    else {
      this.showAlert(header, message);
    }
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    alert.present()
  }

  private showLocalNotification(header: string, message: string) {
    const notifs = LocalNotifications.schedule({
      notifications: [
        {
          title: header,
          body: message,
          id: 2,
          sound: null,
          attachments: null,
          actionTypeId: "",
          extra: null
        }
      ]
    });
  }

  private addListener(event: string, callback: Function) {

  }

  private convertToMeters(lat1, lon1, lat2, lon2) {
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d * 1000; // meters
  }
}
