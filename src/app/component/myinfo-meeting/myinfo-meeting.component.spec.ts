import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MyinfoMeetingComponent } from './myinfo-meeting.component';

describe('MyinfoMeetingComponent', () => {
  let component: MyinfoMeetingComponent;
  let fixture: ComponentFixture<MyinfoMeetingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyinfoMeetingComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MyinfoMeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
