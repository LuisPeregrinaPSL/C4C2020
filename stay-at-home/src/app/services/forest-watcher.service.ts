import { Injectable, EventEmitter } from '@angular/core';
import { GpsService } from './gps.service';
import { Events } from '../events.enum';
import { CountdownComponent } from 'ngx-countdown';
import { AppConfiguration } from 'src/app/app-configuration';
import { ForestStatus } from '../forest-status.enum';
import { AppStorageService } from './app-storage.service';
import { UserConfiguration } from '../user-configuration';
import { AlertController } from '@ionic/angular';
import { LocalNotifications, Toast } from '@capacitor/core';
import { GpsHistory } from '../gps-history';
import { TreeCalculatorService } from './tree-calculator.service';

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
  status: ForestStatus;
  count: number;
  grow = new EventEmitter<number>();
  shrink = new EventEmitter<number>();

  /* calculate = debounce(this._calculateTrees, AppConfiguration.TIME_TO_GROW_TREE); */

  constructor(
    public gpsSvc: GpsService,
    public appStorageSvc: AppStorageService,
    public alertCtrl: AlertController,
    public treeCalculator: TreeCalculatorService
  ) {
    this.setInitialCount();
    // A new entry was added to the history. There is a configuration, the user enabled geolocation and a home was set.
    gpsSvc.beacon.subscribe(async (newHistory: GpsHistory) => {

      /* 
        * We are in house, we should be gaining trees. 
        * How is this calculated?
        * The gps is always adding new history every ${AppConfiguration.TIME_TO_GROW_TREE}.
        * Since this is an event based system, we should add tree by tree every time the gps sends new history.
        * But the times vary (time of gps beakon and time to grow a tree), 
        * so we should calculate the number of trees by difference.
        */
      if (newHistory.metersFromHome > AppConfiguration.DISTANCE_TO_HOUSE_THRESHOLD) {
        // We are shrinking
        this.status = ForestStatus.SHRINKING;
        this.treeCalculator.earliestGrowingDate = null;
        this.deductTree();
      } else {
        if (!this.treeCalculator.earliestGrowingDate) {
          // We just started growing
          this.treeCalculator.earliestGrowingDate = newHistory.time;
        } else {
          // We continue growing
          this.status = ForestStatus.GROWING;
          /* this.treeCalculator.calculate(newHistory.time); */
        }
      }
    });
  }

  /**
   * Set the cached count starting from the last number.
   */
  private async setInitialCount() {
    this.appStorageSvc.getConfiguration().then((config: UserConfiguration) => {
      this.count = config.trees;
    });
  }
  /**
   * Should return the new number of trees and save that to the configuration
   * 
   * @param fromDate 
   */
  public calculate(fromDate: Date): number {
    let newTrees = this.treeCalculator.calculate(fromDate);
    if (newTrees > 0) {
      this.count += newTrees;
      this.appStorageSvc.getConfiguration().then((config: UserConfiguration) => {
        config.trees = this.count;
        this.appStorageSvc.setConfiguration(config).then(() => {
          this.notifyUser('Stay@home!', 'You have ' + newTrees + ' new tree' + (newTrees > 1 ? 's' : '') + '. Nice!');
          this.shrink.emit(this.count);
        });
      });
    }
    return newTrees;
  }

  /**
   * Deducts a tree from the cache and configuration and saves the configuration.
   * Notifies the user and listeners.
   */
  private deductTree() {
    this.appStorageSvc.getConfiguration().then((config: UserConfiguration) => {
      if (config.trees > 0) {
        config.trees--;
        this.count--;
        this.shrink.emit(this.count);
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
    if (this.gpsSvc.backgroundMode) {
      this.showLocalNotification(header, message);
    }
    else {
      /* this.showAlert(header, message); */
      this.showToast(header, message);
    }
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
}
