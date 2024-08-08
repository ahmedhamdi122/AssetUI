import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CountHospitalVM, CreateHospitalVM, DetailHospitalVM, EditHospitalDepartmentVM, EditHospitalVM, GenerateHospitalCode, HospitalWithAssetVM, ListHospitalVM, MainClass, SearchHospitalVM, SortHospitalVM } from '../Models/hospitalVM';
import { environment } from 'src/environments/environment';
import { ListHospitalDepartmentVM } from '../Models/hospitaldepartmentVM';
import { ListSubOrganizationVM } from '../Models/subOrganizationVM';
import { Paging } from '../Models/paging';


@Injectable({
  providedIn: 'root'
})

export class HospitalService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetHospitals(): Observable<ListHospitalVM[]> {
    return this.httpClient.get<ListHospitalVM[]>(`${environment.ListHospitals}`, this.httpHeader);
  }




  GetTop10Hospitals(hospitalId: number): Observable<MainClass> {
    return this.httpClient.get<MainClass>(`${environment.GetTop10Hospitals}${hospitalId}`, this.httpHeader);
  }





  GetHospitalsWithPaging(page: Paging): Observable<ListHospitalVM[]> {
    return this.httpClient.put<ListHospitalVM[]>(`${environment.getHospitalWithPaging}`, page, this.httpHeader);
  }
  getCount(): Observable<number> {
    return this.httpClient.get<number>(`${environment.getHospitalcount}`);
  }

  GetHospitalByUserId(userId: string): Observable<ListHospitalVM[]> {
    return this.httpClient.post<ListHospitalVM[]>(`${environment.GetHospitalsByUserId}${userId}`, this.httpHeader);
  }

  GetHospitalByUserIdAndPaging(userId: string, page: Paging): Observable<ListHospitalVM[]> {
    return this.httpClient.post<ListHospitalVM[]>(`${environment.GetHospitalsByUserIdAndPaging}${userId}`, page, this.httpHeader);
  }


  GetHospitalByUserIdAndPagingCount(userId: string): Observable<number> {
    return this.httpClient.get<number>(`${environment.GetHospitalsByUserIdAndPagingCount}${userId}`, this.httpHeader);
  }


  CountHospitals(): Observable<number> {
    return this.httpClient.get<number>(`${environment.CountHospitals}`, this.httpHeader);
  }

  GetHospitalById(id: number): Observable<EditHospitalVM> {
    return this.httpClient.get<EditHospitalVM>(`${environment.GetHospitalById}${id}`, this.httpHeader);
  }

  GetHospitalDetailById(id: number): Observable<DetailHospitalVM> {
    return this.httpClient.get<DetailHospitalVM>(`${environment.GetHospitalDetailById}${id}`, this.httpHeader);
  }

  GetHospitalsByCityId(cityId: number): Observable<ListHospitalVM[]> {
    return this.httpClient.get<ListHospitalVM[]>(`${environment.GetHospitalsByCityId}${cityId}`, this.httpHeader);
  }

  GetHospitalsBySubOrganizationId(subOrgId: number): Observable<ListHospitalVM[]> {
    return this.httpClient.get<ListHospitalVM[]>(`${environment.GetHospitalsBySubOrganizationId}${subOrgId}`, this.httpHeader);
  }

  GetHospitalsByGovCityOrgSubOrgId(govId:number,cityId:number,orgId:number,subOrgId: number): Observable<ListHospitalVM[]> {
    return this.httpClient.get<ListHospitalVM[]>(`${environment.GetHospitalsByGovCityOrgSubOrgId}${govId}/${cityId}/${orgId}/${subOrgId}`, this.httpHeader);
  }


  
  GetHospitalDepartmentByHospitalId(hospitalId: number): Observable<ListHospitalDepartmentVM[]> {
    return this.httpClient.get<ListHospitalDepartmentVM[]>(`${environment.GetHospitalDepartmentByHospitalId}${hospitalId}`, this.httpHeader);
  }
  GetHospitalDepartmentByHospitalId2(hospitalId: number): Observable<ListHospitalDepartmentVM[]> {
    return this.httpClient.get<ListHospitalDepartmentVM[]>(`${environment.GetHospitalDepartmentByHospitalId2}${hospitalId}`, this.httpHeader);
  }

  GetSelectedHospitalDepartmentByDepartmentId(hospitalId: number, departmentId: number): Observable<ListHospitalDepartmentVM> {
    return this.httpClient.get<ListHospitalDepartmentVM>(`${environment.GetSelectedHospitalDepartmentByDepartmentId}${hospitalId}/${departmentId}`, this.httpHeader);
  }



  GetSubOrganizationsByHospitalId(hospitalId: number): Observable<ListSubOrganizationVM[]> {
    return this.httpClient.get<ListSubOrganizationVM[]>(`${environment.GetSubOrganizationsByHospitalId}${hospitalId}`, this.httpHeader);
  }


  SearchHospitals(pagenumber: number, pagesize: number, searchObj: SearchHospitalVM): Observable<ListHospitalVM[]> {
    return this.httpClient.post<ListHospitalVM[]>(`${environment.SearchHospitals}${pagenumber}/${pagesize}`, searchObj, this.httpHeader);
  }

  SearchHospitalsCount(searchObj: SearchHospitalVM): Observable<number> {
    return this.httpClient.post<number>(`${environment.SearchHospitalsCount}`, searchObj, this.httpHeader);
  }


  CreateHospital(HospitalVM: CreateHospitalVM): Observable<CreateHospitalVM> {
    return this.httpClient.post<any>(`${environment.AddHospital}`, HospitalVM, this.httpHeader);
  }

  UpdateHospital(HospitalVM: EditHospitalVM): Observable<EditHospitalVM> {
    return this.httpClient.put<EditHospitalVM>(`${environment.UpdateHospital}`, HospitalVM, this.httpHeader);
  }

  UpdateHospitalDepartment(hospitalDepartmentVM: EditHospitalDepartmentVM): Observable<any> {
    return this.httpClient.put<EditHospitalDepartmentVM>(`${environment.UpdateHospitalDepartment}`, hospitalDepartmentVM, this.httpHeader);
  }


  DeleteHospital(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteHospital}${id}`, this.httpHeader);
  }

  CountHospitalsByCities(): Observable<CountHospitalVM[]> {
    return this.httpClient.get<CountHospitalVM[]>(`${environment.CountHospitalsByCities}`, this.httpHeader);
  }
  getHosByCityId(id: number): Observable<ListHospitalVM[]> {
    return this.httpClient.get<ListHospitalVM[]>(`${environment.getHosByCityId}${id}`);
  }
  sortHospitals(pagenumber: number, pagesize: number, sortObj: SortHospitalVM): Observable<ListHospitalVM[]> {
    return this.httpClient.post<ListHospitalVM[]>(`${environment.sortHospitals}${pagenumber}/${pagesize}`, sortObj, this.httpHeader);
  }
  getHospitalWithAssets(): Observable<HospitalWithAssetVM[]> {
    return this.httpClient.get<HospitalWithAssetVM[]>(`${environment.getHospitalWithAssets}`);
  }


  CountDepartmentsByHospitalId(hospitalId: number): Observable<number> {
    return this.httpClient.get<number>(`${environment.CountDepartments}${hospitalId}`, this.httpHeader);
  }


  getHospitalByGovId(govId: number): Observable<ListHospitalVM[]> {
    return this.httpClient.get<ListHospitalVM[]>(`${environment.GetHospitalByGovId}${govId}`, this.httpHeader);
  }


  GenerateHospitalCode(): Observable<GenerateHospitalCode> {
    return this.httpClient.get<GenerateHospitalCode>(`${environment.GenerateHospitalCode}`, this.httpHeader);
  }


}
