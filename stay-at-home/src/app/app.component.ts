import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { TabsService } from './services/tabs.service';
const { SplashScreen } = Plugins;
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';
import { GpsService } from './services/gps.service';

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
    public backgroundGeolocation: BackgroundGeolocation
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      SplashScreen.hide();
    });
  }
}
