import { TestBed } from '@angular/core/testing';

import { BmrService } from './bmr.service';

describe('BmrService', () => {
  let service: BmrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BmrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
