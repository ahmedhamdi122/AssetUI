import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Paging } from 'src/app/Shared/Models/paging';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { AssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { CityService } from 'src/app/Shared/Services/city.service';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { ListMasterAssetVM } from 'src/app/Shared/Models/MasterAssetVM';
import { AssetStockTakingService } from 'src/app/Shared/Services/assetstocktaking.service';
import { ListAssetStockTaking, SearchAssetStockTakingVM, SortAssetStockTakingVM } from 'src/app/Shared/Models/assetStockTaking';
import { ListDepartmentVM } from 'src/app/Shared/Models/departmentVM';
import { DepartmentService } from 'src/app/Shared/Services/department.service';
import { BrandService } from 'src/app/Shared/Services/brand.service';
import { ListBrandVM } from 'src/app/Shared/Models/brandVM';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  lang = localStorage.getItem("lang");
  page: Paging;
  currentUser: LoggedUser;
  count: number;
  sortStatus: string = "descending";
  sortObj: SortAssetStockTakingVM;


  errorMessage: string = "";
  error: any = { isError: false, errorMessage: '' };
  
  lstAssetStockTaking: ListAssetStockTaking[] = [];
  searchObj: SearchAssetStockTakingVM;

  assetSerailNumberObj: AssetDetailVM;
  lstHospitalAssets: ListMasterAssetVM[] = [];
  lstGovernorates: ListGovernorateVM[] = [];
  lstCities: ListCityVM[] = [];
  lstOrganizations: ListOrganizationVM[] = [];
  lstSubOrganizations: ListSubOrganizationVM[] = [];
  lstHospitals: ListHospitalVM[] = [];
  lstassetDetailBarcodes: AssetDetailVM[] = [];
  lstAssetSerailNumberObj: AssetDetailVM[] = [];
  lstMasterAssets: ListMasterAssetVM[] = [];
  lstDepartments: ListDepartmentVM[] = [];
  lstBrands: ListBrandVM[] = [];
  loading: boolean = true;
  errorDisplay: boolean = false;
  isValidDate: boolean = false;
  isGov: boolean = false;
  isCity: boolean = false;
  isOrg: boolean = false;
  isSubOrg: boolean = false;
  isHospital: boolean = false;
  assetBarCodeObj:any;
  cols: any[];
  _selectedColumns: any[];
  columnsSelected: string = "";

  constructor(private authenticationService: AuthenticationService, private assetStockTakingService: AssetStockTakingService,
    public dialogService: DialogService, private route: Router, private governorateService: GovernorateService,
    private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute,
    private cityService: CityService, private organizationService: OrganizationService, private subOrganizationService: SubOrganizationService,
    private hospitalService: HospitalService, private departmentService: DepartmentService, private brandService: BrandService,
    private assetDetailService: AssetDetailService, private masterAssetService: MasterAssetService
  ) { this.currentUser = this.authenticationService.currentUserValue; }

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }
  set selectedColumns(val: any[]) {
    //restore original order
    this._selectedColumns = this.cols.filter(col => val.includes(col));
  }
  ngOnInit(): void {
    this.page = {
      pagenumber: 1,
      pagesize: 10,
    };

    if (this.lang == "en") {
      this.columnsSelected = "Columns Selected";
      this.cols = [
        { field: 'captureDate', header: 'CaptureDate' },
        { field: 'hospitalName', header: 'Hospital' },
        { field: 'assetName', header: 'Name' },
        { field: 'barCode', header: 'Barcode' },
        { field: 'serialNumber', header: 'Serial' },
        { field: 'userName', header: 'User Name' },
        { field: 'brandName', header: 'Brand' },
        { field: 'departmentName', header: 'Department' }
      ];
    }
    else if (this.lang == "ar") {
      this.columnsSelected = "الأعمدة المختارة";
      this.cols = [
        { field: 'captureDate', header: 'تاريخ الجرد' },
        { field: 'hospitalNameAr', header: 'المستشفى' },
        { field: 'assetNameAr', header: 'اسم الأصل' },
        { field: 'barCode', header: 'الباركود' },
        { field: 'serialNumber', header: 'السيريال' },
        { field: 'userName', header: 'اسم المستخدم' },
        { field: 'brandNameAr', header: 'الماركة' },
        { field: 'departmentNameAr', header: 'القسم' }
      ];
    }



    this.sortObj = { stCode: '', sortStatus: '', barCode: '', brandName: '', departmentName: '', hospitalName: '', serialNumber: '', assetName: '', assetNameAr: '', brandNameAr: '', captureDate: '', departmentNameAr: '', hospitalNameAr: '' }


    this.searchObj = { assetName: '', brandId: 0, originId: 0, serial: '', supplierId: 0, lang: '', hospitalName: '', hospitalNameAr: '', strEndDate: '', strStartDate: '', masterAssetId: 0, modelNumber: '', serialNumber: '', code: '', periorityId: 0, statusId: 0, modeId: 0, userId: '', cityId: 0, governorateId: 0, hospitalId: 0, barCode: '', organizationId: 0, subOrganizationId: 0, subject: '', start: '', end: '', assetOwnerId: 0, departmentId: 0 };

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

    const translationKeys = ['Asset.AssetTransfer', 'Asset.StockTaking', 'Asset.ListStockTaking'];
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);

    this.onLoadByLogIn();
  }

  onLoadByLogIn() {
    // if (this.currentUser.hospitalId > 0 && this.currentUser.organizationId > 0 && this.currentUser.subOrganizationId > 0) {
    //   this.organizationService.GetOrganizations().subscribe(items => {
    //     this.lstOrganizations = items;
    //     if (this.currentUser.organizationId > 0) {
    //       this.searchObj.organizationId = this.currentUser.organizationId;
    //       this.isOrg = true;
    //       this.subOrganizationService.GetSubOrganizationByOrgId(this.currentUser.organizationId).subscribe(suborgs => {
    //         this.lstSubOrganizations = suborgs;

    //         if (this.currentUser.subOrganizationId > 0) {
    //           this.searchObj.subOrganizationId = this.currentUser.subOrganizationId;
    //           this.isSubOrg = true;

    //           this.hospitalService.GetHospitalsBySubOrganizationId(this.currentUser.organizationId).subscribe(hosts => {
    //             this.lstHospitals = hosts;
    //             this.searchObj.hospitalId = this.currentUser.hospitalId;
    //             this.isHospital = true;
    //           });
    //         }
    //       });
    //     }
    //   });
    //   this.governorateService.GetGovernorates().subscribe(items => {
    //     this.lstGovernorates = items;
    //   });
    //   this.hospitalService.GetHospitalById(this.currentUser.hospitalId).subscribe(hospitalObj => {
    //     this.searchObj.governorateId = hospitalObj.governorateId;
    //     this.isGov = true;
    //     this.cityService.GetCitiesByGovernorateId(this.searchObj.governorateId).subscribe((cities) => {
    //       this.lstCities = cities;
    //     });
    //     this.searchObj.cityId = hospitalObj.cityId;
    //     this.isCity = true;
    //   });
    // }
    if (this.currentUser.hospitalId > 0 && this.currentUser.governorateId > 0 && this.currentUser.cityId > 0) {
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
  getHospitalsByCityId($event) {
    this.hospitalService.GetHospitalsByCityId($event.target.value).subscribe(hosts => {
      this.lstHospitals = hosts;

    });
  }

  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;



    if (this.searchObj.masterAssetId != 0 || this.searchObj.assetName != "" || this.searchObj.brandId != 0 || this.searchObj.cityId != 0
      || this.searchObj.governorateId != 0 || this.searchObj.hospitalId != 0 || this.searchObj.organizationId != 0
      || this.searchObj.originId != 0 || this.searchObj.serial != "" || this.searchObj.subOrganizationId != 0
      || this.searchObj.supplierId != 0 || this.searchObj.barCode != '' || this.searchObj.departmentId != 0) {
      this.assetStockTakingService.SearchAssetStockTacking(this.searchObj, this.page.pagenumber, this.page.pagesize).subscribe(searchResult => {
        this.lstAssetStockTaking = searchResult.results;
        this.count = searchResult.count;
        this.loading = false;
      });
    }
    else if (this.searchObj.masterAssetId == 0 && this.searchObj.assetName == "" && this.searchObj.brandId == 0 && this.searchObj.cityId == 0
      && this.searchObj.governorateId == 0 && this.searchObj.hospitalId == 0 && this.searchObj.organizationId == 0
      && this.searchObj.originId == 0 && this.searchObj.serial == "" && this.searchObj.subOrganizationId == 0
      && this.searchObj.supplierId == 0 && this.searchObj.barCode == '' && this.searchObj.departmentId == 0) {
      this.assetStockTakingService.GetAssetStockTakingWithPaging(this.page.pagenumber, this.page.pagesize).subscribe(data => {
        this.lstAssetStockTaking = data.results;
        this.count = data.count;
        this.loading = false;
      });
    }
  }

  validateDates(sDate: string, eDate: string) {
    this.isValidDate = true;
    if ((sDate != null && eDate != null) && (eDate) < (sDate)) {
      if (this.lang == "en") {
        this.error = { isError: true, errorMessage: 'Start Date should be less than End Date.' };
        this.isValidDate = false;
      }
      else {
        this.error = { isError: true, errorMessage: 'تاريخ البداية لابد أن يكون أقل من تاريخ النهاية ' };
        this.isValidDate = false;
      }
    }
    return this.isValidDate;
  }
  onSearch() {
    this.lstAssetStockTaking = [];
    if (this.searchObj.assetName == '' && this.searchObj.masterAssetId == 0 && this.searchObj.departmentId == 0 &&
      this.searchObj.brandId == 0 && this.searchObj.hospitalId == 0 && this.searchObj.serial == '' &&
      this.searchObj.governorateId == 0 && this.searchObj.cityId == 0 && this.searchObj.organizationId == 0 && this.searchObj.subOrganizationId == 0
      && this.searchObj.originId == 0 && this.searchObj.supplierId == 0 && this.searchObj.code == '' && this.searchObj.barCode == '') {
      this.errorDisplay = true
      if (this.lang == "en") {
        this.errorMessage = "Please select search criteria";
      }
      else {
        this.errorMessage = "من فضلك اختر مجال البحث";
      }
      return false;
    }
    this.validateDates(this.searchObj.start, this.searchObj.end);
    if (!this.isValidDate) {
      this.errorDisplay = true;
      this.errorMessage = this.error.errorMessage;
      return false;
    }
    else {
      this.lstAssetStockTaking = [];
      this.errorDisplay = false;

      this.searchObj.hospitalId = this.searchObj.hospitalId;
      this.assetStockTakingService.SearchAssetStockTacking(this.searchObj, this.page.pagenumber, this.page.pagesize).subscribe(searchResult => {
        this.lstAssetStockTaking = searchResult.results;
        this.count = searchResult.count;
        this.loading = false;
      });

    }
  }
  getCitiesByGovId(govId: number) {
    this.cityService.GetCitiesByGovernorateId(govId).subscribe(cities => {
      this.lstCities = cities;
    });
  }
  getHospitalsBySubOrgId() {
    if (this.searchObj.subOrganizationId != 0) {
      let subOrgId = this.searchObj.subOrganizationId;
      this.hospitalService.GetHospitalsBySubOrganizationId(subOrgId).subscribe(suborgs => {
        this.lstHospitals = suborgs;
      });
    }
  }
  getSubOrgByOrgId($event) {
    this.subOrganizationService.GetSubOrganizationByOrgId($event.target.value).subscribe(suborgs => {
      this.lstSubOrganizations = suborgs;
    });
  }
  reset() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }

  getAssetsByHospitalId($event) {

    this.masterAssetService.GetMasterAssets().subscribe(lstmasters => {
      this.lstMasterAssets = lstmasters;
    });
    this.searchObj.hospitalId = $event.target.value;



    if (this.currentUser.hospitalId == 0 && this.currentUser.organizationId == 0 && this.currentUser.subOrganizationId == 0 && this.currentUser.governorateId == 0 && this.currentUser.cityId == 0) {
      this.masterAssetService.ListMasterAssetsByHospitalId($event.target.value).subscribe(assets => {
        this.lstHospitalAssets = assets;
      });
    }
    else {
      this.masterAssetService.ListMasterAssetsByHospitalUserId($event.target.value, this.currentUser.id).subscribe(assets => {
        this.lstHospitalAssets = assets;
      });
    }
  }

  sort(field) {

    //   // if (this.sortStatus === "descending") {
    //   //   this.sortStatus = "ascending";
    //   //   this.sortObj.sortStatus = this.sortStatus;
    //   // }
    //   // else {
    //   //   this.sortStatus = "descending"
    //   //   this.sortObj.sortStatus = this.sortStatus;
    //   // }


    //   // if ( field.currentTarget.id == "stCode") {
    //   //   this.sortObj.stCode =  field.currentTarget.id
    //   // }
    //   // else if ( field.currentTarget.id == "كود الجرد") {
    //   //   this.sortObj.stCode =  field.currentTarget.id
    //   // }

    //   // this.listStockTakingScheduleVM = [];
    //   // this.stockTakingScheduleService.SortStockTakingSchedule(this.sortObj, this.page.pagenumber, this.page.pagesize).subscribe(searchResult => {
    //   //   this.listStockTakingScheduleVM = searchResult.results;
    //   //   this.count = searchResult.count;
    //   //   this.loading = false;
    //   // });
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
  }
  getSerialNumber(event) {
    this.searchObj.serialNumber = event["serialNumber"];
  }
  onSerialNumberSelectionChanged(event) {
    if (this.currentUser.hospitalId != 0) {
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
  }
  clearAssetSerailNumber() {
    this.searchObj.serialNumber = "";
  }
  clearAssetBarCode() {
    this.searchObj.barCode = "";
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
}
