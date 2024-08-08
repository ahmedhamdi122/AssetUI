import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { AssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { CreateAssetStatusTransactionVM } from 'src/app/Shared/Models/assetStatusTransactionVM';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListEmployees } from 'src/app/Shared/Models/employeeVM';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { ListMasterAssetVM } from 'src/app/Shared/Models/masterAssetVM';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { Paging } from 'src/app/Shared/Models/paging';
import { ExportRequestVM, ListRequestModeVM, ListRequestVM, PrintServiceRequestVM, SearchRequestVM } from 'src/app/Shared/Models/requestModeVM';
import { ListRequestPeriority } from 'src/app/Shared/Models/RequestPeriorityVM';
import { IndexRequestStatus } from 'src/app/Shared/Models/RequestStatusVM';
import { CreateRequestTracking } from 'src/app/Shared/Models/RequestTrackingVM';
import { RequestVM, SortAndFilterRequestVM, SortRequestVM } from 'src/app/Shared/Models/requestVM';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { CreateWorkOrderTrackingVM } from 'src/app/Shared/Models/WorkOrderTrackingVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { CityService } from 'src/app/Shared/Services/city.service';
import { EmployeeService } from 'src/app/Shared/Services/employee.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { RequestModeService } from 'src/app/Shared/Services/request-mode.service';
import { RequestPeriorityService } from 'src/app/Shared/Services/request-periority.service';
import { RequestStatusService } from 'src/app/Shared/Services/request-status.service';
import { RequestService } from 'src/app/Shared/Services/request.service';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { fontAmiri } from 'src/assets/fonts/Amiri-Regular';
import { environment } from 'src/environments/environment';
import { ListDepartmentVM } from 'src/app/Shared/Models/departmentVM';
import { CreateWOComponent } from '../../work-orders/create/createwo.component';
import { ListWOComponent } from '../../work-orders/list/listwo.component';
import { AddStatusComponent } from '../add-status/add-status.component';
import { CloseComponent } from '../close/close.component';
import { CreateComponent } from '../create/create.component';
import { DeleteconfirmationComponent } from '../deleteconfirmation/deleteconfirmation.component';
import { EditComponent } from '../edit/edit.component';
import { TrackworkordersComponent } from '../trackworkorders/trackworkorders.component';
import { ViewComponent } from '../view/view.component';
import { DepartmentService } from 'src/app/Shared/Services/department.service';
import * as jspdf from 'jspdf';
import 'jspdf-autotable';
import { ApproverequestComponent } from '../approverequest/approverequest.component';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';
import { PrintsrComponent } from '../printsr/printsr.component';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {


  lang = localStorage.getItem("lang");
  numberLang: string = "";
  textDir: string = 'ltr';
  currentUser: LoggedUser;
  errorMessage: string;
  errorDisplay: boolean = false;
  isAssetOwner: boolean = false;
  isEng: boolean = false;
  isEngManager: boolean = false;
  isAdmin: boolean = false;
  isSRCreator: boolean = false;
  isSRReviewer: boolean = false;
  searchObj: SearchRequestVM;
  public show: boolean = false;
  public buttonName: any = 'Show';


  lstRequests: ListRequestVM[] = [];
  lstRequests2: ListRequestVM[] = [];
  lstPeriorities: ListRequestPeriority[] = [];
  lstMainStatuses: IndexRequestStatus[] = [];
  lstModes: ListRequestModeVM[] = [];
  lstAssetOwners: ListEmployees[] = [];
  lstassetDetails: AssetDetailVM[] = [];
  lstDepartments: ListDepartmentVM[] = [];


  creatWorkOrderTrackingObj: CreateWorkOrderTrackingVM;
  reqTrackObj: CreateRequestTracking;
  assetDetailId: number;
  selectedObj: RequestVM;
  showAdd: boolean = false;
  isEdit: boolean = false;
  isDelete: boolean = false;
  isView: boolean = false;
  display: boolean = false;


  page: Paging;
  count: number;
  lstRoleNames: string[] = [];

  lstGovernorates: ListGovernorateVM[];
  lstCities: ListCityVM[];
  lstOrganizations: ListOrganizationVM[];
  lstSubOrganizations: ListSubOrganizationVM[];
  lstHospitals: ListHospitalVM[] = [];

  lstHospitalAssets: ListMasterAssetVM[] = [];
  sortStatus: string = "descending";
  sortObj: SortRequestVM;
  countOpenRequests: number;
  isGov: boolean = false;
  isCity: boolean = false;
  isOrg: boolean = false;
  isSubOrg: boolean = false;
  isHospital: boolean = false;
  loading: boolean = true;
  assetStatusObj: CreateAssetStatusTransactionVM;
  startDateTime: Date;
  startStamp: number;
  newDate: Date = new Date();
  newStamp = this.newDate.getTime();
  timer;
  statusId: number = 0;
  hospitalId: number = 0;

  cols: any[];
  _selectedColumns: any[];
  columnsSelected: string = "";
  frozenCols: any[];

  lstassetDetailBarcodes: AssetDetailVM[] = [];
  lstAssetSerailNumberObj: AssetDetailVM[] = [];
  assetSerailNumberObj: AssetDetailVM;

  lstRequestIds: number[] = [];
  lstCheckedRequests: ListRequestVM[] = [];
  lstExportCheckedRequests: ExportRequestVM[] = [];

  exportCheckedRequest: ExportRequestVM;


  checkedRequest2: ListRequestVM;
  lstExportRequestsToExcel: ListRequestVM[] = [];
  printedBy: string = "";

  lstMasterAssets: ListMasterAssetVM[] = [];
  isValidDate: boolean = false;
  error: any = { isError: false, errorMessage: '' };

  showSR: boolean = false;
  showIncomeSR: boolean = false;

  lstSelectedColumns: any[] = [];

  sortFilterObjects: SortAndFilterRequestVM;
  assetBarCodeObj = null;

  countOpen: number = 0;
  countClosed: number = 0;
  countInProgress: number = 0;
  countSolved: number = 0;
  countAll: number = 0;
  countApproved: number = 0;
  printServiceRequestObj: PrintServiceRequestVM;

  constructor(
    private departmentService: DepartmentService, private authenticationService: AuthenticationService, private assetDetailService: AssetDetailService,
    private governorateService: GovernorateService, private cityService: CityService, private organizationService: OrganizationService, private subOrganizationService: SubOrganizationService,
    private hospitalService: HospitalService, private requestStatusService: RequestStatusService, public dialogService: DialogService, private uploadService: UploadFilesService,
    private requestPeriorityService: RequestPeriorityService, private route: Router, private dialog: MatDialog, private datePipe: DatePipe,
    private requestModeService: RequestModeService, private requestService: RequestService,
    private employeeService: EmployeeService, private masterAssetService: MasterAssetService,
    private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }
  set selectedColumns(val: any[]) {
    this._selectedColumns = this.cols.filter(col => val.includes(col));
    this.lstSelectedColumns.push(val);
  }
  ngOnInit(): void {
    this.onLoad();
    this.onLoadByLogIn();

    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });
      this.isAssetOwner = (['AssetOwner'].some(r => this.lstRoleNames.includes(r)));
      this.isEng = (['Eng'].some(r => this.lstRoleNames.includes(r)));
      this.isEngManager = (['EngDepManager'].some(r => this.lstRoleNames.includes(r)));
      this.isAdmin = (['Admin'].some(r => this.lstRoleNames.includes(r)));
      this.isSRCreator = (['Admin', 'SRCreator'].some(r => this.lstRoleNames.includes(r)));
      this.isSRReviewer = (['Admin', 'SRReviewer'].some(r => this.lstRoleNames.includes(r)));
    }
    if (this.isSRCreator || this.isAssetOwner || this.isSRReviewer) {
      this.showSR = true;
      this.showIncomeSR = false;
      const translationKeys = ['Asset.Maintainance', 'Asset.Requests'];
      const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
      this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);
    }
    if (this.isEngManager || this.isAdmin) {
      this.showSR = false;
      this.showIncomeSR = true;

      const translationKeys = ['Asset.Maintainance', 'Asset.IncomeRequests'];
      const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
      this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);
    }



    this.requestService.GetTotalOpenRequest(this.currentUser.id).subscribe(c => {
      this.countOpenRequests = c;
    });

    this.page = {
      pagenumber: 1,
      pagesize: 10,
    }
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
                if (this.currentUser.hospitalId != 0) {
                  this.sortFilterObjects.searchObj.hospitalId = this.currentUser.hospitalId;
                  this.isHospital = true;
                }
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
                if (this.currentUser.hospitalId != 0) {
                  this.sortFilterObjects.searchObj.hospitalId = this.currentUser.hospitalId;
                  this.isHospital = true;
                }
              });
            }
          });
        }
      });
      this.hospitalService.GetHospitalById(this.currentUser.hospitalId).subscribe(hospitalObj => {
        this.sortFilterObjects.searchObj.organizationId = hospitalObj.organizationId;
        this.isOrg = true;
        this.subOrganizationService.GetSubOrganizationByOrgId(this.sortFilterObjects.searchObj.organizationId).subscribe((subs) => {
          this.lstSubOrganizations = subs;
        });
        this.sortFilterObjects.searchObj.subOrganizationId = hospitalObj.subOrganizationId;
        this.isSubOrg = true;
      });
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
  onLoad() {
    this.assetStatusObj = { assetDetailId: 0, assetStatusId: 0, statusDate: '', hospitalId: 0 }
    this.reqTrackObj = { strDescriptionDate: '', id: 0, createdById: '', description: '', descriptionDate: new Date, requestId: 0, requestStatusId: 0, hospitalId: 0 };
    this.creatWorkOrderTrackingObj = { strWorkOrderDate: '', id: 0, notes: '', createdById: '', creationDate: '', workOrderDate: new Date(), workOrderId: 0, workOrderStatusId: 0, assignedTo: '', actualEndDate: '', actualStartDate: '', plannedEndDate: '', plannedStartDate: '', hospitalId: 0 };
    this.sortFilterObjects = {
      searchObj: { assetDetailId: 0, userName: '', lang: '', hospitalName: '', hospitalNameAr: '', printedBy: '', strEndDate: '', strStartDate: '', masterAssetId: 0, woLastTrackDescription: '', modelNumber: '', serialNumber: '', code: '', periorityId: 0, statusId: 0, modeId: 0, userId: '', cityId: 0, governorateId: 0, hospitalId: 0, barcode: '', organizationId: 0, subOrganizationId: 0, subject: '', start: '', end: '', assetOwnerId: 0, departmentId: 0 },
      sortObj: {
        userId: '', assetId: 0, hospitalId: 0, closedDate: '', createdBy: '', serial: '', requestCode: '', masterAssetId: 0, assetName: '', assetNameAr: '', barCode: '', modeName: '', periorityName: '', periorityNameAr: '', requestDate: '',
        statusName: '', statusNameAr: '', subject: '', sortStatus: '', modeNameAr: '', description: '', woLastTrackDescription: '', strSerial: '', strSubject: '', strRequestCode: '', periorityId: 0, statusId: 0, strBarCode: '', strModel: '', sortBy: ''
      }
    };

    if (this.lang == "en") {
      this.columnsSelected = "Columns Selected";
      this.cols = [
        //  { field: 'elapsedTime', header: 'Time' },
        { field: 'requestCode', header: 'Request Code' },
        { field: 'assetName', header: 'AssetName' },
        { field: 'barcode', header: 'BarCode' },
        { field: 'serialNumber', header: 'Serial' },
        { field: 'modelNumber', header: 'Model' },
        { field: 'subject', header: 'Subject' },
        { field: 'requestDate', header: 'Date' },
        { field: 'statusName', header: 'Status' },
        { field: 'createdBy', header: 'CreatedBy' },
        { field: 'closedDate', header: 'ClosedDate' },
        { field: 'periorityName', header: 'Periority' },
        { field: 'modeName', header: 'Mode' },
        { field: 'description', header: 'Desc' },
        { field: 'woLastTrackDescription', header: 'WO Desc' }
      ];

    }
    else if (this.lang == "ar") {
      this.columnsSelected = "الأعمدة المختارة";
      this.cols = [
        //{ field: 'elapsedTime', header: 'الوقت' },
        { field: 'requestCode', header: 'رقم الطلب' },
        { field: 'assetNameAr', header: 'اسم الأصل' },
        { field: 'barcode', header: 'الباركود' },
        { field: 'serialNumber', header: 'السيريال' },
        { field: 'modelNumber', header: 'الموديل' },
        { field: 'subject', header: 'الموضوع' },
        { field: 'requestDate', header: 'التاريخ' },
        { field: 'statusNameAr', header: 'الحالة' },
        { field: 'createdBy', header: 'تم بواسطة' },
        { field: 'closedDate', header: 'تاريخ الإغلاق' },
        { field: 'periorityNameAr', header: 'الأولوية' },
        { field: 'modeNameAr', header: 'طريقة الإبلاغ' },
        { field: 'description', header: 'الوصف' },
        { field: 'woLastTrackDescription', header: 'وصف أمر الشغل' }
      ];
    }
    this._selectedColumns = this.cols;
    this.governorateService.GetGovernorates().subscribe(items => {
      this.lstGovernorates = items;
    });

    this.organizationService.GetOrganizations().subscribe(items => {
      this.lstOrganizations = items;
    });

    // if (this.lang == "en") {
    //   this.frozenCols = [
    //     { field: 'requestCode', header: 'Request Code' },
    //     { field: 'assetName', header: 'AssetName' },
    //     { field: 'barcode', header: 'BarCode' },
    //     { field: 'serialNumber', header: 'Serial' },
    //     { field: 'modelNumber', header: 'Model' }
    //   ];
    // }
    // else {
    //   this.frozenCols = [
    //     { field: 'requestCode', header: 'رقم الطلب' },
    //     { field: 'assetNameAr', header: 'اسم الأصل' },
    //     { field: 'barcode', header: 'الباركود' },
    //     { field: 'serialNumber', header: 'السيريال' },
    //     { field: 'modelNumber', header: 'الموديل' }
    //   ];
    // }
    this.requestStatusService.GetRequestStatusByUserId(this.currentUser.id).subscribe(statusObj => {
      this.lstMainStatuses = statusObj.listStatus;
      this.countOpen = statusObj.countOpen;
      this.countApproved = statusObj.countApproved;
      this.countClosed = statusObj.countClosed;
      this.countInProgress = statusObj.countInProgress;
      this.countSolved = statusObj.countSolved;
      this.countAll = statusObj.countAll;
    });

    this.requestPeriorityService.GetAllRequestPeriorties().subscribe(lst => {
      this.lstPeriorities = lst
    });
    this.requestModeService.GetAllRequetsMode().subscribe(lst => {
      this.lstModes = lst
    });

    this.departmentService.GetDepartments().subscribe(items => {
      this.lstDepartments = items;
    });
  }
  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;

    this.sortFilterObjects.searchObj.statusId = this.statusId;
    this.sortFilterObjects.searchObj.userId = this.currentUser.id;
    this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    this.sortFilterObjects.searchObj.hospitalId = this.currentUser.hospitalId;
    this.requestService.ListRequests(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe(items => {
      this.lstRequests = items.results;
      this.count = items.count;
      this.loading = false;
    });


    this.requestService.ExportRequestsByStatusId(this.sortFilterObjects).subscribe(list => {
      this.lstRequests2 = list;
    });
  }
  getCitiesByGovId(govId: number) {
    this.cityService.GetCitiesByGovernorateId(govId).subscribe(cities => {
      this.lstCities = cities;
    });
  }
  getHospitalsBySubOrgId() {
    if (this.sortFilterObjects.searchObj.subOrganizationId != 0) {
      let subOrgId = this.sortFilterObjects.searchObj.subOrganizationId;
      this.hospitalService.GetHospitalsBySubOrganizationId(subOrgId).subscribe(suborgs => {
        this.lstHospitals = suborgs;
      });
    }
  }
  getSubOrgByOrgId($event) {
    this.subOrganizationService.GetSubOrganizationByOrgId($event.target.value).subscribe(suborgs => {
      this.lstSubOrganizations = suborgs;
    });
  }
  reset() {
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
  onSearch() {
    this.sortFilterObjects.searchObj.statusId = this.statusId;
    this.sortFilterObjects.searchObj.userId = this.currentUser.id;
    this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    this.requestService.ListRequests(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe(items => {
      this.lstRequests = items.results;
      this.count = items.count;
      this.loading = false;
    });



    this.requestStatusService.GetRequestStatusByUserId(this.currentUser.id).subscribe(statusObj => {
      this.lstMainStatuses = statusObj.listStatus;
      this.countOpen = statusObj.countOpen;
      this.countApproved = statusObj.countApproved;
      this.countClosed = statusObj.countClosed;
      this.countInProgress = statusObj.countInProgress;
      this.countSolved = statusObj.countSolved;
      this.countAll = statusObj.countAll;
    });
  }
  getAssetsByHospitalId($event) {
    if (this.currentUser.hospitalId == 0 && this.currentUser.organizationId == 0 && this.currentUser.subOrganizationId == 0 && this.currentUser.governorateId == 0 && this.currentUser.cityId == 0) {
      this.masterAssetService.ListMasterAssetsByHospitalId($event.target.value).subscribe(assets => {
        this.lstHospitalAssets = assets;
      });
    }
    else {
      this.masterAssetService.ListMasterAssetsByHospitalUserId($event.target.value, this.currentUser.id).subscribe(assets => {
        this.lstHospitalAssets = assets;
      });
    }
  }
  closeRequest(id: number) {
    const ref = this.dialogService.open(CloseComponent, {
      data: {
        id: id
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
    ref.onClose.subscribe(res => {
      this.reload();
    })
  }
  viewListWorkOrders(requestId: number) {
    const ref = this.dialogService.open(ListWOComponent, {
      data: {
        id: requestId
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

    ref.onClose.subscribe(res => {
      //this.reload();
    })
  }
  printRequest(id: number) {
    const ref = this.dialogService.open(PrintsrComponent, {
      data: {
        id: id
      },
      width: '70%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl",
        "font-family": "sans-serif"
      }
    });
    ref.onClose.subscribe(res => {
      this.reload();
    })
  }
  downloadFile(fileName) {
    var filePath = `${environment.Domain}UploadedAttachments/`;
    this.uploadService.downloadRequestTrackFile(fileName).subscribe(file => {
      var dwnldFile = filePath + 'RequestDocuments/' + fileName;
      if (fileName != "" || fileName != null)
        window.open(dwnldFile);
    })
  }
  addStatus(requestId: number) {
    const dialogRef2 = this.dialogService.open(AddStatusComponent, {
      header: this.lang == "en" ? 'Add Status' : "إضافة بلاغ لعطل لأصل في المستشفى",

      data: {
        requestId: requestId != 0 ? requestId : 0
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

    dialogRef2.onClose.subscribe((res) => {
      this.reload();
    });
  }
  addRequest() {
    const dialogRef2 = this.dialogService.open(CreateComponent, {
      header: this.lang == "en" ? 'Add Ticket' : "إضافة بلاغ عطل لأصل ",
      data: {
        assetDetailId: this.assetDetailId != undefined ? this.assetDetailId : 0
      },
      width: '50%',
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
  editRequest(id: number) {
    const ref = this.dialogService.open(EditComponent, {
      header: this.lang == "en" ? "Edit Ticket" : "تعديل بيانات بلاغ العطل",
      data: {
        id: id,
        statusId: this.statusId
      },
      width: '85%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl",
        "font-family": "sans-serif",
        "font-size": 40
      }
    });
    ref.onClose.subscribe((statusId: number) => {
      this.reload();
    });
  }
  ApproveRequest(id: number) {

    const dialogRef2 = this.dialogService.open(ApproverequestComponent, {
      header: this.lang == "en" ? 'Approve Request' : "تأكيد أو رفض الإصلاح",
      data: {
        id: id
      },
      width: '50%',
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
  deleteRequest(id: number) {

    this.requestService.GetRequestById(id).subscribe((data) => {
      this.selectedObj = data;
      const reqDialog = this.dialog
        .open(DeleteconfirmationComponent, {
          width: '70%',
          autoFocus: true,
          data: {
            id: this.selectedObj.id,
            subject: this.selectedObj.subject
          },
        });

      reqDialog.afterClosed().subscribe(deleted => {
        this.reload();
      });
    });
  }
  viewRequest(id: number) {
    const ref = this.dialogService.open(ViewComponent, {
      header: this.lang == "en" ? 'View Ticket' : "بيانات بلاغ العطل  ",
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

    ref.onClose.subscribe((statusId: number) => {
    });
  }
  addWorkOrder(requestId: number) {

    const ref = this.dialogService.open(CreateWOComponent, {
      header: this.lang == "en" ? 'Add Work Order' : "إضافة بيان الشغل",
      data: {
        requestId: requestId
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
    ref.onClose.subscribe(res => {
      this.reload();
    });

  }
  trackWorkOrder(requestId: number) {
    const ref = this.dialogService.open(TrackworkordersComponent, {
      data: {
        requestId: requestId
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
    ref.onClose.subscribe(res => {
      this.reload();
    });
  }
  reload() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }
  getRequestsByStatusId(id: number, $event) {
    this.statusId = id;
    this.page.pagenumber = 1;

    this.requestStatusService.GetRequestStatusByUserId(this.currentUser.id).subscribe(statusObj => {
      this.lstMainStatuses = statusObj.listStatus;
      this.countOpen = statusObj.countOpen;
      this.countApproved = statusObj.countApproved;
      this.countClosed = statusObj.countClosed;
      this.countInProgress = statusObj.countInProgress;
      this.countSolved = statusObj.countSolved;
      this.countAll = statusObj.countAll;
    });
    this.sortFilterObjects.searchObj.statusId = id;
    this.requestService.ListRequests(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe(items => {
      this.lstRequests = items.results;
      this.count = items.count;
      this.loading = false;
    });


    this.requestService.ExportRequestsByStatusId(this.sortFilterObjects).subscribe(exportReq => {
      this.lstExportRequestsToExcel = exportReq;
    });
  }
  sort(field) {
    if (this.sortStatus == "descending") {
      this.sortStatus = "ascending";
      this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    }
    else {
      this.sortStatus = "descending";
      this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    }

    if (field.currentTarget.id == "Asset Name") {
      this.sortFilterObjects.sortObj.assetName = field.currentTarget.id
    }
    else if (field.currentTarget.id == "اسم الأصل") {
      this.sortFilterObjects.sortObj.assetNameAr = field.currentTarget.id
    }
    if (field.currentTarget.id == "BarCode" || field.currentTarget.id == "الباركود") {
      this.sortFilterObjects.sortObj.barCode = field.currentTarget.id
    }
    if (field.currentTarget.id == "Serial" || field.currentTarget.id == "السيريال") {
      this.sortFilterObjects.sortObj.serial = field.currentTarget.id
    }
    if (field.currentTarget.id == "Subject" || field.currentTarget.id == "الموضوع") {
      this.sortFilterObjects.sortObj.subject = field.currentTarget.id
    }
    if (field.currentTarget.id == "Request Code" || field.currentTarget.id == "رقم الطلب") {
      this.sortFilterObjects.sortObj.requestCode = field.currentTarget.id
    }
    if (field.currentTarget.id == "Date" || field.currentTarget.id == "التاريخ") {
      this.sortFilterObjects.sortObj.requestDate = field.currentTarget.id
    }
    if (field.currentTarget.id == "CreatedBy" || field.currentTarget.id == "تم بواسطة") {
      this.sortFilterObjects.sortObj.createdBy = field.currentTarget.id
    }
    if (field.currentTarget.id == "Periority") {
      this.sortFilterObjects.sortObj.periorityName = field.currentTarget.id
    }
    else if (field.currentTarget.id == "الأولوية") {
      this.sortFilterObjects.sortObj.periorityNameAr = field.currentTarget.id
    }
    if (field.currentTarget.id == "Mode") {
      this.sortFilterObjects.sortObj.modeName = field.currentTarget.id
    }
    else if (field.currentTarget.id == "طريقة الإبلاغ") {
      this.sortFilterObjects.sortObj.modeNameAr = field.currentTarget.id
    }
    else if (field.currentTarget.id == 'Desc' || field.currentTarget.id == 'الوصف') {
      this.sortFilterObjects.sortObj.description = field.currentTarget.id
    }
    else if (field.currentTarget.id == 'WO Desc' || field.currentTarget.id == 'وصف أمر الشغل') {
      this.sortFilterObjects.sortObj.woLastTrackDescription = field.currentTarget.id
    }
    if (field.currentTarget.id == "ClosedDate" || field.currentTarget.id == "تاريخ الإغلاق") {
      this.sortFilterObjects.sortObj.closedDate = field.currentTarget.id
    }
    if (field.currentTarget.id == 'Status') {
      this.sortFilterObjects.sortObj.statusName = field.currentTarget.id
    }
    else if (field.currentTarget.id === "الحاله") {
      this.sortFilterObjects.sortObj.statusNameAr = field.currentTarget.id
    }
    this.sortFilterObjects.searchObj.statusId = this.statusId;
    this.sortFilterObjects.searchObj.userId = this.currentUser.id;
    this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    this.sortFilterObjects.sortObj.sortBy = field.currentTarget.id;
    this.requestService.ListRequests(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe(items => {
      this.lstRequests = items.results;
      this.count = items.count;
      this.loading = false;
    });
  }
  printServiceRequest(id: number) {
    var doc = new jspdf('p', "mm", "a4");
    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    const options: Intl.DateTimeFormatOptions = { month: "long", day: 'numeric', year: 'numeric' };
    this.requestService.PrintServieRequestById(id).subscribe(async woObj => {
      this.printServiceRequestObj = woObj;
      if (this.lang == "en") {

        doc.addFileToVFS('Amiri-Regular', fontAmiri);
        doc.addFont('Amiri-Regular', 'Amiri-Regular', 'normal');
        doc.setFont('Amiri-Regular');



        doc.setFontSize(8);
        // var date = this.datePipe.transform(new Date, "dd-MM-yyyy HH:mm");
        // doc.text("Date : " + date, 10, 10, { "align": "left" });
        var img = new Image();
        img.src = '../../assets/images/' + this.currentUser.strLogo;
        doc.addImage(img, 'PNG', 10, 15, 28, 28);
        var svg = document.getElementById("barcode_" + id);
        let barcodeClass1 = svg.getElementsByClassName("barcode");
        let barcodeImageSrc1 = barcodeClass1[0].children[0].getAttribute('src');
        var barcodeimg = new Image();
        barcodeimg.src = barcodeImageSrc1;
        barcodeimg.width = 100;
        barcodeimg.height = 20;
        doc.addImage(barcodeimg, 'png', 240, 15, 50, 15);
        doc.setFontSize(12);
        var ministry = this.lang == "en" ? this.currentUser.strInsitute : this.currentUser.strInsituteAr; //"Ministry of Health and Population";
        doc.text(ministry, 45, 25, { "align": "left" });
        doc.setFontSize(12);
        doc.text(this.printServiceRequestObj.hospitalName + " Hospital - Ticket", 45, 35, { "align": "left" });
        var assetRows = [];
        assetRows.push(["Asset Name", this.printServiceRequestObj.assetNameAr]);
        assetRows.push(["Serial Number", this.printServiceRequestObj.serialNumber]);
        assetRows.push(["BarCode", this.printServiceRequestObj.assetBarCode]);
        assetRows.push(["Model Number", this.printServiceRequestObj.modelNumber]);
        let wantedTableWidth = 150;
        let pageWidth2 = doc.internal.pageSize.width;
        let margin = (pageWidth2 - wantedTableWidth) / 2;
        doc.autoTable({
          body: assetRows,
          margin: { left: margin, right: margin },
          startY: 55,
          styles: { font: 'ARIALUNI', fontSize: 13, fillColor: '#fff' },
          bodyStyles: { fillColor: '#fff', textColor: '#000' },
          alternateRowStyles: { fillColor: '#fff' }
        });









        doc.setFontSize(12);
        var requestSubject = "Request Subject :" + this.printServiceRequestObj.requestSubject;
        doc.text(requestSubject, 10, 80, { align: 'left' });
        var code = "Request Code: " + this.printServiceRequestObj.requestCode;
        doc.text(code, 80, 80, { align: 'left' });
        var modeName = "Mode: " + this.printServiceRequestObj.modeName;
        doc.text(modeName, 10, 90, { "align": "left" });
        var requestTypeName = "Request Type: " + this.printServiceRequestObj.requestTypeName;
        doc.text(requestTypeName, 80, 90, { "align": "left" });

        if (this.printServiceRequestObj.problemName != "") {
          var problemName = "Problem : " + this.printServiceRequestObj.problemName;
          doc.text(problemName, 10, 100, { "align": "left" });
        }
        if (this.printServiceRequestObj.subProblemName != "") {
          var subProblemName = "Sub Problem: " + this.printServiceRequestObj.subProblemName;
          doc.text(subProblemName, 80, 100, { "align": "left" });
        }
        doc.text("Note : " + this.printServiceRequestObj.requestNote, 10, 110, { "align": "left" });
        var col = ["Status", "Actual Start Date", "Actual End Date", "From", "Assigned To", "Notes"];
        var rows = [];
        var row = [];
        var requestcol = ["Status", "Description", "Date"];
        var requestrows = [];
        var requestrow = [];

        if (this.printServiceRequestObj.requestTrackingList != null) {
          for (let index = 0; index < this.printServiceRequestObj.requestTrackingList.length; index++) {
            const element = this.printServiceRequestObj.requestTrackingList[index];
            var reqDate = this.datePipe.transform(element.descriptionDate, "dd-MM-yyyy HH:mm:ss");
            requestrow = [element.statusName, element.description, reqDate];
            requestrows.push(requestrow);
          }
          //  (doc as any).autoTable(requestcol, requestrows, { startY: 120, styles: { font: 'ARIALUNI' } });

          if (this.printServiceRequestObj.subProblemNameAr != "" && this.printServiceRequestObj.subProblemNameAr != "") {
            (doc as any).autoTable(requestcol, requestrows, { startY: 120, styles: { font: 'ARIALUNI' } });
          }
          else {
            (doc as any).autoTable(requestcol, requestrows, { startY: 110, styles: { font: 'ARIALUNI' } });
          }
        }

        const pageCount = doc.internal.getNumberOfPages();

        let printedBy = "Printed by : " + this.currentUser.userName;
        for (var i = 0; i < pageCount; i++) {
          doc.setPage(i + 1);
          doc.text(printedBy, doc.internal.pageSize.getWidth() - 100, doc.internal.pageSize.getHeight() - 10, { "align": "right" });
          doc.text(String(i + 1) + "/" + String(pageCount), doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 10, { "align": "right" });
        }

        var exportdate = this.datePipe.transform(new Date, "dd-MM-yyyy_HH:mm:ss");
        doc.save('EnPrintServiceRequest_' + exportdate + '.pdf');
      }
      else {
        doc.addFileToVFS('Amiri-Regular', fontAmiri);
        doc.addFont('Amiri-Regular', 'Amiri-Regular', 'normal');
        doc.setFont('Amiri-Regular');
        doc.setFontSize(8);
        // var date = new Intl.DateTimeFormat("ar-EG", options).format(new Date());
        // doc.text(date, 200, 10, { "align": "right" });
        var img = new Image();
        img.src = '../../assets/images/' + this.currentUser.strLogo;
        doc.addImage(img, 'png', 175, 10, 30, 30);


        var svg = document.getElementById("barcode_" + id);
        let barcodeClass1 = svg.getElementsByClassName("barcode");
        let barcodeImageSrc1 = barcodeClass1[0].children[0].getAttribute('src');
        var barcodeimg = new Image();
        barcodeimg.src = barcodeImageSrc1;
        barcodeimg.width = 100;
        barcodeimg.height = 10;
        doc.addImage(barcodeimg, 'png', 20, 15, 50, 15);
        doc.setFontSize(14);
        var ministry = this.lang == "en" ? this.currentUser.strInsitute : this.currentUser.strInsituteAr;//"وزارة الصحة والسكان";
        doc.text(ministry, 180, 20, { "align": "right" });
        doc.setFontSize(14);
        var hospital = this.printServiceRequestObj.hospitalNameAr;
        doc.text(hospital, 180, 30, { "align": "right" });
        doc.setFontSize(14);
        var title = "Service Call طلب استدعاء للصيانة";
        doc.text(title, pageWidth / 2, 50, { align: 'center' });

        var assetRows = [];
        assetRows.push([this.printServiceRequestObj.assetNameAr, "اسم الأصل"]);
        assetRows.push([this.printServiceRequestObj.serialNumber, "الرقم التسلسلي"]);
        assetRows.push([this.printServiceRequestObj.assetBarCode, "الباركود"]);
        assetRows.push([this.printServiceRequestObj.modelNumber, "الموديل"]);
        let wantedTableWidth = 150;
        let pageWidth2 = doc.internal.pageSize.width;
        let margin = (pageWidth2 - wantedTableWidth) / 2;
        doc.autoTable({
          body: assetRows,
          margin: { left: margin, right: margin },
          startY: 55,
          styles: { font: 'Amiri-Regular', fontSize: 13, halign: 'right', fillColor: '#fff', fontStyles: { font: 'Amiri-Regular', halign: 'right' } },
          bodyStyles: { fillColor: '#fff', textColor: '#000', font: 'Amiri-Regular', halign: 'right' },
          alternateRowStyles: { fillColor: '#fff', font: 'Amiri-Regular', halign: 'right' },
          columnStyle: { halign: 'right' }
        });

        doc.setFontSize(12);
        if (this.printServiceRequestObj.buildingNameAr != undefined) {

          var build = this.printServiceRequestObj.buildingNameAr + " : المبنى ";
          doc.text(build, 200, 100, { align: 'right' });
        }
        else {

          var build = " : المبنى ";
          doc.text(build, 200, 100, { align: 'right' });
        }


        if (this.printServiceRequestObj.floorNameAr != undefined) {
          var floor = this.printServiceRequestObj.floorNameAr + " :  الدور ";
          doc.text(floor, 130, 100, { align: 'right' });
        }
        else {
          var floor = " :  الدور ";
          doc.text(floor, 130, 100, { align: 'right' });
        }



        if (this.printServiceRequestObj.roomNameAr != undefined) {

          var room = this.printServiceRequestObj.roomNameAr + " :  الغرفة ";
          doc.text(room, 80, 100, { align: 'right' });
        }
        else {
          var room = " :  الغرفة ";
          doc.text(room, 80, 100, { align: 'right' });
        }

        doc.setFontSize(12);
        var requestSubject = this.printServiceRequestObj.requestSubject + " :موضوع  بلاغ العطل";
        doc.text(requestSubject, 200, 110, { align: 'right' });
        var code = this.printServiceRequestObj.requestCode + " :رقم  بلاغ العطل";
        doc.text(code, 80, 110, { align: 'right' });

        var modeNameAr = "الوضع: " + this.printServiceRequestObj.modeNameAr;
        doc.text(modeNameAr, 200, 120, { "align": "right" });
        var requestTypeNameAr = "النوع: " + this.printServiceRequestObj.requestTypeNameAr;
        doc.text(requestTypeNameAr, 80, 120, { "align": "right" });





        var openRequestDate = new Intl.DateTimeFormat("ar-EG", options).format(new Date(this.printServiceRequestObj.requestDate));
        doc.text("تاريخ البلاغ : " + openRequestDate, 200, 130, { "align": "right" });

        doc.text("ملاحظات", 200, 140, { "align": "right" });
        doc.text(this.printServiceRequestObj.requestNote, 200, 150, { "align": "right" });

        if (this.printServiceRequestObj.problemNameAr != "") {
          var problemNameAr = "المشكلة : " + this.printServiceRequestObj.problemNameAr;
          doc.text(problemNameAr, 200, 160, { "align": "right" });
        }
        if (this.printServiceRequestObj.subProblemNameAr != "") {
          var subProblemNameAr = "المشكلة الفرعية: " + this.printServiceRequestObj.subProblemNameAr;
          doc.text(subProblemNameAr, 80, 160, { "align": "right" });
        }



        const requestcol = [{
          content: 'الوضع',
          styles: { fontStyle: 'Amiri-Regular' },
        },
        {
          content: 'الوصف',
          styles: { fontStyle: 'Amiri-Regular' },
        },
        {
          content: 'التاريخ',
          styles: { fontStyle: 'Amiri-Regular' },
        }
        ];
        var requestrows = [];
        var requestrow = [];
        if (this.printServiceRequestObj.requestTrackingList != null) {
          for (let index = 0; index < this.printServiceRequestObj.requestTrackingList.length; index++) {
            const element = this.printServiceRequestObj.requestTrackingList[index];
            var reqDate = new Intl.DateTimeFormat("ar-EG", options).format(new Date(element.descriptionDate));
            requestrow = [element.statusNameAr, element.description, reqDate];
            requestrows.push(requestrow);
          }
          if (this.printServiceRequestObj.subProblemNameAr != "" && this.printServiceRequestObj.subProblemNameAr != "") {
            (doc as any).autoTable(requestcol, requestrows, { startY: 170, styles: { font: 'Amiri-Regular', halign: 'right' } });
          }
          else {
            (doc as any).autoTable(requestcol, requestrows, { startY: 160, styles: { font: 'Amiri-Regular', halign: 'right' } });
          }
        }



        let finalY = doc.lastAutoTable.finalY + 15; // The y position on the page


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




        const pageCount = doc.internal.getNumberOfPages();

        let printedBy = this.currentUser.userName + " تمت الطباعة بواسطة ";
        for (var i = 0; i < pageCount; i++) {
          doc.setPage(i + 1);
          doc.text(printedBy, doc.internal.pageSize.getWidth() - 100, doc.internal.pageSize.getHeight() - 10, { "align": "right" });
          doc.text(String(i + 1) + "/" + String(pageCount), doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 10, { "align": "right" });
        }

        var exportdate = this.datePipe.transform(new Date, "dd-MM-yyyy_HH:mm:ss");
        doc.save('ArPrintServiceRequest_' + exportdate + '.pdf');
      }

    });
  }
  getBarCode(event) {
    this.sortFilterObjects.searchObj.barcode = event["barCode"];
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
    else if (this.sortFilterObjects.searchObj.hospitalId > 0) {
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
  clearAssetSerailNumber() {
    this.sortFilterObjects.searchObj.serialNumber = "";
  }
  clearAssetBarCode() {
    this.sortFilterObjects.searchObj.barcode = "";
  }
  checkedRequest($event, id: number) {
    if ($event.checked) {
      this.lstRequestIds.push(id);
      this.requestService.GetRequestById2(id).subscribe((item) => {
        this.checkedRequest2 = item;
        this.lstCheckedRequests.push(this.checkedRequest2);
      });

      this.requestService.GetExportRequestById(id).subscribe((item) => {
        this.exportCheckedRequest = item;
        this.lstExportCheckedRequests.push(this.exportCheckedRequest);
      });
    }
    else {
      var index = this.lstRequestIds.indexOf(id);
      this.lstRequestIds.splice(index, 1);
      for (let i = 0; i < this.lstCheckedRequests.length; i++) {
        id = this.lstCheckedRequests[i].id;
        this.lstCheckedRequests.splice(index, 1);
      }
      for (let i = 0; i < this.lstExportCheckedRequests.length; i++) {
        id = this.lstExportCheckedRequests[i].id;
        this.lstExportCheckedRequests.splice(index, 1);
      }
    }
  }
  exportExcel() {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Request');
    if (this.lang == "en") {
      worksheet.columns = [
        { header: 'Request Number', key: 'requestCode' },
        { header: 'Asset Name', key: 'assetName' },
        { header: 'Barcode', key: 'barcode' },
        { header: 'Serial', key: 'serialNumber', width: 10 },
        { header: 'Model', key: 'modelNumber', width: 10 },
        { header: 'Supplier', key: 'supplierName', width: 10 },
        { header: 'Date', key: 'creationDate' },
        { header: 'Closed Date', key: 'closedDate', width: 15 },
        { header: 'Notes', key: 'requestTrackDescription', width: 20 },
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
      if (this.lstExportRequestsToExcel.length == 0) {

        this.lstExportRequestsToExcel.forEach((e, index) => {
          var creationDate = this.datePipe.transform(e.creationDate, "dd/MM/yyyy");
          var closedDate = this.datePipe.transform(e.closedDate, "dd/MM/yyyy");
          var row = worksheet.addRow({
            requestCode: e.requestCode,
            assetName: e.assetName,
            barcode: e.barcode,
            serialNumber: e.serialNumber,
            modelNumber: e.modelNumber,
            supplierName: e.supplierName,
            creationDate: creationDate,
            closedDate: closedDate,
            requestTrackDescription: e.requestTrackDescription,
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
          row.eachCell(function (cell) {
            cell.alignment = { horizontal: 'right' };
          });
        });
        workbook.xlsx.writeBuffer().then((lstExportRequestsToExcel) => {
          let blob = new Blob([lstExportRequestsToExcel], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
          fs.saveAs(blob, 'Request_' + today + '.xlsx');
        });
      }
      if (this.lstCheckedRequests.length > 0) {
        this.lstCheckedRequests.forEach(e => {
          var creationDate = this.datePipe.transform(e.requestDate, "dd/MM/yyyy");
          var closedDate = this.datePipe.transform(e.closedDate, "dd/MM/yyyy");
          worksheet.addRow({
            requestCode: e.requestCode,
            assetName: e.assetName,
            barcode: e.barcode,
            serialNumber: e.serialNumber,
            modelNumber: e.modelNumber,
            supplierName: e.supplierName,
            creationDate: creationDate,
            closedDate: closedDate,
            requestTrackDescription: e.requestTrackDescription,
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

        workbook.xlsx.writeBuffer().then((lstCheckedRequests) => {
          let blob = new Blob([lstCheckedRequests], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
          fs.saveAs(blob, 'Request_' + today + '.xlsx');
        });
      } else {
        this.lstRequests2.forEach(e => {
          var creationDate = this.datePipe.transform(e.requestDate, "dd/MM/yyyy");
          var closedDate = this.datePipe.transform(e.closedDate, "dd/MM/yyyy");
          worksheet.addRow({
            requestCode: e.requestCode,
            assetName: e.assetName,
            barcode: e.barcode,
            serialNumber: e.serialNumber,
            modelNumber: e.modelNumber,
            supplierName: e.supplierName,
            creationDate: creationDate,
            closedDate: closedDate,
            requestTrackDescription: e.requestTrackDescription,
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

        workbook.xlsx.writeBuffer().then((lstRequests2) => {
          let blob = new Blob([lstRequests2], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
          fs.saveAs(blob, 'Request_' + today + '.xlsx');
        });

        //  this.lstCheckedRequests = [];
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
        { header: 'ملاحظات', key: 'requestTrackDescription', width: 20 },
        { header: 'تاريخ الإغلاق', key: 'closedDate', width: 15 },
        { header: 'تاريخ البداية', key: 'creationDate', width: 15 },
        { header: 'المورد', key: 'supplierNameAr', width: 10 },
        { header: 'الموديل', key: 'modelNumber', width: 10 },
        { header: 'السيريال', key: 'serialNumber', width: 10 },
        { header: 'الباركود', key: 'barcode', width: 10 },
        { header: 'اسم الأصل', key: 'assetNameAr', width: 50 },
        { header: 'رقم بلاغ العطل', key: 'requestCode', width: 15 }
      ];


      if (this.statusId > 0 && this.lstExportRequestsToExcel.length > 0 && this.lstCheckedRequests.length == 0) {
        this.lstExportRequestsToExcel.forEach((e, index) => {
          var creationDate = this.datePipe.transform(e.creationDate, "dd/MM/yyyy");
          var closedDate = this.datePipe.transform(e.closedDate, "dd/MM/yyyy");
          var row = worksheet.addRow({
            requestCode: e.requestCode,
            assetNameAr: e.assetName,
            barcode: e.barcode,
            serialNumber: e.serialNumber,
            modelNumber: e.modelNumber,
            supplierName: e.supplierNameAr,
            creationDate: creationDate,
            closedDate: closedDate,
            requestTrackDescription: e.requestTrackDescription,
            status: e.statusNameAr,
            brandNameAr: e.brandNameAr,
            departmentNameAr: e.departmentNameAr,
            warrantyStart: e.warrantyStart,
            warrantyEnd: e.warrantyEnd,
            warrantyExpires: e.warrantyExpires,
            purchaseDate: e.purchaseDate,
            installationDate: e.installationDate,
            operationDate: e.operationDate,
            receivingDate: e.receivingDate,
            buildNameAr: e.buildingNameAr,
            floorNameAr: e.floorNameAr,
            roomNameAr: e.roomNameAr,
            depreciationRate: e.depreciationRate,
            poNumber: e.poNumber,
            costCenter: e.costCenter,
            price: e.price,
            remarks: e.remarks
          }, "n");
          row.eachCell(function (cell) {
            cell.alignment = { horizontal: 'right' };
          });
        });
        workbook.xlsx.writeBuffer().then((lstExportRequestsToExcel) => {
          let blob = new Blob([lstExportRequestsToExcel], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
          fs.saveAs(blob, 'Request_' + today + '.xlsx');
        });
      }
      else if (this.lstCheckedRequests.length > 0) {
        this.lstCheckedRequests.forEach(e => {
          var creationDate = this.datePipe.transform(e.requestDate, "dd/MM/yyyy");
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
            requestTrackDescription: e.requestTrackDescription,
            closedDate: closedDate,
            creationDate: creationDate,
            supplierNameAr: e.supplierNameAr,
            modelNumber: e.modelNumber,
            serialNumber: e.serialNumber,
            barcode: e.barcode,
            assetNameAr: e.assetNameAr,
            requestCode: e.requestCode

          }, "n");

          row.eachCell(function (cell) {
            cell.alignment = { horizontal: 'right' };
          });
        });

        workbook.xlsx.writeBuffer().then((lstCheckedRequests) => {
          let blob = new Blob([lstCheckedRequests], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
          fs.saveAs(blob, 'Request_' + today + '.xlsx');
        });


        //    this.lstCheckedRequests = [];
      }
      else if (this.lstCheckedRequests.length == 0 && this.statusId == 0 && this.lstExportRequestsToExcel.length == 0) {
        this.lstRequests2.forEach(e => {
          var creationDate = this.datePipe.transform(e.requestDate, "dd/MM/yyyy");
          var closedDate = this.datePipe.transform(e.closedDate, "dd/MM/yyyy");
          //   worksheet.addRow({ status: e.statusNameAr, creationDate: creationDate, assetNameAr: e.assetNameAr, barCode: e.barcode, requestCode: e.requestCode }, "n");

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
            notes: e.description,
            closedDate: closedDate,
            creationDate: creationDate,
            supplierNameAr: e.supplierNameAr,
            modelNumber: e.modelNumber,
            serialNumber: e.serialNumber,
            barcode: e.barcode,
            assetNameAr: e.assetNameAr,
            requestCode: e.requestCode
          }, "n");

          row.eachCell(function (cell) {
            cell.alignment = { horizontal: 'right' };
          });
        });

        workbook.xlsx.writeBuffer().then((lstRequests2) => {
          let blob = new Blob([lstRequests2], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
          fs.saveAs(blob, 'Request_' + today + '.xlsx');
        });
      }
    }
  }
  generatePDF() {
    this.sortFilterObjects.searchObj.userId = this.currentUser.id;
    if (this.sortFilterObjects.searchObj.strStartDate == "") {
      this.sortFilterObjects.searchObj.strStartDate = this.datePipe.transform(new Date("01/01/1900"), "MM-dd-yyyy");
    }
    if (this.sortFilterObjects.searchObj.strEndDate == "") {
      this.sortFilterObjects.searchObj.strEndDate = this.datePipe.transform(new Date(), "MM-dd-yyyy");
    }



    if (this.lstExportCheckedRequests.length > 0) {
      this.requestService.CreateServiceRequestGeneratePDF(this.lstExportCheckedRequests).subscribe(list => {
        let fileName = "CreateSRCheckedReport.pdf";
        var filePath = `${environment.FilePath}UploadedAttachments/SRReports/`;
        this.uploadService.downloadCreateServiceRequestCheckedPDF(fileName).subscribe(file => {
          var dwnldFile = filePath + fileName;
          if (fileName != "" || fileName != null)
            window.open(dwnldFile);
        });
      });
      this.lstExportCheckedRequests = [];
    }
    else {
      this.sortFilterObjects.searchObj.statusId = this.statusId;
      this.sortFilterObjects.searchObj.lang = this.lang;
      this.sortFilterObjects.searchObj.printedBy = this.currentUser.userName;
      this.sortFilterObjects.searchObj.hospitalNameAr = this.currentUser.hospitalNameAr;
      this.sortFilterObjects.searchObj.hospitalName = this.currentUser.hospitalName;

      this.requestService.CreateServiceRequestPDF(this.sortFilterObjects.searchObj).subscribe(list => {
        let fileName = "CreateSRReport.pdf";
        var filePath = `${environment.FilePath}UploadedAttachments/SRReports/`;
        this.uploadService.downloadCreateServiceRequestPDF(fileName).subscribe(file => {
          var dwnldFile = filePath + fileName;
          if (fileName != "" || fileName != null)
            window.open(dwnldFile);
        });
      });
    }
  }
  printSelectedColumns() {
    // Print selected columns with data
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('RequestSelected');

    // Set header row with selected column names
    const headerRow = this._selectedColumns.map(col => col.header);
    worksheet.addRow(headerRow);

    // Add data rows
    if (this.lstExportCheckedRequests.length > 0) {

      this.lstExportCheckedRequests.forEach(row => {
        const dataRow = this._selectedColumns.map(col => row[col.field]);
        var data = worksheet.addRow(dataRow);

        data.eachCell(function (cell) {
          cell.alignment = { horizontal: 'right', wrapText: false };
        });
      });
      workbook.xlsx.writeBuffer().then((lstExportCheckedRequests) => {
        let blob = new Blob([lstExportCheckedRequests], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
        fs.saveAs(blob, 'SelectedColumnRequest_' + today + '.xlsx');
      });
    }
    else if (this.lstExportCheckedRequests.length == 0) {
      this.lstRequests2.forEach(row => {
        const dataRow = this._selectedColumns.map(col => row[col.field]);
        var data = worksheet.addRow(dataRow);

        data.eachCell(function (cell) {
          cell.alignment = { horizontal: 'right', wrapText: false };
        });
      });


      // Generate Excel file
      workbook.xlsx.writeBuffer().then(buffer => {
        const today = this.datePipe.transform(new Date(), 'dd/MM/yyyy_HH:mm:ss');
        const fileName = `SelectedColumnRequest_${today}.xlsx`;
        const excelFile = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        fs.saveAs(excelFile, fileName);
      });
    }
  }
  clearSearch() {

    this.lstRequests = [];
    this.count = 0;
    this.lstassetDetailBarcodes = [];
    this.lstAssetSerailNumberObj = [];
    this.lstRequests = [];
    if (this.currentUser.hospitalId == 0) {
      this.sortFilterObjects.searchObj.governorateId = 0;
      this.sortFilterObjects.searchObj.cityId = 0;
      this.sortFilterObjects.searchObj.organizationId = 0;
      this.sortFilterObjects.searchObj.subOrganizationId = 0;
      this.sortFilterObjects.searchObj.hospitalId = 0;
    }

    this.sortFilterObjects.searchObj.start = "";
    this.sortFilterObjects.searchObj.end = "";
    this.sortFilterObjects.searchObj.statusId = 0;
    this.sortFilterObjects.searchObj.userId = this.currentUser.id;
    this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    this.sortFilterObjects.searchObj.departmentId = 0;
    this.sortFilterObjects.searchObj.assetOwnerId = 0;
    this.sortFilterObjects.searchObj.barcode = "";
    this.assetBarCodeObj = null;
    this.sortFilterObjects.searchObj.serialNumber = "";
    this.assetSerailNumberObj = null;
    this.sortFilterObjects.searchObj.masterAssetId = 0;
    this.sortFilterObjects.searchObj.userId = this.currentUser.id;
    this.requestService.ListRequests(this.sortFilterObjects, 1, 10).subscribe(items => {
      this.lstRequests = items.results;
      this.count = items.count;
      this.loading = false;
    });
  }
}
