import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ListRequestDocumentVM } from 'src/app/Shared/Models/RequestDocumentVM';
import { RequestDetails } from 'src/app/Shared/Models/RequestTrackingVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { ListWorkOrderFromTrackingVM } from 'src/app/Shared/Models/WorkOrderTrackingVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { RequestDocumentService } from 'src/app/Shared/Services/request-document.service';
import { RequestTrackingService } from 'src/app/Shared/Services/request-tracking.service';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { WorkOrderTrackingService } from 'src/app/Shared/Services/work-order-tracking.service';
import { environment } from 'src/environments/environment';
import { WorkOrderAttachmentService } from 'src/app/Shared/Services/work-order-attachment.service';
import { IndexWorkOrderAttachmentVM } from 'src/app/Shared/Models/WorkOrderAttachmentVM';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  lang = localStorage.getItem("lang");
  // textDir: string = 'ltr';
  currentUser: LoggedUser;

  requestDetailObj: RequestDetails;
  isShowFiles: boolean = false;
  isWOShowFiles: boolean = false;
  lstDocuments: ListRequestDocumentVM[] = [];
  lstWorkOrders: ListWorkOrderFromTrackingVM[] = [];
  errorMessage: string = '';
  statusId: number = 0;
  lstWO: ListWorkOrderFromTrackingVM[] = [];

  lstWODocuments: IndexWorkOrderAttachmentVM[] = [];
  workOrderOj: ListWorkOrderFromTrackingVM;
  constructor(private requestTrackingService: RequestTrackingService, private requestDocumentService: RequestDocumentService,
    private uploadService: UploadFilesService, private ref: DynamicDialogRef, private workOrderAttachmentService: WorkOrderAttachmentService,
    private workOrderTrackingService: WorkOrderTrackingService, private workorderTracking: WorkOrderTrackingService,
    private config: DynamicDialogConfig, private authenticationService: AuthenticationService) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    // if (this.lang == 'en') {
    //   this.textDir = 'ltr';
    // } else if (this.lang == 'ar') {
    //   this.textDir = 'rtl';
    // }

    this.requestDetailObj = {
      wONotes: '', departmentName: '', departmentNameAr: '',
      hospitalId: 0, barcode: '', serialNumber: '', createdById: "", descriptionDate: new Date(), modeName: "", lstTracking: [], requestStatusId: 0, periorityName: "", requestId: 0, statusName: "", subProblemName: "", userName: "",
      id: 0, requestCode: '', subject: '', requestPeriorityId: 0, requestDate: new Date(), requestTypeId: 0, requestTypeName: "", subProblemId: 0, description: '', requestModeId: 0, assetDetailId: 0,
      assetName: '', assetNameAr: '', modeNameAr: '', periorityNameAr: '', requestTypeNameAr: '', statusNameAr: '', subProblemNameAr: '', problemId: 0, problemName: '', problemNameAr: '', assetCode: ''
    }
    this.workOrderOj = { actualEndDate: new Date(), actualStartDate: new Date(), assignedTo: "", assignedToName: '', createdBy: '', createdById: '', creationDate: new Date(), id: 0, note: '', notes: '', plannedEndDate: new Date(), plannedStartDate: new Date(), requestId: 0, requestSubject: '', serialNumber: '', statusName: '', subject: '', trackId: 0, workOrderDate: new Date(), workOrderId: 0, workOrderNumber: '', workOrderPeriorityId: 0, workOrderPeriorityName: '', workOrderStatusId: 0, workOrderSubject: '', workOrderTrackingId: 0, workOrderTypeId: 0, workOrderTypeName: '' };

    let id = this.config.data.id;
    this.requestTrackingService.GetAllDescByRequestID(id).subscribe(
      res => {
        this.requestDetailObj = res
      });

    this.workOrderTrackingService.GetAllWorkOrderFromTrackingByServiceRequestUserId(id, this.currentUser.id)
      .subscribe(items => {
        this.lstWorkOrders = items;
      });

    if (this.config.data != null || this.config.data != undefined) {
      let statusId = this.config.data.statusId;
      if (statusId != undefined) {
        this.statusId = statusId;
      }
    }
    else {
      this.statusId = 0;
    }
    this.workorderTracking.GetAllWorkOrderFromTrackingByServiceRequestUserId(id, this.currentUser.id).subscribe(listworkorders => {
      if (listworkorders.length > 0) {
        this.lstWO = listworkorders;
        this.workOrderOj.workOrderNumber = listworkorders[0].workOrderNumber;
        this.workOrderOj.serialNumber = listworkorders[0].serialNumber;
        this.workOrderOj.subject = listworkorders[0].subject;
      }
    });
  }
  getDocuments(trackid: number) {
    this.requestDocumentService.GetRequestDocumentsByRequestTrackingId(trackid).subscribe(lstdocs => {
      this.lstDocuments = lstdocs;
    });
    this.isShowFiles = true;
  }
  getWODocuments(trackid: number) {
    this.workOrderAttachmentService.GetWorkOrderAttachmentsByWorkOrderTrackingId(trackid).subscribe(lstdocs => {
      this.lstWODocuments = lstdocs;
    });
    this.isWOShowFiles = true;
  }
  close() {
    this.ref.close({ data: this.statusId });
  }
  downloadFile(fileName) {
    var filePath = `${environment.Domain}UploadedAttachments/`;
    this.uploadService.downloadRequestTrackFile(fileName).subscribe(file => {
      var dwnldFile = filePath + 'RequestDocuments/' + fileName;
      if (fileName != "" || fileName != null) {
        window.open(dwnldFile);
      }
    })
  }
  downloadWOFile(fileName) {
    var filePath = `${environment.Domain}UploadedAttachments/`;
    this.uploadService.downloadWorkOrderFile(fileName).subscribe(file => {
      var dwnldFile = filePath + 'WorkOrderFiles/' + fileName;
      if (fileName != "" || fileName != null) {
        window.open(dwnldFile);
      }
    })
  }
}
