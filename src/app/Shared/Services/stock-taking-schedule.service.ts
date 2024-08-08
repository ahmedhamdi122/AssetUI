import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateStockTakingScheduleVM, GenerateStockScheduleTakingNumberVM, ListStockTakingScheduleVM, MainClass, SearchStockTakingScheduleVM, SortStockTakingScheduleVM } from '../Models/StockTakingScheduleVM';

@Injectable({
  providedIn: 'root'
})

export class StockTakingScheduleService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  CreateStockTakingSchedule(stockTakingScheduleObj: CreateStockTakingScheduleVM): Observable<any> {
    return this.httpClient.post<any>(`${environment.CreateStockTakingSchedule}`, stockTakingScheduleObj, this.httpHeader);
  }
  GetAllWithPaging(pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.get<MainClass>(`${environment.GetAllStockTakingScheduleWithPaging}${pageNumber}/${pageSize}`, this.httpHeader);
  }


  delete(id: number) {

    return this.httpClient.delete(`${environment.DeleteStockTakingSchedule}/` + id, this.httpHeader);
  }

  GenerateStockScheduleTakingNumber(): Observable<GenerateStockScheduleTakingNumberVM> {
    return this.httpClient.get<GenerateStockScheduleTakingNumberVM>(`${environment.GenerateStockScheduleTakingNumber}`, this.httpHeader);
  }
  GetStockTakingScheduleById(id: number): Observable<ListStockTakingScheduleVM> {
    return this.httpClient.get<ListStockTakingScheduleVM>(`${environment.GetStockTakingScheduleById}/` + id, this.httpHeader);
  }


  SearchStockTackingSchedule(searchObj: SearchStockTakingScheduleVM, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.SearchStockTackingSchedule}${pageNumber}/${pageSize}`, searchObj, this.httpHeader);
  }

  SortStockTakingSchedule(sortObj: SortStockTakingScheduleVM, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.SortStockTakingSchedule}${pageNumber}/${pageSize}`, sortObj, this.httpHeader);
  }

}
