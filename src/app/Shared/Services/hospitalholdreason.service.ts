import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateHospitalHoldReasonVM, EditHospitalHoldReasonVM, ListHospitalHoldReasonVM } from '../Models/HospitalHoldReasonVM';


@Injectable({
  providedIn: 'root'
})

export class HospitalHoldReasonService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetHospitalHoldReasons(): Observable<ListHospitalHoldReasonVM[]> {
    return this.httpClient.get<ListHospitalHoldReasonVM[]>(`${environment.ListHospitalHoldReasons}`, this.httpHeader);
  }

  GetHospitalHoldReasonById(id: number): Observable<EditHospitalHoldReasonVM> {
    return this.httpClient.get<EditHospitalHoldReasonVM>(`${environment.GetHospitalHoldReasonById}${id}`, this.httpHeader);
  }
  CreateHospitalHoldReason(HospitalHoldReasonVM: CreateHospitalHoldReasonVM): Observable<CreateHospitalHoldReasonVM> {
    return this.httpClient.post<any>(`${environment.AddHospitalHoldReason}`, HospitalHoldReasonVM, this.httpHeader);
  }


  UpdateHospitalHoldReason(HospitalHoldReasonObj: EditHospitalHoldReasonVM): Observable<EditHospitalHoldReasonVM> {
    return this.httpClient.put<EditHospitalHoldReasonVM>(`${environment.UpdateHospitalHoldReason}`, HospitalHoldReasonObj, this.httpHeader);
  }

  DeleteHospitalHoldReason(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteHospitalHoldReason}${id}`, this.httpHeader);
  }

}
