import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateHospitalApplicationAttachmentVM, CreateHospitalApplicationVM, EditHospitalApplicationVM, HospitalApplicationAttachmentVM, ListHospitalApplicationVM, MainClass, SearchHospitalApplicationDateVM, SortAndFilterHospitalApplicationVM, SortHospitalAppVM }
  from '../Models/HospitalApplicationVM';
import { Paging } from '../Models/paging';


@Injectable({
  providedIn: 'root'
})

export class HospitalApplicationService {
  constructor(private httpClient: HttpClient) { }
  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'
    })
  };

  GetHospitalApplications(): Observable<ListHospitalApplicationVM[]> {
    return this.httpClient.get<ListHospitalApplicationVM[]>(`${environment.ListHospitalExcludeReasons}`, this.httpHeader);
  }
  // GetHospitalApplicationsWithPaging(page: Paging): Observable<ListHospitalApplicationVM[]> {
  //   return this.httpClient.put<ListHospitalApplicationVM[]>(`${environment.ListHospitalApplicationsWithPaging}`, page, this.httpHeader);
  // }
  // ListHospitalApplicationsWithPagingAndTypeId(appTypeId: number, page: Paging): Observable<ListHospitalApplicationVM[]> {
  //   return this.httpClient.put<ListHospitalApplicationVM[]>(`${environment.ListHospitalApplicationsWithPagingAndTypeId}${appTypeId}`, page, this.httpHeader);
  // }
  // GetCountByAppTypeId(appTypeId: number): Observable<number> {
  //   return this.httpClient.get<number>(`${environment.GetCountByAppTypeId}${appTypeId}`);
  // }
  GenerateHospitalApplicationNumber(): Observable<string> {
    return this.httpClient.get<string>(`${environment.GenerateHospitalApplicationNumber}`);
  }
  // ListHospitalApplicationsByTypeIdAndStatusId(statusId: number, appTypeId: number, hospitalId: number, page: Paging): Observable<ListHospitalApplicationVM[]> {
  //   return this.httpClient.put<ListHospitalApplicationVM[]>(`${environment.ListHospitalApplicationsByTypeIdAndStatusId}${statusId}/${appTypeId}/${hospitalId}`, page, this.httpHeader);
  // }
  // GetcountByAppTypeIdAndStatusId(statusId: number, appTypeId: number, hospitalId: number): Observable<number> {
  //   return this.httpClient.get<number>(`${environment.GetcountByAppTypeIdAndStatusId}${statusId}/${appTypeId}/${hospitalId}`, this.httpHeader);
  // }
  GetHospitalApplicationByDate(pagenumber: number, pagesize: number, searchObj: SearchHospitalApplicationDateVM): Observable<ListHospitalApplicationVM[]> {
    return this.httpClient.post<ListHospitalApplicationVM[]>(`${environment.GetHospitalApplicationByDate}${pagenumber}/${pagesize}`, searchObj, this.httpHeader);
  }
  // CountGetHospitalApplicationByDate(searchObj: SearchHospitalApplicationDateVM): Observable<number> {
  //   return this.httpClient.post<number>(`${environment.CountGetHospitalApplicationByDate}`, searchObj, this.httpHeader);
  // }
  // ListHospitalApplicationsWithPagingByHospitalId(hospitalId: number, page: Paging): Observable<ListHospitalApplicationVM[]> {
  //   return this.httpClient.put<ListHospitalApplicationVM[]>(`${environment.ListHospitalApplicationsWithPagingByHospitalId}${hospitalId}`, page, this.httpHeader);
  // }
  // getCount(): Observable<number> {
  //   return this.httpClient.get<number>(`${environment.getHospitalApplicationCount}`);
  // }
  // getCount2(hospitalId: number): Observable<number> {
  //   return this.httpClient.get<number>(`${environment.getHospitalApplicationCount}${hospitalId}`);
  // }
  // GetAllHospitalsByStatusId(page: Paging, statusId: number, hospitalId: number): Observable<ListHospitalApplicationVM[]> {
  //   return this.httpClient.put<ListHospitalApplicationVM[]>(`${environment.GetAllHospitalsByStatusId}${statusId}/${hospitalId}`, page, this.httpHeader);
  // }
  // GetHospitalCountAfterFilterStatusId(statusId: number, hospitalId: number): Observable<number> {
  //   return this.httpClient.get<number>(`${environment.GetHospitalCountAfterFilterStatusId}${statusId}/${hospitalId}`);
  // }
  GetHospitalApplicationById(id: number): Observable<EditHospitalApplicationVM> {
    return this.httpClient.get<EditHospitalApplicationVM>(`${environment.GetHospitalApplicationById}${id}`, this.httpHeader);
  }
  GetHospitalApplicationDetailById(id: number): Observable<EditHospitalApplicationVM> {
    return this.httpClient.get<EditHospitalApplicationVM>(`${environment.GetHospitalApplicationDetailById}${id}`, this.httpHeader);
  }
  CreateHospitalApplication(hospitalApplicationVM: CreateHospitalApplicationVM): Observable<number> {
    return this.httpClient.post<any>(`${environment.AddHospitalApplication}`, hospitalApplicationVM, this.httpHeader);
  }
  UpdateHospitalApplication(HospitalApplicationObj: EditHospitalApplicationVM): Observable<EditHospitalApplicationVM> {
    return this.httpClient.put<EditHospitalApplicationVM>(`${environment.UpdateHospitalApplication}`, HospitalApplicationObj, this.httpHeader);
  }
  UpdateExcludedDate(model: EditHospitalApplicationVM): Observable<EditHospitalApplicationVM> {
    return this.httpClient.put<EditHospitalApplicationVM>(`${environment.UpdateHospitalExcludedDate}`, model, this.httpHeader);
  }
  DeleteHospitalApplication(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteHospitalApplication}${id}`, this.httpHeader);
  }
  CreateHospitalApplicationAttachments(attachObj: CreateHospitalApplicationAttachmentVM): Observable<CreateHospitalApplicationAttachmentVM> {
    return this.httpClient.post<any>(`${environment.CreateHospitalApplicationAttachments}`, attachObj, this.httpHeader);
  }
  GetAttachmentByHospitalApplicationId(hospitalApplicationId: number): Observable<HospitalApplicationAttachmentVM[]> {
    return this.httpClient.get<HospitalApplicationAttachmentVM[]>(`${environment.GetAttachmentByHospitalApplicationId}${hospitalApplicationId}`, this.httpHeader);
  }
  DeleteHospitalApplicationAttachmentById(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteHospitalApplicationAttachment}${id}`, this.httpHeader);
  }
  // sortHospitalApp(pagenumber: number, pagesize: number, sortObj: SortHospitalAppVM): Observable<ListHospitalApplicationVM[]> {
  //   return this.httpClient.post<ListHospitalApplicationVM[]>(`${environment.sortHospitalApp}${pagenumber}/${pagesize}`, sortObj, this.httpHeader);
  // }



  SendHospitalExcludeEmail(hospitalApplicationId: number): Observable<any> {
    return this.httpClient.get<any>(`${environment.SendHospitalExcludeEmail}${hospitalApplicationId}`, this.httpHeader);
  }

  ListHospitalApplications(data: SortAndFilterHospitalApplicationVM, pageNumber: number, pageSize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.ListHospitalApplications}${pageNumber}/${pageSize}`, data, this.httpHeader);
  }




  // GetAllHospitalExecludes(searchObj: SearchHospitalApplicationDateVM, statusId: number, appTypeId: number, hospitalId: number, pageNumber: number, pageSize: number): Observable<MainClass> {
  //   return this.httpClient.post<MainClass>(`${environment.GetAllHospitalExecludes}${statusId}/${appTypeId}/${hospitalId}/${pageNumber}/${pageSize}`, searchObj, this.httpHeader);
  // }

  // GetAllHospitalHolds(searchObj: SearchHospitalApplicationDateVM, statusId: number, appTypeId: number, hospitalId: number, pageNumber: number, pageSize: number): Observable<MainClass> {
  //   return this.httpClient.post<MainClass>(`${environment.GetAllHospitalHolds}${statusId}/${appTypeId}/${hospitalId}/${pageNumber}/${pageSize}`, searchObj, this.httpHeader);
  // }





}
