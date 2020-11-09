import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MeetingRequestPage } from './meeting-request.page';

describe('MeetingRequestPage', () => {
  let component: MeetingRequestPage;
  let fixture: ComponentFixture<MeetingRequestPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingRequestPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingRequestPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
