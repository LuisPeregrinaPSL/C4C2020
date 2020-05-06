import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { YesNoModalPage } from './yes-no-modal.page';

describe('YesNoModalPage', () => {
  let component: YesNoModalPage;
  let fixture: ComponentFixture<YesNoModalPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [YesNoModalPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(YesNoModalPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
