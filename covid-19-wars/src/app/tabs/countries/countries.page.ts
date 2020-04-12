import { Component } from '@angular/core';
import { GpsService } from '../../services/gps.service';

@Component({
  selector: 'app-countries',
  templateUrl: 'countries.page.html',
  styleUrls: ['countries.page.scss']
})
export class CountriesPage {

  constructor(public gps:GpsService) { }

}
