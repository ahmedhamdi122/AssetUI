import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateSupplierHoldReasonVM, EditSupplierHoldReasonVM, ListSupplierHoldReasonVM } from '../Models/SupplierHoldReasonVM';


@Injectable({
  providedIn: 'root'
})

export class SupplierHoldReasonService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetSupplierHoldReasons(): Observable<ListSupplierHoldReasonVM[]> {
    return this.httpClient.get<ListSupplierHoldReasonVM[]>(`${environment.ListSupplierHoldReasons}`, this.httpHeader);
  }

  GetSupplierHoldReasonById(id: number): Observable<EditSupplierHoldReasonVM> {
    return this.httpClient.get<EditSupplierHoldReasonVM>(`${environment.GetSupplierHoldReasonById}${id}`, this.httpHeader);
  }
  CreateSupplierHoldReason(SupplierHoldReasonVM: CreateSupplierHoldReasonVM): Observable<CreateSupplierHoldReasonVM> {
    return this.httpClient.post<any>(`${environment.AddSupplierHoldReason}`, SupplierHoldReasonVM, this.httpHeader);
  }


  UpdateSupplierHoldReason(SupplierHoldReasonObj: EditSupplierHoldReasonVM): Observable<EditSupplierHoldReasonVM> {
    return this.httpClient.put<EditSupplierHoldReasonVM>(`${environment.UpdateSupplierHoldReason}`, SupplierHoldReasonObj, this.httpHeader);
  }

  DeleteSupplierHoldReason(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteSupplierHoldReason}${id}`, this.httpHeader);
  }

}
