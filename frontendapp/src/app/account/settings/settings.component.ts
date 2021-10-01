import { BMR } from './../../common/interfaces/bmr.interface';
import { NotifyService } from './../../common/services/notify.service';
import { BmrService } from './../services/bmr.service';
import { SettingsService } from './../services/settings.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from 'src/app/common/services/auth.service';
import { MatAccordion } from '@angular/material/expansion';
import { FormControl, FormGroup } from '@angular/forms';
import { User } from 'src/app/common/interfaces/user.interface';
import { urls } from 'src/environments/environment';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  userId: string = null;

  bmr: BMR;
  user: User;

  passwordForm = new FormGroup({
    password: new FormControl(''),
    password2: new FormControl('')
  });

  bmrForm = new FormGroup({
    fat: new FormControl(null),
    protein: new FormControl(null),
    carbohydrate: new FormControl(null)
  });

  constructor(
    private authService: AuthService,
    private settingsService: SettingsService,
    private bmrService: BmrService,
    private notifyService: NotifyService
  ) { }

  ngOnInit(): void {
    this.userId = this.authService.getUserId();
    this.getData();
  }

  onChangePassword() {
    const data = this.passwordForm.value;
    if (this.passwordForm.valid && data.password === data.password2){
      delete data.password2;
      data.password = this.passwordForm.controls.password.value;
      data.username = this.user.username;
      data.email = this.user.email;
      this.authService.changePassword(this.userId + '/', JSON.stringify(data)).subscribe(response => {
        this.notifyService.notify_user("Successfully updated");
      });
    }
    else {
      this.notifyService.notify_user('Not valid form. Please try again.');
    }
  }

  onUpdateBMR() {
    const data = this.bmrForm.value;
    if (this.bmrForm.valid){
      data.user = this.userId;
      data.calories = 9*this.bmrForm.controls.fat.value + 4*this.bmrForm.controls.carbohydrate.value + 4*this.bmrForm.controls.protein.value;
      this.bmrService.putBMR(this.userId + '/', JSON.stringify(data)).subscribe(response => {
        this.notifyService.notify_user("Successfully updated");
      });
      this.getData();
    }
    else {
      this.notifyService.notify_user('Not valid form. Please try again.');
    }
  }

  getData() {
    this.settingsService.getUserData(urls.user + this.userId).subscribe(response => {
      this.user = response;
    })
    this.bmrService.getBMR(urls.bmrs, {user: this.userId}).subscribe(response => {
      this.bmr = response[0];
    })
  }

}
