import { TestBed } from '@angular/core/testing';

import { DailysummaryService } from './dailysummary.service';

describe('DailysummaryService', () => {
  let service: DailysummaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DailysummaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
