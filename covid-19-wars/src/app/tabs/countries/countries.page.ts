import { Component } from '@angular/core';
import { GpsService } from '../../services/gps.service';
import { SimpleCoordinates } from 'src/app/simple-coordinates';

@Component({
  selector: 'app-countries',
  templateUrl: 'countries.page.html',
  styleUrls: ['countries.page.scss']
})
export class CountriesPage {

  constructor(public gps:GpsService) { 
    gps.addListener(GpsService.IS_AT_HOME_EVENT, (data: SimpleCoordinates)=> {
      console.log('Is At Home!!!', data.latitude);
    });

    gps.addListener(GpsService.AWAY_FROM_HOME_EVENT, (data: SimpleCoordinates)=> {
      console.log('Is far from Home!!!', data.latitude);
    });
  }

}
