import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateUserVM, EditUserVM, ListUsersVM, LoggedUser, SortUsersVM } from '../Models/userVM';
import { ForgetPasswordVM } from '../Models/forgetpasswordVM';
import { ResetPasswordVM } from '../Models/resetpasswordVM';
import { Paging } from '../Models/paging';



@Injectable({
  providedIn: 'root'
})

export class UserService {

  public currentUser: Observable<LoggedUser>;
  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  private createCompleteRoute = (route: string, envAddress: string) => {
    return `${envAddress}/${route}`;
  }
  constructor(private httpClient: HttpClient) {
  }

  GetUsersWithPaging(paging: Paging): Observable<ListUsersVM[]> {
    return this.httpClient.post<ListUsersVM[]>(`${environment.ListUsersWithPaging}`, paging, this.httpHeader);
  }
  getCount(): Observable<number> {
    return this.httpClient.get<number>(`${environment.getUsercount}`);
  }

  sortUsers(pagenumber: number, pagesize: number, sortObj: SortUsersVM): Observable<ListUsersVM[]> {
    return this.httpClient.post<ListUsersVM[]>(`${environment.SortUsers}${pagenumber}/${pagesize}`, sortObj, this.httpHeader);
  }
  public forgotPassword = (route: string, body: ForgetPasswordVM) => {
    return this.httpClient.post(this.createCompleteRoute(route, environment.urlAddress), body);
  }
  public resetPassword = (route: string, body: ResetPasswordVM) => {
    return this.httpClient.post(this.createCompleteRoute(route, environment.urlAddress), body);
  }


  GetUsers(): Observable<ListUsersVM[]> {
    return this.httpClient.get<ListUsersVM[]>(`${environment.ListUsers}`, this.httpHeader);
  }
  ListUsersByHospitalId(hospitalId: number): Observable<ListUsersVM[]> {
    return this.httpClient.get<ListUsersVM[]>(`${environment.ListUsersByHospitalId}${hospitalId}`, this.httpHeader);
  }

  ListUsersInHospitalByEngRoleName(hospitalId: number): Observable<ListUsersVM[]> {
    return this.httpClient.get<ListUsersVM[]>(`${environment.ListUsersInHospitalByEngRoleName}${hospitalId}`, this.httpHeader);
  }



  ListUsersInHospitalByEngManagerRoleName(hospitalId: number): Observable<ListUsersVM[]> {
    return this.httpClient.get<ListUsersVM[]>(`${environment.ListUsersInHospitalByEngManagerRoleName}${hospitalId}`, this.httpHeader);
  }

  GetUserById(id: string): Observable<EditUserVM> {
    return this.httpClient.get<EditUserVM>(`${environment.GetUserById}${id}`, this.httpHeader);
  }



  UpdateUser(editUserObj: EditUserVM): Observable<EditUserVM> {
    return this.httpClient.put<EditUserVM>(`${environment.UpdateUser}`, editUserObj, this.httpHeader);
  }

  AddUser(createUserObj: CreateUserVM): Observable<CreateUserVM> {
    return this.httpClient.post<CreateUserVM>(`${environment.AddUser}`, createUserObj, this.httpHeader);
  }


  DeleteUser(id: string): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteUser}${id}`, this.httpHeader);
  }
}
