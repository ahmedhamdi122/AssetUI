import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { MainClass, SearchAssetStockTakingVM } from '../Models/assetStockTaking';


@Injectable({
  providedIn: 'root'
})

export class AssetStockTakingService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };


  GetAssetStockTakingWithPaging(pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.get<MainClass>(`${environment.ListAssetStockTakings}${pageNumber}/${pageSize}`, this.httpHeader);
  }



  SearchAssetStockTacking(searchObj: SearchAssetStockTakingVM, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.SearchAssetStockTakings}${pageNumber}/${pageSize}`, searchObj, this.httpHeader);
  }

  // SortStockTakingSchedule(sortObj: SortStockTakingScheduleVM, pageNumber: number, pageSize: number): Observable<MainClass> {
  //   return this.httpClient.post<MainClass>(`${environment.SortStockTakingSchedule}${pageNumber}/${pageSize}`, sortObj, this.httpHeader);
  // }

}
