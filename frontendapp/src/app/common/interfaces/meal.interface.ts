import { MatTableDataSource } from '@angular/material/table';
import { MealComponent } from './mealcomponent.interface';

export interface Meal{
  id: number;
  name: string;
  user: string;
  day: string;
  meal_components: Array<MealComponent> | MatTableDataSource<MealComponent>;
}
