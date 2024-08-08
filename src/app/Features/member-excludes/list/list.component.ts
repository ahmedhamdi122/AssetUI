import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Paging } from 'src/app/Shared/Models/paging';
import { ListSupplierExecludeAssetVM, SortAndFilterSupplierExecludeAssetVM, SortSupplierExecludeAssetVM } from 'src/app/Shared/Models/supplierExecludeAssetVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { SupplierExecludeAssetService } from 'src/app/Shared/Services/supplierexecludeasset.service';
import { HospitalApplicationService } from 'src/app/Shared/Services/hospitalapplication.service';
import { ListHospitalApplicationVM, SortAndFilterHospitalApplicationVM, SortHospitalAppVM } from 'src/app/Shared/Models/hospitalApplicationVM';
import { DialogService } from 'primeng/dynamicdialog';
import { HospitalSuplierStatusService } from 'src/app/Shared/Services/hospitalsuplierstatus.service';
import { ListHospitalSuplierStatusVM2 } from 'src/app/Shared/Models/HospitalSuplierStatusVM';
import { ExecludedateComponent } from '../execludedate/execludedate.component';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { ApplicationTypeService } from 'src/app/Shared/Services/applicationtype.service';
import { ListApplicationTypeVM } from 'src/app/Shared/Models/applicationtype';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';
import { DetailsComponent } from '../../hospital-assets/details/details.component';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {


  lang = localStorage.getItem("lang");
  lstRoleNames: string[] = [];
  isSupplierHospital: boolean = false;
  isMember: boolean = false;
  textDir: string = 'ltr';
  currentUser: LoggedUser;
  lstSupplierExecludeAssets: ListSupplierExecludeAssetVM[] = [];
  lstHospitalApplications: ListHospitalApplicationVM[] = [];

  lstHospitals: ListHospitalVM[] = [];
  page: Paging;
  supplierCount: number;
  hospitalCount: number;
  isSupplier: boolean = false;
  isHospital: boolean = false;
  lstRadioItems: string[];
  lstArabicRadioItems: string[];
  selectedItem: string;
  diffMonths: any;
  isMoreThan3Months: boolean = false;
  sortStatus: string = "descending";
  sortObj: SortHospitalAppVM;
  sortSupplierObj: SortSupplierExecludeAssetVM;
  statusObj: ListHospitalSuplierStatusVM2;
  lstTypes: ListApplicationTypeVM[] = [];
  selectedAppType: number = 0;

  public openStatus: number;
  approveStatus: number;
  rejectStatus: number;
  systemRejectStatus: number;
  statusId: number = 0;
  hospitalId: number = 0;
  selectedHospitalId: number = 0;
  sortFilterObjects: SortAndFilterSupplierExecludeAssetVM;

  sortFilterHospitalObjects: SortAndFilterHospitalApplicationVM;

  constructor(private authenticationService: AuthenticationService, private applicationTypeService: ApplicationTypeService, private hospitalSuplierStatusService: HospitalSuplierStatusService, private supplierExecludeAssetService: SupplierExecludeAssetService,
    private hospitalApplicationService: HospitalApplicationService, private route: Router, public dialogService: DialogService,
    private hospitalService: HospitalService, private activateRoute: ActivatedRoute, private breadcrumbService: BreadcrumbService) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {


    this.sortFilterObjects = {
      searchObj: { appTypeId: 0, hospitalName: '', hospitalNameAr: '', printedBy: '', strEndDate: '', strStartDate: '', assetName: '', brandId: 0, originId: 0, serial: '', supplierId: 0, lang: '', masterAssetId: 0, modelNumber: '', serialNumber: '', code: '', periorityId: 0, statusId: 0, userId: '', cityId: 0, governorateId: 0, hospitalId: 0, barCode: '', subject: '', start: '', end: '', departmentId: 0 },
      sortObj: {
        sortBy: '', barCode: '', modelNumber: '', serialNumber: '', statusId: 0, appNumber: '', statusName: '', statusNameAr: '', assetNameAr: '', assetName: '', date: '', execludeDate: '', ReasonHoldTitles: '', ReasonHoldTitlesAr: '', sortStatus: '', reasonExTitles: '', reasonExTitlesAr: ''
      }
    }

    this.sortFilterHospitalObjects = {
      searchObj: {
        endDate: new Date, lang: '', startDate: new Date, strEndDate: '', strStartDate: '', userId: '', statusId: 0,
        appTypeId: 0, hospitalName: '', hospitalNameAr: '', printedBy: '', assetName: '', brandId: 0, originId: 0, serial: '', supplierId: 0, masterAssetId: 0, modelNumber: '', serialNumber: '', code: '', periorityId: 0, cityId: 0, governorateId: 0, hospitalId: 0, barCode: '', subject: '', start: '', end: '', departmentId: 0
      },
      sortObj: {
        sortBy: '', barCode: '', modelNumber: '', serialNumber: '', appNumber: '', statusName: '', statusNameAr: '', assetNameAr: '', assetName: '', date: '', dueDate: '',
        ReasonHoldTitles: '', ReasonHoldTitlesAr: '', sortStatus: '', reasonExTitles: '', reasonExTitlesAr: '', appDate: '', typeName: '', typeNameAr: ''
      }
    }


    this.statusObj = { approveStatus: 0, openStatus: 0, rejectStatus: 0, systemRejectStatus: 0, listStatus: [] }
    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });

      this.isMember = (['Admin', 'Member'].some(r => this.lstRoleNames.includes(r)));
    }
    this.page = {
      pagenumber: 1,
      pagesize: 10,
    }
    this.lstRadioItems = ["Supplier", "Hospital"];
    if (this.lang == "ar")
      this.lstArabicRadioItems = ["المورد", "المستشفى"];

    this.selectedItem = "Supplier";
    this.isSupplier = true;


    if (this.lang == "ar")
      this.selectedItem = "المورد";

    this.applicationTypeService.GetApplicationTypes().subscribe(types => {
      this.lstTypes = types;
    });
    this.selectedAppType = 1;



    this.hospitalService.GetHospitals().subscribe(items => {
      this.lstHospitals = items;
    });

    this.isSupplier = true;
    this.isHospital = false;

    if (this.currentUser.commetieeMemberId > 0) {
      if (this.isSupplier) {
        this.hospitalSuplierStatusService.ListAllStatus(this.selectedAppType, this.currentUser.hospitalId).subscribe(statuses => {
          this.statusObj = statuses;
        });
      }
    }


    if (this.activateRoute.queryParamMap != null || this.activateRoute.queryParamMap != undefined) {
      this.activateRoute.queryParamMap.subscribe(params => {

        if (params != null) {
          const appTypeName = params.get("appTypeName");
          const supplier = params.get("supplier");
          const hospitalId = params.get("hospitalId");
          const hospital = params.get("hospital");



          if (supplier == "supplier") {
            this.selectedItem = "Supplier";
            if (this.lang == "ar")
              this.selectedItem = "المورد";

            if ((appTypeName == "استبعاد" || appTypeName == "Execlude") && hospitalId == "0") {
              this.selectedAppType = 1;
              this.isSupplier = true;
              this.isHospital = false;

            }
            if ((appTypeName == "إيقاف مؤقت" || appTypeName == "Hold") && hospitalId == "0") {
              this.selectedAppType = 2;
              this.isSupplier = true;
              this.isHospital = false;
            }


            this.hospitalSuplierStatusService.ListAllStatus(this.selectedAppType, this.currentUser.hospitalId).subscribe(statuses => {
              this.statusObj = statuses;
            });


            this.sortFilterObjects.searchObj.userId = this.currentUser.id;
            this.sortFilterObjects.searchObj.appTypeId = this.selectedAppType;
            this.sortFilterObjects.searchObj.hospitalId = this.selectedHospitalId;


            this.supplierExecludeAssetService.ListSupplierExcludeAssets(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe((data) => {
              this.supplierCount = data.count;
              this.lstSupplierExecludeAssets = data.results;
            });
          }




          if (hospital == "hospital") {

            this.selectedItem = "Hospital";
            if (this.lang == "ar")
              this.selectedItem = "المستشفى";

            if ((appTypeName == "استبعاد" || appTypeName == "Execlude") && hospitalId != "0") {
              this.selectedAppType = 1;
              this.isSupplier = false;
              this.isHospital = true;

            }
            if ((appTypeName == "إيقاف مؤقت" || appTypeName == "Hold") && hospitalId != "0") {
              this.selectedAppType = 2;
              this.isSupplier = false;
              this.isHospital = true;
            }


            this.lstHospitalApplications = [];
            this.hospitalSuplierStatusService.ListHospitalByStatusAppTypeId(this.statusId, this.selectedAppType, this.hospitalId).subscribe(statuses => {
              this.statusObj = statuses;
            });

            this.sortFilterObjects.searchObj.appTypeId = this.selectedAppType;
            this.sortFilterObjects.searchObj.hospitalId = this.selectedHospitalId;
            this.sortFilterObjects.searchObj.userId = this.currentUser.id;
            this.hospitalApplicationService.ListHospitalApplications(this.sortFilterHospitalObjects, this.page.pagenumber, this.page.pagesize).subscribe(lstHospitalApp => {
              this.lstHospitalApplications = lstHospitalApp.results;
              this.hospitalCount = lstHospitalApp.count;
            });
          }
        }
      });
    }

    const translationKeys = ['Asset.AssetTransfer', 'Asset.Execludes', 'Asset.MemberAction'];
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);

  }
  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;

    this.lstSupplierExecludeAssets = [];
    if (this.isSupplier) {
      if (this.selectedItem == "Supplier" || this.selectedItem == "المورد") {

        this.hospitalSuplierStatusService.ListAllStatus(this.selectedAppType, this.currentUser.hospitalId).subscribe(statuses => {
          this.statusObj = statuses;
        });
        this.sortFilterObjects.searchObj.userId = this.currentUser.id;
        this.sortFilterObjects.searchObj.appTypeId = this.selectedAppType;
        this.sortFilterObjects.searchObj.hospitalId = this.selectedHospitalId;

        this.supplierExecludeAssetService.ListSupplierExcludeAssets(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe((data) => {
          this.supplierCount = data.count;
          this.lstSupplierExecludeAssets = data.results;
        });

      }
    }
    else if (this.isHospital) {
      if (this.selectedItem == "Hospital" || this.selectedItem == "المستشفى") {
        this.lstHospitalApplications = [];
        this.hospitalSuplierStatusService.ListHospitalByStatusAppTypeId(this.statusId, this.selectedAppType, this.hospitalId).subscribe(statuses => {
          this.statusObj = statuses;
        });
        this.sortFilterHospitalObjects.searchObj.hospitalId = this.selectedHospitalId;
        this.sortFilterHospitalObjects.searchObj.appTypeId = this.selectedAppType;
        this.sortFilterHospitalObjects.searchObj.userId = this.currentUser.id;
        this.hospitalApplicationService.ListHospitalApplications(this.sortFilterHospitalObjects, this.page.pagenumber, this.page.pagesize).subscribe(lstHospitalApp => {
          this.lstHospitalApplications = lstHospitalApp.results;
          this.hospitalCount = lstHospitalApp.count;
        });

      }
    }
  }
  clickHospital(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;

    if (this.selectedItem == "Supplier" || this.selectedItem == "المورد") {
      this.lstSupplierExecludeAssets = [];
      this.isHospital = false;
      this.isSupplier = true;
      this.hospitalSuplierStatusService.ListAllStatus(this.selectedAppType, this.currentUser.hospitalId).subscribe(statuses => {
        this.statusObj = statuses;
      });
      this.hospitalApplicationService.ListHospitalApplications(this.sortFilterHospitalObjects, this.page.pagenumber, this.page.pagesize).subscribe(lstHospitalApp => {
        this.lstHospitalApplications = lstHospitalApp.results;
        this.hospitalCount = lstHospitalApp.count;
      });

      this.sortFilterObjects.searchObj.userId = this.currentUser.id;
      this.sortFilterObjects.searchObj.appTypeId = this.selectedAppType;
      this.sortFilterObjects.searchObj.hospitalId = this.selectedHospitalId;

      this.supplierExecludeAssetService.ListSupplierExcludeAssets(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe((data) => {
        this.supplierCount = data.count;
        this.lstSupplierExecludeAssets = data.results;
      });

    }
    if (this.selectedItem == "Hospital" || this.selectedItem == "المستشفى") {
      this.lstHospitalApplications = [];
      this.isHospital = true;
      this.isSupplier = false;
      this.hospitalSuplierStatusService.ListHospitalByStatusAppTypeId(this.statusId, this.selectedAppType, this.hospitalId).subscribe(statuses => {
        this.statusObj = statuses;
      });
      this.sortFilterHospitalObjects.searchObj.appTypeId = this.selectedAppType;
      this.sortFilterObjects.searchObj.hospitalId = this.selectedHospitalId;
      this.sortFilterHospitalObjects.searchObj.hospitalId = this.selectedHospitalId;

      this.hospitalApplicationService.ListHospitalApplications(this.sortFilterHospitalObjects, this.page.pagenumber, this.page.pagesize).subscribe(lstHospitalApp => {
        this.lstHospitalApplications = lstHospitalApp.results;
        this.hospitalCount = lstHospitalApp.count;
      });
    }
  }
  onItemChange($event) {
    this.selectedItem = $event.value;
    this.sortFilterHospitalObjects.searchObj.appTypeId = this.selectedAppType;
    this.sortFilterObjects.searchObj.appTypeId = this.selectedAppType;
    this.sortFilterObjects.searchObj.hospitalId = this.selectedHospitalId;
    this.sortFilterHospitalObjects.searchObj.hospitalId = this.selectedHospitalId;
    this.sortFilterObjects.searchObj.userId = this.currentUser.id;
    this.sortFilterHospitalObjects.searchObj.userId = this.currentUser.id;


    if ($event.value == "Hospital" || $event.value == "المستشفى") {
      this.isHospital = true;
      this.isSupplier = false;
      this.hospitalSuplierStatusService.ListHospitalByStatusAppTypeId(this.statusId, this.selectedAppType, this.hospitalId).subscribe(statuses => {
        this.statusObj = statuses;
      });

      this.hospitalApplicationService.ListHospitalApplications(this.sortFilterHospitalObjects, this.page.pagenumber, this.page.pagesize).subscribe(lstHospitalApp => {
        this.lstHospitalApplications = lstHospitalApp.results;
        this.hospitalCount = lstHospitalApp.count;
      });
    }
    if ($event.value == "Supplier" || $event.value == "المورد") {
      this.lstSupplierExecludeAssets = [];
      this.isHospital = false;
      this.isSupplier = true;
      this.hospitalSuplierStatusService.ListAllStatus(this.selectedAppType, this.currentUser.hospitalId).subscribe(statuses => {
        this.statusObj = statuses;
      });

      this.sortFilterObjects.searchObj.statusId = Number(this.selectedItem);
      this.sortFilterObjects.searchObj.userId = this.currentUser.id;
      this.sortFilterObjects.searchObj.appTypeId = this.selectedAppType;
      this.sortFilterObjects.searchObj.hospitalId = this.selectedHospitalId;

      this.supplierExecludeAssetService.ListSupplierExcludeAssets(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe((data) => {
        this.supplierCount = data.count;
        this.lstSupplierExecludeAssets = data.results;
      });
    }

  }
  updateExecludeDate(id: number) {
    const ref = this.dialogService.open(ExecludedateComponent, {
      header: this.lang == "en" ? 'Update Execlude / Hold Date' : "تعديل تاريخ الاستبعاد  أو الايقاف",
      data: {
        id: id,
        selectedItem: this.selectedItem
      },
      width: '60%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });

    ref.onClose.subscribe(res => {
      this.reload();
    });
  }
  getAllByStatus(id: number) {
    this.statusId = id;

    this.supplierExecludeAssetService.ListSupplierExcludeAssets(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe((data) => {
      this.supplierCount = data.count;
      this.lstSupplierExecludeAssets = data.results;
    });

  }
  getAllHospitalByStatus(id: number) {
    this.statusId = id;
    this.lstHospitalApplications = [];
    this.sortFilterHospitalObjects.searchObj.appTypeId = this.selectedAppType;
    this.sortFilterHospitalObjects.searchObj.hospitalId = this.selectedHospitalId;
    this.sortFilterHospitalObjects.searchObj.userId = this.currentUser.id;
    this.hospitalApplicationService.ListHospitalApplications(this.sortFilterHospitalObjects, this.page.pagenumber, this.page.pagesize).subscribe(lstHospitalApp => {
      this.lstHospitalApplications = lstHospitalApp.results;
      this.hospitalCount = lstHospitalApp.count;
    });
  }
  onTypeChange($event) {
    this.selectedAppType = $event.value;
    this.lstSupplierExecludeAssets = [];
    if (this.selectedItem == "Supplier" || this.selectedItem == "المورد") {

      this.hospitalSuplierStatusService.ListAllStatus(this.selectedAppType, this.currentUser.hospitalId).subscribe(statuses => {
        this.statusObj = statuses;
      });
      this.sortFilterObjects.searchObj.userId = this.currentUser.id;
      this.sortFilterObjects.searchObj.appTypeId = this.selectedAppType;
      this.sortFilterObjects.searchObj.hospitalId = this.selectedHospitalId;

      this.supplierExecludeAssetService.ListSupplierExcludeAssets(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe((data) => {
        this.supplierCount = data.count;
        this.lstSupplierExecludeAssets = data.results;
      });
    }
    if (this.selectedItem == "Hospital" || this.selectedItem == "المستشفى") {
      this.lstHospitalApplications = [];
      this.hospitalSuplierStatusService.ListHospitalByStatusAppTypeId(this.statusId, this.selectedAppType, this.hospitalId).subscribe(statuses => {
        this.statusObj = statuses;
      });

      this.sortFilterHospitalObjects.searchObj.appTypeId = this.selectedAppType;
      this.sortFilterHospitalObjects.searchObj.hospitalId = this.selectedHospitalId;
      this.sortFilterHospitalObjects.searchObj.userId = this.currentUser.id;
      this.hospitalApplicationService.ListHospitalApplications(this.sortFilterHospitalObjects, this.page.pagenumber, this.page.pagesize).subscribe(lstHospitalApp => {
        this.lstHospitalApplications = lstHospitalApp.results;
        this.hospitalCount = lstHospitalApp.count;
      });
    }
  }
  getExcludedAssetsByHospitalId($event) {
    this.hospitalId = $event.target.value;
    this.selectedHospitalId = Number($event.target.value);

    this.hospitalSuplierStatusService.ListHospitalByStatusAppTypeId(this.statusId, this.selectedAppType, this.hospitalId).subscribe(statuses => {
      this.statusObj = statuses;
    });

    this.sortFilterObjects.searchObj.userId = this.currentUser.id;
    this.sortFilterObjects.searchObj.appTypeId = this.selectedAppType;
    this.sortFilterObjects.searchObj.hospitalId = this.selectedHospitalId;

    this.sortFilterHospitalObjects.searchObj.hospitalId = this.selectedHospitalId;
    this.sortFilterHospitalObjects.searchObj.userId = this.currentUser.id;
    this.sortFilterHospitalObjects.searchObj.appTypeId = this.selectedAppType;


    this.hospitalApplicationService.ListHospitalApplications(this.sortFilterHospitalObjects, this.page.pagenumber, this.page.pagesize).subscribe(lstHospitalApp => {
      this.lstHospitalApplications = lstHospitalApp.results;
      this.hospitalCount = lstHospitalApp.count;
    });

    this.supplierExecludeAssetService.ListSupplierExcludeAssets(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe((data) => {
      this.supplierCount = data.count;
      this.lstSupplierExecludeAssets = data.results;
    });
  }
  sortHospitalExcludes(field) {
    if (this.sortStatus === "descending") {
      this.sortStatus = "ascending";
      this.sortFilterHospitalObjects.sortObj.sortStatus = this.sortStatus;
    }
    else {
      this.sortStatus = "descending";
      this.sortFilterHospitalObjects.sortObj.sortStatus = this.sortStatus;
    }


    this.sortFilterHospitalObjects.sortObj.sortBy = field.currentTarget.id
    this.sortFilterHospitalObjects.searchObj.appTypeId = this.selectedAppType;
    this.sortFilterHospitalObjects.searchObj.hospitalId = this.selectedHospitalId;
    this.sortFilterHospitalObjects.searchObj.userId = this.currentUser.id;

    this.hospitalApplicationService.ListHospitalApplications(this.sortFilterHospitalObjects, this.page.pagenumber, this.page.pagesize).subscribe(lstHospitalApp => {
      this.lstHospitalApplications = lstHospitalApp.results;
      this.hospitalCount = lstHospitalApp.count;
    });
  }
  sort(field) {

    if (this.sortStatus === "descending") {
      this.sortStatus = "ascending";
      this.sortSupplierObj.sortStatus = this.sortStatus;
    }
    else {
      this.sortStatus = "descending"
      this.sortSupplierObj.sortStatus = this.sortStatus;
    }

    this.sortFilterObjects.sortObj.sortBy = field.currentTarget.id;

    this.sortFilterObjects.searchObj.appTypeId = this.selectedAppType;
    this.sortFilterObjects.searchObj.hospitalId = this.selectedHospitalId;
    this.sortFilterObjects.searchObj.userId = this.currentUser.id;
    this.supplierExecludeAssetService.ListSupplierExcludeAssets(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe((data) => {
      this.supplierCount = data.count;
      this.lstSupplierExecludeAssets = data.results;
    });

  }
  reload() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }

  viewAssetDetail(id: number) {
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
}
