import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MagazineAddPage } from './magazine-add.page';

describe('MagazineAddPage', () => {
  let component: MagazineAddPage;
  let fixture: ComponentFixture<MagazineAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagazineAddPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MagazineAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
