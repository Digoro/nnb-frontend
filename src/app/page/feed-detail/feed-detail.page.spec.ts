import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { FeedDetailPage } from './feed-detail.page';

describe('FeedDetailPage', () => {
  let component: FeedDetailPage;
  let fixture: ComponentFixture<FeedDetailPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeedDetailPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(FeedDetailPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
