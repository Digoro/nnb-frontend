import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { PaymentSelectPage } from './payment-select.page';


describe('PaymentPage', () => {
  let component: PaymentSelectPage;
  let fixture: ComponentFixture<PaymentSelectPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentSelectPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentSelectPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
