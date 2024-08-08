import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateECRIVM, EditECRIVM, ListECRIVM, SortECRIVM } from '../Models/ECRIVM';
import { Paging } from '../Models/paging';


@Injectable({
  providedIn: 'root'
})

export class ECRIService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetECRIS(): Observable<ListECRIVM[]> {
    return this.httpClient.get<ListECRIVM[]>(`${environment.ListECRIs}`, this.httpHeader);
  }

  GetECRISWithPaging(PageInfo: Paging): Observable<ListECRIVM[]> {
    return this.httpClient.put<ListECRIVM[]>(`${environment.GetECRISWithPaging}`, PageInfo, this.httpHeader);
  }


  sortECRI(pagenumber: number, pagesize: number, sortObj: SortECRIVM): Observable<ListECRIVM[]> {
    return this.httpClient.post<ListECRIVM[]>(`${environment.SortECRI}${pagenumber}/${pagesize}`, sortObj, this.httpHeader);
  }



  getCount(): Observable<number> {
    return this.httpClient.get<number>(`${environment.getECRIScount}`);
  }

  GetECRIById(id: number): Observable<EditECRIVM> {
    return this.httpClient.get<EditECRIVM>(`${environment.GetECRIById}${id}`, this.httpHeader);
  }
  CreateECRI(ECRIVM: CreateECRIVM): Observable<CreateECRIVM> {
    return this.httpClient.post<any>(`${environment.AddECRI}`, ECRIVM, this.httpHeader);
  }


  UpdateECRI(ECRIObj: EditECRIVM): Observable<EditECRIVM> {
    return this.httpClient.put<EditECRIVM>(`${environment.UpdateECRI}`, ECRIObj, this.httpHeader);
  }

  DeleteECRI(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteECRI}${id}`, this.httpHeader);
  }

}
