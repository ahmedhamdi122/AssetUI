import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateRequestDocument, ListRequestDocumentVM } from '../Models/RequestDocumentVM';
@Injectable({
  providedIn: 'root'
})
export class RequestDocumentService {

  constructor(private httpClient: HttpClient) { }
  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'
    })
  };
  addListRequestDocuments(Documents: CreateRequestDocument[]): Observable<CreateRequestDocument[]> {
    return this.httpClient.post<CreateRequestDocument[]>(`${environment.RequestDocument}`, Documents, this.httpHeader);
  }

  AddRequestDocuments(Documents: CreateRequestDocument[]): Observable<CreateRequestDocument[]> {
    return this.httpClient.post<CreateRequestDocument[]>(`${environment.AddRequestDocuments}`, Documents, this.httpHeader);
  }


  GetAllRequestDocuments(requestId: Number): Observable<ListRequestDocumentVM[]> {
    return this.httpClient.get<ListRequestDocumentVM[]>(`${environment.RequestDocument}`, this.httpHeader);
  }
  GetRequestDocumentsByRequestTrackingId(RequestTrackingId: Number): Observable<ListRequestDocumentVM[]> {
    return this.httpClient.get<ListRequestDocumentVM[]>(`${environment.GetRequestDocumentsByRequestTrackingId}${RequestTrackingId}`, this.httpHeader);
  }

  GetLastDocumentForRequestTrackingId(RequestTrackingId: Number): Observable<ListRequestDocumentVM> {
    return this.httpClient.get<ListRequestDocumentVM>(`${environment.GetLastDocumentForRequestTrackingId}${RequestTrackingId}`, this.httpHeader);
  }


  deletedocument(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.RequestDocument}${id}`, this.httpHeader);
  }
  downloadInFile(fileName): any {
    return this.httpClient.get(`${environment.Domain}UploadedAttachments/documentFiles/${fileName}`, this.httpHeader);
  }
}
