import { NotifyService } from './notify.service';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from "@angular/router/testing";
import { AuthService } from './auth.service';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClient } from '@angular/common/http';
import { urls } from 'src/environments/environment';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let routerSpy = {navigate: jasmine.createSpy('navigate')};
  let notifySpy = {notify_user: jasmine.createSpy('notify_user')};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatSnackBarModule,
        BrowserAnimationsModule,
        NoopAnimationsModule
      ],
      providers: [
        AuthService,
        {provide: Router, useValue: routerSpy},
        {provide: NotifyService, useValue: notifySpy}
      ]
    });
    service = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  });

  afterEach(() => {
    httpTestingController.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login user and redirect', () => {
    const data = {username: "root", password: "root"};
    service.login(data);
    // example response for root login
    const response = {"token":"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InJvb3QiLCJleHAiOjE2MTkyNjY0NTksImVtYWlsIjoiIiwib3JpZ19pYXQiOjE2MTg2NjE2NTl9.i7qnXsn387kD2WiEh_w-xw9Yueat46KN5KHuk2uaiY0"};
    const req = httpTestingController.expectOne(urls.login);
    expect(req.request.method).toBe("POST");
    req.flush(response);
    expect(service.getUsername()).toEqual("root");
    expect(notifySpy.notify_user).toHaveBeenCalledWith('Successfully logged in.');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['dashboard']);
  });

  it('should logout user and redirect', () => {
    service.logout();
    expect(service.getToken()).toEqual("");
    expect(notifySpy.notify_user).toHaveBeenCalledWith('Successfully logged out.');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['home']);
  });

});
