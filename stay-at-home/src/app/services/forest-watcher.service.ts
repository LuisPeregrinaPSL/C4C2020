import { Injectable, EventEmitter } from '@angular/core';
import { GpsService } from './gps.service';
import { CountdownComponent } from 'ngx-countdown';
import { AppConfiguration } from 'src/app/app-configuration';
import { ForestStatus } from '../forest-status.enum';
import { AppStorageService } from './app-storage.service';
import { UserConfiguration } from '../user-configuration';
import { AlertController } from '@ionic/angular';
import { LocalNotifications, Toast } from '@capacitor/core';
import { SimpleCoordinates } from '../simple-coordinates';
import { Utils } from '../utils';
import { GameRules } from '../game-rules';

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
  timeToGrowANewTree = AppConfiguration.TIME_TO_GROW_TREE;
  _countdown: CountdownComponent;
  status: ForestStatus = ForestStatus.GROWING;
  grow = new EventEmitter<number>();
  shrink = new EventEmitter<number>();


  constructor(
    public gpsSvc: GpsService,
    public appStorageSvc: AppStorageService,
    public alertCtrl: AlertController
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
          this.shrink.emit(config.trees);
        } else {
          let now = new Date();
          if (!GameRules.earliestGrowingDate) {
            // We just started growing
            GameRules.earliestGrowingDate = now;
          } else {
            // We continue growing
            this.status = ForestStatus.GROWING;
            this.calculate(now);
          }
        }
      });

    });
  }

  /**
   * Should update the configuration and return the number.
   * Ideally this is th eonly entry point to edit the config.
   * Make it sync, to throttle.
   * 
   * @param fromDate 
   */
  public async calculate(fromDate: Date): Promise<number> {
    let newTreeCount = GameRules.calculateNewTrees(fromDate);
    if (newTreeCount > 0) {
      this.notifyUser('Stay@home!', 'You have ' + newTreeCount + ' new tree' + (newTreeCount > 1 ? 's' : '') + '. Nice!');
      let config = await this.appStorageSvc.getConfiguration();
      config.trees += newTreeCount;
      await this.appStorageSvc.setConfiguration(config);
      this.grow.emit(newTreeCount);
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
    if (!GameRules.isActive) {
      this.showLocalNotification(header, message);
    }
    else {
      this.showToast(header, message);
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

  private async showToast(header: string, message: string) {
    await Toast.show({
      text: header + ': ' + message
    });
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    alert.present()
  }

  public async getCount(){
    return (await this.appStorageSvc.getConfiguration()).trees;
  }
}
