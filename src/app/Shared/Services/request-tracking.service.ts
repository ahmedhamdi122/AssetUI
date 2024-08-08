import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateRequestTracking, EditRequestTracking, IndexRequestTrackingVM, RequestDetails, RequestTrackingView } from '../Models/RequestTrackingVM';
@Injectable({
  providedIn: 'root'
})
export class RequestTrackingService {

  constructor(private httpClient: HttpClient) { }
  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'
    })
  };
  AddRequestTrack(reqDescription): Observable<CreateRequestTracking> {
    return this.httpClient.post<CreateRequestTracking>(`${environment.RequestTracking}`, reqDescription, this.httpHeader);
  }


  AddRequestTracking(requestTrackObj: CreateRequestTracking): Observable<CreateRequestTracking> {
    return this.httpClient.post<CreateRequestTracking>(`${environment.AddRequestTracking}`, requestTrackObj, this.httpHeader);
  }

  GetSRTracksByRequestId(requestId: number): Observable<RequestDetails> {
    return this.httpClient.get<RequestDetails>(`${environment.GetAllTrackingByRequestId}${requestId}`, this.httpHeader);
  }


  GetAllDescByRequestID(requestId: number): Observable<RequestDetails> {
    return this.httpClient.get<RequestDetails>(`${environment.GetAllTrackingByRequestId}${requestId}`, this.httpHeader);
  }


  GetById(id: number): Observable<RequestDetails> {
    return this.httpClient.get<RequestDetails>(`${environment.GetRequestById}${id}`, this.httpHeader);
  }





  GetTracksByRequestId(requestId: number): Observable<RequestTrackingView[]> {
    return this.httpClient.get<RequestTrackingView[]>(`${environment.GetAllTracksByRequestId}${requestId}`, this.httpHeader);
  }




  CountRequestTracksByRequestId(requestId: number): Observable<number> {
    return this.httpClient.get<number>(`${environment.CountRequestTracksByRequestId}${requestId}`, this.httpHeader);
  }



  // GetFirstTrackForRequestByRequestId(id: number): Observable<RequestTrackingView> {
  //   return this.httpClient.get<RequestTrackingView>(`${environment.GetFirstTrackForRequestByRequestId}${id}`, this.httpHeader);
  // }



  GetAllRequests(userId: string): Observable<IndexRequestTrackingVM[]> {
    return this.httpClient.get<IndexRequestTrackingVM[]>(`${environment.GetAllRequestFromTrackingByuserId}${userId}`, this.httpHeader);
  }

  updateRequestTrack(editRequestTrackingObj: EditRequestTracking): Observable<EditRequestTracking> {
    return this.httpClient.put<EditRequestTracking>(`${environment.UpdateRequestTracking}`, editRequestTrackingObj, this.httpHeader);
  }




  GetAllRequestsByUserId(userId: string): Observable<IndexRequestTrackingVM[]> {
    return this.httpClient.get<IndexRequestTrackingVM[]>(`${environment.GetAllRequestFromTrackingByuserId}${userId}`, this.httpHeader);
  }





  GetAllRequestsByUserAssetDetailId(userId: string, assetDetailId: number): Observable<IndexRequestTrackingVM[]> {
    return this.httpClient.get<IndexRequestTrackingVM[]>(`${environment.GetAllRequestFromTrackingByuserId}${userId}/${assetDetailId}`, this.httpHeader);
  }


  GetFirstTrackForRequestByRequestId(requestId: number): Observable<IndexRequestTrackingVM> {
    return this.httpClient.get<IndexRequestTrackingVM>(`${environment.GetFirstTrackForRequestByRequestId}${requestId}`, this.httpHeader);
  }

}
