import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IndexWorkOrderAttachmentVM } from '../Models/WorkOrderAttachmentVM';
import { CreateWorkOrderTrackingVM, EditWorkOrderTrackingVM, IndexWorkOrderTrackingVM, ListWorkOrderFromTrackingVM, WorkOrderDetails, WorkOrderTrackingVM } from '../Models/WorkOrderTrackingVM';
import { IndexWorkOrderVM, ListWorkOrderVM } from '../Models/WorkOrderVM';
@Injectable({
  providedIn: 'root'
})
export class WorkOrderTrackingService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetAllWorkOrderFromTrackingByServiceRequestId(serviceRequestId: number): Observable<ListWorkOrderFromTrackingVM[]> {
    return this.httpClient.get<ListWorkOrderFromTrackingVM[]>(`${environment.GetAllWorkOrderFromTrackingByServiceRequestId}${serviceRequestId}`, this.httpHeader);
  }


  GetAllWorkOrderFromTrackingByServiceRequestUserId(serviceRequestId: number, userId: string): Observable<ListWorkOrderFromTrackingVM[]> {
    return this.httpClient.get<ListWorkOrderFromTrackingVM[]>(`${environment.GetAllWorkOrderFromTrackingByServiceRequestUserId}${serviceRequestId}/${userId}`, this.httpHeader);
  }





  GetworkOrderByUserId(requestId: number, userId: string): Observable<ListWorkOrderFromTrackingVM[]> {
    return this.httpClient.get<ListWorkOrderFromTrackingVM[]>(`${environment.GetworkOrderByUserId}${requestId}/${userId}`, this.httpHeader);
  }


  GetAllWorkOrderFromTrackingByUserId(userId: string): Observable<ListWorkOrderFromTrackingVM[]> {
    return this.httpClient.get<ListWorkOrderFromTrackingVM[]>(`${environment.GetAllWorkOrderFromTrackingByUserId}${userId}`, this.httpHeader);
  }

  GetAttachmentsByWorkOrderId(id: number): Observable<IndexWorkOrderAttachmentVM[]> {
    return this.httpClient.get<IndexWorkOrderAttachmentVM[]>(`${environment.GetAttachmentsByWorkOrderId}${id}`, this.httpHeader);
  }


  GetWorkOrderTrackingById(id: number): Observable<IndexWorkOrderTrackingVM> {
    return this.httpClient.get<IndexWorkOrderTrackingVM>(`${environment.WorkOrderTracking}${id}`, this.httpHeader);
  }

  GetWorkOrderTrackingById2(id: number): Observable<WorkOrderTrackingVM> {
    return this.httpClient.get<WorkOrderTrackingVM>(`${environment.GetWorkOrderTrackingById}${id}`, this.httpHeader);
  }


  GetAllWorkOrderByWorkOrderId(WorkOrderId: number): Observable<WorkOrderDetails> {
    return this.httpClient.get<WorkOrderDetails>(`${environment.GetAllWorkOrderByWorkOrderId}${WorkOrderId}`, this.httpHeader);
  }


  GetTrackOfWorkOrderByWorkOrderId(workOrderId: number): Observable<IndexWorkOrderTrackingVM[]> {
    return this.httpClient.get<IndexWorkOrderTrackingVM[]>(`${environment.GetTrackOfWorkOrderByWorkOrderId}${workOrderId}`, this.httpHeader);
  }




  GetAllWorkOrderTrackingByWorkOrderId(workOrderId: number): Observable<IndexWorkOrderTrackingVM[]> {
    return this.httpClient.get<IndexWorkOrderTrackingVM[]>(`${environment.GetAllWorkOrderTrackingByWorkOrderId}${workOrderId}`, this.httpHeader);
  }

  GetEngManagerWhoFirstAssignedWO(woId: number): Observable<IndexWorkOrderTrackingVM[]> {
    return this.httpClient.get<IndexWorkOrderTrackingVM[]>(`${environment.GetEngManagerWhoFirstAssignedWO}${woId}`, this.httpHeader);
  }



  CreateWorkOrderTracking(CreateWorkOrderTrackingVM: CreateWorkOrderTrackingVM): Observable<number> {
    return this.httpClient.post<number>(`${environment.WorkOrderTracking}`, CreateWorkOrderTrackingVM, this.httpHeader);
  }

  AddWorkOrderTracking(createWorkOrderObj: CreateWorkOrderTrackingVM): Observable<number> {
    return this.httpClient.post<number>(`${environment.AddWorkOrderTracking}`, createWorkOrderObj, this.httpHeader);
  }

  GetFirstTrackForWorkOrderByWorkOrderId(woId: number): Observable<number> {
    return this.httpClient.get<number>(`${environment.GetFirstTrackForWorkOrderByWorkOrderId}${woId}`, this.httpHeader);
  }


  UpdateWorkOrderTracking(EditWorkOrderTrackingVM: EditWorkOrderTrackingVM): Observable<EditWorkOrderTrackingVM> {
    return this.httpClient.put<EditWorkOrderTrackingVM>(`${environment.UpdateWorkOrderTracking}`, EditWorkOrderTrackingVM, this.httpHeader);
  }



  DeleteWorkOrderTracking(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteWorkOrderTracking}${id}`, this.httpHeader);
  }

}
