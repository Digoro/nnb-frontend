import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { CouponListPage } from './coupon-list.page';

describe('CouponListPage', () => {
  let component: CouponListPage;
  let fixture: ComponentFixture<CouponListPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponListPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(CouponListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
