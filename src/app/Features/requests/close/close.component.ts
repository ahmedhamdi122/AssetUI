import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateAssetStatusTransactionVM } from 'src/app/Shared/Models/assetStatusTransactionVM';
import { CreateRequestTracking } from 'src/app/Shared/Models/RequestTrackingVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { CreateWorkOrderTrackingVM } from 'src/app/Shared/Models/WorkOrderTrackingVM';
import { AssetStatusTransactionService } from 'src/app/Shared/Services/assetStatusTransaction.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { RequestTrackingService } from 'src/app/Shared/Services/request-tracking.service';
import { RequestService } from 'src/app/Shared/Services/request.service';
import { WorkOrderTrackingService } from 'src/app/Shared/Services/work-order-tracking.service';
import { WorkOrderService } from 'src/app/Shared/Services/work-order.service';

@Component({
  selector: 'app-close',
  templateUrl: './close.component.html',
  styleUrls: ['./close.component.css']
})
export class CloseComponent implements OnInit {

  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  errorDisplay: boolean = false;
  display: boolean = false;
  isDisabled: boolean = false;
  errorMessage: string = "";
  reqTrackObj: CreateRequestTracking;
  workorderObj: CreateWorkOrderTrackingVM;
  currentUser: LoggedUser;
  reqId: number;
  assetStatusObj: CreateAssetStatusTransactionVM;

  constructor(private authenticationService: AuthenticationService, private requestTrackingService: RequestTrackingService,
    private ref: DynamicDialogRef, private workOrderTrackingService: WorkOrderTrackingService,
    private assetStatusTransactionService: AssetStatusTransactionService, private requestService: RequestService,
    private workOrderService: WorkOrderService, private datePipe: DatePipe,
    private config: DynamicDialogConfig) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.assetStatusObj = { assetDetailId: 0, assetStatusId: 0, statusDate: '', hospitalId: 0 }
    this.reqTrackObj = { strDescriptionDate: '', id: 0, createdById: '', description: '', descriptionDate: new Date, requestId: 0, requestStatusId: 0, hospitalId: 0 }
    this.workorderObj = {
      id: 0, notes: '', createdById: '', creationDate: '', workOrderDate: new Date(), workOrderId: 0, workOrderStatusId: 0, assignedTo: '', actualEndDate: '', actualStartDate: '', plannedEndDate: '', plannedStartDate: '',
      hospitalId: 0, strWorkOrderDate: ''
    };
    if (this.config.data != null) {
      let requestId = this.config.data.id;
      this.reqId = requestId;
    }
  }

  closeRequest() {
    if (this.reqTrackObj.description == "") {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please write description";
      }
      else {
        this.errorMessage = "أدخل سبب الإغلاق";
      }
    }
    else {
      this.reqTrackObj.requestStatusId = 2;
      this.reqTrackObj.requestId = this.reqId;
      this.reqTrackObj.createdById = this.currentUser.id;
      this.reqTrackObj.hospitalId = this.currentUser.hospitalId;
      this.requestTrackingService.AddRequestTracking(this.reqTrackObj).subscribe(savedTrack => {


        this.workOrderService.GetWorkOrderByRequestId(this.reqId).subscribe(reqObj => {
          this.workorderObj.actualStartDate = this.datePipe.transform(new Date, "yyyy-MM-dd HH:mm:ss");
          this.workorderObj.actualEndDate = this.datePipe.transform(new Date, "yyyy-MM-dd HH:mm:ss");
          this.workorderObj.createdById = this.currentUser.id;
          this.workorderObj.notes = "Closed from request";
          this.workorderObj.workOrderId = Number(reqObj.id);
          this.workorderObj.workOrderStatusId = 12;
          this.workorderObj.hospitalId = this.currentUser.hospitalId;
          this.workOrderTrackingService.AddWorkOrderTracking(this.workorderObj).subscribe((res) => {



            this.requestService.GetRequestById(this.reqId).subscribe(requestObj => {
              this.assetStatusObj.assetDetailId = requestObj["assetDetailId"];
              this.assetStatusObj.statusDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
              this.assetStatusObj.hospitalId = this.currentUser.hospitalId;
              this.assetStatusObj.assetStatusId = 3;
              this.assetStatusTransactionService.AddAssetStatusTransaction(this.assetStatusObj).subscribe(() => {
                //  this.ref.close();
                this.display = true;
                this.isDisabled = true;
              });
            });

          });
        });
      });
    }
  }
}
