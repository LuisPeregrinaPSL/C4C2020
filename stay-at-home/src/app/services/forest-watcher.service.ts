import { Injectable } from '@angular/core';
import { GpsService } from './gps.service';
import { Events } from '../events.enum';
import { CountdownComponent } from 'ngx-countdown';
import { AppConfiguration } from 'src/app/app-configuration';
import { ForestStatus } from '../forest-status.enum';
import { AppStorageService } from './app-storage.service';
import { UserConfiguration } from '../user-configuration';
import { AlertController } from '@ionic/angular';
import { LocalNotifications } from '@capacitor/core';
import { GpsHistory } from '../gps-history';
import { Eventfull } from '../eventfull';
import { config } from 'rxjs';
import * as debounce from 'debounce-promise';

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
export class ForestWatcherService extends Eventfull {
  timeToGrowANewTree = AppConfiguration.TIME_TO_GROW_TREE;
  _countdown: CountdownComponent;
  status: ForestStatus;
  count: number;
  earliestGrowingDate: Date;
  calculateTrees = debounce(this._calculateTrees, 500);

  constructor(
    public gpsSvc: GpsService,
    public appStorageSvc: AppStorageService,
    public alertCtrl: AlertController
  ) {
    super();
    // A new entry was added to the history. There is a configuration, the user enabled geolocation and a home was set.
    gpsSvc.addListener(Events.GPS_BEACON, async (newHistory: GpsHistory) => {

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
        this.earliestGrowingDate = null;
        this.deductTree();
        this.notifyEvent(Events.SHRINKING, this.count);
      } else {
        if (!this.earliestGrowingDate) {
          // We just started growing
          this.earliestGrowingDate = newHistory.time;
        } else {
          // We continue growing
          this.status = ForestStatus.GROWING;
          let oldTreeCount = this.count;
          this.calculateTrees(newHistory.time.getTime()).then(treeCount => {
            this.count = treeCount;
            if (this.count > oldTreeCount) {
              console.log('Old:' + oldTreeCount + ', new: ' + this.count);
              this.notifyEvent(Events.GROWING, this.count);
            }
          });

        }

      }

    });
  }

  private deductTree() {
    this.appStorageSvc.getConfiguration().then((config: UserConfiguration) => {
      if (config.trees > 0) {
        config.trees--;
        this.appStorageSvc.setConfiguration(config);
      }
    })
  }

  public async _calculateTrees(upTo: number): Promise<number> {
    let timeSpan = upTo - this.earliestGrowingDate.getTime();
    let conf = await this.appStorageSvc.getConfiguration();
    let newTreeCount = Math.floor(timeSpan / AppConfiguration.TIME_TO_GROW_TREE);
    if (newTreeCount > 0) {
      conf.trees += newTreeCount
      console.log('Added ' + newTreeCount + ' trees');
      this.appStorageSvc.setConfiguration(conf);
      this.earliestGrowingDate = new Date();
    }
    return conf.trees;
  }

  private async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    alert.present()
  }


  private notifyUser(header: string, message: string) {
    if (this.gpsSvc.backgroundMode) {
      this.showLocalNotification(header, message);
    }
    else {
      this.showAlert(header, message);
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



}
