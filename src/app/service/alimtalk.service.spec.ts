import { TestBed } from '@angular/core/testing';

import { AlimtalkService } from './alimtalk.service';

describe('AlimtalkService', () => {
  let service: AlimtalkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlimtalkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
