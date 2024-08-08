import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateDepartmentVM, EditDepartmentVM, GenerateDepartmentCodeVM, ListDepartmentVM, SortDepartmentVM } from '../Models/departmentVM';
import { environment } from 'src/environments/environment';
import { Paging } from '../Models/paging';


@Injectable({
  providedIn: 'root'
})

export class DepartmentService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetDepartments(): Observable<ListDepartmentVM[]> {
    return this.httpClient.get<ListDepartmentVM[]>(`${environment.ListDepartments}`, this.httpHeader);
  }
  GetDepartmentsByHospitalId(hospitalId: number): Observable<ListDepartmentVM[]> {
    return this.httpClient.get<ListDepartmentVM[]>(`${environment.ListDepartmentsByHospitalId}${hospitalId}`, this.httpHeader);
  }

  DepartmentsByHospitalId(hospitalId: number): Observable<ListDepartmentVM[]> {
    return this.httpClient.get<ListDepartmentVM[]>(`${environment.GetDepartmentsByHospitalId}${hospitalId}`, this.httpHeader);
  }

  GetDepartmentById(id: number): Observable<EditDepartmentVM> {
    return this.httpClient.get<EditDepartmentVM>(`${environment.GetDepartmentById}${id}`, this.httpHeader);
  }

  sortDepartments(pagenumber: number, pagesize: number, sortObj: SortDepartmentVM): Observable<ListDepartmentVM[]> {
    return this.httpClient.post<ListDepartmentVM[]>(`${environment.SortDepartments}${pagenumber}/${pagesize}`, sortObj, this.httpHeader);
  }


  CreateDepartment(DepartmentVM: CreateDepartmentVM): Observable<CreateDepartmentVM> {
    return this.httpClient.post<any>(`${environment.AddDepartment}`, DepartmentVM, this.httpHeader);
  }

  CreateDepartmentToHospital(DepartmentVM: CreateDepartmentVM): Observable<CreateDepartmentVM> {
    return this.httpClient.post<any>(`${environment.AddDepartmentToHospital}`, DepartmentVM, this.httpHeader);
  }

  UpdateDepartment(id: number, DepartmentVM: EditDepartmentVM): Observable<EditDepartmentVM> {
    return this.httpClient.put<EditDepartmentVM>(`${environment.UpdateDepartment}${id}`, DepartmentVM, this.httpHeader);
  }

  DeleteDepartment(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteDepartment}${id}`, this.httpHeader);
  }
  GetDepartmentWithPaging(PageInfo: Paging): Observable<ListDepartmentVM[]> {
    return this.httpClient.put<ListDepartmentVM[]>(`${environment.GetDepartmentWithPaging}`, PageInfo, this.httpHeader);
  }

  getDepartmentsCount(): Observable<number> {
    return this.httpClient.get<number>(`${environment.getDepartmentcount}`);
  }




  GenerateDepartmentCode(): Observable<GenerateDepartmentCodeVM> {
    return this.httpClient.get<GenerateDepartmentCodeVM>(`${environment.GenerateDepartmentCode}`);
  }

}
