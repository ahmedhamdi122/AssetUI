import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateBuildingVM, EditBuildingVM, ListBuildingVM } from '../Models/buildingVM';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})

export class BuildingService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetBuildings(): Observable<ListBuildingVM[]> {
    return this.httpClient.get<ListBuildingVM[]>(`${environment.ListBuildings}`, this.httpHeader);
  }


  GetAllBuildingsByHospitalId(hospitalId: number): Observable<ListBuildingVM[]> {
    return this.httpClient.get<ListBuildingVM[]>(`${environment.GetAllBuildingsByHospitalId}${hospitalId}`, this.httpHeader);
  }
  GetBuildingById(id: number): Observable<EditBuildingVM> {
    return this.httpClient.get<EditBuildingVM>(`${environment.GetBuildingById}${id}`, this.httpHeader);
  }

  CreateBuilding(BuildingVM: CreateBuildingVM): Observable<CreateBuildingVM> {
    return this.httpClient.post<any>(`${environment.AddBuilding}`, BuildingVM, this.httpHeader);
  }

  UpdateBuilding(BuildingVM: EditBuildingVM): Observable<EditBuildingVM> {
    return this.httpClient.put<EditBuildingVM>(`${environment.UpdateBuilding}`, BuildingVM, this.httpHeader);
  }

  DeleteBuilding(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteBuilding}${id}`, this.httpHeader);
  }

}
