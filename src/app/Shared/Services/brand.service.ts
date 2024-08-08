import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateBrandVM, EditBrandVM, GenerateBrandCode, ListBrandVM, MainClass, SortAndFilterBrandVM, SortBrandVM } from '../Models/brandVM';
import { Paging } from '../Models/paging';


@Injectable({
  providedIn: 'root'
})

export class BrandService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetBrands(): Observable<ListBrandVM[]> {
    return this.httpClient.get<ListBrandVM[]>(`${environment.ListBrands}`, this.httpHeader);
  }

  ListBrands(data: SortAndFilterBrandVM, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.ListAllBrands}${pageNumber}/${pageSize}`, data, this.httpHeader);
  }

  GetTop10Brands(hospitalId: number): Observable<MainClass> {
    return this.httpClient.get<MainClass>(`${environment.GetTop10Brands}${hospitalId}`, this.httpHeader);
  }


  sortBrands(pagenumber: number, pagesize: number, sortObj: SortBrandVM): Observable<ListBrandVM[]> {
    return this.httpClient.post<ListBrandVM[]>(`${environment.SortBrands}${pagenumber}/${pagesize}`, sortObj, this.httpHeader);
  }



  CountBrands(): Observable<number> {
    return this.httpClient.get<number>(`${environment.CountBrands}`, this.httpHeader);
  }


  GetBrandById(id: number): Observable<EditBrandVM> {
    return this.httpClient.get<EditBrandVM>(`${environment.GetBrandById}${id}`, this.httpHeader);
  }
  CreateBrand(BrandVM: CreateBrandVM): Observable<any> {
    return this.httpClient.post<any>(`${environment.AddBrand}`, BrandVM, this.httpHeader);
  }


  UpdateBrand(BrandObj: EditBrandVM): Observable<EditBrandVM> {
    return this.httpClient.put<EditBrandVM>(`${environment.UpdateBrand}`, BrandObj, this.httpHeader);
  }

  DeleteBrand(id: number): Observable<EditBrandVM> {
    return this.httpClient.delete<EditBrandVM>(`${environment.DeleteBrand}${id}`, this.httpHeader);
  }
  GetBrandsWithPaging(PageInfo: Paging): Observable<ListBrandVM[]> {
    return this.httpClient.put<ListBrandVM[]>(`${environment.GetBrandsWithPaging}`, PageInfo, this.httpHeader);
  }

  getBrandsCount(): Observable<number> {
    return this.httpClient.get<number>(`${environment.getBrandsCount}`);
  }


  GenerateBrandCode(): Observable<GenerateBrandCode> {
    return this.httpClient.get<GenerateBrandCode>(`${environment.GenerateBrandCode}`, this.httpHeader);
  }




  CreateBrandPDF(lang: string): Observable<any> {
    return this.httpClient.post<any>(`${environment.CreateBrandPDF}${lang}`, this.httpHeader);
  }

  downloadBrandPDF(fileName): any {
    return this.httpClient.get(`${environment.Domain}UploadedAttachments/BrandPDF/${fileName}`, { responseType: 'blob' });
  }

  AutoCompleteBrandName(brandName: string): Observable<ListBrandVM[]> {
    return this.httpClient.get<ListBrandVM[]>(`${environment.AutoCompleteBrandName}${brandName}`, this.httpHeader);
  }
}
