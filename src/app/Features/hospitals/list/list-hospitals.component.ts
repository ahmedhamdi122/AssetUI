import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { HospitalVM, ListHospitalVM, SearchHospitalVM, SortHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { CityService } from 'src/app/Shared/Services/city.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';
import { ViewComponent } from '../view/view.component';
import { CreateComponent } from '../create/create.component';
import { DeleteconfirmationComponent } from '../deleteconfirmation/deleteconfirmation.component';
import { EditComponent } from '../edit/edit.component';
import { Paging } from 'src/app/Shared/Models/paging';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';

@Component({
  selector: 'app-list-hospitals',
  templateUrl: './list-hospitals.component.html',
  styleUrls: ['./list-hospitals.component.css'],
})




export class ListHospitalComponent implements OnInit {
  lang = localStorage.getItem('lang');
  dir: string = "ltr";
  currentUser: LoggedUser;
  page: Paging;
  count: number;
  govName: string;
  lstRoleNames: string[] = [];
  lstHospitals: ListHospitalVM[] = [];
  searchObj: SearchHospitalVM;
  lstSubOrganizations: ListSubOrganizationVM[] = [];
  lstGovernorates: ListGovernorateVM[] = [];
  lstCities: ListCityVM[];
  lstOrganizations: ListOrganizationVM[];
  selectedObj: HospitalVM;

  isHospital: boolean = false;
  errorDisplay: boolean = false;
  isAdmin: boolean = false;
  errorMessage: string;
  sortStatus: string = "descending";
  sortObj: SortHospitalVM;


  showGov: boolean = false;
  showCity: boolean = false;

  first: number = 0;
  rows: number = 10;

  isGov: boolean = false;
  isCity: boolean = false;
  isOrg: boolean = false;
  isSubOrg: boolean = false;

  loading: boolean = true;

  cols: any[];
  _selectedColumns: any[];
  columnsSelected: string = "";

  constructor(
    private authenticationService: AuthenticationService, private hospitalService: HospitalService,
    private subOrganizationService: SubOrganizationService, private organizationService: OrganizationService,
    private governorateService: GovernorateService, private cityService: CityService, private dialog: MatDialog,
    private router: Router, public dialogService: DialogService, public ref: DynamicDialogRef, public config: DynamicDialogConfig,
    private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute
  ) {
    this.currentUser = this.authenticationService.currentUserValue;

  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.cols.filter(col => val.includes(col));
  }

  ngOnInit(): void {
    this.onLoad();

    const translationKeys = ['Asset.heirarchicalstructure', 'Asset.Hospitals']; // Array of translation keys
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);

    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });
      this.isHospital = (['Admin', 'TLHospitalManager'].some(r => this.lstRoleNames.includes(r)));
      this.isAdmin = (['Admin'].some(r => this.lstRoleNames.includes(r)));
    }



    if (this.searchObj.cityId != 0
      && this.searchObj.governorateId != 0 && this.searchObj.organizationId != 0
      && this.searchObj.subOrganizationId != 0 && this.searchObj.code != '' && this.searchObj.nameAr != '') {

      this.hospitalService.SearchHospitalsCount(this.searchObj).subscribe((data) => {
        this.count = data;
      });

    }
    else {
      this.hospitalService.GetHospitalByUserIdAndPagingCount(this.currentUser.id).subscribe((data) => {
        this.count = data;
      });
    }

    if (this.currentUser.governorateId > 0) {
      this.isGov = true;
      this.searchObj.governorateId = this.currentUser.governorateId;
      this.cityService.GetCitiesByGovernorateId(this.searchObj.governorateId).subscribe((cities) => {
        this.lstCities = cities;
      });
    }
    if (this.currentUser.governorateId > 0 && this.currentUser.cityId > 0) {
      this.searchObj.governorateId = this.currentUser.governorateId;
      this.isGov = true;

      this.cityService.GetCitiesByGovernorateId(this.searchObj.governorateId).subscribe(cities => {
        this.lstCities = cities;

        this.searchObj.cityId = this.currentUser.cityId;
        this.isCity = true;
      });

    }

    if (this.currentUser.organizationId > 0) {
      this.searchObj.organizationId = this.currentUser.organizationId;
      this.isOrg = true;
      this.subOrganizationService.GetSubOrganizationByOrgId(this.searchObj.organizationId).subscribe(suborgs => {
        this.lstSubOrganizations = suborgs;
      });
    }



    if (this.currentUser.organizationId > 0 && this.currentUser.subOrganizationId > 0) {
      this.searchObj.organizationId = this.currentUser.organizationId;
      this.isOrg = true;

      this.subOrganizationService.GetSubOrganizationByOrgId(this.searchObj.organizationId).subscribe(suborgs => {
        this.lstSubOrganizations = suborgs;

        this.searchObj.subOrganizationId = this.currentUser.subOrganizationId;
        this.isSubOrg = true;
      });
    }

  }
  onLoad() {
    this.searchObj = { cityId: 0, governorateId: 0, organizationId: 0, subOrganizationId: 0, userId: '', code: '', name: '', nameAr: '' }

    this.sortObj = {
      name: '', nameAr: '', userId: '',
      hospitalName: '', hospitalNameAr: '', orgName: '', orgNameAr: '', subOrgName: '', subOrgNameAr: '',
      governorateName: '', governorateNameAr: '', cityName: '', cityNameAr: '',
      code: '', sortStatus: '', id: 0
    }
    this.page = {
      pagenumber: 1,
      pagesize: 10,
    }


    this.page = { pagenumber: 1, pagesize: 10 }
    if (this.lang == "en") {
      this.dir = "ltr";
    }
    else {
      this.dir = "rtl";
    }

    this.organizationService.GetOrganizations().subscribe((subs) => {
      this.lstOrganizations = subs;
    });

    this.governorateService.GetGovernorates().subscribe((cities) => {
      this.lstGovernorates = cities;
    });

    if (this.lang == "en") {
      this.columnsSelected = "Columns Selected";
      this.cols = [
        { field: 'code', header: 'Code' },
        { field: 'name', header: 'Name' },
        { field: 'governorateName', header: 'Governorate' },
        { field: 'cityName', header: 'City' },
        { field: 'orgName', header: 'Organization' },
        { field: 'subOrgName', header: 'SubOrganization' }
      ];
    }
    else if (this.lang == "ar") {
      this.columnsSelected = "الأعمدة المختارة";
      this.cols = [
        { field: 'code', header: 'الكود' },
        { field: 'nameAr', header: 'الاسم' },
        { field: 'governorateNameAr', header: 'المحافظة' },
        { field: 'cityNameAr', header: 'المدينة' },
        { field: 'orgNameAr', header: 'الهيئة' },
        { field: 'subOrgNameAr', header: 'هيئة فرعية' }
      ];
    }
    this._selectedColumns = this.cols;
  }
  onSearch() {
    this.searchObj.userId = this.currentUser.id;
    if (this.lang == "en") {
      if (this.searchObj.governorateId == 0 && this.searchObj.cityId == 0 && this.searchObj.organizationId == 0
        && this.searchObj.subOrganizationId == 0 && this.searchObj.code == '' && this.searchObj.name == '') {
        this.errorDisplay = true
        // if (this.lang == "en") {
        this.errorMessage = "Please select search criteria";
        return false;
      }
    }

    else if (this.lang == "ar") {
      if (this.searchObj.governorateId == 0 && this.searchObj.cityId == 0 && this.searchObj.organizationId == 0
        && this.searchObj.subOrganizationId == 0 && this.searchObj.code == '' && this.searchObj.nameAr == '') {
        this.errorDisplay = true
        this.errorMessage = "من فضلك اختر مجال البحث";
        return false;
      }
    }


    this.hospitalService.SearchHospitals(this.page.pagenumber, this.page.pagesize, this.searchObj).subscribe(results => {
      this.lstHospitals = results;
    });

    this.hospitalService.SearchHospitalsCount(this.searchObj).subscribe((data) => {
      this.count = data;
    });

  }
  addHospital() {
    const dialogRef2 = this.dialogService.open(CreateComponent, {
      header: this.lang == "en" ? 'Add Hospital' : "اضف مستشفى",
      width: '70%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });
    dialogRef2.onClose.subscribe((res) => {
      this.reload();
    });
  }
  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;

    if (this.lang == "en") {
      if (this.searchObj.cityId != 0
        && this.searchObj.governorateId != 0 && this.searchObj.organizationId != 0
        && this.searchObj.subOrganizationId != 0 && this.searchObj.code != '' && this.searchObj.name != '') {


        this.errorDisplay = false;
        this.hospitalService.SearchHospitals(this.page.pagenumber, this.page.pagesize, this.searchObj).subscribe(results => {
          this.lstHospitals = results;
          this.loading = false;
        });

        this.hospitalService.SearchHospitalsCount(this.searchObj).subscribe((data) => {
          this.count = data;
        });
      }
      else {
        this.hospitalService.GetHospitalByUserIdAndPaging(this.currentUser.id, this.page).subscribe((items) => {
          this.lstHospitals = items;
          this.loading = false;
        });
      }
    }
    else if (this.lang == "ar") {
      if (this.searchObj.cityId != 0
        && this.searchObj.governorateId != 0 && this.searchObj.organizationId != 0
        && this.searchObj.subOrganizationId != 0 && this.searchObj.code != '' && this.searchObj.nameAr != '') {


        this.errorDisplay = false;
        this.hospitalService.SearchHospitals(this.page.pagenumber, this.page.pagesize, this.searchObj).subscribe(results => {
          this.lstHospitals = results;
          this.loading = false;
        });

        this.hospitalService.SearchHospitalsCount(this.searchObj).subscribe((data) => {
          this.count = data;
        });
      }
      else {
        this.hospitalService.GetHospitalByUserIdAndPaging(this.currentUser.id, this.page).subscribe((items) => {
          this.lstHospitals = items;
          this.loading = false;
        });
      }
    }
  }
  viewHospital(id: number) {
    const dialogRef2 = this.dialogService.open(ViewComponent, {
      header: this.lang == "en" ? 'View Hospital' : "بيانات المستشفى",
      width: '70%',
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
      this.reload();
    });
  }
  deleteHospital(id: number) {
    this.hospitalService.GetHospitalById(id).subscribe((data) => {
      this.selectedObj = data;

      const dialogRef2 = this.dialog.open(DeleteconfirmationComponent, {
        width: '30%',
        autoFocus: true,
        data: {
          id: this.selectedObj.id,
          name: this.selectedObj.name,
          nameAr: this.selectedObj.nameAr,
        },
      });
      dialogRef2.afterClosed().subscribe(deleted => {
        this.reload();
      });
    });

  }
  editHospital(id: number) {
    const ref = this.dialogService.open(EditComponent, {
      data: {
        id: id,
      },
      header: this.lang == "en" ? 'Edit Hospital' : "تعديل مستشفى",
      width: '70%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });
    ref.onClose.subscribe((res) => {
      this.reload();
    });
  }
  getCitiesByGovId($event) {

    this.cityService.GetCitiesByGovernorateId($event.target.value).subscribe((cities) => {
      this.lstCities = cities;
    });
  }
  getSubOrgByOrgId($event) {
    this.subOrganizationService.GetSubOrganizationByOrgId($event.target.value).subscribe(suborgs => {
      this.lstSubOrganizations = suborgs;
    });
  }
  reload() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
  reset() {
    this.reload();
  }
  sort(field) {

    this.sortObj.userId = this.currentUser.id;

    if (this.sortStatus === "descending") {
      this.sortStatus = "ascending";
      this.sortObj.sortStatus = this.sortStatus;
    }
    else {
      this.sortStatus = "descending"
      this.sortObj.sortStatus = this.sortStatus;
    }
    if (field.currentTarget.id == "Code") {
      this.sortObj.code = field.currentTarget.id
    }

    else if (field.currentTarget.id == "الكود") {
      this.sortObj.code = field.currentTarget.id
    }
    if (field.currentTarget.id == "Name") {
      this.sortObj.name = field.currentTarget.id
    }
    else if (field.currentTarget.id == "الاسم") {
      this.sortObj.nameAr = field.currentTarget.id
    }
    if (field.currentTarget.id == "Governorate") {
      this.sortObj.governorateName = field.currentTarget.id
    }
    else if (field.currentTarget.id == "المحافظة") {
      this.sortObj.governorateNameAr = field.currentTarget.id
    }
    if (field.currentTarget.id == "City") {
      this.sortObj.cityName = field.currentTarget.id
    }
    else if (field.currentTarget.id == "المدينة") {
      this.sortObj.cityNameAr = field.currentTarget.id
    }
    if (field.currentTarget.id == "Organization") {
      this.sortObj.orgName = field.currentTarget.id
    }
    else if (field.currentTarget.id == "الهيئة") {
      this.sortObj.orgNameAr = field.currentTarget.id
    }
    if (field.currentTarget.id == "Sub Organization") {
      this.sortObj.subOrgName = field.currentTarget.id
    }
    else if (field.currentTarget.id == "هيئة فرعية") {
      this.sortObj.subOrgNameAr = field.currentTarget.id
    }

    this.hospitalService.sortHospitals(this.page.pagenumber, this.page.pagesize, this.sortObj).subscribe(data => {
      this.lstHospitals = data;
      this.loading = false;
      this.sortStatus = this.sortObj.sortStatus,
        this.sortObj = {
          name: '', nameAr: '', userId: '',
          hospitalName: '', hospitalNameAr: '', orgName: '', orgNameAr: '', subOrgName: '', subOrgNameAr: '',
          governorateName: '', governorateNameAr: '', cityName: '', cityNameAr: '',
          code: '', sortStatus: '', id: 0
        }
    })
  }
  eArabic(x) {
    return x.toLocaleString('ar-SA');
  }
}
