import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListRequestPeriority, RequestPeriority } from '../Models/RequestPeriorityVM';
@Injectable({
  providedIn: 'root'
})
export class RequestPeriorityService {

  constructor(private httpClient: HttpClient) { }
  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'
    })
  };

  GetAllRequestPeriorties(): Observable<ListRequestPeriority[]> {
    return this.httpClient.get<ListRequestPeriority[]>(`${environment.RequestPeriorities}`, this.httpHeader);
  }
  inserRequestPeriority(reqPeriorty: RequestPeriority): Observable<any> {
    return this.httpClient.post<any>(`${environment.RequestPeriorities}`, reqPeriorty, this.httpHeader);
  }
}
