import { Ingredient } from './../../common/interfaces/ingredient.interface';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private http: HttpClient) { }

  getData(url: string): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(url);
  }
}
