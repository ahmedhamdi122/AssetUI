import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { ListBrandVM } from 'src/app/Shared/Models/brandVM';
import { ListDepartmentVM } from 'src/app/Shared/Models/departmentVM';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { Paging } from 'src/app/Shared/Models/paging';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { BrandService } from 'src/app/Shared/Services/brand.service';
import { CityService } from 'src/app/Shared/Services/city.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { ListAssetStatusVM } from 'src/app/Shared/Models/assetStatusVM';
import { DepartmentService } from 'src/app/Shared/Services/department.service';
import { WNPMAssetTimeService } from 'src/app/Shared/Services/wnPMAssetTime.service';
import { FilterAssetTimeVM, ListManfacturerPMAssetVM, MainClass, SearchManfacturerAssetTimeVM, SortManfacturerPMAssetTimeVM, ViewManfacturerPMAssetTimeVM } from 'src/app/Shared/Models/manfacturerPMAssetVM'
import { ManfacturerpmassetsService } from 'src/app/Shared/Services/manfacturerpmassets.service';
import { FiscalYearQuarters, ListWNPMAssetTimeVM, YearQuarters } from 'src/app/Shared/Models/wnPMAssetTimeVM';
import { AssetDetailVM, ViewAssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { ViewComponent } from '../view/view.component';
import { AddpmdoneComponent } from '../addpmdone/addpmdone.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  filterObj: FilterAssetTimeVM;
  lstAssetTime: ListManfacturerPMAssetVM[] = [];
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  searchForm: FormGroup;
  errorDisplay: boolean = false;
  errorMessage: string;
  public show: boolean = false;
  public buttonName: any = 'Show';
  lstManfacturerAllAssetsTime: MainClass;
  lstGovernorates: ListGovernorateVM[] = [];
  lstCities: ListCityVM[] = [];
  lstOrganizations: ListOrganizationVM[] = [];
  lstSubOrganizations: ListSubOrganizationVM[] = [];
  lstBrands: ListBrandVM[];
  lstDepartments: ListDepartmentVM[] = [];
  lstHospitals: ListHospitalVM[] = [];
  isHospital: boolean = false;
  page: Paging;
  count: number = 0;
  totalcount: number = 0;
  countDone: number = 0;
  countNotDone: number = 0;
  govName: string = "";
  cityName: string = "";
  orgName: string = "";
  subOrgName: string = "";
  cityId: number;
  showGov: boolean = false;
  showCity: boolean = false;
  showOrg: boolean = false;
  showSubOrg: boolean = false;
  showSupplier: boolean = false;
  showBrand: boolean = false;
  showAdd: boolean = false;
  showEdit: boolean = false;
  showDelete: boolean = false;
  showView: boolean = false;
  showSR: boolean = false;
  isDE: boolean = false;
  isHospital2: boolean = false;
  isAssetOwner: boolean = false;
  isEngManager: boolean = false;
  isHospitalManager: boolean = false;
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  lstRoleNames: string[] = [];
  sortObj: SortManfacturerPMAssetTimeVM;
  sortStatus: string = "ascending";
  direction: string = 'ltr';
  selectedLang: string;
  lstStatuses: ListAssetStatusVM[] = [];
  lstMainStatuses: ListAssetStatusVM[] = [];
  printedBy: string;
  value: string
  qrId: string
  public height = 70;
  public width = 70;
  public padding = 0;
  color = '';
  isGov: boolean = false;
  isCity: boolean = false;
  isOrg: boolean = false;
  isSubOrg: boolean = false;
  showHospital: boolean = false;
  loading: boolean = true;
  statusId: number = 0;
  hospitalId: number = 0;
  cols: any[];
  _selectedColumns: any[];
  columnsSelected: string = "";
  lstassetDetailBarcodes: AssetDetailVM[] = [];
  lstAssetSerailNumberObj: AssetDetailVM[] = [];
  assetSerailNumberObj: AssetDetailVM;
  assetBarCodeObj: AssetDetailVM;
  lsAssetIds: number[] = [];
  totalAssets: number = 0;
  searchObj: SearchManfacturerAssetTimeVM;
  lstHospitalAssets: ViewAssetDetailVM[] = [];
  displayAssetTimeObj: boolean = false;
  assetTimeObj: ViewManfacturerPMAssetTimeVM;

  thisYear: number;
  lastYear: number;
  showDelayDate: boolean = false;
  showDoneDate: boolean = false;
  clickedItem: any = 1 | 2 | 3 | 4;
  statusItem: any = 0 | 1 | 2;

  isDone: boolean = false;

  isBrandPMFIX: boolean = false;
  isBrandPMDelay: boolean = false;
  isBrandPMCalender: boolean = false;

  lstAssetsTime: ListWNPMAssetTimeVM[] = [];
  lstFiscalYears: FiscalYearQuarters[] = [];
  lstQuarters: YearQuarters[] = [];
  quarterObj: YearQuarters;
  constructor(public dialogService: DialogService, private wnPMAssetTimeService: WNPMAssetTimeService, private authenticationService: AuthenticationService,
    private assetDetailService: AssetDetailService, private governorateService: GovernorateService, private cityService: CityService,
    private organizationService: OrganizationService, private subOrganizationService: SubOrganizationService,
    private brandService: BrandService, private departmentService: DepartmentService, private route: Router,
    private hospitalService: HospitalService, private router: Router, public translate: TranslateService, private manfacturerPMAssetService: ManfacturerpmassetsService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {


    this.page = {
      pagenumber: 1,
      pagesize: 10,
    }
    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });
      this.isHospital2 = (['Admin', 'TLHospitalManager'].some(r => this.lstRoleNames.includes(r)));
      this.isAssetOwner = (['Admin', 'AssetOwner'].some(r => this.lstRoleNames.includes(r)));
      this.isAdmin = (['Admin'].some(r => this.lstRoleNames.includes(r)));
      this.isEngManager = (['EngDepManager'].some(r => this.lstRoleNames.includes(r)));
      this.isHospitalManager = (['TLHospitalManager'].some(r => this.lstRoleNames.includes(r)));
      this.isBrandPMFIX = (['Admin', 'BrandPMFIX'].some(r => this.lstRoleNames.includes(r)));
      this.isBrandPMDelay = (['Admin', 'BrandPMDelay'].some(r => this.lstRoleNames.includes(r)));
      this.isBrandPMCalender = (['Admin', 'BrandPMCalender'].some(r => this.lstRoleNames.includes(r)));

    }
    this.onLoad();
    this.onLoadByLogIn();
    this.assetTimeObj = { supplierName: '', supplierNameAr: '', brandName: '', brandNameAr: '', hospitalName: '', hospitalNameAr: '', assetDetailId: 0, assetName: '', assetNameAr: '', barCode: '', departmentName: '', departmentNameAr: '', doneDate: new Date, dueDate: new Date, hospitalId: 0, id: 0, isDone: false, listMasterAssetTasks: [], modelNumber: '', pmDate: '', serialNumber: '' }
    this.thisYear = (new Date().getFullYear());
    this.lastYear = (new Date().getFullYear()) - 1;
    this.filterObj = { yearQuarter: 0, isDone: false }

    this.showAdd = true;
    if (this.currentUser.hospitalId != 0) {
      this.hospitalId = this.currentUser.hospitalId;
    }
    else {
      this.hospitalId = 0;
    }
    this.assetDetailService.CountAssetsByHospitalId(this.currentUser.hospitalId).subscribe(total => {
      this.totalAssets = total;
    });
    this.wnPMAssetTimeService.GetFiscalYearQuarters().subscribe(result => {
      result.forEach(element => {
        var fiscalObj = new FiscalYearQuarters();
        fiscalObj.quarterName = element.quarterName;
        fiscalObj.year = Number(element.firstDayStart.slice(0, 4));
        fiscalObj.yearQuarter = element.yearQuarter;
        fiscalObj.firstDayStart = element.firstDayStart;
        fiscalObj.yearValue = element.year;
        this.lstFiscalYears.push(fiscalObj);
      });
      this.lstQuarters = result;
    });
    this.wnPMAssetTimeService.GetYearQuarters().subscribe(result => {
      this.lstQuarters = result;
    });
  }
  toggle() {
    this.show = !this.show;
    if (this.show)
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }
  getAllAssetTimesByQuarter(yearQuarter: number, item: 1 | 2 | 3 | 4) {
    this.clickedItem = item;
    this.filterObj.yearQuarter = yearQuarter;
    this.filterObj.isDone = this.isDone;

    this.manfacturerPMAssetService.GetAllManfacturerAssetsTimes2(this.filterObj, this.page.pagenumber, this.page.pagesize, this.currentUser.id).subscribe(assets => {
      this.lstAssetsTime = assets.results;
      this.count = assets.count;
      this.totalcount = assets.totalCount;
      this.countDone = assets.countDone;
      this.countNotDone = assets.countNotDone;
      this.loading = false;
    });
  }
  onSearch() {

    this.page.pagenumber = 1;
    this.searchObj.userId = this.currentUser.id;

    if (this.currentUser.hospitalId != 0) {
      this.hospitalId = this.currentUser.hospitalId;
    }
    if (this.searchObj.hospitalId != 0) {
      this.hospitalId = this.searchObj.hospitalId;
    }
    else {
      this.hospitalId = 0;
    }

    if (this.searchObj.departmentId == 0 && this.searchObj.brandId == 0 && this.searchObj.hospitalId == 0 && this.searchObj.serialNumber == '' &&
      this.searchObj.governorateId == 0 && this.searchObj.cityId == 0 && this.searchObj.organizationId == 0 && this.searchObj.subOrganizationId == 0
      && this.searchObj.barcode == '') {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select search criteria";
      }
      else {
        this.errorMessage = "من فضلك اختر مجال البحث";
      }
    }
    else {
      this.manfacturerPMAssetService.SearchManfacturerAssetTimes(this.searchObj, this.page.pagenumber, this.page.pagesize, this.currentUser.id).subscribe(assets => {
        this.lstAssetTime = assets.results;
        this.count = assets.count;
        this.countDone = assets.countDone;
        this.countNotDone = assets.countNotDone;
        this.loading = false;
      });
    }

  }
  getBarCode(event) {
    this.searchObj.barcode = event["barCode"];
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
    if (this.searchObj.hospitalId != 0) {
      this.assetDetailService.AutoCompleteAssetBarCode(event.query, this.searchObj.hospitalId).subscribe(assets => {
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
    this.searchObj.serialNumber = event["serialNumber"];
  }
  onSerialNumberSelectionChanged(event) {
    if (this.currentUser.hospitalId != 0) {
      this.assetDetailService.AutoCompleteAssetSerial(event.query, this.currentUser.hospitalId).subscribe(assets => {
        this.lstAssetSerailNumberObj = assets;
        if (this.lang == "en") {
          this.lstAssetSerailNumberObj.forEach(item => item.serialNumber = item.serialNumber);
        }
        else {
          this.lstAssetSerailNumberObj.forEach(item => item.serialNumber = item.serialNumber);
        }
      });
    }
    if (this.searchObj.hospitalId != 0) {
      this.assetDetailService.AutoCompleteAssetSerial(event.query, this.searchObj.hospitalId).subscribe(assets => {
        this.lstAssetSerailNumberObj = assets;
        if (this.lang == "en") {
          this.lstAssetSerailNumberObj.forEach(item => item.serialNumber = item.serialNumber);
        }
        else {
          this.lstAssetSerailNumberObj.forEach(item => item.serialNumber = item.serialNumber);
        }
      });
    }
    else {
      this.assetDetailService.AutoCompleteAssetSerial(event.query, this.hospitalId).subscribe(assets => {
        this.lstAssetSerailNumberObj = assets;
        if (this.lang == "en") {
          this.lstAssetSerailNumberObj.forEach(item => item.serialNumber = item.serialNumber);
        }
        else {
          this.lstAssetSerailNumberObj.forEach(item => item.serialNumber = item.serialNumber);
        }
      });
    }
  }
  clearAssetSerailNumber() {
    this.searchObj.serialNumber = "";
    this.assetSerailNumberObj.serialNumber = "";
  }
  clearAssetBarCode() {
    this.searchObj.barcode = "";
    this.assetBarCodeObj.barCode = "";
  }
  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;
    if (this.statusItem == 0)
      this.isDone = false;
    else if (this.statusItem == 1)
      this.isDone = true;
    else if (this.statusItem == 2)
      this.isDone = null;

    this.manfacturerPMAssetService.GetFiscalYearCurrentQuarter().subscribe(currentqrtr => {
      this.filterObj.yearQuarter = currentqrtr;
      this.filterObj.isDone = this.isDone;
      this.manfacturerPMAssetService.GetAllManfacturerAssetsTimes2(this.filterObj, this.page.pagenumber, this.page.pagesize, this.currentUser.id)
        .subscribe(assets => {
          this.lstAssetTime = assets.results;
          this.count = assets.count;
          this.totalcount = assets.totalCount;
          this.countDone = assets.countDone;
          this.countNotDone = assets.countNotDone;
          this.loading = false;
        });


    });
  }
  reset() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
  reload() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);

  }
  onLoadByLogIn() {
    if (this.currentUser.hospitalId > 0 && this.currentUser.organizationId > 0 && this.currentUser.subOrganizationId > 0) {
      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
        if (this.currentUser.organizationId > 0) {
          this.searchObj.organizationId = this.currentUser.organizationId;
          this.isOrg = true;
          this.subOrganizationService.GetSubOrganizationByOrgId(this.currentUser.organizationId).subscribe(suborgs => {
            this.lstSubOrganizations = suborgs;
            if (this.currentUser.subOrganizationId > 0) {
              this.searchObj.subOrganizationId = this.currentUser.subOrganizationId;
              this.isSubOrg = true;
              this.hospitalService.GetHospitalsBySubOrganizationId(this.currentUser.organizationId).subscribe(hosts => {
                this.lstHospitals = hosts;
                this.searchObj.hospitalId = this.currentUser.hospitalId;
                this.isHospital = true;
                this.assetDetailService.GetListOfAssetDetailsByHospitalId(this.searchObj.hospitalId).subscribe(lstAssets => {
                  this.lstHospitalAssets = lstAssets;
                });
              });
            }
          });
        }
      });
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
      });
      this.hospitalService.GetHospitalById(this.currentUser.hospitalId).subscribe(hospitalObj => {
        this.searchObj.governorateId = hospitalObj.governorateId;
        this.isGov = true;
        this.cityService.GetCitiesByGovernorateId(this.searchObj.governorateId).subscribe((cities) => {
          this.lstCities = cities;
        });
        this.searchObj.cityId = hospitalObj.cityId;
        this.isCity = true;
      });
    }
    else if (this.currentUser.hospitalId > 0 && this.currentUser.governorateId > 0 && this.currentUser.cityId > 0) {
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
        if (this.currentUser.governorateId > 0) {
          this.searchObj.governorateId = this.currentUser.governorateId;
          this.isGov = true;
          this.cityService.GetCitiesByGovernorateId(this.currentUser.governorateId).subscribe(cities => {
            this.lstCities = cities;
            if (this.currentUser.cityId > 0) {
              this.searchObj.cityId = this.currentUser.cityId;
              this.isCity = true;
              this.hospitalService.getHosByCityId(this.currentUser.cityId).subscribe(hosts => {
                this.lstHospitals = hosts;
                this.searchObj.hospitalId = this.currentUser.hospitalId;
                this.isHospital = true;
                this.assetDetailService.GetListOfAssetDetailsByHospitalId(this.currentUser.hospitalId).subscribe(lstAssets => {
                  this.lstHospitalAssets = lstAssets;
                });
              });
            }
          });
        }
      });
      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
      });
      this.hospitalService.GetHospitalById(this.currentUser.hospitalId).subscribe(hospitalObj => {
        this.searchObj.organizationId = hospitalObj.organizationId;
        this.isOrg = true;
        this.subOrganizationService.GetSubOrganizationByOrgId(this.searchObj.organizationId).subscribe((subs) => {
          this.lstSubOrganizations = subs;
        });
        this.searchObj.subOrganizationId = hospitalObj.subOrganizationId;
        this.isSubOrg = true;
      });
    }
    else if (this.currentUser.governorateId > 0 && this.currentUser.cityId == 0 && this.currentUser.hospitalId == 0) {
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
        if (this.currentUser.governorateId > 0) {
          this.searchObj.governorateId = this.currentUser.governorateId;
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
          this.searchObj.governorateId = this.currentUser.governorateId;
          this.isGov = true;
          this.cityService.GetCitiesByGovernorateId(this.currentUser.governorateId).subscribe(cities => {
            this.lstCities = cities;
            this.searchObj.cityId = this.currentUser.cityId;
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
          this.searchObj.organizationId = this.currentUser.organizationId;
          this.isOrg = true;
          this.subOrganizationService.GetSubOrganizationByOrgId(this.currentUser.organizationId).subscribe(suborgs => {
            this.lstSubOrganizations = suborgs;

            if (this.currentUser.subOrganizationId > 0) {
              this.searchObj.subOrganizationId = this.currentUser.subOrganizationId;
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
          this.searchObj.organizationId = this.currentUser.organizationId;
          this.isOrg = true;
          this.subOrganizationService.GetSubOrganizationByOrgId(this.currentUser.organizationId).subscribe(suborgs => {
            this.lstSubOrganizations = suborgs;

            if (this.currentUser.subOrganizationId > 0) {
              this.searchObj.subOrganizationId = this.currentUser.subOrganizationId;
              this.isSubOrg = true;

              this.hospitalService.GetHospitalsBySubOrganizationId(this.currentUser.subOrganizationId).subscribe(hosts => {
                this.lstHospitals = hosts;
                this.searchObj.hospitalId = this.currentUser.hospitalId;
                this.assetDetailService.GetListOfAssetDetailsByHospitalId(this.currentUser.hospitalId).subscribe(lstAssets => {
                  this.lstHospitalAssets = lstAssets;
                });
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
    this.page = {
      pagenumber: 1,
      pagesize: 10,
    }
    this.searchObj = {
      barcode: '', departmentId: 0, userId: '', modelNumber: '', cityId: 0, governorateId: 0, organizationId: 0, subOrganizationId: 0,
      brandId: 0, hospitalId: 0, serialNumber: '', doneDate: '', dueDate: '', pmDate: ''
    }

    this.sortObj = { isDone: '', modelNumber: '', brandId: 0, userId: '', barCode: '', serialNumber: '', assetName: '', assetNameAr: '', sortStatus: '', departmentId: 0, doneDate: '', dueDate: '', pmDate: '', strBarCode: '', strModelNumber: '', strSerialNumber: "" }


    this.brandService.GetBrands().subscribe(items => {
      this.lstBrands = items;
    });
    this.departmentService.GetDepartments().subscribe(items => {
      this.lstDepartments = items;
    });

  }
  sort(field) {
    if (this.sortStatus == "descending") {
      this.sortStatus = "ascending";
      this.sortObj.sortStatus = this.sortStatus;
    }
    else {
      this.sortStatus = "descending";
      this.sortObj.sortStatus = this.sortStatus;
    }

    if (field.currentTarget.id == "Asset Name") {
      this.sortObj.assetName = field.currentTarget.id
    }
    else if (field.currentTarget.id == "اسم الأصل") {
      this.sortObj.assetNameAr = field.currentTarget.id
    }

    if (field.currentTarget.id == "Barcode") {
      this.sortObj.strBarCode = field.currentTarget.id
    }
    else if (field.currentTarget.id == "الباركود") {
      this.sortObj.strBarCode = field.currentTarget.id
    }
    // else if (field.currentTarget.id == "Name") {
    //   this.sortObj.assetName = field.currentTarget.id
    // }
    // else if (field.currentTarget.id == "الاسم") {
    //   this.sortObj.assetNameAr = field.currentTarget.id
    // }
    else if (field.currentTarget.id == "Serial") {
      this.sortObj.strSerialNumber = field.currentTarget.id
    }
    else if (field.currentTarget.id == "السيريال") {
      this.sortObj.strSerialNumber = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "Model") {
      this.sortObj.strModelNumber = field.currentTarget.id
    }
    else if (field.currentTarget.id == "رقم الموديل") {
      this.sortObj.strModelNumber = field.currentTarget.id;
    }

    // "DueDate": "التاريخ التنفيذ المؤجل",
    // "DoneDate": "تاريخ التنفيذ الفعلي",
    // "PMDate": "التاريخ المخطط ",


    else if (field.currentTarget.id == "Date") {
      this.sortObj.pmDate = field.currentTarget.id
    }
    else if (field.currentTarget.id == "التاريخ المخطط") {
      this.sortObj.pmDate = field.currentTarget.id;
    }

    else if (field.currentTarget.id == "Due Date") {
      this.sortObj.dueDate = field.currentTarget.id
    }
    else if (field.currentTarget.id == "التاريخ التنفيذ المؤجل") {
      this.sortObj.dueDate = field.currentTarget.id;
    }

    else if (field.currentTarget.id == "Done Date") {
      this.sortObj.doneDate = field.currentTarget.id
    }
    else if (field.currentTarget.id == "تاريخ التنفيذ الفعلي") {
      this.sortObj.doneDate = field.currentTarget.id;
    }


    else if (field.currentTarget.id == "Done") {
      this.sortObj.isDone = field.currentTarget.id
    }
    else if (field.currentTarget.id == "تم الانتهاء") {
      this.sortObj.isDone = field.currentTarget.id;
    }

    this.sortObj.userId = this.currentUser.id;



    if (this.searchObj.serialNumber != "")
      this.sortObj.serialNumber = this.searchObj.serialNumber;
    else
      this.sortObj.serialNumber = this.sortObj.serialNumber;



    if (this.searchObj.barcode != "")
      this.sortObj.barCode = this.searchObj.barcode;
    else
      this.sortObj.barCode = this.sortObj.barCode;



    if (this.searchObj.modelNumber != "")
      this.sortObj.modelNumber = this.searchObj.modelNumber;
    else
      this.sortObj.modelNumber = this.sortObj.modelNumber;




    this.sortObj.userId = this.currentUser.id;
    // this.wnPMAssetTimeService.SortAssetTimes(this.sortObj, this.page.pagenumber, this.page.pagesize, this.currentUser.id).subscribe(data => {
    //   this.lstAssetsTime = data.results;
    //   this.count = data.count;
    //   this.countDone = data.countDone;
    //   this.countNotDone = data.countNotDone;
    //   this.sortStatus = this.sortObj.sortStatus;
    // });

    this.manfacturerPMAssetService.SortManfacturerAssetTimes(this.sortObj, this.page.pagenumber, this.page.pagesize, this.currentUser.id)
      .subscribe(data => {
        this.lstAssetTime = data.results;
        this.count = data.count;
        this.countDone = data.countDone;
        this.countNotDone = data.countNotDone;
        this.sortStatus = this.sortObj.sortStatus;

      })

  }
  viewAssetTime(id: number) {
    const dialogRef2 = this.dialogService.open(ViewComponent, {
      header: this.lang == "en" ? 'PM' : "بيان الصيانة الوقائية",
      width: '50%',
      data: {
        id: id
      },
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });
    dialogRef2.onClose.subscribe((res) => {
      this.reset();
    });
  }
  pmDelay(id: number) {
    const dialogRef2 = this.dialogService.open(AddpmdoneComponent, {
      header: this.lang == "en" ? 'Depaly PM' : "تأجيل الصيانة الوقائية",
      width: '50%',
      data: {
        id: id,
        itemIndex: 1
      },
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });
    dialogRef2.onClose.subscribe((res) => {
      this.reset();
    });
  }
  pmDone(id: number) {

    const dialogRef2 = this.dialogService.open(AddpmdoneComponent, {
      header: this.lang == "en" ? 'PM Done' : "تنفيذ الصيانة الوقائية",
      width: '50%',
      data: {
        id: id,
        itemIndex: 0
      },
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });
    dialogRef2.onClose.subscribe((res) => {
      this.reset();
    });

  }
  printAssetTime(id) {

    this.displayAssetTimeObj = true;
    const options: Intl.DateTimeFormatOptions = { month: "long", day: 'numeric', year: 'numeric' };
    this.manfacturerPMAssetService.GetManfacturerAssetById(id).subscribe(woObj => {
      this.assetTimeObj = woObj;
      this.assetTimeObj.pmDate = new Intl.DateTimeFormat("ar-EG", options).format(new Date(this.assetTimeObj.pmDate));
    });

    let printedBy = this.currentUser.userName + " تمت الطباعة بواسطة ";
    this.printedBy = printedBy;
  }
  print() {
    window.print();
  }
  closePrint() {
    this.displayAssetTimeObj = false;
    this.reload();
  }
  getAllAssetTimesIsDone(isDone: boolean, $event, item: 0 | 1 | 2) {

    this.isDone = isDone;
    this.statusItem = item;
    this.lstAssetTime = [];
    this.page.pagenumber = 1;
    this.filterObj.yearQuarter = this.clickedItem;

    if (this.statusItem == 0) {
      this.filterObj.isDone = false;
      this.manfacturerPMAssetService.GetAllManfacturerAssetsTimes2(this.filterObj, this.page.pagenumber, this.page.pagesize, this.currentUser.id)
        .subscribe(assets => {
          this.lstAssetTime = assets.results;
          this.count = assets.count;
          this.totalcount = assets.totalCount;
          this.countDone = assets.countDone;
          this.countNotDone = assets.countNotDone;
          this.loading = false;
        });
    }
    else if (this.statusItem == 1) {
      this.filterObj.isDone = true;
      this.manfacturerPMAssetService.GetAllManfacturerAssetsTimes2(this.filterObj, this.page.pagenumber, this.page.pagesize, this.currentUser.id)
        .subscribe(assets => {
          this.lstAssetTime = assets.results;
          this.count = assets.count;
          this.totalcount = assets.totalCount;
          this.countDone = assets.countDone;
          this.countNotDone = assets.countNotDone;
          this.loading = false;
        });
    }
    else if (this.statusItem == 2) {
      this.filterObj.isDone = null;
      this.manfacturerPMAssetService.GetAllManfacturerAssetsTimes2(this.filterObj, this.page.pagenumber, this.page.pagesize, this.currentUser.id)
        .subscribe(assets => {
          this.lstAssetTime = assets.results;
          this.count = assets.count;
          this.totalcount = assets.totalCount;
          this.countDone = assets.countDone;
          this.countNotDone = assets.countNotDone;
          this.loading = false;
        });
    }
  }
}
