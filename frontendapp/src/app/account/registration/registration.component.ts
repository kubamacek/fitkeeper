import { NotifyService } from './../../common/services/notify.service';
import { RegistrationService } from './../services/registration.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { urls } from 'src/environments/environment';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {
  form = new FormGroup({
    username: new FormControl(''),
    email: new FormControl(''),
    password: new FormControl(''),
    password2: new FormControl('')
  })

  constructor(
    private router: Router,
    private registrationService: RegistrationService,
    private notifyService: NotifyService
  ) { }

  ngOnInit(): void {
  }

  signUp(event) {
    const data = this.form.value;
    if (this.form.valid && data.password === data.password2) {
      delete data['password2'];
      this.registrationService.register(data).subscribe(
        res => {
          this.notifyService.notify_user("Successfully registered. You can log in now.");
          this.router.navigate(['login']);
        },
      );
    }
    else{
      this.notifyService.notify_user("Form is not valid. Please try again.");
    }
  }
}
