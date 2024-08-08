import { ScrapService } from './../../../Shared/Services/scrap.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Paging } from 'src/app/Shared/Models/paging';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { ViewComponent } from '../view/view.component';
import { ListScrapVM, ScrapVM, SearchScrapVM, SortAndFilterScrapVM, SortScrapsVM } from 'src/app/Shared/Models/scrapVM';
import { DeleteconfirmationComponent } from '../deleteconfirmation/deleteconfirmation.component';
import { MatDialog } from '@angular/material/dialog';
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

import { BrandService } from 'src/app/Shared/Services/brand.service';
import { CityService } from 'src/app/Shared/Services/city.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { OriginService } from 'src/app/Shared/Services/origin.service';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';
import { SupplierService } from 'src/app/Shared/Services/supplierService.service';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { AssetDetailVM, ViewAssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { environment } from 'src/environments/environment';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { DatePipe } from '@angular/common';
import { DepartmentService } from 'src/app/Shared/Services/department.service';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  currentUser: LoggedUser;
  page: Paging;
  count: number;
  errorDisplay: boolean = false;
  errorMessage: string;
  lstScraps: ListScrapVM[] = [];
  searchObj: SearchScrapVM;
  sortStatus: string = "descending";
  sortObj: SortScrapsVM;
  selectedObj: ScrapVM;


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

  show: boolean = false;
  public buttonName: any = 'Show';

  isGov: boolean = false;
  isCity: boolean = false;
  isOrg: boolean = false;
  isSubOrg: boolean = false;
  isHospital: boolean = false;

  isHospital2: boolean = false;
  isAssetOwner: boolean = false;
  isEngManager: boolean = false;
  isHospitalManager: boolean = false;
  isAdmin: boolean = false;
  isSuperAdmin: boolean = false;
  lstRoleNames: string[] = [];
  lstCheckedScraps: ListScrapVM[] = [];
  lstScrapIds: number[] = [];

  checkedScrapObj: ListScrapVM;
  sortFilterObjects: SortAndFilterScrapVM;


  constructor(private authenticationService: AuthenticationService, private router: Router, public dialogService: DialogService,
    private scrapService: ScrapService, private dialog: MatDialog, private masterAssetService: MasterAssetService,
    private governorateService: GovernorateService, private cityService: CityService, private assetDetailService: AssetDetailService,
    private organizationService: OrganizationService, private subOrganizationService: SubOrganizationService, private departmentService: DepartmentService,
    private hospitalService: HospitalService, private uploadService: UploadFilesService, private datePipe: DatePipe,
    private supplierService: SupplierService, private originService: OriginService, private brandService: BrandService,
    private activateRoute: ActivatedRoute, private breadcrumbService: BreadcrumbService
  ) { this.currentUser = this.authenticationService.currentUserValue; }


  ngOnInit(): void {
    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });

      this.isHospital2 = (['Admin', 'TLHospitalManager'].some(r => this.lstRoleNames.includes(r)));
      this.isAssetOwner = (['AssetOwner'].some(r => this.lstRoleNames.includes(r)));
      this.isAdmin = (['Admin'].some(r => this.lstRoleNames.includes(r)));
      this.isEngManager = (['EngDepManager'].some(r => this.lstRoleNames.includes(r)));
      this.isHospitalManager = (['TLHospitalManager'].some(r => this.lstRoleNames.includes(r)));


      this.sortFilterObjects = {
        searchObj: {userId:'', end: '', start: '', startDate2: '', endDate2: '', startDate: '', endDate: '', lang: '', printedBy: '', hospitalName: '', hospitalNameAr: '', scrapEndDate: new Date, scrapStartDate: new Date, AssetDetailId: 0, ScrapNo: '', ScrapDate: '', barCode: '', departmentId: 0, hospitalId: 0, masterAssetId: 0, modelNumber: '', serialNumber: '', periorityId: 0, governorateId: 0, cityId: 0, organizationId: 0, subOrganizationId: 0, originId: 0, brandId: 0, supplierId: 0 },
        sortObj: {
          sortBy: '', scrapDate: '', assetName: '', assetNameAr: '', serialNumber: '', barcode: '', scrapNo: '',
          departmentName: '', departmentNameAr: '', sortStatus: ''
        }
      };
    }


  //  this.searchObj = {userId:'', end: '', start: '', startDate2: '', endDate2: '', startDate: '', endDate: '', lang: '', printedBy: '', hospitalName: '', hospitalNameAr: '', scrapEndDate: new Date, scrapStartDate: new Date, AssetDetailId: 0, ScrapNo: '', ScrapDate: '', barCode: '', departmentId: 0, hospitalId: 0, masterAssetId: 0, modelNumber: '', serialNumber: '', periorityId: 0, governorateId: 0, cityId: 0, organizationId: 0, subOrganizationId: 0, originId: 0, brandId: 0, supplierId: 0 }
   // this.sortObj = { sortBy: '', scrapDate: '', assetName: '', assetNameAr: '', serialNumber: '', barcode: '', scrapNo: '', departmentName: '', departmentNameAr: '', sortStatus: '' }
    this.page = { pagenumber: 1, pagesize: 10 }

    const translationKeys = ['Asset.AssetTransfer', 'Asset.Execludes', 'Asset.Scrap'];
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

    this.searchObj.scrapStartDate = null;
    this.searchObj.scrapEndDate = null;
    this.onLoadByLogIn();

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
  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;
    this.sortFilterObjects.searchObj.userId= this.currentUser.id;
    //this.sortFilterObjects.searchObj.startDate2
    // if (this.searchObj.masterAssetId != 0 && this.searchObj.brandId != 0 && this.searchObj.cityId != 0
    //   && this.searchObj.governorateId != 0 && this.searchObj.hospitalId != 0 && this.searchObj.organizationId != 0
    //   && this.searchObj.originId != 0 && this.searchObj.serialNumber != '' && this.searchObj.subOrganizationId != 0
    //   && this.searchObj.modelNumber != ''
    //   && this.searchObj.startDate2 != '' && this.searchObj.endDate2 != ''
    //   && this.searchObj.supplierId != 0 && this.searchObj.barCode != '' && this.searchObj.departmentId != 0) {
    //   this.scrapService.SearchInScraps(this.searchObj, this.page.pagenumber, this.page.pagesize).subscribe(scraps => {
    //     this.lstScraps = scraps.results;
    //     this.count = scraps.count;
    //   });
    // }
    // if (this.searchObj.masterAssetId == 0 && this.searchObj.brandId == 0 && this.searchObj.cityId == 0
    //   && this.searchObj.governorateId == 0 && this.searchObj.hospitalId == 0 && this.searchObj.organizationId == 0
    //   && this.searchObj.originId == 0 && this.searchObj.serialNumber == '' && this.searchObj.subOrganizationId == 0
    //   && this.searchObj.modelNumber == ''

    //   && this.searchObj.startDate2 == '' && this.searchObj.endDate2 == ''
    //   && this.searchObj.supplierId == 0 && this.searchObj.barCode == '' && this.searchObj.departmentId == 0) {
    //   this.scrapService.GetAllScrapsWithPaging(this.page.pagenumber, this.page.pagesize).subscribe(scraps => {
    //     this.lstScraps = scraps.results;
    //     this.count = scraps.count;
    //   });
    // }
    // if (this.searchObj.masterAssetId == 0 && this.searchObj.brandId == 0
    //   && this.searchObj.originId == 0 && this.searchObj.serialNumber == ''
    //   && this.searchObj.modelNumber == '' && this.searchObj.startDate2 == '' && this.searchObj.endDate2 == ''
    //   && this.searchObj.supplierId == 0 && this.searchObj.barCode == '' && this.searchObj.departmentId == 0) {
    //   this.scrapService.GetAllScrapsWithPaging(this.page.pagenumber, this.page.pagesize).subscribe(scraps => {
    //     this.lstScraps = scraps.results;
    //     this.count = scraps.count;
    //   });
    // }

    this.scrapService.ListScraps( this.page.pagenumber, this.page.pagesize,this.sortFilterObjects).subscribe(scraps => {
      this.lstScraps = scraps.results;
      this.count = scraps.count;
    });

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

    this.sortFilterObjects.sortObj.sortBy = field.currentTarget.id;
    this.sortFilterObjects.searchObj.userId= this.currentUser.id;
    this.scrapService.ListScraps(this.page.pagenumber, this.page.pagesize, this.sortFilterObjects).subscribe(data => {
      this.lstScraps = data.results;
      this.count = data.count;
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
  viewScrap(id: number) {
    const dialogRef2 = this.dialogService.open(ViewComponent, {
      header: this.lang == "en" ? 'View Scrap' : "بيانات الجهاز المكهن",
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
      this.reload();
    });
  }
  deleteScrap(id: number) {
    this.scrapService.GetScrapById(id).subscribe((data) => {
      this.selectedObj = data;

      const dialogRef2 = this.dialog.open(DeleteconfirmationComponent, {
        width: '30%',
        autoFocus: true,
        data: {
          id: this.selectedObj.id,

        },
      });
      dialogRef2.afterClosed().subscribe(deleted => {
        this.reload();
      });
    });

  }
  onSearch() {
    console.log("this.sortFilterObjects",this.sortFilterObjects)
    this.sortFilterObjects.searchObj.startDate2 =this.datePipe.transform( this.sortFilterObjects.searchObj.scrapStartDate.toString(),"MM-dd-yyyy");
    this.sortFilterObjects.searchObj.endDate2 =this.datePipe.transform( this.sortFilterObjects.searchObj.scrapEndDate.toString(),"MM-dd-yyyy");
    this.scrapService.ListScraps( this.page.pagenumber, this.page.pagesize,this.sortFilterObjects).subscribe(scraps => {
      this.lstScraps = scraps.results;
      this.count = scraps.count;
    });
    // if (this.searchObj.masterAssetId == 0 && this.searchObj.departmentId == 0 &&
    //   this.searchObj.brandId == 0 && this.searchObj.hospitalId == 0 && this.searchObj.serialNumber == '' &&
    //   this.searchObj.governorateId == 0 && this.searchObj.cityId == 0 && this.searchObj.organizationId == 0
    //   && this.searchObj.subOrganizationId == 0 && this.searchObj.modelNumber == ''

    //   && this.searchObj.startDate2 == '' && this.searchObj.endDate2 == ''


    //   && this.searchObj.originId == 0 && this.searchObj.supplierId == 0 && this.searchObj.barCode == '') {
    //   this.errorDisplay = true
    //   if (this.lang == "en") {
    //     this.errorMessage = "Please select search criteria";
    //   }
    //   else {
    //     this.errorMessage = "من فضلك اختر مجال البحث";
    //   }
    // }
    // else {

    //   this.scrapService.SearchInScraps(this.searchObj, this.page.pagenumber, this.page.pagesize).subscribe(scraps => {
    //     this.lstScraps = scraps.results;
    //     this.count = scraps.count;
    //   });
    // }

  }
  getSubOrgByOrgId($event) {
    this.subOrganizationService.GetSubOrganizationByOrgId($event.target.value).subscribe(suborgs => {
      this.lstSubOrganizations = suborgs;
    });
  }
  getCitiesByGovId($event) {
    this.cityService.GetCitiesByGovernorateId($event.target.value).subscribe(cities => {
      this.lstCities = cities;
    });
  }

  getAssetsByHospitalId($event) {
    this.masterAssetService.GetMasterAssets().subscribe(lstmasters => {
      this.lstMasterAssets = lstmasters;
    });
  }

  getHospitalsBySubOrgId($event) {
    this.hospitalService.GetHospitalsBySubOrganizationId($event.target.value).subscribe(hospitals => {
      this.lstHospitals = hospitals;
    });
  }

  getStartDate($event) {
    this.searchObj.startDate2 = this.datePipe.transform($event, "yyyy-MM-dd");

  }
  getEndDate($event) {
    this.searchObj.endDate2 = this.datePipe.transform($event, "yyyy-MM-dd");
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
    this.searchObj.serialNumber = "";
    this.assetSerailNumberObj.serialNumber = "";
  }
  clearAssetBarCode() {
    this.searchObj.barCode = "";
    this.assetBarCodeObj.barCode = "";
  }
  generatePDF() {
    if (this.lstCheckedScraps.length > 0) {
      this.scrapService.CreateScrapCheckedPDF(this.lstCheckedScraps).subscribe(scraps => {
        this.lstScraps = scraps;
        let fileName = "CreateScrapCheckedReport.pdf";
        var filePath = `${environment.Domain}UploadedAttachments/`;
        this.uploadService.downloadCheckedScrapPDF(fileName).subscribe(file => {
          var dwnldFile = filePath + 'ScrapReports/' + fileName;
          if (fileName != "" || fileName != null)
            window.open(dwnldFile);


          this.scrapService.GetAllScrapsWithPaging(this.page.pagenumber, this.page.pagesize).subscribe(scraps => {
            this.lstScraps = scraps.results;
            this.count = scraps.count;
          });
        });
      });
    }
    if (this.lstCheckedScraps.length == 0) {
      this.searchObj.lang = this.lang;
      this.searchObj.printedBy = this.currentUser.userName;
      this.searchObj.hospitalNameAr = this.currentUser.hospitalNameAr;
      this.searchObj.hospitalName = this.currentUser.hospitalName;

      this.scrapService.getSearchPDFForScraps(this.searchObj).subscribe(scraps => {
        this.lstScraps = scraps;
        let fileName = "ScrapReportPDF.pdf";
        var filePath = `${environment.Domain}UploadedAttachments/`;
        this.uploadService.downloadScrapPDF(fileName).subscribe(file => {
          var dwnldFile = filePath + 'ScrapReports/' + fileName;
          if (fileName != "" || fileName != null)
            window.open(dwnldFile);



          this.scrapService.GetAllScrapsWithPaging(this.page.pagenumber, this.page.pagesize).subscribe(scraps => {
            this.lstScraps = scraps.results;
            this.count = scraps.count;
          });
        });
      });
    }


  }
  checkedScraps($event, id: number) {
    if ($event.checked) {
      this.lstScrapIds.push(id);
      this.scrapService.SelectedScrapById(id).subscribe((item) => {
        this.checkedScrapObj = item;
        item.lang = this.lang;
        item.printedBy = this.currentUser.userName;
        item.hospitalNameAr = this.currentUser.hospitalNameAr;
        item.hospitalName = this.currentUser.hospitalName;

        this.lstCheckedScraps.push(this.checkedScrapObj);
      });


    }
    else {
      var index = this.lstScrapIds.indexOf(id);
      this.lstScrapIds.splice(index, 1);
      for (let i = 0; i < this.lstCheckedScraps.length; i++) {
        id = this.lstCheckedScraps[i].id;
        this.lstCheckedScraps.splice(index, 1);
      }
    }
  }
}
