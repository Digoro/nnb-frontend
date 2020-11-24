import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';
import { StaticPage } from './static.page';


describe('EventPage', () => {
  let component: StaticPage;
  let fixture: ComponentFixture<StaticPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StaticPage],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(StaticPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
