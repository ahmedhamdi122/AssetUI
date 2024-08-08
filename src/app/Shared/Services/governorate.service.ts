import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateGovernorateVM, EditGovernorateVM, GetGovernorateWithHospitalsCount, ListGovernorateVM } from '../Models/governorateVM';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class GovernorateService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetGovernorates(): Observable<ListGovernorateVM[]> {
    return this.httpClient.get<ListGovernorateVM[]>(`${environment.ListGovernorates}`, this.httpHeader);
  }

  GetGovernorateById(id: number): Observable<EditGovernorateVM> {
    return this.httpClient.get<EditGovernorateVM>(`${environment.GetGovernorateById}${id}`, this.httpHeader);
  }

  GetGovernorateByName(govName: string): Observable<EditGovernorateVM> {
    return this.httpClient.get<EditGovernorateVM>(`${environment.GetGovernorateByName}${govName}`, this.httpHeader);
  }
  GetGovernorateWithHospitalsCount():Observable<GetGovernorateWithHospitalsCount[]>
  {
    return this.httpClient.get<GetGovernorateWithHospitalsCount[]>(`${environment.GetGovernorateWithHos}`, this.httpHeader);
  }

  CreateGovernorate(GovernorateVM: CreateGovernorateVM): Observable<CreateGovernorateVM> {
    return this.httpClient.post<any>(`${environment.AddGovernorate}`, GovernorateVM, this.httpHeader);
  }

  UpdateGovernorate(GovernorateVM: EditGovernorateVM): Observable<EditGovernorateVM> {
    return this.httpClient.put<EditGovernorateVM>(`${environment.UpdateGovernorate}`, GovernorateVM, this.httpHeader);
  }

  DeleteGovernorate(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteGovernorate}${id}`, this.httpHeader);
  }

}
