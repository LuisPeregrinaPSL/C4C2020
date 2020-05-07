import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { IonicStorageModule } from '@ionic/storage';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { GpsService } from './services/gps.service';
import { AppConfiguration } from './app-configuration';
import { Screenshot } from '@ionic-native/screenshot/ngx';
import { BackgroundGeolocation } from '@ionic-native/background-geolocation/ngx';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { WebpackTranslateLoader } from './webpack-translate-loader';
import { fixAnimation } from './hacks/FixAnimation';
import { WelcomePage } from './modals/welcome/welcome.page';
import { WelcomePageModule } from './modals/welcome/welcome.module';


@NgModule({
  declarations: [AppComponent],
  entryComponents: [WelcomePage],
  imports: [
    BrowserModule,
    IonicModule.forRoot({
      navAnimation: fixAnimation
    }),
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    IonicStorageModule.forRoot({
      name: AppConfiguration.APP_DB_SCHEMA,
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useClass: WebpackTranslateLoader,
      }
    }),
    WelcomePageModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Screenshot,
    BackgroundGeolocation,
    NativeAudio
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(public gps: GpsService) { }
}
