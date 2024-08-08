import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListRequestModeVM, RequestModeVM } from '../Models/requestModeVM';
@Injectable({
  providedIn: 'root'
})
export class RequestModeService {

  constructor(private httpClient: HttpClient) { }
  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'
    })
  };
  GetAllRequetsMode(): Observable<ListRequestModeVM[]> {
    return this.httpClient.get<ListRequestModeVM[]>(`${environment.RequestModes}`, this.httpHeader);
  }
  AddReqMode(reqMode): Observable<RequestModeVM> {
    return this.httpClient.post<RequestModeVM>(`${environment.RequestModes}`, reqMode, this.httpHeader);
  }
}
