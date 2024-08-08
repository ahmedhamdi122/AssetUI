import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateRoomVM, EditRoomVM, ListRoomVM } from '../Models/RoomVM';


@Injectable({
  providedIn: 'root'
})

export class RoomService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetRooms(): Observable<ListRoomVM[]> {
    return this.httpClient.get<ListRoomVM[]>(`${environment.ListRooms}`, this.httpHeader);
  }


  GetRoomById(id: number): Observable<EditRoomVM> {
    return this.httpClient.get<EditRoomVM>(`${environment.GetRoomById}${id}`, this.httpHeader);
  }

  GetRoomsByFloorId(floorId: number): Observable<ListRoomVM[]> {
    return this.httpClient.get<ListRoomVM[]>(`${environment.GetRoomsByFloorId}${floorId}`, this.httpHeader);
  }


  CreateRoom(RoomVM: CreateRoomVM): Observable<CreateRoomVM> {
    return this.httpClient.post<any>(`${environment.AddRoom}`, RoomVM, this.httpHeader);
  }


  UpdateRoom(RoomObj: EditRoomVM): Observable<EditRoomVM> {
    return this.httpClient.put<EditRoomVM>(`${environment.UpdateRoom}`, RoomObj, this.httpHeader);
  }

  DeleteRoom(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteRoom}${id}`, this.httpHeader);
  }

}
