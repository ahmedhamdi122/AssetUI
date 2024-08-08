import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateExternalFixVM, GenerateExternalFixNumberVM, ListExternalFixVM, MainClass, SearchExternalFixVM, SortExternalFixVM, ViewExternalFixVM } from '../Models/ExternalFixVM';
import { CreateExternalFixFileVM, EditExternalFixFileVM } from '../Models/externalFixFilesVM';
import { EditExternalFixVM } from '../Models/externalFixVM';

@Injectable({
  providedIn: 'root'
})

export class ExternalFixService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetExternalFixes(): Observable<ListExternalFixVM[]> {
    return this.httpClient.get<ListExternalFixVM[]>(`${environment.ListExternalFixes}`, this.httpHeader);
  }

  GetAllWithPaging(hospitalId: number, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.get<MainClass>(`${environment.GetAllWithPaging}${hospitalId}/${pageNumber}/${pageSize}`, this.httpHeader);
  }

  SearchInExternalFix(searchObj: SearchExternalFixVM, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.SearchInExternalFix}${pageNumber}/${pageSize}`, searchObj, this.httpHeader);
  }

  SortExternalFix(sortObj: SortExternalFixVM, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.SortExternalFix}${pageNumber}/${pageSize}`, sortObj, this.httpHeader);
  }


  GetAssetsExceed72HoursInExternalFix(hospitalId: number, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.get<MainClass>(`${environment.GetAssetsExceed72HoursInExternalFix}${hospitalId}/${pageNumber}/${pageSize}`, this.httpHeader);
  }
  CreateExternalFix(externalFixVMObj: CreateExternalFixVM): Observable<any> {
    return this.httpClient.post<any>(`${environment.AddExternalFix}`, externalFixVMObj, this.httpHeader);
  }

  GenerateExternalFixNumber(): Observable<GenerateExternalFixNumberVM> {
    return this.httpClient.get<GenerateExternalFixNumberVM>(`${environment.GenerateExternalFixNumber}`, this.httpHeader);
  }


  CreateExternalFixFile(externalFixVMObj: CreateExternalFixFileVM): Observable<any> {
    return this.httpClient.post<any>(`${environment.CreateExternalFixFile}`, externalFixVMObj, this.httpHeader);
  }
  ViewExternalFixById(externalFixId: number): Observable<ViewExternalFixVM> {
    return this.httpClient.get<ViewExternalFixVM>(`${environment.ViewExternalFixById}${externalFixId}`, this.httpHeader);
  }
  UpdateExternalFix(EditExternalFixVM: EditExternalFixVM): Observable<EditExternalFixVM> {
    return this.httpClient.put<EditExternalFixVM>(`${environment.EditExternalFix}`, EditExternalFixVM, this.httpHeader);
  }
  delete(id: number) {

    return this.httpClient.delete(`${environment.DeleteExternalFix}/` + id, this.httpHeader);
  }

  // sortBrands(pagenumber: number, pagesize: number, sortObj: SortBrandVM): Observable<ListBrandVM[]> {
  //   return this.httpClient.post<ListBrandVM[]>(`${environment.SortBrands}${pagenumber}/${pagesize}`, sortObj, this.httpHeader);
  // }


  // GetBrandById(id: number): Observable<EditBrandVM> {
  //   return this.httpClient.get<EditBrandVM>(`${environment.GetBrandById}${id}`, this.httpHeader);
  // }
  // CreateBrand(BrandVM: CreateBrandVM): Observable<any> {
  //   return this.httpClient.post<any>(`${environment.AddBrand}`, BrandVM, this.httpHeader);
  // }


  // UpdateBrand(BrandObj: EditBrandVM): Observable<EditBrandVM> {
  //   return this.httpClient.put<EditBrandVM>(`${environment.UpdateBrand}`, BrandObj, this.httpHeader);
  // }



  // GetBrandsWithPaging(PageInfo: Paging): Observable<ListBrandVM[]> {
  //   return this.httpClient.put<ListBrandVM[]>(`${environment.GetBrandsWithPaging}`, PageInfo, this.httpHeader);
  // }

}
