import { Injectable, EventEmitter } from '@angular/core';
import { GpsService } from './gps.service';
import { AppConfiguration } from 'src/app/app-configuration';
import { ForestStatus } from '../forest-status.enum';
import { AppStorageService } from './app-storage.service';
import { UserConfiguration } from '../user-configuration';
import { AlertController } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/core';
import { SimpleCoordinates } from '../simple-coordinates';
import { Utils } from '../utils';
import { GameRules } from '../game-rules';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { RestApiService } from './rest-api.service';
import { GpsHistory } from '../gps-history';

@Injectable({
  providedIn: 'root'
})
/**
 * This service should return the following this:
 *    * How many trees does the forest has.
 *    * Is it growing or shriking
 *    * How long until we get a new tree
 * 
 */
export class ForestWatcherService {
  status: ForestStatus = ForestStatus.GROWING;
  grow: EventEmitter<number> = new EventEmitter<number>();
  shrink: EventEmitter<number> = new EventEmitter<number>();
  level: EventEmitter<number> = new EventEmitter<number>();

  constructor(
    public gpsSvc: GpsService,
    public appStorageSvc: AppStorageService,
    public alertCtrl: AlertController,
    public audio: NativeAudio,
    public restApi: RestApiService
  ) {
    // A new entry was added to the history. There is a configuration, the user enabled geolocation and a home was set.
    gpsSvc.beacon.subscribe(async (newCoords: SimpleCoordinates) => {
      this.appStorageSvc.getConfiguration().then((config: UserConfiguration) => {
        let metersFromHome = Utils.convertToMeters(config.home.latitude, config.home.longitude, newCoords.latitude, newCoords.longitude);
        if (metersFromHome > AppConfiguration.DISTANCE_TO_HOUSE_THRESHOLD) {
          // We are shrinking
          this.status = ForestStatus.SHRINKING;
          GameRules.earliestGrowingDate = null;
          this.deductTree();
          this.appStorageSvc.addHistory(new GpsHistory(newCoords, new Date(), -1));
          this.restApi.postLocation(newCoords);
          this.shrink.emit(config.trees);
        } else {
          let now = new Date();
          if (!GameRules.earliestGrowingDate) {
            // We just started growing
            GameRules.earliestGrowingDate = now;
          } else {
            // We continue growing
            this.status = ForestStatus.GROWING;
            this.calculate(now, newCoords);
          }
        }
      });

    });

    // Preload audio
    ['new-tree', 'first-start', 'lose-tree', 'new-level'].forEach((fileName: string) => audio.preloadSimple(fileName, '../public/assets/sounds/' + fileName + '.mp3').then(() => {
      console.log('Preloaded audio.');
    }, () => {
      console.error('Couldn\'t preload audio.')
    }));
  }

  /**
   * Should update the configuration and return the number.
   * Ideally this is th eonly entry point to edit the config.
   * Make it sync, to throttle.
   * 
   * Notice the important parts are in GameRules.
   * 
   * @param fromDate 
   */
  public async calculate(fromDate: Date, coords?: SimpleCoordinates): Promise<number> {
    let newTreeCount = GameRules.calculateNewTrees(fromDate);
    if (newTreeCount > 0) {
      this.appStorageSvc.getConfiguration().then((config: UserConfiguration) => {
        if (config.geolocationEnabled && config.home) {
          config.trees += newTreeCount;
          this.audio.play('new-tree');
          this.grow.emit(newTreeCount);

          this.restApi.postLocation(coords);
          let level = GameRules.getPlayerLevel(config);
          if (level > config.level) {
            config.level = level;
            this.notifyUser('Congratulations', 'You have increased your forest level to ' + level + '!');
            this.level.emit(level);
          }
          this.appStorageSvc.setConfiguration(config);


        }
        // Save if its coming from the GPS 
        if (coords) this.appStorageSvc.addHistory(new GpsHistory(coords, new Date(), newTreeCount));
      }).catch(reason => {
        console.log('Couldn\'t get configuration: ' + reason);
      });

    }
    return newTreeCount;
  }

  /**
   * Deducts a tree from the cache and configuration and saves the configuration.
   * Notifies the user and listeners.
   */
  private deductTree() {
    this.appStorageSvc.getConfiguration().then((config: UserConfiguration) => {
      if (config.trees > 0) {
        config.trees--;
        this.appStorageSvc.setConfiguration(config);
        this.notifyUser('Return home!', 'You have one tree less now.');
      }
    })
  }

  /**
   * Sends either a push notification if in background or a local notification if in foreground.
   * @param header string
   * @param message string
   */
  private notifyUser(header: string, message: string) {
    if (!GameRules.isInForeground()) {
      this.showLocalNotification(header, message);
    }
    else {
      this.showAlert(header, message);
    }
  }

  private showLocalNotification(header: string, message: string) {
    LocalNotifications.schedule({
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


  private async showAlert(header: string, message: string) {
    GameRules.isActive = false;
    this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK']
    }).then((alert: HTMLIonAlertElement) => {
      alert.present().then(() => {
        alert.onDidDismiss().then(() => {
          console.log('Dismissed, user is active again.');
          GameRules.isActive = true;
        })
      });
    });
  }

  public async getCount(): Promise<number> {
    return new Promise<number>(resolve => {
      let count = 0;
      return this.appStorageSvc.getConfiguration()
        .then((config: UserConfiguration) => count = config.trees)
        .catch()
        .finally(() => resolve(count));

    })
  }

  public async getCurrentLevel() {
    return new Promise<number>(resolve => {
      let level = 0;
      return this.appStorageSvc.getConfiguration()
        .then((config: UserConfiguration) => level = GameRules.getPlayerLevel(config))
        .catch()
        .finally(() => resolve(level));

    })
  }
}
