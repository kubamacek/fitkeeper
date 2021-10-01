import { BMR } from './../../common/interfaces/bmr.interface';
import { User } from './../../common/interfaces/user.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private httpClient: HttpClient) { }

  getUserData(url: string, filters?: { [name: string]: string }): Observable<User> {
    return this.httpClient.get<User>(url, { params: { ...filters } });
  }

  getBMRData(url: string, filters?: { [name: string]: string }): Observable<BMR[]> {
    return this.httpClient.get<BMR[]>(url, { params: { ...filters } });
  }
}
