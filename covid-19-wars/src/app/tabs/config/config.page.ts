import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { LoadingController } from '@ionic/angular';
import { RestApiService } from 'src/app/rest-api.service';
import { Constants } from 'src/app/constants';
import { Configuration } from 'src/app/configuration';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'app-config',
  templateUrl: './config.page.html',
  styleUrls: ['./config.page.scss'],
})
export class ConfigPage implements OnInit {
  configForm: FormGroup;
  loader: any;
  config: Configuration

  constructor(
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public restApi: RestApiService
  ) {
    this.prefillAndValidateForm(new Configuration());
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
      this.restApi.get(Constants.CONFIGURATION).subscribe((newConfig: Configuration) => {
        this.config = newConfig;
        this.loader.dismiss();
      }, (error: any) => {
        this.config = new Configuration();
        this.loader.dismiss();
      });
    });
  }

  async update() {
    this.loader = await this.loadingCtrl.create({
      message: 'Saving config...',
      backdropDismiss: true
    });
    this.loader.present().then(() => {
      this.restApi.put(Constants.CONFIGURATION, this.configForm.value)
        .subscribe(
          () => {
            this.loader.dismiss();
            this.loadFormData();
          }, (error: any) => {
            console.log(error);
            this.loader.dismiss();
          });

      this.loader.dismiss();
    });
  }

  prefillAndValidateForm(formData: any) {
    this.configForm = this.formBuilder.group({
      vendor: [{ value: formData.vendor, disabled: false }, Validators.compose([
        Validators.minLength(5),
        Validators.maxLength(20),
        Validators.required
      ])],
      geolocation: [formData.geolocation]
    })
  }
}
