import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MeetingEditPage } from './meeting-edit.page';

describe('MeetingEditPage', () => {
  let component: MeetingEditPage;
  let fixture: ComponentFixture<MeetingEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
