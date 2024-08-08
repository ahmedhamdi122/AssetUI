import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { dateVM } from '../Models/dateVM';
import { ListHospitalApplicationVM, ViewHospitalApplicationVM } from '../Models/HospitalApplicationVM';
import { CreateHospitalVM } from '../Models/hospitalVM';
import { modelIDsViewModel } from '../Models/modelIDsViewModel';
// import { dateVM } from '../Models/dateVM';
// import { DepartmemtByHospitalCodeViewModels } from '../Models/DepartmemtByHospitalCodeViewModels';
// import { HealthCareDevicesViewModels } from '../Models/HealthCareDevicesViewModels';
// import { HealthCareUnit } from '../Models/HealthCareUnit';
// import { modelIDsViewModel } from '../Models/modelIDsViewModel';

@Injectable({
  providedIn: 'root'
})
export class GetStaticApiService {
  public expropriationRequestUrl = environment.APIUrl + 'HealthInfo/';
  headers = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
    // withCredentials: false,
  };

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Accept: '*/*',
    }),
  };
  constructor(private http: HttpClient) { }
  GetOrginisations( model:modelIDsViewModel) {
    return this.http
      .post(
        this.expropriationRequestUrl +
        'GetOrginisations' , model
      )
      .pipe();
    }

  getHospitalInCity(cityCode:string[]){
    return this.http
      .post<CreateHospitalVM[]>(
        this.expropriationRequestUrl +
        'GetHospitalsInCity',cityCode
      )
      .pipe();
  }

  getHospitalInOrganization(OrgId:number[]){
    return this.http
      .post<CreateHospitalVM[]>(
        this.expropriationRequestUrl +
        'GetHospitalsInOrganization',OrgId
      )
      .pipe();
  }
  getHospitalInSubOrganization(subOrgIds:number[]){
    return this.http
      .post<CreateHospitalVM[]>(
        this.expropriationRequestUrl +
        'GetHospitalsInSubOrganization',subOrgIds
      )
      .pipe();
  }
  GetHospitalsInDepartment(DeptIds:number[]){
    return this.http
      .post<CreateHospitalVM[]>(
        this.expropriationRequestUrl +
        'GetHospitalsInDepartment',DeptIds
      )
      .pipe();
  }
  GetDepartmantsData( model:number[]) {
    return this.http
      .post(
        this.expropriationRequestUrl +
        'GetDepartmantsData' , model
      )
      .pipe();
  }
  GetHealthData(
    hospitalId: number,
    departmantId: number
  ): Observable<ListHospitalApplicationVM> {
    return this.http
      .get<ListHospitalApplicationVM>(
        this.expropriationRequestUrl +
          'GetHealthData?hospitalId=' +
          hospitalId +
          '&departmantId=' +
          departmantId
      )
      .pipe();
  }
  GetDepartmantData( code) {
    return this.http
      .get(
        this.expropriationRequestUrl +
        'GetDepartmantData?code='+code
      )
      .pipe();
  }
  GetSubOrginisations( orgIds:number[]) {
    
    return this.http
      .post(
        this.expropriationRequestUrl +
        'GetSubOrginisations', orgIds
      )
      .pipe();
  }
  GetBrands( model:number[]) {
    return this.http
      .post(
        this.expropriationRequestUrl +
        'GetBrands' , model
      )
      .pipe();
  }
  GetSuppliers( hosCodesInBrand:string[]) {
    return this.http
      .post(
        this.expropriationRequestUrl +
        'GetSuppliers' , hosCodesInBrand
      )
      .pipe();
  }
  GetHospitalsBySupplier( supplierIds:number[]) {
    return this.http
      .post<ListHospitalApplicationVM[]>(
        this.expropriationRequestUrl +
        'GetHospitalsBySupplier' , supplierIds
      )
      .pipe();
  }
  GetPriceRange( fromPrice:number,toPrice:number) {
    return this.http
      .get<ListHospitalApplicationVM[]>(
        this.expropriationRequestUrl +
        'GetPriceRange?FPrice='+fromPrice+'&ToPrice='+toPrice
      )
      .pipe();
  }
  GetDateRange(dates:dateVM) {
    return this.http
      .post<ListHospitalApplicationVM[]>(
        this.expropriationRequestUrl +
        'GetDateRange',dates
      )
      .pipe();
  }
  // GetDevice(id: number): Observable<DepartmemtByHospitalCodeViewModels> {
  //   return this.http
  //     .get<DepartmemtByHospitalCodeViewModels>(
  //       this.expropriationRequestUrl + 'GetDevice?id=' + id
  //     )
  //     .pipe();
  // }

  postdata(url,obj)
  {
    return this.http
    .post(url,obj)
    .pipe();

  }
}
