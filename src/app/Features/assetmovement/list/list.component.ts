import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditAssetMovementVM, ListAssetMovementVM, SearchAssetMovementVM, SortAndFilterAssetMovementVM } from 'src/app/Shared/Models/assetMovementVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AssetMovementService } from 'src/app/Shared/Services/assetMovement.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { Paging } from 'src/app/Shared/Models/paging';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { CityService } from 'src/app/Shared/Services/city.service';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { SupplierService } from 'src/app/Shared/Services/supplierService.service';
import { OriginService } from 'src/app/Shared/Services/origin.service';
import { BrandService } from 'src/app/Shared/Services/brand.service';
import { ListMasterAssetVM } from 'src/app/Shared/Models/masterAssetVM';
import { AssetDetailVM, ViewAssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { ListBrandVM } from 'src/app/Shared/Models/brandVM';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { ListSupplierVM } from 'src/app/Shared/Models/supplierVM';
import { ListOriginVM } from 'src/app/Shared/Models/originVM';
import { ListDepartmentVM } from 'src/app/Shared/Models/departmentVM';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';
import { DetailsComponent } from '../../hospital-assets/details/details.component';
import { DialogService } from 'primeng/dynamicdialog';
import { CreateComponent } from '../create/create.component';
import { DeleteAssetMoveconfirmationComponentComponent } from '../delete-asset-moveconfirmation-component/delete-asset-moveconfirmation-component.component';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  lstMovements: ListAssetMovementVM[] = [];
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
  lstassetDetailBarcodes: AssetDetailVM[] = [];
  lstAssetSerailNumberObj: AssetDetailVM[] = [];
  lstHospitalAssets: ViewAssetDetailVM[] = [];
  assetSerailNumberObj: AssetDetailVM;
  assetBarCodeObj: AssetDetailVM;
  page: Paging;
  count: number;
  show: boolean = false;
  public buttonName: any = 'Show';
  loading: boolean = true;
  isGov: boolean = false;
  isCity: boolean = false;
  isOrg: boolean = false;
  isSubOrg: boolean = false;
  isHospital: boolean = false;

  errorDisplay: boolean = false;
  errorMessage: string = "";

  sortStatus: string = "ascending";

  sortFilterObjects: SortAndFilterAssetMovementVM;
  selectedObj: EditAssetMovementVM;
  constructor(private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute, private authenticationService: AuthenticationService, private assetMovementService: AssetMovementService, private route: Router,
    private masterAssetService: MasterAssetService, private governorateService: GovernorateService, private cityService: CityService, private assetDetailService: AssetDetailService,
    public dialogService: DialogService, private dialog: MatDialog,
    private organizationService: OrganizationService, private subOrganizationService: SubOrganizationService, private hospitalService: HospitalService, private supplierService: SupplierService, private originService: OriginService, private brandService: BrandService) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {

    this.page = {
      pagenumber: 1,
      pagesize: 10,
    }

    this.sortFilterObjects = {
      searchObj: { userId: '', start: '', end: '', assetDetailId: 0, ScrapNo: '', ScrapDate: '', barCode: '', departmentId: 0, hospitalId: 0, masterAssetId: 0, modelNumber: '', serialNumber: '', periorityId: 0, governorateId: 0, cityId: 0, organizationId: 0, subOrganizationId: 0, originId: 0, brandId: 0, supplierId: 0 },
      sortObj: { sortBy: '', sortStatus: '' }
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
    const translationKeys = ['Asset.AssetTransfer', 'Asset.AssetMovement', 'Asset.InternalAssetMovement'];
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);

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
              this.hospitalService.GetHospitalsBySubOrganizationId(this.currentUser.subOrganizationId).subscribe(hosts => {
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
  clicktbl($event) {

    this.page.pagenumber = ($event.first + 10) / 10;
    this.page.pagesize = $event.rows;

    this.assetMovementService.GetAssetMovements(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe(movements => {
      this.lstMovements = movements.results;
      this.count = movements.count;
      this.loading = false;
    });



  }
  addAssetMovement() {
    const dialogRef2 = this.dialogService.open(CreateComponent, {
      header: this.lang == "en" ? 'Inner Asset Movement' : "نقل الأصل داخلياً",
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


    // this.route.navigate(['/dash/assetmovement/addassetmovement']);
  }
  onSearch() {
    this.assetMovementService.GetAssetMovements(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe(movements => {
      this.lstMovements = movements.results;
      this.count = movements.count;
      this.loading = false;
    });
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
    if (this.sortFilterObjects.searchObj.hospitalId != 0) {
      this.assetDetailService.AutoCompleteAssetBarCode(event.query, this.sortFilterObjects.searchObj.hospitalId).subscribe(assets => {
        this.lstassetDetailBarcodes = assets;
        this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
      });
    }
    else {
      this.assetDetailService.AutoCompleteAssetBarCode(event.query, this.currentUser.hospitalId).subscribe(assets => {
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
  clearAssetSerailNumber() {
    this.sortFilterObjects.searchObj.serialNumber = "";
    this.assetSerailNumberObj.serialNumber = "";
  }
  clearAssetBarCode() {
    this.sortFilterObjects.searchObj.barCode = "";
    this.assetBarCodeObj.barCode = "";
  }
  getHospitalsBySubOrgId($event) {
    this.hospitalService.GetHospitalsBySubOrganizationId($event.target.value).subscribe(suborgs => {
      this.lstHospitals = suborgs;
    });
  }
  reset() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }
  getSubOrgByOrgId($event) {
    this.subOrganizationService.GetSubOrganizationByOrgId($event.target.value).subscribe(suborgs => {
      this.lstSubOrganizations = suborgs;
    });
  }
  getCitiesByGovId(govId: number) {
    this.cityService.GetCitiesByGovernorateId(govId).subscribe(cities => {
      this.lstCities = cities;
    });
  }
  viewDetail(id: number) {
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
  sort(event) {

    if (this.sortStatus == "descending") {
      this.sortStatus = "ascending";
      this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    }
    else {
      this.sortStatus = "descending";
      this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    }

    this.sortFilterObjects.searchObj.userId = this.currentUser.id;

    this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    this.sortFilterObjects.sortObj.sortBy = event.currentTarget.id;



    this.assetMovementService.GetAssetMovements(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe(movements => {
      this.lstMovements = movements.results;
      this.count = movements.count;
      this.loading = false;
    });

  }
  deleteMovement(id: number) {
    this.assetMovementService.GetAssetMovementById(id).subscribe((data) => {
      this.selectedObj = data;
      const dialogRef2 = this.dialog.open(DeleteAssetMoveconfirmationComponentComponent, {
        width: '30%',
        autoFocus: true,
        data: {
          id: this.selectedObj.id,
          assetName: this.selectedObj.assetName,
          assetNameAr: this.selectedObj.assetNameAr,
        },
      });
      dialogRef2.afterClosed().subscribe(deleted => {
        this.reset();
      });

    });

  }
}
