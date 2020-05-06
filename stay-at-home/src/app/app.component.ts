import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Plugins, DeviceLanguageCodeResult } from '@capacitor/core';
import { TabsService } from './services/tabs.service';
const { SplashScreen, Device } = Plugins;
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';
import { GpsService } from './services/gps.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    public tabs: TabsService,
    public gpsSvc: GpsService,
    public backgroundGeolocation: BackgroundGeolocation,
    public translate: TranslateService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.translate.setDefaultLang('en');
      Device.getLanguageCode().then((language: DeviceLanguageCodeResult) => {
        this.translate.use(language.value.substr(0, 2));
        SplashScreen.hide();
      });
    });
  }
}
