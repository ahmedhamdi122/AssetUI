import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Paging } from '../Models/paging';
import { SearchRequestDateVM } from '../Models/requestModeVM';
import { EditRequestStatus, IndexRequestStatus, MainClass, SortRequestStatusesVM } from '../Models/RequestStatusVM';
// import { MainClass } from '../Models/WorkOrderVM';
@Injectable({
  providedIn: 'root'
})
export class RequestStatusService {


  constructor(private httpClient: HttpClient) { }
  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'
    })
  };

  GetAllRequestStatus(): Observable<IndexRequestStatus[]> {
    return this.httpClient.get<IndexRequestStatus[]>(`${environment.RequestStatus}`, this.httpHeader);
  }

  GetReportRequestStatus(): Observable<IndexRequestStatus> {
    return this.httpClient.get<IndexRequestStatus>(`${environment.RequestStatus}`, this.httpHeader);
  }


  GetAllRequestStatusWithoutUser(): Observable<IndexRequestStatus> {
    return this.httpClient.get<IndexRequestStatus>(`${environment.GetAllForReport}`, this.httpHeader);
  }

  GetAllForReportByDate(searchObj: SearchRequestDateVM): Observable<IndexRequestStatus> {
    return this.httpClient.post<IndexRequestStatus>(`${environment.GetAllForReportByDate}`, searchObj, this.httpHeader);
  }





  GetRequestStatus(userId: string): Observable<IndexRequestStatus> {
    return this.httpClient.get<IndexRequestStatus>(`${environment.GetAllRequestStatus}${userId}`, this.httpHeader);
  }

  GetRequestStatusByUserId(userId: string): Observable<MainClass> {
    return this.httpClient.get<MainClass>(`${environment.GetRequestStatusByUserId}${userId}`, this.httpHeader);
  }







  GetAllByHospitalId(userId: string, hospitalId: number): Observable<IndexRequestStatus> {
    return this.httpClient.get<IndexRequestStatus>(`${environment.GetAllByHospitalId}${userId}/${hospitalId}`, this.httpHeader);
  }


  GetRequestStatusById(id: number): Observable<IndexRequestStatus> {
    return this.httpClient.get<IndexRequestStatus>(`${environment.GetRequestStatusById}${id}`, this.httpHeader);
  }
  CreateRequestStatus(RequestStatusVM: IndexRequestStatus): Observable<IndexRequestStatus> {
    return this.httpClient.post<any>(`${environment.AddRequestStatus}`, RequestStatusVM, this.httpHeader);
  }


  UpdateRequestStatus(RequestStatusObj: IndexRequestStatus): Observable<IndexRequestStatus> {
    return this.httpClient.put<IndexRequestStatus>(`${environment.UpdateRequestStatus}`, RequestStatusObj, this.httpHeader);
  }

  UpdateRequestStatus2(requestStatusObj: EditRequestStatus): Observable<EditRequestStatus> {
    return this.httpClient.put<EditRequestStatus>(`${environment.UpdateRequestStatus2}`, requestStatusObj, this.httpHeader);
  }
  DeleteRequestStatus(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteRequestStatus}${id}`, this.httpHeader);
  }


  CountRequestStatuses(): Observable<number> {
    return this.httpClient.get<number>(`${environment.GetRequestStatusesCount}`, this.httpHeader);
  }
  GetRequestStatusesWithPaging(PageInfo: Paging): Observable<IndexRequestStatus[]> {
    return this.httpClient.put<IndexRequestStatus[]>(`${environment.GetRequestStatusesWithPaging}`, PageInfo, this.httpHeader);
  }
  sortRequestStatuses(pagenumber: number, pagesize: number, sortObj: SortRequestStatusesVM): Observable<IndexRequestStatus[]> {
    return this.httpClient.post<IndexRequestStatus[]>(`${environment.SortRequestStatuses}${pagenumber}/${pagesize}`, sortObj, this.httpHeader);
  }


  CreateRequestStatusPDF(lang: string): Observable<IndexRequestStatus[]> {
    return this.httpClient.post<IndexRequestStatus[]>(`${environment.CreateRequestStatusPDF}${lang}`, this.httpHeader);
  }



  downloadRequestStatusPDF(fileName): any {
    return this.httpClient.get(`${environment.Domain}UploadedAttachments/RequestStatus/${fileName}`, { responseType: 'blob' });
  }



}
