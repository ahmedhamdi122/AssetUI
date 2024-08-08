import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateAssetWorkOrderTaskVM, EditAssetWorkOrderTaskVM, IndexAssetWorkOrderTaskVM } from '../Models/AssetWorkOrderTaskVM';
@Injectable({
  providedIn: 'root'
})
export class AssetWorkOrderTaskService {

  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetAssetWorkOrderTasks(): Observable<IndexAssetWorkOrderTaskVM[]> {
    return this.httpClient.get<IndexAssetWorkOrderTaskVM[]>(`${environment.AssetWorkOrderTask}`, this.httpHeader);
  }
  GetAssetWorkOrderTaskById(id: number): Observable<IndexAssetWorkOrderTaskVM> {
    return this.httpClient.get<IndexAssetWorkOrderTaskVM>(`${environment.AssetWorkOrderTask}${id}`, this.httpHeader);
  }
  GetAllAssetWorkOrderTasksByMasterAssetId(MasterAssetId: number): Observable<IndexAssetWorkOrderTaskVM[]> {
    return this.httpClient.get<IndexAssetWorkOrderTaskVM[]>(`${environment.GetAllAssetWorkOrderTasksByMasterAssetId}${MasterAssetId}`, this.httpHeader);
  }
  CreateAssetWorkOrderTask(CreateAssetWorkOrderTaskVM: CreateAssetWorkOrderTaskVM): Observable<CreateAssetWorkOrderTaskVM> {
    return this.httpClient.post<any>(`${environment.AssetWorkOrderTask}`, CreateAssetWorkOrderTaskVM, this.httpHeader);
  }
  UpdateAssetWorkOrderTask(EditAssetWorkOrderTaskVM: EditAssetWorkOrderTaskVM): Observable<EditAssetWorkOrderTaskVM> {
    return this.httpClient.put<EditAssetWorkOrderTaskVM>(`${environment.AssetWorkOrderTask}`, EditAssetWorkOrderTaskVM, this.httpHeader);
  }
  DeleteAssetWorkOrderTask(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteAssetWorkOrderTask}${id}`, this.httpHeader);
  }

}
