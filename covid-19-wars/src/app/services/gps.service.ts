import { Injectable } from '@angular/core';
import { Plugins, Capacitor, CallbackID, GeolocationPosition } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
import { SimpleCoordinates } from '../simple-coordinates';
import { AppConfiguration } from '../app-configuration';
import { GpsHistory } from '../gps-history';
import { AppStorageService } from './app-storage.service';
import { ForestStatus } from '../forest-status.enum';
import { UserConfiguration } from '../user-configuration';

const { Geolocation, App, BackgroundTask, LocalNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class GpsService {
  public static AWAY_FROM_HOME_EVENT: string = 'isFarFromHome';
  public static BACK_IN_HOME_EVENT: string = 'isBackInHome';
  public static IS_AT_HOME_EVENT: string = 'isAtHome';

  history: Array<GpsHistory>;
  geoFence: any;
  coordinate: SimpleCoordinates;
  watchCoordinate: any;
  watchId: CallbackID;
  backgroundMode: boolean = false;
  isAtHome: boolean = false;
  status: ForestStatus;

  private callbackInfo: string[] = [];

  constructor(
    public alertCtrl: AlertController,
    public appStorageSvc: AppStorageService) {
    this.initEventTypes();
    if (this.requestPermissions()) {
      this.setEvent();
      this.checkPosition();
    }
  }

  private initEventTypes() {
    this.callbackInfo[GpsService.AWAY_FROM_HOME_EVENT] = [];
    this.callbackInfo[GpsService.IS_AT_HOME_EVENT] = [];
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
    this.appStorageSvc.getConfiguration().then(async (config: UserConfiguration) => {
      // Get the newest position
      if (!config.geolocationEnabled || !config.home) { throw new Error('Geolocalization and/or home not enabled yet.') }
      this.coordinate = await this.getCurrentPosition();
      // Last time should provide the last time that we changed states
      this.appStorageSvc.getLastHistory().then(async (lastTime: GpsHistory) => {
        if (config.home) {
          let meters = this.convertToMeters(config.home.latitude, config.home.longitude, this.coordinate.latitude, this.coordinate.longitude);
          let newTreeCount = 0;
          if (meters >= AppConfiguration.DISTANCE_TO_HOUSE_THRESHOLD) {
            this.notifyEvent(GpsService.AWAY_FROM_HOME_EVENT, this.coordinate);
            this.notifyUser('More than ' + AppConfiguration.DISTANCE_THRESHOLD + ' meters', 'You have passed more than ' + AppConfiguration.DISTANCE_THRESHOLD + ' meters');
            this.status = ForestStatus.SHRINKING;
            this.deductTree();
          } else {
            this.status = ForestStatus.GROWING;
            let newDate = new Date();
            let diff = newDate.getTime() - lastTime.time.getTime();

            newTreeCount = await this.updateTree(diff);
            this.notifyEvent(GpsService.IS_AT_HOME_EVENT, this.coordinate);
          }
          if (this.status != lastTime.status || newTreeCount > config.trees) {
            this.appStorageSvc.addHistory(new GpsHistory(this.coordinate, new Date(), this.status, true));
          }
        } else {
          // Home not set yet.
        }
      }).catch(() => {
        //  No last time, start adding entries to history
        this.appStorageSvc.addHistory(new GpsHistory(this.coordinate, new Date(), ForestStatus.GROWING));
      });
    }).catch(() => {
      // No config, do not do anythuing as the geolocation might not be set.
    });

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

  public addListener(event: string, callback: Function) {
    if (!this.callbackInfo[event]) {
      console.log('Event name does not exists');
      return;
    }
    else {
      this.callbackInfo[event].push(callback);
    }
  }

  private notifyEvent(event: string, data: SimpleCoordinates) {
    if (this.callbackInfo[event]) {
      this.callbackInfo[event].forEach(function (callback: Function) {
        callback(data);
      });
    }
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


  public deductTree() {
    this.appStorageSvc.getConfiguration().then((config: UserConfiguration) => {
      if (config.trees > 0) {
        config.trees--;
        this.appStorageSvc.setConfiguration(config);
      }
    })
  }

  public async updateTree(timeSpan: number) {
    let conf = await this.appStorageSvc.getConfiguration();
    let newTreeCount = conf.trees;
    conf.trees = Math.floor(timeSpan / AppConfiguration.TIME_TO_GROW_TREE);
    newTreeCount = conf.trees - newTreeCount;
    this.appStorageSvc.setConfiguration(conf);
    return newTreeCount;
  }
}
