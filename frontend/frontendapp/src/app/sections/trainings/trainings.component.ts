import { NotifyService } from './../../common/services/notify.service';
import { TrainingService } from './training.service';
import { AuthService } from './../../common/services/auth.service';
import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { urls } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { Training } from 'src/app/common/interfaces/training.interface';

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
  public displayedColumns: string[] = ['day', 'activity', 'duration', 'delete'];
  public dataSource = new MatTableDataSource<Training>();
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
      this.trainings = response;
      this.dataSource.data = this.trainings;
    })
  }

  dayChanged(event){
    this.day = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    this.notifyService.notify_user("Day changed to " + this.day);
    this.getTrainings();
  }

  deleteTraining(training){
    this.trainingService.deleteTraining(training.id).subscribe(response => {
      this.notifyService.notify_user("Training removed!");
      this.getTrainings();
    })
  }

}
