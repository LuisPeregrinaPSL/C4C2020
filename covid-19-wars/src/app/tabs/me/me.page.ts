import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { UserConfiguration } from 'src/app/user-configuration';
import { GpsService } from 'src/app/services/gps.service';
import { AppStorageService } from 'src/app/services/app-storage.service';
import { SimpleCoordinates } from 'src/app/simple-coordinates';
import { GpsHistory } from 'src/app/gps-history';

@Component({
  selector: 'app-me',
  templateUrl: './me.page.html',
  styleUrls: ['./me.page.scss'],
})
export class MePage implements OnInit {
  config: UserConfiguration = new UserConfiguration();
  configForm: FormGroup;
  loader: any;
  historial: Array<GpsHistory>;

  constructor(
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public gps: GpsService,
    public configService: AppStorageService
  ) {
    this.prefillAndValidateForm(this.config);
    this.loadFormData();

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
          this.prefillAndValidateForm(this.config);
          this.loader.dismiss();
        }, (error: any) => {
          this.loader.dismiss();
        });
    });
  }

  public async establecerCasa() {
    let pos = (await this.gps.getCurrentPosition());
    let newCoords = new SimpleCoordinates(pos.coords.latitude, pos.coords.longitude)
    if (newCoords.latitude != this.config.casa.latitude || newCoords.longitude != this.config.casa.longitude) {
      this.config.casa = newCoords;
      this.configService.setConfiguration(this.config);
      console.log("Updated this.config.casa to \"" + this.config.casa + "\"")
    }
  }

  public prefillAndValidateForm(formData: UserConfiguration) {
    this.configForm = this.formBuilder.group({
      vendor: [{ value: formData.vendor, disabled: false }, Validators.compose([
        Validators.minLength(5),
        Validators.maxLength(20),
        Validators.required
      ])],
      geolocation: [formData.geolocation]
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
        this.configService.setConfiguration(this.config);
      }
    });
  }

  public async cargarHistorial() {
    this.historial = await this.configService.getHistory();
    console.log(this.historial.length);
  }
  public async borrarHistorial() {
    this.historial = [];
    this.configService.deleteHistory();
  }
}
