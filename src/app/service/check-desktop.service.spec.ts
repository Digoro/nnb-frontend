import { TestBed } from '@angular/core/testing';

import { CheckDesktopService } from './check-desktop.service';

describe('CheckDesktopService', () => {
  let service: CheckDesktopService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckDesktopService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
