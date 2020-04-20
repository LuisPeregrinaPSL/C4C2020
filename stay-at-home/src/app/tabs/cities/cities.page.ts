import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ForestWatcherService } from 'src/app/services/forest-watcher.service';
import { Events } from 'src/app/events.enum';
import { UserConfiguration } from 'src/app/user-configuration';
import { ForestRenderer } from 'src/app/forest-renderer';



@Component({
  selector: 'app-cities',
  templateUrl: 'cities.page.html',
  styleUrls: ['cities.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CitiesPage implements OnInit, AfterViewInit {
  private config: UserConfiguration = new UserConfiguration();
  private document: any;
  private fRenderer: ForestRenderer;

  constructor(private modalCtrl: ModalController, public forestWatcher: ForestWatcherService) {

  }

  iframeLoaded() {
    console.log('iframeLoaded');
    var frame: any = document.querySelector('#iFrame');
    console.log(window[0]);
    console.log('iframeLoaded: Setting tree number: ' + this.config.trees);

  }

  ngAfterViewInit(): void {

  }

  ngOnInit() {
    console.log('Setting events');
    window.addEventListener('onVRLoaded', (e: any) => {
      console.log('Getting onVRLoaded');
      this.fRenderer = new ForestRenderer(e.document);
      this.fRenderer.setInitialAmount(500);
      this.fRenderer.setTreeCount(this.config.trees);

    }, false);

    this.forestWatcher.grow.subscribe((trees: number) => {
      console.log('Listener Events.GROWING');
      this.fRenderer.setTreeCount(trees);
      this.fRenderer.addTree(true);
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }

}
