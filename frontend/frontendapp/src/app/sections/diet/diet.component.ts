import { FoodService } from './../foodbase/food.service';
import { FormArray, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MealService } from './meal.service';
import { DatePipe } from '@angular/common';
import { NotifyService } from './../../common/services/notify.service';
import { Component, OnInit, ɵLocaleDataIndex } from '@angular/core';
import { AuthService } from 'src/app/common/services/auth.service';
import { urls } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Ingredient } from 'src/app/common/interfaces/ingredient.interface';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-diet',
  templateUrl: './diet.component.html',
  styleUrls: ['./diet.component.css'],
  providers: [
    NotifyService,
    DatePipe,
    MealService
  ]
})
export class DietComponent implements OnInit {

  date: string;
  user: string;
  today = new Date();

  public meals = new Array();
  public ingredients = new Array();
  filteredOptions: Observable<Ingredient[]>[] = [];
  newMealForm: FormGroup;

  constructor(
    private authService: AuthService,
    private notifyService: NotifyService,
    private datePipe: DatePipe,
    private mealService: MealService,
    private formBuilder: FormBuilder,
    private foodService: FoodService
  ) {
    this.date = this.datePipe.transform(this.today, 'yyyy-MM-dd');
    this.user = this.authService.getUserId();
   }

  ngOnInit(): void {
    this.newMealForm = this.formBuilder.group({
      name: this.formBuilder.control(""),
      day: this.formBuilder.control(""),
      meal_components: this.formBuilder.array([], Validators.required)
    })
    this.foodService.getData(urls.foodbase).subscribe(response => {
      this.ingredients = response;
    })
   }

  manageNameControl(index: number){
    let arrayControl = this.newMealForm.get("meal_components") as FormArray;
    this.filteredOptions[index] = arrayControl.at(index).get('ingredient').valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter(name) : this.ingredients.slice())
    );
  }

  getMeals(){
    this.mealService.getData(urls.diet, {day: this.date, user: this.user}).subscribe(response => {
      this.meals = response;
      console.log(this.meals);
    })
  }

  dayChanged(event){
    this.date = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    this.notifyService.notify_user("Day changed to " + this.date);
    this.getMeals();
  }

  addMealComponentFormGroup(): FormGroup{
    return this.formBuilder.group({
      ingredient: ["", Validators.required],
      weight: ["", Validators.required]
    });
  }

  addMealComponentButtonClick(): void {
    let controls = <FormArray>this.newMealForm.get('meal_components');
    controls.push(this.addMealComponentFormGroup());
    this.manageNameControl(controls.length -1);
  }

  removeMealComponentButtonClick(index: number): void {
    (<FormArray>this.newMealForm.get("meal_components")).removeAt(index);
  }

  addMeal(){
    if (this.newMealForm.valid){
      let data = this.newMealForm.value;
      data["meal_components"].forEach(element => {
        element["ingredient"] = element["ingredient"]["id"]
      });
      data["user"] = this.authService.getUserId();
      data["day"] = this.datePipe.transform(data["day"], 'yyyy-MM-dd');
      this.mealService.addMeal(JSON.stringify(data)).subscribe(response => {
        this.notifyService.notify_user("Meal added successfully.");
        this.getMeals();
      })
    }
    else{
      this.notifyService.notify_user("Not valid form. Please try again.");
    }
  }

  displayFn(ingredient: Ingredient): string {
    return ingredient ? ingredient.name : '';
  }

  private _filter(name: string): Ingredient[] {
    const filterValue = name.toLowerCase();
    return this.ingredients.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

}
