import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateWorkOrderAttachmentVM, IndexWorkOrderAttachmentVM } from '../Models/WorkOrderAttachmentVM';
@Injectable({
  providedIn: 'root'
})
export class WorkOrderAttachmentService {

  constructor(private httpClient: HttpClient) { }
  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'
    })
  };
  addListWorkOrderAttachments(Documents: CreateWorkOrderAttachmentVM[]): Observable<CreateWorkOrderAttachmentVM[]> {
    return this.httpClient.post<CreateWorkOrderAttachmentVM[]>(`${environment.WorkOrderAttachment}`, Documents, this.httpHeader);
  }
  GetAllWorkOrderAttachments(): Observable<IndexWorkOrderAttachmentVM[]> {
    return this.httpClient.get<IndexWorkOrderAttachmentVM[]>(`${environment.WorkOrderAttachment}`, this.httpHeader);
  }
  GetWorkOrderAttachmentsByWorkOrderTrackingId(trackId: Number): Observable<IndexWorkOrderAttachmentVM[]> {
    return this.httpClient.get<IndexWorkOrderAttachmentVM[]>(`${environment.GetWorkOrderAttachmentsByWorkOrderTrackingId}${trackId}`, this.httpHeader);
  }
  deletedocument(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.WorkOrderAttachment}${id}`, this.httpHeader);
  }
  downloadInFile(fileName): any {
    return this.httpClient.get(`${environment.Domain}UploadedAttachments/documentFiles/${fileName}`, this.httpHeader);
  }


  GetLastDocumentForWorkOrderTrackingId(workOrderTrackingId: Number): Observable<IndexWorkOrderAttachmentVM> {
    return this.httpClient.get<IndexWorkOrderAttachmentVM>(`${environment.GetLastDocumentForWorkOrderTrackingId}${workOrderTrackingId}`, this.httpHeader);
  }

}
