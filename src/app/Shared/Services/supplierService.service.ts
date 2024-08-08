import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CreateSupplierVM, EditSupplierVM, GenerateSupplierCode, ListSupplierVM, MainClass, SortSupplierVM } from '../Models/supplierVM';
import { Paging } from '../Models/paging';
import { CreateSupplierAttachment, ListSupplierAttachmentVM } from '../Models/SupplierAttachmentVM';


@Injectable({
  providedIn: 'root'
})

export class SupplierService {
  constructor(private httpClient: HttpClient) { }

  httpHeader = {
    headers: new HttpHeaders({
      'content-type': 'application/json',
      'Accept': '*/*'

    })
  };

  GetSuppliers(): Observable<ListSupplierVM[]> {
    return this.httpClient.get<ListSupplierVM[]>(`${environment.ListSuppliers}`, this.httpHeader);
  }

  GetTop10Suppliers(hospitalId: number): Observable<ListSupplierVM[]> {
    return this.httpClient.get<ListSupplierVM[]>(`${environment.GetTop10Suppliers}${hospitalId}`, this.httpHeader);
  }
  GetTop10SuppliersCount(hospitalId: number): Observable<number> {
    return this.httpClient.get<number>(`${environment.GetTop10SuppliersCount}${hospitalId}`, this.httpHeader);
  }

  sortSuppliers(pagenumber: number, pagesize: number, sortObj: SortSupplierVM): Observable<ListSupplierVM[]> {
    return this.httpClient.post<ListSupplierVM[]>(`${environment.SortSuppliers}${pagenumber}/${pagesize}`, sortObj, this.httpHeader);
  }

  findSupplier(strText: string, pagenumber: number, pagesize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.FindSupplier}${pagenumber}/${pagesize}`, strText, this.httpHeader);
  }


  findSupplierByText(strText: string): Observable<ListSupplierVM[]> {
    return this.httpClient.get<ListSupplierVM[]>(`${environment.FindSupplierByText}${strText}`, this.httpHeader);
  }


  CountSuppliers(): Observable<number> {
    return this.httpClient.get<number>(`${environment.CountSuppliers}`, this.httpHeader);
  }

  GetSupplierById(id: number): Observable<EditSupplierVM> {
    return this.httpClient.get<EditSupplierVM>(`${environment.GetSupplierById}${id}`, this.httpHeader);
  }

  SearchGetSupplierById(id: number): Observable<ListSupplierVM> {
    return this.httpClient.get<ListSupplierVM>(`${environment.GetSupplierById}${id}`, this.httpHeader);
  }



  CreateSupplier(SupplierVM: CreateSupplierVM): Observable<CreateSupplierVM> {
    return this.httpClient.post<any>(`${environment.AddSupplier}`, SupplierVM, this.httpHeader);
  }


  UpdateSupplier(SupplierObj: EditSupplierVM): Observable<EditSupplierVM> {
    return this.httpClient.put<EditSupplierVM>(`${environment.UpdateSupplier}`, SupplierObj, this.httpHeader);
  }

  DeleteSupplier(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteSupplier}${id}`, this.httpHeader);
  }
  GetSupplierWithPaging(PageInfo: Paging): Observable<ListSupplierVM[]> {
    return this.httpClient.put<ListSupplierVM[]>(`${environment.GetSupplierWithPaging}`, PageInfo, this.httpHeader);
  }

  DeleteSupplierAttachment(id: number): Observable<any> {
    return this.httpClient.delete<any>(`${environment.DeleteSupplierAttachment}${id}`, this.httpHeader);
  }

  GetAllSuppliersWithPaging(pagenumber: number, pagesize: number): Observable<MainClass> {
    return this.httpClient.post<MainClass>(`${environment.GetAllSuppliersWithPaging}${pagenumber}/${pagesize}`, this.httpHeader);
  }
  getSupplierCount(): Observable<number> {
    return this.httpClient.get<number>(`${environment.getSuppliercount}`);
  }

  CreateSupplierAttachment(attachObj: CreateSupplierAttachment): Observable<number> {
    return this.httpClient.post<number>(`${environment.CreateSupplierAttachment}`, attachObj, this.httpHeader);
  }
  GetSupplierAttachmentsBySupplierId(supplierId: number): Observable<ListSupplierAttachmentVM[]> {
    return this.httpClient.get<ListSupplierAttachmentVM[]>(`${environment.GetSupplierAttachmentsBySupplierId}${supplierId}`, this.httpHeader);
  }

  GenerateSupplierCode(): Observable<GenerateSupplierCode> {
    return this.httpClient.get<GenerateSupplierCode>(`${environment.GenerateSupplierCode}`, this.httpHeader);
  }



  CreateSupplierPDF(lang: string): Observable<any> {
    return this.httpClient.post<any>(`${environment.CreateSupplierPDF}${lang}`, this.httpHeader);
  }



  CreateSelectedSupplierPDF(suppliers: ListSupplierVM[]): Observable<ListSupplierVM[]> {
    return this.httpClient.post<ListSupplierVM[]>(`${environment.CreateSelectedSupplierPDF}`, suppliers, this.httpHeader);
  }


  downloadSupplierPDF(fileName): any {
    return this.httpClient.get(`${environment.Domain}UploadedAttachments/SupplierPDF/${fileName}`, { responseType: 'blob' });
  }

  downloadSupplierCheckBoxPDF(fileName): any {
    return this.httpClient.get(`${environment.Domain}UploadedAttachments/${fileName}`, { responseType: 'blob' });
  }


  DownloadSupplierCardPDF(fileName): any {
    return this.httpClient.get(`${environment.Domain}UploadedAttachments/SupplierTemplates/${fileName}`, { responseType: 'blob' });
  }

  GenerateWordForSelectedSupplier(selectedSuppliers: ListSupplierVM[], lang: string): Observable<any> {
    return this.httpClient.post<any>(`${environment.GenerateWordForSelectedSupplier}${lang}`, selectedSuppliers, this.httpHeader);
  }

  GenerateWordForAllSupplier(lang: string): Observable<any> {
    return this.httpClient.post<any>(`${environment.GenerateWordForAllSupplier}${lang}`, this.httpHeader);
  }

  GetLastDocumentForSupplierId(supplierId: number): Observable<ListSupplierAttachmentVM> {
    return this.httpClient.get<ListSupplierAttachmentVM>(`${environment.GetLastDocumentForSupplierId}${supplierId}`, this.httpHeader);

  }
}
