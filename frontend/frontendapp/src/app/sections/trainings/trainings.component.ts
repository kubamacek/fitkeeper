import { NotifyService } from './../../common/services/notify.service';
import { TrainingService } from './training.service';
import { AuthService } from './../../common/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { urls } from 'src/environments/environment';
import { Input } from '@angular/core';

@Component({
  selector: 'app-trainings',
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.css'],
  providers: [
    NotifyService,
    TrainingService,
    DatePipe
  ]
})
export class TrainingsComponent implements OnInit {
  day: string;
  user: string;
  today = new Date();

  public trainings = new Array();

  constructor(
    private authService: AuthService,
    private notifyService: NotifyService,
    private trainingService: TrainingService,
    private datePipe: DatePipe) {
      this.day = this.datePipe.transform(this.today, 'yyyy-MM-dd');
      this.user = this.authService.getUserId();
     }

  ngOnInit(): void {
    this.day = this.datePipe.transform(this.day, 'yyyy-MM-dd');
    this.user = this.authService.getUserId();
    this.getTrainings();
  }

  getTrainings(){
    this.trainingService.getData(urls.trainings, {day: this.day, user: this.user}).subscribe(response => {
      console.log(response);
      this.trainings = response;
    })
  }

  dayChanged(event){
    this.day = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    this.notifyService.notify_user("Day changed to " + this.day);
    this.getTrainings();
  }

}
