import { ActivityService } from './../activities/activity.service';
import { NotifyService } from './../../common/services/notify.service';
import { TrainingService } from './training.service';
import { AuthService } from './../../common/services/auth.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { urls } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { Training } from 'src/app/common/interfaces/training.interface';
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, FormGroup, Validators } from '@angular/forms';

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
export class TrainingsComponent implements OnInit, AfterViewInit {
  date: string;
  user: string;
  today = new Date();
  public displayedColumns: string[] = ['day', 'activity', 'duration', 'delete'];
  public dataSource = new MatTableDataSource<Training>();
  public trainings = new Array();
  public activities = new Array();

  form = new FormGroup({
    day: new FormControl('', [Validators.required]),
    activity: new FormControl('', [Validators.required]),
    duration: new FormControl('', [Validators.required, Validators.min(0), Validators.max(1440)])
  });

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private authService: AuthService,
    private notifyService: NotifyService,
    private trainingService: TrainingService,
    private activityService: ActivityService,
    private datePipe: DatePipe) {
      this.date = this.datePipe.transform(this.today, 'yyyy-MM-dd');
      this.user = this.authService.getUserId();
    }

  ngOnInit(): void {
    this.activityService.getData(urls.activities).subscribe( data => {
      this.activities = data;
    });
    this.date = this.datePipe.transform(this.date, 'yyyy-MM-dd');
    this.user = this.authService.getUserId();
    this.getTrainings();
  }

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
  }

  getTrainings(){
    this.trainingService.getData(urls.trainings, {day: this.date, user: this.user}).subscribe(response => {
      this.trainings = response;
      this.dataSource.data = this.trainings;
    });
  }

  dayChanged(event){
    this.date = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    this.notifyService.notify_user('Day changed to ' + this.date);
    this.getTrainings();
  }

  deleteTraining(training){
    this.trainingService.deleteTraining(training.id).subscribe(response => {
      this.notifyService.notify_user('Training removed!');
      this.getTrainings();
    });
  }

  addTraining($event){
    const data = this.form.value;
    if (this.form.valid){
      data.day = this.datePipe.transform(data.day, 'yyyy-MM-dd');
      data.user = this.authService.getUserId();
      this.trainingService.addTraining(JSON.stringify(data)).subscribe(response => {
        this.notifyService.notify_user('Training added successfully.');
        this.getTrainings();
      });
    }
    else{
      this.notifyService.notify_user('Not valid form. Please try again.');
    }
  }

}
