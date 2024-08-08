import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { AssetDetailVM, MainClass, EditAssetDetailVM, ListAssetDetailVM, SearchHospitalAssetVM, SortAssetDetailVM, ViewAssetDetailVM, SortAndFilterVM } from 'src/app/Shared/Models/assetDetailVM';
import { ListBrandVM } from 'src/app/Shared/Models/brandVM';
import { ListDepartmentVM } from 'src/app/Shared/Models/departmentVM';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { ListOriginVM } from 'src/app/Shared/Models/originVM';
import { Paging } from 'src/app/Shared/Models/paging';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { ListSupplierVM } from 'src/app/Shared/Models/supplierVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { BrandService } from 'src/app/Shared/Services/brand.service';
import { CityService } from 'src/app/Shared/Services/city.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { OriginService } from 'src/app/Shared/Services/origin.service';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';
import { SupplierService } from 'src/app/Shared/Services/supplierService.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { DepartmentService } from 'src/app/Shared/Services/department.service';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { environment } from 'src/environments/environment';
import { ListMasterAssetVM, MasterAssetVM } from 'src/app/Shared/Models/MasterAssetVM';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';

@Component({
  selector: 'app-assetqr',
  templateUrl: './assetqr.component.html',
  styleUrls: ['./assetqr.component.css']
})
export class AssetqrComponent implements OnInit {

  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  searchForm: FormGroup;
  errorDisplay: boolean = false;
  errorMessage: string;
  selectedObj: EditAssetDetailVM;
  searchObj: SearchHospitalAssetVM;
  public show: boolean = false;
  public buttonName: any = 'Show';
  lstAssets: ListAssetDetailVM[] = [];
  lstAllAssets: MainClass;



  lstHospitalAssets: ViewAssetDetailVM[] = [];
  lstMasterAssets: ListMasterAssetVM[] = [];
  lstGovernorates: ListGovernorateVM[];
  lstCities: ListCityVM[];
  lstOrganizations: ListOrganizationVM[];
  lstSubOrganizations: ListSubOrganizationVM[];
  lstSuppliers: ListSupplierVM[];
  lstOrigins: ListOriginVM[];
  lstBrands: ListBrandVM[];
  lstDepartments: ListDepartmentVM[] = [];
  lstHospitals: ListHospitalVM[] = [];
  isHospital: boolean = false;
  page: Paging;
  count: number = 0;
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
  sortObj: SortAssetDetailVM;
  sortStatus: string = "ascending";

  direction: string = 'ltr';
  selectedLang: string;


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
  masterAssetObj: MasterAssetVM;


  lsAssetIds: number[] = [];
  lstCheckedAssets: ListAssetDetailVM[] = [];
  checkedAsset: ListAssetDetailVM;

  totalAssets: number = 0;


  sortFilterObjects: SortAndFilterVM;

  constructor(public dialogService: DialogService, private masterAssetService: MasterAssetService,
    private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute,
    private authenticationService: AuthenticationService, private assetDetailService: AssetDetailService, private governorateService: GovernorateService, private cityService: CityService,
    private organizationService: OrganizationService, private subOrganizationService: SubOrganizationService,
    private supplierService: SupplierService, private originService: OriginService, private brandService: BrandService,
    private departmentService: DepartmentService, private uploadService: UploadFilesService, private ngxService: NgxUiLoaderService,
    private hospitalService: HospitalService, private router: Router, public translate: TranslateService) {
    this.currentUser = this.authenticationService.currentUserValue;


    if (this.currentUser.hospitalId > 0) {
      this.statusId = 3;
    }
    else {
      this.statusId = 0;
    }
  }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }
  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.cols.filter(col => val.includes(col));
  }
  ngOnInit(): void {
    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });

      this.isHospital2 = (['Admin', 'TLHospitalManager'].some(r => this.lstRoleNames.includes(r)));
      this.isAssetOwner = (['Admin', 'AssetOwner'].some(r => this.lstRoleNames.includes(r)));
      this.isDE = (['DE'].some(r => this.lstRoleNames.includes(r)));
      this.isAdmin = (['Admin'].some(r => this.lstRoleNames.includes(r)));
      this.isEngManager = (['EngDepManager'].some(r => this.lstRoleNames.includes(r)));
      this.isHospitalManager = (['TLHospitalManager'].some(r => this.lstRoleNames.includes(r)));

      if (this.isHospitalManager) {
        this.showDelete = true;
      }
      else {
        this.showDelete = false;
      }
    }


    const translationKeys = ['Asset.Reports', 'Asset.Assets', 'Asset.QrCode'];
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);
    this.onLoad();
    this.onLoadByLogIn();

    if (this.isHospitalManager || this.isAdmin) {
      this.showAdd = true;
    }
    else {
      this.showAdd = false;
    }


    if (this.lang == "en") {
      this.columnsSelected = "Columns Selected";
      this.cols = [
        { field: '', header: '' },
        { field: 'assetName', header: 'Name' },
        { field: 'barCode', header: 'Barcode' },
        { field: 'serial', header: 'Serial' },
        { field: 'model', header: 'Model' },
        { field: 'brandNameAr', header: 'Brands' }

      ];
    }
    else if (this.lang == "ar") {
      this.columnsSelected = "الأعمدة المختارة";
      this.cols = [
        { field: '', header: 'ID' },
        { field: 'assetNameAr', header: 'الاسم' },
        { field: 'barCode', header: 'الباركود' },
        { field: 'serial', header: 'السيريال' },
        { field: 'model', header: 'الموديل' },
        { field: 'brandNameAr', header: 'الماركات' }
      ];
    }
    this.assetDetailService.CountAssetsByHospitalId(this.currentUser.hospitalId).subscribe(total => {
      this.totalAssets = total;
    });

  }
  onLoad() {
    this.page = {
      pagenumber: 1,
      pagesize: 10,
    }


    this.sortFilterObjects = {
      searchObj: { assetName: '', assetId: 0, barCode: '', brandId: 0, cityId: 0, code: '', contractDate: '', contractEnd: '', contractStart: '', contractTypeId: 0, departmentId: 0, end: '', governorateId: 0, hospitalId: 0, masterAssetId: 0, masterAssetName: '', masterAssetNameAr: '', model: '', organizationId: 0, originId: 0, serial: '', start: '', statusId: 0, subOrganizationId: 0, supplierId: 0, userId: '', warrantyTypeId: 0 },
      sortObj: { sortBy: '', assetName: '', assetNameAr: '', barCode: '', barCodeValue: '', brand: '', brandId: 0, brandName: '', brandNameAr: '', cityId: 0, cityName: '', cityNameAr: '', Code: '', departmentId: 0, governorateId: 0, governorateName: '', governorateNameAr: '', hospitalId: 0, hospitalName: '', hospitalNameAr: '', Id: 0, masterAssetId: 0, model: '', organizationId: 0, orgName: '', orgNameAr: '', originId: 0, serial: '', serialValue: '', sortStatus: '', statusId: 0, subOrganizationId: 0, subOrgName: '', subOrgNameAr: '', supplier: '', supplierId: 0, supplierName: '', supplierNameAr: '', userId: '' },
      isSearchAndSort: false
    };
    this.supplierService.GetSuppliers().subscribe(items => {
      this.lstSuppliers = items;
    });

    this.originService.GetOrigins().subscribe(items => {
      this.lstOrigins = items;
    });
    this.brandService.GetBrands().subscribe(items => {
      this.lstBrands = items;
    });

    if (this.currentUser.hospitalId != 0) {
      this.departmentService.DepartmentsByHospitalId(this.currentUser.hospitalId).subscribe(items => {
        this.lstDepartments = items;
      });
    }
    else {
      this.departmentService.GetDepartments().subscribe(items => {
        this.lstDepartments = items;
      });
    }
    this.hideShowControls();

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
                this.assetDetailService.GetListOfAssetDetailsByHospitalId(this.sortFilterObjects.searchObj.hospitalId).subscribe(lstAssets => {
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
              this.hospitalService.getHosByCityId(this.currentUser.cityId).subscribe(hosts => {
                this.lstHospitals = hosts;
                this.sortFilterObjects.searchObj.hospitalId = this.currentUser.hospitalId;
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
  hideShowControls() {
    if (this.currentUser.governorateId == 0 && this.currentUser.cityId == 0 && this.currentUser.hospitalId == 0 && this.currentUser.organizationId == 0 && this.currentUser.subOrganizationId == 0) {

      if (this.lang == "en") {
        this.columnsSelected = "Columns Selected";
        this.cols = [
          { field: 'assetName', header: 'Name' },
          { field: 'barCode', header: 'Barcode' },
          { field: 'serial', header: 'Serial' },
          { field: 'hospitalName', header: 'Hospital' },
          { field: 'governorateName', header: 'Governorate' },
          { field: 'cityName', header: 'City' },
          { field: 'orgName', header: 'Organization' },
          { field: 'subOrgName', header: 'SubOrganization' }
        ];
      }
      else if (this.lang == "ar") {
        this.columnsSelected = "الأعمدة المختارة";
        this.cols = [
          { field: 'assetNameAr', header: 'الاسم' },
          { field: 'barCode', header: 'الباركود' },
          { field: 'serial', header: 'السيريال' },
          { field: 'hospitalNameAr', header: 'المستشفى' },
          { field: 'governorateNameAr', header: 'المحافظة' },
          { field: 'cityNameAr', header: 'المدينه' },
          { field: 'orgNameAr', header: 'الهيئة' },
          { field: 'subOrgNameAr', header: 'هيئة فرعية' }
        ];

      }
    }
    else if (this.currentUser.governorateId > 0 && this.currentUser.cityId == 0 && this.currentUser.hospitalId == 0) {

      if (this.lang == "en") {
        this.columnsSelected = "Columns Selected";
        this.cols = [
          { field: 'assetName', header: 'Name' },
          { field: 'barCode', header: 'Barcode' },
          { field: 'serial', header: 'Serial' },
          { field: 'hospitalName', header: 'Hospital' },
          //  { field: 'governorateName', header: 'Governorate' },
          { field: 'cityName', header: 'City' },
          { field: 'orgName', header: 'Organization' },
          { field: 'subOrgName', header: 'SubOrganization' },
          // { field: 'supplierName', header: 'Supplier' },
          // { field: 'brandNameAr', header: 'Brands' }

        ];
      }
      else if (this.lang == "ar") {
        this.columnsSelected = "الأعمدة المختارة";
        this.cols = [
          { field: 'assetNameAr', header: 'الاسم' },
          { field: 'barCode', header: 'الباركود' },
          { field: 'serial', header: 'السيريال' },
          { field: 'hospitalNameAr', header: 'المستشفى' },
          //  { field: 'governorateNameAr', header: 'المحافظة' },
          { field: 'cityNameAr', header: 'المدينه' },
          { field: 'orgNameAr', header: 'الهيئة' },
          { field: 'subOrgNameAr', header: 'هيئة فرعية' },
          // { field: 'supplierNameAr', header: 'المورد' },
          // { field: 'brandNameAr', header: 'الماركات' }
        ];
      }

      this.showGov = false;
      this.showCity = true;
      this.showOrg = true;
      this.showSubOrg = true;
      this.showHospital = true;
    }
    else if (this.currentUser.governorateId > 0 && this.currentUser.cityId > 0 && this.currentUser.hospitalId == 0) {

      if (this.lang == "en") {
        this.columnsSelected = "Columns Selected";
        this.cols = [
          { field: 'assetName', header: 'Name' },
          { field: 'barCode', header: 'Barcode' },
          { field: 'serial', header: 'Serial' },
          { field: 'hospitalName', header: 'Hospital' },
          { field: 'orgName', header: 'Organization' },
          { field: 'subOrgName', header: 'SubOrganization' },
        ];
      }
      else if (this.lang == "ar") {
        this.columnsSelected = "الأعمدة المختارة";
        this.cols = [
          { field: 'assetNameAr', header: 'الاسم' },
          { field: 'barCode', header: 'الباركود' },
          { field: 'serial', header: 'السيريال' },
          { field: 'hospitalNameAr', header: 'المستشفى' },
          { field: 'orgNameAr', header: 'الهيئة' },
          { field: 'subOrgNameAr', header: 'هيئة فرعية' }
        ];
      }

      this.showGov = false;
      this.showCity = false;
      this.showOrg = true;
      this.showSubOrg = true;
      this.showHospital = true;
    }
    else if (this.currentUser.governorateId > 0 && this.currentUser.cityId > 0 && this.currentUser.hospitalId > 0) {

      if (this.lang == "en") {
        this.columnsSelected = "Columns Selected";
        this.cols = [
          { field: 'assetName', header: 'Name' },
          { field: 'barCode', header: 'Barcode' },
          { field: 'serial', header: 'Serial' },
          // { field: 'orgName', header: 'Organization' },
          // { field: 'subOrgName', header: 'SubOrganization' },
          // { field: 'supplierName', header: 'Supplier' },
          { field: 'model', header: 'Model' },
          { field: 'brandNameAr', header: 'Brands' }

        ];
      }
      else if (this.lang == "ar") {
        this.columnsSelected = "الأعمدة المختارة";
        this.cols = [
          { field: 'assetNameAr', header: 'الاسم' },
          { field: 'barCode', header: 'الباركود' },
          { field: 'serial', header: 'السيريال' },
          { field: 'model', header: 'الموديل' },
          // { field: 'orgNameAr', header: 'الهيئة' },
          // { field: 'subOrgNameAr', header: 'هيئة فرعية' },
          // { field: 'supplierNameAr', header: 'المورد' },
          { field: 'brandNameAr', header: 'الماركات' }
        ];
      }

      this.showGov = false;
      this.showCity = false;
      this.showOrg = false;
      this.showSubOrg = false;
      this.showHospital = false;
    }
    else if (this.currentUser.organizationId > 0 && this.currentUser.subOrganizationId == 0 && this.currentUser.hospitalId == 0) {

      if (this.lang == "en") {
        this.columnsSelected = "Columns Selected";
        this.cols = [
          { field: 'assetName', header: 'Name' },
          { field: 'barCode', header: 'Barcode' },
          { field: 'serial', header: 'Serial' },
          { field: 'hospitalName', header: 'Hospital' },
          { field: 'governorateName', header: 'Governorate' },
          { field: 'cityName', header: 'City' },
          { field: 'subOrgName', header: 'SubOrganization' },
          { field: 'supplierName', header: 'Supplier' },
          { field: 'brandNameAr', header: 'Brands' }

        ];
      }
      else if (this.lang == "ar") {
        this.columnsSelected = "الأعمدة المختارة";
        this.cols = [
          { field: 'assetNameAr', header: 'الاسم' },
          { field: 'barCode', header: 'الباركود' },
          { field: 'serial', header: 'السيريال' },
          { field: 'hospitalNameAr', header: 'المستشفى' },
          { field: 'governorateNameAr', header: 'المحافظة' },
          { field: 'cityNameAr', header: 'المدينة' },
          { field: 'subOrgNameAr', header: 'هيئة فرعية' },
          { field: 'supplierNameAr', header: 'المورد' },
          { field: 'brandNameAr', header: 'الماركات' }
        ];
      }

      this.showGov = true;
      this.showCity = true;
      this.showOrg = false;
      this.showSubOrg = true;
      this.showHospital = true;
    }
    else if (this.currentUser.organizationId > 0 && this.currentUser.subOrganizationId > 0 && this.currentUser.hospitalId == 0) {
      if (this.lang == "en") {
        this.columnsSelected = "Columns Selected";
        this.cols = [
          { field: 'assetName', header: 'Name' },
          { field: 'barCode', header: 'Barcode' },
          { field: 'serial', header: 'Serial' },
          { field: 'hospitalName', header: 'Hospital' },
          { field: 'governorateName', header: 'Governorate' },
          { field: 'cityName', header: 'City' },
          { field: 'supplierName', header: 'Supplier' },
          { field: 'brandNameAr', header: 'Brands' }

        ];
      }
      else if (this.lang == "ar") {
        this.columnsSelected = "الأعمدة المختارة";
        this.cols = [
          { field: 'assetNameAr', header: 'الاسم' },
          { field: 'barCode', header: 'الباركود' },
          { field: 'serial', header: 'السيريال' },
          { field: 'hospitalNameAr', header: 'المستشفى' },
          { field: 'governorateNameAr', header: 'المحافظة' },
          { field: 'cityNameAr', header: 'المدينه' },
          { field: 'supplierNameAr', header: 'المورد' },
          { field: 'brandNameAr', header: 'الماركات' }
        ];
      }

      this.showGov = true;
      this.showCity = true;
      this.showOrg = false;
      this.showSubOrg = false;
      this.showHospital = true;


    }
    else if (this.currentUser.organizationId > 0 && this.currentUser.subOrganizationId > 0 && this.currentUser.hospitalId > 0) {
      if (this.lang == "en") {
        this.columnsSelected = "Columns Selected";
        this.cols = [
          { field: 'assetName', header: 'Name' },
          { field: 'barCode', header: 'Barcode' },
          { field: 'serial', header: 'Serial' },
          { field: 'model', header: 'Model' },
          //  { field: 'supplierName', header: 'Supplier' },
          { field: 'brandNameAr', header: 'Brands' }
        ];
      }
      else if (this.lang == "ar") {
        this.columnsSelected = "الأعمدة المختارة";
        this.cols = [
          { field: 'assetNameAr', header: 'الاسم' },
          { field: 'barCode', header: 'الباركود' },
          { field: 'serial', header: 'السيريال' },
          { field: 'model', header: 'Model' },
          //   { field: 'supplierNameAr', header: 'المورد' },
          { field: 'brandNameAr', header: 'الماركات' }
        ];
      }

      this.showGov = false;
      this.showCity = false;
      this.showOrg = false;
      this.showSubOrg = false;
      this.showHospital = false;
    }
    this._selectedColumns = this.cols;
  }
  clicktbl(event) {

    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;
    this.loading = true;

    this.sortFilterObjects.searchObj.userId = this.currentUser.id;
    this.sortFilterObjects.searchObj.statusId = 0;
    this.assetDetailService.ListHospitalAssets(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe(items => {
      this.lstAssets = items.results;
      this.count = items.count;
      this.loading = false;
    });
  }
  getAssetsByHospitalId($event) {
    this.masterAssetService.GetMasterAssets().subscribe(lstmasters => {
      this.lstMasterAssets = lstmasters;
    });
  }
  reset() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
  getCitiesByGovId(govId: number) {
    this.cityService.GetCitiesByGovernorateId(govId).subscribe(cities => {
      this.lstCities = cities;
    });
  }
  getSubOrgByOrgId($event) {
    this.subOrganizationService.GetSubOrganizationByOrgId($event.target.value).subscribe(suborgs => {
      this.lstSubOrganizations = suborgs;
    });
  }
  getHospitalsBySubOrgId($event) {
    if (this.sortFilterObjects.searchObj.subOrganizationId != 0) {
      let subOrgId = this.sortFilterObjects.searchObj.subOrganizationId;
      this.hospitalService.GetHospitalsBySubOrganizationId($event.target.value).subscribe(suborgs => {
        this.lstHospitals = suborgs;
      });
    }
  }
  onSearch() {

    this.sortFilterObjects.searchObj.userId = this.currentUser.id;
    if (this.currentUser.hospitalId > 0) {
      this.hospitalId = this.currentUser.hospitalId;
    }
    if (this.sortFilterObjects.searchObj.hospitalId > 0) {
      this.hospitalId = this.sortFilterObjects.searchObj.hospitalId;
    }
    else {
      this.hospitalId = 0;
    }



    this.page.pagenumber = 1;
    this.page.pagesize = 10;

    this.loading = true;
    this.assetDetailService.ListHospitalAssets(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe(items => {
      this.lstAssets = items.results;
      this.count = items.count;
      this.loading = false;
    });


  }
  sort(field) {
    this.sortFilterObjects.sortObj.statusId = 0;


    if (this.sortStatus == "descending") {
      this.sortStatus = "ascending";
      this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    }
    else {
      this.sortStatus = "descending";
      this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    }
    this.sortFilterObjects.searchObj.userId = this.currentUser.id;
    this.sortFilterObjects.sortObj.userId = this.currentUser.id;

    this.lstAssets = [];
    this.sortFilterObjects.sortObj.userId = this.currentUser.id;
    this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    this.sortFilterObjects.sortObj.sortBy = field.currentTarget.id;
    this.assetDetailService.ListHospitalAssets(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe(items => {
      this.lstAssets = items.results;
      this.count = items.count;
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
    this.sortFilterObjects.searchObj.serial = event["serialNumber"];
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
  clearAssetSerailNumber() {
    this.sortFilterObjects.searchObj.serial = "";
    this.assetSerailNumberObj.serialNumber = "";
  }
  clearAssetBarCode() {
    this.sortFilterObjects.searchObj.barCode = "";
    this.assetBarCodeObj.barCode = "";
  }
  onMasterSelectionChanged(event) {
    this.masterAssetService.AutoCompleteMasterAssetName2(event.query).subscribe(masters => {
      this.lstMasterAssets = masters;
      if (this.lang == "en") {

        this.lstMasterAssets.forEach(item => item.master = item.name + " - " + item.brandName + " - " + item.model);
      }
      else {
        this.lstMasterAssets.forEach(item => item.master = item.nameAr + " - " + item.brandNameAr + " - " + item.model);
      }
    });
  }
  getMasterObject(event) {
    this.sortFilterObjects.searchObj.masterAssetId = event["id"];
  }

  printAssets($event, id: number) {
    if ($event.checked) {
      this.lsAssetIds.push(id);
      this.assetDetailService.GetCheckedAssetById(id).subscribe((item) => {
        this.checkedAsset = item;
        this.lstCheckedAssets.push(this.checkedAsset);
      });
    }
    else {
      var index = this.lsAssetIds.indexOf(id);
      this.lsAssetIds.splice(index, 1);
      this.lstCheckedAssets.splice(index, 1);
    }
  }

  generateAssetDBDataQr() {
    if (this.lstCheckedAssets.length > 0) {
      this.assetDetailService.UpdateSelectedQrCode(this.lstCheckedAssets).subscribe(result => {
        alert("Data Saved Successfully");
      });
    }
    else if (this.lstCheckedAssets.length == 0) {
      this.assetDetailService.UpdateQrCode2(this.currentUser.hospitalId).subscribe(result => { alert("Data Saved Successfully"); });
    }
  }

  printQrCode() {
    if (this.currentUser.hospitalTypeNum == 0) {
      
      if (this.lstCheckedAssets.length > 0) {
        this.ngxService.start("generateHospitalQR");
        this.assetDetailService.GenerateWordForHospitalSelectedQrCode(this.lstCheckedAssets).subscribe(result => {
          var filePath = `${environment.Domain}UploadedAttachments/`;
          let fileName = "HospitalCards.docx";
          this.uploadService.downloadQrCodeCardFile(fileName).subscribe(file => {
            var dwnldFile = filePath + 'QrTemplates/' + fileName;
            if (fileName != "" || fileName != null)
              window.open(dwnldFile);
            this.ngxService.stop("generateHospitalQR");
          });
        });
      }
      else if (this.lstCheckedAssets.length == 0) {
      
        this.ngxService.start("generateHospitalQR2");
        this.assetDetailService.GenerateWordForQrCodeForHospitalAssets().subscribe(result => {
          var filePath = `${environment.Domain}UploadedAttachments/`;
          let fileName = "HospitalCards.docx";
          this.uploadService.downloadQrCodeCardFile(fileName).subscribe(file => {
            var dwnldFile = filePath + 'QrTemplates/' + fileName;
            if (fileName != "" || fileName != null)
              window.open(dwnldFile);
            this.ngxService.stop("generateHospitalQR2");
          });
        });
      }











    }
    if (this.currentUser.hospitalTypeNum == 1) {
      if (this.lstCheckedAssets.length > 0) {
        this.ngxService.start("generateHospitalQR");
        this.assetDetailService.GenerateWordForHospitalSelectedQrCode(this.lstCheckedAssets).subscribe(result => {
          var filePath = `${environment.Domain}UploadedAttachments/`;
          let fileName = "HospitalCards.docx";
          this.uploadService.downloadQrCodeCardFile(fileName).subscribe(file => {
            var dwnldFile = filePath + 'QrTemplates/' + fileName;
            if (fileName != "" || fileName != null)
              window.open(dwnldFile);
            this.ngxService.stop("generateHospitalQR");
          });
        });
      }
      else if (this.lstCheckedAssets.length == 0) {
      
        this.ngxService.start("generateHospitalQR2");
        this.assetDetailService.GenerateWordForQrCodeForHospitalAssets().subscribe(result => {
          var filePath = `${environment.Domain}UploadedAttachments/`;
          let fileName = "HospitalCards.docx";
          this.uploadService.downloadQrCodeCardFile(fileName).subscribe(file => {
            var dwnldFile = filePath + 'QrTemplates/' + fileName;
            if (fileName != "" || fileName != null)
              window.open(dwnldFile);
            this.ngxService.stop("generateHospitalQR2");
          });
        });
      }
    }
    if (this.currentUser.hospitalTypeNum == 2) {
      if (this.lstCheckedAssets.length > 0) {
        this.ngxService.start("generatePoliceQR");
        this.assetDetailService.GenerateWordForPoliceSelectedQrCode(this.lstCheckedAssets).subscribe(result => {
          var filePath = `${environment.Domain}UploadedAttachments/`;
          let fileName = "PoliceCards.docx";

          this.uploadService.downloadQrCodeCardFile(fileName).subscribe(file => {
            var dwnldFile = filePath + 'QrTemplates/' + fileName;
            if (fileName != "" || fileName != null)
              window.open(dwnldFile);
            this.ngxService.stop("generatePoliceQR");
          });
        });

      }
      else if (this.lstCheckedAssets.length == 0) {
        this.ngxService.start("generatePoliceQR2");
        this.assetDetailService.GenerateWordForQrCodeForPoliceAssets().subscribe(result => {
          var filePath = `${environment.Domain}UploadedAttachments/`;
          let fileName = "PoliceCards.docx";
          this.uploadService.downloadQrCodeCardFile(fileName).subscribe(file => {
            var dwnldFile = filePath + 'QrTemplates/' + fileName;
            if (fileName != "" || fileName != null)
              window.open(dwnldFile);
            this.ngxService.stop("generatePoliceQR2");
          });
        });

      }
    }
    if (this.currentUser.hospitalTypeNum == 3) {
      if (this.lstCheckedAssets.length > 0) {
        this.ngxService.start("generateUniversityQR");
        this.assetDetailService.GenerateWordForUniversitySelectedQrCode(this.lstCheckedAssets).subscribe(result => {
          var filePath = `${environment.Domain}UploadedAttachments/`;
          let fileName = "UniversityCards.docx";
          this.uploadService.downloadQrCodeCardFile(fileName).subscribe(file => {
            var dwnldFile = filePath + 'QrTemplates/' + fileName;
            if (fileName != "" || fileName != null)
              window.open(dwnldFile);
            this.ngxService.stop("generateUniversityQR");
          });
        });
      }
      else if (this.lstCheckedAssets.length == 0) {
        this.ngxService.start("generateUniversityQR2");
        this.assetDetailService.GenerateWordForQrCodeForUniversityAssets().subscribe(result => {
          var filePath = `${environment.Domain}UploadedAttachments/`;
          let fileName = "UniversityCards.docx";
          this.uploadService.downloadQrCodeCardFile(fileName).subscribe(file => {
            var dwnldFile = filePath + 'QrTemplates/' + fileName;
            if (fileName != "" || fileName != null)
              window.open(dwnldFile);
            this.ngxService.stop("generateUniversityQR2");
          });
        });
      }
    }
  }

  clearSearch() {
    this.lstassetDetailBarcodes = [];
    this.lstAssetSerailNumberObj = [];
    this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    this.sortFilterObjects.searchObj.warrantyTypeId = 0;
    this.sortFilterObjects.searchObj.contractTypeId = 0;
    this.sortFilterObjects.searchObj.departmentId = 0;
    this.sortFilterObjects.searchObj.originId = 0;
    this.sortFilterObjects.searchObj.supplierId = 0;
    this.sortFilterObjects.searchObj.brandId = 0;
    this.sortFilterObjects.searchObj.barCode = "";
    this.assetBarCodeObj = null;


    this.sortFilterObjects.searchObj.serial = "";
    this.assetSerailNumberObj = null;

    this.sortFilterObjects.searchObj.masterAssetId = 0;
    this.masterAssetObj = null;

    this.sortFilterObjects.searchObj.masterAssetName = "";
    this.sortFilterObjects.searchObj.masterAssetNameAr = "";
    this.sortFilterObjects.searchObj.userId = this.currentUser.id;


    if (this.currentUser.hospitalId > 0) {
      this.sortFilterObjects.searchObj.hospitalId = this.currentUser.hospitalId;
    }
    if (this.sortFilterObjects.searchObj.hospitalId > 0) {
      this.sortFilterObjects.searchObj.governorateId = 0;
      this.sortFilterObjects.searchObj.cityId = 0;
      this.sortFilterObjects.searchObj.organizationId = 0;
      this.sortFilterObjects.searchObj.subOrganizationId = 0;
      this.sortFilterObjects.searchObj.hospitalId = 0;
    }


    this.assetDetailService.ListHospitalAssets(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe(items => {
      this.lstAssets = items.results;
      this.count = items.count;
      this.loading = false;
    });
  }
}
