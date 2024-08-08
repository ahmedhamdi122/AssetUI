import { Component, Input, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { AssetDetailVM, ListAssetDetailVM, SearchHospitalAssetVM, SortAssetDetailVM, ViewAssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { Paging } from 'src/app/Shared/Models/paging';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { FormGroup } from '@angular/forms';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { DepartmentService } from 'src/app/Shared/Services/department.service';
import { BrandService } from 'src/app/Shared/Services/brand.service';
import { OriginService } from 'src/app/Shared/Services/origin.service';
import { SupplierService } from 'src/app/Shared/Services/supplierService.service';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';
import { CityService } from 'src/app/Shared/Services/city.service';
import { ListMasterAssetVM } from 'src/app/Shared/Models/masterAssetVM';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { ListSupplierVM } from 'src/app/Shared/Models/supplierVM';
import { ListOriginVM } from 'src/app/Shared/Models/originVM';
import { ListBrandVM } from 'src/app/Shared/Models/brandVM';
import { ListDepartmentVM } from 'src/app/Shared/Models/departmentVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-supplierassets',
  templateUrl: './supplierassets.component.html',
  styleUrls: ['./supplierassets.component.css']
})
export class SupplierassetsComponent implements OnInit {

  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  page: Paging;
  searchForm: FormGroup;

  lstAssets: ListAssetDetailVM[] = [];
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
  lstRoleNames: string[] = [];
  searchObj: SearchHospitalAssetVM;

  supplierId: number = 0;
  count: number = 0;
  errorMessage: string;
  buttonName: any = 'Show';
  hospitalId: number = 0;

  cols: any[];
  _selectedColumns: any[];
  columnsSelected: string = "";

  show: boolean = false;
  errorDisplay: boolean = false;
  isHospital: boolean = false;
  isAdmin: boolean = false;
  loading: boolean = true;
  isGov: boolean = false;
  isCity: boolean = false;
  isOrg: boolean = false;
  isSubOrg: boolean = false;
  showHospital: boolean = false;
  showGov: boolean = false;
  showCity: boolean = false;
  showOrg: boolean = false;
  showSubOrg: boolean = false;
  showSupplier: boolean = false;
  showBrand: boolean = false;

  sortObj: SortAssetDetailVM;
  sortStatus: string = "ascending";



  lstassetDetailBarcodes: AssetDetailVM[] = [];
  lstAssetSerailNumberObj: AssetDetailVM[] = [];
  assetSerailNumberObj: AssetDetailVM;
  assetBarCodeObj: AssetDetailVM;
  supplierName: string;
  constructor(private authenticationService: AuthenticationService, private activeRoute: ActivatedRoute, private assetDetailService: AssetDetailService,
    private masterAssetService: MasterAssetService, private governorateService: GovernorateService, private cityService: CityService,
    private organizationService: OrganizationService, private subOrganizationService: SubOrganizationService, private router: Router,
    private supplierService: SupplierService, private originService: OriginService, private brandService: BrandService,
    private departmentService: DepartmentService, private hospitalService: HospitalService) { this.currentUser = this.authenticationService.currentUserValue; }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }
  set selectedColumns(val: any[]) {
    this._selectedColumns = this.cols.filter(col => val.includes(col));
  }

  ngOnInit(): void {

    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });
      this.isAdmin = (['Admin'].some(r => this.lstRoleNames.includes(r)));
    }

    let suplrId = this.activeRoute.snapshot.params['supplierId'];
    this.supplierId = suplrId;

    this.supplierService.GetSupplierById(this.supplierId).subscribe(item => {
      this.supplierName = this.lang == "en" ? item.name : item.nameAr;
    });
    this.onLoad();
    this.onLoadByLogIn();
  }
  onLoad() {
    this.page = {
      pagenumber: 1,
      pagesize: 10,
    }
    this.sortObj = {
      sortBy: '',
      model: '', departmentId: 0, masterAssetId: 0, brand: "", supplier: '', userId: '', barCodeValue: '', barCode: '', statusId: 0, hospitalId: 0, governorateId: 0, cityId: 0, subOrganizationId: 0, organizationId: 0, originId: 0, supplierId: 0, brandId: 0,
      serialValue: '', serial: '', Id: 0, assetName: '', assetNameAr: '', orgName: '', orgNameAr: '', cityName: '', cityNameAr: '', sortStatus: '', supplierName: '', supplierNameAr: '',
      governorateName: '', governorateNameAr: '', hospitalName: '', hospitalNameAr: '', Code: '', subOrgName: '', subOrgNameAr: '', brandName: '', brandNameAr: ''
    }
    this.searchObj = {
      masterAssetName: '', masterAssetNameAr: '',
      contractTypeId: 0, contractDate: '', contractEnd: '', contractStart: '', barCode: '', masterAssetId: 0, statusId: 0, departmentId: 0, warrantyTypeId: 0, end: '', start: '',
      userId: '', model: '', code: '', cityId: 0, governorateId: 0, organizationId: 0, subOrganizationId: 0, originId: 0, supplierId: 0, brandId: 0, hospitalId: 0, assetName: '', serial: '', assetId: 0
    }
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
    this.masterAssetService.GetMasterAssets().subscribe(lstmasters => {
      this.lstMasterAssets = lstmasters;
    });
    this.hideShowControls();

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
                this.hospitalId = this.currentUser.hospitalId;
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
                this.hospitalId = this.currentUser.hospitalId;
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
                this.hospitalId = this.currentUser.hospitalId;
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
          { field: 'cityNameAr', header: 'المدينه' },
          { field: 'orgNameAr', header: 'الهيئة' },
          { field: 'subOrgNameAr', header: 'هيئة فرعية' }
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
          { field: 'model', header: 'Model' },
          { field: 'brandName', header: 'Brands' },
          { field: 'departmentName', header: 'القسم' }
        ];
      }
      else if (this.lang == "ar") {
        this.columnsSelected = "الأعمدة المختارة";
        this.cols = [
          { field: 'assetNameAr', header: 'الاسم' },
          { field: 'barCode', header: 'الباركود' },
          { field: 'serial', header: 'السيريال' },
          { field: 'model', header: 'الموديل' },
          { field: 'brandNameAr', header: 'الماركات' },
          { field: 'departmentNameAr', header: 'القسم' }
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
          { field: 'brandName', header: 'Brands' },
          { field: 'departmentName', header: 'القسم' }

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
          { field: 'brandNameAr', header: 'الماركات' },
          { field: 'departmentNameAr', header: 'القسم' }
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
          { field: 'brandName', header: 'Brands' },
          { field: 'departmentName', header: 'القسم' }
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
          { field: 'brandNameAr', header: 'الماركات' },
          { field: 'departmentNameAr', header: 'القسم' }
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
          { field: 'brandNameAr', header: 'Brands' },
          { field: 'departmentName', header: 'القسم' }
        ];
      }
      else if (this.lang == "ar") {
        this.columnsSelected = "الأعمدة المختارة";
        this.cols = [
          { field: 'assetNameAr', header: 'الاسم' },
          { field: 'barCode', header: 'الباركود' },
          { field: 'serial', header: 'السيريال' },
          { field: 'model', header: 'Model' },
          { field: 'brandNameAr', header: 'الماركات' },
          { field: 'departmentNameAr', header: 'القسم' }
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
    this.searchObj.supplierId = this.supplierId;
    this.searchObj.userId = this.currentUser.id;


    this.lstAssets = [];
    if (this.searchObj.masterAssetId != 0 || this.searchObj.brandId != 0
      || this.searchObj.cityId != 0 || this.searchObj.governorateId != 0 || this.searchObj.hospitalId != 0 || this.searchObj.organizationId != 0
      || this.searchObj.originId != 0 || this.searchObj.serial != '' || this.searchObj.subOrganizationId != 0
      || this.searchObj.barCode != '' || this.searchObj.model != '' || this.searchObj.departmentId != 0) {
      this.errorDisplay = false;
      this.assetDetailService.SearchHospitalAssetsBySupplierId(this.searchObj, this.page.pagenumber, this.page.pagesize).subscribe(assets => {
        this.lstAssets = assets.results;
        this.count = assets.count;
        this.loading = false;
      });
    }
    if (this.searchObj.masterAssetId == 0 && this.searchObj.brandId == 0
      && this.searchObj.cityId == 0 && this.searchObj.governorateId == 0 && this.searchObj.hospitalId == 0 && this.searchObj.organizationId == 0 && this.searchObj.subOrganizationId == 0
      && this.searchObj.originId == 0 && this.searchObj.serial == ''
      && this.searchObj.barCode == '' && this.searchObj.model == '' && this.searchObj.departmentId == 0) {
      this.assetDetailService.GetHospitalAssetsBySupplierId(this.supplierId, this.page.pagenumber, this.page.pagesize).subscribe(assets => {
        this.lstAssets = assets.results;
        this.count = assets.count;
        this.loading = false;
      });
    }
  }
  onSearch() {
    this.searchObj.userId = this.currentUser.id;
    this.searchObj.supplierId = this.supplierId;
    this.searchObj.hospitalId = this.currentUser.hospitalId;
    if (this.searchObj.masterAssetId == 0 && this.searchObj.departmentId == 0 && this.searchObj.brandId == 0 && this.searchObj.hospitalId == 0 && this.searchObj.serial == '' &&
      this.searchObj.governorateId == 0 && this.searchObj.cityId == 0 && this.searchObj.organizationId == 0 && this.searchObj.subOrganizationId == 0
      && this.searchObj.originId == 0 && this.searchObj.supplierId == 0 && this.searchObj.code == '' && this.searchObj.barCode == '') {
      this.errorDisplay = true
      if (this.lang == "en") {
        this.errorMessage = "Please select search criteria";
      }
      else {
        this.errorMessage = "من فضلك اختر مجال البحث";
      }
    }
    else {
      this.assetDetailService.SearchHospitalAssetsBySupplierId(this.searchObj, this.page.pagenumber, this.page.pagesize).subscribe(assets => {
        this.lstAssets = assets.results;
        this.count = assets.count;
        this.loading = false;
      });
    }
  }
  toggle() {
    this.show = !this.show;
    if (this.show)
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";

  }
  reset() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
  getBarCode(event) {
    this.searchObj.barCode = event["barCode"];
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
    this.searchObj.serial = event["serialNumber"];
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
    this.searchObj.serial = "";
    this.assetSerailNumberObj.serialNumber = "";
  }
  clearAssetBarCode() {
    this.searchObj.barCode = "";
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
    this.searchObj.masterAssetId = event["id"];
  }
  sort(field) {
    if (this.sortStatus == "descending") {
      this.sortStatus = "ascending";
      this.sortObj.sortStatus = this.sortStatus;
    }
    else {
      this.sortStatus = "descending"
      this.sortObj.sortStatus = this.sortStatus;
    }



    if (field.currentTarget.id == "Barcode") {
      this.sortObj.barCode = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "الباركود") {
      this.sortObj.barCode = field.currentTarget.id;
    }

    else if (field.currentTarget.id == "Name") {
      this.sortObj.assetName = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "الاسم") {
      this.sortObj.assetNameAr = field.currentTarget.id;
    }

    else if (field.currentTarget.id == "Hospital") {
      this.sortObj.hospitalName = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "المستشفى") {
      this.sortObj.hospitalNameAr = field.currentTarget.id;
    }

    else if (field.currentTarget.id == "Governorate") {
      this.sortObj.governorateName = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "المحافظه") {
      this.sortObj.governorateNameAr = field.currentTarget.id;
    }

    else if (field.currentTarget.id == "City") {
      this.sortObj.cityName = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "المدينه") {
      this.sortObj.cityNameAr = field.currentTarget.id;
    }

    else if (field.currentTarget.id == "Organization") {
      this.sortObj.orgName = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "الهيئة") {
      this.sortObj.orgNameAr = field.currentTarget.id;
    }

    else if (field.currentTarget.id == "SubOrganization") {
      this.sortObj.subOrgName = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "هيئة فرعية") {
      this.sortObj.subOrgNameAr = field.currentTarget.id;
    }

    else if (field.currentTarget.id == "Serial") {
      this.sortObj.serial = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "السيريال") {
      this.sortObj.serial = field.currentTarget.id;
    }

    else if (field.currentTarget.id == "Supplier") {
      this.sortObj.supplierName = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "المورد") {
      this.sortObj.supplierNameAr = field.currentTarget.id;
    }

    else if (field.currentTarget.id == "Brands") {
      this.sortObj.brandName = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "الماركات") {
      this.sortObj.brandNameAr = field.currentTarget.id;
    }

    this.sortObj.userId = this.currentUser.id;
    this.sortObj.hospitalId = this.searchObj.hospitalId;
    this.sortObj.supplierId = this.supplierId;
    this.assetDetailService.SortHospitalAssetsBySupplierId(this.sortObj, this.page.pagenumber, this.page.pagesize).subscribe(data => {
      this.lstAssets = [];
      this.lstAssets = data.results;
      this.count = data.count;
      this.loading = false;
    });
  }

}
