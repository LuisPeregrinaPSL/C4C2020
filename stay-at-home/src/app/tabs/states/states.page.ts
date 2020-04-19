import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-states',
  templateUrl: 'states.page.html',
  styleUrls: ['states.page.scss'],
  encapsulation: ViewEncapsulation.None
})
export class StatesPage implements OnInit {

  constructor(private modalCtrl: ModalController) { }

  ngOnInit() {

  }

  close(){
    this.modalCtrl.dismiss();
  }
  
}
