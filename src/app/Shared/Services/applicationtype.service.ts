import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListApplicationTypeVM } from '../Models/applicationtype';


@Injectable({
  providedIn: 'root'
})

export class ApplicationTypeService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetApplicationTypes(): Observable<ListApplicationTypeVM[]> {
    return this.httpClient.get<ListApplicationTypeVM[]>(`${environment.ListApplicationTypes}`, this.httpHeader);
  }

}
