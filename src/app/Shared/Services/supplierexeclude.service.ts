import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { SupplierExecludeVM } from '../Models/supplierExecludeVM';


@Injectable({
  providedIn: 'root'
})

export class SupplierExecludeService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  CreateSupplierExeclude(supplierExecludeObj: SupplierExecludeVM): Observable<number> {
    return this.httpClient.post<any>(`${environment.AddSupplierExeclude}`, supplierExecludeObj, this.httpHeader);
  }


  GetById(id: number): Observable<SupplierExecludeVM> {
    return this.httpClient.get<SupplierExecludeVM>(`${environment.GetSupplierExecludeById}${id}`, this.httpHeader);
  }


}
