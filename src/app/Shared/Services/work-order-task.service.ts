import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateWorkOrderTaskVM, EditWorkOrderTaskVM, IndexWorkOrderTaskVM } from '../Models/WorkOrderTaskVM';
@Injectable({
  providedIn: 'root'
})
export class WorkOrderTaskService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetWorkOrderTasks(): Observable<IndexWorkOrderTaskVM[]> {
    return this.httpClient.get<IndexWorkOrderTaskVM[]>(`${environment.WorkOrderTask}`, this.httpHeader);
  }
  GetWorkOrderTaskById(id: number): Observable<IndexWorkOrderTaskVM> {
    return this.httpClient.get<IndexWorkOrderTaskVM>(`${environment.WorkOrderTask}${id}`, this.httpHeader);
  }
  GetAllWorkOrderTaskByWorkOrderId(WorkOrderId: number): Observable<IndexWorkOrderTaskVM[]> {
    return this.httpClient.get<IndexWorkOrderTaskVM[]>(`${environment.GetAllWorkOrderTaskByWorkOrderId}${WorkOrderId}`, this.httpHeader);
  }
  CreateWorkOrderTask(CreateWorkOrderTaskVM: CreateWorkOrderTaskVM): Observable<CreateWorkOrderTaskVM> {
    return this.httpClient.post<any>(`${environment.WorkOrderTask}`, CreateWorkOrderTaskVM, this.httpHeader);
  }
  UpdateWorkOrderTask(EditWorkOrderTaskVM: EditWorkOrderTaskVM): Observable<EditWorkOrderTaskVM> {
    return this.httpClient.put<EditWorkOrderTaskVM>(`${environment.WorkOrderTask}`, EditWorkOrderTaskVM, this.httpHeader);
  }
  DeleteWorkOrderTask(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.WorkOrderTask}${id}`, this.httpHeader);
  }

}
