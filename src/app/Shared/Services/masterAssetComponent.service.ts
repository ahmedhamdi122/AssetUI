import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateMasterAssetComponentVM, EditMasterAssetComponentVM, ListMasterAssetComponentVM, ViewMasterAssetComponentVM } from '../Models/masterAssetComponentVM';



@Injectable({
  providedIn: 'root'
})

export class MasterAssetComponentService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetMasterAssets(): Observable<ListMasterAssetComponentVM[]> {
    return this.httpClient.get<ListMasterAssetComponentVM[]>(`${environment.ListMasterAssetComponents}`, this.httpHeader);
  }




  ListMasterAssetComponentsByMasterAssetId(masterAssetId: number): Observable<ListMasterAssetComponentVM[]> {
    return this.httpClient.get<ListMasterAssetComponentVM[]>(`${environment.GetMasterAssetComponentByMasterAssetId}${masterAssetId}`, this.httpHeader);
  }


  ViewMasterAssetComponentById(id: number): Observable<ViewMasterAssetComponentVM> {
    return this.httpClient.get<ViewMasterAssetComponentVM>(`${environment.ViewMasterAssetComponentById}${id}`, this.httpHeader);
  }


  CreateMasterAssetComponent(model: CreateMasterAssetComponentVM): Observable<number> {
    return this.httpClient.post<any>(`${environment.AddMasterAssetComponent}`, model, this.httpHeader);
  }

  UpdateMasterAssetComponent(MasterAssetVM: EditMasterAssetComponentVM): Observable<EditMasterAssetComponentVM> {
    return this.httpClient.put<EditMasterAssetComponentVM>(`${environment.UpdateMasterAssetComponent}`, MasterAssetVM, this.httpHeader);
  }

  DeleteMasterAssetComponent(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteMasterAssetComponent}${id}`, this.httpHeader);
  }

}
