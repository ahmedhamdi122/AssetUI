import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FileUpload } from 'primeng/fileupload';

@Injectable({
  providedIn: 'root'
})
export class UploadFilesService {

  constructor(private http: HttpClient) { }

  uploadMasterAssetImage(file: File, fileName: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, fileName);
    const req = new HttpRequest('POST', `${environment.Domain}api/MasterAsset/UploadMasterAssetImage`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }


  uploadVisitFiles(file: File, fileName: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, fileName);
    const req = new HttpRequest('POST', `${environment.Domain}api/Visit/UploadVisitFiles`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }



  uploadMasterAssetFiles(file: File, fileName: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, fileName);
    const req = new HttpRequest('POST', `${environment.Domain}api/MasterAsset/UploadMasterAssetFiles`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  uploadSupplierFile(file: File, fileName: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, fileName);
    const req = new HttpRequest('POST', `${environment.Domain}api/Supplier/UploadSupplierFile`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  uploadRequestFiles(file: File, fileName: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, fileName);
    const req = new HttpRequest('POST', `${environment.Domain}api/Request/UploadRequestFiles`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }


  uploadWorkOrderFiles(file: File, fileName: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, fileName);
    const req = new HttpRequest('POST', `${environment.Domain}api/WorkOrder/UploadWorkOrderFiles`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  uploadContractFiles(file: File, fileName: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, fileName);
    const req = new HttpRequest('POST', `${environment.Domain}api/Contract/UploadContractFiles`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  uploadAssetDetailFiles(file: File, fileName: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, fileName);
    const req = new HttpRequest('POST', `${environment.Domain}api/AssetDetail/UploadAssetDetailFiles`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }


  uploadHospitalApplicationFiles(file: File, fileName: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, fileName);
    const req = new HttpRequest('POST', `${environment.Domain}api/HospitalApplication/UploadHospitalApplicationFiles`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  uploadHospitalTransactionFiles(file: FileUpload, fileName: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file.files[0], fileName);
    const req = new HttpRequest('POST', `${environment.Domain}api/HospitalApplication/UploadHospitalApplicationFiles`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }


  uploadSupplierExecludeAssetFiles(file: File, fileName: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, fileName);
    const req = new HttpRequest('POST', `${environment.Domain}api/SupplierExecludeAsset/UploadSupplierExecludeAssetFiles`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  uploadScrapFiles(file: File, fileName: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, fileName);
    const req = new HttpRequest('POST', `${environment.Domain}api/Scrap/UploadScrapFiles`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }


  uploadWNPMAssetTimeFiles(file: File, fileName: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, fileName);
    const req = new HttpRequest('POST', `${environment.Domain}api/WNAssetTimes/UploadWNPMAssetTimeFiles`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }



  uploadExternalAssetMovementFiles(file: File, fileName: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, fileName);
    const req = new HttpRequest('POST', `${environment.Domain}api/ExternalAssetMovement/UploadExternalAssetMovementFiles`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }


  uploadExternalFixFiles(file: File, fileName: string): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file, fileName);
    const req = new HttpRequest('POST', `${environment.Domain}api/ExternalFix/UploadExternalFixFiles`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }

  

  downloadWOPMPDF(fileName): any {
    return this.http.get(`${environment.Domain}UploadedAttachments/WOReports/${fileName}`, { responseType: 'blob' });
  }

  getFiles(): Observable<any> {
    return this.http.get(`${environment.Domain}UploadedAttachments/MasterAssets`);
  }
  downloadMasterAssetFile(fileName): any {
    return this.http.get(`${environment.Domain}UploadedAttachments/MasterAssets/${fileName}`, { responseType: 'blob' });
  }


  downloadAssetDetailFile(fileName): any {
    return this.http.get(`${environment.Domain}UploadedAttachments/AssetDetails/${fileName}`, { responseType: 'blob' });
  }




  downloadQrCodeCardFile(fileName): any {
    return this.http.get(`${environment.Domain}UploadedAttachments/QrTemplates/${fileName}`, { responseType: 'blob' });
  }



  downloadSupplierCardFile(fileName): any {
    return this.http.get(`${environment.Domain}UploadedAttachments/SupplierTemplates/${fileName}`, { responseType: 'blob' });
  }



  downloadRequestTrackFile(fileName): any {
    return this.http.get(`${environment.Domain}UploadedAttachments/RequestDocuments/${fileName}`, { responseType: 'blob' });
  }

  downloadWorkOrderFile(fileName): any {
    return this.http.get(`${environment.Domain}UploadedAttachments/WorkOrderFiles/${fileName}`, { responseType: 'blob' });
  }


  downloadMasterContractFile(fileName): any {
    return this.http.get(`${environment.Domain}UploadedAttachments/MasterContractFiles/${fileName}`, { responseType: 'blob' });
  }

  downloadVisitFile(fileName): any {
    return this.http.get(`${environment.Domain}UploadedAttachments/VisitFiles/${fileName}`, { responseType: 'blob' });
  }


  downloadHospitalApplicationFile(fileName): any {
    return this.http.get(`${environment.Domain}UploadedAttachments/HospitalApplications/${fileName}`, { responseType: 'blob' });
  }

  downloadSupplierExecludeAssetFile(fileName): any {
    return this.http.get(`${environment.Domain}UploadedAttachments/SupplierExecludeAssets/${fileName}`, { responseType: 'blob' });
  }

  getReportFile(): any {
    return this.http.get(`${environment.Domain}Reports/AssetReport`, { responseType: 'blob' });
  }


  downloadCreateSRReportWithinDatePDF(fileName): any {
    return this.http.get(`${environment.Domain}UploadedAttachments/SRReports/${fileName}`, { responseType: 'blob' });
  }

  downloadScrapPDF(fileName): any {
    return this.http.get(`${environment.Domain}UploadedAttachments/ScrapReports/${fileName}`, { responseType: 'blob' });
  }

  downloadCheckedScrapPDF(fileName): any {
    return this.http.get(`${environment.Domain}UploadedAttachments/ScrapReports/${fileName}`, { responseType: 'blob' });
  }



  downloadSRInProgressPDF(fileName): any {
    return this.http.get(`${environment.Domain}UploadedAttachments/SRReports/${fileName}`, { responseType: 'blob' });
  }

  downloadSupplierFile(fileName): any {
    return this.http.get(`${environment.Domain}UploadedAttachments/SupplierAttachments/${fileName}`, { responseType: 'blob' });
  }


  downloadCreateWOReportWithinDatePDF(fileName): any {
    return this.http.get(`${environment.Domain}UploadedAttachments/WOReports/${fileName}`, { responseType: 'blob' });
  }




  downloadCreateSRWOReportWithinDatePDF(fileName): any {
    return this.http.get(`${environment.Domain}UploadedAttachments/SRWOReports/${fileName}`, { responseType: 'blob' });
  }


  downloadScrapFile(fileName): any {
    return this.http.get(`${environment.Domain}UploadedAttachments/ScrapFiles/${fileName}`, { responseType: 'blob' });
  }

  DownloadAssetDepartmentBrandSupplierPDF(fileName): any {
    return this.http.get(`${environment.Domain}UploadedAttachments/AssetDetails/FilterAssetDetails/${fileName}`, { responseType: 'blob' });
  }

  downloadWNPMAssetTimeFile(fileName): any {
    return this.http.get(`${environment.Domain}UploadedAttachments/WNPMAssetTime/${fileName}`, { responseType: 'blob' });
  }


  downloadCreateServiceRequestCheckedPDF(fileName): any {
    return this.http.get(`${environment.Domain}UploadedAttachments/SRReports/${fileName}`, { responseType: 'blob' });
  }

  downloadCreateWorkOrderCheckedPDF(fileName): any {
    return this.http.get(`${environment.Domain}UploadedAttachments/WOReports/${fileName}`, { responseType: 'blob' });
  }


  downloadCreateServiceRequestPDF(fileName): any {
    return this.http.get(`${environment.Domain}UploadedAttachments/SRReports/${fileName}`, { responseType: 'blob' });
  }
  downloadExternalAssetMovementFile(fileName): any {
    return this.http.get(`${environment.Domain}UploadedAttachments/ExternalAssetMovements/${fileName}`, { responseType: 'blob' });
  }


  DownloadExternalFixFiles(fileName): any {
    return this.http.get(`${environment.Domain}UploadedAttachments/ExternalFixFiles/${fileName}`, { responseType: 'blob' });
  }
  downloadAllOpenRequests(fileName): any {
    return this.http.get(`${environment.Domain}UploadedAttachments/SRReports/${fileName}`, { responseType: 'blob' });
  }


  downloadCreateSupplierExecludePDF(fileName): any {
    return this.http.get(`${environment.Domain}UploadedAttachments/SupplierExecludePDF/${fileName}`, { responseType: 'blob' });
  }
  downloadAssetStatusPDF(fileName): any {
    return this.http.get(`${environment.Domain}UploadedAttachments/AssetStatus/${fileName}`, { responseType: 'blob' });
  }
  
  downloadAssetHistory(fileName): any {
    return this.http.get(`${environment.Domain}UploadedAttachments/AssetDetails/${fileName}`, { responseType: 'blob' });
  }

}