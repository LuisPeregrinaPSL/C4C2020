import { Injectable } from '@angular/core';
import { UserConfiguration } from '../user-configuration';
import { Storage } from '@ionic/storage';
import { Constants } from '../constants';
import { GpsHistory } from '../gps-history';
import * as debounce from 'debounce-promise';

@Injectable({
  providedIn: 'root'
})
export class AppStorageService {
  debounceTimeSet = 2000;
  debounceTimeGet = 200;
  /**
   * @debounced
   * @borrows _setConfiguration as setConfiguration
   */
  setConfiguration = debounce(this._setConfiguration, this.debounceTimeSet);
  /**
   * @debounced
   * @borrows _getConfiguration as getConfiguration
   */
  getConfiguration = debounce(this._getConfiguration, this.debounceTimeGet);
  cachedConfig: UserConfiguration;
  cachedLastHistory: GpsHistory;

  constructor(
    public storage: Storage
  ) { }

  /**
   * Cached. Returns a promise of UserConfiguration
   */
  public async _getConfiguration(): Promise<UserConfiguration> {
    console.debug("Getting config");
    return new Promise((resolve, reject) => {
      if (this.cachedConfig != null) {
        resolve(this.cachedConfig);
      } else {
        this.storage.get(Constants.CONFIGURATION).then((config: string) => {
          if (config == null) {
            reject();
          } else {
            this.cachedConfig = JSON.parse(config);
            resolve(this.cachedConfig)
          }
        });
      }
    });
  }

  /**
   * Cached
   * @param config UserConfiguration
   */
  public async _setConfiguration(config: UserConfiguration) {
    console.debug("Saving config:");
    console.debug(config);
    await this.storage.set(Constants.CONFIGURATION, JSON.stringify(config));
    this.cachedConfig = config;
  }

  public async getHistory(): Promise<Array<GpsHistory>> {
    console.debug("Getting history");
    return new Promise((resolve, reject) => {
      this.storage.get(Constants.GPS_HISTORY).then(
        (gpsHistories: string) => {
          if (gpsHistories == null) {
            reject();
          } else {
            let res: Array<GpsHistory> = JSON.parse(gpsHistories);
            for (let i in res) {
              res[i].time = new Date(res[i].time);
            }
            resolve(res);
          }
        });
    });
  }

  public async getLastHistory(): Promise<GpsHistory> {
    return new Promise((resolve, reject) => {
      if (this.cachedLastHistory != null) {
        resolve(this.cachedLastHistory);
      } else {
        this.getHistory().then((gpsHistories: Array<GpsHistory>) => {
          this.cachedLastHistory = gpsHistories[gpsHistories.length - 1];
          resolve(this.cachedLastHistory);
        }).catch(() => reject());
      }

    });
  }

  public async deleteHistory(): Promise<Array<GpsHistory>> {
    console.debug("Deleting history");
    return new Promise((resolve, reject) => {
      this.storage.set(Constants.GPS_HISTORY, JSON.stringify([]));
    });
  }

  public async addHistory(newHistory: GpsHistory) {
    console.debug("Adding to history");
    let gpsHistories: Array<GpsHistory> = [];
    this.getHistory().then((fetchedGpsHistories: Array<GpsHistory>) => {
      gpsHistories = fetchedGpsHistories;
    }).finally(() => {
      gpsHistories.push(newHistory);
      this.storage.set(Constants.GPS_HISTORY, JSON.stringify(gpsHistories));
      this.cachedLastHistory = newHistory;
    }
    );
  }
}
