import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { ListMasterContractVM, SortAndFilterContractVM } from 'src/app/Shared/Models/masterContractVM';
import { Paging } from 'src/app/Shared/Models/paging';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { MasterContractService } from 'src/app/Shared/Services/masterContract.service'; import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { ViewContractComponent } from '../view/view-contract.component';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { CityService } from 'src/app/Shared/Services/city.service';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { SupplierService } from 'src/app/Shared/Services/supplierService.service';
import { OriginService } from 'src/app/Shared/Services/origin.service';
import { BrandService } from 'src/app/Shared/Services/brand.service';
import { DepartmentService } from 'src/app/Shared/Services/department.service';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { ListSupplierVM } from 'src/app/Shared/Models/supplierVM';
import { ListOriginVM } from 'src/app/Shared/Models/originVM';
import { ListBrandVM } from 'src/app/Shared/Models/brandVM';
import { ListDepartmentVM } from 'src/app/Shared/Models/departmentVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { AssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { ListMasterAssetVM } from 'src/app/Shared/Models/masterAssetVM';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
;

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  lang = localStorage.getItem('lang');
  dir: string = "ltr";
  currentUser: LoggedUser;
  page: Paging;
  count: number;
  selectedContractType: number = 0;
  errorDisplay: boolean = false;
  errorMessage: string;
  lstMasterContracts: ListMasterContractVM[] = [];
  lstContractTypes: ContractType[] = [];
  sortStatus: string = "descending";
  loading: boolean = true;


  isGov: boolean = false;
  isCity: boolean = false;
  isOrg: boolean = false;
  isSubOrg: boolean = false;
  isHospital: boolean = false;
  lstGovernorates: ListGovernorateVM[];
  lstCities: ListCityVM[];
  lstOrganizations: ListOrganizationVM[];
  lstSubOrganizations: ListSubOrganizationVM[];
  lstSuppliers: ListSupplierVM[];
  lstOrigins: ListOriginVM[];
  lstBrands: ListBrandVM[];
  lstDepartments: ListDepartmentVM[] = [];
  lstHospitals: ListHospitalVM[] = [];
  lstMasterAssetNames: ListMasterAssetVM[] = [];
  lstMasterAssets: ListMasterAssetVM[] = [];
  sortFilterObjects: SortAndFilterContractVM;

  lstassetDetailBarcodes: AssetDetailVM[] = [];
  lstAssetSerailNumberObj: AssetDetailVM[] = [];
  assetSerailNumberObj: AssetDetailVM;
  assetBarCodeObj: AssetDetailVM;
  constructor(public dialogService: DialogService, private authenticationService: AuthenticationService, private masterContractService: MasterContractService, private confirmationService: ConfirmationService, private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute,
    private route: Router, private hospitalService: HospitalService, private governorateService: GovernorateService, private cityService: CityService,
    private organizationService: OrganizationService, private subOrganizationService: SubOrganizationService, private assetDetailService: AssetDetailService, private masterAssetService: MasterAssetService, private supplierService: SupplierService, private originService: OriginService, private brandService: BrandService,
    private departmentService: DepartmentService) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.lstContractTypes = [{ id: 1, name: 'In Contract', nameAr: 'ساري' }, { id: 2, name: 'Out of Contract', nameAr: 'غير ساري' }];

    this.sortFilterObjects = {
      searchObj: { contractDate: '', contractNumber: '', end: '', hospitalId: 0, selectedContractType: 0, start: '', subject: '', brandId: 0, cityId: 0, departmentId: 0, governorateId: 0, organizationId: 0, originId: 0, subOrganizationId: 0, supplierId: 0, barCode: '', masterAssetId: 0, serialNumber: '', model: '' },
      sortObj: { contractDate: '', sortStatus: '', subject: '', contractNumber: '', endDate: '', startDate: '' }
    }

    this.page = { pagenumber: 1, pagesize: 10 }
    if (this.lang == "en") {
      this.dir = "ltr";
    }
    else {
      this.dir = "rtl";
    }

    const translationKeys = ['Asset.Maintainance', 'Asset.Contracts'];
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);


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

    this.onLoadByLogIn();
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
        // this.searchObj.cityId = hospitalObj.cityId;
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
          //    this.searchObj.organizationId = this.currentUser.organizationId;
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
  clicktbl(event) {

    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;

    if (this.currentUser.hospitalId > 0)
      this.sortFilterObjects.searchObj.hospitalId = this.currentUser.hospitalId;
    if (this.sortFilterObjects.searchObj.hospitalId > 0)
      this.sortFilterObjects.searchObj.hospitalId = this.sortFilterObjects.searchObj.hospitalId;
    else
      this.sortFilterObjects.searchObj.hospitalId = 0;

    this.masterContractService.ListMasterContracts(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe((items) => {
      this.lstMasterContracts = items.results;
      this.count = items.count;
      this.loading = false;
    });

  }
  addContract() {
    const dialogRef2 = this.dialogService.open(CreateComponent, {
      header: this.lang == "en" ? 'Add Contract' : "إضافة عقد",
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
  editContract(id: number) {
    const ref = this.dialogService.open(EditComponent, {
      header: this.lang == "en" ? 'Edit Contract' : "تعديل العقد",
      closable: true,
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
    ref.onClose.subscribe((page) => {
    });
  }
  viewContract(id: number) {
    const ref = this.dialogService.open(ViewContractComponent, {
      header: this.lang == "en" ? 'View Contract' : "بيانات العقد",
      closable: true,
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
    ref.onClose.subscribe((page) => {
    });
  }
  deleteContract(id: number) {


    this.lstMasterContracts.forEach((element) => {
      if (element.id == id) {
        if (this.lang == 'en') {
          this.confirmationService.confirm({
            message: 'Are you sure that you want to delete this item ' + element['subject'] + ' with related assets?',
            header: 'Delete Item Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.masterContractService.DeleteMasterContract(id).subscribe(deletedObj => {
                this.reset();
              });
            },
            reject: () => {
              this.confirmationService.close();
              this.reset();
            }
          });
        }
        if (this.lang == 'ar') {


          this.confirmationService.confirm({
            message: 'هل أنت متأكد من مسح   ' + element['subject'] + ' وكل العقود المتعلقة به?',
            header: 'تأكيد المسح',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.masterContractService.DeleteMasterContract(id).subscribe(deletedObj => {
                this.reset();
              });
            },
            reject: () => {
              this.confirmationService.close();
              this.reset();
            }
          });
        }




      }
    });

  }
  onSubmit() {
    if (this.currentUser.hospitalId > 0)
      this.sortFilterObjects.searchObj.hospitalId = this.currentUser.hospitalId;
    if (this.sortFilterObjects.searchObj.hospitalId > 0)
      this.sortFilterObjects.searchObj.hospitalId = this.sortFilterObjects.searchObj.hospitalId;

    this.sortFilterObjects.searchObj.selectedContractType = this.selectedContractType;
    this.masterContractService.ListMasterContracts(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe(contracts => {
      this.lstMasterContracts = contracts.results;
      this.count = contracts.count;
      this.loading = false;
    });
  }
  reset() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }
  viewAssetsofContact(id: number) {
  }
  sort(field) {
    if (this.sortStatus === "descending") {
      this.sortStatus = "ascending";
      this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    }
    else {
      this.sortStatus = "descending"
      this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    }
    if (field.currentTarget.id == "Contract Number" || field.currentTarget.id == "رقم العقد") {
      this.sortFilterObjects.sortObj.contractNumber = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "Subject" || field.currentTarget.id == "الموضوع") {
      this.sortFilterObjects.sortObj.subject = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "Contract Date" || field.currentTarget.id == "تاريخ العقد") {
      this.sortFilterObjects.sortObj.contractDate = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "Start Date" || field.currentTarget.id == "تاريخ البداية") {
      this.sortFilterObjects.sortObj.startDate = field.currentTarget.id;
    }
    if (field.currentTarget.id == "End Date" || field.currentTarget.id == "تاريخ النهاية") {
      this.sortFilterObjects.sortObj.endDate = field.currentTarget.id;
    }

    this.masterContractService.ListMasterContracts(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe(data => {
      this.lstMasterContracts = data.results,
        this.count = data.count;
    });
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
  getAssetsByHospitalId($event) {
    this.masterAssetService.GetMasterAssets().subscribe(lstmasters => {
      this.lstMasterAssets = lstmasters;
    });
  }

  getBarCode(event) {
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
      this.assetDetailService.AutoCompleteAssetBarCode(event.query, 0).subscribe(assets => {
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
      this.assetDetailService.AutoCompleteAssetSerial(event.query, 0).subscribe(assets => {
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
    this.sortFilterObjects.searchObj.serialNumber = "";
    this.assetSerailNumberObj.serialNumber = "";
  }
  clearAssetBarCode() {
    this.sortFilterObjects.searchObj.barCode = "";
    this.assetBarCodeObj.barCode = "";
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
  }
  clearSearch() {
    this.lstassetDetailBarcodes = [];
    this.lstAssetSerailNumberObj = [];
    this.lstMasterAssetNames = [];
    this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    this.sortFilterObjects.searchObj.selectedContractType = 0;
    this.sortFilterObjects.searchObj.departmentId = 0;
    this.sortFilterObjects.searchObj.originId = 0;
    this.sortFilterObjects.searchObj.supplierId = 0;
    this.sortFilterObjects.searchObj.brandId = 0;
    this.selectedContractType = 0;
    this.sortFilterObjects.searchObj.barCode = "";
    this.assetBarCodeObj = null;


    this.sortFilterObjects.searchObj.serialNumber = "";
    this.assetSerailNumberObj = null;

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


    this.masterContractService.ListMasterContracts(this.sortFilterObjects, 1, 10).subscribe(items => {
      this.lstMasterContracts = items.results;
      this.count = items.count;
      this.loading = false;
    });

  }
}
export class ContractType {
  id: number;
  name: string;
  nameAr: string;
}