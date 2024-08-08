import { Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateRoleCategoryVM, EditRoleCategoryVM, ListRoleCategoriesVM, MainClass, SortRoleCategoryVM } from '../Models/rolecategoryVM';


@Injectable({
  providedIn: 'root'
})

export class RoleCategoryService {

  constructor(private httpClient: HttpClient) {
  }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetRoleCategories(): Observable<ListRoleCategoriesVM[]> {
    return this.httpClient.get<ListRoleCategoriesVM[]>(`${environment.ListRoleCategories}`, this.httpHeader);
  }

  GetRoleCategoryById(id: number): Observable<EditRoleCategoryVM> {
    return this.httpClient.get<EditRoleCategoryVM>(`${environment.GetRoleCategoryById}${id}`, this.httpHeader);
  }

  UpdateRoleCategory(editRoleCategoryObj: EditRoleCategoryVM): Observable<EditRoleCategoryVM> {
    return this.httpClient.put<EditRoleCategoryVM>(`${environment.UpdateRoleCategory}`, editRoleCategoryObj, this.httpHeader);
  }

  AddRoleCategories(createRoleCategoryObj: CreateRoleCategoryVM): Observable<CreateRoleCategoryVM> {
    return this.httpClient.post<CreateRoleCategoryVM>(`${environment.AddRoleCategory}`, createRoleCategoryObj, this.httpHeader);
  }


  DeleteRoleCategory(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteRoleCategory}${id}`, this.httpHeader);
  }

  SortRoleCategories(pageNumber: number, pageSize: number, sortObj: SortRoleCategoryVM): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.SortRoleCategories}${pageNumber}/${pageSize}`, sortObj, this.httpHeader);
  }


  GenerateRoleCategoryOrderId(): Observable<any> {
    return this.httpClient.get<any>(`${environment.GenerateRoleCategoryOrderId}`, this.httpHeader);
  }


}
