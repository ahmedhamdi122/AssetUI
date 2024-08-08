import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateSupplierVM, EditSupplierVM, ListSupplierVM } from '../Models/SupplierVM';
import { ListOriginVM } from '../Models/originVM';
import { ListPMTimeVM } from '../Models/pmTimeVM';


@Injectable({
  providedIn: 'root'
})

export class PMTimeService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetPMTimes(): Observable<ListPMTimeVM[]> {
    return this.httpClient.get<ListPMTimeVM[]>(`${environment.ListPMTimes}`, this.httpHeader);
  }


  // GetSupplierById(id: number): Observable<EditSupplierVM> {
  //   return this.httpClient.get<EditSupplierVM>(`${environment.GetSupplierById}${id}`, this.httpHeader);
  // }

  // CreateSupplier(SupplierVM: CreateSupplierVM): Observable<CreateSupplierVM> {
  //   return this.httpClient.post<any>(`${environment.AddSupplier}`, SupplierVM, this.httpHeader);
  // }


  // UpdateSupplier(SupplierObj: EditSupplierVM): Observable<EditSupplierVM> {
  //   return this.httpClient.put<EditSupplierVM>(`${environment.UpdateSupplier}`, SupplierObj, this.httpHeader);
  // }

  // DeleteSupplier(id: number): Observable<any> {
  //   return this.httpClient.delete<any>(`${environment.DeleteSupplier}${id}`, this.httpHeader);
  // }

}
