import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CalendarManfacturerPMAssetTimeVM, EditManfacturerPMAssetTimeVM, FilterAssetTimeVM, ListManfacturerPMAssetVM, MainClass, SearchManfacturerAssetTimeVM, SortManfacturerPMAssetTimeVM, UnScheduledMainClass, ViewManfacturerPMAssetTimeVM } from '../Models/manfacturerPMAssetVM';
@Injectable({
  providedIn: 'root'
})
export class ManfacturerpmassetsService {


  constructor(private httpClient: HttpClient) { }
  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };


  //pageNumber:number,pageSize:number
  //UnScheduledMainClass => return Type


  // CreateManfacturerAssetTimes(): Observable<any> {
  //   return this.httpClient.post<any>(`${environment.CreateManfacturerAssetTimes}`, this.httpHeader);
  // }

  CreateManfacturerAssetTimes(pageNumber: number, pageSize: number): Observable<UnScheduledMainClass> {
    return this.httpClient.get<UnScheduledMainClass>(`${environment.CreateManfacturerAssetTimes}/${pageNumber}/${pageSize}`, this.httpHeader);
  }


  //ManufacturerPMAsset/GetAllP
  GetAllManfacturerPMAssetTimes(pageNumber: number, pageSize: Number, userId: string): Observable<MainClass> {
    return this.httpClient.get<MainClass>(`${environment.GetAllManfacturerPMAssetTimes}/${pageNumber}/${pageSize}/${userId}`, this.httpHeader);
  }

  SearchManfacturerAssetTimes(searchManfacturerAssetTimes: SearchManfacturerAssetTimeVM, pageNumber: Number, pageSize: Number, userId: string): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.SearchManfacturerAssetTimes}/${pageNumber}/${pageSize}/${userId}`, searchManfacturerAssetTimes, this.httpHeader);
  }


  GetAllForManfacturerCalendar(hospitalId: number, userId: string): Observable<CalendarManfacturerPMAssetTimeVM[]> {

    return this.httpClient.get<CalendarManfacturerPMAssetTimeVM[]>(`${environment.GetAllForManfacturerCalendar}/${hospitalId}/${userId}`);
  }

  // SortAssetTimes(sortObj: SortAssetTimeVM, pageNumber: number, pageSize: number, userId: string): Observable<MainClass> {
  // return this.httpClient.post<MainClass>(`${environment.SortAssetTimes}${pageNumber}/${pageSize}/${userId}`, sortObj, this.httpHeader);
  // }


  SortManfacturerAssetTimes(sortObj: SortManfacturerPMAssetTimeVM, pageNumber: number, pageSize: number, userId: string): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.SortManfacturerAssetTimes}/${pageNumber}/${pageSize}/${userId}`, sortObj, this.httpHeader);
  }
  GetManfacturerAssetById(id: number): Observable<ViewManfacturerPMAssetTimeVM> {
    return this.httpClient.get<ViewManfacturerPMAssetTimeVM>(`${environment.GetManfacturerAssetById}/${id}`, this.httpHeader);
  }

  // UpdateWNAssetTime(editWNAssetTime: EditWNPMAssetTimeVM): Observable<any> {
  //   return this.httpClient.put<any>(`${environment.UpdateWNAssetTime}`, editWNAssetTime, this.httpHeader);
  // }

  UpdateManfacturerAssetTime(editManfacturerPMAssetTimeVM: EditManfacturerPMAssetTimeVM): Observable<any> {
    return this.httpClient.put<any>(`${environment.UpdateManfacturerAssetTime}`, editManfacturerPMAssetTimeVM, this.httpHeader);
  }

  GetManfacturerAssetModelById(id: number): Observable<EditManfacturerPMAssetTimeVM> {
    return this.httpClient.get<EditManfacturerPMAssetTimeVM>(`${environment.GetManfacturerAssetModelById}/${id}`, this.httpHeader);
  }

  // GetWNPMTimes2(filterObj: FilterAssetTimeVM, pageNumber: number, pageSize: number, userId: string): Observable<MainClass> {
  //   return this.httpClient.post<MainClass>(`${environment.GetAllAssetsTimes}${pageNumber}/${pageSize}/${userId}`, filterObj, this.httpHeader);
  // }

  GetAllManfacturerAssetsTimes2(filterObj: FilterAssetTimeVM, pageNumber: number, pageSize: number, userId: string): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.GetAllManfacturerAssetsTimes}/${pageNumber}/${pageSize}/${userId}`, filterObj, this.httpHeader);
  }


  GetFiscalYearCurrentQuarter(): Observable<any> {
    return this.httpClient.get<any>(`${environment.GetFiscalYearCurrentQuarter}`, this.httpHeader);
  }



}
