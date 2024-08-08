import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateClassVM, EditClassVM, ListClassVM, SortClassVM } from '../Models/classVM';
import { Paging } from '../Models/paging';


@Injectable({
  providedIn: 'root'
})

export class ClassifyService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetClassifications(): Observable<ListClassVM[]> {
    return this.httpClient.get<ListClassVM[]>(`${environment.ListClassifications}`, this.httpHeader);
  }


  GetClassificationById(id: number): Observable<EditClassVM> {
    return this.httpClient.get<EditClassVM>(`${environment.GetClassificationById}${id}`, this.httpHeader);
  }
  CreateClassification(ClassificationVM: CreateClassVM): Observable<CreateClassVM> {
    return this.httpClient.post<any>(`${environment.AddClassification}`, ClassificationVM, this.httpHeader);
  }


  UpdateClassification(ClassificationObj: EditClassVM): Observable<EditClassVM> {
    return this.httpClient.put<EditClassVM>(`${environment.UpdateClassification}`, ClassificationObj, this.httpHeader);
  }

  DeleteClassification(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteClassification}${id}`, this.httpHeader);
  }
  GetclassifysWithPaging(PageInfo: Paging): Observable<ListClassVM[]> {
    return this.httpClient.put<ListClassVM[]>(`${environment.GetClassificationsWithPaging}`, PageInfo, this.httpHeader);
  }

  getCount(): Observable<number> {
    return this.httpClient.get<number>(`${environment.getClassificationsCount}`);
  }

  SortClassifications(pagenumber: number, pagesize: number, sortObj: SortClassVM): Observable<ListClassVM[]> {
    return this.httpClient.post<ListClassVM[]>(`${environment.SortClassifications}${pagenumber}/${pagesize}`, sortObj, this.httpHeader);
  }
}
