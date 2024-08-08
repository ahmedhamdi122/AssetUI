import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateAssetStatusVM, EditAssetStatusVM, ListAssetStatusVM, MainClass, SortAssetStatusVM } from '../Models/assetStatusVM';
import { Paging } from '../Models/paging';



@Injectable({
  providedIn: 'root'
})

export class AssetStatusService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };


  GetAssetStatus(): Observable<ListAssetStatusVM[]> {
    return this.httpClient.get<ListAssetStatusVM[]>(`${environment.ListAssetStatus}`, this.httpHeader);
  }
  GetAssetStatusWithPaging(pageInfo: Paging): Observable<ListAssetStatusVM[]> {
    return this.httpClient.put<ListAssetStatusVM[]>(`${environment.GetAssetStatusWithPaging}`, pageInfo, this.httpHeader);
  }
  GetAssetStatusCount(): Observable<number> {
    return this.httpClient.get<number>(`${environment.GetAssetStatusCount}`, this.httpHeader);
  }



  GetAssetStatusById(id: number): Observable<EditAssetStatusVM> {
    return this.httpClient.get<EditAssetStatusVM>(`${environment.getAssetStatusById}${id}`, this.httpHeader);
  }
  CreateAssetStatus(assetStatusVM: CreateAssetStatusVM): Observable<CreateAssetStatusVM> {
    return this.httpClient.post<CreateAssetStatusVM>(`${environment.AddAssetStatus}`, assetStatusVM, this.httpHeader);
  }
  UpdateAssetStatus(assetStatusObj: EditAssetStatusVM): Observable<EditAssetStatusVM> {
    return this.httpClient.put<EditAssetStatusVM>(`${environment.UpdateAssetStatus}`, assetStatusObj, this.httpHeader);
  }

  DeleteAssetStatus(id: number): Observable<EditAssetStatusVM> {
    return this.httpClient.delete<EditAssetStatusVM>(`${environment.DeleteAssetStatus}${id}`, this.httpHeader);
  }
  SortAssetStatuses(pagenumber: number, pagesize: number, sortObj: SortAssetStatusVM): Observable<ListAssetStatusVM[]> {
    return this.httpClient.post<ListAssetStatusVM[]>(`${environment.SortAssetStatuses}${pagenumber}/${pagesize}`, sortObj, this.httpHeader);
  }




  GetHospitalAssetStatus(statusId: number, userId: string, hospitalId: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.GetHospitalAssetStatus}${statusId}/${userId}/${hospitalId}`, this.httpHeader);
  }



  CreateAssetStatusPDF(lang: string): Observable<any> {
    return this.httpClient.post<any>(`${environment.CreateAssetStatusPDF}${lang}`, this.httpHeader);
  }

  downloadAssetStatusPDF(fileName): any {
    return this.httpClient.get(`${environment.Domain}UploadedAttachments/AssetStatus/${fileName}`, { responseType: 'blob' });
  }


}



