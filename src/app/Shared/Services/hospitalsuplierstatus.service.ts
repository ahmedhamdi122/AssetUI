import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ListHospitalSuplierStatusVM, ListHospitalSuplierStatusVM2 } from '../Models/HospitalSuplierStatusVM';
@Injectable({
  providedIn: 'root'
})
export class HospitalSuplierStatusService {


  constructor(private httpClient: HttpClient) { }
  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'
    })
  };

  GetAll(appTypeId: number, hospitaId: number): Observable<ListHospitalSuplierStatusVM[]> {
    return this.httpClient.get<ListHospitalSuplierStatusVM[]>(`${environment.GetAllHospitalSupplierStatus}${appTypeId}/${hospitaId}`, this.httpHeader);
  }

  ListAllStatus(appTypeId: number, hospitaId: number): Observable<ListHospitalSuplierStatusVM2> {
    return this.httpClient.get<ListHospitalSuplierStatusVM2>(`${environment.GetAllHospitalSupplierStatus}${appTypeId}/${hospitaId}`, this.httpHeader);
  }


  GetAllByStatusTypeId(statusId: number, appTypeId: number, hospitaId: number): Observable<ListHospitalSuplierStatusVM[]> {
    return this.httpClient.get<ListHospitalSuplierStatusVM[]>(`${environment.GetAllHospitalSupplierStatus}${statusId}/${appTypeId}/${hospitaId}`, this.httpHeader);
  }


  GetAllStatus(appTypeId: number, hospitaId: number): Observable<ListHospitalSuplierStatusVM> {
    return this.httpClient.get<ListHospitalSuplierStatusVM>(`${environment.GetAllHospitalSupplierStatus}${appTypeId}/${hospitaId}`, this.httpHeader);
  }


  GetAllByHospitals(): Observable<ListHospitalSuplierStatusVM[]> {
    return this.httpClient.get<ListHospitalSuplierStatusVM[]>(`${environment.GetAllByHospitals}`, this.httpHeader);
  }




  GetHospitalByStatusAppTypeId(statusId: number, appTypeId: number, hospitaId: number): Observable<ListHospitalSuplierStatusVM2> {
    return this.httpClient.get<ListHospitalSuplierStatusVM2>(`${environment.GetHospitalSupplierStatusByStatusAppTypeId}${statusId}/${appTypeId}/${hospitaId}`, this.httpHeader);
  }


  ListHospitalByStatusAppTypeId(statusId: number, appTypeId: number, hospitaId: number): Observable<ListHospitalSuplierStatusVM2> {
    return this.httpClient.get<ListHospitalSuplierStatusVM2>(`${environment.GetHospitalByStatusAppTypeId}${statusId}/${appTypeId}/${hospitaId}`, this.httpHeader);
  }
}
