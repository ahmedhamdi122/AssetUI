import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateSubOrganizationVM, EditSubOrganizationVM, ListSubOrganizationVM } from '../Models/subOrganizationVM';
import { ListOrganizationVM } from '../Models/organizationVM';


@Injectable({
  providedIn: 'root'
})

export class SubOrganizationService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetSubOrganizations(): Observable<ListSubOrganizationVM[]> {
    return this.httpClient.get<ListSubOrganizationVM[]>(`${environment.ListSubOrganizations}`, this.httpHeader);
  }


  GetSubOrganizationById(id: number): Observable<EditSubOrganizationVM> {
    return this.httpClient.get<EditSubOrganizationVM>(`${environment.GetSubOrganizationById}${id}`, this.httpHeader);
  }

  GetSubOrganizationByOrgId(orgId: number): Observable<ListSubOrganizationVM[]> {
    return this.httpClient.get<ListSubOrganizationVM[]>(`${environment.GetSubOrganizationByOrgId}${orgId}`, this.httpHeader);
  }


  GetOrganizationBySubId(subId: number): Observable<ListOrganizationVM[]> {
    return this.httpClient.get<ListOrganizationVM[]>(`${environment.GetOrganizationBySubId}${subId}`, this.httpHeader);
  }


  
  CreateSubOrganization(subOrganizationVM: CreateSubOrganizationVM): Observable<CreateSubOrganizationVM> {
    return this.httpClient.post<any>(`${environment.AddSubOrganization}`, subOrganizationVM, this.httpHeader);
  }


  UpdateSubOrganization(SubOrganizationObj: EditSubOrganizationVM): Observable<EditSubOrganizationVM> {
    return this.httpClient.put<EditSubOrganizationVM>(`${environment.UpdateSubOrganization}`, SubOrganizationObj, this.httpHeader);
  }

  DeleteSubOrganization(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteSubOrganization}${id}`, this.httpHeader);
  }

}
