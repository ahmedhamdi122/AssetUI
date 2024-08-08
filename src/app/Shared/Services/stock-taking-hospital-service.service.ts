import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { RelatedHospital } from '../Models/StockTakingScheduleVM';


@Injectable({
  providedIn: 'root'
})
export class StockTakingHospitalServiceService {

  constructor(private httpClient:HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };


  getHospitalsByScheduleId(scheduleId:number):Observable<RelatedHospital[]>
  {
    return this.httpClient.get<RelatedHospital[]>(`${environment.GetHospitalsByScheduleId}/`+scheduleId,this.httpHeader);
  }

}
