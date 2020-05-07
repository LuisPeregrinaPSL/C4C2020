import { Component } from '@angular/core';
import { GpsService } from '../../services/gps.service';
import { GpsHistory } from 'src/app/gps-history';
import { AppStorageService } from 'src/app/services/app-storage.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { UserConfiguration } from 'src/app/user-configuration';
import { Plugins, DeviceInfo } from '@capacitor/core';
import { SimpleCoordinates } from 'src/app/simple-coordinates';
import { TranslateService } from '@ngx-translate/core';

const { Device, Browser } = Plugins;

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage {
  config: UserConfiguration = new UserConfiguration();
  configForm: FormGroup;
  loader: any;
  historyArray: Array<GpsHistory>;
  strings: any = {};

  constructor(
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public configService: AppStorageService,
    public gpsService: GpsService,
    public alertCtrl: AlertController,
    public translate: TranslateService
  ) {
    this.prefillAndValidateForm(new UserConfiguration());
    this.loadFormData();
    this.loadHistory();
    this.translate.get('SETTINGS.MODAL.TITLE').subscribe(s => this.strings.modalTitle = s);
    this.translate.get('SETTINGS.MODAL.MESSAGE').subscribe(s => this.strings.modalMessage = s);
    this.translate.get('GENERIC.YES').subscribe(s => this.strings.yes = s);
    this.translate.get('GENERIC.NO').subscribe(s => this.strings.no = s);
  }




  async loadFormData() {
    this.loader = await this.loadingCtrl.create({
      message: 'Loading configuration...',
      backdropDismiss: true
    });
    this.loader.present().then(() => {
      // Load the ones set by admin
      this.configService.getConfiguration().then(
        (newConfig: UserConfiguration) => {
          this.config = newConfig;
        }, () => {
          this.config = new UserConfiguration();
        }).finally(() => {
          Device.getInfo().then((info: DeviceInfo) => {
            if (info.uuid != this.config.deviceId) {
              this.config.deviceId = info.uuid;
            }
          }).finally(() => {
            this.prefillAndValidateForm(this.config);
            /* this.drawForest(); */
            this.loader.dismiss();
          });
        });
    });
  }

	/**
	 * Links the configuration so that onChanges() works.
	 * @param formData UserConfiguration
	 */
  public prefillAndValidateForm(formData: UserConfiguration) {
    this.configForm = this.formBuilder.group({
      geolocationEnabled: [formData.geolocationEnabled]
    })
    this.onChanges();
  }

  /**
	 * Changes this.config based on changes on the form. Namely the geopositioning.
	 */
  private onChanges(): void {
    this.configForm.valueChanges.subscribe(formVal => {
      console.log(formVal);
      let changed = false;
      for (let item in formVal) {
        if (this.config[item] != undefined && this.config[item] != formVal[item] && formVal[item] != undefined) {
          this.config[item] = formVal[item];
          console.log("Updated this.config[" + item + "] to \"" + this.config[item] + "\"")
          changed = true;
        }
      }
      if (changed) {
        this.updateConfig();
      }
    });
  }

  public async loadHistory() {
    this.configService.getHistory().then((history: Array<GpsHistory>) => {
      this.historyArray = history;
    }).catch(e => { console.log('Error fetching history: ' + e) });
  }

  public async deleteHistory() {
    this.historyArray = [];
    this.configService.deleteHistory();
  }

  private updateConfig() {

    if (this.config.geolocationEnabled) {
      this.gpsService.start();
    } else {
      this.gpsService.stop();
    }
    this.configService.setConfiguration(this.config);
  }


  public setHome() {
    GpsService.getCurrentPosition().then((newCoords: SimpleCoordinates) => {
      if (this.config && (this.config.home == undefined || newCoords.latitude != this.config.home.latitude || newCoords.longitude != this.config.home.longitude)) {
        this.config.home = newCoords;
        this.updateConfig();
      }
    });
  }

  async open(url: string) {
    await Browser.open({ url: url });
  }

  public async deleteSettings() {
    this.alertCtrl.create({
      header: this.strings.modalTitle,
      message: this.strings.modalMessage,
      buttons: [{
        text: this.strings.no,
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }, {
        text: this.strings.yes,
        cssClass: 'failure-button',
        handler: () => {
          this.configService.deleteConfiguration();
          this.config = new UserConfiguration();
          this.loadFormData();
        }
      }]
    }).then((alert: HTMLIonAlertElement) => {
      alert.present();
    });
  }
}
