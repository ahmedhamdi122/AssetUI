import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateCityVM, EditCityVM, ListCityVM } from '../Models/cityVM';


@Injectable({
  providedIn: 'root'
})

export class CityService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetCities(): Observable<ListCityVM[]> {
    return this.httpClient.get<ListCityVM[]>(`${environment.ListCities}`, this.httpHeader);
  }


  GetCityById(id: number): Observable<EditCityVM> {
    return this.httpClient.get<EditCityVM>(`${environment.GetCityById}${id}`, this.httpHeader);
  }

  GetCitiesByGovernorateId(govId: number): Observable<ListCityVM[]> {
    return this.httpClient.get<ListCityVM[]>(`${environment.GetCitiesByGovernorateId}${govId}`, this.httpHeader);
  }

  GetCitiesByGovernorateName(govName: string): Observable<ListCityVM[]> {
    return this.httpClient.get<ListCityVM[]>(`${environment.GetCitiesByGovernorateName}${govName}`, this.httpHeader);
  }
  GetGovIdByname(govName:string):Observable<number>
  {
    return this.httpClient.get<number>(`${environment.GetGovIdByname}${govName}`, this.httpHeader);
  }
  CreateCity(CityVM: CreateCityVM): Observable<CreateCityVM> {
    return this.httpClient.post<any>(`${environment.AddCity}`, CityVM, this.httpHeader);
  }


  UpdateCity(CityObj: EditCityVM): Observable<EditCityVM> {
    return this.httpClient.put<EditCityVM>(`${environment.UpdateCity}`, CityObj, this.httpHeader);
  }

  DeleteCity(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteCity}${id}`, this.httpHeader);
  }
  getCityIdByName(name:string):Observable<number>
  {
    return this.httpClient.get<number>(`${environment.getCityIdByName}${name}`, this.httpHeader);
  }
}
