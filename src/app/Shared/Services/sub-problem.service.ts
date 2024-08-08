import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Paging } from '../Models/paging';
import { CreateSubProblemVM, EditSubProblemVM, IndexSubProblemVM } from '../Models/SubProblemVM';
@Injectable({
  providedIn: 'root'
})
export class SubProblemService {
  constructor(private httpClient: HttpClient) { }
  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'
    })
  };

  GetAllSubProblems(): Observable<IndexSubProblemVM[]> {
    return this.httpClient.get<IndexSubProblemVM[]>(`${environment.SubProblem}`, this.httpHeader);
  }
  GetAllSubProblemsByProblemId(ProblemId:number): Observable<IndexSubProblemVM[]> {
    return this.httpClient.get<IndexSubProblemVM[]>(`${environment.GetAllSubProblemsByProblemId}${ProblemId}`, this.httpHeader);
  }
  inserSubProblem(reqPeriorty: CreateSubProblemVM): Observable<CreateSubProblemVM> {
    return this.httpClient.post<CreateSubProblemVM>(`${environment.SubProblem}`, reqPeriorty, this.httpHeader);
  }
  GetSubProblemById(id: number): Observable<EditSubProblemVM> {
    return this.httpClient.get<EditSubProblemVM>(`${environment.GetSubProblemById}${id}`, this.httpHeader);
  }

  
  // GetSubProblemsByProblemName(probName: number): Observable<IndexSubProblemVM[]> {
  //   return this.httpClient.get<IndexSubProblemVM[]>(`${environment.GetSubProblemsByProblemName}${probName}`, this.httpHeader);
  // }

  UpdateSubProblem(subProblemObj: EditSubProblemVM): Observable<EditSubProblemVM> {
    return this.httpClient.put<EditSubProblemVM>(`${environment.UpdateSubProblem}`, subProblemObj, this.httpHeader);
  }

  DeleteSubProblem(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteSubProblem}${id}`, this.httpHeader);
  }
  GetSubProblemWithPaging(PageInfo: Paging): Observable<IndexSubProblemVM[]> {
    return this.httpClient.put<IndexSubProblemVM[]>(`${environment.GetSubProblemWithPaging}`, PageInfo, this.httpHeader);
  }

  getSubProblemCount(): Observable<number> {
    return this.httpClient.get<number>(`${environment.getSubProblemcount}`);
  }
}
