import { Component } from '@angular/core';
import { Platform } from '@ionic/angular';
import { Plugins } from '@capacitor/core';
import { TabsService } from './services/tabs.service';
const { SplashScreen } = Plugins;
import { BackgroundGeolocation, BackgroundGeolocationEvents, BackgroundGeolocationResponse, BackgroundGeolocationLocationProvider } from '@ionic-native/background-geolocation/ngx';
import { AppConfiguration } from './app-configuration';
import { GpsService } from './services/gps.service';
import { SimpleCoordinates } from './simple-coordinates';

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
    this.backgroundGeolocation.configure({
      locationProvider: BackgroundGeolocationLocationProvider.RAW_PROVIDER,
      desiredAccuracy: 10,
      distanceFilter: 0,
      interval: AppConfiguration.GPS_CHECK_POSITION_BACKGROUND_TIMEOUT,
      fastestInterval: AppConfiguration.GPS_CHECK_POSITION_TIMEOUT,
      notificationsEnabled: true,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',
      debug: true
    });
    this.platform.ready().then(() => {
      SplashScreen.hide();
      this.backgroundGeolocation.on(BackgroundGeolocationEvents.location).subscribe((location: BackgroundGeolocationResponse) => {
        this.backgroundGeolocation.startTask().then((taskKey) => {
          this.gpsSvc.mainLoop(new SimpleCoordinates(location.latitude, location.longitude));
          this.backgroundGeolocation.endTask(taskKey);
        });
      });
    });
  }
}
