
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateScrapVM, DetailScrapVM, EditScrapVM, GeneratedScrapNumberVM, ListScrapVM, MainClass, SearchScrapVM, SortAndFilterScrapVM, SortScrapsVM, ViewScrapVM } from '../Models/scrapVM';
import { Paging } from '../Models/paging';
import { CreateScrapAttachmentVM, ListScrapAttachmentVM } from '../Models/scrapAttachmentVM';


@Injectable({
  providedIn: 'root'
})

export class ScrapService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'
    })
  };

  GetAllScraps(): Observable<ListScrapVM[]> {
    return this.httpClient.get<ListScrapVM[]>(`${environment.GetAllScraps}`, this.httpHeader);
  }
  SortScraps(pagenumber: number, pagesize: number, sortObj: SortScrapsVM, statusId: number): Observable<ListScrapVM[]> {
    return this.httpClient.post<ListScrapVM[]>(`${environment.SortScraps}${pagenumber}/${pagesize}`, sortObj, this.httpHeader);
  }



  ListScraps(pagenumber: number, pagesize: number, data: SortAndFilterScrapVM): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.ListScraps}${pagenumber}/${pagesize}`, data, this.httpHeader);
  }



  DeleteScrap(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteScrap}${id}`, this.httpHeader);
  }
  GetScrapsWithPaging(pageInfo: Paging): Observable<ListScrapVM[]> {
    return this.httpClient.put<ListScrapVM[]>(`${environment.ListScrapsWithPaging}`, pageInfo, this.httpHeader);
  }

  GetAllScrapsWithPaging(pagenumber: number, pagesize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.GetAllScrapsWithPaging}${pagenumber}/${pagesize}`, this.httpHeader);
  }


  GenerateScrapNumber(): Observable<GeneratedScrapNumberVM> {
    return this.httpClient.get<GeneratedScrapNumberVM>(`${environment.GenerateScrapNumber}`, this.httpHeader);
  }
  getCount(): Observable<number> {
    return this.httpClient.get<number>(`${environment.getScrapscount}`);
  }

  ViewScrapById(id: number): Observable<ViewScrapVM> {
    return this.httpClient.get<ViewScrapVM>(`${environment.ViewScrapById}${id}`, this.httpHeader);
  }
  CreateScrapAttachments(scrapAttachment: CreateScrapAttachmentVM): Observable<number> {
    return this.httpClient.post<number>(`${environment.CreateScrapAttachments}`, scrapAttachment, this.httpHeader);
  }
  CreateScrap(scrapVM: CreateScrapVM): Observable<number> {
    return this.httpClient.post<number>(`${environment.AddScrap}`, scrapVM, this.httpHeader);
  }

  GetScrapById(id: number): Observable<EditScrapVM> {
    return this.httpClient.get<EditScrapVM>(`${environment.GetScrapById}${id}`, this.httpHeader);
  }

  SelectedScrapById(id: number): Observable<ViewScrapVM> {
    return this.httpClient.get<ViewScrapVM>(`${environment.GetScrapById2}${id}`, this.httpHeader);
  }





  SearchInScraps(searchObj: SearchScrapVM, pagenumber: number, pagesize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.SearchInScraps}${pagenumber}/${pagesize}`, searchObj, this.httpHeader);
  }



  getSearchPDFForScraps(searchObj: SearchScrapVM): Observable<ListScrapVM[]> {
    return this.httpClient.post<ListScrapVM[]>(`${environment.CreateScrapPDF}`, searchObj, this.httpHeader);
  }

  CreateScrapCheckedPDF(lstCheckedScraps: ListScrapVM[]): Observable<ListScrapVM[]> {
    return this.httpClient.post<ListScrapVM[]>(`${environment.CreateScrapCheckedPDF}`, lstCheckedScraps, this.httpHeader);
  }




  SearchInScrapsCount(searchObj: SearchScrapVM): Observable<number> {
    return this.httpClient.post<number>(`${environment.SearchInScrapsCount}`, searchObj, this.httpHeader);
  }
  GetScrapAttachmentByScrapId(scrapId: number): Observable<ListScrapAttachmentVM[]> {
    return this.httpClient.get<ListScrapAttachmentVM[]>(`${environment.GetScrapAttachmentByScrapId}${scrapId}`, this.httpHeader);
  }
  GetScrapReasonByScrapId(scrapId: number): Observable<ViewScrapVM[]> {
    return this.httpClient.get<ViewScrapVM[]>(`${environment.GetScrapReasonByScrapId}${scrapId}`, this.httpHeader);
  }
}
