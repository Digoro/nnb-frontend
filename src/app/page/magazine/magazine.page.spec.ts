import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MagazinePage } from './magazine.page';

describe('MagazinePage', () => {
  let component: MagazinePage;
  let fixture: ComponentFixture<MagazinePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagazinePage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MagazinePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
