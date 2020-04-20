import { Component } from '@angular/core';
import { GpsService } from '../../services/gps.service';
import { SimpleCoordinates } from 'src/app/simple-coordinates';
import { GpsHistory } from 'src/app/gps-history';
import { AppStorageService } from 'src/app/services/app-storage.service';
import { Events } from 'src/app/events.enum';
import { ForestWatcherService } from 'src/app/services/forest-watcher.service';

@Component({
  selector: 'app-countries',
  templateUrl: 'countries.page.html',
  styleUrls: ['countries.page.scss']
})
export class CountriesPage {

  historyArray: Array<GpsHistory>;

  constructor(
    public configService: AppStorageService,
    public forestWatcher: ForestWatcherService
  ) {
    forestWatcher.grow.subscribe((data: SimpleCoordinates) => {
      console.log('Is At Home!!!', data.latitude);
    });

    forestWatcher.shrink.subscribe((data: SimpleCoordinates) => {
      console.log('Is far from Home!!!', data.latitude);
    });

    this.loadHistory();
  }

  public async loadHistory() {
    this.historyArray = await this.configService.getHistory();
    console.log(this.historyArray.length);
  }
}
