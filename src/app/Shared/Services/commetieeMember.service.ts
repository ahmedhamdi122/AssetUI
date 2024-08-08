import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateCommetieeMemberVM, EditCommetieeMemberVM, ListCommetieeMemberVM } from '../Models/CommetieeMemberVM';


@Injectable({
  providedIn: 'root'
})

export class CommetieeMemberService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetCommetieeMembers(): Observable<ListCommetieeMemberVM[]> {
    return this.httpClient.get<ListCommetieeMemberVM[]>(`${environment.ListCommetieeMembers}`, this.httpHeader);
  }



  CountCommetieeMembers(): Observable<number> {
    return this.httpClient.get<number>(`${environment.CountCommetieeMembers}`, this.httpHeader);
  }

  GetCommetieeMemberById(id: number): Observable<EditCommetieeMemberVM> {
    return this.httpClient.get<EditCommetieeMemberVM>(`${environment.GetCommetieeMemberById}${id}`, this.httpHeader);
  }
  CreateCommetieeMember(CommetieeMemberVM: CreateCommetieeMemberVM): Observable<CreateCommetieeMemberVM> {
    return this.httpClient.post<any>(`${environment.AddCommetieeMember}`, CommetieeMemberVM, this.httpHeader);
  }


  UpdateCommetieeMember(CommetieeMemberObj: EditCommetieeMemberVM): Observable<EditCommetieeMemberVM> {
    return this.httpClient.put<EditCommetieeMemberVM>(`${environment.UpdateCommetieeMember}`, CommetieeMemberObj, this.httpHeader);
  }

  DeleteCommetieeMember(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteCommetieeMember}${id}`, this.httpHeader);
  }

}
