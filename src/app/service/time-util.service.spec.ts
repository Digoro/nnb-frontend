import { TestBed } from '@angular/core/testing';

import { TimeUtilService } from './time-util.service';

describe('TimeUtilService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TimeUtilService = TestBed.get(TimeUtilService);
    expect(service).toBeTruthy();
  });
});
