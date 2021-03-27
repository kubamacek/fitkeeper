import { AuthService } from './../../common/services/auth.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() public sidenavToggle = new EventEmitter();

  title: string = 'fitkeeper';
  user: string;

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.user = this.authService.getUsername();
  }

  public onToggleSidenav = () => {
    this.sidenavToggle.emit();
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  logout(){
    this.authService.logout();
  }

}
