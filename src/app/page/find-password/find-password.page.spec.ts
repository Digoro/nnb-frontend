import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FindPasswordPage } from './find-password.page';

describe('FindPasswordPage', () => {
  let component: FindPasswordPage;
  let fixture: ComponentFixture<FindPasswordPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FindPasswordPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FindPasswordPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
