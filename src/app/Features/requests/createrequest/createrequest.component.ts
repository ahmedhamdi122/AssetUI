import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { AssetStatusTransactionVM } from 'src/app/Shared/Models/assetStatusTransactionVM';
import { ListEmployeeVM } from 'src/app/Shared/Models/employeeVM';
import { MasterAssetVM } from 'src/app/Shared/Models/masterAssetVM';
import { Paging } from 'src/app/Shared/Models/paging';
import { IndexProblemVM } from 'src/app/Shared/Models/ProblemVM';
import { IndexRequestTypeVM } from 'src/app/Shared/Models/ProjectTypeVM';
import { CreateRequestDocument } from 'src/app/Shared/Models/RequestDocumentVM';
import { ListRequestVM, RequestModeVM } from 'src/app/Shared/Models/requestModeVM';
import { RequestPeriority } from 'src/app/Shared/Models/RequestPeriorityVM';
import { IndexRequestStatus } from 'src/app/Shared/Models/RequestStatusVM';
import { CreateRequestTracking } from 'src/app/Shared/Models/RequestTrackingVM';
import { CreateRequest, SortRequestVM } from 'src/app/Shared/Models/requestVM';
import { IndexSubProblemVM } from 'src/app/Shared/Models/SubProblemVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { AssetStatusTransactionService } from 'src/app/Shared/Services/assetStatusTransaction.service';
import { EmployeeService } from 'src/app/Shared/Services/employee.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { ProblemService } from 'src/app/Shared/Services/problem.service';
import { RequestModeService } from 'src/app/Shared/Services/request-mode.service';
import { RequestPeriorityService } from 'src/app/Shared/Services/request-periority.service';
import { RequestStatusService } from 'src/app/Shared/Services/request-status.service';
import { RequestTrackingService } from 'src/app/Shared/Services/request-tracking.service';
import { RequestTypeService } from 'src/app/Shared/Services/request-type.service';
import { RequestService } from 'src/app/Shared/Services/request.service';
import { SubProblemService } from 'src/app/Shared/Services/sub-problem.service';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { WorkOrderService } from 'src/app/Shared/Services/work-order.service';

@Component({
  selector: 'app-createrequest',
  templateUrl: './createrequest.component.html',
  styleUrls: ['./createrequest.component.css']
})
export class CreaterequestComponent implements OnInit {
  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';

  reqObj: CreateRequest;
  currentUser: LoggedUser;
  reqId: CreateRequest;
  requestId: number;
  requestTrackingId: CreateRequestTracking;
  createRequestDocument: CreateRequestDocument;
  assetBarCodeObj: AssetDetailVM;
  assetSerialObj: AssetDetailVM;
  errorRequest: boolean = false;

  isDisabled: boolean = false;
  errorDisplay: boolean = false;
  errorMessage: string = "";
  lstEmployees: ListEmployeeVM[] = [];
  lstMasterAsset: MasterAssetVM[] = [];
  lstassetDetails: AssetDetailVM[] = [];
  lstPeriorities: RequestPeriority[] = [];
  lstRequestMode: RequestModeVM[] = [];
  lstCreateRequestDocument: CreateRequestDocument[] = [];
  createRequestTrackingObj: CreateRequestTracking;
  lstRequestStatus: IndexRequestStatus[] = [];
  lstProblems: IndexProblemVM[] = [];
  lstSubProblems: IndexSubProblemVM[] = [];
  lstRequestTypes: IndexRequestTypeVM[] = [];
  lstassetDetailBarcodes: AssetDetailVM[] = [];
  lstSerials: AssetDetailVM[] = [];

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  disabledButton: boolean = false;
  isLinear = false;
  assetStatusId: number = 0;

  isValidDate: any;
  error: any = { isError: false, errorMessage: '' };
  dateError: boolean = false;
  assetId: number;


  isProblem: boolean = false;
  isSubProblem: boolean = false;
  isProblemType: boolean = false;
  isPeriority: boolean = false;
  isMode: boolean = false;
  isMasterAsset: boolean = false;
  isSerial: boolean = false;
  isDesc: boolean = false;
  isStepper1: boolean = false;
  isStepper2: boolean = false;
  isStepper3: boolean = false;

  isEngManager: boolean = false;
  isAssetOwner: boolean = false;
  isEng: boolean = false;
  lstRoleNames: string[] = [];
  radioPerioritySelected: number;
  display: boolean = false;

  applicationStatus: string = "";
  page: Paging;
  count: number;
  startDateTime: Date;
  startStamp: number;
  newDate: Date = new Date();
  newStamp = this.newDate.getTime();
  timer;
  sortStatus: string = "ascending";
  sortObj: SortRequestVM;
  lstRequests: ListRequestVM[] = [];
  loading: boolean = true;

  formData = new FormData();
  itmIndex: any[] = [];
  constructor(private requestService: RequestService, private authenticationService: AuthenticationService, private formBuilder: FormBuilder,
    private workOrderService: WorkOrderService, private assetStatusTransactionService: AssetStatusTransactionService,
    private requestStatusService: RequestStatusService, private employeeService: EmployeeService,
    private assetDetailService: AssetDetailService, private messageService: MessageService,
    private requestTrackingService: RequestTrackingService, private config: DynamicDialogConfig, private ref: DynamicDialogRef,
    private router: Router, private datePipe: DatePipe, private uploadService: UploadFilesService,
    private masterAssetService: MasterAssetService, private requestPeriorityService: RequestPeriorityService,
    private requestModeService: RequestModeService, private requestTypeService: RequestTypeService, private problemService: ProblemService,
    private subProblemService: SubProblemService) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    this.disabledButton = false;
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.reqObj = {
      strRequestDate: '', departmentId: 0,
      serialNumber: '', createdById: "", problemId: 0, masterAssetId: 0, requestCode: '', hospitalId: 0, subject: '', requestPeriorityId: 0, requestStatusId: 0,
      requestTime: new Date().getHours() + ':' + new Date().getMinutes(), requestDate: new Date(), subProblemId: 0, description: '', requestModeId: 0, assetDetailId: 0, requestTypeId: 0
    }

    this.page = {
      pagenumber: 1,
      pagesize: 10
    }
    this.sortObj = {
      userId: '', assetId: 0, hospitalId: 0, closedDate: '', createdBy: '', serial: '', requestCode: '', masterAssetId: 0,
      assetName: '', assetNameAr: '', barCode: '', modeName: '', periorityName: '', periorityNameAr: '', requestDate: '',
      statusName: '', statusNameAr: '', subject: '', sortStatus: '', modeNameAr: '', description: '', woLastTrackDescription: '',
      strSerial: '', strSubject: '', strRequestCode: '', periorityId: 0, statusId: 0, strBarCode: '', strModel: '', sortBy: ''
    }
    this.onLoad();
    this.radioPerioritySelected = 4;
    this.getSelecteditem();
    let assetId = this.config.data.assetId;
    this.assetId = assetId;


    if (assetId != null || assetId != undefined) {
      this.assetId = assetId;
      this.assetStatusTransactionService.GetLastTransactionByAssetId(this.assetId).subscribe(lsttrans => {
        if (lsttrans.length > 0) {


          if (lsttrans[0].assetStatusId == 1) {
            this.errorRequest = true;
            this.workOrderService.GetLastRequestAndWorkOrderByAssetId(this.assetId).subscribe(woObj => {
              if (this.lang == "en") {
                this.errorMessage = "This device is Need Repair";
              }
              else {
                this.errorMessage = "هذا الجهاز يحتاج لإصلاح  ";
              }
              return false;
            });
            return false;
          }
          if (lsttrans[0].assetStatusId == 2) {
            this.errorRequest = true;
            this.workOrderService.GetLastRequestAndWorkOrderByAssetId(this.assetId).subscribe(woObj => {
              if (this.lang == "en") {
                this.errorMessage = "This device is InActive";
              }
              else {
                this.errorMessage = "هذا الجهاز غير فعال  ";
              }
              return false;
            });
            return false;
          }
          if (lsttrans[0].assetStatusId == 4) {
            this.errorRequest = true;
            this.workOrderService.GetLastRequestAndWorkOrderByAssetId(this.assetId).subscribe(woObj => {
              if (this.lang == "en") {
                this.errorMessage = "This device is under Maintainance";
              }
              else {
                this.errorMessage = "هذا الجهاز تحت الصيانة ";
              }
              return false;
            });
            return false;
          }
          if (lsttrans[0].assetStatusId == 5) {
            this.errorRequest = true;
            this.workOrderService.GetLastRequestAndWorkOrderByAssetId(this.assetId).subscribe(woObj => {
              if (this.lang == "en") {
                this.errorMessage = "This device is Under Installation";
              }
              else {
                this.errorMessage = "هذا الجهاز تحت الانشاء ";
              }
              return false;
            });
            return false;
          }
          if (lsttrans[0].assetStatusId == 6) {
            this.errorRequest = true;
            this.workOrderService.GetLastRequestAndWorkOrderByAssetId(this.assetId).subscribe(woObj => {
              if (this.lang == "en") {
                this.errorMessage = "This device is not working";
              }
              else {
                this.errorMessage = "هذا الجهاز لا يعمل";
              }
              return false;
            });
            return false;
          }
          if (lsttrans[0].assetStatusId == 7) {
            this.errorRequest = true;
            this.workOrderService.GetLastRequestAndWorkOrderByAssetId(this.assetId).subscribe(woObj => {
              if (this.lang == "en") {
                this.errorMessage = "This device is stopped";
              }
              else {
                this.errorMessage = "هذا الجهاز متوقف";

              }
              return false;
            });
            return false;
          }
          if (lsttrans[0].assetStatusId == 8) {
            this.errorRequest = true;
            this.workOrderService.GetLastRequestAndWorkOrderByAssetId(this.assetId).subscribe(woObj => {
              if (this.lang == "en") {
                this.errorMessage = "This device in excluded";
              }
              else {
                this.errorMessage = "هذا الجهاز تم استبعاده";

              }
              return false;
            });
            return false;
          }
          if (lsttrans[0].assetStatusId == 9) {
            this.errorRequest = true;
            this.workOrderService.GetLastRequestAndWorkOrderByAssetId(this.assetId).subscribe(woObj => {
              if (this.lang == "en") {
                this.errorMessage = "This device is holded";
              }
              else {
                this.errorMessage = "هذا الجهاز تم إيقافه مؤقتاً";

              }
              return false;
            });
            return false;
          }
        }
      });
    }



    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });
      this.isAssetOwner = (['AssetOwner'].some(r => this.lstRoleNames.includes(r)));
      this.isEngManager = (['EngDepManager'].some(r => this.lstRoleNames.includes(r)));
      this.isEng = (['Eng'].some(r => this.lstRoleNames.includes(r)));
    }
    if (this.currentUser.hospitalId > 0) {
      this.masterAssetService.ListMasterAssetsByHospitalUserId(this.currentUser.hospitalId, this.currentUser.id).subscribe(
        res => {
          this.lstMasterAsset = res;
        });
      this.assetDetailService.GetAllAssetDetailsByHospitalId(this.currentUser.hospitalId).subscribe(masters => {
        this.lstassetDetailBarcodes = masters;
        if (this.lang == "en") {
          this.lstassetDetailBarcodes.forEach(item => item.name = item.barcode);
        }
        else {
          this.lstassetDetailBarcodes.forEach(item => item.name = item.barcode);
        }

      });
    }
    else {
      this.masterAssetService.GetMasterAssets().subscribe(
        res => {
          this.lstMasterAsset = res;
        });
    }

    if (this.config.data != null || this.config.data != undefined) {
      if (this.router.url === '/dash/hospitalassets/lsthorizontal') {
        this.isProblem = true;
        this.isSubProblem = true;
        this.isProblemType = true;


        this.isPeriority = true;
        this.isMode = false;
        this.isMasterAsset = false;
        this.isSerial = false;
        this.isDesc = true;
        this.isStepper1 = false;
        this.isStepper2 = false;
        this.isStepper3 = false;
      }
      else {
        this.isProblem = true;
        this.isSubProblem = true;
        this.isProblemType = true;
        this.isPeriority = true;
        this.isMode = true;
        this.isMasterAsset = true;
        this.isSerial = true;
        this.isDesc = true;
        this.isStepper1 = true;
        this.isStepper2 = true;
        this.isStepper3 = true;
      }
      this.reqObj.requestModeId = 5;
      if (this.currentUser.hospitalId > 0) {
        this.masterAssetService.ListMasterAssetsByHospitalUserId(this.currentUser.hospitalId, this.currentUser.id).subscribe(
          res => {
            this.lstMasterAsset = res;
          });

        this.assetDetailService.GetAllAssetDetailsByHospitalId(this.currentUser.hospitalId).subscribe(hospitalAssets => {
          this.lstassetDetailBarcodes = hospitalAssets;
          if (this.lang == "en") {
            this.lstassetDetailBarcodes.forEach(item => item.barCode = item.barCode);
          }
          else {
            this.lstassetDetailBarcodes.forEach(item => item.barCode = item.barCode);
          }
        });


        this.assetDetailService.GetAllAssetDetailsByHospitalId(this.currentUser.hospitalId).subscribe(hospitalAssets => {
          this.lstSerials = hospitalAssets;
          if (this.lang == "en") {
            this.lstSerials.forEach(item => item.name = item.serialNumber);
          }
          else {
            this.lstSerials.forEach(item => item.name = item.serialNumber);
          }
        });
      }

      this.assetDetailService.GetHospitalAssetById(assetId).subscribe(itemObj1 => {
        this.assetBarCodeObj = itemObj1;
        this.assetSerialObj = itemObj1;
        this.applicationStatus = this.lang == "en" ? this.assetBarCodeObj["assetStatus"] : this.assetBarCodeObj["assetStatusAr"];
        this.assetBarCodeObj.barCode = this.assetBarCodeObj["barCode"];
        this.assetSerialObj.name = itemObj1["serialNumber"];

        this.reqObj.masterAssetId = itemObj1.masterAssetId;





        if (this.applicationStatus == "غير فعال" || this.applicationStatus == "InActive") {
          this.errorDisplay = true;
          this.isDisabled = true;
          if (this.lang == "en") {
            this.errorMessage = "You cannot make ticket for this asset because it is InActive";
          }
          else {
            this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه غير فعال";
          }
          return false;
        }

        if (this.applicationStatus == "تحت الصيانة" || this.applicationStatus == "Under Maintenance") {
          this.errorDisplay = true;
          this.isDisabled = true;
          if (this.lang == "en") {
            this.errorMessage = "You cannot make ticket for this asset because it is Under Maintenance";
          }
          else {
            this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه تحت الصيانة";
          }
          return false;
        }

        if (this.applicationStatus == "استبعاد" || this.applicationStatus == "Execluded") {
          this.errorDisplay = true;
          this.isDisabled = true;
          if (this.lang == "en") {
            this.errorMessage = "You cannot make ticket for this asset because it is Excluded";
          }
          else {
            this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه  مستبعد";
          }
          return false;
        }
        else {
          this.isDisabled = false;
        }

      });
      // this.requestService.GetRequestsByAssetId(assetId, this.currentUser["hospitalId"], this.page).subscribe((items) => {
      //   items.forEach(element => {
      //     if (element.statusId < 5 && (element.statusId != 2)) {
      //       this.timer = window.setInterval(() => {
      //         this.startDateTime = new Date(element.requestDate);
      //         this.startStamp = new Date(element.requestDate).getTime();
      //         this.newDate = new Date();
      //         this.newStamp = this.newDate.getTime();
      //         var diff = Math.round((this.newStamp - this.startStamp) / 1000);
      //         var d = Math.floor(diff / (24 * 60 * 60)); /* though I hope she won't be working for consecutive days :) */
      //         diff = diff - (d * 24 * 60 * 60);
      //         var h = Math.floor(diff / (60 * 60));
      //         diff = diff - (h * 60 * 60);
      //         var m = Math.floor(diff / (60));
      //         diff = diff - (m * 60);
      //         var s = diff;
      //         element.elapsedTime = d + " day(s), " + h + ":" + m + ":" + s + "";
      //       }, 1000);
      //     }
      //     else if (element.statusId == 5) {
      //       if (element.listTracks.length > 0) {
      //         var firstItem = element.listTracks[0];
      //         var lastItem = element.listTracks[element.listTracks.length - 1];
      //         this.startDateTime = new Date(firstItem.date);
      //         this.startStamp = new Date(firstItem.date).getTime();
      //         this.newDate = new Date(lastItem.date);
      //         this.newStamp = this.newDate.getTime();
      //         var diff2 = Math.round((this.newStamp - this.startStamp) / 1000);
      //         var d2 = Math.floor(diff2 / (24 * 60 * 60)); /* though I hope she won't be working for consecutive days :) */
      //         diff2 = diff2 - (d2 * 24 * 60 * 60);
      //         var h2 = Math.floor(diff2 / (60 * 60));
      //         diff2 = diff2 - (h2 * 60 * 60);
      //         var m2 = Math.floor(diff2 / (60));
      //         diff2 = diff2 - (m2 * 60);
      //         var s2 = diff2;
      //         element.elapsedTime = d2 + " day(s), " + h2 + ":" + m2 + ":" + s2 + "";
      //       }
      //     }
      //     else if (element.statusId == 2) {
      //       if (element.listTracks != null) {
      //         var firstItem = element.listTracks[0];
      //         var lastItem = element.listTracks[element.listTracks.length - 1];
      //         this.startDateTime = new Date(firstItem.date);
      //         this.startStamp = new Date(firstItem.date).getTime();
      //         this.newDate = new Date(lastItem.date);
      //         this.newStamp = this.newDate.getTime();
      //         var diff2 = Math.round((this.newStamp - this.startStamp) / 1000);
      //         var d2 = Math.floor(diff2 / (24 * 60 * 60)); /* though I hope she won't be working for consecutive days :) */
      //         diff2 = diff2 - (d2 * 24 * 60 * 60);
      //         var h2 = Math.floor(diff2 / (60 * 60));
      //         diff2 = diff2 - (h2 * 60 * 60);
      //         var m2 = Math.floor(diff2 / (60));
      //         diff2 = diff2 - (m2 * 60);
      //         var s2 = diff2;
      //         element.elapsedTime = d2 + " day(s), " + h2 + ":" + m2 + ":" + s2 + "";
      //       }
      //     }


      //     this.lstRequests.push(element);
      //     this.loading = false;

      //   });

      // });
      this.assetDetailService.GetAssetById(assetId).subscribe(itemObj => {
        this.reqObj.masterAssetId = itemObj["masterAssetId"];
        this.assetDetailService.ViewAllAssetDetailByMasterId(Number(itemObj["masterAssetId"])).subscribe(
          res => {
            this.lstassetDetails = res;
            this.reqObj.assetDetailId = assetId;
            this.problemService.GetProblemByMasterAssetId(itemObj["masterAssetId"]).subscribe(problems => { this.lstProblems = problems; });
            let end = this.datePipe.transform(this.reqObj.requestDate, "yyyy-MM-dd");
            let start = this.datePipe.transform(itemObj["installationDate"], "yyyy-MM-dd");
            this.isValidDate = this.validateDates(start, end);
            if (!this.isValidDate) {
              this.dateError = true;
              return false;
            }
          });
      });
    }
    else {
      this.masterAssetService.GetMasterAssets().subscribe(
        res => {
          this.lstMasterAsset = res;
        });
    }
  }
  onLoad() {
    this.requestService.GenerateRequestNumber().subscribe(num => {
      this.reqObj.requestCode = num.requestCode;
    });

    this.reqObj = { departmentId: 0, strRequestDate: '', hospitalId: 0, assetDetailId: 0, createdById: '', description: '', masterAssetId: 0, problemId: 0, requestCode: '', requestDate: new Date, requestModeId: 0, requestPeriorityId: 0, requestStatusId: 0, requestTime: '', requestTypeId: 0, serialNumber: "", subProblemId: 0, subject: '' };
    this.createRequestDocument = { id: 0, requestTrackingId: 0, fileName: '', documentName: '', requestFile: File, hospitalId: 0 }
    this.createRequestTrackingObj = { strDescriptionDate: '', id: 0, createdById: "", description: '', descriptionDate: new Date(), requestId: 0, requestStatusId: 0, hospitalId: 0 }

    this.requestStatusService.GetAllRequestStatus().subscribe(
      res => {
        this.lstRequestStatus = res;
        this.reqObj.requestModeId = 5;
      });

    this.employeeService.GetEmployees().subscribe(
      res => {
        this.lstEmployees = res
      });
    this.requestPeriorityService.GetAllRequestPeriorties().subscribe(
      res => {
        this.lstPeriorities = res;
        this.reqObj.requestPeriorityId = 4;
      });

    this.requestModeService.GetAllRequetsMode().subscribe(
      res => {
        this.lstRequestMode = res;
      });
    this.requestTypeService.GetAllRequestTypes().subscribe(
      res => {
        this.lstRequestTypes = res;
        this.reqObj.requestTypeId = 2;
      });
  }
  CloseStepper() {
    this.ref.close();
  }
  checkAssetTransaction($event) {
    this.assetId = $event.target.value;
    this.assetDetailService.GetHospitalAssetById($event.target.value).subscribe(assetObj => {
      this.assetBarCodeObj = assetObj;
      this.assetBarCodeObj.name = assetObj["barcode"];
    });

    this.lstRequests = [];
    // this.requestService.GetRequestsByAssetId(this.assetId, this.currentUser["hospitalId"], this.page).subscribe((items) => {
    //   items.forEach(element => {
    //     if (element.statusId < 5 && (element.statusId != 2)) {
    //       this.timer = window.setInterval(() => {
    //         this.startDateTime = new Date(element.requestDate);
    //         this.startStamp = new Date(element.requestDate).getTime();
    //         this.newDate = new Date();
    //         this.newStamp = this.newDate.getTime();
    //         var diff = Math.round((this.newStamp - this.startStamp) / 1000);
    //         var d = Math.floor(diff / (24 * 60 * 60)); /* though I hope she won't be working for consecutive days :) */
    //         diff = diff - (d * 24 * 60 * 60);
    //         var h = Math.floor(diff / (60 * 60));
    //         diff = diff - (h * 60 * 60);
    //         var m = Math.floor(diff / (60));
    //         diff = diff - (m * 60);
    //         var s = diff;
    //         element.elapsedTime = d + " day(s), " + h + ":" + m + ":" + s + "";
    //       }, 1000);
    //     }
    //     else if (element.statusId == 5) {
    //       if (element.listTracks.length > 0) {
    //         var firstItem = element.listTracks[0];
    //         var lastItem = element.listTracks[element.listTracks.length - 1];
    //         this.startDateTime = new Date(firstItem.date);
    //         this.startStamp = new Date(firstItem.date).getTime();
    //         this.newDate = new Date(lastItem.date);
    //         this.newStamp = this.newDate.getTime();
    //         var diff2 = Math.round((this.newStamp - this.startStamp) / 1000);
    //         var d2 = Math.floor(diff2 / (24 * 60 * 60)); /* though I hope she won't be working for consecutive days :) */
    //         diff2 = diff2 - (d2 * 24 * 60 * 60);
    //         var h2 = Math.floor(diff2 / (60 * 60));
    //         diff2 = diff2 - (h2 * 60 * 60);
    //         var m2 = Math.floor(diff2 / (60));
    //         diff2 = diff2 - (m2 * 60);
    //         var s2 = diff2;
    //         element.elapsedTime = d2 + " day(s), " + h2 + ":" + m2 + ":" + s2 + "";
    //       }
    //     }
    //     else if (element.statusId == 2) {
    //       if (element.listTracks != null) {
    //         var firstItem = element.listTracks[0];
    //         var lastItem = element.listTracks[element.listTracks.length - 1];
    //         this.startDateTime = new Date(firstItem.date);
    //         this.startStamp = new Date(firstItem.date).getTime();
    //         this.newDate = new Date(lastItem.date);
    //         this.newStamp = this.newDate.getTime();
    //         var diff2 = Math.round((this.newStamp - this.startStamp) / 1000);
    //         var d2 = Math.floor(diff2 / (24 * 60 * 60)); /* though I hope she won't be working for consecutive days :) */
    //         diff2 = diff2 - (d2 * 24 * 60 * 60);
    //         var h2 = Math.floor(diff2 / (60 * 60));
    //         diff2 = diff2 - (h2 * 60 * 60);
    //         var m2 = Math.floor(diff2 / (60));
    //         diff2 = diff2 - (m2 * 60);
    //         var s2 = diff2;
    //         element.elapsedTime = d2 + " day(s), " + h2 + ":" + m2 + ":" + s2 + "";
    //       }
    //     }


    //     this.lstRequests.push(element);
    //     this.loading = false;
    //   });

    // });


    this.assetStatusTransactionService.GetLastTransactionByAssetId($event.target.value).subscribe(lsttrans => {
      if (lsttrans.length > 0) {
        if (lsttrans[0].assetStatusId == 4) {
          this.errorRequest = true;
          this.workOrderService.GetLastRequestAndWorkOrderByAssetId($event.target.value).subscribe(woObj => {
            if (this.lang == "en") {
              this.errorMessage = "This device in maintainance with work order subject: " + woObj[0]["subject"] + " and Number: " + woObj[0]["workOrderNumber"]
                + " and Request Subject: " + woObj[0]["requestSubject"] + " and Request Number: " + woObj[0]["requestNumber"];
            }
            else {
              this.errorMessage = "هذا الجهاز بالصيانة";
              this.errorMessage = "هذا الجهاز بالصيانة بأمر شغل : " + woObj[0]["subject"] + " ورقم: " + woObj[0]["workOrderNumber"]
                + " بلاغ العطل: " + woObj[0]["requestSubject"] + " برقم: " + woObj[0]["requestNumber"];
            }
            return false;
          });
        }
        else {
          return true;
        }
      }
    });



  }
  GetAllSubProblemsByProblemId($event) {
    this.subProblemService.GetAllSubProblemsByProblemId($event.target.value).subscribe(
      res => {
        this.lstSubProblems = res
      }
    )
  }
  ViewAllAssetDetailByMasterId($event) {

    this.lstassetDetails = [];
    this.lstProblems = [];
    this.reqObj.problemId = 0;
    this.reqObj.subProblemId = 0;
    this.reqObj.assetDetailId = 0;

    this.assetDetailService.ViewAllAssetDetailByMasterId($event.target.value).subscribe(
      res => {
        this.lstassetDetails = res
      });
    this.problemService.GetProblemByMasterAssetId($event.target.value).subscribe(problems => this.lstProblems = problems)

  }
  validateData() {
    if (this.reqObj.subject != "" && this.reqObj.subProblemId != 0 && this.reqObj.description != null
      && this.reqObj.assetDetailId != 0 && this.reqObj.requestPeriorityId != 0
      && this.reqObj.requestTypeId != 0 && this.reqObj.requestModeId != 0) {
      this.disabledButton = true
    }
    else {
      this.disabledButton = false
      if (this.lang == "en") {
        this.messageService.add({ key: 'er', severity: 'error', summary: 'Attention !!!', sticky: true, detail: 'Please Complete Data' });
      }
      else {
        this.messageService.add({ key: 'er', severity: 'خطأ', summary: 'انتبه!!!', sticky: true, detail: 'من فضلك اختر اسم الملف والملف' });

      }
    }
  }
  getSelecteditem() {
    this.reqObj.requestPeriorityId = Number(this.radioPerioritySelected);
  }
  AddRequest() {
    if (this.router.url === '/dash/hospitalassets/lsthorizontal') {
      if (this.reqObj.subject == "") {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please add subject";
        }
        else {
          this.errorMessage = "من فضلك اكتب عنوان للبلاغ";
        }
        return false;
      }
      if (this.reqObj.requestTypeId == 0) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please select type";
        }
        else {
          this.errorMessage = "من فضلك اختر نوع البلاغ";
        }
        return false;
      }
      this.assetDetailService.GetAssetById(this.reqObj.assetDetailId).subscribe(hospitalAssetObj => {
        let end = this.datePipe.transform(this.reqObj.requestDate, "yyyy-MM-dd");
        let start = this.datePipe.transform(hospitalAssetObj.installationDate, "yyyy-MM-dd");
        this.isValidDate = this.validateDates(start, end);
        if (!this.isValidDate) {
          this.dateError = true;
          return false;
        }
      });



      this.reqObj.requestPeriorityId = this.radioPerioritySelected;
      this.reqObj.createdById = this.currentUser.id;
      this.reqObj.requestModeId = 5;
      this.requestService.AddRequest(this.reqObj).subscribe(e => {
        this.requestId = e;
        this.createRequestTrackingObj.requestId = Number(this.requestId)
        this.createRequestTrackingObj.requestStatusId = 1;
        this.createRequestTrackingObj.description = this.reqObj.description;
        this.createRequestTrackingObj.createdById = this.currentUser.id;
        this.requestTrackingService.AddRequestTracking(this.createRequestTrackingObj).subscribe(e => {
          this.requestTrackingId = e;

          var statusObj = new AssetStatusTransactionVM();
          statusObj.assetDetailId = this.reqObj.assetDetailId;
          statusObj.hospitalId = this.currentUser.hospitalId;
          statusObj.statusDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
          statusObj.assetStatusId = 4;
          this.assetStatusTransactionService.AddAssetStatusTransaction(statusObj).subscribe(addedStatus => {
          });
          if (this.lstCreateRequestDocument.length > 0) {
            this.lstCreateRequestDocument.forEach((item, index) => {
              item.hospitalId = this.currentUser.hospitalId;
              item.requestTrackingId = Number(this.requestTrackingId);
              this.requestService.CreateRequestAttachments(item).subscribe(fileObj => {
                this.uploadService.uploadRequestFiles(item.requestFile, item.fileName).subscribe(
                  (event) => {
                    this.display = true;
                    this.isDisabled = true;
                    //   this.ref.close();
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
          else {
            this.display = true;
            this.isDisabled = true;
            //  this.ref.close();
          }
        });
      });
    }
    else {

      this.reqObj.createdById = this.currentUser.id;
      if (this.assetBarCodeObj["barcode"] == '' || this.assetBarCodeObj["barcode"] == undefined) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please select barcode";
        }
        else {
          this.errorMessage = "من فضلك اختر الباركود للجهاز";
        }
        return false;
      }
      if (this.reqObj.masterAssetId == 0) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please select master asset";
        }
        else {
          this.errorMessage = "من فضلك اختر الجهاز";
        }
        return false;
      }
      if (this.reqObj.assetDetailId == 0) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please select asset serial";
        }
        else {
          this.errorMessage = "من فضلك اختر رقم الجهاز";
        }
        return false;
      }
      if (this.reqObj.subject == "") {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please add subject";
        }
        else {
          this.errorMessage = "من فضلك اكتب عنوان لبلاغ العطل";
        }
        return false;
      }

      if (this.reqObj.requestModeId == 0) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please select mode";
        }
        else {
          this.errorMessage = "من فضلك اختر طريقة التواصل";
        }
        return false;
      }
      if (this.reqObj.requestTypeId == 0) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please select type";
        }
        else {
          this.errorMessage = "من فضلك اختر نوع البلاغ";
        }
        return false;
      }
      if (this.radioPerioritySelected == 0) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please select periority";
        }
        else {
          this.errorMessage = "من فضلك اختر الأولوية";
        }
        return false;
      }
      // if (this.applicationStatus == "غير فعال" || this.applicationStatus == "InActive") {
      //   this.errorDisplay = true;
      //   if (this.lang == "en") {
      //     this.errorMessage = "You cannot make ticket for this asset because it is InActive";
      //   }
      //   else {
      //     this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه غير فعال";
      //   }
      //   return false;
      // }
      // if (this.applicationStatus == "استبعاد" || this.applicationStatus == "Execluded") {
      //   this.errorDisplay = true;
      //   if (this.lang == "en") {
      //     this.errorMessage = "You cannot make ticket for this asset because it is Execluded";
      //   }
      //   else {
      //     this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه  مستبعد";
      //   }
      //   return false;
      // }

      if (this.assetStatusId == 1) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it Needs Repair";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه يحتاج لإصلاح ";
        }
        this.isDisabled = true;
        return false;
      }
      if (this.assetStatusId == 2) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is InActive";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه غير فعال";
        }
        this.isDisabled = true;
        return false;
      }
      if (this.assetStatusId == 4) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Under Maintenance";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه تحت الصيانة";
        }
        this.isDisabled = true;
        return false;

      }
      if (this.assetStatusId == 5) {

        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Under Installation";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه  تحت الإنشاء";
        }
        this.isDisabled = true;
        return false;

      }
      if (this.assetStatusId == 6) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is not working ";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه لا يعمل ";
        }
        this.isDisabled = true;
        return false;

      }
      if (this.assetStatusId == 7) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Shut Down";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه متوقف ";
        }
        this.isDisabled = true;
        return false;

      }
      if (this.assetStatusId == 8) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Excluded";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه مستبعد ";
        }
        this.isDisabled = true;
        return false;

      }
      if (this.assetStatusId == 9) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Hold";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه في حالة إيقاف مؤقت ";
        }
        this.isDisabled = true;
        return false;
      }
      this.assetDetailService.GetAssetById(this.assetId).subscribe(hospitalAssetObj => {
        let end = this.datePipe.transform(this.reqObj.requestDate, "yyyy-MM-dd");
        let start = this.datePipe.transform(hospitalAssetObj["installationDate"], "yyyy-MM-dd");
        this.isValidDate = this.validateDates(start, end);
        if (!this.isValidDate) {
          this.dateError = true;
          return false;
        }
      });
      this.assetStatusTransactionService.GetLastTransactionByAssetId(this.reqObj.assetDetailId).subscribe(lsttrans => {
        if (lsttrans.length > 0) {
          if (lsttrans[0].assetStatusId == 4) {
            this.errorRequest = true;
            this.workOrderService.GetLastRequestAndWorkOrderByAssetId(this.reqObj.assetDetailId).subscribe(woObj => {

              if (woObj[0]["subject"] != null || woObj[0]["subject"] != "") {
                if (this.lang == "en") {
                  this.errorMessage = "This device in maintainance with work order subject: " + woObj[0]["subject"] + " and Number: " + woObj[0]["workOrderNumber"]
                    + " and Request Subject: " + woObj[0]["requestSubject"] + " and Request Number: " + woObj[0]["requestNumber"];
                }
                else {
                  this.errorMessage = "هذا الجهاز بالصيانة";
                  this.errorMessage = "هذا الجهاز بالصيانة بأمر تشغيل : " + woObj[0]["subject"] + " ورقم: " + woObj[0]["workOrderNumber"]
                    + " بلاغ عطل: " + woObj[0]["requestSubject"] + " برقم: " + woObj[0]["requestNumber"];
                }
                return false;
              }
              else {
                if (this.lang == "en") {
                  this.errorMessage = "This device in maintainance";
                }
                else {
                  this.errorMessage = "هذا الجهاز بالصيانة";

                }
              }
            });

            return false;
          }
        }
      });



      this.reqObj.hospitalId = this.currentUser.hospitalId;
      this.reqObj.requestPeriorityId = this.radioPerioritySelected;
      this.reqObj.createdById = this.currentUser.id;
      this.requestService.inserRequest(this.reqObj).subscribe(e => {
        this.reqId = e;
        this.createRequestTrackingObj.requestId = Number(this.reqId)
        this.createRequestTrackingObj.requestStatusId = 1;

        this.createRequestTrackingObj.hospitalId = this.currentUser.hospitalId;


        this.createRequestTrackingObj.description = this.reqObj.description
        this.createRequestTrackingObj.createdById = this.currentUser.id
        this.requestTrackingService.AddRequestTracking(this.createRequestTrackingObj).subscribe(trackObj => {
          this.requestTrackingId = trackObj;

          var statusObj = new AssetStatusTransactionVM();
          statusObj.assetDetailId = this.reqObj.assetDetailId;
          statusObj.hospitalId = this.currentUser.hospitalId;
          statusObj.statusDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
          statusObj.assetStatusId = 4;
          this.assetStatusTransactionService.AddAssetStatusTransaction(statusObj).subscribe(addedStatus => {
          });
          if (this.lstCreateRequestDocument.length > 0) {
            this.lstCreateRequestDocument.forEach((item, index) => {
              item.hospitalId = this.currentUser.hospitalId;
              item.requestTrackingId = Number(trackObj);
              this.requestService.CreateRequestAttachments(item).subscribe(fileObj => {
                this.uploadService.uploadRequestFiles(item.requestFile, item.fileName).subscribe(
                  (event) => {
                    this.display = true;
                    this.isDisabled = true;
                    //   this.ref.close();
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
          else {
            this.display = true;
            this.isDisabled = true;
            //  this.ref.close();
          }
        });
      });
    }
  }

  validateDates(sDate: string, eDate: string) {
    this.isValidDate = true;
    if ((sDate != null && eDate != null) && (eDate) < (sDate)) {
      this.error = { isError: true, errorMessage: 'Request date should be greater than installation date.' };
      this.isValidDate = false;
    }
    return this.isValidDate;
  }
  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    this.formData.append('file', fileToUpload, fileToUpload.name);
    this.createRequestDocument.fileName = fileToUpload.name;
    this.createRequestDocument.requestFile = fileToUpload;
    this.AddFileToList();
  }
  AddFileToList() {
    if (this.createRequestDocument.documentName != "" && this.createRequestDocument.fileName != "") {
      this.createRequestDocument.requestTrackingId = Number(this.requestTrackingId)
      if (this.itmIndex.length === 0) {
        last_element = 1;
      }
      else if (this.itmIndex.length > 0) {
        var last_element = this.itmIndex[this.itmIndex.length - 1];
        last_element = last_element + 1;
      }
      this.itmIndex.push(last_element);
      let ext = this.createRequestDocument.fileName.split('.').pop();
      var hCode = this.pad(this.currentUser.hospitalCode, 4);
      var srCode = this.pad(this.reqObj.requestCode, 10);
      var last = this.itmIndex[this.itmIndex.length - 1];
      let newIndex = this.pad((last).toString(), 2);
      let SRFileName = hCode + "SR" + srCode + newIndex;
      this.createRequestDocument.fileName = SRFileName + "." + ext;

      this.lstCreateRequestDocument.push(this.createRequestDocument);
      this.createRequestDocument = { id: 0, fileName: '', requestTrackingId: 0, documentName: '', requestFile: File, hospitalId: 0 };
    }
    else {
      if (this.lang == "en") {
        this.messageService.add({ key: 'er', severity: 'error', summary: 'Attention !!!', sticky: true, detail: 'Please Complete Data' });
      }
      else {
        this.messageService.add({ key: 'er', severity: 'خطأ', summary: 'انتبه!!!', sticky: true, detail: 'من فضلك اختر اسم الملف والملف' });
      }
    }
  }
  // saveFilesToDB() {
  //   this.lstCreateRequestDocument.forEach((item, index) => {
  //     this.requestService.CreateRequestAttachments(item).subscribe(fileObj => {
  //       this.uploadService.uploadRequestFiles(item.requestFile, item.fileName).subscribe(
  //         (event) => {
  //           if (this.lang == "en") {
  //             this.messageService.add({ key: 'files', severity: 'success', summary: 'Success', detail: 'Files added successfully' });
  //           }
  //           else {
  //             this.messageService.add({ key: 'files', severity: 'نجاح الحفظ', summary: 'نجاح الحفظ', detail: 'تم رفع الملفات بنجاح' });
  //           }
  //         },
  //         (err) => {

  //           if (this.lang == "en") {
  //             this.errorDisplay = true;
  //             this.errorMessage = 'Could not upload the file:' + item[index].fileName;
  //           }
  //           else {
  //             this.errorDisplay = true;
  //             this.errorMessage = 'لا يمكن رفع ملف ' + item[index].fileName;
  //           }
  //         });
  //     });
  //   });
  //   this.lstCreateRequestDocument = [];
  // }


  removeFileFromObjectArray(doc) {
    const index: number = this.lstCreateRequestDocument.indexOf(doc);
    if (index !== -1) {
      this.lstCreateRequestDocument.splice(index, 1);
    }
  }
  pad(num: string, size: number): string {
    while (num.length < size) num = "0" + num;
    return num;
  }

  getBarCode(event) {

    this.assetSerialObj.serialNumber = event["serialNumber"];
    this.assetBarCodeObj.barCode = event["barCode"];
    this.reqObj.masterAssetId = event["masterAssetId"];
    this.assetDetailService.GetAssetNameByMasterAssetIdAndHospitalId(Number(event["masterAssetId"]), this.currentUser.hospitalId).subscribe(
      res => {
        this.lstassetDetails = res;
        this.reqObj.assetDetailId = event["id"];
        this.lstRequests = [];



        this.assetDetailService.GetHospitalAssetById(this.reqObj.assetDetailId).subscribe(assetObj => {
          this.assetBarCodeObj = assetObj;

          this.assetStatusId = this.assetBarCodeObj["assetStatusId"];

          // this.applicationStatus = this.lang == "en" ? this.assetBarCodeObj["assetStatus"] : this.assetBarCodeObj["assetStatusAr"];
          // if (this.applicationStatus == "غير فعال" || this.applicationStatus == "InActive") {
          //   this.errorDisplay = true;
          //   if (this.lang == "en") {
          //     this.errorMessage = "You cannot make ticket for this asset because it is InActive";
          //   }
          //   else {
          //     this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه غير فعال";
          //   }
          //   // return false;
          // }

          // if (this.applicationStatus == "تحت الصيانة" || this.applicationStatus == "Under Maintenance") {
          //   this.errorDisplay = true;
          //   if (this.lang == "en") {
          //     this.errorMessage = "You cannot make ticket for this asset because it is Under Maintenance";
          //   }
          //   else {
          //     this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه تحت الصيانة";
          //   }
          //   // return false;
          // }

          // if (this.applicationStatus == "استبعاد" || this.applicationStatus == "Execluded") {
          //   this.errorDisplay = true;
          //   if (this.lang == "en") {
          //     this.errorMessage = "You cannot make ticket for this asset because it is Under Maintenance";
          //   }
          //   else {
          //     this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه مستبعد ";
          //   }
          //   // return false;
          // }

          if (this.assetStatusId == 1) {
            this.errorDisplay = true;
            if (this.lang == "en") {
              this.errorMessage = "You cannot make ticket for this asset because it Needs Repair";
            }
            else {
              this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه يحتاج لإصلاح ";
            }
            this.isDisabled = true;
          }
          if (this.assetStatusId == 2) {
            this.errorDisplay = true;
            if (this.lang == "en") {
              this.errorMessage = "You cannot make ticket for this asset because it is InActive";
            }
            else {
              this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه غير فعال";
            }
            this.isDisabled = true;
          }
          if (this.assetStatusId == 4) {
            this.errorDisplay = true;
            if (this.lang == "en") {
              this.errorMessage = "You cannot make ticket for this asset because it is Under Maintenance";
            }
            else {
              this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه تحت الصيانة";
            }
            this.isDisabled = true;

          }
          if (this.assetStatusId == 5) {

            this.errorDisplay = true;
            if (this.lang == "en") {
              this.errorMessage = "You cannot make ticket for this asset because it is Under Installation";
            }
            else {
              this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه  تحت الإنشاء";
            }
            this.isDisabled = true;

          }
          if (this.assetStatusId == 6) {
            this.errorDisplay = true;
            if (this.lang == "en") {
              this.errorMessage = "You cannot make ticket for this asset because it is not working ";
            }
            else {
              this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه لا يعمل ";
            }
            this.isDisabled = true;

          }
          if (this.assetStatusId == 7) {
            this.errorDisplay = true;
            if (this.lang == "en") {
              this.errorMessage = "You cannot make ticket for this asset because it is Shut Down";
            }
            else {
              this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه متوقف ";
            }
            this.isDisabled = true;

          }
          if (this.assetStatusId == 8) {
            this.errorDisplay = true;
            if (this.lang == "en") {
              this.errorMessage = "You cannot make ticket for this asset because it is Excluded";
            }
            else {
              this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه مستبعد ";
            }
            this.isDisabled = true;

          }
          if (this.assetStatusId == 9) {
            this.errorDisplay = true;
            if (this.lang == "en") {
              this.errorMessage = "You cannot make ticket for this asset because it is Hold";
            }
            else {
              this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه في حالة إيقاف مؤقت ";
            }
            this.isDisabled = true;
          }
          else {
            this.isDisabled = false;
          }

          this.assetBarCodeObj.name = assetObj["barcode"];
        });

        // this.requestService.GetRequestsByAssetId(this.reqObj.assetDetailId, this.currentUser["hospitalId"], this.page).subscribe((items) => {
        //   items.forEach(element => {
        //     if (element.statusId < 5 && (element.statusId != 2)) {
        //       this.timer = window.setInterval(() => {
        //         this.startDateTime = new Date(element.requestDate);
        //         this.startStamp = new Date(element.requestDate).getTime();
        //         this.newDate = new Date();
        //         this.newStamp = this.newDate.getTime();
        //         var diff = Math.round((this.newStamp - this.startStamp) / 1000);
        //         var d = Math.floor(diff / (24 * 60 * 60)); /* though I hope she won't be working for consecutive days :) */
        //         diff = diff - (d * 24 * 60 * 60);
        //         var h = Math.floor(diff / (60 * 60));
        //         diff = diff - (h * 60 * 60);
        //         var m = Math.floor(diff / (60));
        //         diff = diff - (m * 60);
        //         var s = diff;
        //         element.elapsedTime = d + " day(s), " + h + ":" + m + ":" + s + "";
        //       }, 1000);
        //     }
        //     else if (element.statusId == 5) {
        //       if (element.listTracks.length > 0) {
        //         var firstItem = element.listTracks[0];
        //         var lastItem = element.listTracks[element.listTracks.length - 1];

        //         this.startDateTime = new Date(firstItem.date);
        //         this.startStamp = new Date(firstItem.date).getTime();
        //         this.newDate = new Date(lastItem.date);
        //         this.newStamp = this.newDate.getTime();
        //         var diff2 = Math.round((this.newStamp - this.startStamp) / 1000);
        //         var d2 = Math.floor(diff2 / (24 * 60 * 60)); /* though I hope she won't be working for consecutive days :) */
        //         diff2 = diff2 - (d2 * 24 * 60 * 60);
        //         var h2 = Math.floor(diff2 / (60 * 60));
        //         diff2 = diff2 - (h2 * 60 * 60);
        //         var m2 = Math.floor(diff2 / (60));
        //         diff2 = diff2 - (m2 * 60);
        //         var s2 = diff2;
        //         element.elapsedTime = d2 + " day(s), " + h2 + ":" + m2 + ":" + s2 + "";
        //       }
        //     }
        //     else if (element.statusId == 2) {
        //       if (element.listTracks != null) {
        //         var firstItem = element.listTracks[0];
        //         var lastItem = element.listTracks[element.listTracks.length - 1];
        //         this.startDateTime = new Date(firstItem.date);
        //         this.startStamp = new Date(firstItem.date).getTime();
        //         this.newDate = new Date(lastItem.date);
        //         this.newStamp = this.newDate.getTime();
        //         var diff2 = Math.round((this.newStamp - this.startStamp) / 1000);
        //         var d2 = Math.floor(diff2 / (24 * 60 * 60)); /* though I hope she won't be working for consecutive days :) */
        //         diff2 = diff2 - (d2 * 24 * 60 * 60);
        //         var h2 = Math.floor(diff2 / (60 * 60));
        //         diff2 = diff2 - (h2 * 60 * 60);
        //         var m2 = Math.floor(diff2 / (60));
        //         diff2 = diff2 - (m2 * 60);
        //         var s2 = diff2;
        //         element.elapsedTime = d2 + " day(s), " + h2 + ":" + m2 + ":" + s2 + "";
        //       }
        //     }


        //     this.lstRequests.push(element);
        //     this.loading = false;
        //   });

        // });
      });
  }
  onSelectionChanged(event) {
    this.assetDetailService.AutoCompleteAssetBarCode(event.query, this.currentUser.hospitalId).subscribe(assets => {
      this.lstassetDetailBarcodes = assets;
      if (this.lang == "en") {
        this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
      }
      else {
        this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
      }
    });
  }
  getSerial(event) {

    this.assetBarCodeObj.barCode = event["barCode"];

    this.assetSerialObj.serialNumber = event["serialNumber"];
    this.reqObj.masterAssetId = event["masterAssetId"];
    this.assetDetailService.GetAssetNameByMasterAssetIdAndHospitalId(Number(event["masterAssetId"]), this.currentUser.hospitalId).subscribe(
      res => {
        this.lstassetDetails = res;
        this.reqObj.assetDetailId = event["id"];
        this.lstRequests = [];

        this.assetDetailService.GetHospitalAssetById(this.reqObj.assetDetailId).subscribe(assetObj => {
          this.assetBarCodeObj = assetObj;

          //AssetStatusId
          this.assetStatusId = this.assetSerialObj["assetStatusId"];
          if (this.assetStatusId == 1) {
            this.errorDisplay = true;
            if (this.lang == "en") {
              this.errorMessage = "You cannot make ticket for this asset because it Needs Repair";
            }
            else {
              this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه يحتاج لإصلاح ";
            }
            this.isDisabled = true;
          }
          if (this.assetStatusId == 2) {
            this.errorDisplay = true;
            if (this.lang == "en") {
              this.errorMessage = "You cannot make ticket for this asset because it is InActive";
            }
            else {
              this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه غير فعال";
            }
            this.isDisabled = true;
          }
          if (this.assetStatusId == 4) {
            this.errorDisplay = true;
            if (this.lang == "en") {
              this.errorMessage = "You cannot make ticket for this asset because it is Under Maintenance";
            }
            else {
              this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه تحت الصيانة";
            }
            this.isDisabled = true;

          }
          if (this.assetStatusId == 5) {

            this.errorDisplay = true;
            if (this.lang == "en") {
              this.errorMessage = "You cannot make ticket for this asset because it is Under Installation";
            }
            else {
              this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه  تحت الإنشاء";
            }
            this.isDisabled = true;

          }
          if (this.assetStatusId == 6) {
            this.errorDisplay = true;
            if (this.lang == "en") {
              this.errorMessage = "You cannot make ticket for this asset because it is not working ";
            }
            else {
              this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه لا يعمل ";
            }
            this.isDisabled = true;

          }
          if (this.assetStatusId == 7) {
            this.errorDisplay = true;
            if (this.lang == "en") {
              this.errorMessage = "You cannot make ticket for this asset because it is Shut Down";
            }
            else {
              this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه متوقف ";
            }
            this.isDisabled = true;

          }
          if (this.assetStatusId == 8) {
            this.errorDisplay = true;
            if (this.lang == "en") {
              this.errorMessage = "You cannot make ticket for this asset because it is Excluded";
            }
            else {
              this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه مستبعد ";
            }
            this.isDisabled = true;

          }
          if (this.assetStatusId == 9) {
            this.errorDisplay = true;
            if (this.lang == "en") {
              this.errorMessage = "You cannot make ticket for this asset because it is Hold";
            }
            else {
              this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه في حالة إيقاف مؤقت ";
            }
            this.isDisabled = true;

          }

          this.assetBarCodeObj.name = assetObj["serialNumber"];
        });

        // this.requestService.GetRequestsByAssetId(this.reqObj.assetDetailId, this.currentUser["hospitalId"], this.page).subscribe((items) => {
        //   items.forEach(element => {
        //     if (element.statusId < 5 && (element.statusId != 2)) {
        //       this.timer = window.setInterval(() => {
        //         this.startDateTime = new Date(element.requestDate);
        //         this.startStamp = new Date(element.requestDate).getTime();
        //         this.newDate = new Date();
        //         this.newStamp = this.newDate.getTime();
        //         var diff = Math.round((this.newStamp - this.startStamp) / 1000);
        //         var d = Math.floor(diff / (24 * 60 * 60)); /* though I hope she won't be working for consecutive days :) */
        //         diff = diff - (d * 24 * 60 * 60);
        //         var h = Math.floor(diff / (60 * 60));
        //         diff = diff - (h * 60 * 60);
        //         var m = Math.floor(diff / (60));
        //         diff = diff - (m * 60);
        //         var s = diff;
        //         element.elapsedTime = d + " day(s), " + h + ":" + m + ":" + s + "";
        //       }, 1000);
        //     }
        //     else if (element.statusId == 5) {
        //       if (element.listTracks.length > 0) {
        //         var firstItem = element.listTracks[0];
        //         var lastItem = element.listTracks[element.listTracks.length - 1];

        //         this.startDateTime = new Date(firstItem.date);
        //         this.startStamp = new Date(firstItem.date).getTime();
        //         this.newDate = new Date(lastItem.date);
        //         this.newStamp = this.newDate.getTime();
        //         var diff2 = Math.round((this.newStamp - this.startStamp) / 1000);
        //         var d2 = Math.floor(diff2 / (24 * 60 * 60)); /* though I hope she won't be working for consecutive days :) */
        //         diff2 = diff2 - (d2 * 24 * 60 * 60);
        //         var h2 = Math.floor(diff2 / (60 * 60));
        //         diff2 = diff2 - (h2 * 60 * 60);
        //         var m2 = Math.floor(diff2 / (60));
        //         diff2 = diff2 - (m2 * 60);
        //         var s2 = diff2;
        //         element.elapsedTime = d2 + " day(s), " + h2 + ":" + m2 + ":" + s2 + "";
        //       }
        //     }
        //     else if (element.statusId == 2) {
        //       if (element.listTracks != null) {
        //         var firstItem = element.listTracks[0];
        //         var lastItem = element.listTracks[element.listTracks.length - 1];
        //         this.startDateTime = new Date(firstItem.date);
        //         this.startStamp = new Date(firstItem.date).getTime();
        //         this.newDate = new Date(lastItem.date);
        //         this.newStamp = this.newDate.getTime();
        //         var diff2 = Math.round((this.newStamp - this.startStamp) / 1000);
        //         var d2 = Math.floor(diff2 / (24 * 60 * 60)); /* though I hope she won't be working for consecutive days :) */
        //         diff2 = diff2 - (d2 * 24 * 60 * 60);
        //         var h2 = Math.floor(diff2 / (60 * 60));
        //         diff2 = diff2 - (h2 * 60 * 60);
        //         var m2 = Math.floor(diff2 / (60));
        //         diff2 = diff2 - (m2 * 60);
        //         var s2 = diff2;
        //         element.elapsedTime = d2 + " day(s), " + h2 + ":" + m2 + ":" + s2 + "";
        //       }
        //     }


        //     this.lstRequests.push(element);
        //     this.loading = false;
        //   });

        // });
      });
  }
  onSerialSelectionChanged(event) {
    this.assetDetailService.AutoCompleteAssetBarCode(event.query, this.currentUser.hospitalId).subscribe(assets => {
      this.lstSerials = assets;
      if (this.lang == "en") {
        this.lstSerials.forEach(item => item.name = item.serialNumber);
      }
      else {
        this.lstSerials.forEach(item => item.name = item.serialNumber);
      }
    });
  }
  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;
    this.lstRequests = [];
    if (this.reqObj.assetDetailId != 0) {
      // this.requestService.GetRequestsByAssetId(this.reqObj.assetDetailId, this.currentUser["hospitalId"], this.page).subscribe((items) => {
      //   items.forEach(element => {
      //     if (element.statusId < 5 && (element.statusId != 2)) {
      //       this.timer = window.setInterval(() => {
      //         this.startDateTime = new Date(element.requestDate);
      //         this.startStamp = new Date(element.requestDate).getTime();
      //         this.newDate = new Date();
      //         this.newStamp = this.newDate.getTime();
      //         var diff = Math.round((this.newStamp - this.startStamp) / 1000);
      //         var d = Math.floor(diff / (24 * 60 * 60)); /* though I hope she won't be working for consecutive days :) */
      //         diff = diff - (d * 24 * 60 * 60);
      //         var h = Math.floor(diff / (60 * 60));
      //         diff = diff - (h * 60 * 60);
      //         var m = Math.floor(diff / (60));
      //         diff = diff - (m * 60);
      //         var s = diff;
      //         element.elapsedTime = d + " day(s), " + h + ":" + m + ":" + s + "";
      //       }, 1000);
      //     }
      //     else if (element.statusId == 5) {
      //       if (element.listTracks.length > 0) {
      //         var firstItem = element.listTracks[0];
      //         var lastItem = element.listTracks[element.listTracks.length - 1];
      //         this.startDateTime = new Date(firstItem.date);
      //         this.startStamp = new Date(firstItem.date).getTime();
      //         this.newDate = new Date(lastItem.date);
      //         this.newStamp = this.newDate.getTime();
      //         var diff2 = Math.round((this.newStamp - this.startStamp) / 1000);
      //         var d2 = Math.floor(diff2 / (24 * 60 * 60)); /* though I hope she won't be working for consecutive days :) */
      //         diff2 = diff2 - (d2 * 24 * 60 * 60);
      //         var h2 = Math.floor(diff2 / (60 * 60));
      //         diff2 = diff2 - (h2 * 60 * 60);
      //         var m2 = Math.floor(diff2 / (60));
      //         diff2 = diff2 - (m2 * 60);
      //         var s2 = diff2;
      //         element.elapsedTime = d2 + " day(s), " + h2 + ":" + m2 + ":" + s2 + "";
      //       }
      //     }
      //     else if (element.statusId == 2) {
      //       if (element.listTracks != null) {
      //         var firstItem = element.listTracks[0];
      //         var lastItem = element.listTracks[element.listTracks.length - 1];
      //         this.startDateTime = new Date(firstItem.date);
      //         this.startStamp = new Date(firstItem.date).getTime();
      //         this.newDate = new Date(lastItem.date);
      //         this.newStamp = this.newDate.getTime();
      //         var diff2 = Math.round((this.newStamp - this.startStamp) / 1000);
      //         var d2 = Math.floor(diff2 / (24 * 60 * 60)); /* though I hope she won't be working for consecutive days :) */
      //         diff2 = diff2 - (d2 * 24 * 60 * 60);
      //         var h2 = Math.floor(diff2 / (60 * 60));
      //         diff2 = diff2 - (h2 * 60 * 60);
      //         var m2 = Math.floor(diff2 / (60));
      //         diff2 = diff2 - (m2 * 60);
      //         var s2 = diff2;
      //         element.elapsedTime = d2 + " day(s), " + h2 + ":" + m2 + ":" + s2 + "";
      //       }
      //     }


      //     this.lstRequests.push(element);
      //     this.loading = false;
      //   });

      // });
    }
  }
  sort(field) {

    if (this.sortStatus === "descending") {
      this.sortStatus = "ascending";
      this.sortObj.sortStatus = this.sortStatus;
    }
    else {
      this.sortStatus = "descending"
      this.sortObj.sortStatus = this.sortStatus;
    }
    if (field.currentTarget.id == "Subject") {
      this.sortObj.subject = field.currentTarget.id
    }

    if (field.currentTarget.id == "Date") {
      this.sortObj.requestDate = field.currentTarget.id
    }
    else if (field.currentTarget.id == "التاريخ") {
      this.sortObj.requestDate = field.currentTarget.id
    }
    if (field.currentTarget.id == 'Status') {
      this.sortObj.statusName = field.currentTarget.id
    }
    else if (field.currentTarget.id === "الحاله") {
      this.sortObj.statusNameAr = field.currentTarget.id
    }
    if (field.currentTarget.id == "Periority") {
      this.sortObj.periorityName = field.currentTarget.id
    }
    else if (field.currentTarget.id == "الأولوية") {
      this.sortObj.periorityNameAr = field.currentTarget.id
    }
    if (field.currentTarget.id == "Mode") {
      this.sortObj.modeName = field.currentTarget.id
    }
    else if (field.currentTarget.id == "طريقة الإبلاغ") {
      this.sortObj.modeNameAr = field.currentTarget.id
    }

    this.lstRequests = [];
    this.sortObj.userId = this.currentUser.id;
    this.sortObj.hospitalId = this.currentUser.hospitalId;
    this.sortObj.assetId = this.assetId;

    // this.requestService.SortRequestsByAssetId(this.page.pagenumber, this.page.pagesize, this.sortObj).subscribe(data => {
    //   data.forEach(element => {
    //     if (element.statusId < 5 && (element.statusId != 2)) {
    //       this.timer = window.setInterval(() => {
    //         this.startDateTime = new Date(element.requestDate);
    //         this.startStamp = new Date(element.requestDate).getTime();
    //         this.newDate = new Date();
    //         this.newStamp = this.newDate.getTime();
    //         var diff = Math.round((this.newStamp - this.startStamp) / 1000);
    //         var d = Math.floor(diff / (24 * 60 * 60)); /* though I hope she won't be working for consecutive days :) */
    //         diff = diff - (d * 24 * 60 * 60);
    //         var h = Math.floor(diff / (60 * 60));
    //         diff = diff - (h * 60 * 60);
    //         var m = Math.floor(diff / (60));
    //         diff = diff - (m * 60);
    //         var s = diff;
    //         element.elapsedTime = d + " day(s), " + h + ":" + m + ":" + s + "";
    //       }, 1000);
    //     }
    //     else if (element.statusId == 5) {
    //       if (element.listTracks.length > 0) {
    //         var firstItem = element.listTracks[0];
    //         var lastItem = element.listTracks[element.listTracks.length - 1];
    //         this.startDateTime = new Date(firstItem.date);
    //         this.startStamp = new Date(firstItem.date).getTime();
    //         this.newDate = new Date(lastItem.date);
    //         this.newStamp = this.newDate.getTime();
    //         var diff2 = Math.round((this.newStamp - this.startStamp) / 1000);
    //         var d2 = Math.floor(diff2 / (24 * 60 * 60)); /* though I hope she won't be working for consecutive days :) */
    //         diff2 = diff2 - (d2 * 24 * 60 * 60);
    //         var h2 = Math.floor(diff2 / (60 * 60));
    //         diff2 = diff2 - (h2 * 60 * 60);
    //         var m2 = Math.floor(diff2 / (60));
    //         diff2 = diff2 - (m2 * 60);
    //         var s2 = diff2;
    //         element.elapsedTime = d2 + " day(s), " + h2 + ":" + m2 + ":" + s2 + "";
    //       }
    //     }
    //     else if (element.statusId == 2) {
    //       if (element.listTracks != null) {
    //         var firstItem = element.listTracks[0];
    //         var lastItem = element.listTracks[element.listTracks.length - 1];
    //         this.startDateTime = new Date(firstItem.date);
    //         this.startStamp = new Date(firstItem.date).getTime();
    //         this.newDate = new Date(lastItem.date);
    //         this.newStamp = this.newDate.getTime();
    //         var diff2 = Math.round((this.newStamp - this.startStamp) / 1000);
    //         var d2 = Math.floor(diff2 / (24 * 60 * 60)); /* though I hope she won't be working for consecutive days :) */
    //         diff2 = diff2 - (d2 * 24 * 60 * 60);
    //         var h2 = Math.floor(diff2 / (60 * 60));
    //         diff2 = diff2 - (h2 * 60 * 60);
    //         var m2 = Math.floor(diff2 / (60));
    //         diff2 = diff2 - (m2 * 60);
    //         var s2 = diff2;
    //         element.elapsedTime = d2 + " day(s), " + h2 + ":" + m2 + ":" + s2 + "";
    //       }
    //     }
    //     this.lstRequests.push(element);
    //     this.loading = false;
    //   });


    //   this.sortStatus = this.sortObj.sortStatus,
    //     this.sortObj = {
    //       userId: '', assetId: 0, hospitalId: 0, closedDate: "", createdBy: '', serial: '', requestCode: '', masterAssetId: 0,
    //       assetName: '', assetNameAr: '', barCode: '', modeName: '', periorityName: '', periorityNameAr: '', requestDate: '',
    //       statusName: '', statusNameAr: '', subject: '', sortStatus: '', modeNameAr: '', description: '', woLastTrackDescription: '',
    //       strSerial: '', strSubject: '', strRequestCode: '', periorityId: 0, statusId: 0, strBarCode: '', strModel: '', sortBy: ''
    //     }
    // })
  }
  closeDialogue() {
    this.ref.close();
  }
}
