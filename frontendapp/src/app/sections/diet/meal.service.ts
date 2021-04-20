import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Meal } from 'src/app/common/interfaces/meal.interface';
import { urls } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MealService {
  private httpOptions: any;

  constructor(private httpClient: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  }

  getData(url: string, filters?: { [name: string]: string }): Observable<Meal[]> {
    return this.httpClient.get<Meal[]>(url, { params: { ...filters } });
  }

  deleteMeal(id: string): Observable<{}> {
    return this.httpClient.delete(urls.diet + id, this.httpOptions);
  }

  addMeal(data): Observable<{}> {
    return this.httpClient.post(urls.diet, data, this.httpOptions);
  }
}
