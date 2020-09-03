import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { HostedMeetingsPage } from './hosted-meetings.page';


describe('HostedMeetingsPage', () => {
  let component: HostedMeetingsPage;
  let fixture: ComponentFixture<HostedMeetingsPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HostedMeetingsPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(HostedMeetingsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
