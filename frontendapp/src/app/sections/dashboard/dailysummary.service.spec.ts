import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { urls } from 'src/environments/environment';

import { DailysummaryService } from './dailysummary.service';

describe('DailysummaryService', () => {
  let service: DailysummaryService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(DailysummaryService);
    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get summary', () => {
    const data = {
      id: 7,
      trainings: [
        {
          id: 19,
          day: '2021-04-04',
          duration: 12,
          user: 'root',
          activity: 'running'
        },
        {
          id: 20,
          day: '2021-04-04',
          duration: 120,
          user: 'root',
          activity: 'swimming'
        }
      ],
      meals: [
        {
          id: 13,
          name: 'hotdog',
          day: '2021-04-04',
          meal_components: [
            {
              id: 21,
              weight: 12,
              ingredient: 'flour'
            },
            {
              id: 22,
              weight: 122,
              ingredient: 'milk'
            }
          ],
          user: 'root'
        }
      ],
      calories_eaten: 3087,
      calories_burned: 1330,
      day: '2021-04-04',
      user: 1
    };
    service.getData(urls.dailysummaries, { day: '2021-04-04', user: '1' }).subscribe((response: any) => {
      expect(response).toEqual(data);
    });
    const req = httpTestingController.expectOne(urls.dailysummaries + '?day=2021-04-04&user=1');
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });
});
