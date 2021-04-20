import { Meal } from './meal.interface';
import { Training } from './training.interface';

export interface DailySummary {
  id: number;
  trainings: Training[];
  meals: Meal[];
  day: string;
  user: string;
  calories_eaten: number;
  calories_burned: number;
}
