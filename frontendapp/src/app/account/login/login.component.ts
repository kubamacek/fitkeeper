import { AuthService } from './../../common/services/auth.service';
import { Component, OnInit, Inject } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  form = new FormGroup({
    username: new FormControl(''),
    password: new FormControl('')
  });

  constructor(
    private authService: AuthService
  ) {}

  onSubmit() {
    this.authService.login({username: this.form.get('username').value, password: this.form.get('password').value});
  }
}
