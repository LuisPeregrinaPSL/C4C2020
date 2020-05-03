import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MePage } from './me.page';
import { CountdownModule, CountdownGlobalConfig } from 'ngx-countdown';
import { ShareModule } from '@ngx-share/core';
import { HttpClientModule } from '@angular/common/http';
import { Platform } from '@angular/cdk/platform';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: MePage }]),
    CountdownModule,
    ShareModule,
    HttpClientModule,
    TranslateModule
  ],
  declarations: [MePage],
  providers: [
    Platform,
    CountdownGlobalConfig
  ]
})
export class MePageModule { }
