import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ViewAssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { CreateAssetMovementVM, EditAssetMovementVM, ListAssetMovementVM } from 'src/app/Shared/Models/assetMovementVM';
import { CreateAssetStatusTransactionVM, ListAssetStatusTransactionVM } from 'src/app/Shared/Models/assetStatusTransactionVM';
import { ListAssetStatusVM } from 'src/app/Shared/Models/assetStatusVM';
import { ListBuildingVM } from 'src/app/Shared/Models/buildingVM';
import { ListFloorVM } from 'src/app/Shared/Models/floorVM';
import { EditPMAssetTimeVM } from 'src/app/Shared/Models/pmAssetTimeVM';
import { ListRoomVM } from 'src/app/Shared/Models/roomVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { AssetMovementService } from 'src/app/Shared/Services/assetMovement.service';
import { AssetStatusService } from 'src/app/Shared/Services/assetStatus.service';
import { AssetStatusTransactionService } from 'src/app/Shared/Services/assetStatusTransaction.service';
import { BuildingService } from 'src/app/Shared/Services/building.service';
import { FloorService } from 'src/app/Shared/Services/floor.service';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { RequestService } from 'src/app/Shared/Services/request.service';
import { RoomService } from 'src/app/Shared/Services/room.service';
import { WorkOrderService } from 'src/app/Shared/Services/work-order.service';
import { environment } from 'src/environments/environment';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { ListRequestVM } from 'src/app/Shared/Models/requestModeVM';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-assetdetail',
  templateUrl: './assetdetail.component.html',
  styleUrls: ['./assetdetail.component.css']
})
export class AssetdetailComponent implements OnInit {

  lang = localStorage.getItem("lang");

  currentUser: LoggedUser;
  public isVisible: boolean = false;
  errorMessage: string;
  errorDisplay: boolean = false;
  applicationStatus: string = "";
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

  clickedItem: 'detail' | 'location' | 'status' | 'contract' | 'depreciation' | 'pm' | 'servicerequest';
  assetObj: ViewAssetDetailVM;
  assetMovementObj: CreateAssetMovementVM;
  assetStatusObj: CreateAssetStatusTransactionVM;

  selectedObj: EditAssetMovementVM;
  lstMovements: ListAssetMovementVM[] = [];
  lstAssetStatus: ListAssetStatusVM[] = [];
  lstAssetStatusTansaction: ListAssetStatusTransactionVM[] = [];

  lstBuildings: ListBuildingVM[] = [];
  lstRequests: ListRequestVM[] = [];
  lstFloors: ListFloorVM[] = [];
  lstRooms: ListRoomVM[] = [];


  isFound: boolean = false;



  Id: number;
  showDetails: boolean = true;
  showLocations: boolean = false;
  showAddLocations: boolean = false;
  showDepreciation: boolean = false;
  showStatus: boolean = false;
  showAddStatus: boolean = false;
  showServiceRequest: boolean = false;
  master: number;
  display: boolean = false;
  public assetName: string = "";
  lstTasks: number[] = [];
  imgURL: string;

  // lstYears: string[] = [];
  pmAssetDateObj: EditPMAssetTimeVM;
  totalAssetRequests: number;
  totalAssetWorkOrders: number;
  public hospitalName: string = "";
  lstYears: DepericiationYears[] = [];
  constructor(private assetDetailService: AssetDetailService,
    private requestService: RequestService,
    private workOrderService: WorkOrderService,
    private assetMovementService: AssetMovementService, private authenticationService: AuthenticationService,
    private floorService: FloorService,
    private buildingService: BuildingService,
    private roomService: RoomService,
    private assetStatusService: AssetStatusService,
    private assetStatusTransactionService: AssetStatusTransactionService,
    private masterAssetService: MasterAssetService,
    private datePipe: DatePipe,
    private activeRoute: ActivatedRoute) { this.currentUser = this.authenticationService.currentUserValue; }
  public elementType = NgxQrcodeElementTypes.CANVAS;
  public correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  public width = 90;


  ngOnInit(): void {
    this.clickedItem = 'detail';
    this.assetObj = {
      governorateNameAr: '', cityNameAr: '', orgNameAr: '', subOrgNameAr: '', contractDate: '', contractEndDate: '', contractStartDate: '',
      categoryNameAr: '', periorityName: '', periorityNameAr: '', remainWarrantyExpires: '', remainWarrantyExpiresAr: '', warrantyExpiresAr: '',
      brandNameAr: '', buildId: 0, floorId: 0, roomId: 0, masterAssetId: 0, barCode: '', hospitalId: 0, listRequests: [], listWorkOrders: [],
      id: 0, assetImg: '', code: '', masterCode: '', purchaseDate: '', price: '', serialNumber: '', remarks: '', createdBy: '',
      barcode: '', installationDate: '', warrantyExpires: '', room: '', floor: '', assetName: '', assetNameAr: '', supplierName: '',
      brandName: '', hospitalName: '', originName: '', originNameAr: '', categoryName: '', subCategoryName: '', governorateName: '', cityName: '', orgName: '', subOrgName: '',
      length: '', height: '', width: '', weight: '', modelNumber: '', versionNumber: '', description: '', descriptionAr: '', costCenter: '', depreciationRate: '',
      expectedLifeTime: '', warrantyEnd: '', warrantyStart: '', departmentName: '', departmentNameAr: '', hospitalNameAr: '', supplierNameAr: '',
      buildName: '', receivingDate: '', operationDate: '', poNumber: '', buildNameAr: '', floorName: '', floorNameAr: '', roomName: '', roomNameAr: '',
      assetStatus: '', assetStatusAr: '', qrFilePath: '', strInstallationDate: '', strOperationDate: '', strPurchaseDate: '', inContract: '', inContractAr: '', contractFrom: '', contractTo: ''

    }


    this.assetMovementObj = {
      assetDetailId: 0, buildingId: 0, floorId: 0, roomId: 0, hospitalId: 0, movementDate: '', moveDesc: '', roomName: '', roomNameAr: '', floorName: '', floorNameAr: '', buildingName: '', buildingNameAr: ''
    }
    this.assetStatusObj = { assetDetailId: 0, statusDate: '', assetStatusId: 0, hospitalId: 0 }


    this.pmAssetDateObj = { id: 0, pmDate: new Date, assetDetailId: 0, hospitalId: 0 }
    let assetId = this.activeRoute.snapshot.params["id"];
    this.master = assetId;


    this.assetStatusService.GetAssetStatus().subscribe(
      data => {
        this.lstAssetStatus = data;
      });

    this.assetDetailService.ViewAssetDetailByMasterId(assetId).subscribe(
      data => {
        this.assetObj = data;
        this.applicationStatus = this.lang == "en" ? this.assetObj["assetStatus"] : this.assetObj["assetStatusAr"];
        this.Id = this.assetObj.id;
        this.requestService.GetTotalRequestForAssetInHospital(this.Id).subscribe(totalrequests => {
          this.totalAssetRequests = totalrequests;
        });


        this.workOrderService.GetTotalWorkOrdersForAssetInHospital(this.Id).subscribe(totalwo => {
          this.totalAssetWorkOrders = totalwo;
        })

        this.assetName = this.assetObj["assetName"];

        if (data["assetImg"] == "" || data["assetImg"] == null) {
          this.imgURL = "../../../../assets/images/asset-tracking.png";
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


      });
  }
  highlightMenu(item: 'detail' | 'location' | 'status' | 'contract' | 'depreciation' | 'pm' | 'servicerequest') {
    if (item == "detail") {
      this.ngOnInit();
      this.showLocations = false;
      this.showAddLocations = false;
      this.showDepreciation = false;
      this.showStatus = false;
      this.showAddStatus = false;
      this.showServiceRequest = false;
      this.showDetails = true;


    }
    this.clickedItem = item;
  }
  openLocation() {
    this.showDetails = false;
    this.showAddLocations = false;
    this.showLocations = true;
    this.showStatus = false;
    this.showAddStatus = false;
    this.showServiceRequest = false;
    this.assetMovementService.GetMovementByAssetMovementId(this.Id).subscribe(movements => {
      this.lstMovements = movements;
    });
  }
  addLocation() {
    this.showAddLocations = true;
    this.showDepreciation = false;
    this.showDetails = false;
    this.showServiceRequest = false;
    this.showLocations = true;

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
  openStatus() {
    this.showDetails = false;
    this.showLocations = false;
    this.showAddLocations = false;
    this.showDepreciation = false;
    this.showServiceRequest = false;
    this.showStatus = true;
    this.showAddStatus = false;
    this.assetStatusTransactionService.GetStatusTransactionByAssetDetailId(this.Id).subscribe(
      data => {
        this.lstAssetStatusTansaction = data;
      });

  }
  addStatus() {
    this.showLocations = false;
    this.showAddLocations = false;
    this.showDepreciation = false;
    this.showStatus = true;
    this.showAddStatus = true;
    this.showDetails = false;
    this.showServiceRequest = false;
  }
  openDepreciation() {

    this.showDepreciation = true;
    let installDate = new Date(this.assetObj.installationDate);
    var max = new Date().getFullYear(),
      min = installDate.getFullYear(),
      max = max;

    const price = Number(this.assetObj.price);
    const deppercent = Number(this.assetObj.depreciationRate);
    // const years = max - min;// max;

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
      //  addYears.amount = amount_left;

      addYears.amount = Number((Math.round(amount_left * 100) / 100).toFixed(2));


      this.lstYears.push(addYears);
    }

    this.showLocations = false;
    this.showAddLocations = false;
    this.showStatus = false;
    this.showAddStatus = false;
    this.showDetails = false;
    this.showServiceRequest = false;
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
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    $.fn['dataTable'].ext.search.pop();
  }
  openServiceRequest() {
    this.showLocations = false;
    this.showAddLocations = false;
    this.showDepreciation = false;
    this.showStatus = false;
    this.showAddStatus = false;
    this.showDetails = false;
    this.showServiceRequest = true;

    this.requestService.GetOldRequestsByHospitalAssetId(this.Id).subscribe(lstRequests => {
      this.lstRequests = lstRequests;
    });
  }
}



export class DepericiationYears {
  year: number;
  amount: number;
}