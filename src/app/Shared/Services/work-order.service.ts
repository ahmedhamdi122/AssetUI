import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Paging } from '../Models/paging';
import { CreateWorkOrderAttachmentVM } from '../Models/WorkOrderAttachmentVM';
import { CreateWorkOrderVM, EditWorkOrderVM, ExportWorkOrderVM, GeneratedWorkOrderNumberVM, IndexWorkOrderVM, ListWorkOrderVM, MainClass, PrintPDFWorkOrderVM, PrintWorkOrderVM, SearchWorkOrderDateVM, SearchWorkOrderVM, SortAndFilterWorkOrderVM, sortWorkOrdersVM } from '../Models/WorkOrderVM';
@Injectable({
  providedIn: 'root'
})
export class WorkOrderService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetWorkOrders(): Observable<IndexWorkOrderVM[]> {
    return this.httpClient.get<IndexWorkOrderVM[]>(`${environment.WorkOrder}`, this.httpHeader);
  }
  GetWorkOrderById(id: number): Observable<IndexWorkOrderVM> {
    return this.httpClient.get<IndexWorkOrderVM>(`${environment.WorkOrder}/${id}`, this.httpHeader);
  }

  GetExportWorkOrderById(id: number): Observable<ExportWorkOrderVM> {
    return this.httpClient.get<ExportWorkOrderVM>(`${environment.WorkOrder}/${id}`, this.httpHeader);
  }


  CreateWorkOrderGeneratePDF(workOrders: ExportWorkOrderVM[]): Observable<ExportWorkOrderVM[]> {
    return this.httpClient.post<ExportWorkOrderVM[]>(`${environment.CreateCheckedWOPDF}`, workOrders, this.httpHeader);
  }



  CreateAllWorkOrderPDF(workOrders: PrintPDFWorkOrderVM): Observable<ExportWorkOrderVM[]> {
    return this.httpClient.post<ExportWorkOrderVM[]>(`${environment.CreateWOPDF}`, workOrders, this.httpHeader);
  }



  GetworkOrderByUserAssetId(assetId: number, userId: string): Observable<ListWorkOrderVM[]> {
    return this.httpClient.get<ListWorkOrderVM[]>(`${environment.GetworkOrderByUserAssetId}${assetId}/${userId}`, this.httpHeader);
  }
  GetLastRequestAndWorkOrderByAssetId(assetId: number): Observable<IndexWorkOrderVM> {
    return this.httpClient.get<IndexWorkOrderVM>(`${environment.GetLastRequestAndWorkOrderByAssetId}/${assetId}`, this.httpHeader);
  }
  GetLastRequestAndWorkOrderByAssetIdAndRequestId(assetId: number, requestId: number): Observable<IndexWorkOrderVM> {
    return this.httpClient.get<IndexWorkOrderVM>(`${environment.GetLastRequestAndWorkOrderByAssetIdAndRequestId}${assetId}/${requestId}`, this.httpHeader);
  }

  PrintWorkOrderById(id: number): Observable<PrintWorkOrderVM> {
    return this.httpClient.get<PrintWorkOrderVM>(`${environment.PrintWorkOrderById}${id}`, this.httpHeader);
  }



  GetWorkOrderByRequestId(reuestId: number): Observable<ListWorkOrderVM> {
    return this.httpClient.get<ListWorkOrderVM>(`${environment.GetWorkOrderByRequestId}${reuestId}`, this.httpHeader);
  }

  GetWorkOrderByRequestId2(reuestId: number): Observable<ListWorkOrderVM[]> {
    return this.httpClient.get<ListWorkOrderVM[]>(`${environment.GetWorkOrderByRequestId}${reuestId}`, this.httpHeader);
  }




  GetAllWorkOrdersByHospitalId(hospitalId: number): Observable<ListWorkOrderVM[]> {
    return this.httpClient.get<ListWorkOrderVM[]>(`${environment.GetAllWorkOrdersByHospitalId}${hospitalId}`, this.httpHeader);
  }


  CreateWOReportWithinDatePDF(searchObj: SearchWorkOrderDateVM): Observable<ListWorkOrderVM[]> {
    return this.httpClient.post<ListWorkOrderVM[]>(`${environment.CreateWOReportWithinDatePDF}`, searchObj, this.httpHeader);
  }

  GetWorkOrdersByHospitalId(hospitalId: number, userId: string): Observable<ListWorkOrderVM[]> {
    return this.httpClient.get<ListWorkOrderVM[]>(`${environment.GetWorkOrdersByHospitalId}${hospitalId}/${userId}`, this.httpHeader);
  }


  GetAllWOtsWithTrackingByUserIdWithPaging(hospitalId: number, userId: string, PageInfo: Paging): Observable<ListWorkOrderVM[]> {
    return this.httpClient.put<ListWorkOrderVM[]>(`${environment.GetAllWorkOrdersByHospitalId}${hospitalId}/${userId}`, PageInfo, this.httpHeader);
  }



  getCount(hospitalId: number, userId: string): Observable<number> {
    return this.httpClient.get<number>(`${environment.GetWOCount}${hospitalId}/${userId}`);
  }


  SearchInWorkOrders(pagenumber: number, pagesize: number, searchObj: SearchWorkOrderVM): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.SearchInWorkOrders}${pagenumber}/${pagesize}`, searchObj, this.httpHeader);
  }







  SearchInWorkOrdersCount(searchObj: SearchWorkOrderVM): Observable<number> {
    return this.httpClient.post<number>(`${environment.SearchInWorkOrdersCount}`, searchObj, this.httpHeader);
  }




  GetWorkOrdersByDate(pagenumber: number, pagesize: number, searchObj: SearchWorkOrderDateVM): Observable<ListWorkOrderVM[]> {
    return this.httpClient.post<ListWorkOrderVM[]>(`${environment.GetWorkOrdersByDate}${pagenumber}/${pagesize}`, searchObj, this.httpHeader);
  }


  GetWorkOrdersByDateAndStatus(searchObj: SearchWorkOrderDateVM, pagenumber: number, pagesize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.GetWorkOrdersByDateAndStatus}${pagenumber}/${pagesize}`, searchObj, this.httpHeader);
  }



  GetAllWorkOrdersByDate(searchObj: SearchWorkOrderDateVM): Observable<ListWorkOrderVM[]> {
    return this.httpClient.post<ListWorkOrderVM[]>(`${environment.GetAllWorkOrdersByDate}`, searchObj, this.httpHeader);
  }

  CountGetWorkOrdersByDate(searchObj: SearchWorkOrderDateVM): Observable<number> {
    return this.httpClient.post<number>(`${environment.CountGetWorkOrdersByDate}`, searchObj, this.httpHeader);
  }

  ExportWorkOrdersByStatusId(hospitalId: number, userId: string, statusId: number): Observable<ListWorkOrderVM[]> {
    return this.httpClient.get<ListWorkOrderVM[]>(`${environment.ExportWorkOrdersByStatusId}${hospitalId}/${userId}/${statusId}`, this.httpHeader);
  }



  ListWorkOrders(data: SortAndFilterWorkOrderVM, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.ListWorkOrders}${pageNumber}/${pageSize}`, data, this.httpHeader);
  }



  GetAllWOWithTrackingByUserIdWithPagingAndStatusId(hospitalId: number, userId: string, statusId: number, PageInfo: Paging): Observable<ListWorkOrderVM[]> {
    return this.httpClient.put<ListWorkOrderVM[]>(`${environment.GetAllWorkOrdersByHospitalStatusId}${hospitalId}/${userId}/${statusId}`, PageInfo, this.httpHeader);
  }
  GetWOCountByStatusId(hospitalId: number, userId: string, statusId: number): Observable<number> {
    return this.httpClient.get<number>(`${environment.GetWOCountByStatus}${hospitalId}/${userId}/${statusId}`);
  }

  GetTotalWorkOrdersForAssetInHospital(assetDetailId: number): Observable<number> {
    return this.httpClient.get<number>(`${environment.GetTotalWorkOrdersForAssetInHospital}${assetDetailId}`);
  }


  CreateWorkOrder(CreateWorkOrderVM: CreateWorkOrderVM): Observable<number> {
    return this.httpClient.post<number>(`${environment.WorkOrder}`, CreateWorkOrderVM, this.httpHeader);
  }

  UpdateWorkOrder(EditWorkOrderVM: EditWorkOrderVM): Observable<EditWorkOrderVM> {
    return this.httpClient.put<EditWorkOrderVM>(`${environment.WorkOrder}`, EditWorkOrderVM, this.httpHeader);
  }
  DeleteWorkOrder(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.WorkOrder}${id}`, this.httpHeader);
  }
  GenerateWorOrderNumber(): Observable<GeneratedWorkOrderNumberVM> {
    return this.httpClient.get<GeneratedWorkOrderNumberVM>(`${environment.GenerateWorOrderNumber}`, this.httpHeader);
  }
  sortWorkOrders(hosId: number, userId: string, pagenumber: number, pagesize: number, sortObj: sortWorkOrdersVM, statusId: number): Observable<ListWorkOrderVM[]> {
    return this.httpClient.post<ListWorkOrderVM[]>(`${environment.sortWorkOrders}${hosId}/${userId}/${pagenumber}/${pagesize}/${statusId}`, sortObj, this.httpHeader);
  }

  countSortWorkOrders(hosId: number, userId: string, sortObj: sortWorkOrdersVM, statusId: number): Observable<number> {
    return this.httpClient.post<number>(`${environment.countSortWorkOrders}${hosId}/${userId}/${statusId}`, sortObj, this.httpHeader);
  }


  CreateWorkOrderPMPDF(): Observable<ExportWorkOrderVM[]> {
    return this.httpClient.post<ExportWorkOrderVM[]>(`${environment.GenerateWOPMDocument}`, this.httpHeader);
  }


  CountWorkOrdersByHospitalId(hospitalId: number, userId: string): Observable<number> {
    return this.httpClient.get<number>(`${environment.CountWorkOrdersByHospitalId}${hospitalId}/${userId}`, this.httpHeader);
  }




  CreateWorkOrderAttachments(attachObj: CreateWorkOrderAttachmentVM): Observable<number> {
    return this.httpClient.post<number>(`${environment.CreateWorkOrderAttachments}`, attachObj, this.httpHeader);
  }

  GetWorkOrdersCountByStatusIdAndPaging(hospitalId: number, userId: string, statusId: number): Observable<number> {
    return this.httpClient.get<number>(`${environment.GetWorkOrdersCountByStatusIdAndPaging}${hospitalId}/${userId}/${statusId}`);
  }
}
