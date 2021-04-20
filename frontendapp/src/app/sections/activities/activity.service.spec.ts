import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { urls } from 'src/environments/environment';

import { ActivityService } from './activity.service';

describe('ActivityService', () => {
  let service: ActivityService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(ActivityService);
    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get activities', () => {
    const data = [
      {id: 1, name: 'tennis', calories_burned: 600},
      {id: 2, name: 'dodgeball', calories_burned: 533}
    ];
    service.getData(urls.activities).subscribe((response) => {
      expect(response).toEqual(data);
    });
    const req = httpTestingController.expectOne(urls.activities);
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });
});
