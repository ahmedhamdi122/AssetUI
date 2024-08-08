import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Paging } from '../Models/paging';
import { CreateRequestDocument } from '../Models/RequestDocumentVM';
import { ExportRequestVM, ListRequestVM, OpenRequestVM, PrintServiceRequestVM, SearchOpenRequestVM, SearchRequestDateVM, SearchRequestVM } from '../Models/requestModeVM';
import { IndexRequestTrackingVM } from '../Models/RequestTrackingVM';
import { CreateRequest, EditRequest, GeneratedRequestNumberVM, lstRequests, ReportRequestVM, RequestVM, SortRequestVM, ViewRequestVM, MainClass, MainClass2, SortAndFilterRequestVM } from '../Models/requestVM';
@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private httpClient: HttpClient) { }
  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'
    })
  };

  GetAllRequests(): Observable<ListRequestVM[]> {
    return this.httpClient.get<ListRequestVM[]>(`${environment.requests}`, this.httpHeader);
  }



  GetByRequestCode(code: string): Observable<ListRequestVM[]> {
    return this.httpClient.get<ListRequestVM[]>(`${environment.GetByRequestCode}${code}`, this.httpHeader);
  }
  GetAllRequestsWithTrackingByUserId(userId: string): Observable<ListRequestVM[]> {
    return this.httpClient.get<ListRequestVM[]>(`${environment.GetAllRequestsWithTrackingByUserId}${userId}`, this.httpHeader);
  }
  GetRequestsByDate(pagenumber: number, pagesize: number, requestDateObj: SearchRequestDateVM): Observable<ListRequestVM[]> {
    return this.httpClient.post<ListRequestVM[]>(`${environment.GetRequestsByDate}${pagenumber}/${pagesize}`, requestDateObj, this.httpHeader);
  }

  GetAllRequestsByDate(requestDateObj: SearchRequestDateVM): Observable<ListRequestVM[]> {
    return this.httpClient.post<ListRequestVM[]>(`${environment.GetAllRequestsByDate}`, requestDateObj, this.httpHeader);
  }


  GetRequestsByDateAndStatus(requestDateObj: SearchRequestDateVM, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.GetRequestsByDateAndStatus}${pageNumber}/${pageSize}`, requestDateObj, this.httpHeader);
  }



  GetOpenRequestsByDate(searchOpenRequestObj: SearchOpenRequestVM, pageNumber: number, pageSize: number): Observable<MainClass2> {
    return this.httpClient.post<MainClass2>(`${environment.GetOpenRequestsByDate}${pageNumber}/${pageSize}`, searchOpenRequestObj, this.httpHeader);
  }



  CreateOpenServiceRequestPDF(searchOpenRequestObj: SearchOpenRequestVM): Observable<OpenRequestVM[]> {
    return this.httpClient.post<OpenRequestVM[]>(`${environment.CreateOpenServiceRequestPDF}`, searchOpenRequestObj, this.httpHeader);
  }





  // CountGetRequestsByDate(requestDateObj: SearchRequestDateVM): Observable<number> {
  //   return this.httpClient.post<number>(`${environment.CountGetRequestsByDate}`, requestDateObj, this.httpHeader);
  // }
  GetRequestByWorkOrderId(workOrderId: number): Observable<ListRequestVM> {
    return this.httpClient.get<ListRequestVM>(`${environment.GetRequestByWorkOrderId}${workOrderId}`, this.httpHeader);
  }
  GetAllRequestsWithTrackingByUserIdWithPaging(userId: string, PageInfo: Paging): Observable<ListRequestVM[]> {
    return this.httpClient.put<ListRequestVM[]>(`${environment.GetAllRequestsWithTrackingByUserIdWithPaging}${userId}`, PageInfo, this.httpHeader);
  }
  // GetAllRequestsByHospitalAssetId(assetId: number): Observable<ListRequestVM[]> {
  //   return this.httpClient.get<ListRequestVM[]>(`${environment.GetAllRequestsByHospitalAssetId}${assetId}`, this.httpHeader);
  // }




  GetOldRequestsByHospitalAssetId(hospitalAssetId: number): Observable<ListRequestVM[]> {
    return this.httpClient.get<ListRequestVM[]>(`${environment.GetOldRequestsByHospitalAssetId}${hospitalAssetId}`, this.httpHeader);
  }



  getCount(userId: string): Observable<number> {
    return this.httpClient.get<number>(`${environment.getRequestscount}${userId}`, this.httpHeader);
  }
  GetTotalOpenRequest(userId: string): Observable<number> {
    return this.httpClient.get<number>(`${environment.GetTotalOpenRequest}${userId}`, this.httpHeader);
  }
  ListOpenRequests(hospitalId: number): Observable<RequestVM[]> {
    return this.httpClient.get<RequestVM[]>(`${environment.ListOpenRequests}${hospitalId}`, this.httpHeader);
  }
  UpdateOpenedRequest(requestId: number): Observable<number> {
    return this.httpClient.get<number>(`${environment.UpdateOpenedRequest}${requestId}`, this.httpHeader);
  }



  ListOpenRequestTracks(hospitalId: number): Observable<IndexRequestTrackingVM[]> {
    return this.httpClient.get<IndexRequestTrackingVM[]>(`${environment.ListOpenRequestTracks}${hospitalId}`, this.httpHeader);
  }
  UpdateOpenedRequestTrack(trackId: number): Observable<number> {
    return this.httpClient.get<number>(`${environment.UpdateOpenedRequestTrack}${trackId}`, this.httpHeader);
  }



  ListNewRequests(hospitalId: number): Observable<ListRequestVM[]> {
    return this.httpClient.get<ListRequestVM[]>(`${environment.ListNewRequests}${hospitalId}`, this.httpHeader);
  }


  GetAllRequestEstimations(searchRequestDateObj: SearchRequestDateVM): Observable<ReportRequestVM[]> {
    return this.httpClient.post<ReportRequestVM[]>(`${environment.GetAllRequestEstimations}`, searchRequestDateObj, this.httpHeader);
  }




  GetRequestEstimations(pagenumber: number, pagesize: number, searchRequestDateObj: SearchRequestDateVM): Observable<ReportRequestVM[]> {
    return this.httpClient.post<ReportRequestVM[]>(`${environment.GetRequestEstimations}${pagenumber}/${pagesize}`, searchRequestDateObj, this.httpHeader);
  }
  CountGetRequestEstimations(searchRequestDateObj: SearchRequestDateVM): Observable<number> {
    return this.httpClient.post<number>(`${environment.CountGetRequestEstimations}`, searchRequestDateObj, this.httpHeader);
  }




  PrintServiceRequestList(searchRequestDateObj: SearchRequestDateVM): Observable<ReportRequestVM[]> {
    return this.httpClient.post<ReportRequestVM[]>(`${environment.CreateServiceRequestPDF}`, searchRequestDateObj, this.httpHeader);
  }


  CreateSRReportWithinDateAndStatusPDF(searchRequestDateObj: SearchRequestDateVM): Observable<ListRequestVM[]> {
    return this.httpClient.post<ListRequestVM[]>(`${environment.CreateSRReportWithinDateAndStatusPDF}`, searchRequestDateObj, this.httpHeader);
  }


  CreateSRReportWithInProgressPDF(searchRequestDateObj: SearchRequestDateVM): Observable<ListRequestVM[]> {
    return this.httpClient.post<ListRequestVM[]>(`${environment.CreateSRReportWithInProgressPDF}`, searchRequestDateObj, this.httpHeader);
  }




  CreateSRReportWithinDatePDF(searchRequestDateObj: SearchRequestDateVM): Observable<ListRequestVM[]> {
    return this.httpClient.post<ListRequestVM[]>(`${environment.CreateSRReportWithinDatePDF}`, searchRequestDateObj, this.httpHeader);
  }

  PrintServieRequestById(id: number): Observable<PrintServiceRequestVM> {
    return this.httpClient.get<PrintServiceRequestVM>(`${environment.PrintServiceRequestById}${id}`, this.httpHeader);
  }
  SearchInRequests(pagenumber: number, pagesize: number, searchObj: SearchRequestVM): Observable<ListRequestVM[]> {
    return this.httpClient.post<ListRequestVM[]>(`${environment.SearchInRequests}${pagenumber}/${pagesize}`, searchObj, this.httpHeader);
  }


  SearchInRequests2(pagenumber: number, pagesize: number, searchObj: SearchRequestVM): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.SearchInRequests2}${pagenumber}/${pagesize}`, searchObj, this.httpHeader);
  }




  SearchInRequestsCount(searchObj: SearchRequestVM): Observable<number> {
    return this.httpClient.post<number>(`${environment.SearchInRequestsCount}`, searchObj, this.httpHeader);
  }


  GetAllRequestsWithTrackingByUserIdWithPagingAndStatusId(userId: string, statusId: number, PageInfo: Paging): Observable<ListRequestVM[]> {
    return this.httpClient.put<ListRequestVM[]>(`${environment.GetAllRequestsWithTrackingByUserIdWithPagingAndStatusId}${userId}/${statusId}`, PageInfo, this.httpHeader);
  }

  GetAllRequestsByPageNumber(userId: string, statusId: number, page: number, pageSize: number): Observable<ListRequestVM[]> {
    return this.httpClient.post<ListRequestVM[]>(`${environment.GetRequestsByPageNumber}/${userId}/${statusId}/${page}/${pageSize}`, this.httpHeader);
  }

  // ExportAllRequests(userId: string, statusId: number): Observable<ListRequestVM[]> {
  //   return this.httpClient.put<ListRequestVM[]>(`${environment.ExportAllRequests}${userId}/${statusId}`, this.httpHeader);
  // }


  // GetRequestsCountByStatusId(userId: string, statusId: number): Observable<number> {
  //   return this.httpClient.get<number>(`${environment.GetRequestsCountByStatusId}${userId}/${statusId}`);
  // }

  // GetRequestsCountByStatusIdAndPaging(userId: string, statusId: number): Observable<number> {
  //   return this.httpClient.get<number>(`${environment.GetRequestsCountByStatusIdAndPaging}${userId}/${statusId}`);
  // }
  GetRequestsByUserIdWithPagingAndStatusIdAndAssetId(userId: string, assetId: number, PageInfo: Paging): Observable<ListRequestVM[]> {
    return this.httpClient.post<ListRequestVM[]>(`${environment.GetRequestsByUserIdWithPagingAndStatusIdAndAssetId}${userId}/${assetId}`, PageInfo, this.httpHeader);
  }
  GetRequestsByUserIdWithPagingAndStatusIdAndAssetIdCount(): Observable<number> {
    return this.httpClient.get<number>(`${environment.GetRequestsByUserIdWithPagingAndStatusIdAndAssetIdCount}`);
  }

  CountAllRequestsByAssetId(assetId: number, hospitalId: number): Observable<number> {
    return this.httpClient.get<number>(`${environment.CountAllRequestsByAssetId}${assetId}/${hospitalId}`);
  }
  GetTotalRequestForAssetInHospital(assetDetailId: number): Observable<number> {
    return this.httpClient.get<number>(`${environment.GetTotalRequestForAssetInHospital}${assetDetailId}`);
  }
  GenerateRequestNumber(): Observable<GeneratedRequestNumberVM> {
    return this.httpClient.get<GeneratedRequestNumberVM>(`${environment.GenerateRequestNumber}`, this.httpHeader);
  }
  AddRequest(req: CreateRequest): Observable<number> {
    return this.httpClient.post<number>(`${environment.requests}`, req, this.httpHeader);
  }
  inserRequest(req): Observable<CreateRequest> {
    return this.httpClient.post<CreateRequest>(`${environment.requests}`, req, this.httpHeader);
  }
  GetRequestByRequestId(requestId: number): Observable<lstRequests> {
    return this.httpClient.get<lstRequests>(`${environment.requests}${requestId}`, this.httpHeader);
  }
  GetRequestById(id: number): Observable<RequestVM> {
    return this.httpClient.get<RequestVM>(`${environment.GetRequestById}${id}`, this.httpHeader);
  }
  GetById(id: number): Observable<ViewRequestVM> {
    return this.httpClient.get<ViewRequestVM>(`${environment.requests}${id}`, this.httpHeader);
  }

  GetRequestById2(id: number): Observable<ListRequestVM> {
    return this.httpClient.get<ListRequestVM>(`${environment.GetRequestById}${id}`, this.httpHeader);
  }


  updateRequest(editRequestVM: EditRequest): Observable<EditRequest> {
    return this.httpClient.put<EditRequest>(`${environment.UpdateRequest}`, editRequestVM, this.httpHeader);
  }
  DeleteRequest(id: Number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteRequest}${id}`, this.httpHeader);
  }


  DeleteRequestDocument(id: Number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteRequestDocument}${id}`, this.httpHeader);
  }



  sortRequest(pagenumber: number, pagesize: number, sortObj: SortRequestVM, statusId: number): Observable<ListRequestVM[]> {
    return this.httpClient.post<ListRequestVM[]>(`${environment.sortRequests}${pagenumber}/${pagesize}/${statusId}`, sortObj, this.httpHeader);
  }


  sortRequestsByPaging(sortObj: SortRequestVM, statusId: number, pagenumber: number, pagesize: number): Observable<ListRequestVM[]> {
    return this.httpClient.post<ListRequestVM[]>(`${environment.sortRequestsByPaging}${statusId}/${pagenumber}/${pagesize}`, sortObj, this.httpHeader);
  }

  // SortRequestsByAssetId(pagenumber: number, pagesize: number, sortObj: SortRequestVM): Observable<ListRequestVM[]> {
  //   return this.httpClient.post<ListRequestVM[]>(`${environment.SortRequestsByAssetId}${pagenumber}/${pagesize}`, sortObj, this.httpHeader);
  // }
  CountRequestsByHospitalId(hospitalId: number, userId: string): Observable<number> {
    return this.httpClient.get<number>(`${environment.CountRequestsByHospitalId}${hospitalId}/${userId}`, this.httpHeader);
  }
  CreateRequestAttachments(attachObj: CreateRequestDocument): Observable<number> {
    return this.httpClient.post<number>(`${environment.CreateRequestAttachments}`, attachObj, this.httpHeader);
  }


  // ExportRequestsByStatusId(hospitalId: number, userId: string, statusId: number): Observable<ListRequestVM[]> {
  //   return this.httpClient.get<ListRequestVM[]>(`${environment.ExportRequestsByStatusId}${hospitalId}/${userId}/${statusId}`, this.httpHeader);
  // }



  ExportRequestsByStatusId(data: SortAndFilterRequestVM): Observable<ListRequestVM[]> {
    return this.httpClient.post<ListRequestVM[]>(`${environment.ExportRequestsByStatusId}`, data, this.httpHeader);
  }
  AlertOpenedRequestAssetsAndHighPeriority(periorityId: number, hospitalId: number, pagenumber: number, pagesize: number): Observable<MainClass> {
    return this.httpClient.get<MainClass>(`${environment.AlertOpenedRequestAssetsAndHighPeriority}${periorityId}/${hospitalId}/${pagenumber}/${pagesize}`, this.httpHeader);
  }


  CreateServiceRequestPDF(searchObj: SearchRequestVM): Observable<ListRequestVM[]> {
    return this.httpClient.post<ListRequestVM[]>(`${environment.CreateServiceRequestListPDF}`, searchObj, this.httpHeader);
  }



  CreateServiceRequestGeneratePDF(requests: ExportRequestVM[]): Observable<ListRequestVM[]> {
    return this.httpClient.post<ListRequestVM[]>(`${environment.CreateServiceRequestGeneratePDF}`, requests, this.httpHeader);
  }
  GetExportRequestById(id: number): Observable<ExportRequestVM> {
    return this.httpClient.get<ExportRequestVM>(`${environment.GetRequestById}${id}`, this.httpHeader);
  }

  ListRequests(data: SortAndFilterRequestVM, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.ListRequests}${pageNumber}/${pageSize}`, data, this.httpHeader)
  }


}
