import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DailySummary } from 'src/app/common/interfaces/dailysummary.interface';

@Injectable({
  providedIn: 'root'
})
export class DailysummaryService {

  constructor(private httpClient: HttpClient) { }

  getData(url: string, filters?: {[name: string]: string}): Observable<DailySummary[]>{
    return this.httpClient.get<DailySummary[]>(url, {params: {...filters}});
  }
}
