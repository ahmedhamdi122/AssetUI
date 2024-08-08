import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateEmployeeVM, EditEmployeeVM, ListEmployees, ListEmployeeVM, SortEmployeeVM } from '../Models/employeeVM';
import { Paging } from '../Models/paging';



@Injectable({
  providedIn: 'root'
})

export class EmployeeService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetEmployees(): Observable<ListEmployeeVM[]> {
    return this.httpClient.get<ListEmployeeVM[]>(`${environment.ListEmployees}`, this.httpHeader);
  }
  GetEmployeesWithPaging(pageInfo: Paging): Observable<ListEmployeeVM[]> {
    return this.httpClient.put<ListEmployeeVM[]>(`${environment.ListEmployeesWithPaging}`, pageInfo, this.httpHeader);
  }
  getCount(): Observable<number> {
    return this.httpClient.get<number>(`${environment.getEmployeescount}`);
  }
  GetUnregisteredUsers(hospitalId?: number): Observable<ListEmployeeVM[]> {
    return this.httpClient.get<ListEmployeeVM[]>(`${environment.GetUnregisteredUsers}${hospitalId}`, this.httpHeader);
  }





  GetEditEmployeesByHospitalId(hospitalId: number): Observable<ListEmployeeVM[]> {
    return this.httpClient.get<ListEmployeeVM[]>(`${environment.GetEmployeesByHospitalId}${hospitalId}`, this.httpHeader);
  }


  GetEmployeesByHospitalId(hospitalId: number): Observable<ListEmployees[]> {
    return this.httpClient.get<ListEmployees[]>(`${environment.GetEmployeesByHospitalId}${hospitalId}`, this.httpHeader);
  }


  GetEmployeesByHospitalId2(hospitalId: number): Observable<ListEmployeeVM[]> {
    return this.httpClient.get<ListEmployeeVM[]>(`${environment.GetEmployeesEngineersByHospitalId}${hospitalId}`, this.httpHeader);
  }

  GetEmployeesHasEngRoleInHospital(hospitalId: number): Observable<ListEmployeeVM[]> {
    return this.httpClient.get<ListEmployeeVM[]>(`${environment.GetEmployeesHasEngRoleInHospital}${hospitalId}`, this.httpHeader);
  }




  GetEmployeesHasEngDepManagerRoleInHospital(hospitalId: number): Observable<ListEmployeeVM[]> {
    return this.httpClient.get<ListEmployeeVM[]>(`${environment.GetEmployeesHasEngDepManagerRoleInHospital}${hospitalId}`, this.httpHeader);
  }




  GetEmployeesAssetOwnerByHospitalId(hospitalId: number): Observable<ListEmployees[]> {
    return this.httpClient.get<ListEmployees[]>(`${environment.GetEmployeesAssetOwnerByHospitalId}${hospitalId}`, this.httpHeader);
  }

  GetEmployeesAssetOwnerByHospitalAndAssetDetailId(hospitalId: number, assetDetailId: number): Observable<ListEmployees[]> {
    return this.httpClient.get<ListEmployees[]>(`${environment.GetEmployeesAssetOwnerByHospitalAndAssetDetailId}${hospitalId}/${assetDetailId}`, this.httpHeader);
  }






  GetEmployeeById(id: number): Observable<EditEmployeeVM> {
    return this.httpClient.get<EditEmployeeVM>(`${environment.GetEmployeeById}${id}`, this.httpHeader);
  }
  CreateEmployee(EmployeeVM: CreateEmployeeVM): Observable<CreateEmployeeVM> {
    return this.httpClient.post<any>(`${environment.AddEmployee}`, EmployeeVM, this.httpHeader);
  }


  UpdateEmployee(EmployeeVM: EditEmployeeVM): Observable<EditEmployeeVM> {
    return this.httpClient.put<EditEmployeeVM>(`${environment.UpdateEmployee}`, EmployeeVM, this.httpHeader);
  }

  DeleteEmployee(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteEmployee}${id}`, this.httpHeader);
  }
  sortEmplyees(pagenumber: number, pagesize: number, sortObj: SortEmployeeVM): Observable<ListEmployeeVM[]> {
    return this.httpClient.post<ListEmployeeVM[]>(`${environment.sortEmployees}${pagenumber}/${pagesize}`, sortObj, this.httpHeader);
  }
}
