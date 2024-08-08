import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Paging } from '../Models/paging';
import { CreateRequestTypeVM, EditRequestTypeVM, IndexRequestTypeVM, SortRequestTypeVM } from '../Models/ProjectTypeVM';
@Injectable({
  providedIn: 'root'
})
export class RequestTypeService {
  constructor(private httpClient: HttpClient) { }
  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'
    })
  };

  GetAllRequestTypes(): Observable<IndexRequestTypeVM[]> {
    return this.httpClient.get<IndexRequestTypeVM[]>(`${environment.RequestType}`, this.httpHeader);
  }
  inserRequestType(reqPeriorty: CreateRequestTypeVM): Observable<CreateRequestTypeVM> {
    return this.httpClient.post<CreateRequestTypeVM>(`${environment.RequestType}`, reqPeriorty, this.httpHeader);
  }

  GetRequestTypeById(id: number): Observable<EditRequestTypeVM> {
    return this.httpClient.get<EditRequestTypeVM>(`${environment.GetRequestTypeById}${id}`, this.httpHeader);
  }

  UpdateRequestType(requestObj: EditRequestTypeVM): Observable<EditRequestTypeVM> {
    return this.httpClient.put<EditRequestTypeVM>(`${environment.UpdateRequestType}`, requestObj, this.httpHeader);
  }

  DeleteRequestType(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteRequestType}${id}`, this.httpHeader);
  }




  SortRequestTypes(pagenumber: number, pagesize: number, sortObj: SortRequestTypeVM): Observable<IndexRequestTypeVM[]> {
    return this.httpClient.post<IndexRequestTypeVM[]>(`${environment.SortRequestTypes}${pagenumber}/${pagesize}`, sortObj, this.httpHeader);
  }

  CountRequestTypes(): Observable<number> {
    return this.httpClient.get<number>(`${environment.CountRequestTypes}`, this.httpHeader);
  }

  GetRequestTypesWithPaging(PageInfo: Paging): Observable<IndexRequestTypeVM[]> {
    return this.httpClient.put<IndexRequestTypeVM[]>(`${environment.GetRequestTypesWithPaging}`, PageInfo, this.httpHeader);
  }




  CreateRequestTypePDF(lang: string): Observable<IndexRequestTypeVM[]> {
    return this.httpClient.post<IndexRequestTypeVM[]>(`${environment.CreateRequestTypePDF}${lang}`, this.httpHeader);
  }



  downloadRequestTypePDF(fileName): any {
    return this.httpClient.get(`${environment.Domain}UploadedAttachments/RequestTypes/${fileName}`, { responseType: 'blob' });
  }


}
