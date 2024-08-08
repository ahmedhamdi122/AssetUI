import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateSupplierExecludeAssetAttachmentVM, CreateSupplierExecludeAssetVM, EditSupplierExecludeAssetVM, ListSupplierExecludeAssetVM, MainClass, SearchSupplierExecludeAssetDateVM, SearchSupplierExecludeAssetVM, SortAndFilterSupplierExecludeAssetVM, SortSupplierExecludeAssetVM, SupplierExecludeAssetAttachmentVM, ViewSupplierExecludeAssetVM } from '../Models/supplierExecludeAssetVM';
import { Paging } from '../Models/paging';


@Injectable({
  providedIn: 'root'
})

export class SupplierExecludeAssetService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  // GetSupplierExecludeAssets(): Observable<ListSupplierExecludeAssetVM[]> {
  //   return this.httpClient.get<ListSupplierExecludeAssetVM[]>(`${environment.ListSupplierExcludeAssets}`, this.httpHeader);
  // }

  GetAttachmentBySupplierExcludeAssetId(supplierExecludeAssetId: number): Observable<ListSupplierExecludeAssetVM[]> {
    return this.httpClient.get<ListSupplierExecludeAssetVM[]>(`${environment.GetAttachmentBySupplierExcludeAssetId}${supplierExecludeAssetId}`, this.httpHeader);
  }


  GenerateSupplierExecludeAssetNumber(): Observable<string> {
    return this.httpClient.get<string>(`${environment.GenerateSupplierExecludeAssetNumber}`);
  }

  // GetSupplierExecludeAssetsWithPaging(page: Paging): Observable<ListSupplierExecludeAssetVM[]> {
  //   return this.httpClient.put<ListSupplierExecludeAssetVM[]>(`${environment.ListSupplierExcludeAssetsWithPaging}`, page, this.httpHeader);
  // }

  // GetSupplierExecludeAssetsWithPagingAndTypeId(appTypeId: number, page: Paging): Observable<ListSupplierExecludeAssetVM[]> {
  //   return this.httpClient.put<ListSupplierExecludeAssetVM[]>(`${environment.ListSupplierExcludeAssetsWithPagingAndTypeId}${appTypeId}`, page, this.httpHeader);
  // }


  GetSupplierExcludeAssetByDate(pagenumber: number, pagesize: number, searchObj: SearchSupplierExecludeAssetDateVM): Observable<ListSupplierExecludeAssetVM[]> {
    return this.httpClient.post<ListSupplierExecludeAssetVM[]>(`${environment.GetSupplierExcludeAssetByDate}${pagenumber}/${pagesize}`, searchObj, this.httpHeader);
  }
  CountSupplierExcludeAssetByDate(searchObj: SearchSupplierExecludeAssetDateVM): Observable<number> {
    return this.httpClient.post<number>(`${environment.CountSupplierExcludeAssetByDate}`, searchObj, this.httpHeader);
  }



  // ListSupplierExcludeAssetsWithPagingWithStatusIdAndTypeId(statusId: number, appTypeId: number, page: Paging): Observable<ListSupplierExecludeAssetVM[]> {
  //   return this.httpClient.put<ListSupplierExecludeAssetVM[]>(`${environment.ListSupplierExcludeAssetsWithPagingWithStatusIdAndTypeId}${statusId}/${appTypeId}`, page, this.httpHeader);
  // }
  // CountListSupplierExcludeAssetsWithPagingWithStatusIdAndTypeId(statusId: number, appTypeId: number): Observable<number> {
  //   return this.httpClient.get<number>(`${environment.CountListSupplierExcludeAssetsWithPagingWithStatusIdAndTypeId}${statusId}/${appTypeId}`, this.httpHeader);
  // }


  ListSupplierExcludeAssets(data: SortAndFilterSupplierExecludeAssetVM, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.ListSupplierExecludeAssets}${pageNumber}/${pageSize}`, data, this.httpHeader);
  }






  GetAllSuppliersByStatusId(page: Paging, statusId: number): Observable<ListSupplierExecludeAssetVM[]> {
    return this.httpClient.put<ListSupplierExecludeAssetVM[]>(`${environment.GetAllByStatusId}${statusId}`, page, this.httpHeader);
  }
  GetCountAfterFilterStatusId(statusId: number): Observable<number> {
    return this.httpClient.get<number>(`${environment.GetCountAfterFilterStatusId}${statusId}`);
  }


  getCountByAppTypeId(appTypeId: number): Observable<number> {
    return this.httpClient.get<number>(`${environment.GetcountByAppTypeId}/${appTypeId}`, this.httpHeader);
  }


  getCount(): Observable<number> {
    return this.httpClient.get<number>(`${environment.getSupplierExecludeAssetCount}`, this.httpHeader);
  }


  GetSupplierExecludeAssetById(id: number): Observable<EditSupplierExecludeAssetVM> {
    return this.httpClient.get<EditSupplierExecludeAssetVM>(`${environment.GetSupplierExecludeAssetById}${id}`, this.httpHeader);
  }


  GetSupplierExecludeAssetDetailById(id: number): Observable<ViewSupplierExecludeAssetVM> {
    return this.httpClient.get<ViewSupplierExecludeAssetVM>(`${environment.GetSupplierExecludeAssetDetailById}${id}`, this.httpHeader);
  }

  CreateSupplierExecludeAsset(supplierExecludeAssetObj: CreateSupplierExecludeAssetVM): Observable<number> {
    return this.httpClient.post<any>(`${environment.AddSupplierExecludeAsset}`, supplierExecludeAssetObj, this.httpHeader);
  }


  UpdateSupplierExecludeAsset(SupplierExecludeAssetObj: EditSupplierExecludeAssetVM): Observable<EditSupplierExecludeAssetVM> {
    return this.httpClient.put<EditSupplierExecludeAssetVM>(`${environment.UpdateSupplierExecludeAsset}`, SupplierExecludeAssetObj, this.httpHeader);
  }


  UpdateExcludedDate(model: EditSupplierExecludeAssetVM): Observable<EditSupplierExecludeAssetVM> {
    return this.httpClient.put<EditSupplierExecludeAssetVM>(`${environment.UpdateSupplierExcludedDate}`, model, this.httpHeader);
  }

  SortSuplierApp(pagenumber: number, pagesize: number, sortObj: SortSupplierExecludeAssetVM): Observable<ListSupplierExecludeAssetVM[]> {
    return this.httpClient.post<ListSupplierExecludeAssetVM[]>(`${environment.SortSuplierApp}${pagenumber}/${pagesize}`, sortObj, this.httpHeader);
  }



  DeleteSupplierExecludeAsset(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteSupplierExecludeAsset}${id}`, this.httpHeader);
  }



  CreateSupplierExecludeAssetAttachments(attachObj: CreateSupplierExecludeAssetAttachmentVM): Observable<CreateSupplierExecludeAssetAttachmentVM> {
    return this.httpClient.post<any>(`${environment.CreateSupplierExecludeAssetAttachments}`, attachObj, this.httpHeader);
  }
  GetAttachmentBySupplierExecludeAssetId(supplierExecludeAssetId: number): Observable<SupplierExecludeAssetAttachmentVM[]> {
    return this.httpClient.get<SupplierExecludeAssetAttachmentVM[]>(`${environment.GetAttachmentBySupplierExecludeAssetId}${supplierExecludeAssetId}`, this.httpHeader);
  }
  DeleteSupplierExecludeAssetAttachmentById(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteSupplierExecludeAssetAttachment}${id}`, this.httpHeader);
  }


  SendSupplierExcludeEmail(supplierExecludeAssetId: number): Observable<any> {
    return this.httpClient.get<any>(`${environment.SendSupplierExcludeEmail}${supplierExecludeAssetId}`, this.httpHeader);
  }


  GetAllSupplierExecludes(searchObj: SearchSupplierExecludeAssetDateVM, statusId: number, appTypeId: number, hospitalId: number, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.GetAllSupplierExecludes}${statusId}/${appTypeId}/${hospitalId}/${pageNumber}/${pageSize}`, searchObj, this.httpHeader);
  }

  GetAllSupplierHolds(searchObj: SearchSupplierExecludeAssetDateVM, statusId: number, appTypeId: number, hospitalId: number, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.GetAllSupplierHolds}${statusId}/${appTypeId}/${hospitalId}/${pageNumber}/${pageSize}`, searchObj, this.httpHeader);
  }


  // SearchSupplierExecludes(searchObj: SearchSupplierExecludeAssetVM, pageNumber: number, pageSize: number): Observable<MainClass> {
  //   return this.httpClient.post<MainClass>(`${environment.SearchSupplierExecludes}${pageNumber}/${pageSize}`, searchObj, this.httpHeader);
  // }



  // PrintSearchSupplierAssetExecludes(searchObj: SearchSupplierExecludeAssetVM): Observable<ListSupplierExecludeAssetVM[]> {
  //   return this.httpClient.post<ListSupplierExecludeAssetVM[]>(`${environment.CreateSupplierExecludePDF}`, searchObj, this.httpHeader);
  // }


  PrintSearchSupplierAssetExecludes(data: SortAndFilterSupplierExecludeAssetVM): Observable<ListSupplierExecludeAssetVM[]> {
    return this.httpClient.post<ListSupplierExecludeAssetVM[]>(`${environment.CreateSupplierExecludePDF}`, data, this.httpHeader);
  }


}
