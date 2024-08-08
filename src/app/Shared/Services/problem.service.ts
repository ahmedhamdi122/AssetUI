import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Paging } from '../Models/paging';
import { CreateProblemVM, EditProblemVM, IndexProblemVM } from '../Models/ProblemVM';
@Injectable({
  providedIn: 'root'
})
export class ProblemService {

  constructor(private httpClient: HttpClient) { }
  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'
    })
  };

  GetAllProblems(): Observable<IndexProblemVM[]> {
    return this.httpClient.get<IndexProblemVM[]>(`${environment.Problem}`, this.httpHeader);
  }
  inserProblem(reqPeriorty: CreateProblemVM): Observable<CreateProblemVM> {
    return this.httpClient.post<CreateProblemVM>(`${environment.Problem}`, reqPeriorty, this.httpHeader);
  }
  GetProblemById(id: number): Observable<EditProblemVM> {
    return this.httpClient.get<EditProblemVM>(`${environment.GetProblemById}${id}`, this.httpHeader);
  }

  GetProblemByMasterAssetId(masterAssetId: number): Observable<IndexProblemVM[]> {
    return this.httpClient.get<IndexProblemVM[]>(`${environment.GetProblemByMasterAssetId}${masterAssetId}`, this.httpHeader);
  }

  GetProblemBySubProblemId(subProblemId: number): Observable<IndexProblemVM[]> {
    return this.httpClient.get<IndexProblemVM[]>(`${environment.GetProblemBySubProblemId}${subProblemId}`, this.httpHeader);
  }
  CreateProblem(ProblemVM: CreateProblemVM): Observable<number> {
    return this.httpClient.post<number>(`${environment.AddProblem}`, ProblemVM, this.httpHeader);
  }

  UpdateProblem(ProblemObj: EditProblemVM): Observable<EditProblemVM> {
    return this.httpClient.put<EditProblemVM>(`${environment.UpdateProblem}`, ProblemObj, this.httpHeader);
  }

  DeleteProblem(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteProblem}${id}`, this.httpHeader);
  }
  GetProblemWithPaging(PageInfo: Paging): Observable<IndexProblemVM[]> {
    return this.httpClient.put<IndexProblemVM[]>(`${environment.GetProblemWithPaging}`, PageInfo, this.httpHeader);
  }

  getProblemCount(): Observable<number> {
    return this.httpClient.get<number>(`${environment.getProblemcount}`);
  }
}