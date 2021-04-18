import { NotifyService } from './../../common/services/notify.service';
import { RegistrationService } from './../services/registration.service';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationComponent } from './registration.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { Observable, of } from 'rxjs';
import { Router } from '@angular/router';

describe('RegistrationComponent', () => {
  let component: RegistrationComponent;
  let fixture: ComponentFixture<RegistrationComponent>;
  let registerSpy = {register: jasmine.createSpy('register')};
  let notifySpy = {notify_user: jasmine.createSpy('notify_user')};
  let routerSpy = {navigate: jasmine.createSpy('navigate')};

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        MatSnackBarModule,
        MatFormFieldModule,
        MatCardModule,
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
        FormsModule
      ],
      declarations: [ RegistrationComponent ],
      providers: [
        {provide: RegistrationService, useValue: registerSpy},
        {provide: NotifyService, useValue: notifySpy},
        {provide: Router, useValue: routerSpy},
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    notifySpy.notify_user.calls.reset();
    fixture = TestBed.createComponent(RegistrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a register header', () => {
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Register');
  });

  it('should call register method', () => {
    registerSpy.register.and.returnValue(of([]));
    component.form.controls['username'].setValue('root');
    component.form.controls['email'].setValue('root@root.com');
    component.form.controls['password'].setValue('root1');
    component.form.controls['password2'].setValue('root1');
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    expect(registerSpy.register).toHaveBeenCalledOnceWith({'username': 'root', 'email': 'root@root.com', 'password': 'root1'});
    expect(notifySpy.notify_user).toHaveBeenCalledOnceWith('Successfully registered. You can log in now.');
    expect(routerSpy.navigate).toHaveBeenCalledWith(['login']);
  });

  it('should point not valid form', () => {
    component.form.controls['username'].setValue('root');
    component.form.controls['email'].setValue('root@root.com');
    component.form.controls['password'].setValue('root1');
    component.form.controls['password2'].setValue('root2');
    fixture.debugElement.query(By.css('form')).triggerEventHandler('ngSubmit', null);
    expect(notifySpy.notify_user).toHaveBeenCalledOnceWith('Form is not valid. Please try again.');
  });
});
