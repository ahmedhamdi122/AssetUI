import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateRoleVM, EditRoleVM, ListRolesVM } from '../Models/roleVM';
import { Paging } from '../Models/paging';



@Injectable({
  providedIn: 'root'
})

export class RoleService {

  constructor(private httpClient: HttpClient) {
  }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetRoles(): Observable<ListRolesVM[]> {
    return this.httpClient.get<ListRolesVM[]>(`${environment.ListRoles}`, this.httpHeader);
  }
  GetRolesWithPaging(pageInfo: Paging): Observable<ListRolesVM[]> {
    return this.httpClient.put<ListRolesVM[]>(`${environment.ListRolesWithPaging}`, pageInfo, this.httpHeader);
  }
  getCount(): Observable<number> {
    return this.httpClient.get<number>(`${environment.getRolescount}`);
  }
  GetRoleById(roleId: string): Observable<EditRoleVM> {
    return this.httpClient.get<EditRoleVM>(`${environment.GetRoleById}${roleId}`, this.httpHeader);
  }



  // AddRoleToListById(id: string): Observable<EditRoleVM> {
  //   return this.httpClient.get<EditRoleVM>(`${environment.AddRoleToListById}${id}`, this.httpHeader);
  // }



  GetRolesByRoleCategoryId(catId: number): Observable<ListRolesVM[]> {
    return this.httpClient.get<ListRolesVM[]>(`${environment.GetRolesByRoleCategoryId}${catId}`, this.httpHeader);
  }
  UpdateRole(editRoleObj: EditRoleVM): Observable<EditRoleVM> {
    return this.httpClient.put<EditRoleVM>(`${environment.UpdateRole}`, editRoleObj, this.httpHeader);
  }
  AddRole(createRoleObj: CreateRoleVM): Observable<CreateRoleVM> {
    return this.httpClient.post<CreateRoleVM>(`${environment.AddRole}`, createRoleObj, this.httpHeader);
  }


  DeleteRole(id: string): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteRole}${id}`, this.httpHeader);
  }


}
