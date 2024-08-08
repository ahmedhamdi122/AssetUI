import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AssetStatusTransactionVM, CreateAssetStatusTransactionVM, EditAssetStatusTransactionVM, ListAssetStatusTransactionVM } from '../Models/assetStatusTransactionVM';
import { EditAssetDetailVM } from '../Models/assetDetailVM';



@Injectable({
  providedIn: 'root'
})

export class AssetStatusTransactionService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetStatusTransactionByAssetDetailId(assetId: number): Observable<ListAssetStatusTransactionVM[]> {
    return this.httpClient.get<ListAssetStatusTransactionVM[]>(`${environment.GetStatusTransactionByAssetDetailId}${assetId}`, this.httpHeader);
  }


  GetLastTransactionByAssetId(assetId: number): Observable<AssetStatusTransactionVM[]> {
    return this.httpClient.get<AssetStatusTransactionVM[]>(`${environment.GetLastTransactionByAssetId}${assetId}`, this.httpHeader);
  }







  // GetAssetStatusTransactionById(id: number): Observable<EditAssetStatusTransactionVM> {
  //   return this.httpClient.get<any>(`${environment.GetAssetStatusTransactionById}${id}`, this.httpHeader);
  // }

  CreateAssetStatusTransaction(AssetVM: CreateAssetStatusTransactionVM): Observable<number> {
    return this.httpClient.post<any>(`${environment.AddAssetStatusTransaction}`, AssetVM, this.httpHeader);
  }


  AddAssetStatusTransaction(assetStatusObj: CreateAssetStatusTransactionVM): Observable<number> {
    return this.httpClient.post<number>(`${environment.AddAssetStatusTransaction}`, assetStatusObj, this.httpHeader);
  }


  // UpdateAssetStatusTransaction(AssetVM: EditAssetStatusTransactionVM): Observable<EditAssetStatusTransactionVM> {
  //   return this.httpClient.put<EditAssetStatusTransactionVM>(`${environment.UpdateAssetStatusTransaction}`, AssetVM, this.httpHeader);
  // }

  DeleteAssetStatusTransaction(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteAssetStatusTransaction}${id}`, this.httpHeader);
  }






}



