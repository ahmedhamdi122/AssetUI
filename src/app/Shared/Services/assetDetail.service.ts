import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  AssetDetailAttachmentVM, AssetDetailVM, AssetOwnerVM, CountAssetVM, CreateAssetDetailAttachmentVM,
  CreateAssetDetailVM, EditAssetDetailVM, FilterAssetDetail, filterDto, GeneratedAssetDetailBCVM, HospitalAssetAge,
  ListAssetDetailVM, ListPMAssetTaskScheduleVM, MainClass, RequestMainClass, SearchHospitalAssetVM, SortAndFilterVM, SortAssetDetailsVM, SortAssetDetailVM,
  SortAssetVM,
  ViewAssetDetailVM, ViewAssetForReportVM
} from '../Models/assetDetailVM';
import { PmDateGroupVM } from '../Models/pmAssetTimeVM';
import { addPMAssetTaskScheduleVM } from '../Models/pmAssetTaskScheduleVM';
import { Paging } from '../Models/paging';
import { BrandGroupVM } from '../Models/brandVM';
import { HospitalGroupVM } from '../Models/hospitalVM';
import { GroupGovernorateVM } from '../Models/governorateVM';
import { GroupcityVM } from '../Models/cityVM';
import { GroupSupplierVM } from '../Models/supplierVM';
import { GroupOrganizationVM } from '../Models/organizationVM';
import { DepartmentGroupVM } from '../Models/departmentVM';



@Injectable({
  providedIn: 'root'
})

export class AssetDetailService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetAssets(): Observable<ListAssetDetailVM[]> {
    return this.httpClient.get<ListAssetDetailVM[]>(`${environment.ListAssets}`, this.httpHeader);
  }
  GetAssetsByAgeGroup(hospitalId: number): Observable<HospitalAssetAge[]> {
    return this.httpClient.get<HospitalAssetAge[]>(`${environment.GetAssetsByAgeGroup}${hospitalId}`, this.httpHeader);
  }

  GetGeneralAssetsByAgeGroup(searchObj: SearchHospitalAssetVM): Observable<HospitalAssetAge[]> {
    return this.httpClient.post<HospitalAssetAge[]>(`${environment.GetGeneralAssetsByAgeGroup}`, searchObj, this.httpHeader);
  }

  ListAssetDetailCarouselByUserId(userId: string): Observable<ListAssetDetailVM[]> {
    return this.httpClient.get<ListAssetDetailVM[]>(`${environment.ListAssetDetailCarouselByUserId}${userId}`, this.httpHeader);
  }
  ListAssetsByHospitalId(hospitaId: number): Observable<ListAssetDetailVM[]> {
    return this.httpClient.get<ListAssetDetailVM[]>(`${environment.GetListOfAssetDetailsByHospitalId}${hospitaId}`, this.httpHeader);
  }

  CountAssetsByHospitalId(hospitaId: number): Observable<number> {
    return this.httpClient.get<number>(`${environment.CountAssetsByHospitalId}${hospitaId}`, this.httpHeader);
  }

  ListTopAssetsByHospitalId(hospitalId: number): Observable<CountAssetVM[]> {
    return this.httpClient.get<CountAssetVM[]>(`${environment.ListTopAssetsByHospitalId}${hospitalId}`, this.httpHeader);
  }

  CountAssetsInHospitalByHospitalId(hospitalId: number): Observable<CountAssetVM[]> {
    return this.httpClient.get<CountAssetVM[]>(`${environment.CountAssetsInHospitalByHospitalId}${hospitalId}`, this.httpHeader);
  }


  ListAssetsByGovernorateIds(): Observable<CountAssetVM[]> {
    return this.httpClient.get<CountAssetVM[]>(`${environment.ListAssetsByGovernorateIds}`, this.httpHeader);
  }

  ListAssetsByCityIds(): Observable<CountAssetVM[]> {
    return this.httpClient.get<CountAssetVM[]>(`${environment.ListAssetsByCityIds}`, this.httpHeader);
  }

  GetListOfAssetDetailsByHospitalNotInContract(hospitaId: number): Observable<ListAssetDetailVM[]> {
    return this.httpClient.get<ListAssetDetailVM[]>(`${environment.GetListOfAssetDetailsByHospitalNotInContract}${hospitaId}`, this.httpHeader);
  }

  GetListOfAssetDetailsByHospitalNotInContract2(barcode: string, hospitaId: number): Observable<ListAssetDetailVM[]> {
    return this.httpClient.get<ListAssetDetailVM[]>(`${environment.GetListOfAssetDetailsByHospitalNotInContract2}${barcode}/${hospitaId}`, this.httpHeader);
  }

  GetListOfAssetDetailsByHospitalNotInContractBySerialNumber(serialNumber: string, hospitaId: number): Observable<ListAssetDetailVM[]> {
    return this.httpClient.get<ListAssetDetailVM[]>(`${environment.GetListOfAssetDetailsByHospitalNotInContractBySerialNumber}${serialNumber}/${hospitaId}`, this.httpHeader);
  }

  GetAllAssets(): Observable<ViewAssetDetailVM[]> {
    return this.httpClient.get<ViewAssetDetailVM[]>(`${environment.GetAllAssets}`, this.httpHeader);
  }
  GetAllAssetsDetails(): Observable<AssetDetailVM[]> {
    return this.httpClient.get<AssetDetailVM[]>(`${environment.ListAssets}`, this.httpHeader);
  }

  GetAllAssetDetailsPaging(page: Paging): Observable<AssetDetailVM[]> {
    return this.httpClient.post<AssetDetailVM[]>(`${environment.ListAssets}`, page, this.httpHeader);
  }

  GetHospitalsWithPaging(page: Paging): Observable<AssetDetailVM[]> {
    return this.httpClient.put<AssetDetailVM[]>(`${environment.getHospitalAssetWithPaging}`, page, this.httpHeader);
  }

  CountAssetsByHospital(): Observable<CountAssetVM[]> {
    return this.httpClient.get<CountAssetVM[]>(`${environment.CountAssetsByHospital}`, this.httpHeader);
  }


  GetAssetNameByMasterAssetIdAndHospitalId(masterAssetId: number, hospitalId: number): Observable<AssetDetailVM[]> {
    return this.httpClient.get<AssetDetailVM[]>(`${environment.GetAssetNameByMasterAssetIdAndHospitalId}${masterAssetId}/${hospitalId}`, this.httpHeader);
  }




  GetAllAssetDetailsByHospitalId(hospitalId: number): Observable<AssetDetailVM[]> {
    return this.httpClient.get<AssetDetailVM[]>(`${environment.GetAllAssetDetailsByHospitalId}${hospitalId}`, this.httpHeader);
  }

  AutoCompleteAssetBarCode(barcode: string, hospitaId: number): Observable<AssetDetailVM[]> {
    return this.httpClient.get<AssetDetailVM[]>(`${environment.AutoCompleteAssetBarCode}${barcode}/${hospitaId}`, this.httpHeader);
  }
  AutoCompleteAssetBarCodeByDepartmentId(barcode: string, hospitaId: number, departmentId: number): Observable<AssetDetailVM[]> {
    return this.httpClient.get<AssetDetailVM[]>(`${environment.AutoCompleteAssetBarCodeByDepartmentId}${barcode}/${hospitaId}/${departmentId}`, this.httpHeader);
  }

  AutoCompleteAssetSerial(serial: string, hospitaId: number): Observable<AssetDetailVM[]> {
    return this.httpClient.get<AssetDetailVM[]>(`${environment.AutoCompleteAssetSerial}${serial}/${hospitaId}`, this.httpHeader);
  }


  GetCheckedAssetById(id: number): Observable<ListAssetDetailVM> {
    return this.httpClient.get<ListAssetDetailVM>(`${environment.GetAssetById}${id}`, this.httpHeader);
  }

  GetAssetById(id: number): Observable<EditAssetDetailVM> {
    return this.httpClient.get<EditAssetDetailVM>(`${environment.GetAssetById}${id}`, this.httpHeader);
  }
  GetHospitalAssetById(id: number): Observable<AssetDetailVM> {
    return this.httpClient.get<AssetDetailVM>(`${environment.GetAssetById}${id}`, this.httpHeader);
  }

  GenerateAssetDetailBarcode(): Observable<GeneratedAssetDetailBCVM> {
    return this.httpClient.get<GeneratedAssetDetailBCVM>(`${environment.GenerateAssetDetailBarcode}`, this.httpHeader);
  }

  ViewAssetDetailByMasterId(masterId: number): Observable<ViewAssetDetailVM> {
    return this.httpClient.get<ViewAssetDetailVM>(`${environment.ViewAssetDetailByMasterId}${masterId}`, this.httpHeader);
  }

  ViewAllAssetDetailByMasterId(masterId: number): Observable<AssetDetailVM[]> {
    return this.httpClient.get<AssetDetailVM[]>(`${environment.ViewAllAssetDetailByMasterId}${masterId}`, this.httpHeader);
  }

  GetListOfAssetDetailsByHospitalId(hospitalId: number): Observable<ViewAssetDetailVM[]> {
    return this.httpClient.get<ViewAssetDetailVM[]>(`${environment.GetListOfAssetDetailsByHospitalId}${hospitalId}`, this.httpHeader);
  }
  GetNoneExcludedAssetsByHospitalId(hospitalId: number): Observable<ViewAssetDetailVM[]> {
    return this.httpClient.get<ViewAssetDetailVM[]>(`${environment.GetNoneExcludedAssetsByHospitalId}${hospitalId}`, this.httpHeader);
  }
  GetSupplierNoneExcludedAssetsByHospitalId(hospitalId: number): Observable<ViewAssetDetailVM[]> {
    return this.httpClient.get<ViewAssetDetailVM[]>(`${environment.GetSupplierNoneExcludedAssetsByHospitalId}${hospitalId}`, this.httpHeader);
  }

  GetAutoCompleteSupplierNoneExcludedAssetsByHospitalId(barcode: string, hospitalId: number): Observable<AssetDetailVM[]> {
    return this.httpClient.get<AssetDetailVM[]>(`${environment.GetAutoCompleteSupplierNoneExcludedAssetsByHospitalId}${barcode}/${hospitalId}`, this.httpHeader);
  }

  GetAutoCompleteSupplierExcludedAssetsByHospitalId(barcode: string, hospitalId: number): Observable<AssetDetailVM[]> {
    return this.httpClient.get<AssetDetailVM[]>(`${environment.GetAutoCompleteSupplierExcludedAssetsByHospitalId}${barcode}/${hospitalId}`, this.httpHeader);
  }

  GetAssetHospitalId(assetId: number): Observable<number> {
    return this.httpClient.get<number>(`${environment.GetAssetHospitalId}${assetId}`, this.httpHeader);
  }

  GetAllPMAssetTaskSchedules(hospitalId: number): Observable<ListPMAssetTaskScheduleVM[]> {
    return this.httpClient.get<ListPMAssetTaskScheduleVM[]>(`${environment.GetAllPMAssetTaskSchedules}${hospitalId}`, this.httpHeader);
  }

  GetAllPMAssetTaskScheduleByAssetId(assetId: number): Observable<ListPMAssetTaskScheduleVM[]> {
    return this.httpClient.get<ListPMAssetTaskScheduleVM[]>(`${environment.GetAllPMAssetTaskScheduleByAssetId}${assetId}`, this.httpHeader);
  }

  // GetAssetDetailsByUserId(userId: string): Observable<ListAssetDetailVM[]> {
  //   return this.httpClient.get<ListAssetDetailVM[]>(`${environment.GetAssetDetailsByUserId}${userId}`, this.httpHeader);
  // }
  GetAssetsyUserId(userId: string): Observable<ViewAssetForReportVM[]> {
    return this.httpClient.get<ViewAssetForReportVM[]>(`${environment.GetAssetsyUserId}${userId}`, this.httpHeader);
  }

  // GetAssetsByUserIdAndPaging(userId: string, pageNumber: number, pageSize: number): Observable<MainClass> {
  //   return this.httpClient.post<MainClass>(`${environment.GetAssetsByUserIdAndPaging}${userId}/${pageNumber}/${pageSize}`, this.httpHeader);
  // }


  geoSortAssetsWithoutSearch(sortObj: SortAssetVM, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.GeoSortAssetsWithoutSearch}${pageNumber}/${pageSize}`, sortObj, this.httpHeader);
  }


  GenericReportGetAssetsByUserIdAndPaging(userId: string, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.GenericReportGetAssetsByUserIdAndPaging}${userId}/${pageNumber}/${pageSize}`, this.httpHeader);
  }
  GetAssetDetailsByUserIdWithPaging(userId: string, PageInfo: Paging): Observable<ListAssetDetailVM[]> {
    return this.httpClient.put<ListAssetDetailVM[]>(`${environment.GetAssetDetailsByUserIdwithPaging}${userId}`, PageInfo, this.httpHeader);
  }

  GetAssetDetailsByUserIdWithPaging2(pagenumber: number, pagesize: number, userId: string): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.GetAssetDetailsByUserIdWithPaging2}${pagenumber}/${pagesize}/${userId}`, this.httpHeader);
  }

  GetHospitalAssetsBySupplierId(supplierId: number, pagenumber: number, pagesize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.GetHospitalAssetsBySupplierId}${supplierId}/${pagenumber}/${pagesize}`, this.httpHeader);
  }

  SearchHospitalAssetsBySupplierId(searchObj: SearchHospitalAssetVM, pagenumber: number, pagesize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.SearchHospitalAssetsBySupplierId}${pagenumber}/${pagesize}`, searchObj, this.httpHeader);
  }
  getCount(userId: string): Observable<number> {
    return this.httpClient.get<number>(`${environment.getAssetDetailcount}/${userId}`);
  }

  SearchAssetDetails(pagenumber: number, pagesize: number, model: SearchHospitalAssetVM): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.SearchAssetDetails}${pagenumber}/${pagesize}`, model, this.httpHeader);
  }
  SearchAssetDetailsCount(searchObj: SearchHospitalAssetVM): Observable<number> {
    return this.httpClient.post<number>(`${environment.SearchAssetDetailsCount}`, searchObj, this.httpHeader);
  }
  GenerateQrCodeForAllAssets(): Observable<any> {
    return this.httpClient.post<any>(`${environment.GenerateQrCodeForAllAssets}`, this.httpHeader);
  }

  DownloadQRWordFile(): Observable<Blob> {
    return this.httpClient.get<Blob>(`${environment.DownloadQRWordFile}`, this.httpHeader);
  }

  GenerateWordForHospitalSelectedQrCode(selectedAssets: ListAssetDetailVM[]): Observable<any> {
    return this.httpClient.post<any>(`${environment.GenerateWordForHospitalSelectedQrCode}`, selectedAssets, this.httpHeader);
  }
  GenerateWordForPoliceSelectedQrCode(selectedAssets: ListAssetDetailVM[]): Observable<any> {
    return this.httpClient.post<any>(`${environment.GenerateWordForPoliceSelectedQrCode}`, selectedAssets, this.httpHeader);
  }
  GenerateWordForUniversitySelectedQrCode(selectedAssets: ListAssetDetailVM[]): Observable<any> {
    return this.httpClient.post<any>(`${environment.GenerateWordForUniversitySelectedQrCode}`, selectedAssets, this.httpHeader);
  }


  GenerateWordForQrCodeForHospitalAssets(): Observable<any> {
    return this.httpClient.post<any>(`${environment.GenerateWordForQrCodeForHospitalAssets}`, this.httpHeader);
  }
  GenerateWordForQrCodeForPoliceAssets(): Observable<any> {
    return this.httpClient.post<any>(`${environment.GenerateWordForQrCodeForPoliceAssets}`, this.httpHeader);
  }
  GenerateWordForQrCodeForUniversityAssets(): Observable<any> {
    return this.httpClient.post<any>(`${environment.GenerateWordForQrCodeForUniversityAssets}`, this.httpHeader);
  }
  UpdateQrCode2(hospitalId: number): Observable<any> {
    return this.httpClient.post<any>(`${environment.UpdateQrCode}${hospitalId}`, this.httpHeader);
  }

  UpdateSelectedQrCode(selectedAssets: ListAssetDetailVM[]): Observable<any> {
    return this.httpClient.post<any>(`${environment.UpdateSelectedQrCode}`, selectedAssets, this.httpHeader);
  }

  SearchAssetDetailsByHospitalId(model: SearchHospitalAssetVM): Observable<ListAssetDetailVM[]> {
    return this.httpClient.post<ListAssetDetailVM[]>(`${environment.SearchAssetDetailsByHospitalId}`, model, this.httpHeader);
  }

  CreateAsset(AssetVM: CreateAssetDetailVM): Observable<number> {
    return this.httpClient.post<any>(`${environment.AddAsset}`, AssetVM, this.httpHeader);
  }

  UpdateAsset(AssetVM: EditAssetDetailVM): Observable<EditAssetDetailVM> {
    return this.httpClient.put<EditAssetDetailVM>(`${environment.UpdateAsset}`, AssetVM, this.httpHeader);
  }

  DeleteAsset(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteAsset}${id}`, this.httpHeader);
  }


  GetRequestsForAssetId(assetId: number, pageNumber: number, pageSize: number): Observable<RequestMainClass> {
    return this.httpClient.post<RequestMainClass>(`${environment.GetRequestsForAssetId}${assetId}/${pageNumber}/${pageSize}`, this.httpHeader);
  }


  GetOwnersByAssetDetailId(assetDetailId: number): Observable<AssetOwnerVM[]> {
    return this.httpClient.get<AssetOwnerVM[]>(`${environment.GetOwnersByAssetDetailId}${assetDetailId}`, this.httpHeader);
  }

  CreateAssetDetailAttachments(attachObj: CreateAssetDetailAttachmentVM): Observable<CreateAssetDetailAttachmentVM> {
    return this.httpClient.post<any>(`${environment.CreateAssetDetailAttachments}`, attachObj, this.httpHeader);
  }
  GetAttachmentByAssetDetailId(assetId: number): Observable<AssetDetailAttachmentVM[]> {
    return this.httpClient.get<AssetDetailAttachmentVM[]>(`${environment.GetAttachmentByAssetDetailId}${assetId}`, this.httpHeader);
  }
  DeleteAssetDetailAttachmentById(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteAssetDetailAttachment}${id}`, this.httpHeader);
  }

  GetAllwithgrouping(assetId: number): Observable<PmDateGroupVM[]> {
    return this.httpClient.get<PmDateGroupVM[]>(`${environment.GetAllwithgrouping}${assetId}`, this.httpHeader);
  }
  addTaskSchedule(PMAssetTaskScheduleObj: addPMAssetTaskScheduleVM): Observable<addPMAssetTaskScheduleVM> {
    return this.httpClient.post<addPMAssetTaskScheduleVM>(`${environment.AddTaskSchedule}`, PMAssetTaskScheduleObj, this.httpHeader)
  }

  FilterData(data: filterDto): Observable<ViewAssetForReportVM[]> {
    return this.httpClient.post<ViewAssetForReportVM[]>(`${environment.FilterData}`, data, this.httpHeader);
  }

  FilterDataByDepartmentBrandSupplierId(data: FilterAssetDetail): Observable<ViewAssetForReportVM[]> {
    return this.httpClient.post<ViewAssetForReportVM[]>(`${environment.FilterDataByDepartmentBrandSupplierId}`, data, this.httpHeader);
  }

  getAssetByBrand(data: ViewAssetForReportVM[]): Observable<BrandGroupVM[]> {
    return this.httpClient.post<BrandGroupVM[]>(`${environment.getAssetByBrand}`, data, this.httpHeader);
  }
  getAssetByHospital(data: ViewAssetForReportVM[]): Observable<HospitalGroupVM[]> {
    return this.httpClient.post<HospitalGroupVM[]>(`${environment.getAssetByHospital}`, data, this.httpHeader);
  }
  getAssetByGovernorate(data: ViewAssetForReportVM[]): Observable<GroupGovernorateVM[]> {
    return this.httpClient.post<GroupGovernorateVM[]>(`${environment.getAssetByGovernorate}`, data, this.httpHeader);
  }
  getAssetByCity(data: ViewAssetForReportVM[]): Observable<GroupcityVM[]> {
    return this.httpClient.post<GroupcityVM[]>(`${environment.getAssetByCity}`, data, this.httpHeader);
  }






  getAssetBySupplier(data: ViewAssetForReportVM[]): Observable<GroupSupplierVM[]> {
    return this.httpClient.post<GroupSupplierVM[]>(`${environment.getAssetBySupplier}`, data, this.httpHeader);
  }

  getAssetByDepartment(data: ViewAssetForReportVM[]): Observable<DepartmentGroupVM[]> {
    return this.httpClient.post<DepartmentGroupVM[]>(`${environment.getAssetByDepartment}`, data, this.httpHeader);
  }

  getAssetByOrganization(data: ViewAssetForReportVM[]): Observable<GroupOrganizationVM[]> {
    return this.httpClient.post<GroupOrganizationVM[]>(`${environment.getAssetByOrganization}`, data, this.httpHeader);
  }


  SortHospitalAssetsBySupplierId(sortObj: SortAssetDetailVM, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.SortHospitalAssetsBySupplierId}${pageNumber}/${pageSize}`, sortObj, this.httpHeader);
  }



  ExportAssetsByStatusId(statusId: number, userId: string): Observable<ListAssetDetailVM[]> {
    return this.httpClient.post<ListAssetDetailVM[]>(`${environment.ExportAssetsByStatusId}${statusId}/${userId}`, this.httpHeader);
  }

  GetAllAssetsByStatusId(pagenumber: number, pagesize: number, statusId: number, userId: string): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.GetAllAssetsByStatusId}${pagenumber}/${pagesize}/${statusId}/${userId}`, this.httpHeader);
  }


  GetAllAssetsCountByStatusId(statusId: number, userId: string, PageInfo: Paging): Observable<number> {
    return this.httpClient.post<number>(`${environment.GetAllAssetsCountByStatusId}${statusId}/${userId}`, PageInfo, this.httpHeader);
  }


  GetLastDocumentForAssetDetailId(assetDetailId: Number): Observable<AssetDetailAttachmentVM> {
    return this.httpClient.get<AssetDetailAttachmentVM>(`${environment.GetLastDocumentForAssetDetailId}${assetDetailId}`, this.httpHeader);
  }

  AlertAssetsWarrantyEndBefore3Monthes(hospitalId: number, duration: number, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.AlertAssetsWarrantyEndBefore3Monthes}${hospitalId}/${duration}/${pageNumber}/${pageSize}`, this.httpHeader);
  }

  SearchHospitalAssetsByDepartmentId(departmentId: number, userId: string, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.SearchHospitalAssetsByDepartmentId}${departmentId}/${userId}/${pageNumber}/${pageSize}/`, this.httpHeader);
  }
  GetAssetHistoryById(assetId: number): Observable<ViewAssetDetailVM> {
    return this.httpClient.get<ViewAssetDetailVM>(`${environment.GetAssetHistoryById}${assetId}`, this.httpHeader);
  }

  CreateAssetDepartmentBrandSupplierPDF(filterAssetDetailObj: FilterAssetDetail): Observable<any> {
    return this.httpClient.post<any>(`${environment.CreateAssetDepartmentBrandSupplierPDF}`, filterAssetDetailObj, this.httpHeader);
  }

  GetAssetDetailsByGovIdAndHospitalIdAndDepartmentId2(departmentId: number, govId: number, hospitalId: number, userId: string, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.GetHospitalAssetsByGovIdAndDeptIdAndHospitalId2}${departmentId}/${govId}/${hospitalId}/${userId}/${pageNumber}/${pageSize}`, this.httpHeader);
  }


  FilterDataByDepartmentBrandSupplierIdAndPaging(filteredObj: FilterAssetDetail, userId: string, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.FilterDataByDepartmentBrandSupplierIdAndPaging}/${userId}/${pageNumber}/${pageSize}`, filteredObj, this.httpHeader);
  }

  GetAssetsByBrandId(brandId: number): Observable<MainClass> {
    return this.httpClient.get<MainClass>(`${environment.GetAssetsByBrandId}/${brandId}`);
  }

  GetAssetsByDepartmentId(departmentId: number): Observable<MainClass> {
    return this.httpClient.get<MainClass>(`${environment.GetAssetsByDepartmentId}/${departmentId}`);
  }
  GetAssetsBySupplierId(supplierId: number): Observable<ListAssetDetailVM[]> {
    return this.httpClient.get<ListAssetDetailVM[]>(`${environment.GetAssetsBySupplierId}/${supplierId}`);
  }

  GetAssetsBySupplierIdWithPaging(supplierId: number, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.get<MainClass>(`${environment.GetAssetsBySupplierIdWithPaging}/${supplierId}/${pageNumber}/${pageSize}`);
  }

  GetAssetsByGovernorateIdWithPaging(governortaeId: number, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.get<MainClass>(`${environment.GetAssetsByGovernorateIdWithPaging}/${governortaeId}/${pageNumber}/${pageSize}`);
  }

  GetAssetsByCityIdWithPaging(cityId: number, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.get<MainClass>(`${environment.GetAssetsByCityIdWithPaging}/${cityId}/${pageNumber}/${pageSize}`);
  }





  GetAssetsByGovernorateId(governortaeId: number): Observable<MainClass> {
    return this.httpClient.get<MainClass>(`${environment.GetAssetsByGovernorateIdWithPaging}/${governortaeId}`);
  }


  GetAssetsByCityId(cityId: number): Observable<MainClass> {
    return this.httpClient.get<MainClass>(`${environment.GetAssetsByCityIdWithPaging}/${cityId}`);
  }

  
  GetAssetsByHospitalId(hospitalId: number): Observable<MainClass> {
    return this.httpClient.get<MainClass>(`${environment.GetAssetsByHospitalIdWithPaging}/${hospitalId}`);
  }


  SortAssetDetail(sortObject: SortAssetDetailsVM, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.SortAssetDetail}/${pageNumber}/${pageSize}/`, sortObject, this.httpHeader);
  }

  SortAssetDetailAfterSearch(sortObject: SortAssetDetailsVM, filteredObj: FilterAssetDetail, pageNumber: number, pageSize: number): Observable<MainClass> {
    const data = { sortObject, filteredObj };
    return this.httpClient.post<MainClass>(`${environment.SortAssetDetailAfterSearch}/${pageNumber}/${pageSize}`, data)
  }

  GroupAssetDetailsByBrand(data: FilterAssetDetail): Observable<BrandGroupVM[]> {
    return this.httpClient.post<BrandGroupVM[]>(`${environment.GroupAssetDetailsByBrand}`, data)
  }

  GroupAssetDetailsBySuppliers(data: FilterAssetDetail): Observable<GroupSupplierVM[]> {
    return this.httpClient.post<GroupSupplierVM[]>(`${environment.GroupAssetDetailsBySupplier}`, data)


  }
  GroupAssetDetailsByDepartment(data: FilterAssetDetail): Observable<DepartmentGroupVM[]> {
    return this.httpClient.post<DepartmentGroupVM[]>(`${environment.GroupAssetDetailsByDepartment}`, data)
  }

  GroupAssetDetailsByGovernorate(data: FilterAssetDetail): Observable<GroupGovernorateVM[]> {
    return this.httpClient.post<GroupGovernorateVM[]>(`${environment.GroupAssetDetailsByGovernorate}`, data)
  }


  GroupAssetDetailsByCity(data: FilterAssetDetail): Observable<GroupcityVM[]> {
    return this.httpClient.post<GroupcityVM[]>(`${environment.GroupAssetDetailsByCity}`, data)
  }


  
  GroupAssetDetailsByHospital(data: FilterAssetDetail): Observable<HospitalGroupVM[]> {
    return this.httpClient.post<GroupcityVM[]>(`${environment.GroupAssetDetailsByHospital}`, data)
  }




  ListHospitalAssets(data: SortAndFilterVM, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.ListHospitalAssets}${pageNumber}/${pageSize}`, data, this.httpHeader)
  }




  PrintAssetHistory(assetId: number, lang: string): Observable<any> {
    return this.httpClient.get(`${environment.PrintAssetHistory}${assetId}/${lang}`, this.httpHeader);
  }



  
  CreateAssetCheckedPMPDFByDepartment(workOrders: SortAndFilterVM): Observable<ListAssetDetailVM[]> {
    return this.httpClient.post<ListAssetDetailVM[]>(`${environment.GenerateWOPMDocumentByDepartment}`, workOrders, this.httpHeader);
  }

  CreateAssetCheckedPMPDF(assets: ListAssetDetailVM[]): Observable<ListAssetDetailVM[]> {
    return this.httpClient.post<ListAssetDetailVM[]>(`${environment.GenerateWOPMDocument}`, assets, this.httpHeader);
  }
}
