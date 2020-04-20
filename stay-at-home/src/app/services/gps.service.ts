import { Injectable } from '@angular/core';
import { Plugins, Capacitor, CallbackID, GeolocationPosition, AppState } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
import { SimpleCoordinates } from '../simple-coordinates';
import { AppConfiguration } from '../app-configuration';
import { GpsHistory } from '../gps-history';
import { AppStorageService } from './app-storage.service';
import { ForestStatus } from '../forest-status.enum';
import { UserConfiguration } from '../user-configuration';
import { Events } from '../events.enum';
import { PermissionsRequestResult } from '@capacitor/core/dist/esm/definitions';
import { Eventfull } from '../eventfull';
import { ForestWatcherService } from './forest-watcher.service';
import { TreeCalculatorService } from './tree-calculator.service';

const { Geolocation, App, BackgroundTask, LocalNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class GpsService extends Eventfull {
  backgroundMode: boolean = false;
  lastCoords: SimpleCoordinates;


  constructor(
    public appStorageSvc: AppStorageService,
    public treeCalculator: TreeCalculatorService
  ) {
    super();
    Plugins.Geolocation.requestPermissions().then((permission: PermissionsRequestResult) => {
      if (permission) {
        this.setEvent();
        this.checkPositionLoop()
      }
    });
  }

  private setEvent() {
    App.addListener('appStateChange', (state: AppState) => {
      if (state.isActive) {
        console.log('Going to front...');
        this.backgroundMode = false;
      }
      else {
        console.log('Going to the background...');
        this.backgroundMode = true;
        let taskId = BackgroundTask.beforeExit(() => {

          const notifs = LocalNotifications.schedule({
            notifications: [
              {
                title: "Application continues working on background",
                body: "Latitude:" + this.lastCoords.latitude + "\nLongitude: " + this.lastCoords.longitude + "\nWill resume tracking once the app is open again",
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

  /**
   * Should not care of status of forest.
   */
  private checkPositionLoop() {
    console.log('checking position...')
    this.appStorageSvc.getConfiguration().then(async (config: UserConfiguration) => {
      // Get the newest position
      if (!config.geolocationEnabled || !config.home) { throw new Error('Geolocalization and/or home not enabled yet.') }
      this.getCurrentPosition().then(newCoords => {
        if (config.home) {
          this.lastCoords = newCoords;
          let meters = this.convertToMeters(config.home.latitude, config.home.longitude, newCoords.latitude, newCoords.longitude);
          let newTrees = this.treeCalculator.calculate(new Date());
          let newHistory = new GpsHistory(newCoords, new Date(), meters, newTrees);
          this.appStorageSvc.addHistory(newHistory);
          this.notifyEvent(Events.GPS_BEACON, newHistory);
        }
      }).catch((e) => { console.error(e) });
    }).catch((e) => {
      // No config, do not do anything as the geolocation might not be set.
      console.error(e);
    });

    setTimeout(() => {
      this.checkPositionLoop();
    }, (this.backgroundMode ? AppConfiguration.GPS_CHECK_POSITION_BACKGROUND_TIMEOUT : AppConfiguration.GPS_CHECK_POSITION_TIMEOUT));
  }


  public async getCurrentPosition(): Promise<SimpleCoordinates> {
    let coords = (await Geolocation.getCurrentPosition()).coords;
    return new SimpleCoordinates(coords.latitude, coords.longitude);
  }


  private convertToMeters(lat1: number, lon1: number, lat2: number, lon2: number) {
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
