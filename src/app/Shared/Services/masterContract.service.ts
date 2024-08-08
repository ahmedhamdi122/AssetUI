import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateMasterContractVM, DetailMasterContractVM, EditMasterContractVM, GeneratedMasterContractNumberVM, ListMasterContractVM, MainClass, SortAndFilterContractVM } from '../Models/masterContractVM';
import { environment } from 'src/environments/environment';
import { CreateContractDetailVM, ListContractDetailVM } from '../Models/contractDetailVM';
import { ListHospitalVM } from '../Models/hospitalVM';
import { CreateContractAttachmentVM, ListContractAttachmentVM } from '../Models/contractAttachmentVM';

@Injectable({
  providedIn: 'root'
})
export class MasterContractService {
  constructor(private httpClient: HttpClient) { }
  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'
    })
  };
  GetMasterContracts(): Observable<ListMasterContractVM[]> {
    return this.httpClient.get<ListMasterContractVM[]>(`${environment.ListMasterContracts}`, this.httpHeader);
  }
  GetMasterContractsByHospitalId(hospitalId: number): Observable<ListMasterContractVM[]> {
    return this.httpClient.get<ListMasterContractVM[]>(`${environment.GetListBoxMasterContractsByHospitalId}${hospitalId}`, this.httpHeader);
  }

  GetMasterContractsByHospitalId2(hospitalId: number): Observable<MainClass> {
    return this.httpClient.get<MainClass>(`${environment.GetListBoxMasterContractsByHospitalId}${hospitalId}`, this.httpHeader);
  }

  ListMasterContracts(data: SortAndFilterContractVM, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.GetMasterContracts}${pageNumber}/${pageSize}`, data, this.httpHeader);
  }





  GetLastDocumentForMasterContractId(masterContractId: Number): Observable<ListContractAttachmentVM> {
    return this.httpClient.get<ListContractAttachmentVM>(`${environment.GetLastDocumentForMasterContractId}${masterContractId}`, this.httpHeader);
  }
  DeleteContractAttachment(attachId: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteContractAttachment}${attachId}`, this.httpHeader);
  }

  getCount(hospitalId: number): Observable<number> {
    return this.httpClient.get<number>(`${environment.getContractcount}${hospitalId}`);
  }
  GetMasterContractById(id: number): Observable<EditMasterContractVM> {
    return this.httpClient.get<EditMasterContractVM>(`${environment.GetMasterContractById}${id}`, this.httpHeader);
  }



  MasterContractById(id: number): Observable<DetailMasterContractVM> {
    return this.httpClient.get<DetailMasterContractVM>(`${environment.GetMasterContractById}${id}`, this.httpHeader);
  }

  CreateMasterContract(MasterContractVM: CreateMasterContractVM): Observable<number> {
    return this.httpClient.post<any>(`${environment.AddMasterContract}`, MasterContractVM, this.httpHeader);
  }

  UpdateMasterContract(MasterContractVM: EditMasterContractVM): Observable<EditMasterContractVM> {
    return this.httpClient.put<EditMasterContractVM>(`${environment.UpdateMasterContract}`, MasterContractVM, this.httpHeader);
  }
  DeleteMasterContract(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteMasterContract}${id}`, this.httpHeader);
  }
  CreateContract(model: CreateContractDetailVM): Observable<number> {
    return this.httpClient.post<any>(`${environment.AddContract}`, model, this.httpHeader);
  }
  DeleteContract(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteContract}${id}`, this.httpHeader);
  }
  GetContractsByMasterContractId(masterId: number): Observable<any> {
    return this.httpClient.get<any>(`${environment.GetContractsByMasterContractId}${masterId}`, this.httpHeader);
  }
  GetAssetContractsByMasterContractId(masterId: number): Observable<ListContractDetailVM[]> {
    return this.httpClient.get<ListContractDetailVM[]>(`${environment.GetContractsByMasterContractId}${masterId}`, this.httpHeader);
  }
  GetListofHospitalsFromAssetContractDetailByMasterContractId(masterId: number): Observable<ListHospitalVM[]> {
    return this.httpClient.get<ListHospitalVM[]>(`${environment.GetListofHospitalsFromAssetContractDetailByMasterContractId}${masterId}`, this.httpHeader);
  }
  GetContractAssetsByHospitalId(hospitalId: number, masterContractId: number): Observable<ListContractDetailVM[]> {
    return this.httpClient.get<ListContractDetailVM[]>(`${environment.GetContractAssetsByHospitalId}${hospitalId}/${masterContractId}`, this.httpHeader);
  }


  GetContractByHospitalId(hospitalId: number): Observable<ListContractDetailVM[]> {
    return this.httpClient.get<ListContractDetailVM[]>(`${environment.GetContractByHospitalId}${hospitalId}`, this.httpHeader);
  }

  CreateContractAttachments(attachObj: CreateContractAttachmentVM): Observable<number> {
    return this.httpClient.post<number>(`${environment.CreateContractAttachments}`, attachObj, this.httpHeader);
  }


  GenerateMasterContractSerial(): Observable<GeneratedMasterContractNumberVM> {
    return this.httpClient.get<GeneratedMasterContractNumberVM>(`${environment.GenerateMasterContractSerial}`, this.httpHeader);
  }


  GetContractAttachmentByMasterContractId(masterContractId: number): Observable<ListContractAttachmentVM[]> {
    return this.httpClient.get<ListContractAttachmentVM[]>(`${environment.GetContractAttachmentByMasterContractId}${masterContractId}`, this.httpHeader);
  }

  AlertContractsEndBefore3Months(hospitalId: number, duration: number, pageNumber: number, pagesize: number): Observable<MainClass> {
    return this.httpClient.get<MainClass>(`${environment.AlertContractsEndBefore3Months}${hospitalId}/${duration}/${pageNumber}/${pagesize}`, this.httpHeader);
  }

}
