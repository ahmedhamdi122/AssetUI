import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateHospitalExecludeReasonVM, EditHospitalExecludeReasonVM, ListHospitalExecludeReasonVM } from '../Models/HospitalExecludeReasonVM';


@Injectable({
  providedIn: 'root'
})

export class HospitalExecludeReasonService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetHospitalExecludeReasons(): Observable<ListHospitalExecludeReasonVM[]> {
    return this.httpClient.get<ListHospitalExecludeReasonVM[]>(`${environment.ListHospitalExcludeReasons}`, this.httpHeader);
  }

  GetHospitalExecludeReasonById(id: number): Observable<EditHospitalExecludeReasonVM> {
    return this.httpClient.get<EditHospitalExecludeReasonVM>(`${environment.GetHospitalExecludeReasonById}${id}`, this.httpHeader);
  }
  CreateHospitalExecludeReason(HospitalExecludeReasonVM: CreateHospitalExecludeReasonVM): Observable<CreateHospitalExecludeReasonVM> {
    return this.httpClient.post<any>(`${environment.AddHospitalExecludeReason}`, HospitalExecludeReasonVM, this.httpHeader);
  }


  UpdateHospitalExecludeReason(HospitalExecludeReasonObj: EditHospitalExecludeReasonVM): Observable<EditHospitalExecludeReasonVM> {
    return this.httpClient.put<EditHospitalExecludeReasonVM>(`${environment.UpdateHospitalExecludeReason}`, HospitalExecludeReasonObj, this.httpHeader);
  }

  DeleteHospitalExecludeReason(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteHospitalExecludeReason}${id}`, this.httpHeader);
  }

}
