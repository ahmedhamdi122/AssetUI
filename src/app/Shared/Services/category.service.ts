import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateCategoryVM, EditCategoryVM, ListCategoryVM } from '../Models/categoryVM';
import { Paging } from '../Models/paging';


@Injectable({
  providedIn: 'root'
})

export class CategoryService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetCategories(): Observable<ListCategoryVM[]> {
    return this.httpClient.get<ListCategoryVM[]>(`${environment.ListCategories}`, this.httpHeader);
  }

  GetCategoryByCategoryTypeId(typeId: number): Observable<ListCategoryVM[]> {
    return this.httpClient.get<ListCategoryVM[]>(`${environment.GetCategoryByCategoryTypeId}${typeId}`, this.httpHeader);
  }


  GetCategoryById(id: number): Observable<EditCategoryVM> {
    return this.httpClient.get<EditCategoryVM>(`${environment.GetCategoryById}${id}`, this.httpHeader);
  }
  CreateCategory(categoryVM: CreateCategoryVM): Observable<CreateCategoryVM> {
    return this.httpClient.post<CreateCategoryVM>(`${environment.AddCategory}`, categoryVM, this.httpHeader);
  }


  UpdateCategory(CategoryObj: EditCategoryVM): Observable<EditCategoryVM> {
    return this.httpClient.put<EditCategoryVM>(`${environment.UpdateCategory}`, CategoryObj, this.httpHeader);
  }

  DeleteCategory(id: number): Observable<EditCategoryVM> {
    return this.httpClient.delete<EditCategoryVM>(`${environment.DeleteCategory}${id}`, this.httpHeader);
  }
  GetcategoriesWithPaging(PageInfo: Paging): Observable<ListCategoryVM[]> {
    return this.httpClient.put<ListCategoryVM[]>(`${environment.GetCategorysWithPaging}`, PageInfo, this.httpHeader);
  }

  getCount(): Observable<number> {
    return this.httpClient.get<number>(`${environment.getCategorysCount}`);
  }
}
