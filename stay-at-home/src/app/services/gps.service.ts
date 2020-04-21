import { Injectable, EventEmitter } from '@angular/core';
import { Plugins, AppState, GeolocationPosition } from '@capacitor/core';
import { SimpleCoordinates } from '../simple-coordinates';
import { AppConfiguration } from '../app-configuration';
import { AppStorageService } from './app-storage.service';
import { UserConfiguration } from '../user-configuration';
import { PermissionsRequestResult } from '@capacitor/core/dist/esm/definitions';
import { GameRules } from '../game-rules';

const { Geolocation, App, BackgroundTask, LocalNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class GpsService {
  backgroundMode: boolean = false;
  beacon = new EventEmitter<SimpleCoordinates>();

  /** Publish as static to avoid injecting to constructor. */
  static lastCoords: SimpleCoordinates;

  constructor(
    public appStorageSvc: AppStorageService,
  ) {
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

          BackgroundTask.finish({
            taskId
          });
        });
      }
    });
  }

  /**
   * Should not care of status of forest. Just provide a GPS position.
   */
  private checkPositionLoop() {
    if (GameRules.shouldAppBeRunning()) {
      console.log('checking position...')
      this.appStorageSvc.getConfiguration().then(async (config: UserConfiguration) => {
        // Get the newest position
        if (!config.geolocationEnabled || !config.home) { throw new Error('Geolocalization and/or home not enabled yet.') }
        GpsService.getCurrentPosition().then(newCoords => {
          if (config.home) {
            GpsService.lastCoords = newCoords;
            this.beacon.emit(newCoords);
          }
        }).catch((e) => { console.error(e) });
      }).catch((e) => {
        // No config, do not do anything as the geolocation might not be set.
        console.error(e);
      });
    }


    setTimeout(() => {
      this.checkPositionLoop();
    }, (this.backgroundMode ? AppConfiguration.GPS_CHECK_POSITION_BACKGROUND_TIMEOUT : AppConfiguration.GPS_CHECK_POSITION_TIMEOUT));
  }


  /**
   * Avoid using it as much as possible.
   */
  static async getCurrentPosition(): Promise<SimpleCoordinates> {
    return Geolocation.getCurrentPosition().then((geoPos: GeolocationPosition) => {
      return new SimpleCoordinates(geoPos.coords.latitude, geoPos.coords.longitude);
    });
  }
}
