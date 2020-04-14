import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { UserConfiguration } from 'src/app/user-configuration';
import { GpsService } from 'src/app/services/gps.service';
import { AppStorageService } from 'src/app/services/app-storage.service';
import { GpsHistory } from 'src/app/gps-history';
import { Plugins, DeviceInfo } from '@capacitor/core';
import { AppConfiguration } from 'src/app/app-configuration';
import { CountdownComponent } from 'ngx-countdown';
import { SimpleCoordinates } from 'src/app/simple-coordinates';


const { Device, Share } = Plugins;

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
})
export class MePage implements OnInit {
  config: UserConfiguration = new UserConfiguration();
  configForm: FormGroup;
  loader: any;
  historyArray: Array<GpsHistory>;
  timeToGrowTree = AppConfiguration.TIME_TO_GROW_TREE / 1000;
  status;
  @ViewChild('countdown', { static: false }) countdown: CountdownComponent;

  constructor(
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public gpsSvc: GpsService,
    public configService: AppStorageService
  ) {
    this.prefillAndValidateForm(new UserConfiguration());
    this.loadFormData();

    gpsSvc.addListener(GpsService.IS_AT_HOME_EVENT, (data: SimpleCoordinates) => {
      if (this.countdown.left == 0) {
        setTimeout(() => this.countdown.restart(), 1000);
      }
    });
  }

  ngOnInit() {
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
        }, (error: any) => {
          this.config = new UserConfiguration();
        }).finally(() => {
          Device.getInfo().then((info: DeviceInfo) => {
            if (info.uuid != this.config.deviceId) {
              this.config.deviceId = info.uuid;
              this.updateConfig();
            }
          }).finally(() => {
            this.prefillAndValidateForm(this.config);
            this.loader.dismiss();
          });
        });
    });
  }

  public async setHome() {
    let newCoords = await this.gpsSvc.getCurrentPosition();
    if (this.config && (this.config.home == undefined || newCoords.latitude != this.config.home.latitude || newCoords.longitude != this.config.home.longitude)) {
      this.config.home = newCoords;
      this.updateConfig();
    }
  }

  public prefillAndValidateForm(formData: UserConfiguration) {
    this.configForm = this.formBuilder.group({
      vendor: [{ value: formData.vendor, disabled: false }, Validators.compose([
        Validators.minLength(5),
        Validators.maxLength(20),
        Validators.required
      ])],
      geolocationEnabled: [formData.geolocationEnabled]
    })
    this.onChanges();
  }

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
    this.historyArray = await this.configService.getHistory();
    console.log(this.historyArray.length);
  }

  public async deleteHistory() {
    this.historyArray = [];
    this.configService.deleteHistory();
  }

  private updateConfig() {
    this.configService.setConfiguration(this.config);
  }

  public async shareOptions() {
    await Share.share({
      title: 'Stay@home',
      text: 'I have ' + this.config.trees + ' trees in my forest. Can you beat my record?',
      url: 'http://stayathome.com/',
      dialogTitle: 'Share with buddies'
    });
  }

}
