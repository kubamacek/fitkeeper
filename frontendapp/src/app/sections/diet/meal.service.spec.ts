import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { urls } from 'src/environments/environment';
import { MealService } from './meal.service';

describe('MealService', () => {
  let service: MealService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(MealService);
    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get meals', () => {
    const data = [
      {
        id: 5,
        name: 'single banana',
        day: '2020-03-10',
        meal_components: [
          {
            id: 5,
            weight: 120,
            ingredient: 'banana'
          },
          {
            id: 6,
            weight: 200,
            ingredient: 'milk'
          }
        ],
        user: 'root'
      }
    ];
    service.getData(urls.diet, { day: '2020-03-10', user: '1' }).subscribe((response: Array<any>) => {
      expect(response).toEqual(data);
    });
    const req = httpTestingController.expectOne(urls.diet + '?day=2020-03-10&user=1');
    expect(req.request.method).toBe('GET');
    req.flush(data);
  });

  it('should add meal', () => {
    const data = {
      user: 1,
      day: '2020-03-10',
      name: 'single banana',
      meal_components: [{
        weight: 120,
        ingredient: 1
      }]
    };
    const response = {
      id: 3,
      user: 1,
      day: '2020-03-10',
      name: 'single banana',
      meal_components: [{
        weight: 120,
        ingredient: 1
      }]
    };
    service.addMeal(data).subscribe(res => {
      expect(res).toEqual(response);
    });
    const req = httpTestingController.expectOne(urls.diet);
    expect(req.request.method).toBe('POST');
    req.flush(response);
  });

  it('should delete meal', () => {
    service.deleteMeal('3').subscribe(res => {
      expect(res).toBeNull();
    });
    const req = httpTestingController.expectOne(urls.diet + '3');
    expect(req.request.method).toBe('DELETE');
    const response = { status: 204, statusText: 'No Content' };
    req.flush(null, response);
  });
});
