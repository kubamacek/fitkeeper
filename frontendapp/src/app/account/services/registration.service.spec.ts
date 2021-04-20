import { HttpClient, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { User } from 'src/app/common/interfaces/user.interface';
import { urls } from 'src/environments/environment';

import { RegistrationService } from './registration.service';

describe('RegistrationService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let service: RegistrationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });
    service = TestBed.inject(RegistrationService);
    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should register user and return it', () => {
    const newUser: User = {username: "paul", password: "paul", email: "paul@paul.com"};
    service.register(newUser).subscribe(
      data => expect(data).toEqual(newUser, 'should return new user'),
      fail
    );
    const request = httpTestingController.expectOne(urls.user);
    expect(request.request.method).toEqual('POST');
    expect(request.request.body).toEqual(newUser);
    const expectedResponse = new HttpResponse({ status: 201, statusText: 'Created', body: newUser });
    request.event(expectedResponse);
  });
});
