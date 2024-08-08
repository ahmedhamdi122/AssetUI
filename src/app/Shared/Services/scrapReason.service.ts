import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Paging } from '../Models/paging';
import { ListScrapReasonVM } from '../Models/scrapReasonVM';


@Injectable({
  providedIn: 'root'
})
export class ScrapReasonService {

  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'
    })
  };


  GetAllScrapReasons(): Observable<ListScrapReasonVM[]> {
    return this.httpClient.get<ListScrapReasonVM[]>(`${environment.GetAllScrapReasons}`, this.httpHeader);
  }

}
