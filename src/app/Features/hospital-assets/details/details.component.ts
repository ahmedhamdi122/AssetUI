import { DatePipe, Location } from '@angular/common';

import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { DataTableDirective } from 'angular-datatables';
import jsPDF from 'jspdf';
import { ConfirmationService } from 'primeng/api';
import { Subject } from 'rxjs';
import { AssetDetailAttachmentVM, ViewAssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { CreateAssetMovementVM, EditAssetMovementVM, ListAssetMovementVM } from 'src/app/Shared/Models/assetMovementVM';
import { CreateAssetStatusTransactionVM, ListAssetStatusTransactionVM } from 'src/app/Shared/Models/assetStatusTransactionVM';
import { ListAssetStatusVM } from 'src/app/Shared/Models/assetStatusVM';
import { ListBuildingVM } from 'src/app/Shared/Models/buildingVM';
import { ListFloorVM } from 'src/app/Shared/Models/floorVM';
import { CreatePMAssetTaskScheduleVM, CreatePMAssetTaskVM, ListPMAssetTaskVM } from 'src/app/Shared/Models/masterAssetVM';
import { addPMAssetTaskScheduleVM } from 'src/app/Shared/Models/pmAssetTaskScheduleVM';
import { EditPMAssetTimeVM, ListPMAssetTimeVM, PmDateGroupVM } from 'src/app/Shared/Models/pmAssetTimeVM';
import { ListRoomVM } from 'src/app/Shared/Models/roomVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { AssetMovementService } from 'src/app/Shared/Services/assetMovement.service';
import { AssetStatusService } from 'src/app/Shared/Services/assetStatus.service';
import { AssetStatusTransactionService } from 'src/app/Shared/Services/assetStatusTransaction.service';
import { BuildingService } from 'src/app/Shared/Services/building.service';
import { FloorService } from 'src/app/Shared/Services/floor.service';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { PMAssetTimeService } from 'src/app/Shared/Services/pmassettime.service';
import { RequestService } from 'src/app/Shared/Services/request.service';
import { RoomService } from 'src/app/Shared/Services/room.service';
import { WorkOrderService } from 'src/app/Shared/Services/work-order.service';
import { ExternalAssetMovementService } from 'src/app/Shared/Services/externalAssetMovement.service';

import { environment } from 'src/environments/environment';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { ListRequestVM } from 'src/app/Shared/Models/requestModeVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { DepericiationYears } from '../../member-excludes/assetdetail/assetdetail.component';
import { CreateExternalAssetMovementVM, ListExternalAssetMovementVM } from 'src/app/Shared/Models/externalAssetMovementVM';
import { CreateExternalAssetMovementAttachmentVM, ListExternalAssetMovementAttachmentVM } from '../../../Shared/Models/externalAssetMovementAttachment';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  lang = localStorage.getItem("lang");


  currentUser: LoggedUser;
  public isVisible: boolean = false;
  errorMessage: string;
  errorDisplay: boolean = false;
  applicationStatus: string = "";
  acceptLabel: string = "";
  rejectLabel: string = "";

  displayRequest: boolean = false;

  displayWorkOrder: boolean = false;
  createExternalAssetMovementAttachmentObj: CreateExternalAssetMovementAttachmentVM;
  lstCreateExternalAssetMovementFiles: CreateExternalAssetMovementAttachmentVM[] = [];
  itmIndex: any[] = [];


  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 10,
    lengthMenu: [10, 25, 50, 100, 'All'],
    order: [],
    info: false,
    paging: false,
    responsive: true,
    language: this.lang == 'ar' ?
      {
        "emptyTable": "ليست هناك بيانات متاحة في الجدول",
        "loadingRecords": "جارٍ التحميل...",
        "lengthMenu": "أظهر _MENU_ مدخلات",
        "zeroRecords": "لم يعثر على أية سجلات",
        "info": "إظهار _START_ إلى _END_ من أصل _TOTAL_ مدخل",
        "infoEmpty": "يعرض 0 إلى 0 من أصل 0 سجل",
        "infoFiltered": "(منتقاة من مجموع _MAX_ مُدخل)",
        "search": "ابحث:",
        "paginate": {
          "first": "الأول",
          "previous": "السابق",
          "next": "التالي",
          "last": "الأخير"
        },
        "aria": {
          "sortAscending": ": تفعيل لترتيب العمود تصاعدياً",
          "sortDescending": ": تفعيل لترتيب العمود تنازلياً"
        },
        "processing": "جارٍ المعالجة..."
      } : {
        "emptyTable": "No data available in table",
        "info": "Showing _START_ to _END_ of _TOTAL_ entries",
        "infoEmpty": "Showing 0 to 0 of 0 entries",
        "infoFiltered": "(filtered from _MAX_ total entries)",
        "lengthMenu": "Show _MENU_ entries",
        "loadingRecords": "Loading...",
        "processing": "Processing...",
        "search": "Search:",
        "zeroRecords": "No matching records found",
        "thousands": ",",
        "paginate": {
          "first": "First",
          "last": "Last",
          "next": "Next",
          "previous": "Previous"
        },
        "aria": {
          "sortAscending": ": activate to sort column ascending",
          "sortDescending": ": activate to sort column descending"
        },
      }
  };

  clickedItem: 'detail' | 'location' | 'status' | 'contract' | 'depreciation' | 'pm';
  assetObj: ViewAssetDetailVM;
  assetMovementObj: CreateAssetMovementVM;
  assetStatusObj: CreateAssetStatusTransactionVM;
  externalAssetMovementObj: CreateExternalAssetMovementVM;



  selectedObj: EditAssetMovementVM;
  lstMovements: ListAssetMovementVM[] = [];
  lstAssetStatus: ListAssetStatusVM[] = [];
  lstAssetStatusTansaction: ListAssetStatusTransactionVM[] = [];
  lstExternalMovements: ListExternalAssetMovementVM[] = [];
  lstBuildings: ListBuildingVM[] = [];
  lstFloors: ListFloorVM[] = [];
  lstRooms: ListRoomVM[] = [];

  lstShiftMovements: ShiftMovement[];
  assettasks: PmDateGroupVM[] = [];
  lstPMAssetTimes: ListPMAssetTimeVM[] = [];
  lstPMAssetTasks: ListPMAssetTaskVM[] = [];

  // lstSchedules: CreatePMAssetTaskScheduleVM[] = [];
  // scheduleObj: CreatePMAssetTaskScheduleVM;

  lstSchedules: CreatePMAssetTaskScheduleVM[] = [];
  scheduleObj: addPMAssetTaskScheduleVM;

  pmassetTaskSchedule: addPMAssetTaskScheduleVM[] = []
  isFound: boolean = false;

  checkedTask: [] = [];
  checkedTime: [] = [];
  lstYears: DepericiationYears[] = [];
  lstDocuments: ListExternalAssetMovementAttachmentVM[] = [];
  lstAttachment: AssetDetailAttachmentVM[] = [];
  Id: number;
  showDetails: boolean = true;
  showLocations: boolean = false;
  showAddLocations: boolean = false;
  showDepreciation: boolean = false;
  showStatus: boolean = false;
  showAddStatus: boolean = false;
  showPM: boolean = false;
  isExternal: boolean = false;
  isInternal: boolean = false;
  isShowFiles: boolean = false;
  assetDetailObj: ViewAssetDetailVM;
  lstRequests: ListRequestVM[] = [];
  master: number;
  display: boolean = false;
  public assetName: string = "";
  lstTasks: number[] = [];
  imgURL: string;

  taskForm: FormGroup;
  tskDates: FormArray;
  tsks: FormArray;
  selectedMovementItem: any;
  pmtaskItems: any[] = [];
  pmAssetDateObj: EditPMAssetTimeVM;
  totalAssetRequests: number;
  totalAssetWorkOrders: number;
  public hospitalName: string = "";
  direction: string = "";
  pageNumber: number;
  constructor(private assetDetailService: AssetDetailService,
    private requestService: RequestService, private location: Location,
    private workOrderService: WorkOrderService, private config: DynamicDialogConfig,
    private externalAssetMovementService: ExternalAssetMovementService,
    private assetMovementService: AssetMovementService, private authenticationService: AuthenticationService,
    private floorService: FloorService, private buildingService: BuildingService, private roomService: RoomService,
    private route: Router, private confirmationService: ConfirmationService,
    private assetStatusService: AssetStatusService, private assetStatusTransactionService: AssetStatusTransactionService,
    private masterAssetService: MasterAssetService, private datePipe: DatePipe, private fb: FormBuilder,
    private pmAssetTimeService: PMAssetTimeService, private uploadService: UploadFilesService,
    private activeRoute: ActivatedRoute) { this.currentUser = this.authenticationService.currentUserValue; }
  public elementType = NgxQrcodeElementTypes.CANVAS;
  public correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  public width = 90;


  ngOnInit(): void {
    if (localStorage.getItem("lang") == null) {
      this.lang == 'ar'
      this.direction = 'rtl';
    }
    else if (this.lang == 'en') {
      this.direction = 'ltr';
    } else if (this.lang == 'ar') {
      this.direction = 'rtl';
    }

    this.clickedItem = 'detail';
    this.assetObj = {
      governorateNameAr: '', cityNameAr: '', orgNameAr: '', subOrgNameAr: '', contractDate: '', contractEndDate: '', contractStartDate: '',
      brandNameAr: '', buildId: 0, floorId: 0, roomId: 0, masterAssetId: 0, barCode: '', hospitalId: 0, createdBy: '', remainWarrantyExpires: '', remainWarrantyExpiresAr: '', warrantyExpiresAr: '',
      id: 0, assetImg: '', code: '', masterCode: '', purchaseDate: '', price: '', serialNumber: '', remarks: '', periorityName: '', periorityNameAr: '',
      barcode: '', installationDate: '', warrantyExpires: '', room: '', floor: '', assetName: '', assetNameAr: '', supplierName: '',
      brandName: '', hospitalName: '', originName: '', originNameAr: '', categoryName: '', categoryNameAr: '', subCategoryName: '', governorateName: '', cityName: '', orgName: '', subOrgName: '',
      length: '', height: '', width: '', weight: '', modelNumber: '', versionNumber: '', description: '', descriptionAr: '', costCenter: '', depreciationRate: '',
      expectedLifeTime: '', warrantyEnd: '', warrantyStart: '', departmentName: '', departmentNameAr: '', hospitalNameAr: '', supplierNameAr: '',
      buildName: '', receivingDate: '', operationDate: '', poNumber: '', buildNameAr: '', floorName: '', floorNameAr: '', roomName: '', roomNameAr: '',
      assetStatus: '', assetStatusAr: '', qrFilePath: '', listRequests: [], listWorkOrders: [], strInstallationDate: '', strOperationDate: '', strPurchaseDate: '', inContract: '', inContractAr: '', contractFrom: '', contractTo: ''

    }
    this.assetDetailObj = { contractDate: '', contractEndDate: '', contractStartDate: '', governorateNameAr: '', cityNameAr: '', orgNameAr: '', subOrgNameAr: '', remainWarrantyExpiresAr: '', warrantyExpiresAr: '', remainWarrantyExpires: '', periorityName: '', periorityNameAr: '', categoryNameAr: '', createdBy: '', assetImg: '', assetName: '', assetNameAr: '', assetStatus: '', assetStatusAr: '', barCode: '', barcode: '', brandName: '', brandNameAr: '', buildId: 0, buildName: "", buildNameAr: '', categoryName: '', cityName: '', code: '', costCenter: "", departmentName: '', departmentNameAr: '', depreciationRate: '', description: '', descriptionAr: '', expectedLifeTime: '', floor: '', floorId: 0, floorName: '', floorNameAr: '', governorateName: '', height: '', hospitalId: 0, hospitalName: '', hospitalNameAr: '', id: 0, installationDate: '', length: '', listRequests: [], listWorkOrders: [], masterAssetId: 0, masterCode: '', modelNumber: '', operationDate: '', orgName: '', originName: '', originNameAr: '', poNumber: '', price: '', purchaseDate: '', qrFilePath: '', receivingDate: '', remarks: '', room: '', roomId: 0, roomName: '', roomNameAr: '', serialNumber: '', subCategoryName: '', subOrgName: '', supplierName: '', supplierNameAr: '', versionNumber: '', warrantyEnd: '', warrantyExpires: '', warrantyStart: '', weight: '', width: '', strInstallationDate: '', strOperationDate: '', strPurchaseDate: '', inContract: '', inContractAr: '', contractFrom: '', contractTo: '' }


    if (this.lang == "en")
      this.acceptLabel = "Yes";
    else
      this.acceptLabel = "نعم";

    if (this.lang == "en")
      this.rejectLabel = "No";
    else
      this.rejectLabel = "لا";


    const pageNumberStr = localStorage.getItem('pageNumber');
    this.pageNumber = pageNumberStr ? parseInt(pageNumberStr, 10) : 1;

    this.externalAssetMovementObj = {
      assetDetailId: 0, movementDate: '', hospitalName: '', notes: '',hospitalId:0
    }

    this.assetMovementObj = {
      assetDetailId: 0, buildingId: 0, floorId: 0, roomId: 0, movementDate: '', moveDesc: '', hospitalId: 0, roomName: '', roomNameAr: '', floorName: '', floorNameAr: '', buildingName: '', buildingNameAr: ''
    }
    this.assetStatusObj = { assetDetailId: 0, statusDate: '', assetStatusId: 0, hospitalId: 0 }

    this.scheduleObj = { id: 0, pmAssetTaskId: 0, pmAssetTimeId: 0, hospitalId: 0 }

    this.pmAssetDateObj = { id: 0, pmDate: new Date, assetDetailId: 0, hospitalId: 0 }
    this.createExternalAssetMovementAttachmentObj = { id: 0, fileName: '', externalAssetMovementId: 0, title: '', externalAssetMovementFile: File, hospitalId: 0 };

    if (this.config.data != null) {
      this.Id = this.config.data.id;
      this.master = this.Id;
    }
    else {
      let assetId = this.activeRoute.snapshot.params["id"];
      this.master = assetId;
    }

    this.assetStatusService.GetAssetStatus().subscribe(
      data => {
        this.lstAssetStatus = data;
      });

    this.assetDetailService.ViewAssetDetailByMasterId(this.master).subscribe(
      data => {
        this.assetObj = data;

        this.assetDetailService.GetAttachmentByAssetDetailId(this.assetObj.id).subscribe(
          (files => {
            this.lstAttachment = files;
          }), (error => console.log(error)));



        if (this.lang == "ar") {

          if (this.assetObj.contractDate != "") {
            let splitContractDate = this.assetObj.contractDate.split('/');
            let contractmonth = splitContractDate[0];
            let contractday = splitContractDate[1];
            let contractyear = splitContractDate[2];

            if (contractyear != "1900") {
              let newContractDate = Number(contractyear).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(contractmonth).toLocaleString("ar-SA") + "/" + Number(contractday).toLocaleString("ar-SA");
              this.assetObj.contractDate = newContractDate;
            }
            else {
              this.assetObj.contractDate = "";
            }
          }

          if (this.assetObj.contractStartDate != "") {
            let splitContractStartDate = this.assetObj.contractStartDate.split('/');
            let contractStartmonth = splitContractStartDate[0];
            let contractStartday = splitContractStartDate[1];
            let contractStartyear = splitContractStartDate[2];
            if (contractStartyear != "1900") {
              let newContractStartDate = Number(contractStartyear).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(contractStartmonth).toLocaleString("ar-SA") + "/" + Number(contractStartday).toLocaleString("ar-SA");
              this.assetObj.contractStartDate = newContractStartDate;
            }
            else {
              this.assetObj.contractStartDate = "";
            }
          }

          if (this.assetObj.contractEndDate != "") {
            let splitContractEndDate = this.assetObj.contractEndDate.split('/');
            let contractEndmonth = splitContractEndDate[0];
            let contractEndday = splitContractEndDate[1];
            let contractEndyear = splitContractEndDate[2];
            if (contractEndyear != "1900") {
              let newContractEndDate = Number(contractEndyear).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(contractEndmonth).toLocaleString("ar-SA") + "/" + Number(contractEndday).toLocaleString("ar-SA");
              this.assetObj.contractEndDate = newContractEndDate;
            }
            else {
              this.assetObj.contractEndDate = "";
            }
          }




          if (this.assetObj.operationDate != "") {
            let splitOperationDateDate = this.assetObj.operationDate.split('/');
            let month = splitOperationDateDate[0];
            let day = splitOperationDateDate[1];
            let year = splitOperationDateDate[2];
            let newOperationDate = Number(year).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(month).toLocaleString("ar-SA") + "/" + Number(day).toLocaleString("ar-SA");
            this.assetObj.operationDate = newOperationDate;
          }

          if (this.assetObj.purchaseDate != "") {
            let splitPurchaseDate = this.datePipe.transform(this.assetObj.purchaseDate, "MM/dd/yyyy").split('/');
            let pmonth = splitPurchaseDate[0];
            let pday = splitPurchaseDate[1];
            let pyear = splitPurchaseDate[2];
            let newPurchaseDate = Number(pyear).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(pmonth).toLocaleString("ar-SA") + "/" + Number(pday).toLocaleString("ar-SA");
            this.assetObj.purchaseDate = newPurchaseDate;
          }

          if (this.assetObj.receivingDate != "") {
            let splitReceiveDate = this.assetObj.receivingDate.split('/');
            let rmonth = splitReceiveDate[0];
            let rday = splitReceiveDate[1];
            let ryear = splitReceiveDate[2];
            let newReceiveDate = Number(ryear).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(rmonth).toLocaleString("ar-SA") + "/" + Number(rday).toLocaleString("ar-SA");
            this.assetObj.receivingDate = newReceiveDate;
          }

          if (this.assetObj.installationDate != "") {
            let splitInstallDate = this.assetObj.installationDate.split('/');
            let inmonth = splitInstallDate[0];
            let inday = splitInstallDate[1];
            let inyear = splitInstallDate[2];
            let newInstallDate = Number(inyear).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(inmonth).toLocaleString("ar-SA") + "/" + Number(inday).toLocaleString("ar-SA");
            this.assetObj.installationDate = newInstallDate;

          }


          if (this.assetObj.warrantyStart != "") {
            let warrantyStart = this.assetObj.warrantyStart.split('/');
            let wsmonth = warrantyStart[0];
            let wsday = warrantyStart[1];
            let wsyear = warrantyStart[2];
            if (wsyear != "1900") {
              let newWSDate = Number(wsyear).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(wsmonth).toLocaleString("ar-SA") + "/" + Number(wsday).toLocaleString("ar-SA");
              this.assetObj.warrantyStart = newWSDate;
            }
            else {
              this.assetObj.warrantyStart = "";
            }
          }
          if (this.assetObj.warrantyEnd != "") {
            let warrantyEnd = this.assetObj.warrantyEnd.split('/');
            let wemonth = warrantyEnd[0];
            let weday = warrantyEnd[1];
            let weyear = warrantyEnd[2];
            if (weyear != "1900") {
              let newWEDate = Number(weyear).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(wemonth).toLocaleString("ar-SA") + "/" + Number(weday).toLocaleString("ar-SA");
              this.assetObj.warrantyEnd = newWEDate;
            }
            else {
              this.assetObj.warrantyEnd = "";
            }
          }
        }


        this.applicationStatus = this.lang == "en" ? this.assetObj["assetStatus"] : this.assetObj["assetStatusAr"];
        this.Id = this.assetObj.id;
        this.requestService.GetTotalRequestForAssetInHospital(this.Id).subscribe(totalrequests => {
          this.totalAssetRequests = totalrequests;
        });


        this.workOrderService.GetTotalWorkOrdersForAssetInHospital(this.Id).subscribe(totalwo => {
          this.totalAssetWorkOrders = totalwo;
        })

        this.assetName = this.lang == "en" ? this.assetObj["assetName"] : this.assetObj["assetNameAr"];

        if (data["assetImg"] == "" || data["assetImg"] == null) {
          this.imgURL = `${environment.Domain}UploadedAttachments/MasterAssets/UploadMasterAssetImage/UnknownAsset.png`;
        }
        else {
          this.imgURL = `${environment.Domain}UploadedAttachments/MasterAssets/UploadMasterAssetImage/` + data["assetImg"];
        }

        if (this.lang == "en") {
          this.hospitalName = this.assetObj["hospitalName"] + " - ";
        }
        else {
          this.hospitalName = this.assetObj["hospitalNameAr"] + " - ";
        }



        this.masterAssetService.GetPMAssetTaskByMasterAssetId(Number(data["masterAssetId"])).subscribe(
          data => {
            this.lstPMAssetTasks = data;
            //   this.lstPMAssetTasks.forEach(t => this.tsksarray().push(this.fb.control(t.name)));
          });
      });
  }
  highlightMenu(item: 'detail' | 'location' | 'status' | 'contract' | 'depreciation' | 'pm') {
    if (item == "detail") {
      this.ngOnInit();
      this.showLocations = false;
      this.showAddLocations = false;
      this.showDepreciation = false;
      this.showStatus = false;
      this.showAddStatus = false;
      this.showDetails = true;
      this.showPM = false;
    }
    this.clickedItem = item;
  }
  openLocation() {
    this.showDetails = false;
    this.showAddLocations = false;
    this.showLocations = true;
    this.showStatus = false;
    this.showAddStatus = false;

    this.lstShiftMovements = [
      { id: 1, name: 'Outside Hospital', nameAr: 'خارج المستشفى' },
      { id: 2, name: 'Inside Hospital', nameAr: 'داخل المستشفى' }
    ];
    this.assetMovementService.GetMovementByAssetMovementId(this.Id).subscribe(movements => {
      this.lstMovements = movements;
    });

    this.externalAssetMovementService.GetExternalAssetMovementByAssetDetailId(this.Id).subscribe(lst => {
      this.lstExternalMovements = lst;
    });
  }
  addLocation() {
    this.showAddLocations = true;
    this.showDepreciation = false;
    this.showDetails = false;
    this.showLocations = true;
    this.isExternal = true;
    this.isInternal = false;
    if (this.selectedMovementItem == undefined) {
      this.selectedMovementItem = 1;

      this.externalAssetMovementService.GetExternalAssetMovementByAssetDetailId(this.Id).subscribe(lst => {
        this.lstExternalMovements = lst;
      });
    }


    if (this.selectedMovementItem == 2) {
      if (this.currentUser.hospitalId > 0) {
        this.buildingService.GetAllBuildingsByHospitalId(this.currentUser.hospitalId).subscribe(builds => {
          this.lstBuildings = builds;
        })
      }
      else {
        this.buildingService.GetBuildings().subscribe(builds => {
          this.lstBuildings = builds;
        })
      }
    }
  }
  onMovementItemChange($event) {
    this.selectedMovementItem = $event.value;
    if (this.selectedMovementItem == 1) {
      this.showAddLocations = true;
      this.isExternal = true;
      this.isInternal = false;

      this.externalAssetMovementService.GetExternalAssetMovementByAssetDetailId(this.Id).subscribe(lst => {
        this.lstExternalMovements = lst;
      });
    }
    if (this.selectedMovementItem == 2) {
      this.showAddLocations = true;
      this.isExternal = false;
      this.isInternal = true;

      this.assetMovementService.GetMovementByAssetMovementId(this.Id).subscribe(movements => {
        this.lstMovements = movements;
      });
    }
  }
  openStatus() {
    this.showDetails = false;
    this.showLocations = false;
    this.showAddLocations = false;
    this.showDepreciation = false;
    this.showStatus = true;
    this.showAddStatus = true;
    this.lstAssetStatusTansaction = [];


    const options: Intl.DateTimeFormatOptions = { month: "numeric", day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    this.assetStatusTransactionService.GetStatusTransactionByAssetDetailId(this.Id).subscribe(
      data => {
        if (this.lang == "ar") {
          data.forEach(element => {
            var date = new Intl.DateTimeFormat("ar-EG", options).format(new Date(element.statusDate));
            element.statusDate = date;
            this.lstAssetStatusTansaction.push(element);

          });
        }
        else {
          data.forEach(element => {

            element.statusDate = this.datePipe.transform(element.statusDate, "dd/MM/yyyy");
            this.lstAssetStatusTansaction.push(element);

          });
        }
      });

  }
  addStatus() {
    this.showLocations = false;
    this.showAddLocations = false;
    this.showDepreciation = false;
    this.showStatus = true;
    this.showAddStatus = true;
    this.showDetails = false;
  }
  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    this.createExternalAssetMovementAttachmentObj.fileName = fileToUpload.name;
    this.createExternalAssetMovementAttachmentObj.externalAssetMovementFile = fileToUpload;
    this.createExternalAssetMovementAttachmentObj.hospitalId = this.currentUser.hospitalId;
    this.addFilesToList();
  };
  addFilesToList() {

    if (this.itmIndex.length === 0) {
      last_element = 1;
    }
    else if (this.itmIndex.length > 0) {
      var last_element = this.itmIndex[this.itmIndex.length - 1];
      last_element = last_element + 1;
    }
    this.itmIndex.push(last_element);

    let ext = this.createExternalAssetMovementAttachmentObj.fileName.split('.').pop();
    var hCode = this.pad(this.currentUser.hospitalCode, 4);
    // var srCode = this.pad(this.reqObj.requestCode, 10);
    var last = this.itmIndex[this.itmIndex.length - 1];
    let newIndex = this.pad((last).toString(), 2);
    let SRFileName = hCode + "AssetMove" + newIndex;
    this.createExternalAssetMovementAttachmentObj.fileName = SRFileName + "." + ext;

    this.lstCreateExternalAssetMovementFiles.push(this.createExternalAssetMovementAttachmentObj);
    this.createExternalAssetMovementAttachmentObj = { id: 0, fileName: '', externalAssetMovementId: 0, title: '', externalAssetMovementFile: File, hospitalId: 0 };


  }
  removeFileFromObjectArray(doc) {
    const index: number = this.lstCreateExternalAssetMovementFiles.indexOf(doc);
    if (index !== -1) {
      this.lstCreateExternalAssetMovementFiles.splice(index, 1);
    }
  }
  pad(num: string, size: number): string {
    while (num.length < size) num = "0" + num;
    return num;
  }
  downloadExternalAssetMovementFile(fileName) {
    var filePath = `${environment.Domain}UploadedAttachments/`;
    this.uploadService.downloadExternalAssetMovementFile(fileName).subscribe(file => {
      var dwnldFile = filePath + 'ExternalAssetMovements/' + fileName;
      if (fileName != "" || fileName != null) {
        window.open(dwnldFile);
      }
    })
  }
  getDocuments(externalAssetMovementId: number) {
    this.externalAssetMovementService.GetExternalMovementAttachmentByExternalAssetMovementId(externalAssetMovementId).subscribe(lstdocs => {
      this.lstDocuments = lstdocs;
    });
    this.isShowFiles = true;
  }
  addExternalLocation() {
    this.externalAssetMovementObj.assetDetailId = this.Id;
    this.externalAssetMovementService.CreateExternalAssetMovement(this.externalAssetMovementObj).subscribe(assetMoveId => {

      this.display = true;

      var assetStatusTrans = new CreateAssetStatusTransactionVM();
      assetStatusTrans.assetDetailId = this.Id;
      assetStatusTrans.statusDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
      assetStatusTrans.hospitalId = this.currentUser.hospitalId;
      assetStatusTrans.assetStatusId = 7;

      this.assetStatusTransactionService.CreateAssetStatusTransaction(assetStatusTrans).subscribe(item => { });

      if (this.lstCreateExternalAssetMovementFiles.length > 0) {
        this.lstCreateExternalAssetMovementFiles.forEach((item, index) => {
          item.externalAssetMovementId = Number(assetMoveId);

          this.externalAssetMovementService.CreatetExternalAssetMovementAttachment(item).subscribe(fileObj => {
            this.uploadService.uploadExternalAssetMovementFiles(item.externalAssetMovementFile, item.fileName).subscribe(
              (event) => {
                this.display = true;
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
        this.lstCreateExternalAssetMovementFiles = [];
        this.display = true;
      }
      else {
        this.display = true;
      }

      this.externalAssetMovementService.GetExternalAssetMovementByAssetDetailId(this.Id).subscribe(lst => {
        this.lstExternalMovements = lst;
      });

    });


  }
  onLocationSubmit() {
    if (this.assetMovementObj.buildingId == 0) {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select building";
      }
      else {
        this.errorMessage = "اختر مبنى";
      }
      return false;
    }
    if (this.assetMovementObj.floorId == 0) {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select floor ";
      }
      else {
        this.errorMessage = "اختر دور";
      }
      return false;
    }
    if (this.assetMovementObj.roomId == 0) {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select room";
      }
      else {
        this.errorMessage = "اختر غرفة";
      }
      return false;
    }
    if (this.assetMovementObj.movementDate == "" || this.assetMovementObj.movementDate == null) {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select date";
      }
      else {
        this.errorMessage = "من فضلك اختر تاريخ";
      }
      return false;
    }
    else {
      this.assetMovementObj.assetDetailId = this.Id;
      this.assetMovementObj.hospitalId = this.currentUser.hospitalId;
      this.assetMovementService.CreateAssetMovement(this.assetMovementObj).subscribe(() => {
        this.display = true;
        let currentUrl = this.route.url;
        this.route.routeReuseStrategy.shouldReuseRoute = () => false;
        this.route.onSameUrlNavigation = 'reload';
        this.route.navigate([currentUrl]);
      }, (error) => {
        this.errorDisplay = true;

        if (this.lang == 'en') {
          if (error.error.status == 'same') {
            this.errorMessage = error.error.message;
          }
        } if (this.lang == 'ar') {
          if (error.error.status == 'same') {
            this.errorMessage = error.error.messageAr;
          }
        }
        return false;
      });
    }
  }
  getFloorsByBuildId($event) {
    let buildId = $event.target.value;
    this.floorService.GetFloorsByBuildingId(buildId).subscribe(floors => {
      this.lstFloors = floors;
    })
  }
  getRoomsByfloorId($event) {
    let floorId = $event.target.value;
    this.roomService.GetRoomsByFloorId(floorId).subscribe(rooms => {
      this.lstRooms = rooms;
    })
  }
  openPM() {
    this.showLocations = false;
    this.showAddLocations = false;
    this.showDepreciation = false;
    this.showStatus = false;
    this.showAddStatus = false;
    this.showDetails = false;
    this.showPM = true;



    this.isVisible = true;
    this.assetDetailService.GetAllwithgrouping(this.Id).subscribe(data => {
      this.assettasks = data;
      if (this.assettasks.length == 0) {
        this.isVisible = false;
      }
      else {
        this.isVisible = true;
      }
    })


  }
  setPMAssetTask(tsk, $event) {
    //  this.lstTasks = [];
    this.lstTasks[tsk] = $event.target.checked;
    let isChecked = $event.target.checked;

    if (isChecked == true) {
      if (!this.lstTasks.includes($event.target.value)) {
        this.lstTasks.push($event.target.value);
      }
    }
    if (isChecked == false) {
      var index = this.lstSchedules.indexOf($event.target.value);
      this.lstTasks.splice(index, 1);
    }


  }
  addTimeTasks(pmDate: string, id: number) {
    this.lstSchedules = new Array();
    let timeTaskObj = new CreatePMAssetTaskScheduleVM();
    timeTaskObj.lstSelectedTasks = new Array;
    var date = this.datePipe.transform(pmDate, "MM-dd-yyyy");
    timeTaskObj.lstSelectedTasks = this.lstTasks;
    timeTaskObj.pmDate = date;
    timeTaskObj.taskId = id;
    timeTaskObj.hospitalId = this.assetObj.hospitalId;
    this.lstSchedules.push(timeTaskObj);
  }
  changePMDate(id: number) {
    this.pmAssetTimeService.GetPMAssetTimeById(id).subscribe(pmObj => {

      this.pmAssetDateObj.id = id;
      this.pmAssetDateObj.assetDetailId = this.master;
      if (this.currentUser.hospitalId == 0) {
        this.pmAssetDateObj.hospitalId = this.assetObj.hospitalId;
      }
      else {
        this.scheduleObj.hospitalId = this.currentUser.hospitalId;
      }
      this.pmAssetTimeService.UpdatePMAssetTime(this.pmAssetDateObj).subscribe(updatedId => {
      });

    })
  }
  addToList($event, taskId: number, timeId: number) {
    this.scheduleObj = { id: 0, pmAssetTaskId: 0, pmAssetTimeId: 0, hospitalId: 0 }
    this.scheduleObj.pmAssetTaskId = taskId;
    this.scheduleObj.pmAssetTimeId = timeId;
    this.scheduleObj.hospitalId = this.currentUser.hospitalId;



    if ($event.checked == false) {
      var index = this.pmassetTaskSchedule.indexOf($event.value);
      this.pmassetTaskSchedule.splice(index, 1);
    }
    else {
      if (this.pmassetTaskSchedule.length > 0) {
        this.pmassetTaskSchedule.forEach(element => {
          if ((element.pmAssetTimeId == this.scheduleObj.pmAssetTimeId)
            && (element.pmAssetTaskId == this.scheduleObj.pmAssetTaskId)) {
            this.isFound = true;
          }
        });
        if (!this.isFound) {
          this.pmassetTaskSchedule.push(this.scheduleObj)
        }
        this.isFound = false;
      }
      else {
        this.pmassetTaskSchedule.push(this.scheduleObj)
      }
    }


  }
  ontasksSubmit() {
    this.pmassetTaskSchedule.forEach(el => {
      this.assetDetailService.addTaskSchedule(el).subscribe(data => {
      },
        error => {
          this.errorDisplay = true;
          if (this.lang == 'en') {
            if (error.error.status == 'pmtime') {
              this.pmAssetTimeService.GetPMAssetTimeById(el.pmAssetTimeId).subscribe(x => {
                this.assetDetailService.GetAssetById(x.assetDetailId).subscribe(y => {
                  this.masterAssetService.GetPMAssetTaskByMasterAssetId(y.masterAssetId).subscribe(
                    data => {
                      data.forEach(item => {
                        if (item.id == el.pmAssetTaskId) {
                          let date = this.datePipe.transform(x.pmDate, "dd-MM-yyyy");
                          this.errorMessage = item.name + "  In  " + date + error.error.message;
                        }
                      });
                    });
                })
              });
            }
          }
          if (this.lang == 'ar') {
            if (error.error.status == 'pmtime') {

              this.pmAssetTimeService.GetPMAssetTimeById(el.pmAssetTimeId).subscribe(x => {
                this.assetDetailService.GetAssetById(x.assetDetailId).subscribe(y => {
                  this.masterAssetService.GetPMAssetTaskByMasterAssetId(y.masterAssetId).subscribe(
                    data => {
                      data.forEach(item => {
                        if (item.id == el.pmAssetTaskId) {
                          let date = this.datePipe.transform(x.pmDate, "dd-MM-yyyy");
                          this.errorMessage = item.nameAr + "  في  " + date + error.error.messageAr;
                        }
                      });
                    });
                })
              });
            }
          }
          return false;
        });
    });
  }
  onStatusSubmit() {
    if (this.assetStatusObj.statusDate == "" || this.assetStatusObj.statusDate == null) {
      if (this.lang == "en") {
        alert("Please select date");
      }
      else {
        alert("من فضلك اختر تاريخ");
      }
      return false;
    }
    else {

      this.assetStatusObj.assetDetailId = this.Id;
      this.assetStatusObj.hospitalId = this.currentUser.hospitalId;
      this.assetStatusObj.statusDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.assetStatusTransactionService.CreateAssetStatusTransaction(this.assetStatusObj).subscribe(() => {
        this.display = true;
        let currentUrl = this.route.url;
        this.route.routeReuseStrategy.shouldReuseRoute = () => false;
        this.route.onSameUrlNavigation = 'reload';
        this.route.navigate([currentUrl]);
      });
    }
  }
  getStatusId($event) {
    this.assetStatusObj.assetStatusId = $event.target.value;
  }
  deleteMovement(id: number) {
    this.lstMovements.forEach((element) => {
      if (element.id == id) {
        let movedate = this.datePipe.transform(element["movementDate"], "dd-MM-yyyy");
        if (this.lang == "en") {

          this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this item   ' + element["buildingName"] + ' , ' + element["floorName"] + ' ,  ' + element["roomName"] + ' on ' + movedate + ' ?',
            header: 'Delete Item Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.assetMovementService.DeleteAssetMovement(id).subscribe(result => {
                this.showLocations = true;
                this.showAddLocations = true;
                this.showDetails = false;
                let currentUrl = this.route.url;
                this.route.routeReuseStrategy.shouldReuseRoute = () => false;
                this.route.onSameUrlNavigation = 'reload';
                this.route.navigate([currentUrl]);
              });
            },
            reject: () => {
              this.confirmationService.close();
              this.ngOnDestroy();
              this.ngOnInit();
            }
          });
        }
        if (this.lang == "ar") {
          this.confirmationService.confirm({
            message: ' هل أنت متأكد من مسح هذا العنصر ؟ ' + element["buildingNameAr"] + ' , ' + element["floorNameAr"] + ' ,  ' + element["roomNameAr"] + ' في تاريخ ' + movedate + ' ?',
            header: 'تأكيد المسح',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.assetMovementService.DeleteAssetMovement(id).subscribe(result => {
                this.showLocations = true;
                this.showAddLocations = true;
                this.showDetails = false;
                let currentUrl = this.route.url;
                this.route.routeReuseStrategy.shouldReuseRoute = () => false;
                this.route.onSameUrlNavigation = 'reload';
                this.route.navigate([currentUrl]);
              });
            },
            reject: () => {
              this.confirmationService.close();
              this.ngOnDestroy();
              this.ngOnInit();
            }
          });
        }

      }
    })

  }
  deleteStatus(id: number) {
    this.lstAssetStatusTansaction.forEach((element) => {
      if (element.id == id) {
        //    let statdate = this.datePipe.transform(element["statusDate"], "dd-MM-yyyy");

        if (this.lang == "en") {
          this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this item ' + element["statusName"] + ' on ' + element["statusDate"] + ' ?',
            header: 'Delete Item Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.assetStatusTransactionService.DeleteAssetStatusTransaction(id).subscribe(result => {
                let currentUrl = this.route.url;
                this.route.routeReuseStrategy.shouldReuseRoute = () => false;
                this.route.onSameUrlNavigation = 'reload';
                this.route.navigate([currentUrl]);
              });
            },
            reject: () => {
              this.confirmationService.close();
              this.ngOnDestroy();
              this.ngOnInit();
            }
          });
        }

        if (this.lang == "ar") {
          this.confirmationService.confirm({
            message: 'هل أنت متأكد من مسح هذا العنصر ' + element["statusNameAr"] + ' في تاريخ ' + element["statusDate"] + ' ?',
            header: 'تأكيد المسح',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.assetStatusTransactionService.DeleteAssetStatusTransaction(id).subscribe(result => {
                let currentUrl = this.route.url;
                this.route.routeReuseStrategy.shouldReuseRoute = () => false;
                this.route.onSameUrlNavigation = 'reload';
                this.route.navigate([currentUrl]);
              });
            },
            reject: () => {
              this.confirmationService.close();
              this.ngOnDestroy();
              this.ngOnInit();
            }
          });
        }
      }
    });
  }
  openDepreciation() {
    this.lstYears = [];
    this.showDepreciation = true;



    this.assetDetailService.ViewAssetDetailByMasterId(this.master).subscribe(
      data => {
        this.assetObj = data;
        let installDate = new Date(this.assetObj.installationDate);

        var max = new Date().getFullYear(),
          min = installDate.getFullYear(),
          max = max;

        const price = Number(this.assetObj.price);
        const deppercent = Number(this.assetObj.depreciationRate);

        let amount_left = price;
        let annual_depreciation = 0;

        let addYears = new DepericiationYears();
        addYears.year = min;
        addYears.amount = price;


        this.lstYears.push(addYears);
        for (let index = min + 1; index < max; index++) {
          annual_depreciation = (deppercent * amount_left) / 100;
          amount_left = amount_left - annual_depreciation;

          let addYears = new DepericiationYears();
          addYears.year = index;
          addYears.amount = amount_left;
          this.lstYears.push(addYears);
        }
      });
    this.showLocations = false;
    this.showAddLocations = false;
    this.showStatus = false;
    this.showAddStatus = false;
    this.showDetails = false;
    this.showPM = false;
  }
  getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL;
  }
  download() {
    var x = 0;
    var y = 0;
    const qrcode = document.getElementById('qrcode');
    let doc = new jsPDF();
    let imageData = this.getBase64Image(qrcode.firstChild.firstChild);
    doc.addImage(imageData, "JPG", 10, 10, 50, 50);
    doc.save('Asset_' + this.assetObj.id + '.pdf');
  }

  downloadFile(fileName) {
    var filePath = `${environment.Domain}UploadedAttachments/`;

    this.uploadService.downloadAssetDetailFile(fileName).subscribe(file => {
      var dwnldFile = filePath + 'AssetDetails/' + fileName;
      if (fileName != "" || fileName != null)
        window.open(dwnldFile);
    });
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    $.fn['dataTable'].ext.search.pop();
  }
  displayRequestsInDialog() {
    this.displayRequest = true;
    this.assetDetailService.GetAssetHistoryById(this.assetObj.id).subscribe(assetObj => {
      this.assetDetailObj = assetObj;
    });
  }

  goBack(): void {
    localStorage.getItem('pageNumber');
    this.location.back();
  }
}

export class ShiftMovement {
  id: number;
  name: string;
  nameAr: string;
}