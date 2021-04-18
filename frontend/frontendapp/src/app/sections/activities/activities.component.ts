import { ActivityService } from './activity.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { urls } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Activity } from 'src/app/common/interfaces/activity.interface';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css'],
  providers: [ ActivityService ]
})
export class ActivitiesComponent implements OnInit, AfterViewInit {

  public displayedColumns: string[] = ['id', 'name', 'calories_burned'];
  public dataSource = new MatTableDataSource<Activity>();
  public activities = new Array();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(public activityService: ActivityService) { }

  ngOnInit(): void {
    this.activityService.getData(urls.activities).subscribe(response => {
      this.activities = response
      this.dataSource.data = this.activities;
   })
  }

  ngAfterViewInit(){
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event){
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator){
      this.dataSource.paginator.firstPage();
    }
  }

}
