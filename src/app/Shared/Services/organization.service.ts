import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateOrganizationVM, EditOrganizationVM, ListOrganizationVM } from '../Models/organizationVM';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class OrganizationService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetOrganizations(): Observable<ListOrganizationVM[]> {
    return this.httpClient.get<ListOrganizationVM[]>(`${environment.ListOrganizations}`, this.httpHeader);
  }

  GetOrganizationById(id: number): Observable<EditOrganizationVM> {
    return this.httpClient.get<EditOrganizationVM>(`${environment.GetOrganizationById}${id}`, this.httpHeader);
  }

  CreateOrganization(organizationVM: CreateOrganizationVM): Observable<CreateOrganizationVM> {
    return this.httpClient.post<any>(`${environment.AddOrganization}`, organizationVM, this.httpHeader);
  }

  UpdateOrganization(organizationVM: EditOrganizationVM): Observable<EditOrganizationVM> {
    return this.httpClient.put<EditOrganizationVM>(`${environment.UpdateOrganization}`, organizationVM, this.httpHeader);
  }

  DeleteOrganization(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteOrganization}${id}`, this.httpHeader);
  }

}
