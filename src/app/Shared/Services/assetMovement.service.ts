import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateAssetMovementVM, EditAssetMovementVM, ListAssetMovementVM, MainClass, SearchAssetMovementVM, SortAndFilterAssetMovementVM } from '../Models/assetMovementVM';
import { EditAssetDetailVM } from '../Models/assetDetailVM';



@Injectable({
  providedIn: 'root'
})

export class AssetMovementService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  ListAssetMovements(pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.get<MainClass>(`${environment.ListAssetMovements}${pageNumber}/${pageSize}`, this.httpHeader);
  }


  GetAssetMovements(data: SortAndFilterAssetMovementVM, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.GetAssetMovements}${pageNumber}/${pageSize}`, data, this.httpHeader);
  }


  SearchAssetMovement(searchObj: SearchAssetMovementVM, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.SearchAssetMovement}${pageNumber}/${pageSize}`, searchObj, this.httpHeader);
  }





  GetMovementByAssetMovementId(assetId: number): Observable<ListAssetMovementVM[]> {
    return this.httpClient.get<ListAssetMovementVM[]>(`${environment.GetMovementByAssetDetailId}${assetId}`, this.httpHeader);
  }

  GetAssetMovementById(id: number): Observable<EditAssetMovementVM> {
    return this.httpClient.get<any>(`${environment.GetAssetMovementById}${id}`, this.httpHeader);
  }
  CreateAssetMovement(AssetVM: CreateAssetMovementVM): Observable<number> {
    return this.httpClient.post<any>(`${environment.AddAssetMovement}`, AssetVM, this.httpHeader);
  }

  UpdateAssetMovement(AssetVM: EditAssetMovementVM): Observable<EditAssetMovementVM> {
    return this.httpClient.put<EditAssetMovementVM>(`${environment.UpdateAssetMovement}`, AssetVM, this.httpHeader);
  }

  DeleteAssetMovement(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteAssetMovement}${id}`, this.httpHeader);
  }






}



