import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { PaymentPayPage } from './payment-pay.page';

describe('PaymentPayPage', () => {
  let component: PaymentPayPage;
  let fixture: ComponentFixture<PaymentPayPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentPayPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentPayPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
