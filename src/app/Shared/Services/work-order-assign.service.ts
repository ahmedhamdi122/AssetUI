import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateWorkOrderAssignVM, EditWorkOrderAssignVM, IndexWorkOrderAssignVM } from '../Models/WorkOrderAssignVM';
@Injectable({
  providedIn: 'root'
})
export class WorkOrderAssignService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };


  GetWorkOrderAssignById(woTrackId: number): Observable<IndexWorkOrderAssignVM> {
    return this.httpClient.get<IndexWorkOrderAssignVM>(`${environment.WorkOrderAssign}${woTrackId}`, this.httpHeader);
  }



  GetAllWorkOrderAssignByWorkOrderTrackId(WorkOrderId: number): Observable<IndexWorkOrderAssignVM[]> {
    return this.httpClient.get<IndexWorkOrderAssignVM[]>(`${environment.GetAllWorkOrderAssignsByWorkOrederTrackId}${WorkOrderId}`, this.httpHeader);
  }
  AddWorkOrderAssign(CreateWorkOrderAssignVM: CreateWorkOrderAssignVM): Observable<CreateWorkOrderAssignVM> {
    return this.httpClient.post<any>(`${environment.WorkOrderAssign}`, CreateWorkOrderAssignVM, this.httpHeader);
  }
  UpdateWorkOrderAssign(EditWorkOrderAssignVM: EditWorkOrderAssignVM): Observable<EditWorkOrderAssignVM> {
    return this.httpClient.put<EditWorkOrderAssignVM>(`${environment.WorkOrderAssign}`, EditWorkOrderAssignVM, this.httpHeader);
  }
  DeleteWorkOrderAssign(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.WorkOrderAssign}/${id}`, this.httpHeader);
  }

}
