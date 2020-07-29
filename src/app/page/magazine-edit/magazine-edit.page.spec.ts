import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MagazineEditPage } from './magazine-edit.page';

describe('MagazineEditPage', () => {
  let component: MagazineEditPage;
  let fixture: ComponentFixture<MagazineEditPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagazineEditPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MagazineEditPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
