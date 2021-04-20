import { AuthService } from './../../common/services/auth.service';
import { Component, OnInit, Inject } from '@angular/core';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {

  username: string;
  password: string;

  constructor(
    private AuthService: AuthService
  ) {}

  onSubmit() {
    this.AuthService.login({'username': this.username, 'password': this.password})
  }
}
