import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { urls } from 'src/environments/environment';
import { TrainingService } from './training.service';

describe('TrainingService', () => {
  let service: TrainingService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(TrainingService);
    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get trainings', () => {
    const data = [
      {"id": 13, "day": "2021-04-03", "duration": 14, "user": "root", "activity": "swimming"},
      {"id": 14, "day": "2021-04-03", "duration": 15, "user": "root", "activity": "running"}
    ]
    service.getData(urls.trainings, { day: '2020-04-03', user: '1' }).subscribe((response) => {
      expect(response).toEqual(data);
    })
    const req = httpTestingController.expectOne(urls.trainings + '?day=2020-04-03&user=1');
    expect(req.request.method).toBe("GET");
    req.flush(data);
  });

  it('should add training', () => {
    const data = {"day": "2021-04-03", "duration": 60, "user": 1, "activity": "swimming"}
    const response = {"id": 25, "day": "2021-04-03", "duration": 60, "user": 1, "activity": "swimming"}
    service.addTraining(data).subscribe(res => {
      expect(res).toEqual(response);
    });
    const req = httpTestingController.expectOne(urls.trainings);
    expect(req.request.method).toBe("POST");
    req.flush(response);
  });

  it('should delete training', () => {
    service.deleteTraining('3').subscribe(res => {
      expect(res).toBeNull();
    })
    const req = httpTestingController.expectOne(urls.trainings + '3');
    expect(req.request.method).toBe("DELETE");
    const response = { status: 204, statusText: 'No Content' };
    req.flush(null, response);
  });

});
