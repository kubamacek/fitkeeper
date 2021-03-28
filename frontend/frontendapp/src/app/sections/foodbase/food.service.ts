import { Ingredient } from './../../common/interfaces/ingredient.interface';
import { Response } from './../../common/interfaces/response.interface';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { urls } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class FoodService {

  constructor(private _http: HttpClient) { }

  getData(url: string): Observable<Ingredient[]> {
    return this._http.get<Ingredient[]>(url);
  }
}
