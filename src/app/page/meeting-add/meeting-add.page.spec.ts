import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MeetingAddPage } from './meeting-add.page';

describe('MeetingAddPage', () => {
  let component: MeetingAddPage;
  let fixture: ComponentFixture<MeetingAddPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MeetingAddPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeetingAddPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
