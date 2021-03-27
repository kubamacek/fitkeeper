import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/common/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: string;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getUsername();
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

}
