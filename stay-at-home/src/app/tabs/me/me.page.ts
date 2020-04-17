import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { UserConfiguration } from 'src/app/user-configuration';
import { GpsService } from 'src/app/services/gps.service';
import { AppStorageService } from 'src/app/services/app-storage.service';
import { GpsHistory } from 'src/app/gps-history';
import { Plugins, DeviceInfo } from '@capacitor/core';
import { AppConfiguration } from 'src/app/app-configuration';
import { CountdownComponent } from 'ngx-countdown';
import { Screenshot } from '@ionic-native/screenshot/ngx';
import { Constants } from 'src/app/constants';
import { RestApiService } from 'src/app/services/rest-api.service';
import { ForestWatcherService } from 'src/app/services/forest-watcher.service';
import { Events } from 'src/app/events.enum';

import * as debounce from 'debounce-promise';
import { ForestStatus } from 'src/app/forest-status.enum';


const { Device, Share } = Plugins;

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
})
export class MePage implements OnInit, AfterViewInit {
  private config: UserConfiguration = new UserConfiguration();
  configForm: FormGroup;
  loader: any;
  historyArray: Array<GpsHistory>;
  timeToGrowTree = AppConfiguration.TIME_TO_GROW_TREE / 1000;
  @ViewChild('countdown', { static: false }) countdown: CountdownComponent;
  countdownHack = false;
  @ViewChild('imageCanvas', { static: false }) canvas: any;
  canvasElement: any;


  constructor(
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public gpsSvc: GpsService,
    public configService: AppStorageService,
    public screenshot: Screenshot,
    public restApi: RestApiService,
    public forestWatcher: ForestWatcherService
  ) {
    this.prefillAndValidateForm(new UserConfiguration());
    this.loadFormData();

    forestWatcher.addListener(Events.GROWING, (trees: number) => {
      if (this.countdown.left == 0 && !this.countdownHack) {
        this.countdownHack = true;
        this.restartCountdown();
      }
    })
    forestWatcher.addListener(Events.SHRINKING, (trees: number) => {
      this.countdown.stop();
    })

  }

  ngOnInit() {
  }

  // Debounced because the actual timer might get restarted and we could also restart from the listener
  private restartCountdown() {
    if (this.countdown.left == 0 && this.forestWatcher.status == ForestStatus.GROWING) {
      this.forestWatcher.calculateTrees(new Date().getTime());
      this.countdown.restart();
    }
    setTimeout(() => this.restartCountdown(), AppConfiguration.TIME_TO_GROW_TREE + 1000); // One more second as timeleft doest count miliseconds.
  }

  ngAfterViewInit() {
    this.canvasElement = this.canvas.nativeElement;
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
              this.updateConfig();
            }
          }).finally(() => {
            this.prefillAndValidateForm(this.config);
            this.drawForest();
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
    this.screenshot.URI(50).then(async resolved => {
      this.restApi.uploadImage(this.config.deviceId, resolved.URI);
    });
    Share.share({
      title: 'Stay@home',
      text: 'I have ' + this.config.trees + ' trees in my forest. Can you beat my record?',
      url: Constants.SERVER + '?id=' + this.config.deviceId,
      dialogTitle: 'Share with buddies'
    });
  }

  private drawForest() {
    var treeImage = new Image(12, 20);
    treeImage.src = './assets/icon/tree.svg';
    let ctx = this.canvasElement.getContext('2d');
    ctx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    var gradient = ctx.createLinearGradient(0, 0, this.canvasElement.width, this.canvasElement.height);
    gradient.addColorStop(0, '#9dc648');
    gradient.addColorStop(1, '#308963');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    treeImage.onload = () => {
      for (let i = 0; i < this.config.trees; i++) {
        let randomX = this.getRandomInt(this.canvasElement.width);
        let randomY = this.getRandomInt(this.canvasElement.height)
        ctx.drawImage(treeImage, randomX, randomY, treeImage.width, treeImage.height);
      }

    }
  }

  private getRandomInt(max: number) {
    return Math.floor(Math.random() * Math.floor(max));
  }



}
