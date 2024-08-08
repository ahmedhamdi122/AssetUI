import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ListApplicationTypeVM } from 'src/app/Shared/Models/applicationtype';
import { EditHospitalApplicationVM, ListHospitalApplicationVM, SortAndFilterHospitalApplicationVM, SortHospitalAppVM } from 'src/app/Shared/Models/hospitalApplicationVM';
import { HospitalSuplierStatus } from 'src/app/Shared/Models/HospitalSuplierStatusVM';
import { Paging } from 'src/app/Shared/Models/paging';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { ApplicationTypeService } from 'src/app/Shared/Services/applicationtype.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { HospitalApplicationService } from 'src/app/Shared/Services/hospitalapplication.service';
import { HospitalSuplierStatusService } from 'src/app/Shared/Services/hospitalsuplierstatus.service';
import { DeleteconfirmationComponent } from '../deleteconfirmation/deleteconfirmation.component';
import { ExecludedateComponent } from '../execludedate/execludedate.component';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { DepartmentService } from 'src/app/Shared/Services/department.service';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { AssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { ListMasterAssetVM } from 'src/app/Shared/Models/masterAssetVM';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { ListDepartmentVM } from 'src/app/Shared/Models/departmentVM';
import { CityService } from 'src/app/Shared/Services/city.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { BrandService } from 'src/app/Shared/Services/brand.service';
import { ListBrandVM } from 'src/app/Shared/Models/brandVM';
import { ViewComponent } from '../view/view.component';
import { CreateComponent } from '../create/create.component';
import { DetailsComponent } from '../../hospital-assets/details/details.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  lang = localStorage.getItem("lang");
  lstRoleNames: string[] = [];
  isSupplierHospital: boolean = false;
  isMember: boolean = false;
  textDir: string = 'ltr';
  currentUser: LoggedUser;
  selectedObj: EditHospitalApplicationVM;
  lstHospitalApplications: ListHospitalApplicationVM[] = [];
  lstTypes: ListApplicationTypeVM[] = [];
  selectedAppType: number = 1;
  page: Paging;
  hospitalCount: number = 0;
  isHospital: boolean = false;
  diffMonths: any;
  isHospitalExcludeAsset: boolean = false;
  sortStatus: string = "ascending";
  sortObj: SortHospitalAppVM;
  // lstStatuses: ListHospitalSuplierStatusVM;

  lstStatuses: HospitalSuplierStatus[] = [];

  selectedItem: string;

  openStatus: number;
  approveStatus: number;
  rejectStatus: number;
  systemRejectStatus: number;
  statusId: number = 0;
  toggle: boolean = false;
  sortFilterObjects: SortAndFilterHospitalApplicationVM;


  lstassetDetailBarcodes: AssetDetailVM[] = [];
  lstAssetSerailNumberObj: AssetDetailVM[] = [];
  assetSerailNumberObj: AssetDetailVM;
  assetBarCodeObj: any;

  lstHospitalAssets: ListMasterAssetVM[] = [];
  lstGovernorates: ListGovernorateVM[];
  lstCities: ListCityVM[];
  lstOrganizations: ListOrganizationVM[];
  lstSubOrganizations: ListSubOrganizationVM[];
  lstHospitals: ListHospitalVM[] = [];
  lstMasterAssets: ListMasterAssetVM[] = [];
  lstDepartments: ListDepartmentVM[] = [];
  lstBrands: ListBrandVM[] = [];


  constructor(private authenticationService: AuthenticationService, private hospitalSuplierStatusService: HospitalSuplierStatusService,
    private hospitalApplicationService: HospitalApplicationService, private applicationTypeService: ApplicationTypeService, private brandService: BrandService,
    private hospitalService: HospitalService, private governorateService: GovernorateService, private cityService: CityService,
    private assetDetailService: AssetDetailService, private masterAssetService: MasterAssetService, private departmentService: DepartmentService,
    private dialog: MatDialog, private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute, private route: Router, public dialogService: DialogService
  ) {

    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    this.sortFilterObjects = {
      searchObj: {
        endDate: new Date, lang: '', startDate: new Date, strEndDate: '', strStartDate: '', userId: '', statusId: 0,
        appTypeId: 0, hospitalName: '', hospitalNameAr: '', printedBy: '', assetName: '', brandId: 0, originId: 0, serial: '', supplierId: 0, masterAssetId: 0, modelNumber: '', serialNumber: '', code: '', periorityId: 0, cityId: 0, governorateId: 0, hospitalId: 0, barCode: '', subject: '', start: '', end: '', departmentId: 0
      },
      sortObj: {
        sortBy: '', barCode: '', modelNumber: '', serialNumber: '', appNumber: '', statusName: '', statusNameAr: '', assetNameAr: '', assetName: '', date: '', dueDate: '',
        ReasonHoldTitles: '', ReasonHoldTitlesAr: '', sortStatus: '', reasonExTitles: '', reasonExTitlesAr: '', appDate: '', typeName: '', typeNameAr: ''
      }
    }

    this.governorateService.GetGovernorates().subscribe(items => {
      this.lstGovernorates = items;
    });
    this.departmentService.GetDepartments().subscribe(items => {
      this.lstDepartments = items;
    });
    this.brandService.GetBrands().subscribe(items => {
      this.lstBrands = items;
    });


    // this.lstStatuses = {  }
    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });

      this.isMember = (['Admin', 'Member'].some(r => this.lstRoleNames.includes(r)));
      this.isHospital = (['Admin', 'TLHospitalManager',].some(r => this.lstRoleNames.includes(r)));
      this.isHospitalExcludeAsset = (['Admin', 'HospitalExcludeAsset'].some(r => this.lstRoleNames.includes(r)));
    }
    this.page = {
      pagenumber: 1,
      pagesize: 10,
    }

    this.applicationTypeService.GetApplicationTypes().subscribe(types => {
      this.lstTypes = types;
    });

    if (this.currentUser.supplierId == 0 && this.currentUser.hospitalId > 0) {
      this.isHospital = true;
    }

    if (this.currentUser.commetieeMemberId > 0 && this.currentUser.supplierId == 0 && this.currentUser.hospitalId == 0) {
      this.isHospital = false;
    }

    this.statusId = 1;

    this.hospitalSuplierStatusService.GetAllStatus(this.selectedAppType, this.currentUser.hospitalId).subscribe(statuses => {
      this.lstStatuses = statuses.listStatus;
      this.openStatus = statuses["openStatus"];
      this.approveStatus = statuses["approveStatus"];
      this.rejectStatus = statuses["rejectStatus"];
      this.systemRejectStatus = statuses["systemRejectStatus"];
    });

    const translationKeys = ['Asset.AssetTransfer', 'Asset.Execludes', 'Asset.HospitalExeclude'];
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);
  }
  onTypeChange($event) {
    this.selectedItem = $event.value;
    this.hospitalSuplierStatusService.GetAllStatus(this.selectedAppType, this.currentUser.hospitalId).subscribe(statuses => {
      this.lstStatuses = statuses.listStatus;
      this.openStatus = statuses["openStatus"];
      this.approveStatus = statuses["approveStatus"];
      this.rejectStatus = statuses["rejectStatus"];
      this.systemRejectStatus = statuses["systemRejectStatus"];
    });
    this.sortFilterObjects.searchObj.appTypeId = Number(this.selectedItem);
    this.hospitalApplicationService.ListHospitalApplications(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize)
      .subscribe(items => {
        this.hospitalCount = items.count;
        this.lstHospitalApplications = items.results;
      });

  }
  clickHospital(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;

    this.sortFilterObjects.searchObj.appTypeId = this.selectedAppType;
    this.sortFilterObjects.searchObj.statusId = this.statusId;
    this.sortFilterObjects.searchObj.userId = this.currentUser.id;
    this.hospitalApplicationService.ListHospitalApplications(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize)
      .subscribe(items => {
        this.hospitalCount = items.count;
        this.lstHospitalApplications = items.results;
      });
  }
  updateExecludeDate(id: number) {
    const ref = this.dialogService.open(ExecludedateComponent, {
      //  header: this.lang == "en" ? 'Update Execlude / Hold Date' : "تعديل تاريخ الاستبعاد  أو الايقاف",
      data: {
        id: id,
        selectedItem: this.selectedItem
      },
      width: '60%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });

    ref.onClose.subscribe(res => {
      this.reload();
    });
  }
  getAllHospitalByStatus(id: number) {

    this.statusId = id;
    this.lstHospitalApplications = [];
    this.hospitalApplicationService.ListHospitalApplications(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize)
      .subscribe(items => {
        this.hospitalCount = items.count;
        this.lstHospitalApplications = items.results;
      });
  }
  reload() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }
  sortHospitalExcludes(field) {

    if (this.sortStatus === "descending") {
      this.sortStatus = "ascending";
      this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    }
    else {
      this.sortStatus = "descending"
      this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    }


    this.sortFilterObjects.sortObj.sortBy = field.currentTarget.id;

    this.hospitalApplicationService.ListHospitalApplications(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize)
      .subscribe(items => {
        this.hospitalCount = items.count;
        this.lstHospitalApplications = items.results;
      });
  }
  Delete(id: number) {
    this.hospitalApplicationService.GetHospitalApplicationById(id).subscribe((data) => {
      this.selectedObj = data;

      const dialogRef2 = this.dialog.open(DeleteconfirmationComponent, {
        width: '30%',
        autoFocus: true,
        data: {
          id: this.selectedObj.id,
          appNumber: this.selectedObj.appNumber,
          appDate: this.selectedObj.appDate,
          assetId: this.selectedObj.assetId
        },
      });

      dialogRef2.afterClosed().subscribe(deleted => {
        this.reload();
      });

    });
  }
  getCitiesByGovId(govId: number) {
    this.cityService.GetCitiesByGovernorateId(govId).subscribe(cities => {
      this.lstCities = cities;
    });
  }
  getHospitalsByCityId($event) {
    this.hospitalService.GetHospitalsByCityId($event.target.value).subscribe(hosts => {
      this.lstHospitals = hosts;

    });
  }
  getBarCode(event) {
    this.sortFilterObjects.searchObj.barCode = event["barCode"];
  }
  onSelectionChanged(event) {
    if (this.currentUser.hospitalId != 0) {
      this.assetDetailService.AutoCompleteAssetBarCode(event.query, this.currentUser.hospitalId).subscribe(assets => {
        this.lstassetDetailBarcodes = assets;
        this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);

      });
    }
    else if (this.sortFilterObjects.searchObj.hospitalId > 0) {
      this.assetDetailService.AutoCompleteAssetBarCode(event.query, this.sortFilterObjects.searchObj.hospitalId).subscribe(assets => {
        this.lstassetDetailBarcodes = assets;
        this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);

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
  onSearch() {
    this.sortFilterObjects.searchObj.hospitalId = this.sortFilterObjects.searchObj.hospitalId;
    this.hospitalApplicationService.ListHospitalApplications(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize)
      .subscribe(items => {
        this.hospitalCount = items.count;
        this.lstHospitalApplications = items.results;
      });
  }
  viewHospitalApp(id: number) {
    const ref = this.dialogService.open(ViewComponent, {
      header: this.lang == "en" ? 'View Hospital Excludes' : " بيانات الاستبعاد",
      data: {
        id: id
      },
      width: '70%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });
    ref.onClose.subscribe(res => {
      this.reload();
    });
  }
  addHospitalApp() {
    const ref = this.dialogService.open(CreateComponent, {
      header: this.lang == "en" ? 'Add hospital asset to excludes' : "إضافة جهاز للإستبعاد",
      width: '70%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });
    ref.onClose.subscribe(res => {
      this.reload();
    });
  }

  viewAssetDetail(id: number) {
    const ref = this.dialogService.open(DetailsComponent, {
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
    })
  }
}
