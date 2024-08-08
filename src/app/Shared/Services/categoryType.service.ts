import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateCategoryTypeVM, EditCategoryTypeVM, ListCategoryTypeVM } from '../Models/CategoryTypeVM';
import { Paging } from '../Models/paging';


@Injectable({
  providedIn: 'root'
})

export class CategoryTypeService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetCategoryTypes(): Observable<ListCategoryTypeVM[]> {
    return this.httpClient.get<ListCategoryTypeVM[]>(`${environment.ListCategoryTypes}`, this.httpHeader);
  }

  GetCategoryTypeById(id: number): Observable<EditCategoryTypeVM> {
    return this.httpClient.get<EditCategoryTypeVM>(`${environment.GetCategoryTypeById}${id}`, this.httpHeader);
  }
  CreateCategoryType(CategoryTypeVM: CreateCategoryTypeVM): Observable<CreateCategoryTypeVM> {
    return this.httpClient.post<CreateCategoryTypeVM>(`${environment.AddCategoryType}`, CategoryTypeVM, this.httpHeader);
  }
  UpdateCategoryType(CategoryTypeObj: EditCategoryTypeVM): Observable<EditCategoryTypeVM> {
    return this.httpClient.put<EditCategoryTypeVM>(`${environment.UpdateCategoryType}`, CategoryTypeObj, this.httpHeader);
  }
  DeleteCategoryType(id: number): Observable<EditCategoryTypeVM> {
    return this.httpClient.delete<EditCategoryTypeVM>(`${environment.DeleteCategoryType}${id}`, this.httpHeader);
  }
}
