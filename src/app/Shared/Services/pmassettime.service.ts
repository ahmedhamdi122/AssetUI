import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListPMTimeVM } from '../Models/pmTimeVM';
import { EditPMAssetTimeVM } from '../Models/pmAssetTimeVM';


@Injectable({
  providedIn: 'root'
})

export class PMAssetTimeService {
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


  GetPMAssetTimeById(id: number): Observable<EditPMAssetTimeVM> {
    return this.httpClient.get<EditPMAssetTimeVM>(`${environment.GetPMAssetTimeById}${id}`, this.httpHeader);
  }

  // CreateSupplier(SupplierVM: CreateSupplierVM): Observable<CreateSupplierVM> {
  //   return this.httpClient.post<any>(`${environment.AddSupplier}`, SupplierVM, this.httpHeader);
  // }


  UpdatePMAssetTime(model: EditPMAssetTimeVM): Observable<number> {
    return this.httpClient.put<number>(`${environment.UpdatePMAssetTime}`, model, this.httpHeader);
  }

  // DeleteSupplier(id: number): Observable<any> {
  //   return this.httpClient.delete<any>(`${environment.DeleteSupplier}${id}`, this.httpHeader);
  // }

}
