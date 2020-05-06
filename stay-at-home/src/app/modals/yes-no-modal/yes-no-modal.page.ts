import { Component, OnInit, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-yes-no-modal',
  templateUrl: './yes-no-modal.page.html',
  styleUrls: ['./yes-no-modal.page.scss'],
})
export class YesNoModalPage implements OnInit {
  @Input() title: string;
  @Input() message: string;

  constructor(
    public modalCtrl: ModalController,
    public translate: TranslateService
  ) { }

  ngOnInit() {
  }

  close(res: boolean) {
    this.modalCtrl.dismiss(res);
  }

}
