import { Component, OnInit, ViewEncapsulation, AfterViewInit } from '@angular/core';
import { ForestWatcherService } from 'src/app/services/forest-watcher.service';
import { UserConfiguration } from 'src/app/user-configuration';
import { ForestRenderer } from 'src/app/forest-renderer';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { Plugins } from '@capacitor/core';
import { TabsService } from 'src/app/services/tabs.service';
import { LoadingController } from '@ionic/angular';

const { StatusBar } = Plugins;



@Component({
  selector: 'app-cities',
  templateUrl: 'cities.page.html',
  styleUrls: ['cities.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CitiesPage implements OnInit, AfterViewInit {
  private document: any;
  private fRenderer: ForestRenderer;
  loader: any;

  constructor(
    public forestWatcher: ForestWatcherService,
    public screenOrientation: ScreenOrientation,
    public tabsSvc: TabsService,
    public loadingCtrl: LoadingController
  ) {
    console.log('contructor');
    if(this.fRenderer != null) {
      console.log('showInformationPane');
      this.fRenderer.showInformationPane();
    }
  }

  iframeLoaded() {
    console.log('iframeLoaded');
    var frame: any = document.querySelector('#iFrame');
    console.log(window[0]);
  }

  ngAfterViewInit(): void {

  }

  ngOnInit() {
    console.log('Setting events');

    var onVRMethod = async (e: any) => {
			console.log('Getting onVRLoaded on cities');
      let count = await this.forestWatcher.getCount();
      this.fRenderer = new ForestRenderer(e.document, e.aframe, e.three);
      this.fRenderer.showInformationPane();
      this.fRenderer.setCurrentView('gView');
      this.fRenderer.setLevel(await this.forestWatcher.getCurrentLevel());
      this.fRenderer.setTreeCount(count, false);
      };
      
    window.addEventListener('onVRLoaded', onVRMethod, false);

    window.addEventListener('onVRChangeView', async (e: any) => {
      console.log('Getting onVRChangeView');
      if(this.fRenderer!=null) {
        this.fRenderer.setCurrentView(e.view);
      }
      
    }, false);

    this.forestWatcher.grow.subscribe(async (trees: number) => {
      console.log('Listener Events.GROWING');
      let count = await this.forestWatcher.getCount();
      this.fRenderer.setTreeCount(count, true);
    });

    this.forestWatcher.level.subscribe((newLevel: number) => {
      console.log('New Level!!!');
      this.fRenderer.setLevel(newLevel);
    });

    this.screenOrientation.onChange().subscribe(() => {
      if (this.screenOrientation.type == this.screenOrientation.ORIENTATIONS.PORTRAIT_PRIMARY ||
        this.screenOrientation.type == this.screenOrientation.ORIENTATIONS.PORTRAIT) {
        StatusBar.show();
        this.tabsSvc.showTabs();
      }

      if (this.screenOrientation.type == this.screenOrientation.ORIENTATIONS.LANDSCAPE_PRIMARY ||
        this.screenOrientation.type == this.screenOrientation.ORIENTATIONS.LANDSCAPE) {
        StatusBar.hide();
        this.tabsSvc.hideTabs();
      }
    });
  }


}
