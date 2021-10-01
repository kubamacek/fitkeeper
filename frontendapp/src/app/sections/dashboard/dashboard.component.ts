import { BmrService } from './../../account/services/bmr.service';
import { DailysummaryService } from './dailysummary.service';
import { NotifyService } from './../../common/services/notify.service';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/common/services/auth.service';
import { DatePipe } from '@angular/common';
import { urls } from 'src/environments/environment';
import { Training } from 'src/app/common/interfaces/training.interface';
import { Meal } from 'src/app/common/interfaces/meal.interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [
    NotifyService,
    DatePipe,
    DailysummaryService
  ]
})
export class DashboardComponent implements OnInit {

  date: string;
  user: string;
  caloriesEaten: number = null;
  caloriesBurned: number = null;
  caloriesToEat: number = null;
  trainings: Array<Training> = [];
  meals: Array<Meal> = [];
  today = new Date();
  public dailysummaries = new Array();

  constructor(
    private authService: AuthService,
    private notifyService: NotifyService,
    private dailySummaryService: DailysummaryService,
    private bmrService: BmrService,
    private datePipe: DatePipe) {
    this.date = this.datePipe.transform(this.today, 'yyyy-MM-dd');
    this.user = this.authService.getUserId();
  }

  ngOnInit(): void {
    this.date = this.datePipe.transform(this.date, 'yyyy-MM-dd');
    this.user = this.authService.getUserId();
    this.getData();
  }

  getData() {
    this.dailySummaryService.getData(urls.dailysummaries, { day: this.date, user: this.user }).subscribe(response => {
      this.dailysummaries = response;
      this.caloriesBurned = this.dailysummaries[0] ? this.dailysummaries[0].calories_burned : 0;
      this.caloriesEaten = this.dailysummaries[0] ? this.dailysummaries[0].calories_eaten : 0;
      this.trainings = this.dailysummaries[0] ? this.dailysummaries[0].trainings : [];
      this.meals = this.dailysummaries[0] ? this.dailysummaries[0].meals : [];
    });
    this.bmrService.getBMR(urls.bmrs, {user: this.user}).subscribe(response => {
      this.caloriesToEat = response[0]['calories'];
    });
  }

  dayChanged(event){
    this.date = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    this.notifyService.notify_user('Day changed to ' + this.date);
    this.getData();
  }
}
