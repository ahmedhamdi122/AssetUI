import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CalendarWNPMAssetTimeVM, CreateWNPMAssetTimeAttachment, FilterAssetTimeVM, ListWNPMAssetTimeAttachment, MainClass, SearchAssetTimeVM, SearchWNPMDateVM, SortAssetTimeVM, ViewWNPMAssetTimeVM, YearQuarters } from '../Models/wnPMAssetTimeVM';
import { environment } from 'src/environments/environment';
import { EditWNPMAssetTimeVM } from '../Models/wnPMAssetTimeVM'

@Injectable({
  providedIn: 'root'
})

export class WNPMAssetTimeService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'
    })
  };
  GetWNPMTimes2(filterObj: FilterAssetTimeVM, pageNumber: number, pageSize: number, userId: string): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.GetAllAssetsTimes}${pageNumber}/${pageSize}/${userId}`, filterObj, this.httpHeader);
  }
  UpdateWNAssetTime(editWNAssetTime: EditWNPMAssetTimeVM): Observable<any> {
    return this.httpClient.put<any>(`${environment.UpdateWNAssetTime}`, editWNAssetTime, this.httpHeader);
  }
  GetWNAssetTimeById(id: number): Observable<EditWNPMAssetTimeVM> {
    return this.httpClient.get<EditWNPMAssetTimeVM>(`${environment.GetWNAssetTimeById}${id}`, this.httpHeader);
  }
  SearchAssetTimes(searchObj: SearchAssetTimeVM, pageNumber: number, pageSize: number, userId: string): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.SearchAssetTimes}${pageNumber}/${pageSize}/${userId}`, searchObj, this.httpHeader);
  }
  SortAssetTimes(sortObj: SortAssetTimeVM, pageNumber: number, pageSize: number, userId: string): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.SortAssetTimes}${pageNumber}/${pageSize}/${userId}`, sortObj, this.httpHeader);
  }
  GetAllAssetTimesIsDone(isDone: boolean, pageNumber: number, pageSize: number, userId: string): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.GetAllAssetTimesIsDone}${isDone}/${pageNumber}/${pageSize}/${userId}`, this.httpHeader);
  }
  GetYearQuarters(): Observable<YearQuarters[]> {
    return this.httpClient.get<YearQuarters[]>(`${environment.GetYearQuarters}`, this.httpHeader);
  }
  GetAssetTimeById(id: number): Observable<ViewWNPMAssetTimeVM> {
    return this.httpClient.get<ViewWNPMAssetTimeVM>(`${environment.GetAssetTimeById}${id}`, this.httpHeader);
  }
  GetAllForCalendar(hospitalId: number, userId: string): Observable<CalendarWNPMAssetTimeVM[]> {
    return this.httpClient.get<CalendarWNPMAssetTimeVM[]>(`${environment.GetAllForCalendar}${hospitalId}/${userId}`, this.httpHeader);
  }
  CreateAssetTimes(year: number, hospitalId: number): Observable<number> {
    return this.httpClient.post<number>(`${environment.CreateAssetTimes}${year}/${hospitalId}`, this.httpHeader);
  }
  CreateWNPMAssetTimeAttachment(attachObj: CreateWNPMAssetTimeAttachment): Observable<number> {
    return this.httpClient.post<number>(`${environment.CreateWNPMAssetTimeAttachment}`, attachObj, this.httpHeader);
  }


  GetWNPMAssetTimeAttachmentByWNPMAssetTimeId(wnpmAssetTimeId: number): Observable<ListWNPMAssetTimeAttachment[]> {
    return this.httpClient.get<ListWNPMAssetTimeAttachment[]>(`${environment.GetWNPMAssetTimeAttachmentByWNPMAssetTimeId}${wnpmAssetTimeId}`, this.httpHeader);
  }

  GetFiscalYearQuarters(): Observable<YearQuarters[]> {
    return this.httpClient.get<YearQuarters[]>(`${environment.GetFiscalYearQuarters}`, this.httpHeader);
  }

  CreateAssetFiscalTimes(year: number, hospitalId: number): Observable<number> {
    return this.httpClient.post<number>(`${environment.CreateAssetFiscalTimes}${year}/${hospitalId}`, this.httpHeader);
  }


  GetFiscalYearCurrentQuarter(): Observable<any> {
    return this.httpClient.get<any>(`${environment.GetFiscalYearCurrentQuarter}`, this.httpHeader);
  }



  GetAllWithDate(serachObj: SearchWNPMDateVM, pageNumber: number, pageSize: number, userId: string): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.GetAllWithDate}${pageNumber}/${pageSize}/${userId}`, serachObj, this.httpHeader);
  }
}
