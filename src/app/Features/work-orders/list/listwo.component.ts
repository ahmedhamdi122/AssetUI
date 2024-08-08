import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { ListWorkOrderStatusVM } from 'src/app/Shared/Models/WorkOrderStatusVM';
import { ExportWorkOrderVM, IndexWorkOrderVM, ListWorkOrderVM, PrintPDFWorkOrderVM, PrintWorkOrderVM, SearchWorkOrderVM, SortAndFilterWorkOrderVM } from 'src/app/Shared/Models/WorkOrderVM';
import { WorkOrderStatusService } from 'src/app/Shared/Services/work-order-status.service';
import { WorkOrderService } from 'src/app/Shared/Services/work-order.service';
import { ViewComponent } from '../../requests/view/view.component';
import { AddwotrackstatusComponent } from '../addwotrackstatus/addwotrackstatus.component';
import { CreateWOComponent } from '../create/createwo.component';
import { EditComponent } from '../edit/edit.component';
import { ViewWorkorderComponent } from '../view-workorder/view-workorder.component';
import { fontAmiri } from '../../../../assets/fonts/Amiri-Regular.js'
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { Paging } from 'src/app/Shared/Models/paging';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { AssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { CityService } from 'src/app/Shared/Services/city.service';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { WorkOrderPeriorityService } from 'src/app/Shared/Services/work-order-periority.service';
import { IndexWorkOrderPeriorityVM } from 'src/app/Shared/Models/WorkOrderPeriorityVM';
import { WorkOrderTrackingService } from 'src/app/Shared/Services/work-order-tracking.service';
import { CreateWorkOrderTrackingVM } from 'src/app/Shared/Models/WorkOrderTrackingVM';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { ListMasterAssetVM } from 'src/app/Shared/Models/MasterAssetVM';
import { ListDepartmentVM } from 'src/app/Shared/Models/departmentVM';
import { DepartmentService } from 'src/app/Shared/Services/department.service';
import { environment } from 'src/environments/environment';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { CreateRequestTracking } from 'src/app/Shared/Models/RequestTrackingVM';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as jsPDF from 'jspdf';
import 'jspdf-autotable';
import { DetailsComponent } from '../../hospital-assets/details/details.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
@Component({
  selector: 'app-listwo',
  templateUrl: './listwo.component.html',
  styleUrls: ['./listwo.component.css']
})
export class ListWOComponent implements OnInit {

  lang = localStorage.getItem("lang");

  errorMessage: string = "";
  errorDisplay: boolean = false;
  display: boolean = false;
  printWorkOrderObj: PrintWorkOrderVM;
  page: Paging;
  lstWorkOrders: ListWorkOrderVM[] = [];
  woStatusObj: ListWorkOrderStatusVM;
  createRequestTrackingObj: CreateRequestTracking;

  lstWorkOrderPeriority: IndexWorkOrderPeriorityVM[] = [];
  lstStatuses: ListWorkOrderStatusVM[] = [];
  currentUser: LoggedUser;
  isAssetOwner: boolean = false;
  isEng: boolean = false;
  isEngManager: boolean = false;
  lstRoleNames: string[] = [];
  count: number;

  searchObj: SearchWorkOrderVM;
  public show: boolean = false;
  lstGovernorates: ListGovernorateVM[];
  lstCities: ListCityVM[];
  lstOrganizations: ListOrganizationVM[];
  lstSubOrganizations: ListSubOrganizationVM[];
  lstHospitals: ListHospitalVM[] = [];
  lstHospitalAssets: ListMasterAssetVM[] = [];
  lstassetDetails: AssetDetailVM[] = [];
  lstMasterAssets: ListMasterAssetVM[] = [];


  woTrackObj: CreateWorkOrderTrackingVM;
  statusId: number = 0;
  hospitalId: number = 0;
  isGov: boolean = false;
  isCity: boolean = false;
  isOrg: boolean = false;
  isSubOrg: boolean = false;
  isHospital: boolean = false;

  startMessage: string = "";
  startDisplay: boolean = false;
  displayWOIcons: boolean = false;
  sortStatus: string = "ascending";
  elementType = "img";
  startDateTime: Date;
  startStamp: number;
  newDate: Date = new Date();
  newStamp = this.newDate.getTime();
  timer;

  cols: any[];
  _selectedColumns: any[];
  columnsSelected: string = "";
  loading: boolean = true;

  lstassetDetailBarcodes: AssetDetailVM[] = [];
  lstAssetSerailNumberObj: AssetDetailVM[] = [];
  assetSerailNumberObj: AssetDetailVM;
  assetBarCodeObj: AssetDetailVM;
  lstWOIds: number[] = [];
  checked: boolean = false;


  lstCheckedWorkOrdersPDF: ExportWorkOrderVM[] = [];
  exportCheckedWO: ExportWorkOrderVM;



  printWO: PrintPDFWorkOrderVM;
  lstCheckedWorkOrders: IndexWorkOrderVM[] = [];

  checkedWorkOrderObj: IndexWorkOrderVM;



  lstExportWorkOrdersToExcel: ListWorkOrderVM[] = [];
  lstDepartments: ListDepartmentVM[] = [];
  checkedWorkOrder: IndexWorkOrderVM;
  first = 0;
  displayWOObj: boolean = false;
  printedBy: string = "";

  thisYear: number;
  lastYear: number;
  nextYear: number;
  isValidDate: boolean = false;
  error: any = { isError: false, errorMessage: '' };

  sortFilterObjects: SortAndFilterWorkOrderVM;
  constructor(private authenticationService: AuthenticationService, private workOrderService: WorkOrderService, private assetDetailService: AssetDetailService, private masterAssetService: MasterAssetService, private governorateService: GovernorateService, private cityService: CityService,
    private workOrderPeriorityService: WorkOrderPeriorityService, private organizationService: OrganizationService, private subOrganizationService: SubOrganizationService, private hospitalService: HospitalService, private workOrderStatusService: WorkOrderStatusService, private workOrderTrackingService: WorkOrderTrackingService,
    private departmentService: DepartmentService, private uploadService: UploadFilesService, private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute,private ngxService: NgxUiLoaderService,
    private confirmationService: ConfirmationService, private route: Router, private datePipe: DatePipe, public dialogService: DialogService, private cdr: ChangeDetectorRef) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }
  set selectedColumns(val: any[]) {
    this._selectedColumns = this.cols.filter(col => val.includes(col));
  }
  ngOnInit(): void {

    this.thisYear = (new Date().getFullYear());
    this.lastYear = (new Date().getFullYear()) - 1;
    this.nextYear = (new Date().getFullYear()) + 1;

    this.createRequestTrackingObj = { strDescriptionDate: '', id: 0, createdById: "", description: '', descriptionDate: new Date(), requestId: 0, requestStatusId: 0, hospitalId: 0 }


    this.onLoad();
    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });
      this.isAssetOwner = (['AssetOwner'].some(r => this.lstRoleNames.includes(r)));
      this.isEng = (['Eng'].some(r => this.lstRoleNames.includes(r)));
      this.isEngManager = (['EngDepManager'].some(r => this.lstRoleNames.includes(r)));
    }

    const translationKeys = ['Asset.Maintainance', 'Asset.WorkOrders'];
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);

    this.onLoadByLogIn();
  }
  onLoad() {
    this.page = { pagenumber: 1, pagesize: 10 }
    this.printWO = { hospitalName: '', hospitalNameAr: '', lang: '', printedBy: '' }
    this.printWorkOrderObj = {
      creationDate1: '', brandName: '', brandNameAr: '', lastWorkOrder: '', firstRequest: '', closedDate: '', assetBarCode: '', modelNumber: "", masterAssetCode: '', assetCode: '', id: 0, lstWorkOrderTracking: [], assetName: '', assetNameAr: '', assetSerial: '', createdBy: '', creationDate: new Date, hospitalName: '', hospitalNameAr: '', note: '',
      periorityName: '', periorityNameAr: '', plannedEndDate: new Date, plannedStartDate: new Date, requestSubject: '', subject: '', typeName: '', typeNameAr: '', workOrderNumber: '', barCode: ''
    }
    this.woTrackObj = {
      workOrderId: 0, createdById: '', notes: '', workOrderDate: new Date, workOrderStatusId: 0, id: 0,
      actualEndDate: '', actualStartDate: '', creationDate: '', assignedTo: '', plannedEndDate: '', plannedStartDate: '',
      hospitalId: 0, strWorkOrderDate: ''
    }
    this.sortFilterObjects = {
      searchObj: {
        departmentId: 0, woNumber: '', statusId: 0, modeId: 0, userId: '', cityId: 0, governorateId: 0, hospitalId: 0, modelNumber: '', requestSubject: '',
        organizationId: 0, subOrganizationId: 0, assetDetailId: 0, subject: '', start: '', end: '', masterAssetId: 0, barCode: '', serialNumber: ''
      },
      sortObj: {
        assetName: '', assetNameAr: '', modelNumber: '', serialNumber: '', elapsedTime: '', closedDate: '', strSerial: '', strSubject: '', strRequestSubject: '',
        barCode: '', createdBy: '', note: '', creationDate: '', requestSubject: '', subject: '', statusNameAr: '', statusName: '', workOrderNumber: '', sortStatus: '',
        strWorkOrderNumber: '', periorityId: 0, statusId: 0, strBarCode: '', strModel: '', masterAssetId: 0, sortBy: ''
      }

    }

    this.checkedWorkOrderObj = {
      departmentId: 0, workOrderNumber: '', cityId: 0, governorateId: 0, hospitalId: 0, modelNumber: '', requestSubject: '',      organizationId: 0, subOrganizationId: 0, subject: '', masterAssetId: 0, barCode: '', serialNumber: '',
      actualEndDate: new Date(), actualStartDate: new Date(), assetName: '', assetNameAr: '', brandName: '', brandNameAr: '', buildingName: '',
      buildingNameAr: '', closedDate: new Date(), costCenter: '', createdBy: '', createdById: '', creationDate: new Date(), departmentName: '', departmentNameAr: '',
      depreciationRate: '', floorName: '', floorNameAr: '', hospitalName: '', hospitalNameAr: '', id: 0, installationDate: '', lang: '', listTracks: [], note: '', operationDate: '',
      periorityName: '', periorityNameAr: '', plannedEndDate: new Date(), plannedStartDate: new Date(), poNumber: '', price: '', printedBy: '', purchaseDate: '', receivingDate: '', remarks: '',
      requestId: 0, requestNumber: '', roomName: '', roomNameAr: '', statusName: '', statusNameAr: '', supplierName: '', supplierNameAr: '', typeName: '', typeNameAr: '', userName: '', warrantyEnd: '',
      warrantyExpires: '', warrantyStart: '', workOrderPeriorityId: 0, workOrderPeriorityName: '', workOrderPeriorityNameAr: '', workOrderStatusId: 0, workOrderSubject: '', workOrderTrackingId: 0, workOrderTypeId: 0
      , workOrderTypeName: '', workOrderTypeNameAr: '',brandId:0
    }
    this.woStatusObj = { id: 0, code: '', color: '', icon: '', name: '', nameAr: '', countAssigned: 0, countClosed: 0, countDone: 0, countEscalate: 0, countExternalSupport: 0, countInProgress: 0, countPending: 0, countReAssigned: 0, countReview: 0, countSparePart: 0, countTechApprove: 0, countUserApprove: 0, countAll: 0, listStatus: [] }
    this.governorateService.GetGovernorates().subscribe(items => {
      this.lstGovernorates = items;
    });

    this.exportCheckedWO = {
      id: 0, subject: '', workOrderNumber: '', barCode: '', creationDate: new Date, closedDate: new Date, plannedStartDate: new Date, plannedEndDate: new Date, actualStartDate: new Date, actualEndDate: new Date, note: '', createdById: '', createdBy: '', workOrderPeriorityId: 0, workOrderPeriorityName: '', workOrderPeriorityNameAr: '', workOrderTypeId: 0, workOrderTypeName: '', requestId: 0, requestSubject: '', requestNumber: '', workOrderSubject: '', workOrderTrackingId: 0,
      workOrderStatusId: 0, masterAssetId: 0, hospitalId: 0, periorityName: '', periorityNameAr: '', typeName: '', typeNameAr: '', governorateId: 0, cityId: 0, subOrganizationId: 0, organizationId: 0, assetName: '', assetNameAr: '', statusNameAr: '', statusName: '', brandNameAr: '', brandName: '', departmentNameAr: '', departmentName: '', supplierNameAr: '', supplierName: '',
      modelNumber: '', serialNumber: '', workOrderTypeNameAr: '', listTracks: [], warrantyStart: '', warrantyEnd: '', warrantyExpires: '', purchaseDate: '', installationDate: '', operationDate: '', receivingDate: '', buildingName: '', buildingNameAr: '', floorName: '', floorNameAr: '', roomName: '', roomNameAr: '', depreciationRate: '', poNumber: '', costCenter: '', price: '', remarks: '', lang: '',
      printedBy: '', hospitalName: '', hospitalNameAr: '',
    }

    this.workOrderStatusService.GetWorkOrderStatuss().subscribe(statuses => {
      this.lstStatuses = statuses;
    });

    this.organizationService.GetOrganizations().subscribe(items => {
      this.lstOrganizations = items;
    });


    this.workOrderStatusService.GetWorkOrderStatusByUserId(this.currentUser.id).subscribe(statuses => {
      this.woStatusObj = statuses;
    });

    this.workOrderPeriorityService.GetWorkOrderPerioritys().subscribe((res) => {
      this.lstWorkOrderPeriority = res;
    });

    this.departmentService.GetDepartments().subscribe(items => {
      this.lstDepartments = items;
    });


    if (this.lang == "en") {
      this.columnsSelected = "Columns Selected";
      this.cols = [
        { field: 'elapsedTime', header: 'Time' },
        { field: 'assetName', header: 'AssetName' },
        { field: 'barCode', header: 'BarCode' },
        { field: 'serialNumber', header: 'Serial' },
        { field: 'modelNumber', header: 'Model' },
        { field: 'workOrderNumber', header: 'Number' },
        { field: 'statusName', header: 'Status' },
        { field: 'subject', header: 'Subject' },
        { field: 'requestSubject', header: 'Ticket' },
        { field: 'createdBy', header: 'CreatedBy' },
        { field: 'creationDate', header: 'Date' },
        { field: 'closedDate', header: 'Close Date' },
        { field: 'note', header: 'Notes' }
      ];

    }
    else if (this.lang == "ar") {
      this.columnsSelected = "الأعمدة المختارة";
      this.cols = [
        { field: 'elapsedTime', header: 'الوقت', display: true },
        { field: 'assetNameAr', header: 'اسم الأصل', display: true },
        { field: 'barCode', header: 'الباركود', display: true },
        { field: 'serialNumber', header: 'السيريال', display: true },
        { field: 'modelNumber', header: 'الموديل', display: false },
        { field: 'workOrderNumber', header: 'رقم أمر الشغل', display: true },
        { field: 'statusNameAr', header: 'الحالة', display: false },
        { field: 'subject', header: 'الموضوع', display: true },
        { field: 'requestSubject', header: 'بلاغ عن عطل', display: false },
        { field: 'createdBy', header: 'انشأ من قبل', display: false },
        { field: 'creationDate', header: 'التاريخ', display: true },
        { field: 'closedDate', header: 'تاريخ الإغلاق', display: true },
        { field: 'note', header: 'ملاحظات', display: false }
      ];
    }
    this._selectedColumns = this.cols;
  }
  onLoadByLogIn() {
    if (this.currentUser.hospitalId > 0 && this.currentUser.organizationId > 0 && this.currentUser.subOrganizationId > 0) {
      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
        if (this.currentUser.organizationId > 0) {
          this.sortFilterObjects.searchObj.organizationId = this.currentUser.organizationId;
          this.isOrg = true;
          this.subOrganizationService.GetSubOrganizationByOrgId(this.currentUser.organizationId).subscribe(suborgs => {
            this.lstSubOrganizations = suborgs;

            if (this.currentUser.subOrganizationId > 0) {
              this.sortFilterObjects.searchObj.subOrganizationId = this.currentUser.subOrganizationId;
              this.isSubOrg = true;

              this.hospitalService.GetHospitalsBySubOrganizationId(this.currentUser.organizationId).subscribe(hosts => {
                this.lstHospitals = hosts;
                this.sortFilterObjects.searchObj.hospitalId = this.currentUser.hospitalId;
                this.isHospital = true;
              });
            }
          });
        }
      });
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
      });
      this.hospitalService.GetHospitalById(this.currentUser.hospitalId).subscribe(hospitalObj => {
        this.sortFilterObjects.searchObj.governorateId = hospitalObj.governorateId;
        this.isGov = true;
        this.cityService.GetCitiesByGovernorateId(this.sortFilterObjects.searchObj.governorateId).subscribe((cities) => {
          this.lstCities = cities;
        });
        this.sortFilterObjects.searchObj.cityId = hospitalObj.cityId;
        this.isCity = true;
      });
    }
    else if (this.currentUser.hospitalId > 0 && this.currentUser.governorateId > 0 && this.currentUser.cityId > 0) {
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
        if (this.currentUser.governorateId > 0) {
          this.sortFilterObjects.searchObj.governorateId = this.currentUser.governorateId;
          this.isGov = true;
          this.cityService.GetCitiesByGovernorateId(this.currentUser.governorateId).subscribe(cities => {
            this.lstCities = cities;
            if (this.currentUser.cityId > 0) {
              this.sortFilterObjects.searchObj.cityId = this.currentUser.cityId;
              this.isCity = true;
              this.hospitalService.GetHospitalsByCityId(this.currentUser.cityId).subscribe(hosts => {
                this.lstHospitals = hosts;
                this.isHospital = true;
                this.sortFilterObjects.searchObj.hospitalId = this.currentUser.hospitalId;

              });
            }
          });
        }
      });
      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
        this.hospitalService.GetHospitalById(this.currentUser.hospitalId).subscribe(hospitalObj => {
          this.sortFilterObjects.searchObj.organizationId = hospitalObj.organizationId;
          this.isOrg = true;
          this.subOrganizationService.GetSubOrganizationByOrgId(this.sortFilterObjects.searchObj.organizationId).subscribe((subs) => {
            this.lstSubOrganizations = subs;
          });
          this.sortFilterObjects.searchObj.subOrganizationId = hospitalObj.subOrganizationId;
          this.isSubOrg = true;
        });
      });
      this.cdr.detectChanges();
    }
    else if (this.currentUser.governorateId > 0 && this.currentUser.cityId == 0 && this.currentUser.hospitalId == 0) {
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
        if (this.currentUser.governorateId > 0) {
          this.sortFilterObjects.searchObj.governorateId = this.currentUser.governorateId;
          this.isGov = true;
          this.cityService.GetCitiesByGovernorateId(this.currentUser.governorateId).subscribe(cities => {
            this.lstCities = cities;
          });
        }
      });
      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
      });
    }
    else if (this.currentUser.governorateId > 0 && this.currentUser.cityId > 0 && this.currentUser.hospitalId == 0) {
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
        if (this.currentUser.governorateId > 0) {
          this.sortFilterObjects.searchObj.governorateId = this.currentUser.governorateId;
          this.isGov = true;
          this.cityService.GetCitiesByGovernorateId(this.currentUser.governorateId).subscribe(cities => {
            this.lstCities = cities;
            this.sortFilterObjects.searchObj.cityId = this.currentUser.cityId;
            this.isCity = true;
          });
        }
      });
      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
      });
    }
    else if (this.currentUser.hospitalId == 0 && this.currentUser.organizationId > 0 && this.currentUser.subOrganizationId == 0) {
      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
        if (this.currentUser.organizationId > 0) {
          this.sortFilterObjects.searchObj.organizationId = this.currentUser.organizationId;
          this.isOrg = true;
          this.subOrganizationService.GetSubOrganizationByOrgId(this.currentUser.organizationId).subscribe(suborgs => {
            this.lstSubOrganizations = suborgs;

            if (this.currentUser.subOrganizationId > 0) {
              this.sortFilterObjects.searchObj.subOrganizationId = this.currentUser.subOrganizationId;
            }
          });
        }
      });
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
      });
    }
    else if (this.currentUser.hospitalId == 0 && this.currentUser.organizationId > 0 && this.currentUser.subOrganizationId > 0) {

      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
        if (this.currentUser.organizationId > 0) {
          this.sortFilterObjects.searchObj.organizationId = this.currentUser.organizationId;
          this.isOrg = true;
          this.subOrganizationService.GetSubOrganizationByOrgId(this.currentUser.organizationId).subscribe(suborgs => {
            this.lstSubOrganizations = suborgs;

            if (this.currentUser.subOrganizationId > 0) {
              this.sortFilterObjects.searchObj.subOrganizationId = this.currentUser.subOrganizationId;
              this.isSubOrg = true;

              this.hospitalService.GetHospitalsBySubOrganizationId(this.currentUser.subOrganizationId).subscribe(hosts => {
                this.lstHospitals = hosts;
                this.sortFilterObjects.searchObj.hospitalId = this.currentUser.hospitalId;
              });
            }
          });
        }
      });

      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
      });

    }
    else if (this.currentUser.hospitalId == 0 && this.currentUser.organizationId == 0 && this.currentUser.subOrganizationId == 0 && this.currentUser.governorateId == 0 && this.currentUser.cityId == 0) {
      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
      });
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
      });

    }
  }
  getCitiesByGovId(govId: number) {
    this.cityService.GetCitiesByGovernorateId(govId).subscribe(cities => {
      this.lstCities = cities;
    });
      this.hospitalService.getHospitalByGovId(govId).subscribe(hosts => {
        this.lstHospitals = hosts;
      });
  }
  getHospitalsBySubOrgId() {
    let governorateId = this.sortFilterObjects.searchObj.governorateId;
    let cityId = this.sortFilterObjects.searchObj.cityId;
    let orgId = this.sortFilterObjects.searchObj.organizationId;
    let subOrgId = this.sortFilterObjects.searchObj.subOrganizationId;
      this.hospitalService.GetHospitalsByGovCityOrgSubOrgId(governorateId, cityId,orgId,subOrgId).subscribe(hosts => {
        this.lstHospitals = hosts;
      });
  }
  getSubOrgByOrgId($event) {
    this.subOrganizationService.GetSubOrganizationByOrgId($event.target.value).subscribe(suborgs => {
      this.lstSubOrganizations = suborgs;
    });


    let governorateId = this.sortFilterObjects.searchObj.governorateId;
    let cityId = this.sortFilterObjects.searchObj.cityId;
    let orgId = this.sortFilterObjects.searchObj.organizationId;
    let subOrgId = this.sortFilterObjects.searchObj.subOrganizationId;
      this.hospitalService.GetHospitalsByGovCityOrgSubOrgId(governorateId, cityId,$event.target.value,subOrgId).subscribe(hosts => {
        this.lstHospitals = hosts;
      });
  }
  onSearch() {
    this.page.pagenumber = 1;
    this.lstWorkOrders = [];

    this.validateDates(this.sortFilterObjects.searchObj.start, this.sortFilterObjects.searchObj.end);
    if (!this.isValidDate) {
      this.errorDisplay = true;
      this.errorMessage = this.error.errorMessage;
      return false;
    }
    else {
      this.page.pagenumber = 1;
      this.errorDisplay = false;
      this.sortFilterObjects.searchObj.userId = this.currentUser.id;
      this.sortFilterObjects.searchObj.statusId = this.statusId;
      this.workOrderService.ListWorkOrders(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe(workorders => {
        workorders.results.forEach(element => {
          if (element.workOrderStatusId < 12 && (element.workOrderStatusId != 0)) {
            this.timer = window.setInterval(() => {
              this.startStamp = new Date(element.creationDate).getTime();
              this.newDate = new Date();
              this.newStamp = this.newDate.getTime();
              var diff = Math.round((this.newStamp - this.startStamp) / 1000);
              var d = Math.floor(diff / (24 * 60 * 60));
              diff = diff - (d * 24 * 60 * 60);
              var h = Math.floor(diff / (60 * 60));
              diff = diff - (h * 60 * 60);
              var m = Math.floor(diff / (60));
              diff = diff - (m * 60);
              var s = diff;

              if (this.lang == "en")
                element.elapsedTime = d + " day(s), " + h + ":" + m + ":" + s + "";
              else
                element.elapsedTime = (d).toLocaleString("ar-SA") + " يوم و  " + (s).toLocaleString("ar-SA") + ":" + (m).toLocaleString("ar-SA") + ":" + (h).toLocaleString("ar-SA") + "";

            }, 1000);
          }
          else if (element.workOrderStatusId == 12) {
            var firstItem = element.firstTrackDate;
            var lastItem = element.creationDate;
            this.startStamp = new Date(firstItem).getTime();
            this.newDate = new Date(lastItem);
            this.newStamp = this.newDate.getTime();
            var diff2 = Math.round((this.newStamp - this.startStamp) / 1000);
            var d2 = Math.floor(diff2 / (24 * 60 * 60));
            diff2 = diff2 - (d2 * 24 * 60 * 60);
            var h2 = Math.floor(diff2 / (60 * 60));
            diff2 = diff2 - (h2 * 60 * 60);
            var m2 = Math.floor(diff2 / (60));
            diff2 = diff2 - (m2 * 60);
            var s2 = diff2;
            if (this.lang == "en")
              element.elapsedTime = d2 + " day(s), " + h2 + ":" + m2 + ":" + s2 + "";
            else
              element.elapsedTime = (d2).toLocaleString("ar-SA") + " يوم و  " + ":" + (m2).toLocaleString("ar-SA") + ":" + (h2).toLocaleString("ar-SA") + "";
          }
          this.lstWorkOrders.push(element);

        });
        this.count = workorders.count;
        this.loading = false;
      });


      this.workOrderService.ListWorkOrders(this.sortFilterObjects, 0, 0).subscribe(exportWO => {
        this.lstExportWorkOrdersToExcel = exportWO.results;
      });

    }
  }
  getAssetsByHospitalId($event) {
    // if (this.currentUser.hospitalId == 0 && this.currentUser.organizationId == 0 && this.currentUser.subOrganizationId == 0 && this.currentUser.governorateId == 0 && this.currentUser.cityId == 0) {
    //   this.masterAssetService.ListMasterAssetsByHospitalId($event.target.value).subscribe(assets => {
    //     this.lstHospitalAssets = assets;
    //   });
    // }
    // else if (this.currentUser.hospitalId != 0) {
    //   this.masterAssetService.ListMasterAssetsByHospitalUserId(this.currentUser.hospitalId, this.currentUser.id).subscribe(assets => {
    //     this.lstHospitalAssets = assets;
    //   });
    // }
    // else {
    //   this.masterAssetService.ListMasterAssetsByHospitalUserId($event.target.value, this.currentUser.id).subscribe(assets => {
    //     this.lstHospitalAssets = assets;
    //   });
    // }
  }
  editWorkOrder(id: number) {
    const dialogRef2 = this.dialogService.open(EditComponent, {
      data: {
        id: id,
        statusId: this.statusId
      },
      width: '60%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl",
        "font-family": "sans-serif",
        "font-size": 40
      }
    });

    dialogRef2.onClose.subscribe((statusId: number) => {
      this.reload();
    });
  }
  deleteWorkOrder(id: number) {
    this.lstWorkOrders.forEach((element) => {
      if (element.id == id) {

        if (this.lang == "en") {

          this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this item   ' + element["subject"] + ' ?',
            header: 'Delete Item Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.workOrderService.DeleteWorkOrder(id).subscribe(deleted => {
                let currentUrl = this.route.url;
                this.route.routeReuseStrategy.shouldReuseRoute = () => false;
                this.route.onSameUrlNavigation = 'reload';
                this.route.navigate([currentUrl]);
              },
                error => {
                  this.errorDisplay = true;
                  if (this.lang == 'en') {
                    if (error.error.status == 'workorder') {
                      this.errorMessage = error.error.message;
                    }
                  } if (this.lang == 'ar') {
                    if (error.error.status == 'workorder') {
                      this.errorMessage = error.error.messageAr;
                    }
                  }
                  return false;
                });
            },
            reject: () => {
              this.confirmationService.close();
              this.reload();
            }
          });
        }
        if (this.lang == "ar") {
          this.confirmationService.confirm({
            message: ' هل أنت متأكد من مسح هذا العنصر ؟ ' + element["subject"] + ' ?',
            header: 'تأكيد المسح',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {

              this.workOrderService.DeleteWorkOrder(id).subscribe(deleted => {
                let currentUrl = this.route.url;
                this.route.routeReuseStrategy.shouldReuseRoute = () => false;
                this.route.onSameUrlNavigation = 'reload';
                this.route.navigate([currentUrl]);
              },
                error => {
                  this.errorDisplay = true;
                  if (this.lang == 'en') {
                    if (error.error.status == 'workorder') {
                      this.errorMessage = error.error.message;
                    }
                  } if (this.lang == 'ar') {
                    if (error.error.status == 'workorder') {
                      this.errorMessage = error.error.messageAr;
                    }
                  }
                  return false;
                });
            },
            reject: () => {
              this.confirmationService.close();
              this.reload();
            }
          });
        }

      }
    });
  }
  addWorkOrder() {
    const dialogRef2 = this.dialogService.open(CreateWOComponent, {
      width: '60%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl",
        "font-family": "sans-serif",
        "font-size": 40
      }
    });
    dialogRef2.onClose.subscribe((res) => {
      this.reload();
    });
  }
  viewWorkOrder(id: number) {
    const dialogRef2 = this.dialogService.open(ViewWorkorderComponent, {
      header: this.lang == "en" ? "View Work Order" : "بيان أمر الشغل",
      data: {
        id: id,
        statusId: this.statusId
      },
      width: '70%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl",
        "font-family": "sans-serif",
        "font-size": 40
      }
    });
    dialogRef2.onClose.subscribe((statusId: number) => {

    });
  }
  gotoViewRequest(requestId: number) {
    const dialogRef2 = this.dialogService.open(ViewComponent, {
      header: this.lang == "en" ? "View Ticket" : "بيان بلاغ العطل",
      data: {
        id: requestId
      },
      width: '75%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl",
        "font-family": "sans-serif",
        "font-size": 40
      }
    });
    dialogRef2.onClose.subscribe((res) => {

      this.reload();
    });
  }
  getWOByStatusId(id: number, $event) {
    this.statusId = id;
    this.lstWorkOrders = [];
    this.page.pagenumber = 1;
    this.sortFilterObjects.searchObj.statusId = id;
    this.sortFilterObjects.searchObj.userId = this.currentUser.id;
    this.workOrderService.ListWorkOrders(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe(workorders => {
      this.lstWorkOrders = [];

      workorders.results.forEach(element => {
        if (element.workOrderStatusId < 12 && (element.workOrderStatusId != 0)) {
          this.timer = window.setInterval(() => {
            this.startStamp = new Date(element.creationDate).getTime();
            this.newDate = new Date();
            this.newStamp = this.newDate.getTime();
            var diff = Math.round((this.newStamp - this.startStamp) / 1000);
            var d = Math.floor(diff / (24 * 60 * 60));
            diff = diff - (d * 24 * 60 * 60);
            var h = Math.floor(diff / (60 * 60));
            diff = diff - (h * 60 * 60);
            var m = Math.floor(diff / (60));
            diff = diff - (m * 60);
            var s = diff;

            if (this.lang == "en")
              element.elapsedTime = d + " day(s), " + h + ":" + m + ":" + s + "";
            else
              element.elapsedTime = (d).toLocaleString("ar-SA") + " يوم و  " + (s).toLocaleString("ar-SA") + ":" + (m).toLocaleString("ar-SA") + ":" + (h).toLocaleString("ar-SA") + "";

          }, 1000);
        }
        else if (element.workOrderStatusId == 12) {
          var firstItem = element.firstTrackDate;
          var lastItem = element.creationDate;
          this.startStamp = new Date(firstItem).getTime();
          this.newDate = new Date(lastItem);
          this.newStamp = this.newDate.getTime();
          var diff2 = Math.round((this.newStamp - this.startStamp) / 1000);
          var d2 = Math.floor(diff2 / (24 * 60 * 60));
          diff2 = diff2 - (d2 * 24 * 60 * 60);
          var h2 = Math.floor(diff2 / (60 * 60));
          diff2 = diff2 - (h2 * 60 * 60);
          var m2 = Math.floor(diff2 / (60));
          diff2 = diff2 - (m2 * 60);
          var s2 = diff2;
          if (this.lang == "en")
            element.elapsedTime = d2 + " day(s), " + h2 + ":" + m2 + ":" + s2 + "";
          else
            element.elapsedTime = (d2).toLocaleString("ar-SA") + " يوم و  " + ":" + (m2).toLocaleString("ar-SA") + ":" + (h2).toLocaleString("ar-SA") + "";
        }
        this.lstWorkOrders.push(element);

      });
      this.count = workorders.count;
      this.loading = false;
    });



    this.workOrderService.ListWorkOrders(this.sortFilterObjects, 0, 0).subscribe(exportWO => {
      this.lstExportWorkOrdersToExcel = exportWO.results;
    });

  }

  viewDetail(id: number) {
    const dialogRef2 = this.dialogService.open(DetailsComponent, {
      header: this.lang == "en" ? "Asset Details" : "بيانات الأصل",
      data: {
        id: id
      },
      width: '90%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl",
        "font-family": "sans-serif",
        "font-size": 40
      }
    });

    dialogRef2.onClose.subscribe((res) => {
      // this.reload();
    });

  }
  clicktbl(event) {
    this.lstWorkOrders = [];
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;


    if (this.currentUser.hospitalId > 0)
      this.sortFilterObjects.searchObj.hospitalId = this.currentUser.hospitalId;
    if (this.sortFilterObjects.searchObj.hospitalId > 0)
      this.sortFilterObjects.searchObj.hospitalId = this.sortFilterObjects.searchObj.hospitalId;



    this.sortFilterObjects.searchObj.userId = this.currentUser.id;
    this.sortFilterObjects.searchObj.statusId = this.statusId;
    this.workOrderService.ListWorkOrders(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe(workorders => {

      workorders.results.forEach(element => {
        if (element.workOrderStatusId < 12 && (element.workOrderStatusId != 0)) {
          this.timer = window.setInterval(() => {
            this.startStamp = new Date(element.creationDate).getTime();
            this.newDate = new Date();
            this.newStamp = this.newDate.getTime();
            var diff = Math.round((this.newStamp - this.startStamp) / 1000);
            var d = Math.floor(diff / (24 * 60 * 60));
            diff = diff - (d * 24 * 60 * 60);
            var h = Math.floor(diff / (60 * 60));
            diff = diff - (h * 60 * 60);
            var m = Math.floor(diff / (60));
            diff = diff - (m * 60);
            var s = diff;

            if (this.lang == "en")
              element.elapsedTime = d + " day(s), " + h + ":" + m + ":" + s + "";
            else
              element.elapsedTime = (d).toLocaleString("ar-SA") + " يوم و  " + (s).toLocaleString("ar-SA") + ":" + (m).toLocaleString("ar-SA") + ":" + (h).toLocaleString("ar-SA") + "";

          }, 1000);
        }
        else if (element.workOrderStatusId == 12) {
          var firstItem = element.firstTrackDate;
          var lastItem = element.creationDate;
          this.startStamp = new Date(firstItem).getTime();
          this.newDate = new Date(lastItem);
          this.newStamp = this.newDate.getTime();
          var diff2 = Math.round((this.newStamp - this.startStamp) / 1000);
          var d2 = Math.floor(diff2 / (24 * 60 * 60));
          diff2 = diff2 - (d2 * 24 * 60 * 60);
          var h2 = Math.floor(diff2 / (60 * 60));
          diff2 = diff2 - (h2 * 60 * 60);
          var m2 = Math.floor(diff2 / (60));
          diff2 = diff2 - (m2 * 60);
          var s2 = diff2;
          if (this.lang == "en")
            element.elapsedTime = d2 + " day(s), " + h2 + ":" + m2 + ":" + s2 + "";
          else
            element.elapsedTime = (d2).toLocaleString("ar-SA") + " يوم و  " + ":" + (m2).toLocaleString("ar-SA") + ":" + (h2).toLocaleString("ar-SA") + "";
        }
        this.lstWorkOrders.push(element);

      });
      this.count = workorders.count;
      this.loading = false;
    });
  }
  woDone(id: number) {
    const dialogRef2 = this.dialogService.open(AddwotrackstatusComponent, {
      data: {
        workOrderId: id,
        statusId: 7
      },
      width: '60%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl",
        "font-family": "sans-serif",
        "font-size": 40
      }
    });
    dialogRef2.onClose.subscribe((res) => {

      this.reload();
    });

  }


  woSparePart(id: number) {

    const dialogRef2 = this.dialogService.open(AddwotrackstatusComponent, {
      header: this.lang == "en" ? 'Note' : "ملاحظات",
      data: {
        workOrderId: id,
        statusId: 2
      },
      width: '60%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl",
        "font-family": "sans-serif",
        "font-size": 40
      }
    });
    dialogRef2.onClose.subscribe((res) => {
      this.reload();
    });



  }


  startWO(id: number) {
    this.workOrderTrackingService.GetFirstTrackForWorkOrderByWorkOrderId(id).subscribe(woObj => {

      this.woTrackObj.assignedTo = woObj["assignedTo"];
      this.woTrackObj.strWorkOrderDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.woTrackObj.creationDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.woTrackObj.actualStartDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.woTrackObj.actualEndDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");;
      this.woTrackObj.createdById = this.currentUser.id;
      this.woTrackObj.hospitalId = this.currentUser.hospitalId;
      if (this.lang == "en")
        this.woTrackObj.notes = "Work Order Started";
      else {
        this.woTrackObj.notes = "بدء أمر الشغل";
      }
      this.woTrackObj.workOrderId = id;
      this.woTrackObj.workOrderStatusId = 2;
      this.workOrderTrackingService.AddWorkOrderTracking(this.woTrackObj).subscribe(saved => {
        this.startDisplay = true;
        if (this.lang == "en")
          this.startMessage = "This Work Order Started";
        else {
          this.startMessage = "أمر الشغل بدأ";
        }
        this.displayWOIcons = true;
        this.reload();

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
    });
  }
  reload() {

    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }
  ViewAllAssetDetailByMasterId($event) {
    if (this.currentUser.hospitalId != 0) {
      this.assetDetailService.GetAssetNameByMasterAssetIdAndHospitalId($event.target.value, this.currentUser.hospitalId).subscribe(
        res => {
          this.lstassetDetails = res
        });
    }
    else {
      this.assetDetailService.GetAssetNameByMasterAssetIdAndHospitalId($event.target.value, this.sortFilterObjects.searchObj.hospitalId).subscribe(
        res => {
          this.lstassetDetails = res
        });
    }
  }
  printWorkOrder(id: number) {

    var doc = new jsPDF('p', "mm", "a4");
    const pageCount = doc.internal.getNumberOfPages();


    var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

    const options: Intl.DateTimeFormatOptions = { month: "long", day: 'numeric', year: 'numeric' };

    this.workOrderService.PrintWorkOrderById(id).subscribe(woObj => {
      this.printWorkOrderObj = woObj;



      if (this.lang == "en") {

        doc.addFileToVFS('Amiri-Regular', fontAmiri);
        doc.addFont('Amiri-Regular', 'Amiri-Regular', 'normal');
        doc.setFont('Amiri-Regular');

        doc.setFontSize(10);
        var img = new Image();
        img.src = '../../assets/images/' + this.currentUser.strLogo;
        doc.addImage(img, 'PNG', 10, 20, 30, 30);
        var svg = document.getElementById("barcode_" + id);
        let barcodeClass = svg.getElementsByClassName("barcode");
        let barcodeImageSrc = barcodeClass[0].children[0].getAttribute('src');
        var barcodeimg = new Image();
        barcodeimg.src = barcodeImageSrc;
        barcodeimg.width = 100;
        barcodeimg.height = 20;
        doc.addImage(barcodeimg, 'png', 240, 15, 50, 30);
        doc.setFontSize(18);
        doc.text(this.printWorkOrderObj.hospitalName + " Hospital - WorkOrder", 50, 30, { "align": "left" });
        doc.setFontSize(16);

        var title = "Asset Name : " + this.printWorkOrderObj.assetNameAr;
        doc.text(title, pageWidth / 2, 40, { align: 'center' });
        var serial = "Serial Number    : " + this.printWorkOrderObj.serialNumber;
        doc.text(serial, pageWidth / 2, 50, { align: 'center' });
        var barcode = "BarCode  : " + this.printWorkOrderObj.barCode;
        doc.text(barcode, pageWidth / 2, 60, { align: 'center' });



        doc.setFontSize(12);
        var requestSubject = "Request Subject :" + this.printWorkOrderObj.requestSubject;
        doc.text(requestSubject, 10, 75, { align: 'left' });
        var code = "Request Code: " + this.printWorkOrderObj.requestCode;
        doc.text(code, 80, 75, { align: 'left' });
        var modeName = "Mode: " + this.printWorkOrderObj.modeName;
        doc.text(modeName, 10, 85, { "align": "left" });
        var requestTypeName = "Request Type: " + this.printWorkOrderObj.requestTypeName;
        doc.text(requestTypeName, 80, 85, { "align": "left" });
        if (this.printWorkOrderObj.subProblemName != "") {
          var problemName = "Problem : " + this.printWorkOrderObj.problemName;
          doc.text(problemName, 10, 95, { "align": "left" });
          var subProblemName = "Sub Problem: " + this.printWorkOrderObj.subProblemName;
          doc.text(subProblemName, 80, 95, { "align": "left" });
        }
        doc.text("Subject : " + this.printWorkOrderObj.subject, 10, 105, { "align": "left" });
        var wonumber = "WorkOrder Number: " + this.printWorkOrderObj.workOrderNumber;
        doc.text(wonumber, 80, 105, { align: 'left' });
        doc.text("Periority: " + this.printWorkOrderObj.periorityName, 10, 115, { "align": "left" });
        doc.text("Type: " + this.printWorkOrderObj.typeName, 80, 115, { "align": "left" });
        var createdDate = this.datePipe.transform(this.printWorkOrderObj.creationDate, "dd-MM-yyyy");
        doc.text("Created date : " + createdDate, 10, 125, { "align": "left" });
        var psd = this.datePipe.transform(this.printWorkOrderObj.plannedStartDate, "dd-MM-yyyy");
        doc.text("Planned StartDate: " + psd, 80, 125, { "align": "left" });
        var ped = this.datePipe.transform(this.printWorkOrderObj.plannedEndDate, "dd-MM-yyyy");
        doc.text("Planned EndDate: " + ped, 140, 125, { "align": "left" });
        doc.text("Note : " + this.printWorkOrderObj.note, 10, 135, { "align": "left" });
        var col = ["Status", "Actual Start Date", "Actual End Date", "From", "Assigned To", "Notes"];
        var rows = [];
        var row = [];
        if (this.printWorkOrderObj.lstWorkOrderTracking != null) {
          for (let index = 0; index < this.printWorkOrderObj.lstWorkOrderTracking.length; index++) {
            const element = this.printWorkOrderObj.lstWorkOrderTracking[index];
            var asd = this.datePipe.transform(element.actualStartDate, "dd-MM-yyyy");
            var aed = this.datePipe.transform(element.actualEndDate, "dd-MM-yyyy");
            row = [element.statusName, asd, aed, element.createdBy, element.assignedToName, element.notes];
            rows.push(row);
          }
          (doc as any).autoTable(col, rows, { startY: 145, styles: { font: 'ARIALUNI' } });
        }

        let printedBy = "Printed by : " + this.currentUser.userName;
        for (var i = 0; i < pageCount; i++) {
          doc.setPage(i + 1);
          doc.text(printedBy, doc.internal.pageSize.getWidth() - 100, doc.internal.pageSize.getHeight() - 10, { "align": "left" });
          doc.text(String(i + 1) + "/" + String(pageCount), doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 10, { "align": "left" });
        }
        var exportdate = this.datePipe.transform(new Date, "dd-MM-yyyy_HH:mm:ss");
        doc.save('EnPrintWorkOrder_' + exportdate + '.pdf');
      }
      else {

        doc.addFileToVFS('Amiri-Regular', fontAmiri);
        doc.addFont('Amiri-Regular', 'Amiri-Regular', 'normal');
        doc.setFont('Amiri-Regular');
        doc.setFontSize(10);
        var img = new Image();
        img.src = '../../assets/images/' + this.currentUser.strLogo;
        doc.addImage(img, 'png', 180, 10, 30, 30);

        doc.setFontSize(14);
        var ministry = this.lang == "en" ? this.currentUser.strInsitute : this.currentUser.strInsituteAr;
        doc.text(ministry, 180, 20, { "align": "right" });


        doc.setFontSize(14);
        var hospital = this.printWorkOrderObj.hospitalNameAr;
        doc.text(hospital, 180, 30, { "align": "right" })


        doc.setFontSize(14);
        var wo = "أمر شغل";
        doc.text(wo, pageWidth / 2, 40, { align: 'center' });
        doc.setFontSize(14);



        var assetRows = [];
        assetRows.push([this.printWorkOrderObj.assetNameAr, "اسم الأصل"]);
        assetRows.push([this.printWorkOrderObj.serialNumber, "الرقم التسلسلي"]);
        assetRows.push([this.printWorkOrderObj.barCode, "الباركود"]);
        assetRows.push([this.printWorkOrderObj.modelNumber, "الموديل"]);
        let wantedTableWidth = 150;
        let pageWidth2 = doc.internal.pageSize.width;
        let margin = (pageWidth2 - wantedTableWidth) / 2;
        doc.autoTable({
          body: assetRows,
          margin: { left: margin, right: margin },
          startY: 50,
          styles: { font: 'Amiri-Regular', fontSize: 13, halign: 'right', fillColor: '#fff', fontStyles: { font: 'Amiri-Regular', halign: 'right' } },
          bodyStyles: { fillColor: '#fff', textColor: '#000', font: 'Amiri-Regular', halign: 'right' },
          alternateRowStyles: { fillColor: '#fff', font: 'Amiri-Regular', halign: 'right' },
          columnStyle: { halign: 'right' }
        });






        if (this.printWorkOrderObj.problemNameAr != "") {
          var problemNameAr = "المشكلة : " + this.printWorkOrderObj.problemNameAr;
          doc.text(problemNameAr, 200, 100, { "align": "right" });

          var subProblemNameAr = "المشكلة الفرعية: " + this.printWorkOrderObj.subProblemNameAr;
          doc.text(subProblemNameAr, 150, 100, { "align": "right" });
        }
        var subject = this.printWorkOrderObj.subject + " :موضوع أمر الشغل";
        doc.text(subject, 200, 110, { align: 'right' });

        var wonumber = this.printWorkOrderObj.workOrderNumber + " :رقم أمر الشغل";
        doc.text(wonumber, 90, 110, { align: 'right' });


        var periority = "الأولوية: " + this.printWorkOrderObj.periorityNameAr;
        doc.text(periority, 200, 120, { "align": "right" });

        var type = "النوع: " + this.printWorkOrderObj.typeNameAr;
        doc.text(type, 90, 120, { "align": "right" });

        var createdDate = new Intl.DateTimeFormat("ar-EG", options).format(new Date(this.printWorkOrderObj.creationDate));
        var created = " تاريخ إنشاء أمر الشغل " + createdDate;
        doc.text(created, 200, 130, { "align": "right" });

        if (this.printWorkOrderObj.note != null) {
          var notes = this.printWorkOrderObj.note + " :ملاحظات";
          doc.text(notes, 200, 140, { "align": "right" });
        }
        else {
          var notes = " :ملاحظات";
          doc.text(notes, 200, 140, { "align": "right" });
        }

        const col = [
          {
            content: 'ملاحظات',
            styles: { fontStyle: 'Amiri-Regular' },
          },
          {
            content: 'إلى',
            styles: { fontStyle: 'Amiri-Regular' },
          },
          {
            content: 'من',
            styles: { fontStyle: 'Amiri-Regular' },
          },
          {
            content: 'تاريخ النهاية',
            styles: { fontStyle: 'Amiri-Regular' },
          },
          {
            content: 'تاريخ البداية',
            styles: { fontStyle: 'Amiri-Regular' },
          },
          {
            content: 'تاريخ الإغلاق',
            styles: { fontStyle: 'Amiri-Regular' },
          },
          {
            content: "الوضع",
            styles: { fontStyle: 'Amiri-Regular' },
          }
        ];
        var rows = [];
        var row = [];
        if (this.printWorkOrderObj.lstWorkOrderTracking != null) {
          for (let index = 0; index < this.printWorkOrderObj.lstWorkOrderTracking.length; index++) {
            const element = this.printWorkOrderObj.lstWorkOrderTracking[index];
            if (element.statusId == 12)
              var closedDate = new Intl.DateTimeFormat("ar-EG", options).format(new Date(element.actualEndDate));

            var asd = new Intl.DateTimeFormat("ar-EG", options).format(new Date(element.actualStartDate));
            var aed = new Intl.DateTimeFormat("ar-EG", options).format(new Date(element.actualEndDate));
            row = [element.notes, element.assignedToName, element.createdBy, aed, asd, closedDate, element.statusNameAr];
            rows.push(row);
          }
          (doc as any).autoTable(col, rows, { startY: 150, styles: { font: 'Amiri-Regular', halign: 'right' } });
        }

        let finalY = doc.lastAutoTable.finalY + 15;

        doc.setFontSize(12);
        var host = "عن المستشفى";
        doc.text(host, 170, finalY, { align: 'right' });


        var eng = "مهندس الصيانة";
        doc.text(eng, 80, finalY, { align: 'right' });


        doc.setFontSize(12);
        var host = "الاسم";
        doc.text(host, 190, finalY + 10, { align: 'right' });
        var eng = "الاسم";
        doc.text(eng, 100, finalY + 10, { align: 'right' });




        doc.setFontSize(12);
        var host = "التوقيع";
        doc.text(host, 190, finalY + 20, { align: 'right' });
        var eng = "التوقيع";
        doc.text(eng, 100, finalY + 20, { align: 'right' });




        doc.setFontSize(12);
        var host = "التاريخ";
        doc.text(host, 190, finalY + 30, { align: 'right' });
        var eng = "التاريخ";
        doc.text(eng, 100, finalY + 30, { align: 'right' });


        let printedBy = this.currentUser.userName + " تمت الطباعة بواسطة ";
        for (var i = 0; i < pageCount; i++) {
          doc.setPage(i + 1);
          doc.text(printedBy, doc.internal.pageSize.getWidth() - 100, doc.internal.pageSize.getHeight() - 10, { "align": "right" });
          doc.text(String(i + 1) + "/" + String(pageCount), doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 10, { "align": "right" });

        }

        var exportdate = this.datePipe.transform(new Date, "dd-MM-yyyy_HH:mm:ss");
        doc.save('ArPrintWorkOrder_' + exportdate + '.pdf');
      }

    });
  }
  sort(field) {

    this.lstWorkOrders = [];
    if (this.statusId == undefined)
      this.statusId = 0;

    if (this.sortStatus === "descending") {
      this.sortStatus = "ascending";
      this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    }
    else {
      this.sortStatus = "descending"
      this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    }

    if (field.currentTarget.id == "Asset Name") {
      this.sortFilterObjects.sortObj.assetName = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "اسم الأصل") {
      this.sortFilterObjects.sortObj.assetNameAr = field.currentTarget.id;
    }
    if (field.currentTarget.id == "BarCode" || field.currentTarget.id == "الباركود") {
      this.sortFilterObjects.sortObj.barCode = field.currentTarget.id;
    }
    if (field.currentTarget.id == "Serial" || field.currentTarget.id == "السيريال") {
      this.sortFilterObjects.sortObj.serialNumber = field.currentTarget.id;
    }
    if (field.currentTarget.id == "Model" || field.currentTarget.id == "الموديل") {
      this.sortFilterObjects.sortObj.modelNumber = field.currentTarget.id;
    }
    if (field.currentTarget.id == "Number" || field.currentTarget.id == "رقم أمر الشغل") {
      this.sortFilterObjects.sortObj.workOrderNumber = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "Status") {
      this.sortFilterObjects.sortObj.statusName = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "الحالة") {
      this.sortFilterObjects.sortObj.statusNameAr = field.currentTarget.id;
    }
    if (field.currentTarget.id == "Subject" || field.currentTarget.id == "الموضوع") {
      this.sortFilterObjects.sortObj.subject = field.currentTarget.id;
    }

    if (field.currentTarget.id == "Ticket" || field.currentTarget.id == "بلاغ عن عطل") {
      this.sortFilterObjects.sortObj.requestSubject = field.currentTarget.id;
    }
    if (field.currentTarget.id == "Created By" || field.currentTarget.id == "انشأ من قبل") {
      this.sortFilterObjects.sortObj.createdBy = field.currentTarget.id;
    }
    if (field.currentTarget.id == "Date" || field.currentTarget.id == "التاريخ") {
      this.sortFilterObjects.sortObj.creationDate = field.currentTarget.id;
    }

    if (field.currentTarget.id == "Notes" || field.currentTarget.id == "ملاحظات") {
      this.sortFilterObjects.sortObj.note = field.currentTarget.id;
    }

    if (field.currentTarget.id == "ClosedDate" || field.currentTarget.id == "تاريخ الإغلاق") {
      this.sortFilterObjects.sortObj.closedDate = field.currentTarget.id;
    }
    this.sortFilterObjects.searchObj.statusId = this.statusId;
    this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    this.sortFilterObjects.sortObj.sortBy = field.currentTarget.id;
    this.sortFilterObjects.searchObj.userId = this.currentUser.id;


    this.workOrderService.ListWorkOrders(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe(workorders => {
      workorders.results.forEach(element => {
        if (element.workOrderStatusId < 12 && (element.workOrderStatusId != 0)) {
          this.timer = window.setInterval(() => {
            this.startStamp = new Date(element.creationDate).getTime();
            this.newDate = new Date();
            this.newStamp = this.newDate.getTime();
            var diff = Math.round((this.newStamp - this.startStamp) / 1000);
            var d = Math.floor(diff / (24 * 60 * 60));
            diff = diff - (d * 24 * 60 * 60);
            var h = Math.floor(diff / (60 * 60));
            diff = diff - (h * 60 * 60);
            var m = Math.floor(diff / (60));
            diff = diff - (m * 60);
            var s = diff;

            if (this.lang == "en")
              element.elapsedTime = d + " day(s), " + h + ":" + m + ":" + s + "";
            else
              element.elapsedTime = (d).toLocaleString("ar-SA") + " يوم و  " + (s).toLocaleString("ar-SA") + ":" + (m).toLocaleString("ar-SA") + ":" + (h).toLocaleString("ar-SA") + "";

          }, 1000);
        }
        else if (element.workOrderStatusId == 12) {
          var firstItem = element.firstTrackDate;
          var lastItem = element.creationDate;
          this.startStamp = new Date(firstItem).getTime();
          this.newDate = new Date(lastItem);
          this.newStamp = this.newDate.getTime();
          var diff2 = Math.round((this.newStamp - this.startStamp) / 1000);
          var d2 = Math.floor(diff2 / (24 * 60 * 60));
          diff2 = diff2 - (d2 * 24 * 60 * 60);
          var h2 = Math.floor(diff2 / (60 * 60));
          diff2 = diff2 - (h2 * 60 * 60);
          var m2 = Math.floor(diff2 / (60));
          diff2 = diff2 - (m2 * 60);
          var s2 = diff2;
          if (this.lang == "en")
            element.elapsedTime = d2 + " day(s), " + h2 + ":" + m2 + ":" + s2 + "";
          else
            element.elapsedTime = (d2).toLocaleString("ar-SA") + " يوم و  " + ":" + (m2).toLocaleString("ar-SA") + ":" + (h2).toLocaleString("ar-SA") + "";
        }
        this.lstWorkOrders.push(element);

      });
      this.count = workorders.count;
      this.loading = false;
    });
  }
  getBarCode(event) {
    this.sortFilterObjects.searchObj.barCode = event["barCode"];
  }
  onSelectionChanged(event) {
    if (this.currentUser.hospitalId != 0) {
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

    if (this.sortFilterObjects.searchObj.hospitalId != 0) {
      this.assetDetailService.AutoCompleteAssetBarCode(event.query, this.sortFilterObjects.searchObj.hospitalId).subscribe(assets => {
        this.lstassetDetailBarcodes = assets;
        if (this.lang == "en") {
          this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
        }
        else {
          this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
        }
      });
    }
    else {
      this.assetDetailService.AutoCompleteAssetBarCode(event.query, this.hospitalId).subscribe(assets => {
        this.lstassetDetailBarcodes = assets;
        if (this.lang == "en") {
          this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
        }
        else {
          this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
        }
      });
    }
  }
  getSerialNumber(event) {
    this.sortFilterObjects.searchObj.serialNumber = event["serialNumber"];
  }
  onSerialNumberSelectionChanged(event) {
    if (this.currentUser.hospitalId != 0) {
      this.assetDetailService.AutoCompleteAssetSerial(event.query, this.currentUser.hospitalId).subscribe(assets => {
        this.lstAssetSerailNumberObj = assets;
        if (this.lang == "en") {
          this.lstAssetSerailNumberObj.forEach(item => item.name = item.serialNumber);
        }
        else {
          this.lstAssetSerailNumberObj.forEach(item => item.name = item.serialNumber);
        }
      });
    }

    if (this.sortFilterObjects.searchObj.hospitalId != 0) {
      this.assetDetailService.AutoCompleteAssetSerial(event.query, this.sortFilterObjects.searchObj.hospitalId).subscribe(assets => {
        this.lstAssetSerailNumberObj = assets;
        if (this.lang == "en") {
          this.lstAssetSerailNumberObj.forEach(item => item.name = item.serialNumber);
        }
        else {
          this.lstAssetSerailNumberObj.forEach(item => item.name = item.serialNumber);
        }
      });
    }
    else {
      this.assetDetailService.AutoCompleteAssetSerial(event.query, this.hospitalId).subscribe(assets => {
        this.lstAssetSerailNumberObj = assets;
        if (this.lang == "en") {
          this.lstAssetSerailNumberObj.forEach(item => item.name = item.serialNumber);
        }
        else {
          this.lstAssetSerailNumberObj.forEach(item => item.name = item.serialNumber);
        }
      });
    }
  }
  checkedWO($event, id: number) {
    if ($event.checked) {
      this.lstWOIds.push(id);
      this.workOrderService.GetWorkOrderById(id).subscribe((item) => {
        this.checkedWorkOrder.userName = this.currentUser.userName;
        this.checkedWorkOrder = item;
        this.lstCheckedWorkOrders.push(this.checkedWorkOrder);
      });
    }
    else {
      var index = this.lstWOIds.indexOf(id);
      this.lstWOIds.splice(index, 1);
      for (let i = 0; i < this.lstCheckedWorkOrders.length; i++) {
        id = this.lstCheckedWorkOrders[i].id;
        this.lstCheckedWorkOrders.splice(index, 1);
      }
    }
  }
  exportExcel() {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Work Order');
    if (this.lang == "en") {
      worksheet.columns = [
        { header: 'Workorder Number', key: 'workOrderNumber' },
        { header: 'Asset Name', key: 'assetName' },
        { header: 'Barcode', key: 'barCode' },
        { header: 'Serial', key: 'serialNumber' },
        { header: 'Model', key: 'modelNumber' },
        { header: 'Supplier', key: 'supplierName' },
        { header: 'Open Date', key: 'creationDate' },
        { header: 'Close Date', key: 'closedDate' },
        { header: 'Note', key: 'note', width: 20 },
        { header: 'Status', key: 'status' },
        { header: 'Brand', key: 'brandName' },
        { header: 'Department', key: 'departmentName' },
        { header: 'Warranty Start', key: 'warrantyStart', width: 20 },
        { header: 'Warranty End', key: 'warrantyEnd', width: 20 },
        { header: 'Warranty Expires', key: 'warrantyExpires', width: 20 },
        { header: 'Purchase Date', key: 'purchaseDate', width: 20 },
        { header: 'Receiving Date', key: 'receivingDate', width: 20 },
        { header: 'Operation Date', key: 'operationDate', width: 20 },
        { header: 'Installation Date', key: 'installationDate', width: 20 },
        { header: 'Building', key: 'buildingName', width: 20 },
        { header: 'Floor', key: 'floorName', width: 20 },
        { header: 'Room', key: 'roomName', width: 20 },
        { header: 'Price', key: 'price', width: 20 },
        { header: 'Cost center', key: 'costCenter', width: 20 },
        { header: 'PO Number', key: 'poNumber', width: 20 },
        { header: 'Remarks', key: 'remarks', width: 20 }

      ];
      if (this.lstCheckedWorkOrders.length > 0) {
        this.lstCheckedWorkOrders.forEach(e => {
          var creationDate = this.datePipe.transform(e.creationDate, "dd/MM/yyyy");
          var closedDate = this.datePipe.transform(e.closedDate, "dd/MM/yyyy");

          worksheet.addRow({
            workOrderNumber: e.workOrderNumber,
            assetName: e.assetName,
            barCode: e.barCode,
            serialNumber: e.serialNumber,
            modelNumber: e.modelNumber,
            supplierName: e.supplierName,
            creationDate: creationDate,
            closedDate: closedDate,
            note: e.note,
            status: e.statusName,
            brandName: e.brandName,
            departmentName: e.departmentName,
            warrantyStart: e.warrantyStart,
            warrantyEnd: e.warrantyEnd,
            warrantyExpires: e.warrantyExpires,
            purchaseDate: e.purchaseDate,
            receivingDate: e.receivingDate,
            operationDate: e.operationDate,
            installationDate: e.installationDate,
            buildingName: e.buildingName,
            floorName: e.floorName,
            roomName: e.roomName,
            price: e.price,
            costCenter: e.costCenter,
            poNumber: e.poNumber,
            remarks: e.remarks

          }, "n");
        });

        workbook.xlsx.writeBuffer().then((lstCheckedWorkOrders) => {
          let blob = new Blob([lstCheckedWorkOrders], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
          fs.saveAs(blob, 'WorkOrder_' + today + '.xlsx');
        });
      } else {
        this.lstWorkOrders.forEach(e => {
          var creationDate = this.datePipe.transform(e.creationDate, "dd/MM/yyyy");
          var closedDate = this.datePipe.transform(e.closedDate, "dd/MM/yyyy");

          worksheet.addRow({
            workOrderNumber: e.workOrderNumber,
            assetName: e.assetName,
            barCode: e.barCode,
            serialNumber: e.serialNumber,
            modelNumber: e.modelNumber,
            supplierName: e.supplierName,
            creationDate: creationDate,
            closedDate: closedDate,
            note: e.note,
            status: e.statusName,
            brandName: e.brandName,
            departmentName: e.departmentName,
            warrantyStart: e.warrantyStart,
            warrantyEnd: e.warrantyEnd,
            warrantyExpires: e.warrantyExpires,
            purchaseDate: e.purchaseDate,
            receivingDate: e.receivingDate,
            operationDate: e.operationDate,
            installationDate: e.installationDate,
            buildingName: e.buildingName,
            floorName: e.floorName,
            roomName: e.roomName,
            price: e.price,
            costCenter: e.costCenter,
            poNumber: e.poNumber,
            remarks: e.remarks
          }, "n");
        });

        workbook.xlsx.writeBuffer().then((lstWO) => {
          let blob = new Blob([lstWO], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
          fs.saveAs(blob, 'WorkOrder_' + today + '.xlsx');
        });
      }
    }
    else {
      worksheet.columns = [
        { header: 'ملاحظات', key: 'remarks', width: 20 },
        { header: 'PO Number', key: 'poNumber', width: 20 },
        { header: 'cost center', key: 'costCenter', width: 20 },
        { header: 'السعر', key: 'price', width: 20 },
        { header: 'الغرفة', key: 'roomNameAr', width: 20 },
        { header: 'الطابق', key: 'floorNameAr', width: 20 },
        { header: 'المبنى', key: 'buildingNameAr', width: 20 },
        { header: 'تاريخ التركيب', key: 'installationDate', width: 20 },
        { header: 'تاريخ التشغيل', key: 'operationDate', width: 20 },
        { header: 'تاريخ الوصول', key: 'receivingDate', width: 20 },
        { header: 'تاريخ الشراء', key: 'purchaseDate', width: 20 },
        { header: 'مدة الضمان', key: 'warrantyExpires', width: 20 },
        { header: 'نهاية الضمان', key: 'warrantyEnd', width: 20 },
        { header: 'بداية الضمان', key: 'warrantyStart', width: 20 },
        { header: 'الماركة', key: 'brandNameAr', width: 20 },
        { header: 'القسم', key: 'departmentNameAr', width: 20 },
        { header: 'الحالة', key: 'status', width: 15 },
        { header: 'ملاحظات', key: 'note', width: 20 },
        { header: 'تاريخ الإغلاق', key: 'closedDate', width: 15 },
        { header: 'تاريخ البداية', key: 'creationDate', width: 15 },
        { header: 'المورد', key: 'supplierNameAr', width: 10 },
        { header: 'الموديل', key: 'modelNumber', width: 10 },
        { header: 'السيريال', key: 'serialNumber', width: 10 },
        { header: 'الباركود', key: 'barCode', width: 10 },
        { header: 'اسم الأصل', key: 'assetNameAr', width: 50 },
        { header: 'رقم أمر الشغل', key: 'workOrderNumber', width: 10 }

      ];
      if (this.lstExportWorkOrdersToExcel.length > 0 && this.lstCheckedWorkOrders.length > 0) {
        this.lstCheckedWorkOrders.forEach((e, index) => {
          var creationDate = this.datePipe.transform(e.creationDate, "dd/MM/yyyy");
          var closedDate = this.datePipe.transform(e.closedDate, "dd/MM/yyyy");
          var row = worksheet.addRow({
            remarks: e.remarks,
            poNumber: e.poNumber,
            costCenter: e.costCenter,
            price: e.price,
            roomNameAr: e.roomNameAr,
            floorNameAr: e.floorNameAr,
            buildingNameAr: e.buildingNameAr,
            installationDate: e.installationDate,
            operationDate: e.operationDate,
            receivingDate: e.receivingDate,
            purchaseDate: e.purchaseDate,
            warrantyExpires: e.warrantyExpires,
            warrantyEnd: e.warrantyEnd,
            warrantyStart: e.warrantyStart,
            brandNameAr: e.brandNameAr,
            departmentNameAr: e.departmentNameAr,
            status: e.statusNameAr,
            note: e.note,
            closedDate: closedDate,
            creationDate: creationDate,
            supplierNameAr: e.supplierNameAr,
            modelNumber: e.modelNumber,
            serialNumber: e.serialNumber,
            barCode: e.barCode,
            assetNameAr: e.assetNameAr,
            workOrderNumber: e.workOrderNumber
          }, "n");
          row.eachCell(function (cell) {
            cell.alignment = { horizontal: 'right' };
          });
        });
        workbook.xlsx.writeBuffer().then((lstExportWorkOrdersToExcel) => {
          let blob = new Blob([lstExportWorkOrdersToExcel], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
          fs.saveAs(blob, 'WorkOrder_' + today + '.xlsx');
        });
      }
      if (this.lstExportWorkOrdersToExcel.length > 0 && this.lstCheckedWorkOrders.length == 0) {
        this.lstExportWorkOrdersToExcel.forEach((e, index) => {
          var creationDate = this.datePipe.transform(e.creationDate, "dd/MM/yyyy");
          var closedDate = this.datePipe.transform(e.closedDate, "dd/MM/yyyy");
          var row = worksheet.addRow({
            remarks: e.remarks,
            poNumber: e.poNumber,
            costCenter: e.costCenter,
            price: e.price,
            roomNameAr: e.roomNameAr,
            floorNameAr: e.floorNameAr,
            buildingNameAr: e.buildingNameAr,
            installationDate: e.installationDate,
            operationDate: e.operationDate,
            receivingDate: e.receivingDate,
            purchaseDate: e.purchaseDate,
            warrantyExpires: e.warrantyExpires,
            warrantyEnd: e.warrantyEnd,
            warrantyStart: e.warrantyStart,
            brandNameAr: e.brandNameAr,
            departmentNameAr: e.departmentNameAr,
            status: e.statusNameAr,
            note: e.note,
            closedDate: closedDate,
            creationDate: creationDate,
            supplierNameAr: e.supplierNameAr,
            modelNumber: e.modelNumber,
            serialNumber: e.serialNumber,
            barCode: e.barCode,
            assetNameAr: e.assetNameAr,
            workOrderNumber: e.workOrderNumber
          }, "n");
          row.eachCell(function (cell) {
            cell.alignment = { horizontal: 'right' };
          });
        });
        workbook.xlsx.writeBuffer().then((lstExportWorkOrdersToExcel) => {
          let blob = new Blob([lstExportWorkOrdersToExcel], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
          fs.saveAs(blob, 'WorkOrder_' + today + '.xlsx');
        });
      }
      if (this.lstCheckedWorkOrders.length > 0 && this.lstExportWorkOrdersToExcel.length == 0) {
        this.lstCheckedWorkOrders.forEach((e, index) => {
          var creationDate = this.datePipe.transform(e.creationDate, "dd/MM/yyyy");
          var closedDate = this.datePipe.transform(e.closedDate, "dd/MM/yyyy");
          var row = worksheet.addRow({
            remarks: e.remarks,
            poNumber: e.poNumber,
            costCenter: e.costCenter,
            price: e.price,
            roomNameAr: e.roomNameAr,
            floorNameAr: e.floorNameAr,
            buildingNameAr: e.buildingNameAr,
            installationDate: e.installationDate,
            operationDate: e.operationDate,
            receivingDate: e.receivingDate,
            purchaseDate: e.purchaseDate,
            warrantyExpires: e.warrantyExpires,
            warrantyEnd: e.warrantyEnd,
            warrantyStart: e.warrantyStart,
            brandNameAr: e.brandNameAr,
            departmentNameAr: e.departmentNameAr,
            status: e.statusNameAr,
            note: e.note,
            closedDate: closedDate,
            creationDate: creationDate,
            supplierNameAr: e.supplierNameAr,
            modelNumber: e.modelNumber,
            serialNumber: e.serialNumber,
            barCode: e.barCode,
            assetNameAr: e.assetNameAr,
            workOrderNumber: e.workOrderNumber
          }, "n");
          row.eachCell(function (cell) {
            cell.alignment = { horizontal: 'right' };
          });
        });
        workbook.xlsx.writeBuffer().then((lstCheckedWorkOrders) => {
          let blob = new Blob([lstCheckedWorkOrders], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
          fs.saveAs(blob, 'WorkOrder_' + today + '.xlsx');
        });
      }
      else if (this.lstCheckedWorkOrders.length == 0 && this.lstExportWorkOrdersToExcel.length == 0) {
        this.workOrderService.ListWorkOrders(this.sortFilterObjects, 0, 0).subscribe(lstWO => {
          lstWO.results.forEach(e => {
            var creationDate = this.datePipe.transform(e.creationDate, "dd/MM/yyyy");
            var closedDate = this.datePipe.transform(e.closedDate, "dd/MM/yyyy");
            var row = worksheet.addRow({
              remarks: e.remarks,
              poNumber: e.poNumber,
              costCenter: e.costCenter,
              price: e.price,
              roomNameAr: e.roomNameAr,
              floorNameAr: e.floorNameAr,
              buildingNameAr: e.buildingNameAr,
              installationDate: e.installationDate,
              operationDate: e.operationDate,
              receivingDate: e.receivingDate,
              purchaseDate: e.purchaseDate,
              warrantyExpires: e.warrantyExpires,
              warrantyEnd: e.warrantyEnd,
              warrantyStart: e.warrantyStart,
              brandNameAr: e.brandNameAr,
              departmentNameAr: e.departmentNameAr,
              status: e.statusNameAr,
              note: e.note,
              closedDate: closedDate,
              creationDate: creationDate,
              supplierNameAr: e.supplierNameAr,
              modelNumber: e.modelNumber,
              serialNumber: e.serialNumber,
              barCode: e.barCode,
              assetNameAr: e.assetNameAr,
              workOrderNumber: e.workOrderNumber
            }, "n");
            row.eachCell(function (cell) {
              cell.alignment = { horizontal: 'right' };
            });
          });
          workbook.xlsx.writeBuffer().then((lstWO) => {
            let blob = new Blob([lstWO], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
            fs.saveAs(blob, 'WorkOrder_' + today + '.xlsx');
          });
        });
      }
    }
  }
  reset() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }
  clearAssetSerailNumber() {
    this.sortFilterObjects.searchObj.serialNumber = "";
  }
  clearAssetBarCode() {
    this.sortFilterObjects.searchObj.barCode = "";
  }
  GetWOById(id) {

    this.displayWOObj = true;
    const options: Intl.DateTimeFormatOptions = { month: "long", day: 'numeric', year: 'numeric' };
    this.workOrderService.PrintWorkOrderById(id).subscribe(woObj => {
      this.printWorkOrderObj = woObj;
      if (this.printWorkOrderObj.closedDate != "") {
        this.printWorkOrderObj.closedDate = new Intl.DateTimeFormat("ar-EG", options).format(new Date(this.printWorkOrderObj.closedDate));
      }

      if (this.printWorkOrderObj.subProblemNameAr != "") {
        this.printWorkOrderObj.problemNameAr = this.printWorkOrderObj.problemNameAr;
        this.printWorkOrderObj.subProblemNameAr = this.printWorkOrderObj.subProblemNameAr;
      }

      if (this.printWorkOrderObj.lstWorkOrderTracking != null) {
        for (let index = 0; index < this.printWorkOrderObj.lstWorkOrderTracking.length; index++) {
          const element = this.printWorkOrderObj.lstWorkOrderTracking[index];


          if (element.workOrderStatusId == 12) {
            element.closedDate = new Intl.DateTimeFormat("ar-EG", options).format(new Date(element.closedDate));
            element.actualStartDate = new Intl.DateTimeFormat("ar-EG", options).format(new Date(element.actualStartDate));
          }
          else {
            element.actualStartDate = new Intl.DateTimeFormat("ar-EG", options).format(new Date(element.actualStartDate));
          }
        }
      }
    });

    let printedBy = this.currentUser.userName + " تمت الطباعة بواسطة ";
    this.printedBy = printedBy;
  }
  print() {
    window.print();
  }
  closePrint() {
    this.displayWOObj = false;
    this.reload();
  }
  validateDates(sDate: string, eDate: string) {
    this.isValidDate = true;
    if ((sDate != null && eDate != null) && (eDate) < (sDate)) {
      if (this.lang == "en") {
        this.error = { isError: true, errorMessage: 'Start Date should be less than End Date.' };
        this.isValidDate = false;
      }
      else {
        this.error = { isError: true, errorMessage: 'تاريخ البداية لابد أن يكون أقل من تاريخ النهاية ' };
        this.isValidDate = false;
      }
    }
    return this.isValidDate;
  }
  onMasterSelectionChanged(event) {
    this.masterAssetService.AutoCompleteMasterAssetName2(event.query).subscribe(masters => {
      this.lstMasterAssets = masters;
      if (this.lang == "en") {

        this.lstMasterAssets.forEach(item => item.name = item.name + " - " + item.brandName + " - " + item.model);
      }
      else {
        this.lstMasterAssets.forEach(item => item.name = item.nameAr + " - " + item.brandNameAr + " - " + item.model);
      }
    });
  }
  getMasterObject(event) {
    this.sortFilterObjects.searchObj.masterAssetId = event["id"];
  }
  generatePDF() {
    if (this.lstCheckedWorkOrders.length > 0) {
      this.lstCheckedWorkOrders[0].lang = this.lang;
      this.lstCheckedWorkOrders[0].printedBy = this.currentUser.userName;
      this.lstCheckedWorkOrders[0].hospitalName = this.currentUser.hospitalName;
      this.lstCheckedWorkOrders[0].hospitalNameAr = this.currentUser.hospitalNameAr;
      this.workOrderService.CreateWorkOrderGeneratePDF(this.lstCheckedWorkOrders).subscribe(list => {
        let fileName = "CreateWOCheckedReport.pdf";
        var filePath = `${environment.Domain}UploadedAttachments/WOReports/`;
        this.uploadService.downloadCreateWorkOrderCheckedPDF(fileName).subscribe(file => {
          var dwnldFile = filePath + fileName;
          if (fileName != "" || fileName != null)
            window.open(dwnldFile);
        });
      });
    }
    else if (this.lstCheckedWorkOrders.length == 0) {
      this.printWO.lang = this.lang;
      this.printWO.printedBy = this.currentUser.userName;
      this.printWO.hospitalNameAr = this.currentUser.hospitalNameAr;
      this.printWO.hospitalName = this.currentUser.hospitalName;
      this.workOrderService.CreateAllWorkOrderPDF(this.printWO).subscribe(list => {
        let fileName = "CreateWOCheckedReport.pdf";
        var filePath = `${environment.Domain}UploadedAttachments/WOReports/`;
        this.uploadService.downloadCreateWorkOrderCheckedPDF(fileName).subscribe(file => {
          var dwnldFile = filePath + fileName;
          if (fileName != "" || fileName != null)
            window.open(dwnldFile);
        });
      });
    }
  }


  // generatePMPDF() {
    

  //   if (this.lstCheckedWorkOrders.length == 0) {

  //     this.ngxService.start("startPMWord");
  //     this.checkedWorkOrderObj.departmentId = this.sortFilterObjects.searchObj.departmentId;
  //     this.checkedWorkOrderObj.governorateId = this.sortFilterObjects.searchObj.governorateId;
  //     this.checkedWorkOrderObj.cityId = this.sortFilterObjects.searchObj.cityId;
  //     this.checkedWorkOrderObj.organizationId = this.sortFilterObjects.searchObj.organizationId;
  //     this.checkedWorkOrderObj.subOrganizationId = this.sortFilterObjects.searchObj.subOrganizationId;
  //     this.checkedWorkOrderObj.serialNumber = this.sortFilterObjects.searchObj.serialNumber;
  //     this.checkedWorkOrderObj.modelNumber = this.sortFilterObjects.searchObj.modelNumber;
  //     this.checkedWorkOrderObj.barCode = this.sortFilterObjects.searchObj.barCode;
  //     this.checkedWorkOrderObj.userName = this.currentUser.userName;


  //     this.workOrderService.CreateWorkOrderCheckedPMPDFByDepartment(this.checkedWorkOrderObj).subscribe(list => {
  //       var filePath = `${environment.Domain}UploadedAttachments/`;
  //       let fileName = "WOPM2.pdf";
  //       this.uploadService.downloadWOPMPDF(fileName).subscribe(file => {
  //         var dwnldFile = filePath + 'WOReports/' + fileName;
  //         if (fileName != "" || fileName != null)
  //           window.open(dwnldFile);
  //       });
  //     });

  //     this.ngxService.stop("startPMWord");
  //   }
  //   else {
  //     this.workOrderService.CreateWorkOrderCheckedPMPDF(this.lstCheckedWorkOrders).subscribe(list => {
  //       var filePath = `${environment.Domain}UploadedAttachments/`;
  //       let fileName = "WOPM2.pdf";
  //       this.uploadService.downloadWOPMPDF(fileName).subscribe(file => {
  //         var dwnldFile = filePath + 'WOReports/' + fileName;
  //         if (fileName != "" || fileName != null)
  //           window.open(dwnldFile);
  //       });
  //     });
  //   }
  // }
}
