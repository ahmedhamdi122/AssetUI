import { CreateVisitVM, DetailVisitVM, EditVisitVM, GeneratedVisitCodeVM, ListVisitVM, SearchVisitVM, SortVisitsVM, ViewVisitVM } from './../Models/visitVM';

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Paging } from '../Models/paging';
import { CreateVisitAttachmentVM, ListVisitAttachmentVM } from '../Models/visitAttachmentVM';

@Injectable({
  providedIn: 'root'
})

export class VisitService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };
  // GetVisitById(id: number): Observable<EditVisitVM> {
  //   return this.httpClient.get<EditVisitVM>(`${environment.GetVisitById}${id}`, this.httpHeader);
  // }
  GetAllVisits(): Observable<ListVisitVM[]> {
    return this.httpClient.get<ListVisitVM[]>(`${environment.GetAllVisits}`, this.httpHeader);
  }

  SortVisits(pagenumber: number, pagesize: number, sortObj: SortVisitsVM, statusId:number): Observable<ListVisitVM[]> {
    return this.httpClient.post<ListVisitVM[]>(`${environment.SortVisits}${pagenumber}/${pagesize}`, sortObj, this.httpHeader);
  }

  GetVisitsWithPaging(pageInfo: Paging): Observable<ListVisitVM[]> {
    return this.httpClient.put<ListVisitVM[]>(`${environment.ListVisitsWithPaging}`, pageInfo, this.httpHeader);
  }


  GenerateVisitCode(): Observable<GeneratedVisitCodeVM> {
    return this.httpClient.get<GeneratedVisitCodeVM>(`${environment.GenerateVisitCode}`, this.httpHeader);
  }


  getCount(): Observable<number> {
    return this.httpClient.get<number>(`${environment.getVisitscount}`);
  }

  GetVisitById(id: number): Observable<EditVisitVM> {
    return this.httpClient.get<EditVisitVM>(`${environment.GetVisitById}${id}`, this.httpHeader);
  }
  ViewVisitById(id: number): Observable<ViewVisitVM> {
    return this.httpClient.get<ViewVisitVM>(`${environment.ViewVisitById}${id}`, this.httpHeader);
  }
  CreateVisitAttachments(visitAttachment: CreateVisitAttachmentVM): Observable<number> {
    return this.httpClient.post<number>(`${environment.CreateVisitAttachments}`,visitAttachment, this.httpHeader);
  }
  CreateVisit(VisitVM: CreateVisitVM): Observable<CreateVisitVM> {
    return this.httpClient.post<any>(`${environment.AddVisit}`, VisitVM, this.httpHeader);
  }
  UpdateVisit(VisitVM: EditVisitVM): Observable<EditVisitVM> {
    return this.httpClient.put<EditVisitVM>(`${environment.UpdateVisit}`, VisitVM, this.httpHeader);
  }

  verifyVisit(visitVM: EditVisitVM): Observable<EditVisitVM> {
    return this.httpClient.put<EditVisitVM>(`${environment.UpdateVer}`, visitVM, this.httpHeader);
  }
  DeleteVisit(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteVisit}${id}`, this.httpHeader);
  }

  SearchInVisits(pagenumber: number, pagesize: number, searchObj: SearchVisitVM): Observable<ListVisitVM[]> {
    return this.httpClient.post<ListVisitVM[]>(`${environment.SearchInVisits}${pagenumber}/${pagesize}`, searchObj, this.httpHeader);
  }

  SearchInVisitsCount(searchObj: SearchVisitVM): Observable<number> {
    return this.httpClient.post<number>(`${environment.SearchInVisitsCount}`, searchObj, this.httpHeader);
  }
  GetVisitAttachmentByVisitId(visitId: number): Observable<ListVisitAttachmentVM[]> {
    return this.httpClient.get<ListVisitAttachmentVM[]>(`${environment.GetVisitAttachmentByVisitId}${visitId}`, this.httpHeader);
  }
}
