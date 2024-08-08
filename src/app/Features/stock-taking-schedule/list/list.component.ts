import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Paging } from 'src/app/Shared/Models/paging';

import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { StockTakingScheduleService } from 'src/app/Shared/Services/stock-taking-schedule.service';
import { ListStockTakingScheduleVM, RelatedHospital, SearchStockTakingScheduleVM, SortStockTakingScheduleVM } from 'src/app/Shared/Models/StockTakingScheduleVM';
import { ConfirmationService } from 'primeng/api';
import { StockTakingHospitalServiceService } from 'src/app/Shared/Services/stock-taking-hospital-service.service';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
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
import { ListMasterAssetVM } from 'src/app/Shared/Models/masterAssetVM';
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
  sortObj: SortStockTakingScheduleVM;


  errorMessage: string = "";
  error: any = { isError: false, errorMessage: '' };
  buttonName: any = 'Show';

  stockTakingScheduleObj: ListStockTakingScheduleVM;
  searchObj: SearchStockTakingScheduleVM;
  assetSerailNumberObj: AssetDetailVM;

  listStockTakingScheduleVM: ListStockTakingScheduleVM[] = [];
  lstHospitals: RelatedHospital[] = [];
  lstGovernorates: ListGovernorateVM[] = [];
  lstCities: ListCityVM[] = [];
  lstOrganizations: ListOrganizationVM[] = [];
  lstSubOrganizations: ListSubOrganizationVM[] = [];
  ddlHospitals: ListHospitalVM[] = [];
  lstassetDetailBarcodes: AssetDetailVM[] = [];
  lstAssetSerailNumberObj: AssetDetailVM[] = [];
  lstMasterAssets: ListMasterAssetVM[] = [];
  loading: boolean = true;
  relatedHospitalsDisplay: boolean = false;
  show: boolean = false;
  errorDisplay: boolean = false;
  isValidDate: boolean = false;
  isGov: boolean = false;
  isCity: boolean = false;
  isOrg: boolean = false;
  isSubOrg: boolean = false;
  isHospital: boolean = false;

  constructor(private authenticationService: AuthenticationService, private stockTakingScheduleService: StockTakingScheduleService,
    public dialogService: DialogService, private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute,
    private confirmationService: ConfirmationService, private route: Router, private governorateService: GovernorateService,
    private cityService: CityService, private organizationService: OrganizationService, private subOrganizationService: SubOrganizationService,
    private hospitalService: HospitalService, private stockTakingHospitalService: StockTakingHospitalServiceService,
    // private assetDetailService: AssetDetailService, 
    //private masterAssetService: MasterAssetService
  ) { this.currentUser = this.authenticationService.currentUserValue; }


  ngOnInit(): void {
    this.page = {
      pagenumber: 1,
      pagesize: 10,
    };


    //   this.sortObj = { stCode: '', sortStatus: '', barCode: '', brandName: '', departmentName: '', hospitalName: '', serialNumber: '' }

    this.searchObj = { lang: '', hospitalName: '', hospitalNameAr: '', printedBy: '', strEndDate: '', strStartDate: '', masterAssetId: 0, modelNumber: '', serialNumber: '', code: '', periorityId: 0, statusId: 0, modeId: 0, userId: '', cityId: 0, governorateId: 0, hospitalId: 0, barcode: '', organizationId: 0, subOrganizationId: 0, subject: '', start: '', end: '', assetOwnerId: 0, departmentId: 0 };

    this.governorateService.GetGovernorates().subscribe(items => {
      this.lstGovernorates = items;
    });

    this.organizationService.GetOrganizations().subscribe(items => {
      this.lstOrganizations = items;
    });

    const translationKeys = ['Asset.AssetTransfer', 'Asset.StockTaking', 'Asset.stockTakingSchedule'];
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);


    // this.onLoadByLogIn();
  }

  // onLoadByLogIn() {
  //   // if (this.currentUser.hospitalId > 0 && this.currentUser.organizationId > 0 && this.currentUser.subOrganizationId > 0) {
  //   //   this.organizationService.GetOrganizations().subscribe(items => {
  //   //     this.lstOrganizations = items;
  //   //     if (this.currentUser.organizationId > 0) {
  //   //       this.searchObj.organizationId = this.currentUser.organizationId;
  //   //       this.isOrg = true;
  //   //       this.subOrganizationService.GetSubOrganizationByOrgId(this.currentUser.organizationId).subscribe(suborgs => {
  //   //         this.lstSubOrganizations = suborgs;

  //   //         if (this.currentUser.subOrganizationId > 0) {
  //   //           this.searchObj.subOrganizationId = this.currentUser.subOrganizationId;
  //   //           this.isSubOrg = true;
  //   //           this.hospitalService.GetHospitalsBySubOrganizationId(this.currentUser.organizationId).subscribe(hosts => {
  //   //             this.lstHospitals = hosts;
  //   //             this.searchObj.hospitalId = this.currentUser.hospitalId;
  //   //             this.isHospital = true;
  //   //           });
  //   //         }
  //   //       });
  //   //     }
  //   //   });
  //   //   this.governorateService.GetGovernorates().subscribe(items => {
  //   //     this.lstGovernorates = items;
  //   //   });
  //   //   this.hospitalService.GetHospitalById(this.currentUser.hospitalId).subscribe(hospitalObj => {
  //   //     this.searchObj.governorateId = hospitalObj.governorateId;
  //   //     this.isGov = true;
  //   //     this.cityService.GetCitiesByGovernorateId(this.searchObj.governorateId).subscribe((cities) => {
  //   //       this.lstCities = cities;
  //   //     });
  //   //     this.searchObj.cityId = hospitalObj.cityId;
  //   //     this.isCity = true;
  //   //   });
  //   // }
  //   if (this.currentUser.hospitalId > 0 && this.currentUser.governorateId > 0 && this.currentUser.cityId > 0) {
  //     this.governorateService.GetGovernorates().subscribe(items => {
  //       this.lstGovernorates = items;
  //       if (this.currentUser.governorateId > 0) {
  //         this.searchObj.governorateId = this.currentUser.governorateId;
  //         this.isGov = true;
  //         this.cityService.GetCitiesByGovernorateId(this.currentUser.governorateId).subscribe(cities => {
  //           this.lstCities = cities;

  //           if (this.currentUser.cityId > 0) {
  //             this.searchObj.cityId = this.currentUser.cityId;
  //             this.isCity = true;
  //             this.hospitalService.GetHospitalsByCityId(this.currentUser.cityId).subscribe(hosts => {
  //               this.ddlHospitals = hosts;
  //               this.searchObj.hospitalId = this.currentUser.hospitalId;
  //               this.isHospital = true;
  //             });
  //           }
  //         });
  //       }
  //     });
  //     this.organizationService.GetOrganizations().subscribe(items => {
  //       this.lstOrganizations = items;
  //     });
  //     this.hospitalService.GetHospitalById(this.currentUser.hospitalId).subscribe(hospitalObj => {
  //       this.searchObj.organizationId = hospitalObj.organizationId;
  //       this.isOrg = true;
  //       this.subOrganizationService.GetSubOrganizationByOrgId(this.searchObj.organizationId).subscribe((subs) => {
  //         this.lstSubOrganizations = subs;
  //       });
  //       this.searchObj.subOrganizationId = hospitalObj.subOrganizationId;
  //       this.isSubOrg = true;
  //     });
  //   }
  //   else if (this.currentUser.governorateId > 0 && this.currentUser.cityId == 0 && this.currentUser.hospitalId == 0) {
  //     this.governorateService.GetGovernorates().subscribe(items => {
  //       this.lstGovernorates = items;
  //       if (this.currentUser.governorateId > 0) {
  //         this.searchObj.governorateId = this.currentUser.governorateId;
  //         this.isGov = true;
  //         this.cityService.GetCitiesByGovernorateId(this.currentUser.governorateId).subscribe(cities => {
  //           this.lstCities = cities;
  //         });
  //       }
  //     });
  //     this.organizationService.GetOrganizations().subscribe(items => {
  //       this.lstOrganizations = items;
  //     });
  //   }
  //   else if (this.currentUser.governorateId > 0 && this.currentUser.cityId > 0 && this.currentUser.hospitalId == 0) {
  //     this.governorateService.GetGovernorates().subscribe(items => {
  //       this.lstGovernorates = items;
  //       if (this.currentUser.governorateId > 0) {
  //         this.searchObj.governorateId = this.currentUser.governorateId;
  //         this.isGov = true;
  //         this.cityService.GetCitiesByGovernorateId(this.currentUser.governorateId).subscribe(cities => {
  //           this.lstCities = cities;
  //           this.searchObj.cityId = this.currentUser.cityId;
  //           this.isCity = true;
  //         });
  //       }
  //     });
  //     this.organizationService.GetOrganizations().subscribe(items => {
  //       this.lstOrganizations = items;
  //     });
  //   }
  //   else if (this.currentUser.hospitalId == 0 && this.currentUser.organizationId > 0 && this.currentUser.subOrganizationId == 0) {
  //     this.organizationService.GetOrganizations().subscribe(items => {
  //       this.lstOrganizations = items;
  //       if (this.currentUser.organizationId > 0) {
  //         this.searchObj.organizationId = this.currentUser.organizationId;
  //         this.isOrg = true;
  //         this.subOrganizationService.GetSubOrganizationByOrgId(this.currentUser.organizationId).subscribe(suborgs => {
  //           this.lstSubOrganizations = suborgs;

  //           if (this.currentUser.subOrganizationId > 0) {
  //             this.searchObj.subOrganizationId = this.currentUser.subOrganizationId;
  //           }
  //         });
  //       }
  //     });
  //     this.governorateService.GetGovernorates().subscribe(items => {
  //       this.lstGovernorates = items;
  //     });
  //   }
  //   else if (this.currentUser.hospitalId == 0 && this.currentUser.organizationId > 0 && this.currentUser.subOrganizationId > 0) {

  //     this.organizationService.GetOrganizations().subscribe(items => {
  //       this.lstOrganizations = items;
  //       if (this.currentUser.organizationId > 0) {
  //         this.searchObj.organizationId = this.currentUser.organizationId;
  //         this.isOrg = true;
  //         this.subOrganizationService.GetSubOrganizationByOrgId(this.currentUser.organizationId).subscribe(suborgs => {
  //           this.lstSubOrganizations = suborgs;

  //           if (this.currentUser.subOrganizationId > 0) {
  //             this.searchObj.subOrganizationId = this.currentUser.subOrganizationId;
  //             this.isSubOrg = true;

  //             this.hospitalService.GetHospitalsBySubOrganizationId(this.currentUser.subOrganizationId).subscribe(hosts => {
  //               this.ddlHospitals = hosts;
  //               this.searchObj.hospitalId = this.currentUser.hospitalId;
  //             });
  //           }
  //         });
  //       }
  //     });

  //     this.governorateService.GetGovernorates().subscribe(items => {
  //       this.lstGovernorates = items;
  //     });

  //   }
  //   else if (this.currentUser.hospitalId == 0 && this.currentUser.organizationId == 0 && this.currentUser.subOrganizationId == 0 && this.currentUser.governorateId == 0 && this.currentUser.cityId == 0) {
  //     this.organizationService.GetOrganizations().subscribe(items => {
  //       this.lstOrganizations = items;
  //     });
  //     this.governorateService.GetGovernorates().subscribe(items => {
  //       this.lstGovernorates = items;
  //     });

  //   }
  // }


  getHospitalsByCityId($event) {
    this.hospitalService.GetHospitalsByCityId($event.target.value).subscribe(hosts => {
      this.ddlHospitals = hosts;
    });
  }
  deleteStock(id: number) {
    this.confirmationService.confirm({
      message:
        ' هل أنت متأكد من مسح هذا العنصر علما بانه سوف يتم حذف جميع الملفات ورجوع الجهاز الى حالته' + ' ؟',
      header: 'تأكيد المسح',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.stockTakingScheduleService.delete(id).subscribe(deletedId => {
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
  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;

    if (this.searchObj.cityId != 0 && this.searchObj.governorateId != 0 && this.searchObj.organizationId != 0
      && this.searchObj.subOrganizationId != 0 && this.searchObj.start != '' && this.searchObj.end != '') {
      this.stockTakingScheduleService.SearchStockTackingSchedule(this.searchObj, this.page.pagenumber, this.page.pagesize).subscribe(searchResult => {
        this.listStockTakingScheduleVM = searchResult.results;
        this.count = searchResult.count;
        this.loading = false;
      });
    }
    else {
      this.stockTakingScheduleService.GetAllWithPaging(this.page.pagenumber, this.page.pagesize).subscribe(data => {
        this.listStockTakingScheduleVM = data.results;
        this.count = data.count;
        this.loading = false;
      });
    }
  }
  viewHospitals(id: number) {
    this.stockTakingHospitalService.getHospitalsByScheduleId(id).subscribe(res => {
      this.lstHospitals = res;
      this.relatedHospitalsDisplay = true;
    });
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
    this.listStockTakingScheduleVM = [];
    if (this.searchObj.cityId == 0 && this.searchObj.governorateId == 0 && this.searchObj.organizationId == 0
      && this.searchObj.subOrganizationId == 0 && this.searchObj.start == '' && this.searchObj.end == '') {
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
      this.listStockTakingScheduleVM = [];
      this.errorDisplay = false;

      this.listStockTakingScheduleVM = [];

      this.stockTakingScheduleService.SearchStockTackingSchedule(this.searchObj, this.page.pagenumber, this.page.pagesize).subscribe(searchResult => {
        this.listStockTakingScheduleVM = searchResult.results;
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
  toggle() {
    this.show = !this.show;
    if (this.show)
      this.buttonName = "Hide";
    else
      this.buttonName = "Show";
  }


  sort(field) {
    // if (this.sortStatus === "descending") {
    //   this.sortStatus = "ascending";
    //   this.sortObj.sortStatus = this.sortStatus;
    // }
    // else {
    //   this.sortStatus = "descending"
    //   this.sortObj.sortStatus = this.sortStatus;
    // }


    // if ( field.currentTarget.id == "stCode") {
    //   this.sortObj.stCode =  field.currentTarget.id
    // }
    // else if ( field.currentTarget.id == "كود الجرد") {
    //   this.sortObj.stCode =  field.currentTarget.id
    // }

    // this.listStockTakingScheduleVM = [];


    // this.stockTakingScheduleService.SortStockTakingSchedule(this.sortObj, this.page.pagenumber, this.page.pagesize).subscribe(searchResult => {
    //   this.listStockTakingScheduleVM = searchResult.results;
    //   this.count = searchResult.count;
    //   this.loading = false;
    // });
  }
  // getBarCode(event) {
  //   this.searchObj.barcode = event["barCode"];
  // }
  // onSelectionChanged(event) {
  //   if (this.currentUser.hospitalId != 0) {
  //     this.assetDetailService.AutoCompleteAssetBarCode(event.query, this.currentUser.hospitalId).subscribe(assets => {
  //       this.lstassetDetailBarcodes = assets;
  //       if (this.lang == "en") {
  //         this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
  //       }
  //       else {
  //         this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
  //       }
  //     });
  //   }
  //   else if (this.searchObj.hospitalId > 0) {
  //     this.assetDetailService.AutoCompleteAssetBarCode(event.query, this.searchObj.hospitalId).subscribe(assets => {
  //       this.lstassetDetailBarcodes = assets;
  //       if (this.lang == "en") {
  //         this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
  //       }
  //       else {
  //         this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
  //       }
  //     });
  //   }
  //   else {

  //     this.assetDetailService.AutoCompleteAssetBarCode(event.query, this.searchObj.hospitalId).subscribe(assets => {
  //       this.lstassetDetailBarcodes = assets;
  //       if (this.lang == "en") {
  //         this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
  //       }
  //       else {
  //         this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
  //       }
  //     });
  //   }
  // }
  // getSerialNumber(event) {
  //   this.searchObj.serialNumber = event["serialNumber"];
  // }
  // onSerialNumberSelectionChanged(event) {
  //   if (this.currentUser.hospitalId != 0) {
  //     this.assetDetailService.AutoCompleteAssetSerial(event.query, this.searchObj.hospitalId).subscribe(assets => {
  //       this.lstAssetSerailNumberObj = assets;
  //       if (this.lang == "en") {
  //         this.lstAssetSerailNumberObj.forEach(item => item.name = item.serialNumber);
  //       }
  //       else {
  //         this.lstAssetSerailNumberObj.forEach(item => item.name = item.serialNumber);
  //       }
  //     });
  //   }
  //   else {
  //     this.assetDetailService.AutoCompleteAssetSerial(event.query, this.searchObj.hospitalId).subscribe(assets => {
  //       this.lstAssetSerailNumberObj = assets;
  //       if (this.lang == "en") {
  //         this.lstAssetSerailNumberObj.forEach(item => item.name = item.serialNumber);
  //       }
  //       else {
  //         this.lstAssetSerailNumberObj.forEach(item => item.name = item.serialNumber);
  //       }
  //     });
  //   }
  // }
  // clearAssetSerailNumber() {
  //   this.searchObj.serialNumber = "";
  // }
  // clearAssetBarCode() {
  //   this.searchObj.barcode = "";
  // }
  // onMasterSelectionChanged(event) {
  //   this.masterAssetService.AutoCompleteMasterAssetName2(event.query).subscribe(masters => {
  //     this.lstMasterAssets = masters;
  //     if (this.lang == "en") {

  //       this.lstMasterAssets.forEach(item => item.name = item.name + " - " + item.brandName + " - " + item.model);
  //     }
  //     else {
  //       this.lstMasterAssets.forEach(item => item.name = item.nameAr + " - " + item.brandNameAr + " - " + item.model);
  //     }
  //   });
  // }
  // getMasterObject(event) {
  //   this.searchObj.masterAssetId = event["id"];
  // }
}