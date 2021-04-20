import { Activity } from './../../common/interfaces/activity.interface';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {

  constructor(private http: HttpClient) { }

  getData(url: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(url);
  }
}
