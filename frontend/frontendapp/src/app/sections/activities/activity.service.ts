import { Activity } from './../../common/interfaces/activity.interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(private _http: HttpClient) { }

  getData(url: string): Observable<Activity[]> {
    return this._http.get<Activity[]>(url);
  }
}
