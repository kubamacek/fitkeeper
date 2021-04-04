import { FoodService } from './../foodbase/food.service';
import { FormArray, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MealService } from './meal.service';
import { DatePipe } from '@angular/common';
import { NotifyService } from './../../common/services/notify.service';
import { ChangeDetectorRef, Component, OnInit, QueryList, ViewChild, ViewChildren, ɵLocaleDataIndex } from '@angular/core';
import { AuthService } from 'src/app/common/services/auth.service';
import { urls } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Ingredient } from 'src/app/common/interfaces/ingredient.interface';
import { map, startWith } from 'rxjs/operators';
import { MealComponent } from 'src/app/common/interfaces/mealcomponent.interface';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Meal } from 'src/app/common/interfaces/meal.interface';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-diet',
  templateUrl: './diet.component.html',
  styleUrls: ['./diet.component.css'],
  providers: [
    NotifyService,
    DatePipe,
    MealService
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ]
})
export class DietComponent implements OnInit {

  @ViewChildren('innerTables') innerTables: QueryList<MatTable<MealComponent>>;

  dataSource = new MatTableDataSource<Meal>();
  columnsToDisplay = ['day', 'name', 'toggle', 'delete'];
  innerDisplayedColumns = ['ingredient', 'weight'];
  expandedElement: Meal | null;

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
    private foodService: FoodService,
    private cd: ChangeDetectorRef
  ) {
  }

  ngOnInit(): void {
    this.date = this.datePipe.transform(this.today, 'yyyy-MM-dd');
    this.user = this.authService.getUserId();
    this.getMeals();
    this.newMealForm = this.formBuilder.group({
      name: this.formBuilder.control(""),
      day: this.formBuilder.control(""),
      meal_components: this.formBuilder.array([], Validators.required)
    })
    this.foodService.getData(urls.foodbase).subscribe(response => {
      this.ingredients = response;
    })
  }

  toggleRow(element: Meal) {
    element.meal_components && (element.meal_components as MatTableDataSource<MealComponent>).data.length ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    this.cd.detectChanges();
  }

  manageNameControl(index: number) {
    let arrayControl = this.newMealForm.get("meal_components") as FormArray;
    this.filteredOptions[index] = arrayControl.at(index).get('ingredient').valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.name),
      map(name => name ? this._filter(name) : this.ingredients.slice())
    );
  }

  getMeals() {
    this.mealService.getData(urls.diet, { day: this.date, user: this.user }).subscribe(response => {
      this.meals = response;
      this.meals.forEach(meal => {
        meal["meal_components"] = new MatTableDataSource(meal["meal_components"]);
      })
      this.dataSource.data = this.meals;
    })

  }

  dayChanged(event) {
    this.date = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    this.notifyService.notify_user("Day changed to " + this.date);
    this.getMeals();
  }

  addMealComponentFormGroup(): FormGroup {
    return this.formBuilder.group({
      ingredient: ["", Validators.required],
      weight: ["", Validators.required]
    });
  }

  addMealComponentButtonClick(): void {
    let controls = <FormArray>this.newMealForm.get('meal_components');
    controls.push(this.addMealComponentFormGroup());
    this.manageNameControl(controls.length - 1);
  }

  removeMealComponentButtonClick(index: number): void {
    (<FormArray>this.newMealForm.get("meal_components")).removeAt(index);
  }

  addMeal() {
    if (this.newMealForm.valid) {
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
    else {
      this.notifyService.notify_user("Not valid form. Please try again.");
    }
  }

  deleteMeal(meal){
    this.mealService.deleteMeal(meal.id).subscribe(response => {
      this.notifyService.notify_user("Meal removed!");
      this.getMeals();
    })
  }

  displayFn(ingredient: Ingredient): string {
    return ingredient ? ingredient.name : '';
  }

  private _filter(name: string): Ingredient[] {
    const filterValue = name.toLowerCase();
    return this.ingredients.filter(option => option.name.toLowerCase().indexOf(filterValue) === 0);
  }

}
