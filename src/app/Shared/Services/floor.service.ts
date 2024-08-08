import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateFloorVM, EditFloorVM, ListFloorVM } from '../Models/floorVM';


@Injectable({
  providedIn: 'root'
})

export class FloorService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetFloors(): Observable<ListFloorVM[]> {
    return this.httpClient.get<ListFloorVM[]>(`${environment.ListFloors}`, this.httpHeader);
  }


  GetFloorById(id: number): Observable<EditFloorVM> {
    return this.httpClient.get<EditFloorVM>(`${environment.GetFloorById}${id}`, this.httpHeader);
  }

  GetFloorsByBuildingId(buildId: number): Observable<ListFloorVM[]> {
    return this.httpClient.get<ListFloorVM[]>(`${environment.GetFloorsByBuildingId}${buildId}`, this.httpHeader);
  }

  CreateFloor(FloorVM: CreateFloorVM): Observable<CreateFloorVM> {
    return this.httpClient.post<any>(`${environment.AddFloor}`, FloorVM, this.httpHeader);
  }


  UpdateFloor(FloorObj: EditFloorVM): Observable<EditFloorVM> {
    return this.httpClient.put<EditFloorVM>(`${environment.UpdateFloor}`, FloorObj, this.httpHeader);
  }

  DeleteFloor(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteFloor}${id}`, this.httpHeader);
  }

}
