import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MeetingManagementPage } from './meeting-management.page';

describe('MeetingManagementPage', () => {
  let component: MeetingManagementPage;
  let fixture: ComponentFixture<MeetingManagementPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingManagementPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingManagementPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
