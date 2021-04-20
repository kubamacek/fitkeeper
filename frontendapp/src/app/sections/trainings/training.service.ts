import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Training } from 'src/app/common/interfaces/training.interface';
import { urls } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TrainingService {
  private httpOptions: any;

  constructor(private httpClient: HttpClient) {
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })}
   }

  getData(url: string, filters?: {[name: string]: string}): Observable<Training[]> {
    return this.httpClient.get<Training[]>(url, {params: {...filters}});
  }

  deleteTraining(id: string): Observable<{}>{
    return this.httpClient.delete(urls.trainings + id, this.httpOptions);
  }

  addTraining(data): Observable<{}>{
    return this.httpClient.post(urls.trainings, data, this.httpOptions);
  }
}
