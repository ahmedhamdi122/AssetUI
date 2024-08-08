import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListSupplierVM } from '../Models/supplierVM';
import { CreateOriginVM, EditOriginVM, ListOriginVM, SortOriginVM } from '../Models/originVM';
import { Paging } from '../Models/paging';


@Injectable({
  providedIn: 'root'
})

export class OriginService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetOrigins(): Observable<ListOriginVM[]> {
    return this.httpClient.get<ListOriginVM[]>(`${environment.ListOrigins}`, this.httpHeader);
  }


  GetOriginById(id: number): Observable<EditOriginVM> {
    return this.httpClient.get<EditOriginVM>(`${environment.GetOriginById}${id}`, this.httpHeader);
  }
  CreateOrigin(OriginVM: CreateOriginVM): Observable<CreateOriginVM> {
    return this.httpClient.post<any>(`${environment.AddOrigin}`, OriginVM, this.httpHeader);
  }


  UpdateOrigin(OriginObj: EditOriginVM): Observable<EditOriginVM> {
    return this.httpClient.put<EditOriginVM>(`${environment.UpdateOrigin}`, OriginObj, this.httpHeader);
  }

  DeleteOrigin(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteOrigin}${id}`, this.httpHeader);
  }
  GetOriginsWithPaging(PageInfo: Paging): Observable<ListOriginVM[]> {
    return this.httpClient.put<ListOriginVM[]>(`${environment.GetOriginsWithPaging}`, PageInfo, this.httpHeader);
  }

  getCount(): Observable<number> {
    return this.httpClient.get<number>(`${environment.getOriginscount}`);
  }

  SortOrigins(pagenumber: number, pagesize: number, sortObj: SortOriginVM): Observable<ListSupplierVM[]> {
    return this.httpClient.post<ListSupplierVM[]>(`${environment.SortOrigins}${pagenumber}/${pagesize}`, sortObj, this.httpHeader);
  }



  CreateOriginPDF(lang: string): Observable<any> {
    return this.httpClient.post<any>(`${environment.CreateOriginPDF}${lang}`, this.httpHeader);
  }

  downloadOriginPDF(fileName): any {
    return this.httpClient.get(`${environment.Domain}UploadedAttachments/OriginPDF/${fileName}`, { responseType: 'blob' });
  }

}
