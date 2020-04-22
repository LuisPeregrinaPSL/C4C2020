import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { ForestWatcherService } from 'src/app/services/forest-watcher.service';
import { UserConfiguration } from 'src/app/user-configuration';
import { ForestRenderer } from 'src/app/forest-renderer';
import { AppStorageService } from 'src/app/services/app-storage.service';
import { LoadingController, Platform } from '@ionic/angular';



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
  loader: any;

  constructor(private modalCtrl: ModalController, public forestWatcher: ForestWatcherService, public loadingCtrl: LoadingController, public configService: AppStorageService) {
    this.loadFormData();
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
      this.fRenderer = new ForestRenderer(e.document, e.vector);
      this.fRenderer.setTreeCount(this.config.trees, false);

    }, false);

    this.forestWatcher.grow.subscribe((trees: number) => {
      console.log('Listener Events.GROWING', trees);
      console.log('this.config.trees', this.config.trees);
      //this.config.trees+=trees;
      this.fRenderer.setTreeCount(this.config.trees, true);
    });
  }

  close() {
    this.modalCtrl.dismiss();
  }

  async loadFormData() {
    this.loader = await this.loadingCtrl.create({
      message: 'Loading configuration...',
      backdropDismiss: true
    });
    this.loader.present().then(() => {
      // Load the ones set by admin
      this.configService.getConfiguration().then(
        (newConfig: UserConfiguration) => {
          this.config = newConfig;
        }, () => {
          this.config = new UserConfiguration();
        }).finally(() => {
          this.loader.dismiss();
        })
      });
  }
}
