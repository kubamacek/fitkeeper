import { AuthService } from 'src/app/common/services/auth.service';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  @Output() sidenavClose = new EventEmitter();

  constructor(
    private authService: AuthService
  ) { }

  ngOnInit() {
  }

  public onSidenavClose = () => {
    this.sidenavClose.emit();
  }

  isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  logout(){
    this.authService.logout();
  }

}
