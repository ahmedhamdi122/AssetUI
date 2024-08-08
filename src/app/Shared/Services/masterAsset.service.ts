import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CountMasterAssetByBrandVM, CountMasterAssetBySupplierVM, CreateMasterAssetAttachmentVM, CreateMasterAssetVM, CreatePMAssetTaskVM, EditMasterAssetVM, ListMasterAssetVM, ListPMAssetTaskVM, MainClass, MasterAssetAttachmentVM, SearchMasterAssetVM, SortAndFilterMasterAssetVM, SortMasterAssetVM, ViewMasterAssetVM } from '../Models/masterAssetVM';
import { environment } from 'src/environments/environment';
import { ListPMTimeVM } from '../Models/pmTimeVM';
import { Paging } from '../Models/paging';
import { ListBrandVM } from '../Models/brandVM';



@Injectable({
  providedIn: 'root'
})

export class MasterAssetService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetMasterAssets(): Observable<ListMasterAssetVM[]> {
    return this.httpClient.get<ListMasterAssetVM[]>(`${environment.ListAllMasterAssets}`, this.httpHeader);
  }

  GetTop10MasterAsset(hospitalId: number): Observable<ListMasterAssetVM[]> {
    return this.httpClient.get<ListMasterAssetVM[]>(`${environment.GetTop10MasterAsset}${hospitalId}`, this.httpHeader);
  }



  // GetMasterAssetWithPaging(page: Paging): Observable<ListMasterAssetVM[]> {
  //   return this.httpClient.put<ListMasterAssetVM[]>(`${environment.getMasterAssetWithPaging}`, page, this.httpHeader);
  // }

  GetMasterAssetsWithPagingAndOrder(page: Paging): Observable<ListMasterAssetVM[]> {
    return this.httpClient.put<ListMasterAssetVM[]>(`${environment.GetMasterAssetsWithPagingAndOrder}`, page, this.httpHeader);
  }


  SearchInMasterAssets(pagenumber: number, pagesize: number, searchObj: SearchMasterAssetVM): Observable<ListMasterAssetVM[]> {
    return this.httpClient.post<ListMasterAssetVM[]>(`${environment.SearchInMasterAssets}${pagenumber}/${pagesize}`, searchObj, this.httpHeader);
  }

  // SearchInMasterAssetsCount(searchObj: SearchMasterAssetVM): Observable<number> {
  //   return this.httpClient.post<number>(`${environment.SearchInMasterAssetsCount}`, searchObj, this.httpHeader);
  // };
  sortMasterAsset(pagenumber: number, pagesize: number, sortObj: SortMasterAssetVM): Observable<ListMasterAssetVM[]> {
    return this.httpClient.post<ListMasterAssetVM[]>(`${environment.SortMasterAssets}${pagenumber}/${pagesize}`, sortObj, this.httpHeader);
  }

  getCount(): Observable<number> {
    return this.httpClient.get<number>(`${environment.getMasterAssetCount}`);
  }
  ListMasterAssetsByHospitalId(hospitalId: number): Observable<ListMasterAssetVM[]> {
    return this.httpClient.get<ListMasterAssetVM[]>(`${environment.ListMasterAssetsByHospitalId}${hospitalId}`, this.httpHeader);
  }


  ListMasterAssetsByHospitalUserId(hospitalId: number, userId: string): Observable<ListMasterAssetVM[]> {
    return this.httpClient.get<ListMasterAssetVM[]>(`${environment.ListMasterAssetsByHospitalUserId}${hospitalId}/${userId}`, this.httpHeader);
  }

  GetListMasterAssets(data: SortAndFilterMasterAssetVM, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.GetListMasterAsset}${pageNumber}/${pageSize}`, data, this.httpHeader);
  }

  CountMasterAssets(): Observable<number> {
    return this.httpClient.get<number>(`${environment.CountMasterAssets}`, this.httpHeader);
  }


  GetTop10MasterAssetCount(hospitalId: number): Observable<number> {
    return this.httpClient.get<number>(`${environment.GetTop10MasterAssetCount}${hospitalId}`, this.httpHeader);
  }

  CountMasterAssetsByBrand(hospitalId: number): Observable<CountMasterAssetByBrandVM[]> {
    return this.httpClient.get<CountMasterAssetByBrandVM[]>(`${environment.CountMasterAssetsByBrand}${hospitalId}`, this.httpHeader);
  }


  CountMasterAssetsBySupplier(hospitalId: number): Observable<CountMasterAssetBySupplierVM[]> {
    return this.httpClient.get<CountMasterAssetBySupplierVM[]>(`${environment.CountMasterAssetsBySupplier}${hospitalId}`, this.httpHeader);
  }




  GetMasterAssetById(id: number): Observable<EditMasterAssetVM> {
    return this.httpClient.get<EditMasterAssetVM>(`${environment.GetMasterAssetById}${id}`, this.httpHeader);
  }


  GetMasterAssetById2(id: number): Observable<ListMasterAssetVM> {
    return this.httpClient.get<ListMasterAssetVM>(`${environment.GetMasterAssetById}${id}`, this.httpHeader);
  }


  AutoCompleteMasterAssetName(name: string): Observable<ListMasterAssetVM[]> {
    return this.httpClient.get<ListMasterAssetVM[]>(`${environment.AutoCompleteMasterAssetName}${name}`, this.httpHeader);
  }

  AutoCompleteMasterAssetName2(name: string): Observable<ListMasterAssetVM[]> {
    return this.httpClient.get<ListMasterAssetVM[]>(`${environment.AutoCompleteMasterAssetName2}${name}`, this.httpHeader);
  }
  AutoCompleteMasterAssetName3(name: string, hospitalId: number): Observable<ListMasterAssetVM[]> {
    return this.httpClient.get<ListMasterAssetVM[]>(`${environment.AutoCompleteMasterAssetName3}${name}/${hospitalId}`, this.httpHeader);
  }
  DistinctAutoCompleteMasterAssetName(name: string): Observable<ListMasterAssetVM[]> {
    return this.httpClient.get<ListMasterAssetVM[]>(`${environment.DistinctAutoCompleteMasterAssetName}${name}`, this.httpHeader);
  }


  
  // GetDistintMasterAssetModels(name: string): Observable<string[]> {
  //   return this.httpClient.get<string[]>(`${environment.GetDistintMasterAssetModels}${name}`, this.httpHeader);
  // }

  GetDistintMasterAssetModels(brandId: number,name: string): Observable<string[]> {
    return this.httpClient.get<string[]>(`${environment.GetDistintMasterAssetModels}${brandId}/${name}`, this.httpHeader);
  }


  GetDistintMasterAssetBrands(name: string): Observable<ListBrandVM[]> {
    return this.httpClient.get<ListBrandVM[]>(`${environment.GetDistintMasterAssetBrands}${name}`, this.httpHeader);
  }




  ViewMasterAssetById(id: number): Observable<ViewMasterAssetVM> {
    return this.httpClient.get<ViewMasterAssetVM>(`${environment.ViewMasterAssetById}${id}`, this.httpHeader);
  }

  ListPMTimes(): Observable<ListPMTimeVM[]> {
    return this.httpClient.get<ListPMTimeVM[]>(`${environment.ListPMTimes}`, this.httpHeader);
  }


  GenerateMasterAssetcode(): Observable<any> {
    return this.httpClient.get<any>(`${environment.GenerateMasterAssetcode}`, this.httpHeader);
  }


  CreateMasterAsset(MasterAssetVM: CreateMasterAssetVM): Observable<number> {
    return this.httpClient.post<any>(`${environment.AddMasterAsset}`, MasterAssetVM, this.httpHeader);
  }

  UpdateMasterAsset(MasterAssetVM: EditMasterAssetVM): Observable<EditMasterAssetVM> {
    return this.httpClient.put<EditMasterAssetVM>(`${environment.UpdateMasterAsset}`, MasterAssetVM, this.httpHeader);
  }

  UpdateMasterAssetImageAfterInsert(MasterAssetVM: CreateMasterAssetVM): Observable<number> {
    return this.httpClient.put<number>(`${environment.UpdateMasterAssetImageAfterInsert}`, MasterAssetVM, this.httpHeader);
  }



  DeleteMasterAsset(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteMasterAsset}${id}`, this.httpHeader);
  }


  CreateMasterAssetAttachments(attachObj: CreateMasterAssetAttachmentVM): Observable<CreateMasterAssetAttachmentVM> {
    return this.httpClient.post<any>(`${environment.CreateMasterAssetAttachments}`, attachObj, this.httpHeader);
  }


  GetAttachmentByMasterAssetId(assetId: number): Observable<MasterAssetAttachmentVM[]> {
    return this.httpClient.get<MasterAssetAttachmentVM[]>(`${environment.GetAttachmentByMasterAssetId}${assetId}`, this.httpHeader);
  }



  DeleteMasterAssetAttachmentById(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteMasterAssetAttachmentById}${id}`, this.httpHeader);
  }



  AddPMAssetTask(model: CreatePMAssetTaskVM): Observable<number> {
    return this.httpClient.post<any>(`${environment.CreatePMAssetTask}`, model, this.httpHeader);
  }

  GetLastDocumentForMsterAssetId(masterId: number): Observable<MasterAssetAttachmentVM> {
    return this.httpClient.get<MasterAssetAttachmentVM>(`${environment.GetLastDocumentForMsterAssetId}${masterId}`, this.httpHeader);
  }


  GetPMAssetTaskByMasterAssetId(masterAssetId: number): Observable<ListPMAssetTaskVM[]> {
    return this.httpClient.get<ListPMAssetTaskVM[]>(`${environment.GetPMAssetTaskByMasterAssetId}${masterAssetId}`, this.httpHeader);
  }

  GetPMAssetTaskByTaskIdAndMasterAssetId(masterAssetId: number, taskId: number): Observable<ListPMAssetTaskVM> {
    return this.httpClient.get<ListPMAssetTaskVM>(`${environment.GetPMAssetTaskByTaskIdAndMasterAssetId}${masterAssetId}/${taskId}`, this.httpHeader);
  }



  DeletePMAssetTask(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeletePMAssetTask}${id}`, this.httpHeader);
  }





  DeleteMasterAssetImage(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteMasterAssetImage}${id}`, this.httpHeader);
  }
}
