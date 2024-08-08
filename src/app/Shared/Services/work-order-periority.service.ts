import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateWorkOrderPeriorityVM, EditWorkOrderPeriorityVM, IndexWorkOrderPeriorityVM } from '../Models/WorkOrderPeriorityVM';
@Injectable({
  providedIn: 'root'
})
export class WorkOrderPeriorityService {

  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetWorkOrderPerioritys(): Observable<IndexWorkOrderPeriorityVM[]> {
    return this.httpClient.get<IndexWorkOrderPeriorityVM[]>(`${environment.WorkOrderPeriority}`, this.httpHeader);
  }
  GetWorkOrderPeriorityById(id: number): Observable<IndexWorkOrderPeriorityVM> {
    return this.httpClient.get<IndexWorkOrderPeriorityVM>(`${environment.WorkOrderPeriority}${id}`, this.httpHeader);
  }
  CreateWorkOrderPeriority(CreateWorkOrderPeriorityVM: CreateWorkOrderPeriorityVM): Observable<CreateWorkOrderPeriorityVM> {
    return this.httpClient.post<any>(`${environment.WorkOrderPeriority}`, CreateWorkOrderPeriorityVM, this.httpHeader);
  }
  UpdateWorkOrderPeriority(EditWorkOrderPeriorityVM: EditWorkOrderPeriorityVM): Observable<EditWorkOrderPeriorityVM> {
    return this.httpClient.put<EditWorkOrderPeriorityVM>(`${environment.WorkOrderPeriority}`, EditWorkOrderPeriorityVM, this.httpHeader);
  }
  DeleteWorkOrderPeriority(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.WorkOrderPeriority}${id}`, this.httpHeader);
  }

}
