import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { urls } from 'src/environments/environment';

import { FoodService } from './food.service';

describe('FoodService', () => {
  let service: FoodService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(FoodService);
    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get food', () => {
    const data = [
      {"id": 1, "name": "banana", "energy": 120, "fat": 3.00, "protein": 4.00, "carbohydrate": 6.00}
      ,
      {"id": 2, "name": "apple", "energy": 120, "fat": 3.00, "protein": 4.00, "carbohydrate": 6.00}
    ]
    service.getData(urls.foodbase).subscribe((response) => {
      expect(response).toEqual(data);
    })
    const req = httpTestingController.expectOne(urls.foodbase);
    expect(req.request.method).toBe("GET");
    req.flush(data);
  })
});
