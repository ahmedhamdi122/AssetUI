import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateHospitalApplicationAttachmentVM, CreateHospitalApplicationVM, EditHospitalApplicationVM, HospitalApplicationAttachmentVM, ListHospitalApplicationVM, SortHospitalAppVM }
  from '../Models/HospitalApplicationVM';
import { Paging } from '../Models/paging';
import { HospitalApplicationTransactionVM, ListHospitalApplicationTransactionVM } from '../Models/hospitalApplicationTransactionVM';


@Injectable({
  providedIn: 'root'
})

export class HospitalApplicationTransactionService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };


  CreateHospitalTransaction(transObj: HospitalApplicationTransactionVM): Observable<any> {
    return this.httpClient.post<any>(`${environment.AddHospitalReasonTransaction}`, transObj, this.httpHeader);
  }
  GetAttachmentsByApplicationId(appId: number): Observable<ListHospitalApplicationTransactionVM[]> {
    return this.httpClient.get<ListHospitalApplicationTransactionVM[]>(`${environment.GetHospitalTransAttachments}${appId}`, this.httpHeader);
  }

}
