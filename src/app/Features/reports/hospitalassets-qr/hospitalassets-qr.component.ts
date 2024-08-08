import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService } from 'primeng/dynamicdialog';
import { EditAssetDetailVM, ListAssetDetailVM, SearchHospitalAssetVM, SortAssetDetailVM, ViewAssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { ListBrandVM } from 'src/app/Shared/Models/brandVM';
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
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { xslsData } from 'src/app/Shared/Models/xslsData';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { CreaterequestComponent } from '../../requests/createrequest/createrequest.component';
import jsPDF from 'jspdf';
@Component({
  selector: 'app-hospitalassets-qr',
  templateUrl: './hospitalassets-qr.component.html',
  styleUrls: ['./hospitalassets-qr.component.css']
})
export class HospitalassetsQRComponent implements OnInit {

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
  lstHospitalAssets: ViewAssetDetailVM[] = [];
  lstGovernorates: ListGovernorateVM[];
  lstCities: ListCityVM[];
  lstOrganizations: ListOrganizationVM[];
  lstSubOrganizations: ListSubOrganizationVM[];
  lstSuppliers: ListSupplierVM[];
  lstOrigins: ListOriginVM[];
  lstBrands: ListBrandVM[];
  lstHospitals: ListHospitalVM[] = [];
  isHospital: boolean = false;
  page: Paging;
  count: number;
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
  lstRoleNames: string[] = [];
  sortObj: SortAssetDetailVM;
  sortStatus: string = "descending";

  direction: string = 'ltr';
  selectedLang: string;
  xslsDataObj: xslsData

  xslsData: xslsData[] = []
  selectedQrFilePath: ViewAssetDetailVM[] = []
  value: string
  qrId: string
  public height = 70;
  public width = 70;
  public padding = 0;





  isGov: boolean = false;
  isCity: boolean = false;
  isOrg: boolean = false;
  isSubOrg: boolean = false;
  showHospital: boolean = false;

  loading: boolean = true;

  cols: any[];
  _selectedColumns: any[];
  columnsSelected: string = "";

  selectedQrFilePath2: string[] = [];
  value2: string;

  lstFilesUrl: string[] = [];
  lstImages: string[] = [];


  pdfcols: number;
  pdfrows: number;
  countItems: number;
  constructor(public dialogService: DialogService, private dialog: MatDialog,
    private authenticationService: AuthenticationService,
    private assetDetailService: AssetDetailService, private governorateService: GovernorateService, private cityService: CityService,
    private organizationService: OrganizationService, private subOrganizationService: SubOrganizationService,
    private supplierService: SupplierService, private originService: OriginService, private brandService: BrandService,
    private hospitalService: HospitalService, private router: Router, public translate: TranslateService
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

    this.xslsDataObj = { type: '', Label: '', barCode: '' }
    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });






      this.isHospital2 = (['Admin', 'TLHospitalManager'].some(r => this.lstRoleNames.includes(r)));
      this.isAssetOwner = (['Admin', 'AssetOwner'].some(r => this.lstRoleNames.includes(r)));
      this.isDE = (['DE'].some(r => this.lstRoleNames.includes(r)));
      this.isAdmin = (['Admin'].some(r => this.lstRoleNames.includes(r)));
      this.isEngManager = (['Admin', 'EngDepManager'].some(r => this.lstRoleNames.includes(r)));
      this.isHospitalManager = (['Admin', 'TLHospitalManager'].some(r => this.lstRoleNames.includes(r)));
    }
    this.onLoad();
    this.onLoadByLogIn();

    this.showAdd = true;

    this.loading = true;
    setTimeout(() => {
      this.assetDetailService.GetAssetDetailsByUserIdWithPaging(this.currentUser.id, this.page).subscribe(items => {
        this.lstAssets = items;
        this.loading = false;
      });
    }, 1000);

    this.assetDetailService.getCount(this.currentUser.id).subscribe((data) => {
      this.count = data;
    });

  }
  onLoad() {
    this.page = {
      pagenumber: 1,
      pagesize: 10,
    }
    this.searchObj = {
      masterAssetName: '', masterAssetNameAr: '',
      contractTypeId: 0, barCode: '', masterAssetId: 0, statusId: 0, departmentId: 0, end: '', start: '', warrantyTypeId: 0, contractDate: '', contractEnd: '', contractStart: '',
      userId: '', model: '', code: '', cityId: 0, governorateId: 0, organizationId: 0, subOrganizationId: 0, originId: 0, supplierId: 0, brandId: 0, hospitalId: 0, assetName: '', serial: '', assetId: 0
    }

    this.sortObj = {
      model: '', departmentId: 0, sortBy: '',
      masterAssetId: 0, brand: "", supplier: '', userId: '', barCodeValue: '', barCode: '', statusId: 0, hospitalId: 0, governorateId: 0, cityId: 0, subOrganizationId: 0, organizationId: 0, originId: 0, supplierId: 0, brandId: 0,
      serialValue: '', serial: '', Id: 0, assetName: '', assetNameAr: '', orgName: '', orgNameAr: '', cityName: '', cityNameAr: '', sortStatus: '', supplierName: '', supplierNameAr: '',
      governorateName: '', governorateNameAr: '', hospitalName: '', hospitalNameAr: '', Code: '', subOrgName: '', subOrgNameAr: '', brandName: '', brandNameAr: ''
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

              this.hospitalService.GetHospitalsBySubOrganizationId(this.currentUser.governorateId).subscribe(hosts => {
                this.lstHospitals = hosts;
                this.searchObj.hospitalId = this.currentUser.hospitalId;
                this.isHospital = true;
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
          { field: 'code', header: 'Code' },
          { field: 'assetName', header: 'Name' },
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
          { field: 'code', header: 'الكود' },
          { field: 'assetNameAr', header: 'الاسم' },
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
          //{ field: 'qrFilePath', header: '' },
          //  { field: 'qrFilePath', header: '' },
          { field: 'code', header: 'Code' },
          { field: 'assetName', header: 'Name' },
          { field: 'serial', header: 'Serial' },
          { field: 'hospitalName', header: 'Hospital' },
          { field: 'cityName', header: 'City' },
          { field: 'orgName', header: 'Organization' },
          { field: 'subOrgName', header: 'SubOrganization' },
          { field: 'supplierName', header: 'Supplier' },
          { field: 'brandNameAr', header: 'Brands' }

        ];
      }
      else if (this.lang == "ar") {
        this.columnsSelected = "الأعمدة المختارة";
        this.cols = [
          { field: 'code', header: 'الكود' },
          { field: 'assetNameAr', header: 'الاسم' },
          { field: 'serial', header: 'السيريال' },
          { field: 'hospitalNameAr', header: 'المستشفى' },
          { field: 'cityNameAr', header: 'المدينه' },
          { field: 'orgNameAr', header: 'الهيئة' },
          { field: 'subOrgNameAr', header: 'هيئة فرعية' },
          { field: 'supplierNameAr', header: 'المورد' },
          { field: 'brandNameAr', header: 'الماركات' }
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
          { field: 'code', header: 'Code' },
          // { field: 'barCode', header: 'Code' },
          { field: 'assetName', header: 'Name' },
          { field: 'serial', header: 'Serial' },
          { field: 'hospitalName', header: 'Hospital' },
          { field: 'orgName', header: 'Organization' },
          { field: 'subOrgName', header: 'SubOrganization' },
          { field: 'supplierName', header: 'Supplier' },
          { field: 'brandNameAr', header: 'Brands' }
        ];
      }
      else if (this.lang == "ar") {
        this.columnsSelected = "الأعمدة المختارة";
        this.cols = [
          { field: 'code', header: 'الكود' },
          { field: 'assetNameAr', header: 'الاسم' },
          { field: 'serial', header: 'السيريال' },
          { field: 'hospitalNameAr', header: 'المستشفى' },
          { field: 'orgNameAr', header: 'الهيئة' },
          { field: 'subOrgNameAr', header: 'هيئة فرعية' },
          { field: 'supplierNameAr', header: 'المورد' },
          { field: 'brandNameAr', header: 'الماركات' }
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
          { field: 'code', header: 'Code' },
          { field: 'barCode', header: 'BarCode' },
          { field: 'assetName', header: 'Name' },
          { field: 'serial', header: 'Serial' },
          { field: 'orgName', header: 'Organization' },
          { field: 'subOrgName', header: 'SubOrganization' },
          { field: 'supplierName', header: 'Supplier' },
          { field: 'brandNameAr', header: 'Brands' }
        ];
      }
      else if (this.lang == "ar") {
        this.columnsSelected = "الأعمدة المختارة";
        this.cols = [
          { field: 'code', header: 'الكود' },
          { field: 'barCode', header: 'الباركود' },
          { field: 'assetNameAr', header: 'الاسم' },
          { field: 'serial', header: 'السيريال' },
          { field: 'orgNameAr', header: 'الهيئة' },
          { field: 'subOrgNameAr', header: 'هيئة فرعية' },
          { field: 'supplierNameAr', header: 'المورد' },
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
          { field: 'code', header: 'Code' },
          { field: 'barCode', header: 'BarCode' },
          { field: 'assetName', header: 'Name' },
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
          { field: 'code', header: 'الكود' },
          { field: 'barCode', header: 'الباركود' },
          { field: 'assetNameAr', header: 'الاسم' },
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
          { field: 'code', header: 'Code' },
          { field: 'barCode', header: 'BarCode' },
          { field: 'assetName', header: 'Name' },
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
          { field: 'code', header: 'الكود' },
          { field: 'barCode', header: 'الباركود' },
          { field: 'assetNameAr', header: 'الاسم' },
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
          { field: 'code', header: 'Code' },
          { field: 'barCode', header: 'BarCode' },
          { field: 'assetName', header: 'Name' },
          { field: 'serial', header: 'Serial' },
          { field: 'supplierName', header: 'Supplier' },
          { field: 'brandNameAr', header: 'Brands' }
        ];
      }
      else if (this.lang == "ar") {
        this.columnsSelected = "الأعمدة المختارة";
        this.cols = [
          { field: 'code', header: 'الكود' },
          { field: 'barCode', header: 'الباركود' },
          { field: 'assetNameAr', header: 'الاسم' },
          { field: 'serial', header: 'السيريال' },
          { field: 'supplierNameAr', header: 'المورد' },
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

    if (this.searchObj.assetId != 0 && this.searchObj.assetName != "" && this.searchObj.brandId != 0 && this.searchObj.cityId != 0
      && this.searchObj.governorateId != 0 && this.searchObj.hospitalId != 0 && this.searchObj.organizationId != 0
      && this.searchObj.originId != 0 && this.searchObj.serial != "" && this.searchObj.subOrganizationId != 0
      && this.searchObj.supplierId != 0 && this.searchObj.code != '' && this.searchObj.departmentId != 0) {



      setTimeout(() => {
        this.errorDisplay = false;
        this.assetDetailService.SearchAssetDetails(this.page.pagenumber, this.page.pagesize, this.searchObj).subscribe(results => {
          // this.lstAssets = results;
          // this.loading = false;
        });
      }, 1000);


      // this.assetDetailService.SearchAssetDetailsCount(this.searchObj).subscribe((data) => {
      //   this.count = data;
      // });

    }
    else {
      setTimeout(() => {
        this.assetDetailService.GetAssetDetailsByUserIdWithPaging(this.currentUser.id, this.page).subscribe(items => {
          this.lstAssets = items;
          this.loading = false;
        });
      }, 1000);




    }
  }
  getAssetsByHospitalId($event) {
    this.assetDetailService.GetListOfAssetDetailsByHospitalId($event.target.value).subscribe(assets => {
      this.lstHospitalAssets = assets;
    })
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
    if (this.searchObj.subOrganizationId != 0) {
      let subOrgId = this.searchObj.subOrganizationId;
      this.hospitalService.GetHospitalsBySubOrganizationId($event.target.value).subscribe(suborgs => {
        this.lstHospitals = suborgs;
      });
    }
  }
  onSearch() {
    this.searchObj.userId = this.currentUser.id;
    if (this.searchObj.assetName == '' && this.searchObj.assetId == 0 &&
      this.searchObj.brandId == 0 && this.searchObj.hospitalId == 0 && this.searchObj.serial == '' &&
      this.searchObj.governorateId == 0 && this.searchObj.cityId == 0 && this.searchObj.organizationId == 0 && this.searchObj.subOrganizationId == 0
      && this.searchObj.originId == 0 && this.searchObj.supplierId == 0 && this.searchObj.code == '' && this.searchObj.departmentId == 0) {
      this.errorDisplay = true
      if (this.lang == "en") {
        this.errorMessage = "Please select search criteria";
      }
      else {
        this.errorMessage = "من فضلك اختر مجال البحث";
      }
    }
    else {
      this.assetDetailService.SearchAssetDetails(this.page.pagenumber, this.page.pagesize, this.searchObj).subscribe(results => {
        // this.lstAssets = results;
        // this.loading = false;
      });

      // this.assetDetailService.SearchAssetDetailsCount(this.searchObj).subscribe((data) => {
      //   this.count = data;
      // });
    }
  }
  openLink() {
    this.router.navigate(['/genericReport/assetReport']);

    // this.router.navigate(['/dash/genericReport/assetReport']);
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
    if (field.currentTarget.id == "Code") {
      this.sortObj.Code = field.currentTarget.id
    }
    else if (field.currentTarget.id == "الكود") {
      this.sortObj.Code = field.currentTarget.id
    }

    else if (field.currentTarget.id == "Name") {
      this.sortObj.assetName = field.currentTarget.id
    }
    else if (field.currentTarget.id == "الاسم") {
      this.sortObj.assetNameAr = field.currentTarget.id
    }

    else if (field.currentTarget.id == "Hospital") {
      this.sortObj.hospitalName = field.currentTarget.id
    }
    else if (field.currentTarget.id == "المستشفى") {
      this.sortObj.hospitalNameAr = field.currentTarget.id
    }

    else if (field.currentTarget.id == "Governorate") {
      this.sortObj.governorateName = field.currentTarget.id
    }
    else if (field.currentTarget.id == "المحافظه") {
      this.sortObj.governorateNameAr = field.currentTarget.id
    }

    else if (field.currentTarget.id == "City") {
      this.sortObj.cityName = field.currentTarget.id
    }
    else if (field.currentTarget.id == "المدينه") {
      this.sortObj.cityNameAr = field.currentTarget.id
    }

    else if (field.currentTarget.id == "Organization") {
      this.sortObj.orgName = field.currentTarget.id
    }
    else if (field.currentTarget.id == "الهيئة") {
      this.sortObj.orgNameAr = field.currentTarget.id
    }

    else if (field.currentTarget.id == "SubOrganization") {
      this.sortObj.subOrgName = field.currentTarget.id
    }
    else if (field.currentTarget.id == "هيئة فرعية") {
      this.sortObj.subOrgNameAr = field.currentTarget.id
    }

    else if (field.currentTarget.id == "Serial") {
      this.sortObj.serial = field.currentTarget.id
    }
    else if (field.currentTarget.id == "السيريال") {
      this.sortObj.serial = field.currentTarget.id
    }

    else if (field.currentTarget.id == "Supplier") {
      this.sortObj.supplierName = field.currentTarget.id
    }
    else if (field.currentTarget.id == "المورد") {
      this.sortObj.supplierNameAr = field.currentTarget.id
    }

    else if (field.currentTarget.id == "Brands") {
      this.sortObj.brandName = field.currentTarget.id
    }
    else if (field.currentTarget.id == "الماركات") {
      this.sortObj.brandNameAr = field.currentTarget.id
    }




    this.sortObj.userId = this.currentUser.id;

    // this.assetDetailService.ListHospitalAssets(this.page.pagenumber, this.page.pagesize, this.sortObj).subscribe(data => {
    //   this.lstAssets = data;
    //   this.loading = false;
    //   this.sortStatus = this.sortObj.sortStatus,
    //     this.sortObj = {
    //       sortBy: '',
    //       model: '', departmentId: 0, masterAssetId: 0, brand: "", supplier: '', userId: '', barCodeValue: '', barCode: '', statusId: 0, hospitalId: 0, governorateId: 0, cityId: 0, subOrganizationId: 0, organizationId: 0, originId: 0, supplierId: 0, brandId: 0,
    //       serialValue: '', serial: '', Id: 0, assetName: '', assetNameAr: '', orgName: '', orgNameAr: '', cityName: '', cityNameAr: '', sortStatus: '', supplierName: '', supplierNameAr: '',
    //       governorateName: '', governorateNameAr: '', hospitalName: '', hospitalNameAr: '', Code: '', subOrgName: '', subOrgNameAr: '', brandName: '', brandNameAr: ''
    //     }
    // })
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
    var doc = new jsPDF('p', 'mm', 'a4');
    //Dimension of A4 in pts: 595 × 842
    //mm 210 x 297
    doc.setFontSize(10);
    // var pageWidth = 595;
    // var pageHeight = 842;
    //   var y = 700;
    var pageWidth = 210;
    var pageHeight = 297;
    var y = 250;
    var pageMargin = 23;

    pageWidth -= pageMargin * 2;
    pageHeight -= pageMargin * 2;

    var cellMargin = 5;
    var cellWidth = 33;
    var cellHeight = 33;

    var startX = pageMargin;
    var startY = pageMargin;

    function createCard(item) {

      if (startY >= pageHeight) {
        doc.addPage();
        startY = pageMargin // Restart height position
      }

      var qrcode = document.getElementById(item.qrFilePath);
      if (qrcode != null) {
        var img = qrcode.querySelector("img").src;
        doc.addImage(img, 'png', startX, startY, 20, 20);
      }
      doc.text(item.barCode, startX, startY + 23);
      doc.text(item.serialNumber, startX, startY + 27);

      var nextPosX = startX + cellWidth + cellMargin;

      if (nextPosX > pageWidth) {
        startX = pageMargin;
        startY += cellHeight;
      } else {
        startX = nextPosX;
      }
    }
    for (var i = 0; i < this.selectedQrFilePath.length; i++) {
      createCard(this.selectedQrFilePath[i]);
    }
    doc.save('Qr.pdf');
  }


  checked(item, qrFilePath) {
    this.lstFilesUrl.push(qrFilePath);
  }


  addServiceRequest(assetId: number) {
    const dialogRef2 = this.dialogService.open(CreaterequestComponent, {
      data: {
        assetId: assetId
      },
      width: '50%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });

    dialogRef2.onClose.subscribe((res) => {
      this.ngOnInit();
    });
  }


  toggle() {
    this.show = !this.show;
    if (this.show)
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";

  }
}
