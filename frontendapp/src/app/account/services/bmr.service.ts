import { BMR } from './../../common/interfaces/bmr.interface';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { urls } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BmrService {
  private httpOptions: any;

  constructor(private httpClient: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  }
  getBMR(url: string, filters?: { [name: string]: string }): Observable<BMR[]> {
    return this.httpClient.get<BMR[]>(url, { params: { ...filters } });
  }

  putBMR(id: string, data): Observable<{}>{
    return this.httpClient.put(urls.bmrs + id, data, this.httpOptions);
  }

}
