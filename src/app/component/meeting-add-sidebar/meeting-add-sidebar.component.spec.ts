import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { MeetingAddSidebarComponent } from './meeting-add-sidebar.component';

describe('MeetingAddSidebarComponent', () => {
  let component: MeetingAddSidebarComponent;
  let fixture: ComponentFixture<MeetingAddSidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MeetingAddSidebarComponent],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MeetingAddSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
