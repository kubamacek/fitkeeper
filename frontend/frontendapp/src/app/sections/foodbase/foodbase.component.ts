import { FoodService } from './food.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { Ingredient } from 'src/app/common/interfaces/ingredient.interface';
import { urls } from 'src/environments/environment';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-foodbase',
  templateUrl: './foodbase.component.html',
  styleUrls: ['./foodbase.component.css'],
  providers: [
    FoodService
  ]
})
export class FoodbaseComponent implements OnInit, AfterViewInit {

  public displayedColumns: string[] = ['id', 'name', 'energy', 'fat', 'protein', 'carbohydrate'];
  public dataSource = new MatTableDataSource<Ingredient>();
  public ingredients = new Array();

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private foodService: FoodService) { }

  ngOnInit(): void {
    this.foodService.getData(urls.foodbase).subscribe(response => {
      console.log(response);
      this.ingredients = response
      this.dataSource.data = this.ingredients;
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
