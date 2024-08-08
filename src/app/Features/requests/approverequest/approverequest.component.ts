import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateAssetStatusTransactionVM } from 'src/app/Shared/Models/assetStatusTransactionVM';
import { ListEmployeeVM } from 'src/app/Shared/Models/employeeVM';
import { CreateRequestDocument, ListRequestDocumentVM } from 'src/app/Shared/Models/RequestDocumentVM';
import { CreateRequestTracking, RequestDetails } from 'src/app/Shared/Models/RequestTrackingVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { CreateWorkOrderTrackingVM } from 'src/app/Shared/Models/WorkOrderTrackingVM';
import { AssetStatusTransactionService } from 'src/app/Shared/Services/assetStatusTransaction.service';
import { EmployeeService } from 'src/app/Shared/Services/employee.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { RequestDocumentService } from 'src/app/Shared/Services/request-document.service';
import { RequestTrackingService } from 'src/app/Shared/Services/request-tracking.service';
import { RequestService } from 'src/app/Shared/Services/request.service';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { WorkOrderTrackingService } from 'src/app/Shared/Services/work-order-tracking.service';
import { WorkOrderService } from 'src/app/Shared/Services/work-order.service';

@Component({
  selector: 'app-approverequest',
  templateUrl: './approverequest.component.html',
  styleUrls: ['./approverequest.component.css']
})
export class ApproverequestComponent implements OnInit {


  lang = localStorage.getItem('lang');
  textDir: string = 'ltr';
  errorMessage: string;
  errorDisplay: boolean = false;
  currentUser: LoggedUser;

  requestDetailObj: RequestDetails;
  reqTrackObj: CreateRequestTracking;
  assetStatusObj: CreateAssetStatusTransactionVM;
  creatWorkOrderTrackingObj: CreateWorkOrderTrackingVM;


  formData = new FormData();
  createRequestDocument: CreateRequestDocument;
  lstCreateRequestDocument: CreateRequestDocument[] = [];
  lstDocuments: ListRequestDocumentVM[] = [];

  lstEngEmployees: ListEmployeeVM[] = [];

  selectedItem: string;
  serviceRequestId: number;
  isLinear = false;

  isAdmin: boolean = false;
  hospitalId: number;
  workOrderId: number;
  lstRadioItems: string[];

  minDate: Date;
  plannedStartdate: any;
  actualStartDate: any;
  display: boolean = false;
  isHide: boolean = false;
  isAssigned: boolean = false;
  isReviewed: boolean = false;
  assignedEngTo: string = '';
  disabledButton: boolean = true;
  isDisabled: boolean = false;
  public trackId: number;
  itmIndex: any[] = [];
  constructor(
    private authenticationService: AuthenticationService, private employeeService: EmployeeService,
    private requestService: RequestService, private requestTrackingService: RequestTrackingService,
    private workOrderService: WorkOrderService, private workOrderTrackingService: WorkOrderTrackingService,
    private assetStatusTransactionService: AssetStatusTransactionService, private requestDocumentService: RequestDocumentService,
    private uploadService: UploadFilesService, private ref: DynamicDialogRef,
    private config: DynamicDialogConfig, private messageService: MessageService, private router: Router, private httpClient: HttpClient, private datePipe: DatePipe) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    this.onLoad();
    if (this.config.data != null || this.config.data != undefined) {
      this.serviceRequestId = this.config.data.id;

      this.requestTrackingService.GetSRTracksByRequestId(this.serviceRequestId).subscribe(
        requestObj => {
          this.requestDetailObj = requestObj;
        });
    }
    if (this.lang == "en")
      this.lstRadioItems = ["SR Done", "SR not done"];

    if (this.lang == "ar")
      this.lstRadioItems = ["تمت الصيانة", "لم تتم الصيانة"];
    if (this.lang == "en")
      this.selectedItem = "SR Done";
    else
      this.selectedItem = "تمت الصيانة";
    this.isReviewed = true;

    if (this.currentUser.hospitalId > 0) {
      this.employeeService
        .GetEmployeesHasEngRoleInHospital(this.currentUser.hospitalId)
        .subscribe((lstemployees) => {
          this.lstEngEmployees = lstemployees;
          this.creatWorkOrderTrackingObj.assignedTo = this.lstEngEmployees[0].userId;
        });
    }
    else {
      this.isAdmin = true;
    }



  }
  onItemChange($event) {
    if ($event.value == "SR not done" || $event.value == "لم تتم الصيانة") {
      this.isAssigned = true;
      this.isReviewed = false;
    }
    if ($event.value == "SR Done" || $event.value == "تمت الصيانة") {
      this.isAssigned = false;
      this.isReviewed = true;
    }
    this.selectedItem = $event.value;
  }
  onLoad() {
    this.minDate = new Date();
    this.disabledButton = false;
    // this.IsSaveProject = false;
    this.lstCreateRequestDocument = [];

    this.requestDetailObj = {
      wONotes: '', departmentName: '', departmentNameAr: '',
      hospitalId: 0, barcode: '', assetCode: '', assetName: '', assetNameAr: '', descriptionDate: new Date, id: 0, lstTracking: [], modeName: '', modeNameAr: '', periorityName: '', periorityNameAr: '', problemName: '', problemNameAr: '',
      requestId: 0, requestTypeName: '', requestTypeNameAr: '', statusName: '', statusNameAr: '', subProblemName: '', subProblemNameAr: '', userName: '',
      assetDetailId: 0, createdById: '', description: '', problemId: 0, requestCode: '', requestDate: new Date, requestModeId: 0, requestPeriorityId: 0, requestStatusId: 0, requestTypeId: 0, serialNumber: "", subProblemId: 0, subject: ''
    };

    this.assetStatusObj = { assetDetailId: 0, assetStatusId: 0, statusDate: '', hospitalId: 0 }
    this.reqTrackObj = { strDescriptionDate: '', id: 0, createdById: '', description: '', descriptionDate: new Date, requestId: 0, requestStatusId: 0, hospitalId: 0 };

    this.creatWorkOrderTrackingObj = {
      id: 0, notes: '', createdById: '', creationDate: '', workOrderDate: new Date(), workOrderId: 0, workOrderStatusId: 0, assignedTo: '', actualEndDate: '', actualStartDate: '', plannedEndDate: '', plannedStartDate: '',
      hospitalId: 0, strWorkOrderDate: ''
    };


    this.creatWorkOrderTrackingObj = {
      id: 0, notes: '', createdById: '', creationDate: '', workOrderDate: new Date(), workOrderId: 0, workOrderStatusId: 0, hospitalId: 0,
      assignedTo: '', actualEndDate: '', actualStartDate: '', plannedStartDate: '', plannedEndDate: '', strWorkOrderDate: ''
    };
    this.createRequestDocument = { documentName: '', fileName: '', requestTrackingId: 0, id: 0, requestFile: File, hospitalId: 0 };

  }
  addApprovedRequest() {
    if (this.selectedItem == "SR Done" || this.selectedItem == "تمت الصيانة") {

      this.workOrderService.GetWorkOrderByRequestId(this.serviceRequestId).subscribe(getWOId => {
        this.creatWorkOrderTrackingObj.strWorkOrderDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
        this.creatWorkOrderTrackingObj.plannedStartDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
        this.creatWorkOrderTrackingObj.plannedEndDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
        this.creatWorkOrderTrackingObj.actualStartDate = this.datePipe.transform(new Date, "yyyy-MM-dd HH:mm:ss");
        this.creatWorkOrderTrackingObj.actualEndDate = this.datePipe.transform(new Date, "yyyy-MM-dd HH:mm:ss");
        this.creatWorkOrderTrackingObj.creationDate = this.datePipe.transform(new Date, "yyyy-MM-dd HH:mm:ss");
        this.creatWorkOrderTrackingObj.createdById = this.currentUser.id;
        this.creatWorkOrderTrackingObj.workOrderId = Number(getWOId["id"]);
        this.creatWorkOrderTrackingObj.workOrderStatusId = 12;
        if (this.lang == "en") {
          this.creatWorkOrderTrackingObj.notes = "User Approve";
        }
        else {
          this.creatWorkOrderTrackingObj.notes = "تم العمل";
        }
        this.creatWorkOrderTrackingObj.hospitalId = this.currentUser.hospitalId;
        this.workOrderTrackingService.AddWorkOrderTracking(this.creatWorkOrderTrackingObj)
          .subscribe((res) => {

            this.reqTrackObj.requestStatusId = 2;
            this.reqTrackObj.requestId = this.serviceRequestId;
            this.reqTrackObj.createdById = this.currentUser.id;
            this.reqTrackObj.hospitalId = this.currentUser.hospitalId;
            this.reqTrackObj.description = "تم العمل وقبل";
            this.reqTrackObj.hospitalId = this.currentUser.hospitalId;
            this.reqTrackObj.strDescriptionDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
            this.requestTrackingService.AddRequestTracking(this.reqTrackObj).subscribe(savedTrack => {

              this.requestService.GetRequestById(this.serviceRequestId).subscribe(reqObj => {
                this.assetStatusObj.assetDetailId = reqObj["assetDetailId"];
                this.assetStatusObj.statusDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
                this.assetStatusObj.hospitalId = this.currentUser.hospitalId;
                this.assetStatusObj.assetStatusId = 3;
                this.assetStatusTransactionService.AddAssetStatusTransaction(this.assetStatusObj).subscribe(() => {
                  this.display = true;
                  this.isDisabled = true;
                  // this.reload();
                });
              });
            });
          });
      });

    }
  }
  addNoneApprovedRequest() {

    if (this.creatWorkOrderTrackingObj.assignedTo == "") {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select person to assigned engineer";
      } else {
        this.errorMessage = "من فضلك اختر المهندس المختص بالصيانة";
      }
      return false;
    }
    else {
      this.workOrderService.GetWorkOrderByRequestId(this.serviceRequestId).subscribe(woObj => {
        this.creatWorkOrderTrackingObj.strWorkOrderDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
        this.creatWorkOrderTrackingObj.actualStartDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
        this.creatWorkOrderTrackingObj.actualEndDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
        this.creatWorkOrderTrackingObj.plannedStartDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
        this.creatWorkOrderTrackingObj.plannedEndDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
        this.creatWorkOrderTrackingObj.creationDate = this.datePipe.transform(new Date, "yyyy-MM-dd HH:mm:ss");
        this.creatWorkOrderTrackingObj.createdById = this.currentUser.id;
        this.creatWorkOrderTrackingObj.workOrderId = Number(woObj.id);
        this.creatWorkOrderTrackingObj.workOrderStatusId = 9;
        this.creatWorkOrderTrackingObj.notes = this.creatWorkOrderTrackingObj.notes;
        this.creatWorkOrderTrackingObj.hospitalId = this.currentUser.hospitalId;

        this.workOrderTrackingService.AddWorkOrderTracking(this.creatWorkOrderTrackingObj)
          .subscribe((res) => {
            this.workOrderId = res;
            this.reqTrackObj.requestStatusId = 3;
            this.reqTrackObj.requestId = this.serviceRequestId;
            this.reqTrackObj.createdById = this.currentUser.id;
            this.reqTrackObj.description = this.creatWorkOrderTrackingObj.notes;
            this.reqTrackObj.hospitalId = this.currentUser.hospitalId;
            this.reqTrackObj.strDescriptionDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
            this.requestTrackingService.AddRequestTracking(this.reqTrackObj).subscribe(savedTrack => {
              this.reqTrackObj = savedTrack;
              const requestTrackId = savedTrack["id"];
              this.trackId = requestTrackId;
              this.requestService.GetRequestById(this.serviceRequestId).subscribe(reqObj => {
                this.assetStatusObj.assetDetailId = reqObj["assetDetailId"];
                this.assetStatusObj.statusDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
                this.assetStatusObj.hospitalId = this.currentUser.hospitalId;
                this.assetStatusObj.assetStatusId = 4;
                this.assetStatusTransactionService.AddAssetStatusTransaction(this.assetStatusObj).subscribe(() => {
                  this.display = true;
                  this.isDisabled = true;
                });
              });
            });


          });
      });
    }
  }
  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    this.formData.append('file', fileToUpload, fileToUpload.name);
    this.createRequestDocument.requestTrackingId = Number(this.reqTrackObj);
    this.createRequestDocument.fileName = fileToUpload.name;
    this.Savedoctolist();
  }
  removeFileFromObjectArray(doc) {
    const index: number = this.lstCreateRequestDocument.indexOf(doc);
    if (index !== -1) {
      this.lstCreateRequestDocument.splice(index, 1);
    }
  }
  Savedoctolist() {
    if (this.createRequestDocument.documentName != "" && this.createRequestDocument.fileName != "") {
      this.createRequestDocument.requestTrackingId = Number(this.reqTrackObj);

      let ext = this.createRequestDocument.fileName.split('.').pop();
      let lastdocumentName = "";
      let imageIndex = "";

      if (this.itmIndex.length == 0) {
        this.requestDocumentService.GetLastDocumentForRequestTrackingId(Number(this.reqTrackObj)).subscribe(lastDoc => {
          lastdocumentName = lastDoc.fileName;
          if (lastdocumentName == null) {

            var last_element = 1;
            this.itmIndex.push(last_element);
            let ext = this.createRequestDocument.fileName.split('.').pop();
            var hCode = this.pad(this.currentUser.hospitalCode, 4);
            var srCode = this.pad(this.requestDetailObj.requestCode, 10);
            let newIndex = this.pad((last_element).toString(), 2);
            let SRFileName = hCode + "SR" + srCode + newIndex;
            this.createRequestDocument.fileName = SRFileName + "." + ext;
          }
          else if (lastdocumentName != "") {
            imageIndex = lastdocumentName.split('.').slice(0, -1).join('.');
            imageIndex = imageIndex.substring(imageIndex.length - 2);
            this.itmIndex.push(imageIndex);

            var newImageIndex = parseInt(imageIndex) + 1;
            this.itmIndex.push(newImageIndex);

            var hCode = this.pad(this.currentUser.hospitalCode, 4);
            var srCode = this.pad(this.requestDetailObj.requestCode, 10);
            var last = this.itmIndex[this.itmIndex.length - 1];
            let newIndex = this.pad((last).toString(), 2);
            let srRFileName = hCode + "SR" + srCode + newIndex + "." + ext;
            this.createRequestDocument.fileName = srRFileName;

          }
          else if (lastdocumentName == "") {
            var last_element = 1;
            this.itmIndex.push(last_element);
            let ext = this.createRequestDocument.fileName.split('.').pop();
            var hCode = this.pad(this.currentUser.hospitalCode, 4);
            var srCode = this.pad(this.requestDetailObj.requestCode, 10);
            let newIndex = this.pad((last_element).toString(), 2);
            let SRFileName = hCode + "SR" + srCode + newIndex;
            this.createRequestDocument.fileName = SRFileName + "." + ext;
          }

          this.lstCreateRequestDocument.push(this.createRequestDocument);
          this.createRequestDocument = { id: 0, fileName: '', requestTrackingId: 0, documentName: '', requestFile: File, hospitalId: 0 };

        });
      }
      else if (this.itmIndex.length > 0) {
        var last_element = this.itmIndex[this.itmIndex.length - 1];
        last_element = parseInt(last_element) + 1;
        this.itmIndex.push(last_element);

        var hCode = this.pad(this.currentUser.hospitalCode, 4);
        var srCode = this.pad(this.requestDetailObj.requestCode, 10);
        let newIndex = this.pad((last_element).toString(), 2);
        let SRFileName = hCode + "SR" + srCode + newIndex;
        this.createRequestDocument.fileName = SRFileName + "." + ext;
        this.lstCreateRequestDocument.push(this.createRequestDocument);
        this.createRequestDocument = { id: 0, fileName: '', requestTrackingId: 0, documentName: '', requestFile: File, hospitalId: 0 };
      }
    }
    else {
      if (this.lang == "en") {
        this.messageService.add({ key: 'sr', severity: 'error', summary: 'Attention !!!', sticky: true, detail: 'Please Complete Data' });
      }
      else {
        this.messageService.add({ key: 'sr', severity: 'خطأ', summary: 'انتبه!!!', sticky: true, detail: 'من فضلك اختر اسم الملف والملف' });
      }
    }
  }
  SaveimageToDB() {
    this.lstCreateRequestDocument.forEach((item, index) => {
      this.requestService.CreateRequestAttachments(item).subscribe(fileObj => {
        this.uploadService.uploadRequestFiles(item.requestFile, item.fileName).subscribe(
          (event) => {
            if (this.lang == "en") {
              this.messageService.add({ key: 'files', severity: 'success', summary: 'Success', detail: 'Files added successfully' });
            }
            else {
              this.messageService.add({ key: 'files', severity: 'نجاح الحفظ', summary: 'نجاح الحفظ', detail: 'تم رفع الملفات بنجاح' });
            }
            this.requestDocumentService.GetRequestDocumentsByRequestTrackingId(item.requestTrackingId).subscribe(lstdocs => {
              this.lstDocuments = lstdocs;
            });

          },
          (err) => {

            if (this.lang == "en") {
              this.errorDisplay = true;
              this.errorMessage = 'Could not upload the file:' + item[index].fileName;
            }
            else {
              this.errorDisplay = true;
              this.errorMessage = 'لا يمكن رفع ملف ' + item[index].fileName;
            }
          });
      });
    });
    this.lstCreateRequestDocument = [];
  }
  pad(num: string, size: number): string {
    while (num.length < size) num = "0" + num;
    return num;
  }
  CloseStepper() {
    this.ref.close();
  }
}
