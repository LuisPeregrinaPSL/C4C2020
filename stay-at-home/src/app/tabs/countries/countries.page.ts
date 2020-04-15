import { Component } from '@angular/core';
import { GpsService } from '../../services/gps.service';
import { SimpleCoordinates } from 'src/app/simple-coordinates';
import { GpsHistory } from 'src/app/gps-history';
import { AppStorageService } from 'src/app/services/app-storage.service';

@Component({
  selector: 'app-countries',
  templateUrl: 'countries.page.html',
  styleUrls: ['countries.page.scss']
})
export class CountriesPage {

  historyArray: Array<GpsHistory>;
  
  constructor(public gps:GpsService, public configService: AppStorageService) { 
    gps.addListener(GpsService.IS_AT_HOME_EVENT, (data: SimpleCoordinates)=> {
      console.log('Is At Home!!!', data.latitude);
    });

    gps.addListener(GpsService.AWAY_FROM_HOME_EVENT, (data: SimpleCoordinates)=> {
      console.log('Is far from Home!!!', data.latitude);
    });

    this.loadHistory();
  }

  public async loadHistory() {
    this.historyArray = await this.configService.getHistory();
    console.log(this.historyArray.length);
  }
}
