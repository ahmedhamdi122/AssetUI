import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateSupplierExecludeReasonVM, EditSupplierExecludeReasonVM, ListSupplierExecludeReasonVM } from '../Models/SupplierExecludeReasonVM';


@Injectable({
  providedIn: 'root'
})

export class SupplierExecludeReasonService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetSupplierExecludeReasons(): Observable<ListSupplierExecludeReasonVM[]> {
    return this.httpClient.get<ListSupplierExecludeReasonVM[]>(`${environment.ListSupplierExcludeReasons}`, this.httpHeader);
  }

  GetSupplierExecludeReasonById(id: number): Observable<EditSupplierExecludeReasonVM> {
    return this.httpClient.get<EditSupplierExecludeReasonVM>(`${environment.GetSupplierExecludeReasonById}${id}`, this.httpHeader);
  }
  CreateSupplierExecludeReason(SupplierExecludeReasonVM: CreateSupplierExecludeReasonVM): Observable<CreateSupplierExecludeReasonVM> {
    return this.httpClient.post<any>(`${environment.AddSupplierExecludeReason}`, SupplierExecludeReasonVM, this.httpHeader);
  }


  UpdateSupplierExecludeReason(SupplierExecludeReasonObj: EditSupplierExecludeReasonVM): Observable<EditSupplierExecludeReasonVM> {
    return this.httpClient.put<EditSupplierExecludeReasonVM>(`${environment.UpdateSupplierExecludeReason}`, SupplierExecludeReasonObj, this.httpHeader);
  }

  DeleteSupplierExecludeReason(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteSupplierExecludeReason}${id}`, this.httpHeader);
  }

}
