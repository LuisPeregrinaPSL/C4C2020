import { Injectable, Component, NgZone } from '@angular/core';
import { Plugins, Capacitor, CallbackID } from '@capacitor/core';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

const { Geolocation, App, BackgroundTask, LocalNotifications } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class GpsService {
  public history: any = [];
  wait: any;
  coordinate: any = {
    latitude: '',
    longitude: '',
    accuracy: ''
  };
  watchCoordinate: any;
  watchId: CallbackID;
  backgroundMode: boolean = false;

  constructor(public alertCtrl: AlertController, public storage: Storage, private zone: NgZone) { 
    console.log('Constructor...')
    this.init();
  }

  public init() {
    console.log('GPS Service init...')
    if(this.requestPermissions()) {
      this.checkPosition();
      this.setBackgroundEvent();
    }
  }

  private setBackgroundEvent() {
    App.addListener('appStateChange', (state) => {    
      if (state.isActive) {
        console.log('Going to front...');
        this.backgroundMode = false;
        this.checkPosition();
      } 
      else {
        console.log('Going to the background...');
        this.backgroundMode = true;
        let taskId = BackgroundTask.beforeExit(async () => {
          
          const notifs = LocalNotifications.schedule({
            notifications: [
              {
                title: "Application continues working on background",
                body: "Latitude:"+ this.coordinate.latitude +"\nLongitude: " + this.coordinate.longitude+"\nWill resume tracking once the app is open again",
                id: 1,
                sound: null,
                attachments: null,
                actionTypeId: "",
                extra: null
              }
            ]
          });   
          console.log('scheduled notifications', notifs);

          setTimeout(()=>{
            this.notifyUpdates();
          }, 300000);

          this.trackCoordinatesInBackground();

          BackgroundTask.finish({
              taskId
            });         
        });
      }   
    })
  }

  async checkPosition() {
    var currentCoord: any = this.coordinate;
    await this.getCurrentCoordinate();
    console.log('using coordinate');
    console.log(this.coordinate);
    if(currentCoord.latitude != '') {
      var meters = this.convertToMeters(currentCoord.latitude, currentCoord.longitude, this.coordinate.latitude, this.coordinate.longitude);
      console.log('Previous and current: ', currentCoord.latitude, currentCoord.longitude, this.coordinate.latitude, this.coordinate.longitude);
      console.log('Meters: ' + meters);

      if(meters >= 30) {
        this.notifyUser('More than 30 meters', 'You have passed more than 30 meters');
      }
    }

    this.history.push(this.coordinate);
    this.storage.set('history', this.history);

    console.log('History', this.storage.get('history'));
    
    if(!this.backgroundMode) {
      setTimeout(()=>{
        this.checkPosition();
      }, 10000);
    }
  }
  
  async requestPermissions() {
    const permResult = await Plugins.Geolocation.requestPermissions();
    console.log('Perm request result: ', permResult);
    return permResult;
  }

  private async getCurrentCoordinate() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      console.log('Plugin geolocation not available');
      return;
    }
    
    await Geolocation.getCurrentPosition().then(data => {
      console.log('getting coordinate');
      this.zone.run(() => {
        this.coordinate = {
          latitude: data.coords.latitude,
          longitude: data.coords.longitude,
          accuracy: data.coords.accuracy
        };
      });
      console.log('new coordinates: ',data.coords.latitude, data.coords.longitude, this.coordinate.latitude, this.coordinate.longitude);
    }).catch(err => {
      console.error(err);
      return;
    });
  }

  public async getCurrentPosition() {
    const coordinates = await Geolocation.getCurrentPosition();
    console.log('getCurrentPosition()', coordinates.coords.latitude, coordinates.coords.longitude);
    return coordinates;
    
  }

  public async watchPosition(callback) {
    const wait = await Geolocation.watchPosition({}, callback);
    return wait;
  }

  private async trackCoordinatesInBackground() {
    console.log('trackCoordinatesInBackground');
    this.wait = await Geolocation.watchPosition({}, (data: any)=>{
      console.log('Latitude: ', data.coords.latitude);

      var currentCoord: any = this.coordinate;
      if(currentCoord != null) {
        var meters = this.convertToMeters(currentCoord.latitude, currentCoord.longitude, data.coords.latitude, data.coords.longitude);
        console.log('Previous and current: ', currentCoord.latitude, currentCoord.longitude, data.coords.latitude, data.coords.longitude);
        console.log('Meters: ' + meters);
        this.showLocalNotification('Meters', 'Meters: ' + meters);
        if(meters >= 30) {
          this.notifyUser('More than 30 meters', 'You have passed more than 30 meters');
        }
      }

      if(!this.backgroundMode) {
        Geolocation.clearWatch(this.wait);
      }
    });
  }

  public async showHistory() {
    var message = '';
    
    for(let i=0;i<this.history.length;i++){
       message+=`
       <p> History Log #` + (i+1) + `.</p>
       <ul>
         <li>Latitude: ` + this.history[i].latitude + `</li>
         <li>Longitude: ` + this.history[i].longitude + `</li>
         <li>Accuracy: ` + this.history[i].accuracy + `</li>
         <li>Map: <a href="https://www.google.com.mx/maps/search/` + this.history[i].latitude + `,` + this.history[i].longitude + `">Click here</a></li>
       </ul>
     `
      
    }

    const alert = await this.alertCtrl.create({
      header: 'Position History',
      message: message,
      buttons: ['OK']
    });
  alert.present()
  }

  private notifyUpdates() {
    if(this.backgroundMode) {
      this.showLocalNotification('New events', 'New events have ocurred while away');
      setTimeout(()=>{
        this.notifyUpdates();
      }, 300000);
    }
  }

  private notifyUser(header, message) {
    if(this.backgroundMode) {
      this.showLocalNotification(header, message);
    }
    else {
      this.showAlert(header, message);
    }
  }

  private async showAlert(header, message) {
    const alert = await this.alertCtrl.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
  alert.present()
  }

  private showLocalNotification(header, message) {
    console.log('showing notification');
    const notifs = LocalNotifications.schedule({
      notifications: [
        {
          title: header,
          body: message,
          id: 2,
          sound: null,
          attachments: null,
          actionTypeId: "",
          extra: null
        }
      ]
    });   
    console.log('scheduled notifications 2', notifs);
  }

  private convertToMeters(lat1, lon1, lat2, lon2){  
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d * 1000; // meters
  }
}
