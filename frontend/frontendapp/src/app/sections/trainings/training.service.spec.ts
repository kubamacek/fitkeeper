import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { TrainingService } from './training.service';

describe('TrainingService', () => {
  let service: TrainingService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(TrainingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
