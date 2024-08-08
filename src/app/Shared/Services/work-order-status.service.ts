import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Paging } from '../Models/paging';
import { CreateWorkOrderStatusVM, EditWorkOrderStatusVM, ListWorkOrderStatusVM, SortWOStatusVM } from '../Models/WorkOrderStatusVM';
import { SearchWorkOrderDateVM } from '../Models/WorkOrderVM';
@Injectable({
  providedIn: 'root'
})
export class WorkOrderStatusService {


  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetWorkOrderStatuss(): Observable<ListWorkOrderStatusVM[]> {
    return this.httpClient.get<ListWorkOrderStatusVM[]>(`${environment.WorkOrderStatus}`, this.httpHeader);
  }
  GetWorkOrderStatusByUserId(userId: string): Observable<ListWorkOrderStatusVM> {
    return this.httpClient.get<ListWorkOrderStatusVM>(`${environment.GetWorkOrderStatusByUserId}${userId}`, this.httpHeader);
  }



  GetAllWOForReportByDate(searchObj: SearchWorkOrderDateVM): Observable<ListWorkOrderStatusVM> {
    return this.httpClient.post<ListWorkOrderStatusVM>(`${environment.GetAllWOForReportByDate}`, searchObj, this.httpHeader);
  }


  GetWorkOrderStatusById(id: number): Observable<ListWorkOrderStatusVM> {
    return this.httpClient.get<ListWorkOrderStatusVM>(`${environment.WorkOrderStatus}${id}`, this.httpHeader);
  }
  CreateWorkOrderStatus(CreateWorkOrderStatusVM: CreateWorkOrderStatusVM): Observable<CreateWorkOrderStatusVM> {
    return this.httpClient.post<any>(`${environment.WorkOrderStatus}`, CreateWorkOrderStatusVM, this.httpHeader);
  }
  UpdateWorkOrderStatus(EditWorkOrderStatusVM: EditWorkOrderStatusVM): Observable<EditWorkOrderStatusVM> {
    return this.httpClient.put<EditWorkOrderStatusVM>(`${environment.WorkOrderStatus}`, EditWorkOrderStatusVM, this.httpHeader);
  }

  UpdateWorkOrderStatus2(EditWorkOrderStatusVM: EditWorkOrderStatusVM): Observable<EditWorkOrderStatusVM> {
    return this.httpClient.put<EditWorkOrderStatusVM>(`${environment.UpdateWorkOrderStatus}`, EditWorkOrderStatusVM, this.httpHeader);
  }

  DeleteWorkOrderStatus(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.WorkOrderStatus}${id}`, this.httpHeader);
  }




  sortWorkOrderStatuses(pagenumber: number, pagesize: number, sortObj: SortWOStatusVM): Observable<ListWorkOrderStatusVM[]> {
    return this.httpClient.post<ListWorkOrderStatusVM[]>(`${environment.SortWOStatuses}${pagenumber}/${pagesize}`, sortObj, this.httpHeader);
  }
  CountWorkOrderStatuses(): Observable<number> {
    return this.httpClient.get<number>(`${environment.GetWOStatusesCount}`, this.httpHeader);
  }
  GetWorkOrderStatusesWithPaging(PageInfo: Paging): Observable<ListWorkOrderStatusVM[]> {
    return this.httpClient.put<ListWorkOrderStatusVM[]>(`${environment.ListWOStatusesWithPaging}`, PageInfo, this.httpHeader);
  }

  CreateWorkOrderStatusPDF(lang: string): Observable<ListWorkOrderStatusVM[]> {
    return this.httpClient.post<ListWorkOrderStatusVM[]>(`${environment.CreateWOStatusPDF}${lang}`, this.httpHeader);
  }



  downloadWorkOrderStatusPDF(fileName): any {
    return this.httpClient.get(`${environment.Domain}UploadedAttachments/${fileName}`, { responseType: 'blob' });
  }

}
