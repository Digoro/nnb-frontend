import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { NotionDescComponent } from './notion-desc.component';

describe('NotionDescComponent', () => {
  let component: NotionDescComponent;
  let fixture: ComponentFixture<NotionDescComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotionDescComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(NotionDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
