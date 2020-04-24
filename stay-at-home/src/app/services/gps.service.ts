import { Injectable, EventEmitter } from '@angular/core';
import { Plugins, GeolocationPosition } from '@capacitor/core';
import { SimpleCoordinates } from '../simple-coordinates';
import { AppStorageService } from './app-storage.service';
import { UserConfiguration } from '../user-configuration';
import { GameRules } from '../game-rules';

const { Geolocation } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class GpsService {
  beacon = new EventEmitter<SimpleCoordinates>();

  /** Publish as static to avoid injecting to constructor. */
  static lastCoords: SimpleCoordinates;

  constructor(
    public appStorageSvc: AppStorageService,
  ) { }

  public mainLoop(newCoords: SimpleCoordinates) {
    if (GameRules.shouldAppBeRunning()) {
      console.log('checking position...')
      this.appStorageSvc.getConfiguration().then(async (config: UserConfiguration) => {
        // Get the newest position
        if (!config.geolocationEnabled || !config.home) { throw new Error('Geolocalization and/or home not enabled yet.') }
        if (config.home) {
          GpsService.lastCoords = newCoords;
          this.beacon.emit(newCoords);
        }
      }).catch((e) => {
        // No config, do not do anything as the geolocation might not be set.
        console.error(e);
      });
    }
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
