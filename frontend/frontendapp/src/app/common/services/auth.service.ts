import { NotifyService } from './notify.service';
import { urls } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpOptions: any;
  private token: string = null;
  public tokenExpires: Date;
  private username: string = null;
  private user_id: string = null;
  public errors: any[] = [];

  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private notifyService: NotifyService
  ) {
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    }
  }

  login(User) {
    return this.httpClient.post(urls.login, JSON.stringify(User), this.httpOptions).subscribe(
      data => {
        this.updateData(data['token'])
        this.notifyService.notify_user("Successfully logged in.");
        this.router.navigate(['dashboard']);
      },
      err => {
        this.notifyService.notify_user("Something went wrong.");
        this.errors = err['error'];
      }
    )
  }

  refreshToken() {
  	this.httpClient.post(urls.refresh, JSON.stringify({token: this.token}), this.httpOptions)
  		.subscribe(
  			data => {
  				this.updateData(data['token']);
  			},
  			err => {
  				this.errors = err['error'];
  			}
  		)
  }

  logout() {
  	this.token = null;
  	this.tokenExpires = null;
  	this.username = null;
    this.notifyService.notify_user("Successfully logged out.");
    this.router.navigate(['home']);
  }

  updateData(token): void {
    this.token = token;
    this.errors = [];

    const tokenParts = this.token.split(/\./);
    const tokenDecoded = JSON.parse(window.atob(tokenParts[1]));
    //console.log(tokenDecoded);

    this.tokenExpires = new Date(tokenDecoded * 1000);
    this.username = tokenDecoded.username;
    this.user_id = tokenDecoded.user_id;
  }

  isAuthenticated(): boolean {
    return ![this.token].includes(null);
  }

  getUsername(): string {
    return this.username ? this.username : '';
  }

  getUserId(): string {
    return this.user_id.toString() ? this.user_id : '';
  }

}
