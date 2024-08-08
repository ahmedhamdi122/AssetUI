import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateSupplierVM, EditSupplierVM, ListSupplierVM } from '../Models/SupplierVM';
import { CreateSubCategoryVM, EditSubCategoryVM, ListSubCategoryVM } from '../Models/subCategoryVM';
import { Paging } from '../Models/paging';
import { IndexSubProblemVM } from '../Models/SubProblemVM';


@Injectable({
  providedIn: 'root'
})

export class SubCategoryService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetSubCategories(): Observable<ListSubCategoryVM[]> {
    return this.httpClient.get<ListSubCategoryVM[]>(`${environment.ListSubCategories}`, this.httpHeader);
  }


  GetSubCategoriesByCategoryId(categoryId): Observable<ListSubCategoryVM[]> {
    return this.httpClient.get<ListSubCategoryVM[]>(`${environment.GetSubCategoryByCategoryId}${categoryId}`, this.httpHeader);
  }

  GetSubCategoryById(id: number): Observable<EditSubCategoryVM> {
    return this.httpClient.get<EditSubCategoryVM>(`${environment.GetSubCategoryById}${id}`, this.httpHeader);
  }
  CreateSubCategory(subCatgoryVM: CreateSubCategoryVM): Observable<CreateSubCategoryVM> {
    return this.httpClient.post<any>(`${environment.AddSubCategory}`, subCatgoryVM, this.httpHeader);
  }


  UpdateSubCategory(SubCategoryObj: EditSubCategoryVM): Observable<EditSubCategoryVM> {
    return this.httpClient.put<EditSubCategoryVM>(`${environment.UpdateSubCategory}`, SubCategoryObj, this.httpHeader);
  }

  DeleteSubCategory(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteSubCategory}${id}`, this.httpHeader);
  }
  GetSubCategoryWithPaging(PageInfo: Paging): Observable<ListSubCategoryVM[]> {
    return this.httpClient.put<ListSubCategoryVM[]>(`${environment.GetSubCategorysWithPaging}`, PageInfo, this.httpHeader);
  }

  getSubCategoryCount(): Observable<number> {
    return this.httpClient.get<number>(`${environment.getSubCategorysCount}`);
  }

}
