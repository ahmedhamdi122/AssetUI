import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateExternalAssetMovementVM, EditExternalAssetMovementVM, ListExternalAssetMovementVM, MainClass } from '../Models/externalAssetMovementVM';
import { CreateExternalAssetMovementAttachmentVM, ListExternalAssetMovementAttachmentVM, SearchExternalAssetMovementVM } from '../Models/externalAssetMovementAttachment';



@Injectable({
  providedIn: 'root'
})

export class ExternalAssetMovementService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };


  GetExternalAssetMovementByAssetDetailId(assetId: number): Observable<ListExternalAssetMovementVM[]> {
    return this.httpClient.get<ListExternalAssetMovementVM[]>(`${environment.GetExternalAssetMovementByAssetDetailId}${assetId}`, this.httpHeader);
  }


  GetExternalAssetMovementById(id: number): Observable<EditExternalAssetMovementVM> {
    return this.httpClient.get<EditExternalAssetMovementVM>(`${environment.GetExternalAssetMovementById}${id}`, this.httpHeader);
  }

  ListExternalAssetMovements(pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.get<MainClass>(`${environment.ListExternalAssetMovements}${pageNumber}/${pageSize}`, this.httpHeader);
  }

  CreateExternalAssetMovement(AssetVM: CreateExternalAssetMovementVM): Observable<number> {
    return this.httpClient.post<any>(`${environment.AddExternalAssetMovement}`, AssetVM, this.httpHeader);
  }


  CreatetExternalAssetMovementAttachment(attachObj: CreateExternalAssetMovementAttachmentVM): Observable<number> {
    return this.httpClient.post<number>(`${environment.CreateExternalAssetMovementAttachments}`, attachObj, this.httpHeader);
  }




  GetExternalMovementAttachmentByExternalAssetMovementId(externalAssetMovementId: number): Observable<ListExternalAssetMovementAttachmentVM[]> {
    return this.httpClient.get<ListExternalAssetMovementAttachmentVM[]>(`${environment.GetExternalMovementAttachmentByExternalAssetMovementId}${externalAssetMovementId}`, this.httpHeader);
  }



  SearchExternalAssetMovement(searchObj: SearchExternalAssetMovementVM, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.SearchExternalAssetMovement}${pageNumber}/${pageSize}`, searchObj, this.httpHeader);
  }


}



