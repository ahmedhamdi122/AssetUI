import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Paging } from '../Models/paging';
import { CreateWorkOrderTypeVM, EditWorkOrderTypeVM, IndexWorkOrderTypeVM, SortWOTypesVM } from '../Models/WorkOrderTypeVM';
@Injectable({
  providedIn: 'root'
})
export class WorkOrderTypeService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetWorkOrderTypes(): Observable<IndexWorkOrderTypeVM[]> {
    return this.httpClient.get<IndexWorkOrderTypeVM[]>(`${environment.WorkOrderType}`, this.httpHeader);
  }
  GetWorkOrderTypeById(id: number): Observable<IndexWorkOrderTypeVM> {
    return this.httpClient.get<IndexWorkOrderTypeVM>(`${environment.WorkOrderType}${id}`, this.httpHeader);
  }
  CreateWorkOrderType(CreateWorkOrderTypeVM: CreateWorkOrderTypeVM): Observable<CreateWorkOrderTypeVM> {
    return this.httpClient.post<any>(`${environment.WorkOrderType}`, CreateWorkOrderTypeVM, this.httpHeader);
  }
  UpdateWorkOrderType(EditWorkOrderTypeVM: EditWorkOrderTypeVM): Observable<EditWorkOrderTypeVM> {
    return this.httpClient.put<EditWorkOrderTypeVM>(`${environment.WorkOrderType}`, EditWorkOrderTypeVM, this.httpHeader);
  }
  DeleteWorkOrderType(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.WorkOrderType}${id}`, this.httpHeader);
  }

  CountWorkOrderTypes(): Observable<number> {
    return this.httpClient.get<number>(`${environment.GetWorkOrderTypeCount}`, this.httpHeader);
  }
  GetWorkOrderTypesWithPaging(PageInfo: Paging): Observable<IndexWorkOrderTypeVM[]> {
    return this.httpClient.put<IndexWorkOrderTypeVM[]>(`${environment.GetWOTypesWithPaging}`, PageInfo, this.httpHeader);
  }
  sortWorkOrderTypes(pagenumber: number, pagesize: number, sortObj: SortWOTypesVM): Observable<IndexWorkOrderTypeVM[]> {
    return this.httpClient.post<IndexWorkOrderTypeVM[]>(`${environment.SortWorkOrderTypes}${pagenumber}/${pagesize}`, sortObj, this.httpHeader);
  }


  CreateWorkOrderTypePDF(lang: string): Observable<IndexWorkOrderTypeVM[]> {
    return this.httpClient.post<IndexWorkOrderTypeVM[]>(`${environment.CreateWOTypePDF}${lang}`, this.httpHeader);
  }



  downloadWorkOrderTypePDF(fileName): any {
    return this.httpClient.get(`${environment.Domain}UploadedAttachments/${fileName}`, { responseType: 'blob' });
  }
}
