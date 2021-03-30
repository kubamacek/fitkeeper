import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Training } from 'src/app/common/interfaces/training.interface';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {

  constructor(private httpClient: HttpClient) { }

  getData(url: string, filters?: {[name: string]: string}): Observable<Training[]> {
    return this.httpClient.get<Training[]>(url, {params: {...filters}});
  }
}
