import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Paging } from 'src/app/Shared/Models/paging';
import { ListRequestVM, SearchRequestDateVM, SearchRequestVM } from 'src/app/Shared/Models/requestModeVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { RequestService } from 'src/app/Shared/Services/request.service';
import "jspdf-autotable";
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { environment } from 'src/environments/environment';
import { RequestStatusService } from 'src/app/Shared/Services/request-status.service';
import { IndexRequestStatus } from 'src/app/Shared/Models/RequestStatusVM';
import { ActivatedRoute, Router } from '@angular/router';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { CityService } from 'src/app/Shared/Services/city.service';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';
import { DetailsComponent } from '../../hospital-assets/details/details.component';
import { DialogService } from 'primeng/dynamicdialog';


@Component({
  selector: 'app-srwithindate',
  templateUrl: './srwithindate.component.html',
  styleUrls: ['./srwithindate.component.css']
})
export class SrwithindateComponent implements OnInit {

  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  lstRoleNames: string[] = [];
  isHospital: boolean = false;
  loading: boolean = true;
  page: Paging;
  count: number;
  elementType = "img";
  requestDateObj: SearchRequestDateVM;
  lstRequests: ListRequestVM[] = [];
  allRequests: ListRequestVM[] = [];
  lstGovernorates: ListGovernorateVM[] = [];
  lstCities: ListCityVM[] = [];
  lstOrganizations: ListOrganizationVM[] = [];
  lstSubOrganizations: ListSubOrganizationVM[] = [];
  lstHospitals: ListHospitalVM[] = [];
  lstMainStatuses: IndexRequestStatus;
  isAdmin: boolean = false;
  startDateTime: Date;
  startStamp: number;
  newDate: Date = new Date();
  newStamp = this.newDate.getTime();
  timer;
  cols: any[];
  _selectedColumns: any[];
  exportColumns;

  errorMessage: string = "";
  dateError: boolean = false;
  searchObj: SearchRequestVM;
  statusId: number;
  statusName: string = "";
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.cols.filter(col => val.includes(col));
  }
  constructor(private authenticationService: AuthenticationService, private requestStatusService: RequestStatusService,
    private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute, private dialogService: DialogService,
    private requestService: RequestService, private datePipe: DatePipe, private uploadService: UploadFilesService, private hospitalService: HospitalService,
    private governorateService: GovernorateService, private cityService: CityService, private organizationService: OrganizationService, private subOrganizationService: SubOrganizationService,
    private route: Router) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });
      this.isAdmin = (['Admin'].some(r => this.lstRoleNames.includes(r)));
    }
    this.requestDateObj = { hospitalId: 0, statusId: 0, userId: '', startDate: new Date, endDate: new Date, strStartDate: '', strEndDate: '', lang: '', hospitalName: '', hospitalNameAr: '', printedBy: '', statusName: '', statusNameAr: '' }
    this.page = { pagenumber: 1, pagesize: 10 }

    const translationKeys = ['Asset.Reports', 'Asset.Assets', 'Asset.SRReport'];
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);

    this.cols = [
      {
        content: '',
        styles: { fontStyle: 'Amiri-Regular' },
      },
      {
        content: 'طريقة الإبلاغ',
        styles: { fontStyle: 'Amiri-Regular' },
      },
      {
        content: 'الأولوية',
        styles: { fontStyle: 'Amiri-Regular' },
      },
      {
        content: 'الحالة',
        styles: { fontStyle: 'Amiri-Regular' },
      },
      {
        content: 'التاريخ',
        styles: { fontStyle: 'Amiri-Regular' },
      },
      {
        content: 'الموضوع',
        styles: { fontStyle: 'Amiri-Regular' },
      },
      {
        content: "اسم الأصل",
        styles: { fontStyle: 'Amiri-Regular' },
      },
      {
        content: "الكود",
        styles: { fontStyle: 'Amiri-Regular' },
      }
    ];
    this.exportColumns = this.cols.map(col => ({ title: col.header, dataKey: col.field }));
    this.searchObj = { assetDetailId: 0, userName: '', lang: '', hospitalName: '', hospitalNameAr: '', printedBy: '', strEndDate: '', strStartDate: '', masterAssetId: 0, woLastTrackDescription: '', modelNumber: '', serialNumber: '', code: '', periorityId: 0, statusId: 0, modeId: 0, userId: '', cityId: 0, governorateId: 0, hospitalId: 0, barcode: '', organizationId: 0, subOrganizationId: 0, subject: '', start: '', end: '', assetOwnerId: 0, departmentId: 0 };

    this.lstMainStatuses = { countAll: 0, color: '', countApproved: 0, countClose: 0, countInProgress: 0, countOpen: 0, countSolved: 0, icon: '', id: 0, listStatus: [], name: '', nameAr: '' }

    this.requestDateObj.startDate = null;
    this.requestDateObj.endDate = null;

    this.requestStatusService.GetAllRequestStatusWithoutUser().subscribe(statusObj => {
      this.lstMainStatuses = statusObj;
    });


    this.governorateService.GetGovernorates().subscribe(items => {
      this.lstGovernorates = items;
    });

    this.organizationService.GetOrganizations().subscribe(items => {
      this.lstOrganizations = items;
    });

    this.onLoadByLogIn();
  }
  onSubmit() {
    this.lstRequests = [];
    this.requestDateObj.statusId = this.statusId;
    this.requestDateObj.userId = this.currentUser.id;
    if (this.searchObj.hospitalId != 0) {
      this.requestDateObj.hospitalId = this.searchObj.hospitalId;
    }
    else {
      this.requestDateObj.hospitalId = this.currentUser.hospitalId;
    }

    this.requestStatusService.GetAllForReportByDate(this.requestDateObj).subscribe(statusObj => {
      this.lstMainStatuses = statusObj;
    });
    this.requestService.GetRequestsByDateAndStatus(this.requestDateObj, this.page.pagenumber, this.page.pagesize).subscribe(assets => {
      assets.results.forEach(element => {


        if (element.statusId == 2) {
          this.startDateTime = new Date(element.requestDate);
          this.startStamp = new Date(element.requestDate).getTime();


          this.newDate = new Date(element.descriptionDate);
          this.newStamp = this.newDate.getTime();

          var diff = Math.round((this.newStamp - this.startStamp) / 1000);
          var d = Math.floor(diff / (24 * 60 * 60)); /* though I hope she won't be working for consecutive days :) */
          diff = diff - (d * 24 * 60 * 60);
          var h = Math.floor(diff / (60 * 60));
          diff = diff - (h * 60 * 60);
          var m = Math.floor(diff / (60));
          diff = diff - (m * 60);
          var s = diff;
          if (this.lang == "en")
            element.elapsedTime = d + " day(s), " + h + ":" + m + ":" + s + "";
          else
            element.elapsedTime = (d).toLocaleString("ar-SA") + " يوم و  " + (s).toLocaleString("ar-SA") + ":" + (m).toLocaleString("ar-SA") + ":" + (h).toLocaleString("ar-SA") + "";
          this.lstRequests.push(element);
          this.loading = false;
        }
        else {

          this.startDateTime = new Date(element.requestDate);
          this.startStamp = new Date(element.requestDate).getTime();
          this.newDate = new Date();
          this.newStamp = this.newDate.getTime();
          var diff = Math.round((this.newStamp - this.startStamp) / 1000);
          var d = Math.floor(diff / (24 * 60 * 60)); /* though I hope she won't be working for consecutive days :) */
          diff = diff - (d * 24 * 60 * 60);
          var h = Math.floor(diff / (60 * 60));
          diff = diff - (h * 60 * 60);
          var m = Math.floor(diff / (60));
          diff = diff - (m * 60);
          var s = diff;
          if (this.lang == "en")
            element.elapsedTime = d + " day(s), " + h + ":" + m + ":" + s + "";
          else
            element.elapsedTime = (d).toLocaleString("ar-SA") + " يوم و  " + (s).toLocaleString("ar-SA") + ":" + (m).toLocaleString("ar-SA") + ":" + (h).toLocaleString("ar-SA") + "";
          this.lstRequests.push(element);
          this.loading = false;
        }
      });

      this.count = assets.count;
      this.lstMainStatuses.countClose = assets.countClosed;
      this.loading = false;
    });

  }

  clicktbl(event) {
    this.loading = true;
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;

    this.requestDateObj.statusId = this.statusId;
    this.requestDateObj.userId = this.currentUser.id;

    if (this.currentUser.hospitalId > 0)
      this.requestDateObj.hospitalId = this.currentUser.hospitalId;
    else {
      this.requestDateObj.hospitalId = this.requestDateObj.hospitalId;
    }


    this.requestStatusService.GetAllForReportByDate(this.requestDateObj).subscribe(statusObj => {
      this.lstMainStatuses = statusObj;
    });
    this.requestService.GetRequestsByDateAndStatus(this.requestDateObj, this.page.pagenumber, this.page.pagesize).subscribe(assets => {
      this.lstRequests = [];
      assets.results.forEach(element => {

        if (element.statusId == 2) {
          this.startDateTime = new Date(element.requestDate);
          this.startStamp = new Date(element.requestDate).getTime();
          this.newDate = new Date(element.descriptionDate);
          this.newStamp = this.newDate.getTime();

          var diff = Math.round((this.newStamp - this.startStamp) / 1000);
          var d = Math.floor(diff / (24 * 60 * 60)); /* though I hope she won't be working for consecutive days :) */
          diff = diff - (d * 24 * 60 * 60);
          var h = Math.floor(diff / (60 * 60));
          diff = diff - (h * 60 * 60);
          var m = Math.floor(diff / (60));
          diff = diff - (m * 60);
          var s = diff;
          if (this.lang == "en")
            element.elapsedTime = d + " day(s), " + h + ":" + m + ":" + s + "";
          else
            element.elapsedTime = (d).toLocaleString("ar-SA") + " يوم و  " + (s).toLocaleString("ar-SA") + ":" + (m).toLocaleString("ar-SA") + ":" + (h).toLocaleString("ar-SA") + "";
          this.lstRequests.push(element);
          this.loading = false;
        }
        else {

          this.startDateTime = new Date(element.requestDate);
          this.startStamp = new Date(element.requestDate).getTime();
          this.newDate = new Date();
          this.newStamp = this.newDate.getTime();
          var diff = Math.round((this.newStamp - this.startStamp) / 1000);
          var d = Math.floor(diff / (24 * 60 * 60)); /* though I hope she won't be working for consecutive days :) */
          diff = diff - (d * 24 * 60 * 60);
          var h = Math.floor(diff / (60 * 60));
          diff = diff - (h * 60 * 60);
          var m = Math.floor(diff / (60));
          diff = diff - (m * 60);
          var s = diff;
          if (this.lang == "en")
            element.elapsedTime = d + " day(s), " + h + ":" + m + ":" + s + "";
          else
            element.elapsedTime = (d).toLocaleString("ar-SA") + " يوم و  " + (s).toLocaleString("ar-SA") + ":" + (m).toLocaleString("ar-SA") + ":" + (h).toLocaleString("ar-SA") + "";
          this.lstRequests.push(element);
          this.loading = false;

        }

      });
      this.count = assets.count;
      this.loading = false;
    });

  }
  getStartDate($event) {
    this.requestDateObj.strStartDate = this.datePipe.transform($event, "MM-dd-yyyy");

  }
  getEndDate($event) {
    this.requestDateObj.strEndDate = this.datePipe.transform($event, "MM-dd-yyyy");
  }
  generatePDF() {
    if (this.requestDateObj.statusId != 0) {
      this.requestDateObj.statusName = this.statusName;
    }
    else if (this.requestDateObj.statusId == 0) {
      this.requestDateObj.statusName = this.lang == "en" ? "All Status" : "كل الحالات";
    }
    else if (this.requestDateObj.statusId == undefined) {
      this.requestDateObj.statusName = this.lang == "en" ? "All Status" : "كل الحالات";
    }
    this.requestDateObj.lang = this.lang;
    this.requestDateObj.printedBy = this.currentUser.userName;
    this.requestDateObj.hospitalNameAr = this.currentUser.hospitalNameAr;
    this.requestDateObj.hospitalName = this.currentUser.hospitalName;
    this.requestDateObj.statusId = this.statusId;
    this.requestDateObj.userId = this.currentUser.id;
    this.requestService.CreateSRReportWithinDateAndStatusPDF(this.requestDateObj).subscribe(list => {
      this.allRequests = list;
      let fileName = "SRDateAndStatusReport.pdf";
      var filePath = `${environment.Domain}UploadedAttachments/`;
      this.uploadService.downloadCreateSRReportWithinDatePDF(fileName).subscribe(file => {
        var dwnldFile = filePath + 'SRReports/' + fileName;
        if (fileName != "" || fileName != null)
          window.open(dwnldFile);
      });

    });
  }
  print() {
    window.print();
  }
  getRequestsByStatusId(id: number, $event) {
    this.statusId = id;
    var statusNameWithNoDigits = $event.target.innerText.replace(/[0-9]/g, '');
    this.statusName = statusNameWithNoDigits;



    this.requestDateObj.statusId = id;
    this.requestService.GetRequestsByDateAndStatus(this.requestDateObj, this.page.pagenumber, this.page.pagesize).subscribe(assets => {
      this.lstRequests = [];
      assets.results.forEach(element => {

        if (element.statusId == 2) {
          this.startDateTime = new Date(element.requestDate);
          this.startStamp = new Date(element.requestDate).getTime();
          this.newDate = new Date(element.descriptionDate);
          this.newStamp = this.newDate.getTime();

          var diff = Math.round((this.newStamp - this.startStamp) / 1000);
          var d = Math.floor(diff / (24 * 60 * 60)); /* though I hope she won't be working for consecutive days :) */
          diff = diff - (d * 24 * 60 * 60);
          var h = Math.floor(diff / (60 * 60));
          diff = diff - (h * 60 * 60);
          var m = Math.floor(diff / (60));
          diff = diff - (m * 60);
          var s = diff;
          if (this.lang == "en")
            element.elapsedTime = d + " day(s), " + h + ":" + m + ":" + s + "";
          else
            element.elapsedTime = (d).toLocaleString("ar-SA") + " يوم و  " + (s).toLocaleString("ar-SA") + ":" + (m).toLocaleString("ar-SA") + ":" + (h).toLocaleString("ar-SA") + "";
          this.lstRequests.push(element);
          this.loading = false;
        }
        else {

          this.startDateTime = new Date(element.requestDate);
          this.startStamp = new Date(element.requestDate).getTime();
          this.newDate = new Date();
          this.newStamp = this.newDate.getTime();
          var diff = Math.round((this.newStamp - this.startStamp) / 1000);
          var d = Math.floor(diff / (24 * 60 * 60)); /* though I hope she won't be working for consecutive days :) */
          diff = diff - (d * 24 * 60 * 60);
          var h = Math.floor(diff / (60 * 60));
          diff = diff - (h * 60 * 60);
          var m = Math.floor(diff / (60));
          diff = diff - (m * 60);
          var s = diff;
          if (this.lang == "en")
            element.elapsedTime = d + " day(s), " + h + ":" + m + ":" + s + "";
          else
            element.elapsedTime = (d).toLocaleString("ar-SA") + " يوم و  " + (s).toLocaleString("ar-SA") + ":" + (m).toLocaleString("ar-SA") + ":" + (h).toLocaleString("ar-SA") + "";
          this.lstRequests.push(element);
          this.loading = false;

        }

      });
      this.count = assets.count;
      this.loading = false;
    });
  }
  reset() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }
  onLoadByLogIn() {
    if (this.currentUser.hospitalId > 0 && this.currentUser.organizationId > 0 && this.currentUser.subOrganizationId > 0) {
      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
        if (this.currentUser.organizationId > 0) {
          this.searchObj.organizationId = this.currentUser.organizationId;
          this.subOrganizationService.GetSubOrganizationByOrgId(this.currentUser.organizationId).subscribe(suborgs => {
            this.lstSubOrganizations = suborgs;

            if (this.currentUser.subOrganizationId > 0) {
              this.searchObj.subOrganizationId = this.currentUser.subOrganizationId;
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
        this.cityService.GetCitiesByGovernorateId(this.searchObj.governorateId).subscribe((cities) => {
          this.lstCities = cities;
        });
        this.searchObj.cityId = hospitalObj.cityId;
      });
    }
    else if (this.currentUser.hospitalId > 0 && this.currentUser.governorateId > 0 && this.currentUser.cityId > 0) {
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
        if (this.currentUser.governorateId > 0) {
          this.searchObj.governorateId = this.currentUser.governorateId;

          this.cityService.GetCitiesByGovernorateId(this.currentUser.governorateId).subscribe(cities => {
            this.lstCities = cities;

            if (this.currentUser.cityId > 0) {
              this.searchObj.cityId = this.currentUser.cityId;
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
        this.subOrganizationService.GetSubOrganizationByOrgId(this.searchObj.organizationId).subscribe((subs) => {
          this.lstSubOrganizations = subs;
        });
        this.searchObj.subOrganizationId = hospitalObj.subOrganizationId;
      });
    }
    else if (this.currentUser.governorateId > 0 && this.currentUser.cityId == 0 && this.currentUser.hospitalId == 0) {
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
        if (this.currentUser.governorateId > 0) {
          this.searchObj.governorateId = this.currentUser.governorateId;
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
          this.cityService.GetCitiesByGovernorateId(this.currentUser.governorateId).subscribe(cities => {
            this.lstCities = cities;
            this.searchObj.cityId = this.currentUser.cityId;
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
          this.subOrganizationService.GetSubOrganizationByOrgId(this.currentUser.organizationId).subscribe(suborgs => {
            this.lstSubOrganizations = suborgs;

            if (this.currentUser.subOrganizationId > 0) {
              this.searchObj.subOrganizationId = this.currentUser.subOrganizationId;
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
  getCitiesByGovId(govId: number) {
    this.cityService.GetCitiesByGovernorateId(govId).subscribe(cities => {
      this.lstCities = cities;
    });
  }
  getHospitalsByCityId($event) {
    this.searchObj.hospitalId = 0;
    this.hospitalService.getHosByCityId($event.target.value).subscribe(suborgs => {
      this.lstHospitals = suborgs;
    });
  }
  getHospitalsBySubOrgId($event) {
  }
  getSubOrgByOrgId($event) {
    this.subOrganizationService.GetSubOrganizationByOrgId($event.target.value).subscribe(suborgs => {
      this.lstSubOrganizations = suborgs;
    });
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
        "font-family": "sans-serif"
      }
    });

    dialogRef2.onClose.subscribe((res) => {
      // this.reload();
    });

  }
}
