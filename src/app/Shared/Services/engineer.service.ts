import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateEngineerVM, EditEngineerVM, EngineerVM, ListEngineerVM, SortEngineerVM, ViewEngineerVM } from '../Models/engineerVM';
import { Paging } from '../Models/paging';

@Injectable({
  providedIn: 'root'
})
export class EngineerService {

  constructor(private httpClient: HttpClient) { }
  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };
  GetAllEngineers(): Observable<ListEngineerVM[]> {
    return this.httpClient.get<ListEngineerVM[]>(`${environment.ListEngineers}`, this.httpHeader);
  }
  CreateEngineer(EngineerVM: CreateEngineerVM): Observable<CreateEngineerVM> {
    return this.httpClient.post<any>(`${environment.AddEngineer}`, EngineerVM, this.httpHeader);
  }
  GetEngineersWithPaging(pageInfo: Paging): Observable<ListEngineerVM[]> {
    return this.httpClient.put<ListEngineerVM[]>(`${environment.ListEngineersWithPaging}`, pageInfo, this.httpHeader);
  } 
  GetEngineerById(id: number): Observable<EditEngineerVM> {
    return this.httpClient.get<EditEngineerVM>(`${environment.GetEngineerById}${id}`, this.httpHeader);
  }

  GetEngineerByEmail(email: string): Observable<EditEngineerVM> {
    return this.httpClient.get<EditEngineerVM>(`${environment.GetByEmail}${email}`, this.httpHeader);
  }


  ViewEngineerById(id: number): Observable<ViewEngineerVM> {
    return this.httpClient.get<ViewEngineerVM>(`${environment.GetEngineerById}${id}`, this.httpHeader);
  }
  UpdateEngineer(VisitVM: EditEngineerVM): Observable<EditEngineerVM> {
    return this.httpClient.put<EditEngineerVM>(`${environment.UpdateEngineer}`, EngineerVM, this.httpHeader);
  }
  getCount(): Observable<number> {
    return this.httpClient.get<number>(`${environment.getEngineerscount}`);
  }
  DeleteEngineer(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteEngineer}${id}`, this.httpHeader);
  }
  sortEngineers(pagenumber: number, pagesize: number, sortObj: SortEngineerVM): Observable<ListEngineerVM[]> {
    return this.httpClient.post<ListEngineerVM[]>(`${environment.sortEngineers}${pagenumber}/${pagesize}`, sortObj, this.httpHeader);
  }

   GetUnregisteredEngineerUsers(): Observable<ListEngineerVM[]> {
    return this.httpClient.get<ListEngineerVM[]>(`${environment.GetUnregisteredEngineerUsers}`, this.httpHeader);
  }
}
