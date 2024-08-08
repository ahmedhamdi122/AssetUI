import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListVisitTypeVM } from '../Models/visitTypeVM';

@Injectable({
  providedIn: 'root'
})

export class VisitTypeService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetAllVisitTypes(): Observable<ListVisitTypeVM[]> {
    return this.httpClient.get<ListVisitTypeVM[]>(`${environment.GetAllVisitTypes}`, this.httpHeader);
  }

}
