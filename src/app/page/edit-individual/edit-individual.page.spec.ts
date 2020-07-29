import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditIndividualPage } from './edit-individual.page';

describe('EditIndividualPage', () => {
  let component: EditIndividualPage;
  let fixture: ComponentFixture<EditIndividualPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditIndividualPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditIndividualPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
