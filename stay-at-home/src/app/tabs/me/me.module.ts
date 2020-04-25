import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { MePage } from './me.page';
import { CountdownModule } from 'ngx-countdown';
import { ShareModule } from '@ngx-share/core';
import { HttpClientModule } from '@angular/common/http';
import { Platform } from '@angular/cdk/platform';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([{ path: '', component: MePage }]),
    CountdownModule,
    ShareModule,
    HttpClientModule
  ],
  declarations: [MePage],
  providers: [Platform]
})
export class MePageModule { }
