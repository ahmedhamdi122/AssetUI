import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Paging } from 'src/app/Shared/Models/paging';
import { EditSupplierVM } from 'src/app/Shared/Models/supplierVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { ExternalFixService } from 'src/app/Shared/Services/external-fix.service';
import { ListExternalFixVM, SearchExternalFixVM, SortExternalFixVM } from 'src/app/Shared/Models/ExternalFixVM';
import { ConfirmationService } from 'primeng/api';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { CityService } from 'src/app/Shared/Services/city.service';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { DepartmentService } from 'src/app/Shared/Services/department.service';
import { ListDepartmentVM } from 'src/app/Shared/Models/departmentVM';
import { AssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { ListMasterAssetVM } from 'src/app/Shared/Models/MasterAssetVM';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { ListBrandVM } from 'src/app/Shared/Models/brandVM';
import { BrandService } from 'src/app/Shared/Services/brand.service';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  lang = localStorage.getItem("lang");
  lstExternalFix: ListExternalFixVM[] = [];
  lstGovernorates: ListGovernorateVM[];
  lstCities: ListCityVM[];
  lstOrganizations: ListOrganizationVM[];
  lstSubOrganizations: ListSubOrganizationVM[];
  lstHospitals: ListHospitalVM[] = [];
  lstMasterAssets: ListMasterAssetVM[] = [];
  lstBrands: ListBrandVM[] = [];
  lstDepartments: ListDepartmentVM[] = [];
  searchObj: SearchExternalFixVM;

  lstassetDetailBarcodes: AssetDetailVM[] = [];
  lstAssetSerailNumberObj: AssetDetailVM[] = [];
  assetSerailNumberObj: AssetDetailVM;
  sortObj: SortExternalFixVM;
  selectedObj: EditSupplierVM;
  page: Paging;
  currentUser: LoggedUser;
  count: number = 0;
  loading: boolean = true;
  public show: boolean = false;
  public buttonName: any = 'Show';
  isGov: boolean = false;
  isCity: boolean = false;
  isOrg: boolean = false;
  isSubOrg: boolean = false;
  isHospital: boolean = false;
  hospitalId: number = 0;
  sortStatus: string = "ascending";
  cols: any[] = [];
  _selectedColumns: any[] = [];
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }
  set selectedColumns(val: any[]) {
    this._selectedColumns = this.cols.filter(col => val.includes(col));
  }

  constructor(private authenticationService: AuthenticationService, private externalFixService: ExternalFixService, private dialog: MatDialog, public dialogService: DialogService, private confirmationService: ConfirmationService,
    private assetDetailService: AssetDetailService, private governorateService: GovernorateService, private cityService: CityService, private organizationService: OrganizationService, private subOrganizationService: SubOrganizationService,
    private hospitalService: HospitalService, private departmentService: DepartmentService, private route: Router
    , private masterAssetService: MasterAssetService, private brandService: BrandService,private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute) { this.currentUser = this.authenticationService.currentUserValue; }


  ngOnInit(): void {
    this.page = {
      pagenumber: 1,
      pagesize: 10,
    };

    
    const translationKeys = ['Asset.Maintainance',  'Asset.ExternalFix'];
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);


if(this.lang== "ar")
{
    this.cols = [
      { field: 'outDate', header: "تاريخ خروج الجهاز" },
      { field: 'assetNameAr', header: 'اسم الجهاز' },
      { field: 'brandNameAr', header: 'الماركة' },
      { field: 'modelNumber', header: 'الموديل' },
      { field: 'serialNumber', header: 'السيريال' },
      { field: 'barcode', header: 'الباركود' },
      { field: 'supplierNameAr', header: 'المورد' },
      { field: 'departmentNameAr', header: 'القسم' }
    ];
  }
  else{
    this.cols = [
      { field: 'outDate', header: "Out Date" },
      { field: 'assetName', header: 'Asset Name' },
      { field: 'brandName', header: 'Brand' },
      { field: 'modelNumber', header: 'Model' },
      { field: 'serialNumber', header: 'Serial' },
      { field: 'barcode', header: 'BarCode' },
      { field: 'supplierName', header: 'Supplier' },
      { field: 'departmentName', header: 'Department' }
    ];
  }

    this.sortObj = {
      hospitalId: 0, sortStatus: '', outDate: '', barCode: '', assetName: '', assetNameAr: '', serial: '', brand: '', brandName: '', brandNameAr: '', supplierName: '', supplierNameAr: '', supplierId: 0, brandId: 0, masterAssetId: 0, model: '', userId: ''
    }
    this.searchObj = { brandId: 0, supplierId: 0, strEndDate: '', strStartDate: '', masterAssetId: 0, modelNumber: '', serial: '', serialNumber: '', userId: '', cityId: 0, governorateId: 0, hospitalId: 0, barcode: '', organizationId: 0, subOrganizationId: 0, commingEnd: '', commingStart: '', start: '', end: '', departmentId: 0, expectedEnd: '', expectedStart: '' };
    this.onLoadByLogIn();
    this.onLoad();
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

              this.hospitalService.GetHospitalsByCityId(this.currentUser.cityId).subscribe(hosts => {
                this.lstHospitals = hosts;
                this.searchObj.hospitalId = this.currentUser.hospitalId;
                this.hospitalId = this.currentUser.hospitalId;
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
  onLoad() {
    this.governorateService.GetGovernorates().subscribe(items => {
      this.lstGovernorates = items;
    });

    this.organizationService.GetOrganizations().subscribe(items => {
      this.lstOrganizations = items;
    });

    this.departmentService.GetDepartments().subscribe(items => {
      this.lstDepartments = items;
    });

    this.brandService.GetBrands().subscribe(items => {
      this.lstBrands = items;
    });

  }
  deleteFix(id: number) {
    if (this.lang == "ar") {
      this.confirmationService.confirm({
        message:
          ' هل أنت متأكد من مسح هذا العنصر علما بانه سوف يتم حذف جميع الملفات ورجوع الجهاز الى حالته' + ' ؟',
        header: 'تأكيد المسح',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.externalFixService.delete(id).subscribe(deletedId => {
            let currentUrl = this.route.url;
            this.route.routeReuseStrategy.shouldReuseRoute = () => false;
            this.route.onSameUrlNavigation = 'reload';
            this.route.navigate([currentUrl]);
          });
        },
        reject: () => {
          this.confirmationService.close();
          this.ngOnInit();
        },
      });
    }
    else {
      this.confirmationService.confirm({
        message:
          'Are you sure you want to delete this item and all attachments?',
        header: 'Confirm Delete',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.externalFixService.delete(id).subscribe(deletedId => {
            let currentUrl = this.route.url;
            this.route.routeReuseStrategy.shouldReuseRoute = () => false;
            this.route.onSameUrlNavigation = 'reload';
            this.route.navigate([currentUrl]);
          });
        },
        reject: () => {
          this.confirmationService.close();
          this.ngOnInit();
        },
      });
    }
  }

  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;

    if (this.searchObj.masterAssetId != 0 || this.searchObj.brandId != 0 || this.searchObj.cityId != 0
      || this.searchObj.governorateId != 0 || this.searchObj.hospitalId != 0 || this.searchObj.organizationId != 0
      || this.searchObj.serial != "" || this.searchObj.subOrganizationId != 0 || this.searchObj.supplierId != 0 || this.searchObj.barcode != '' || this.searchObj.departmentId != 0) {

      this.onSearch();
    }
    else if (this.sortObj.masterAssetId != 0 || this.sortObj.brandId != 0 || this.sortObj.hospitalId != 0 || this.sortObj.serial != "" || this.sortObj.supplierId != 0 || this.sortObj.barCode != '') {

      this.sort(event);
    }
    else if (this.searchObj.masterAssetId == 0 && this.searchObj.brandId == 0 && this.searchObj.cityId == 0
      && this.searchObj.governorateId == 0 && this.searchObj.hospitalId == 0 && this.searchObj.organizationId == 0
      && this.searchObj.serial == "" && this.searchObj.subOrganizationId == 0 && this.searchObj.supplierId == 0 && this.searchObj.barcode == '' && this.searchObj.departmentId == 0) {
      this.externalFixService.GetAllWithPaging(this.currentUser.hospitalId, this.page.pagenumber, this.page.pagesize).subscribe(data => {
        this.lstExternalFix = data.results;
        this.count = data.count;
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

  onSearch() {
    this.externalFixService.SearchInExternalFix(this.searchObj, this.page.pagenumber, this.page.pagesize).subscribe(lstExternalFixes => {
      this.lstExternalFix = lstExternalFixes.results;
      this.count = lstExternalFixes.count;
      this.loading = false;
    });
  }
  reset() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
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
    this.searchObj.masterAssetId = event["id"];
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
    else if (this.searchObj.hospitalId > 0) {
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
    this.searchObj.serial = event["serialNumber"];
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
  clearAssetSerailNumber() {
    this.searchObj.serialNumber = "";
  }
  clearAssetBarCode() {
    this.searchObj.barcode = "";
  }



  sort($event) {

    if (this.currentUser.hospitalId > 0)
      this.sortObj.hospitalId = this.currentUser.hospitalId;
    else
      this.sortObj.hospitalId = 0;

    if (this.sortStatus === "descending") {
      this.sortStatus = "ascending";
      this.sortObj.sortStatus = this.sortStatus;
    }
    else {
      this.sortStatus = "descending"
      this.sortObj.sortStatus = this.sortStatus;
    }


    if ($event.currentTarget.id == "Out Date" || $event.currentTarget.id == "تاريخ خروج الجهاز") {
      this.sortObj.outDate = $event.currentTarget.id;
    }
    if ($event.currentTarget.id == "Barcode" || $event.currentTarget.id == "الباركود") {
      this.sortObj.barCode = $event.currentTarget.id;
    }
    else if ($event.currentTarget.id == "Name") {
      this.sortObj.assetName = $event.currentTarget.id;
    }
    else if ($event.currentTarget.id == "الاسم") {
      this.sortObj.assetNameAr = $event.currentTarget.id;
    }
    else if ($event.currentTarget.id == "Serial" || $event.currentTarget.id == "السيريال") {
      this.sortObj.serial = $event.currentTarget.id;
    }
    else if ($event.currentTarget.id == "Supplier") {
      this.sortObj.supplierName = $event.currentTarget.id
    }
    else if ($event.currentTarget.id == "المورد") {
      this.sortObj.supplierNameAr = $event.currentTarget.id;
    }
    else if ($event.currentTarget.id == "Brands") {
      this.sortObj.brandName = $event.currentTarget.id;
    }
    else if ($event.currentTarget.id == "الماركة") {
      this.sortObj.brandNameAr = $event.currentTarget.id;
    }

    this.lstExternalFix = [];
    if (this.searchObj.masterAssetId != 0 || this.searchObj.brandId != 0 || this.searchObj.modelNumber != '' || this.searchObj.hospitalId != 0 || this.searchObj.serial != ""
      || this.searchObj.supplierId != 0 || this.searchObj.barcode != '') {
      this.sortObj.hospitalId = this.searchObj.hospitalId;
      this.sortObj.brandId = this.searchObj.brandId;
      this.sortObj.supplierId = this.searchObj.supplierId;
      this.sortObj.masterAssetId = this.searchObj.masterAssetId;
      this.sortObj.model = this.searchObj.modelNumber;
      this.sortObj.serial = this.searchObj.serial;
      this.externalFixService.SortExternalFix(this.sortObj, this.page.pagenumber, this.page.pagesize).subscribe(data => {
        this.lstExternalFix = data.results;
        this.count = data.count;
        this.sortStatus = this.sortObj.sortStatus;
      });
    }
    else {
      this.externalFixService.SortExternalFix(this.sortObj, this.page.pagenumber, this.page.pagesize).subscribe(data => {
        this.lstExternalFix = data.results;
        this.count = data.count;
        this.sortStatus = this.sortObj.sortStatus;
      });
    }

  }
}
