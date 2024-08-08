import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateAssetStatusTransactionVM } from 'src/app/Shared/Models/assetStatusTransactionVM';
import { CreateRequestTracking, } from 'src/app/Shared/Models/RequestTrackingVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { CreateWorkOrderTrackingVM } from 'src/app/Shared/Models/WorkOrderTrackingVM';
import { AssetStatusTransactionService } from 'src/app/Shared/Services/assetStatusTransaction.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { RequestTrackingService } from 'src/app/Shared/Services/request-tracking.service';
import { RequestService } from 'src/app/Shared/Services/request.service';
import { WorkOrderStatusService } from 'src/app/Shared/Services/work-order-status.service';
import { WorkOrderTrackingService } from 'src/app/Shared/Services/work-order-tracking.service';
import { WorkOrderService } from 'src/app/Shared/Services/work-order.service';
import { CreateWorkOrderAttachmentVM } from 'src/app/Shared/Models/WorkOrderAttachmentVM';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { EditWorkOrderVM } from '../../../Shared/Models/WorkOrderVM';
import { RequestVM } from 'src/app/Shared/Models/requestVM';
@Component({
  selector: 'app-addwotrackstatus',
  templateUrl: './addwotrackstatus.component.html',
  styleUrls: ['./addwotrackstatus.component.css']
})
export class AddwotrackstatusComponent implements OnInit {


  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  statusId: number;
  workOrderId: number;
  statusName: string;
  createdById: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  errorMessage: string = "";
  woTrackObj: CreateWorkOrderTrackingVM;
  lstRadioItems: string[];
  isVisible: boolean = false;
  requestTrackObj: CreateRequestTracking;
  requestId: number;
  isEng: boolean = false;
  lstRoleNames: string[] = [];

  isDisabled: boolean = false;
  isValidPlannedDate: boolean = false;
  isValidDate: boolean = false;
  error: any = { isError: false, errorMessage: '' };
  assetStatusObj: CreateAssetStatusTransactionVM;

  workOrderObj: EditWorkOrderVM;
  itmIndex: any[] = [];
  createWorkOrderAttachmentObj: CreateWorkOrderAttachmentVM;
  lstCreateWorkOrderTracking: CreateWorkOrderAttachmentVM[] = [];

  requestObj: RequestVM;

  WOTrackingId: any;
  constructor(private authenticationService: AuthenticationService, private config: DynamicDialogConfig, private ref: DynamicDialogRef,
    private workOrederService: WorkOrderService, private workOrederStatusService: WorkOrderStatusService, private requestService: RequestService,
    private requestTrackingService: RequestTrackingService, private assetStatusTransactionService: AssetStatusTransactionService,
    private uploadService: UploadFilesService,
    private workOrderTrackingService: WorkOrderTrackingService, private datePipe: DatePipe, private route: Router) {

    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {

    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });
      this.isEng = (['Admin', 'Eng'].some(r => this.lstRoleNames.includes(r)));
    }

    this.statusId = this.config.data.statusId;
    this.workOrderId = this.config.data.workOrderId;
    this.onLoad();
    this.workOrederStatusService.GetWorkOrderStatusById(this.statusId).subscribe(stsName => {
      this.statusName = this.lang == "en" ? stsName.name : stsName.nameAr
    });
    this.workOrderTrackingService.GetEngManagerWhoFirstAssignedWO(this.workOrderId).subscribe(getEngManager => {
      this.createdById = getEngManager["createdById"];
    });

    this.requestObj = { assetCode: '', assetDetailId: 0, assetName: '', assetNameAr: '', barcode: '', createdBy: '', createdById: '', description: '', hospitalId: 0, id: 0, masterAssetId: 0, modeName: '', periorityName: '', problemId: 0, requestCode: '', requestDate: new Date(), requestModeId: 0, requestPeriorityId: 0, requestStatusId: 0, requestTime: '', requestTrackingId: 0, requestTypeId: 0, requestTypeName: '', requestTypeNameAr: '', serialNumber: '', subject: '', subProblemId: 0, subProblemName: '', subProblemNameAr: '' }
  }

  onLoad() {

    this.requestTrackObj = { strDescriptionDate: '', description: '', descriptionDate: new Date, requestId: 0, requestStatusId: 0, createdById: '', id: 0, hospitalId: 0 }

    this.createWorkOrderAttachmentObj = { documentName: '', fileName: '', workOrderTrackingId: 0, workOrderFile: File, hospitalId: 0 };
    this.assetStatusObj = { assetDetailId: 0, assetStatusId: 0, hospitalId: 0, statusDate: '' }

    this.woTrackObj = {
      workOrderId: 0, createdById: '', notes: '', workOrderDate: new Date, workOrderStatusId: 0, id: 0, actualEndDate: '', actualStartDate: '', creationDate: '', assignedTo: '', plannedEndDate: '', plannedStartDate: '', hospitalId: 0, strWorkOrderDate: ''
    }
    this.lstRadioItems = ["External Support", "Out Of Scoop", "esclate"];
    if (this.statusId == 7) {
      this.isVisible = true;
    }
    else {
      this.isVisible = false;
    }
  }

  onItemChange($event) {
    this.woTrackObj.notes = $event.value;
  }
  saveStatus() {
    this.woTrackObj.workOrderId = this.workOrderId;
    this.woTrackObj.workOrderStatusId = this.statusId;
    this.woTrackObj.hospitalId = this.currentUser.hospitalId;

    if (this.woTrackObj.notes == "") {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please add notes";
      }
      else {
        this.errorMessage = "اكتب تعليق";
      }
      return false;
    }
    else {
      if (this.isEng) {
        this.woTrackObj.assignedTo = this.createdById;
        this.woTrackObj.createdById = this.currentUser.id;
      }
      else {
        this.woTrackObj.createdById = this.currentUser.id;
        this.woTrackObj.assignedTo = this.woTrackObj.assignedTo;
      }

      this.woTrackObj.strWorkOrderDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.woTrackObj.creationDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.woTrackObj.plannedStartDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.woTrackObj.plannedEndDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.woTrackObj.actualStartDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.woTrackObj.actualEndDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.woTrackObj.hospitalId = this.currentUser.hospitalId;
      if (this.statusId == 7) {
        this.woTrackObj.workOrderStatusId = 11;
        this.workOrderTrackingService.AddWorkOrderTracking(this.woTrackObj).subscribe(savedTrack => {
          this.WOTrackingId = savedTrack;
          // this.display = true;

          if (this.lstCreateWorkOrderTracking.length > 0) {
            this.lstCreateWorkOrderTracking.forEach((item, index) => {

              item.hospitalId = this.currentUser.hospitalId;
              item.workOrderTrackingId = Number(savedTrack);
              this.workOrederService.CreateWorkOrderAttachments(item).subscribe(fileObj => {
                this.uploadService.uploadWorkOrderFiles(item.workOrderFile, item.fileName).subscribe(
                  (event) => {
                    this.display = true;
                    this.isDisabled = true;
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
            this.lstCreateWorkOrderTracking = [];

            this.display = true;
            this.isDisabled = true;
          }
          else {
            this.display = true;
            this.isDisabled = true;
          }
        }, error => {
          this.errorDisplay = true;
          if (this.lang == 'en') {
            if (error.error.status == 'sr') {
              this.errorMessage = error.error.message;
            }
          }
          if (this.lang == 'ar') {
            if (error.error.status == 'sr') {
              this.errorMessage = error.error.messageAr;
            }
          }
          return false;
        });

        //done
        if (this.lang == "en") {
          this.requestTrackObj.description = "Work Order Approved and then request will be reviewed";
        }
        else {
          this.requestTrackObj.description = "امر الشغل تم تنفيذه وبإنتظار مراجعة مقدم البلاغ";
        }
        //Solved
        this.requestTrackObj.strDescriptionDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
        this.workOrederService.GetWorkOrderById(this.workOrderId).subscribe(getRequestId => {
          this.requestId = getRequestId["requestId"];

          this.requestService.GetRequestById(getRequestId["requestId"]).subscribe(reqObj => {

          this.requestTrackObj.requestStatusId = 4;
          this.requestTrackObj.createdById = reqObj.createdById;
          this.requestTrackObj.requestId = this.requestId;
          this.requestTrackObj.hospitalId = this.currentUser.hospitalId;
          this.requestTrackObj.strDescriptionDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");

          this.requestTrackingService.AddRequestTracking(this.requestTrackObj).subscribe(savedWOTrack => {
         
              this.assetStatusObj.assetDetailId = reqObj["assetDetailId"];
              this.assetStatusObj.statusDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
              this.assetStatusObj.hospitalId = this.currentUser.hospitalId;
              this.assetStatusObj.assetStatusId = 4;
              this.assetStatusTransactionService.AddAssetStatusTransaction(this.assetStatusObj).subscribe(() => {
                if (this.lstCreateWorkOrderTracking.length > 0) {
                  this.lstCreateWorkOrderTracking.forEach((item, index) => {

                    item.hospitalId = this.currentUser.hospitalId;
                    item.workOrderTrackingId = Number(savedWOTrack);
                    this.workOrederService.CreateWorkOrderAttachments(item).subscribe(fileObj => {
                      this.uploadService.uploadWorkOrderFiles(item.workOrderFile, item.fileName).subscribe(
                        (event) => {
                          this.display = true;
                          this.isDisabled = true;
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
                  this.lstCreateWorkOrderTracking = [];
                  this.display = true;
                  this.isDisabled = true;
                }
                else {
                  this.display = true;
                  this.isDisabled = true;
                }
              });
            });
          });
        });
      }
      else {
        this.woTrackObj.creationDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
        this.woTrackObj.plannedStartDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
        this.woTrackObj.plannedEndDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
        this.woTrackObj.actualStartDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
        this.woTrackObj.actualEndDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");


        this.workOrderTrackingService.AddWorkOrderTracking(this.woTrackObj).subscribe(saved => {
          // this.display = true;
          this.workOrderTrackingService.GetWorkOrderTrackingById(this.woTrackObj.id).subscribe(trackObj => {
            this.workOrederService.GetWorkOrderById(this.workOrderId).subscribe(woObj => {
              this.requestService.GetRequestById(woObj.requestId).subscribe(reqObj => {
                this.requestObj = reqObj;
                this.requestObj.assetDetailId = reqObj["assetDetailId"];

                this.assetStatusObj.assetDetailId = Number(this.requestObj.assetDetailId);
                this.assetStatusObj.statusDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
                this.assetStatusObj.hospitalId = this.currentUser.hospitalId;
                this.assetStatusObj.assetStatusId = 4;
                this.assetStatusTransactionService.AddAssetStatusTransaction(this.assetStatusObj).subscribe(() => {
                  this.display = true;
                  if (this.lstCreateWorkOrderTracking.length > 0) {
                    this.lstCreateWorkOrderTracking.forEach((item, index) => {

                      item.hospitalId = this.currentUser.hospitalId;
                      item.workOrderTrackingId = Number(saved);
                      this.workOrederService.CreateWorkOrderAttachments(item).subscribe(fileObj => {
                        this.uploadService.uploadWorkOrderFiles(item.workOrderFile, item.fileName).subscribe(
                          (event) => {
                            this.display = true;
                            this.isDisabled = true;
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
                    this.lstCreateWorkOrderTracking = [];
                  }
                  else {
                    this.display = true;
                    this.isDisabled = true;
                  }
                });
              });
            });
          });
        }, error => {
          this.errorDisplay = true;
          if (this.lang == 'en') {
            if (error.error.status == 'sr') {
              this.errorMessage = error.error.message;
            }
          }
          if (this.lang == 'ar') {
            if (error.error.status == 'sr') {
              this.errorMessage = error.error.messageAr;
            }
          }
          return false;
        });

      }
      this.isDisabled = true;
      // this.ref.close();
    }
  }
  closeDialogue() {
    this.ref.close();
    this.route.navigate(['/dash/workorders']);
  }



  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    this.createWorkOrderAttachmentObj.fileName = fileToUpload.name;
    this.createWorkOrderAttachmentObj.workOrderFile = fileToUpload;
    this.createWorkOrderAttachmentObj.hospitalId = this.currentUser.hospitalId;
    this.addFilesToList();
  };
  addFilesToList() {
    if (this.createWorkOrderAttachmentObj.documentName != "" && this.createWorkOrderAttachmentObj.fileName != "") {
      this.createWorkOrderAttachmentObj.workOrderTrackingId = Number(this.WOTrackingId);

      if (this.itmIndex.length === 0) {
        last_element = 1;
      }
      else if (this.itmIndex.length > 0) {
        var last_element = this.itmIndex[this.itmIndex.length - 1];
        last_element = last_element + 1;
      }
      this.itmIndex.push(last_element);

      this.workOrederService.GetWorkOrderById(this.workOrderId).subscribe(woObj => {
        this.workOrderObj = woObj;
        let ext = this.createWorkOrderAttachmentObj.fileName.split('.').pop();
        var hCode = this.pad(this.currentUser.hospitalCode, 4);
        var srCode = this.pad(this.workOrderObj.workOrderNumber, 10);
        var last = this.itmIndex[this.itmIndex.length - 1];
        let newIndex = this.pad((last).toString(), 2);
        let WOFileName = hCode + "WO" + srCode + newIndex;
        this.createWorkOrderAttachmentObj.fileName = WOFileName + "." + ext;
        this.lstCreateWorkOrderTracking.push(this.createWorkOrderAttachmentObj);
        this.createWorkOrderAttachmentObj = { fileName: '', workOrderTrackingId: 0, documentName: '', workOrderFile: File, hospitalId: 0 };

      });



    }
    else {
      if (this.lang == "en") {
      }
      else {
      }
    }
  }
  removeFileFromObjectArray(doc) {
    const index: number = this.lstCreateWorkOrderTracking.indexOf(doc);
    if (index !== -1) {
      this.lstCreateWorkOrderTracking.splice(index, 1);
    }
  }

  pad(num: string, size: number): string {
    while (num.length < size) num = "0" + num;
    return num;
  }
}
