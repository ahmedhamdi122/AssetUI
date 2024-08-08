import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { DialogService, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AssetDetailVM, MainClass, EditAssetDetailVM, ListAssetDetailVM, SearchHospitalAssetVM, SortAssetDetailVM, SortAndFilterVM } from 'src/app/Shared/Models/assetDetailVM';
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
import { CreateComponent } from '../create/create.component';
import { DeleteconfirmationComponent } from '../deleteconfirmation/deleteconfirmation.component';
import { EditComponent } from '../edit/edit.component';
import { ViewComponent } from '../view/view.component';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { CreaterequestComponent } from '../../requests/createrequest/createrequest.component';
import { ListAssetStatusVM } from 'src/app/Shared/Models/assetStatusVM';
import { AssetStatusService } from 'src/app/Shared/Services/assetStatus.service';
import { Workbook } from 'exceljs';
import { DatePipe } from '@angular/common';
import * as fs from 'file-saver';
import { DepartmentService } from 'src/app/Shared/Services/department.service';
import { ListMasterAssetVM } from 'src/app/Shared/Models/MasterAssetVM';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { Table } from 'primeng/table';
import { DetailsComponent } from '../details/details.component';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  @ViewChild("dtAssets") table: Table;
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
  lstWarrantyType: WarrantyType[] = [];
  lstContractTypes: ContractType[] = [];
  lstHospitalAssets: ListAssetDetailVM[] = [];
  lstMasterAssets: ListMasterAssetVM[] = [];
  lstExportHospitalAssets: ListAssetDetailVM[] = [];
  lstMasterAssetNames: ListMasterAssetVM[] = [];
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

  lstStatuses: ListAssetStatusVM[] = [];
  lstMainStatuses: ListAssetStatusVM[] = [];

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
  lstCheckedAssets: ListAssetDetailVM[] = [];
  checkedAsset: ListAssetDetailVM;

  totalAssets: number = 0;

  pageNumber: number;
  pageSize: number;

  selectedWarrantyType: number = 0;
  selectedContractType: number = 0;
  warrantyEndSearch: boolean = true;
  warrantyTypeRadio: boolean = true;

  contractTypeRadio: boolean = true;
  contractDateSearch: boolean = true;

  selectedPage: number = 0;
  lstSelectedColumns: any[] = [];


  sortFilterObjects: SortAndFilterVM;

  countNeedRepair: number = 0;
  countInActive: number = 0;
  countWorking: number = 0;
  countUnderMaintenance: number = 0;
  countUnderInstallation: number = 0;
  countNotWorking: number = 0;
  countShutdown: number = 0;
  countExecluded: number = 0;
  countHold: number = 0;
  totalCount: number = 0;



  lstStatus10: number = 0;
  lstStatus11: number = 0;
  lstStatus12: number = 0;
  lstStatus13: number = 0;
  lstStatus14: number = 0;
  lstStatus15: number = 0;
  lstStatus16: number = 0;
  lstStatus17: number = 0;
  lstStatus18: number = 0;
  lstStatus19: number = 0;




  showTitle: boolean = false;

  constructor(public dialogService: DialogService, private dialog: MatDialog, private masterAssetService: MasterAssetService,
    private authenticationService: AuthenticationService, private assetStatusService: AssetStatusService,
    private activeRoute: ActivatedRoute, private config: DynamicDialogConfig, private cdr: ChangeDetectorRef,
    private assetDetailService: AssetDetailService, private governorateService: GovernorateService, private cityService: CityService,
    private organizationService: OrganizationService, private subOrganizationService: SubOrganizationService,
    private supplierService: SupplierService, private originService: OriginService, private brandService: BrandService,
    private departmentService: DepartmentService, private breadcrumbService: BreadcrumbService, private route: ActivatedRoute,
    private hospitalService: HospitalService, private router: Router, public translate: TranslateService, private datePipe: DatePipe) {
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
    this._selectedColumns = this.cols.filter(col => val.includes(col));
    this.lstSelectedColumns.push(val);
  }
  ngOnInit(): void {

    this.lstWarrantyType = [{ id: 1, name: 'In Warranty', nameAr: 'ضمان ساري' }, { id: 2, name: 'Out of Warranty', nameAr: 'ليس له ضمان' }];
    this.lstContractTypes = [{ id: 1, name: 'In Contract', nameAr: 'في عقد الصيانة' }, { id: 2, name: 'Out of Contract', nameAr: 'خارج عقد الصيانة' }];

    this.warrantyTypeRadio = true;
    this.warrantyEndSearch = true;


    const translationKeys = ['Asset.Assets', 'Asset.HospitalAssets'];
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.route.snapshot, parentUrlArray, translationKeys);



    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });

      this.isHospital2 = (['Admin', 'TLHospitalManager'].some(r => this.lstRoleNames.includes(r)));
      this.isAssetOwner = (['AssetOwner'].some(r => this.lstRoleNames.includes(r)));
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
    this.onLoad();
    this.onLoadByLogIn();

    if (this.isHospitalManager || this.isAdmin) {

      this.showAdd = true;
    }
    else {
      this.showAdd = false;
    }
    if (this.currentUser.hospitalId != 0) {
      this.hospitalId = this.currentUser.hospitalId;
    }
    if (this.sortFilterObjects.searchObj.hospitalId != 0) {
      this.hospitalId = this.sortFilterObjects.searchObj.hospitalId;
    }

    this.assetStatusService.GetHospitalAssetStatus(this.statusId, this.currentUser.id, this.hospitalId).subscribe(statuses => {
      this.lstStatuses = statuses.listStatus;


      console.log("statuses",statuses)
      this.countNeedRepair = statuses.countNeedRepair
      this.countInActive = statuses.countInActive;
      this.countWorking = statuses.countWorking;
      this.countUnderMaintenance = statuses.countUnderMaintenance;
      this.countUnderInstallation = statuses.countUnderInstallation;
      this.countNotWorking = statuses.countNotWorking;
      this.countShutdown = statuses.countShutdown;
      this.countExecluded = statuses.countExecluded;
      this.countHold = statuses.countHold;


      this.lstStatus10 = statuses.lstStatus10;
      this.lstStatus11 = statuses.lstStatus11;
      this.lstStatus12 = statuses.lstStatus12;
      this.lstStatus13 = statuses.lstStatus13;
      this.lstStatus14 = statuses.lstStatus14;
      this.lstStatus15 = statuses.lstStatus15;
      this.lstStatus16 = statuses.lstStatus16;
      this.lstStatus17 = statuses.lstStatus17;
      this.lstStatus18 = statuses.lstStatus18;
      this.lstStatus19 = statuses.lstStatus19;



      this.totalCount = statuses.totalCount;
    });

  }
  onLoad() {
    this.page = {
      pagenumber: 1,
      pagesize: 10,
    }
    this.searchObj = {
      masterAssetName: '', masterAssetNameAr: '',
      contractTypeId: 0, contractDate: '', contractEnd: '', contractStart: '', barCode: '', masterAssetId: 0, statusId: 0, departmentId: 0, warrantyTypeId: 0, end: '', start: '',
      userId: '', model: '', code: '', cityId: 0, governorateId: 0, organizationId: 0, subOrganizationId: 0, originId: 0, supplierId: 0, brandId: 0, hospitalId: 0, assetName: '', serial: '', assetId: 0
    }
    this.sortObj = {
      sortBy: '', model: '', departmentId: 0, masterAssetId: 0, brand: "", supplier: '', userId: '', barCodeValue: '', barCode: '', statusId: 0, hospitalId: 0, governorateId: 0, cityId: 0, subOrganizationId: 0, organizationId: 0, originId: 0, supplierId: 0, brandId: 0,
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

    this.sortFilterObjects = {
      searchObj: { assetName: '', assetId: 0, barCode: '', brandId: 0, cityId: 0, code: '', contractDate: '', contractEnd: '', contractStart: '', contractTypeId: 0, departmentId: 0, end: '', governorateId: 0, hospitalId: 0, masterAssetId: 0, masterAssetName: '', masterAssetNameAr: '', model: '', organizationId: 0, originId: 0, serial: '', start: '', statusId: 0, subOrganizationId: 0, supplierId: 0, userId: '', warrantyTypeId: 0 },
      sortObj: { sortBy: '', assetName: '', assetNameAr: '', barCode: '', barCodeValue: '', brand: '', brandId: 0, brandName: '', brandNameAr: '', cityId: 0, cityName: '', cityNameAr: '', Code: '', departmentId: 0, governorateId: 0, governorateName: '', governorateNameAr: '', hospitalId: 0, hospitalName: '', hospitalNameAr: '', Id: 0, masterAssetId: 0, model: '', organizationId: 0, orgName: '', orgNameAr: '', originId: 0, serial: '', serialValue: '', sortStatus: '', statusId: 0, subOrganizationId: 0, subOrgName: '', subOrgNameAr: '', supplier: '', supplierId: 0, supplierName: '', supplierNameAr: '', userId: '' },
      isSearchAndSort: false
    };

    this.hideShowControls();

    // if (this.activeRoute.snapshot != null) {
    //   let supplierId = this.activeRoute.snapshot.params['supplierId'];
    //   this.sortFilterObjects.searchObj.supplierId = supplierId;
    // }
    // else if (this.activeRoute.snapshot == null) {
    //   this.sortFilterObjects.searchObj.supplierId = 0;
    // }

  }
  onLoadByLogIn() {
    if (this.currentUser.hospitalId > 0 && this.currentUser.organizationId > 0 && this.currentUser.subOrganizationId > 0) {
      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
        if (this.currentUser.organizationId > 0) {
          //   this.searchObj.organizationId = this.currentUser.organizationId;
          this.sortFilterObjects.searchObj.organizationId = this.currentUser.organizationId;
          this.isOrg = true;
          this.subOrganizationService.GetSubOrganizationByOrgId(this.currentUser.organizationId).subscribe(suborgs => {
            this.lstSubOrganizations = suborgs;
            if (this.currentUser.subOrganizationId > 0) {
              //    this.searchObj.subOrganizationId = this.currentUser.subOrganizationId;
              this.sortFilterObjects.searchObj.subOrganizationId = this.currentUser.subOrganizationId;
              this.isSubOrg = true;
              this.hospitalService.GetHospitalsBySubOrganizationId(this.currentUser.organizationId).subscribe(hosts => {
                this.lstHospitals = hosts;
                //  this.searchObj.hospitalId = this.currentUser.hospitalId;
                this.sortFilterObjects.searchObj.hospitalId = this.currentUser.hospitalId;
                this.isHospital = true;
                // this.assetDetailService.ListHospitalAssets(this.sortFilterObjects, 0, 0).subscribe(lstAssets => {
                //   this.lstHospitalAssets = lstAssets.results;
                // });
              });
            }
          });
        }
      });
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
      });
      this.hospitalService.GetHospitalById(this.currentUser.hospitalId).subscribe(hospitalObj => {
        // this.searchObj.governorateId = hospitalObj.governorateId;
        this.sortFilterObjects.searchObj.governorateId = hospitalObj.governorateId;
        this.isGov = true;
        this.cityService.GetCitiesByGovernorateId(this.sortFilterObjects.searchObj.governorateId).subscribe((cities) => {
          this.lstCities = cities;
        });
        // this.searchObj.cityId = hospitalObj.cityId;
        this.sortFilterObjects.searchObj.cityId = hospitalObj.cityId;
        this.isCity = true;
      });
    }
    else if (this.currentUser.hospitalId > 0 && this.currentUser.governorateId > 0 && this.currentUser.cityId > 0) {
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
        if (this.currentUser.governorateId > 0) {
          // this.searchObj.governorateId = this.currentUser.governorateId;
          this.sortFilterObjects.searchObj.governorateId = this.currentUser.governorateId;
          this.isGov = true;
          this.cityService.GetCitiesByGovernorateId(this.currentUser.governorateId).subscribe(cities => {
            this.lstCities = cities;
            if (this.currentUser.cityId > 0) {
              //       this.searchObj.cityId = this.currentUser.cityId;
              this.sortFilterObjects.searchObj.cityId = this.currentUser.cityId;
              this.isCity = true;
              this.hospitalService.getHosByCityId(this.currentUser.cityId).subscribe(hosts => {
                this.lstHospitals = hosts;
                //       this.searchObj.hospitalId = this.currentUser.hospitalId;
                this.sortFilterObjects.searchObj.hospitalId = this.currentUser.hospitalId;
                this.isHospital = true;
                // this.assetDetailService.ListHospitalAssets(this.sortFilterObjects, 0, 0).subscribe(lstAssets => {
                //   this.lstHospitalAssets = lstAssets.results;
                // });
              });
            }
          });
        }
      });
      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
      });
      this.hospitalService.GetHospitalById(this.currentUser.hospitalId).subscribe(hospitalObj => {
        //    this.searchObj.organizationId = hospitalObj.organizationId;
        this.sortFilterObjects.searchObj.organizationId = hospitalObj.organizationId;
        this.isOrg = true;
        this.subOrganizationService.GetSubOrganizationByOrgId(this.sortFilterObjects.searchObj.organizationId).subscribe((subs) => {
          this.lstSubOrganizations = subs;
        });
        // this.searchObj.subOrganizationId = hospitalObj.subOrganizationId;
        this.sortFilterObjects.searchObj.subOrganizationId = hospitalObj.subOrganizationId;
        this.isSubOrg = true;
      });
    }
    else if (this.currentUser.governorateId > 0 && this.currentUser.cityId == 0 && this.currentUser.hospitalId == 0) {
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
        if (this.currentUser.governorateId > 0) {
          // this.searchObj.governorateId = this.currentUser.governorateId;
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
          //  this.searchObj.governorateId = this.currentUser.governorateId;
          this.sortFilterObjects.searchObj.governorateId = this.currentUser.governorateId;
          this.isGov = true;
          this.cityService.GetCitiesByGovernorateId(this.currentUser.governorateId).subscribe(cities => {
            this.lstCities = cities;
            //  this.searchObj.cityId = this.currentUser.cityId;
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
          //    this.searchObj.organizationId = this.currentUser.organizationId;
          this.sortFilterObjects.searchObj.organizationId = this.currentUser.organizationId;
          this.isOrg = true;
          this.subOrganizationService.GetSubOrganizationByOrgId(this.currentUser.organizationId).subscribe(suborgs => {
            this.lstSubOrganizations = suborgs;

            if (this.currentUser.subOrganizationId > 0) {
              //   this.searchObj.subOrganizationId = this.currentUser.subOrganizationId;
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
                this.assetDetailService.ListHospitalAssets(this.sortFilterObjects, 0, 0).subscribe(lstAssets => {
                  this.lstHospitalAssets = lstAssets.results;
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
          { field: 'cityNameAr', header: 'المدينة' },
          { field: 'orgNameAr', header: 'الهيئة' },
          { field: 'subOrgNameAr', header: 'هيئة فرعية' },
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
          { field: 'departmentName', header: 'Department' }

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
          { field: 'departmentName', header: 'Department' }

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
          { field: 'departmentName', header: 'Department' }

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
          { field: 'brandName', header: 'Brands' },
          { field: 'departmentName', header: 'Department' }
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
    this._selectedColumns = this.cols;
  }
  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;

    if (this.currentUser.hospitalId > 0) {
      if (this.statusId != 3)
        this.statusId = this.statusId;
      else
        this.statusId = 3;
    }
    else {
      if (this.statusId != 3)
        this.statusId = this.statusId;
      else if (this.statusId == 3)
        this.statusId = 3;
      else
        this.statusId = 0;
    }
    if (this.currentUser.hospitalId != 0) {
      this.hospitalId = this.currentUser.hospitalId;
    }
    if (this.sortFilterObjects.searchObj.hospitalId != 0) {
      this.hospitalId = this.sortFilterObjects.searchObj.hospitalId;
    }
    this.sortFilterObjects.searchObj.hospitalId = this.hospitalId;


    this.sortFilterObjects.searchObj.statusId = this.statusId;
    this.sortFilterObjects.searchObj.userId = this.currentUser.id;
    this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    this.sortFilterObjects.searchObj.warrantyTypeId = this.selectedWarrantyType;
    this.sortFilterObjects.searchObj.contractTypeId = this.selectedContractType;

    if (this.activeRoute.snapshot != null || this.activeRoute.snapshot != undefined) {
      let brandId = this.activeRoute.snapshot.params['brandId'];
      this.sortFilterObjects.searchObj.brandId = brandId;
      this.showTitle = false;
    }
    if (this.config.data != null || this.config.data != undefined) {
      let brandId = this.config.data.brandId;
      console.log("brandId", brandId);

      this.sortFilterObjects.searchObj.brandId = brandId;
      this.showTitle = false;
    }
    if (this.sortFilterObjects.searchObj.brandId == undefined) {
      this.sortFilterObjects.searchObj.brandId = 0;
      this.showTitle = true;
    }

    this.assetDetailService.ListHospitalAssets(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe(items => {
      this.lstAssets = items.results;
      this.count = items.count;
      this.loading = false;
    });

    this.cdr.detectChanges();
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
  clearSearch() {
    this.lstassetDetailBarcodes = [];
    this.lstAssetSerailNumberObj = [];
    this.lstMasterAssetNames = [];
    this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    this.sortFilterObjects.searchObj.warrantyTypeId = 0;
    this.sortFilterObjects.searchObj.contractTypeId = 0;
    this.sortFilterObjects.searchObj.departmentId = 0;
    this.sortFilterObjects.searchObj.originId = 0;
    this.sortFilterObjects.searchObj.supplierId = 0;
    this.sortFilterObjects.searchObj.brandId = 0;
    this.warrantyTypeRadio = true;
    this.warrantyEndSearch = true;
    this.selectedWarrantyType = 0;
    this.selectedContractType = 0;
    this.sortFilterObjects.searchObj.barCode = "";
    this.assetBarCodeObj = null;


    this.sortFilterObjects.searchObj.serial = "";
    this.assetSerailNumberObj = null;

    this.sortFilterObjects.searchObj.masterAssetName = "";
    this.sortFilterObjects.searchObj.masterAssetNameAr = "";
    this.sortFilterObjects.searchObj.statusId = 0;
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
      this.sortFilterObjects.searchObj.hospitalId = this.sortFilterObjects.searchObj.hospitalId;
    }


    this.assetDetailService.ListHospitalAssets(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe(items => {
      this.lstAssets = items.results;
      this.count = items.count;
      this.loading = false;
    });




  }
  onWarrantyTypeChanged($event) {
    this.warrantyEndSearch = false;
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

    this.lstHospitals =[];
    this.hospitalService.GetHospitalsByGovCityOrgSubOrgId(this.sortFilterObjects.searchObj.governorateId,this.sortFilterObjects.searchObj.cityId,this.sortFilterObjects.searchObj.organizationId,this.sortFilterObjects.searchObj.subOrganizationId).subscribe(lstHosts => {
      this.lstHospitals = lstHosts;
    });
  }
  getHospitalsByGovCityOrgSubOrgId()
  {
    this.lstHospitals =[];
    this.hospitalService.GetHospitalsByGovCityOrgSubOrgId(this.sortFilterObjects.searchObj.governorateId,this.sortFilterObjects.searchObj.cityId,this.sortFilterObjects.searchObj.organizationId,this.sortFilterObjects.searchObj.subOrganizationId).subscribe(lstHosts => {
      this.lstHospitals = lstHosts;
    });
  }
  // getHospitalsBySubOrgId($event) {
  //   if (this.sortFilterObjects.searchObj.subOrganizationId != 0) {
  //     let subOrgId = this.sortFilterObjects.searchObj.subOrganizationId;
  //     this.hospitalService.GetHospitalsBySubOrganizationId($event.target.value).subscribe(suborgs => {
  //       this.lstHospitals = suborgs;
  //     });
  //   }
  // }
  viewAsset(id: number) {
    const ref = this.dialogService.open(ViewComponent, {
      header: this.lang == "en" ? 'View Hospital Asset' : "بيانات أصل في المستشفى",
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
      this.reset();
    });
  }
  onSearch() {

    this.lstStatuses = [];
    this.lstMainStatuses = [];

    if (this.currentUser.hospitalId != 0) {
      this.hospitalId = this.currentUser.hospitalId;
    }
    if (this.sortFilterObjects.searchObj.hospitalId != 0) {
      this.hospitalId = this.sortFilterObjects.searchObj.hospitalId;
    }

    this.page.pagenumber = 1;
    this.page.pagesize = 10;

    this.assetStatusService.GetHospitalAssetStatus(this.statusId, this.currentUser.id, this.hospitalId).subscribe(statuses => {
      this.lstStatuses = statuses.listStatus;

      this.countNeedRepair = statuses.countNeedRepair
      this.countInActive = statuses.countInActive;
      this.countWorking = statuses.countWorking;
      this.countUnderMaintenance = statuses.countUnderMaintenance;
      this.countUnderInstallation = statuses.countUnderInstallation;
      this.countNotWorking = statuses.countNotWorking;
      this.countShutdown = statuses.countShutdown;
      this.countExecluded = statuses.countExecluded;
      this.countHold = statuses.countHold;
      this.lstStatus10 = statuses.lstStatus10;
      this.lstStatus11 = statuses.lstStatus11;
      this.lstStatus12 = statuses.lstStatus12;
      this.lstStatus13 = statuses.lstStatus13;
      this.lstStatus14 = statuses.lstStatus14;
      this.lstStatus15 = statuses.lstStatus15;
      this.lstStatus16 = statuses.lstStatus16;
      this.lstStatus17 = statuses.lstStatus17;
      this.lstStatus18 = statuses.lstStatus18;
      this.lstStatus19 = statuses.lstStatus19;
      this.totalCount = statuses.totalCount;
    });

    this.sortFilterObjects.searchObj.statusId = this.statusId;
    this.sortFilterObjects.searchObj.userId = this.currentUser.id;
    this.sortFilterObjects.searchObj.warrantyTypeId = this.selectedWarrantyType;
    this.sortFilterObjects.searchObj.contractTypeId = this.selectedContractType;
    this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    this.assetDetailService.ListHospitalAssets(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe(items => {
      this.lstAssets = items.results;
      this.count = items.count;
      this.loading = false;
    });
  }
  addAsset() {
    const dialogRef2 = this.dialogService.open(CreateComponent, {
      header: this.lang == "en" ? 'Add Hospital Asset' : "إضافة أصل في المستشفى",
      width: '70%',
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
  deleteAsset(id: number) {
    this.assetDetailService.GetAssetById(id).subscribe((data) => {
      this.selectedObj = data;

      const dialogRef2 = this.dialog.open(DeleteconfirmationComponent, {
        width: '30%',
        autoFocus: true,
        data: {
          id: this.selectedObj.id,
          name: this.selectedObj.assetName,
          nameAr: this.selectedObj.assetNameAr,
        },
      });

      dialogRef2.afterClosed().subscribe(deleted => {
        this.reset();
      });

    });

  }
  editAsset(id: number) {
    const ref = this.dialogService.open(EditComponent, {
      header: this.lang == "en" ? 'Edit Hospital Asset' : "تعديل الأصل في المستشفى",
      closable: true,
      width: '70%',
      data: {
        id: id,
        pageNumber: this.page.pagenumber,
        pageSize: this.page.pagesize
      },
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });
    ref.onClose.subscribe((page) => {
    });
  }
  sort(event) {

    if (this.sortStatus == "descending") {
      this.sortStatus = "ascending";
      this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    }
    else {
      this.sortStatus = "descending";
      this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    }

    this.sortFilterObjects.searchObj.statusId = this.statusId;
    this.sortFilterObjects.searchObj.userId = this.currentUser.id;
    this.sortFilterObjects.searchObj.warrantyTypeId = this.selectedWarrantyType;
    this.sortFilterObjects.searchObj.contractTypeId = this.selectedContractType;

    this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    this.sortFilterObjects.sortObj.sortBy = event.currentTarget.id;
    this.assetDetailService.ListHospitalAssets(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe(items => {
      this.lstAssets = items.results;
      this.count = items.count;
      this.loading = false;
    });

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
      this.reset();
    });
  }
  addExcludeHoldAsset(assetId: number) {
    this.router.navigate(['/dash/hospitalexecludes/addhospitalassetexeclude', assetId])
  }

  getHospitalAssetsByStatusId(id: number) {
    this.page.pagenumber = 1;
    this.statusId = id;
    this.loading = true;
    this.sortFilterObjects.searchObj.statusId = id;
    this.sortFilterObjects.searchObj.userId = this.currentUser.id;
    this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    this.sortFilterObjects.searchObj.warrantyTypeId = this.selectedWarrantyType;
    this.sortFilterObjects.searchObj.contractTypeId = this.selectedContractType;


    this.assetDetailService.ListHospitalAssets(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe(items => {
      this.lstAssets = items.results;
      this.count = items.count;
      this.loading = false;
    });
  }
  getBarCode(event) {
    // this.searchObj.barCode = event["barCode"];
    this.sortFilterObjects.searchObj.barCode = event["barCode"];
  }
  onBarCodeSelectionChanged(event) {
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
    //this.searchObj.serial = event["serialNumber"];

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
      for (let i = 0; i < this.lstCheckedAssets.length; i++) {
        id = this.lstCheckedAssets[i].id;
        this.lstCheckedAssets.splice(index, 1);
      }
    }
  }
  exportExcel() {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Hospital Assets');
    if (this.lang == "en") {
      worksheet.columns = [
        { header: 'Asset Name', key: 'assetName' },
        { header: 'Barcode', key: 'barCode' },
        { header: 'Serial', key: 'serialNumber' },
        { header: 'Model', key: 'model', width: 20 },
        { header: 'Supplier', key: 'supplierName', width: 20 },
        { header: 'Brand', key: 'brandName', width: 20 },
        { header: 'Department', key: 'departmentName', width: 20 },
        { header: 'Warranty Start', key: 'warrantyStart', width: 20 },
        { header: 'Warranty End', key: 'warrantyEnd', width: 20 },
        { header: 'Warranty Expires', key: 'warrantyExpires', width: 20 },
        { header: 'Purchase Date', key: 'purchaseDate', width: 20 },
        { header: 'Receiving Date', key: 'receivingDate', width: 20 },
        { header: 'Operation Date', key: 'strOperationDate', width: 20 },
        { header: 'Installation Date', key: 'strInstallationDate', width: 20 },
        { header: 'In Contract', key: 'inContractAr', width: 20 },
        { header: 'Contract From', key: 'contractFrom', width: 20 },
        { header: 'Contract To', key: 'contractTo', width: 20 },
        { header: 'Building', key: 'buildingName', width: 20 },
        { header: 'Floor', key: 'floorName', width: 20 },
        { header: 'Room', key: 'roomName', width: 20 },
        { header: 'Price', key: 'price', width: 20 },
        { header: 'Cost center', key: 'costCenter', width: 20 },
        { header: 'PO Number', key: 'poNumber', width: 20 },
        { header: 'Remarks', key: 'remarks', width: 20 }
      ];

      if (this.statusId > 0 && this.lstCheckedAssets.length == 0) {
        this.assetDetailService.ListHospitalAssets(this.sortFilterObjects, 0, 0).subscribe(assets => {
          assets.results.forEach(e => {
            worksheet.addRow({
              assetName: e.assetName,
              barCode: e.barCode,
              serialNumber: e.serialNumber,
              model: e.model,
              supplierName: e.supplierName,
              brandName: e.brandName,
              departmentName: e.departmentName,
              warrantyStart: e.warrantyStart,
              warrantyEnd: e.warrantyEnd,
              warrantyExpires: e.warrantyExpires,
              strPurchaseDate: e.strPurchaseDate,
              strInstallationDate: e.strInstallationDate,
              strOperationDate: e.strOperationDate,
              inContract: e.inContract,
              contractFrom: e.contractFrom,
              contractTo: e.contractTo,
              receivingDate: e.strReceivingDate,
              buildName: e.buildingName,
              floorName: e.floorName,
              roomName: e.roomName,
              depreciationRate: e.depreciationRate,
              poNumber: e.poNumber,
              costCenter: e.costCenter,
              price: e.price,
              remarks: e.remarks
            }, "n");
          });
          workbook.xlsx.writeBuffer().then((assets) => {
            let blob = new Blob([assets], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
            fs.saveAs(blob, 'HospitalAssets_' + today + '.xlsx');
          });
        });
      }
      if (this.lstCheckedAssets.length > 0) {
        this.lstCheckedAssets.forEach(e => {
          worksheet.addRow({
            assetName: e.assetName,
            barCode: e.barCode,
            serialNumber: e.serialNumber,
            model: e.model,
            supplierName: e.supplierName,
            brandName: e.brandName,
            departmentName: e.departmentName,
            warrantyStart: e.warrantyStart,
            warrantyEnd: e.warrantyEnd,
            warrantyExpires: e.warrantyExpires,
            strPurchaseDate: e.strPurchaseDate,
            strInstallationDate: e.strInstallationDate,
            strOperationDate: e.strOperationDate,
            inContract: e.inContract,
            contractFrom: e.contractFrom,
            contractTo: e.contractTo,
            receivingDate: e.strReceivingDate,
            buildName: e.buildingName,
            floorName: e.floorName,
            roomName: e.roomName,
            depreciationRate: e.depreciationRate,
            poNumber: e.poNumber,
            costCenter: e.costCenter,
            price: e.price,
            remarks: e.remarks
          }, "n");

        });
        workbook.xlsx.writeBuffer().then((lstCheckedAssets) => {
          let blob = new Blob([lstCheckedAssets], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
          fs.saveAs(blob, 'HospitalAssets_' + today + '.xlsx');
        });
      }
      if (this.statusId == 0 && this.lstCheckedAssets.length == 0) {
        this.assetDetailService.ListHospitalAssets(this.sortFilterObjects, 0, 0).subscribe(assets => {
          assets.results.forEach(e => {
            worksheet.addRow({
              assetName: e.assetName,
              barCode: e.barCode,
              serialNumber: e.serialNumber,
              model: e.modelNumber,
              supplierName: e.supplierName,
              brandName: e.brandName,
              departmentName: e.departmentName,
              warrantyStart: e.warrantyStart,
              warrantyEnd: e.warrantyEnd,
              warrantyExpires: e.warrantyExpires,
              strPurchaseDate: e.strPurchaseDate,
              strInstallationDate: e.strInstallationDate,
              strOperationDate: e.strOperationDate,
              inContract: e.inContract,
              contractFrom: e.contractFrom,
              contractTo: e.contractTo,
              receivingDate: e.strReceivingDate,
              buildName: e.buildName,
              floorName: e.floorName,
              roomName: e.roomName,
              depreciationRate: e.depreciationRate,
              poNumber: e.poNumber,
              costCenter: e.costCenter,
              price: e.price,
              remarks: e.remarks
            }, "n");

          });
          workbook.xlsx.writeBuffer().then((lstAssets) => {
            let blob = new Blob([lstAssets], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
            fs.saveAs(blob, 'HospitalAssets_' + today + '.xlsx');
          });
        });
      }

    }
    else {
      worksheet.columns = [
        { header: 'اسم الأصل', key: 'assetNameAr', width: 50 },
        { header: 'الباركود', key: 'barCode', width: 15 },
        { header: 'السيريال', key: 'serialNumber', width: 20 },
        { header: 'الموديل', key: 'model', width: 20 },
        { header: 'المورد', key: 'supplierNameAr', width: 20 },
        { header: 'الماركة', key: 'brandNameAr', width: 20 },
        { header: 'القسم', key: 'departmentNameAr', width: 20 },
        { header: 'بداية الضمان', key: 'warrantyStart', width: 20 },
        { header: 'نهاية الضمان', key: 'warrantyEnd', width: 20 },
        { header: 'مدة الضمان', key: 'warrantyExpires', width: 20 },
        { header: 'تاريخ الشراء', key: 'strPurchaseDate', width: 20 },
        { header: 'تاريخ الوصول', key: 'receivingDate', width: 20 },
        { header: 'تاريخ التشغيل', key: 'strOperationDate', width: 20 },
        { header: 'تاريخ التركيب', key: 'strInstallationDate', width: 20 },
        { header: 'العقد', key: 'inContractAr', width: 20 },
        { header: 'بداية العقد', key: 'contractFrom', width: 20 },
        { header: 'نهاية العقد', key: 'contractTo', width: 20 },
        { header: 'المبنى', key: 'buildingNameAr', width: 20 },
        { header: 'الطابق', key: 'floorNameAr', width: 20 },
        { header: 'الغرفة', key: 'roomNameAr', width: 20 },
        { header: 'السعر', key: 'price', width: 20 },
        { header: 'cost center', key: 'costCenter', width: 20 },
        { header: 'PO Number', key: 'poNumber', width: 20 },
        { header: 'ملاحظات', key: 'remarks', width: 20 }
      ];

      if (this.statusId > 0 && this.lstCheckedAssets.length == 0) {
        this.assetDetailService.ListHospitalAssets(this.sortFilterObjects, 0, 0).subscribe(assets => {
          assets.results.forEach(e => {
            worksheet.addRow({
              assetNameAr: e.assetNameAr,
              barCode: e.barCode,
              serialNumber: e.serialNumber,
              model: e.model,
              supplierNameAr: e.supplierNameAr,
              brandNameAr: e.brandNameAr,
              departmentNameAr: e.departmentNameAr,
              warrantyStart: e.warrantyStart,
              warrantyEnd: e.warrantyEnd,
              warrantyExpires: e.warrantyExpires,
              strPurchaseDate: e.strPurchaseDate,
              strInstallationDate: e.strInstallationDate,
              strOperationDate: e.strOperationDate,
              inContractAr: e.inContractAr,
              contractFrom: e.contractFrom,
              contractTo: e.contractTo,
              receivingDate: e.strReceivingDate,
              buildNameAr: e.buildingNameAr,
              floorNameAr: e.floorNameAr,
              roomNameAr: e.roomNameAr,
              depreciationRate: e.depreciationRate,
              poNumber: e.poNumber,
              costCenter: e.costCenter,
              price: e.price,
              remarks: e.remarks
            }, "n");
          });
          workbook.xlsx.writeBuffer().then((lstExportHospitalAssets) => {
            let blob = new Blob([lstExportHospitalAssets], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
            fs.saveAs(blob, 'HospitalAssets_' + today + '.xlsx');
          });
        });
      }
      if (this.lstCheckedAssets.length > 0) {
        this.lstCheckedAssets.forEach(e => {
          worksheet.addRow({
            assetNameAr: e.assetNameAr,
            barCode: e.barCode,
            serialNumber: e.serialNumber,
            model: e.model,
            supplierNameAr: e.supplierNameAr,
            brandNameAr: e.brandNameAr,
            departmentNameAr: e.departmentNameAr,
            warrantyStart: e.warrantyStart,
            warrantyEnd: e.warrantyEnd,
            warrantyExpires: e.warrantyExpires,
            strPurchaseDate: e.strPurchaseDate,
            strInstallationDate: e.strInstallationDate,
            strOperationDate: e.strOperationDate,
            inContractAr: e.inContractAr,
            contractFrom: e.contractFrom,
            contractTo: e.contractTo,
            receivingDate: e.strReceivingDate,
            buildNameAr: e.buildingNameAr,
            floorNameAr: e.floorNameAr,
            roomNameAr: e.roomNameAr,
            depreciationRate: e.depreciationRate,
            poNumber: e.poNumber,
            costCenter: e.costCenter,
            price: e.price,
            remarks: e.remarks
          }, "n");

        });
        workbook.xlsx.writeBuffer().then((lstCheckedAssets) => {
          let blob = new Blob([lstCheckedAssets], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
          fs.saveAs(blob, 'HospitalAssets_' + today + '.xlsx');
        });
      }
      if (this.statusId == 0 && this.lstCheckedAssets.length == 0) {

        this.assetDetailService.ListHospitalAssets(this.sortFilterObjects, 0, 0).subscribe(assets => {
          this.lstAssets.forEach(e => {
            worksheet.addRow({
              assetNameAr: e.assetNameAr,
              barCode: e.barCode,
              serialNumber: e.serialNumber,
              model: e.modelNumber,
              supplierNameAr: e.supplierNameAr,
              brandNameAr: e.brandNameAr,
              departmentNameAr: e.departmentNameAr,
              warrantyStart: e.warrantyStart,
              warrantyEnd: e.warrantyEnd,
              warrantyExpires: e.warrantyExpires,
              strPurchaseDate: e.strPurchaseDate,
              strInstallationDate: e.strInstallationDate,
              strOperationDate: e.strOperationDate,
              inContractAr: e.inContractAr,
              contractFrom: e.contractFrom,
              contractTo: e.contractTo,
              receivingDate: e.strReceivingDate,
              buildNameAr: e.buildNameAr,
              floorNameAr: e.floorNameAr,
              roomNameAr: e.roomNameAr,
              depreciationRate: e.depreciationRate,
              poNumber: e.poNumber,
              costCenter: e.costCenter,
              price: e.price,
              remarks: e.remarks
            }, "n");

          });
          workbook.xlsx.writeBuffer().then((lstAssets) => {
            let blob = new Blob([lstAssets], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
            fs.saveAs(blob, 'HospitalAssets_' + today + '.xlsx');

          });
        });
      }
    }
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
    //this.searchObj.masterAssetId = event["id"];
    this.sortFilterObjects.searchObj.masterAssetId = event["id"];
  }
  getStartDate($event) {
    this.sortFilterObjects.searchObj.start = this.datePipe.transform($event, "MM-dd-yyyy");
    this.warrantyTypeRadio = false;
  }
  getEndDate($event) {
    this.sortFilterObjects.searchObj.end = this.datePipe.transform($event, "MM-dd-yyyy");
    this.warrantyTypeRadio = false;
  }
  getContractStartDate($event) {
    this.sortFilterObjects.searchObj.contractStart = this.datePipe.transform($event, "yyyy-MM-dd");
    this.contractTypeRadio = false;
  }
  getContractEndDate($event) {
    this.sortFilterObjects.searchObj.contractEnd = this.datePipe.transform($event, "yyyy-MM-dd");
  }
  clearWarrantyType() {
    this.selectedWarrantyType = 0;
    this.warrantyEndSearch = true;
    this.warrantyTypeRadio = true;
    this.sortFilterObjects.searchObj.start = "";
    this.sortFilterObjects.searchObj.end = "";
  }
  clearEndWarrantyType() {
    this.selectedWarrantyType = 0;
    this.warrantyEndSearch = true;
    this.warrantyTypeRadio = true;

    this.sortFilterObjects.searchObj.start = "";
    this.sortFilterObjects.searchObj.end = "";
  }
  clearContractType() {
    this.selectedContractType = 0;
    this.contractDateSearch = true;
    this.contractTypeRadio = true;
    this.sortFilterObjects.searchObj.contractStart = "";
    this.sortFilterObjects.searchObj.contractEnd = "";

  }
  onContractTypeChanged($event) {
    this.contractDateSearch = false;
  }
  hideWarrantyType() {
    this.selectedWarrantyType = 0;
    this.warrantyEndSearch = true;
    this.warrantyTypeRadio = false;
  }
  viewDetail(id: number) {
    const dialogRef2 = this.dialogService.open(DetailsComponent, {
      header: this.lang == "en" ? "Asset Details" : "بيانات الأصل",
      data: {
        id: id
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
      // this.reload();
    });

  }
  reload() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
  onMasterNameSelectionChanged(event) {
    this.masterAssetService.DistinctAutoCompleteMasterAssetName(event.query).subscribe(masters => {
      this.lstMasterAssetNames = masters;
      if (this.lang == "en") {
        this.lstMasterAssetNames.forEach(item => item.masterName = item.name);
      }
      else {
        this.lstMasterAssetNames.forEach(item => item.masterName = item.nameAr);
      }
    });
  }
  getMasterObjectName(event) {

    this.sortFilterObjects.searchObj.masterAssetId = event["id"];
    this.sortFilterObjects.searchObj.assetId = event["id"];
    this.sortFilterObjects.searchObj.masterAssetName = this.lang == "en" ? event["name"] : "";
    this.sortFilterObjects.searchObj.masterAssetNameAr = this.lang == "ar" ? event["nameAr"] : "";
  }
  printSelectedColumns() {
    // Print selected columns with data
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Hospital Asset Selected');

    // Set header row with selected column names
    const headerRow = this._selectedColumns.map(col => col.header);
    worksheet.addRow(headerRow);


    if (this.statusId > 0 && this.lstCheckedAssets.length == 0) {
      this.assetDetailService.ListHospitalAssets(this.sortFilterObjects, 0, 0).subscribe(assets => {
        assets.results.forEach(row => {
          const dataRow = this._selectedColumns.map(col => row[col.field]);
          var data = worksheet.addRow(dataRow);

          data.eachCell(function (cell) {
            cell.alignment = { horizontal: 'right', wrapText: false };
          });
        });
        workbook.xlsx.writeBuffer().then((lstExportHospitalAssets) => {
          let blob = new Blob([lstExportHospitalAssets], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
          fs.saveAs(blob, 'SelectedColumnHospitalAsset_' + today + '.xlsx');
        });
      });
    }
    if (this.lstCheckedAssets.length > 0) {
      this.lstCheckedAssets.forEach(row => {
        const dataRow = this._selectedColumns.map(col => row[col.field]);
        var data = worksheet.addRow(dataRow);

        data.eachCell(function (cell) {
          cell.alignment = { horizontal: 'right', wrapText: false };
        });
      });
      workbook.xlsx.writeBuffer().then((lstCheckedAssets) => {
        let blob = new Blob([lstCheckedAssets], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
        fs.saveAs(blob, 'SelectedColumnHospitalAsset_' + today + '.xlsx');
      });
    }
    if (this.statusId == 0 && this.lstCheckedAssets.length == 0) {
      this.assetDetailService.ListHospitalAssets(this.sortFilterObjects, 0, 0).subscribe(assets => {
        assets.results.forEach(row => {
          const dataRow = this._selectedColumns.map(col => row[col.field]);
          var data = worksheet.addRow(dataRow);
          data.eachCell(function (cell) {
            cell.alignment = { horizontal: 'right', wrapText: false };
          });
        });
        workbook.xlsx.writeBuffer().then((assets) => {
          let blob = new Blob([assets], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
          fs.saveAs(blob, 'SelectedColumnHospitalAsset_' + today + '.xlsx');
        });
      });
    }





  }
}

export class WarrantyType {
  id: number;
  name: string;
  nameAr: string;
}
export class ContractType {
  id: number;
  name: string;
  nameAr: string;
}