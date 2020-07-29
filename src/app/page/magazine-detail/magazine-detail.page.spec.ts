import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MagazineDetailPage } from './magazine-detail.page';

describe('MagazineDetailPage', () => {
  let component: MagazineDetailPage;
  let fixture: ComponentFixture<MagazineDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MagazineDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(MagazineDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
