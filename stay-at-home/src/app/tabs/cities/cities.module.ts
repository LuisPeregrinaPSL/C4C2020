import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CitiesPage } from './cities.page';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: CitiesPage }])
  ],
  declarations: [CitiesPage],
  providers: [ScreenOrientation]
})
export class CitiesPageModule { }
