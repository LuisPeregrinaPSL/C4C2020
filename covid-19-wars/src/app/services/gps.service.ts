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
  history: Array<GpsHistory>;
  wait: any;
  coordinate: SimpleCoordinates;
  watchCoordinate: any;
  watchId: CallbackID;
  backgroundMode: boolean = false;

  constructor(
    public alertCtrl: AlertController,
    public appStorageSvc: AppStorageService) {
    console.log('Constructor...')
    this.init();
  }

  public init() {
    console.log('GPS Service init...')
    if (this.requestPermissions()) {
      this.checkPosition();
      this.setBackgroundEvent();
    }
  }

  private setBackgroundEvent() {
    App.addListener('appStateChange', (state) => {
      if (state.isActive) {
        console.log('Going to front...');
        this.backgroundMode = false;
        this.checkPosition();
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
          console.log('scheduled notifications', notifs);

          setTimeout(() => {
            this.notifyUpdates();
          }, AppConfiguration.GPS_SET_BACKGROUND_EVENT);

          this.trackCoordinatesInBackground();

          BackgroundTask.finish({
            taskId
          });
        });
      }
    })
  }

  async checkPosition() {
    var currentCoord: SimpleCoordinates = this.coordinate;
    await this.setCurrentCoordinate();
    console.log('using coordinate');
    console.log(this.coordinate);
    if (currentCoord != undefined) {
      var meters = this.convertToMeters(currentCoord.latitude, currentCoord.longitude, this.coordinate.latitude, this.coordinate.longitude);
      console.log('Previous and current: ', currentCoord.latitude, currentCoord.longitude, this.coordinate.latitude, this.coordinate.longitude);
      console.log('Meters: ' + meters);

      if (meters >= AppConfiguration.DISTANCE_THRESHOLD) {
        this.notifyUser('More than ' + AppConfiguration.DISTANCE_THRESHOLD + ' meters', 'You have passed more than ' + AppConfiguration.DISTANCE_THRESHOLD + ' meters');
      }


      await this.appStorageSvc.addHistory(new GpsHistory(currentCoord));

      this.appStorageSvc.getHistory().then(
        (gpsHistory: GpsHistory[]) => console.log('History', gpsHistory),
        () => console.log("empty history")
      );
    }



    if (!this.backgroundMode) {
      setTimeout(() => {
        this.checkPosition();
      }, AppConfiguration.GPS_CHECK_POSITION_TIMEOUT);
    }
  }

  async requestPermissions() {
    let permResult = await Plugins.Geolocation.requestPermissions();
    console.log('Perm request result: ', permResult);
    return permResult;
  }

  private async setCurrentCoordinate() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      console.log('Plugin geolocation not available');
      return;
    }

    let coords = (await this.getCurrentPosition()).coords;
    this.coordinate = new SimpleCoordinates(coords.latitude, coords.longitude);
  }

  public async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log('getCurrentPosition()', coordinates.coords.latitude, coordinates.coords.longitude);
    return coordinates;
  }

  public watchPosition(callback: any) {
    return Geolocation.watchPosition({}, callback);
  }

  private async trackCoordinatesInBackground() {
    console.log('trackCoordinatesInBackground');
    this.wait = Geolocation.watchPosition({}, (data: GeolocationPosition) => {
      console.log('Latitude: ', data.coords.latitude);

      var currentCoord: any = this.coordinate;
      if (currentCoord != null) {
        var meters = this.convertToMeters(currentCoord.latitude, currentCoord.longitude, data.coords.latitude, data.coords.longitude);
        console.log('Previous and current: ', currentCoord.latitude, currentCoord.longitude, data.coords.latitude, data.coords.longitude);
        console.log('Meters: ' + meters);
        this.showLocalNotification('Meters', 'Meters: ' + meters);
        if (meters >= 30) {
          this.notifyUser('More than 30 meters', 'You have passed more than 30 meters');
        }
      }

      if (!this.backgroundMode) {
        Geolocation.clearWatch(this.wait);
      }
    });
  }

  public async showHistory() {
    var message = '';

    for (let i = 0; i < this.history.length; i++) {
      message += `
       <p> History Log #` + (i + 1) + `.</p>
       <ul>
         <li>Latitude: ` + this.history[i].location.latitude + `</li>
         <li>Longitude: ` + this.history[i].location.longitude + `</li>
         <li>Accuracy: ` + this.history[i].location.accuracy + `</li>
         <li>Accuracy: ` + this.history[i].time.toString() + `</li>
         <li>Map: <a href="https://www.google.com.mx/maps/search/` + this.history[i].location.latitude + `,` + this.history[i].location.longitude + `">Click here</a></li>
       </ul>
     `

    }

    const alert = await this.alertCtrl.create({
      header: 'Position History',
      message: message,
      buttons: ['OK']
    });
    alert.present()
  }

  private notifyUpdates() {
    if (this.backgroundMode) {
      this.showLocalNotification('New events', 'New events have ocurred while away');
      setTimeout(() => {
        this.notifyUpdates();
      }, AppConfiguration.GPS_BACKGROUND_TIMEOUT);
    }
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
    console.log('showing notification');
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
    console.log('scheduled notifications 2', notifs);
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
