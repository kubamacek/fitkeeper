import { FoodService } from './food.service';
import { Component, OnInit } from '@angular/core';
import { Ingredient } from 'src/app/common/interfaces/ingredient.interface';
import { urls } from 'src/environments/environment';

@Component({
  selector: 'app-foodbase',
  templateUrl: './foodbase.component.html',
  styleUrls: ['./foodbase.component.css'],
  providers: [
    FoodService
  ]
})
export class FoodbaseComponent implements OnInit {

  ingredients: Ingredient[] = [];

  constructor(private foodService: FoodService) {
  }

  ngOnInit(): void {
    this.foodService.getData(urls.foodbase).subscribe(response => {
      this.ingredients = response.results;
    })
    }
}
