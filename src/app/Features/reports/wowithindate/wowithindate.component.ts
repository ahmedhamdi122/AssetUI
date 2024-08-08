import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Paging } from 'src/app/Shared/Models/paging';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { WorkOrderService } from 'src/app/Shared/Services/work-order.service';
import { fontAmiri } from 'src/assets/fonts/Amiri-Regular';
import jspdf from 'jspdf';
import "jspdf-autotable";
import { ListWorkOrderVM, SearchWorkOrderDateVM, sortWorkOrdersVM } from 'src/app/Shared/Models/WorkOrderVM';
import { environment } from 'src/environments/environment';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { WorkOrderStatusService } from 'src/app/Shared/Services/work-order-status.service';
import { ListWorkOrderStatusVM } from 'src/app/Shared/Models/WorkOrderStatusVM';
import { ActivatedRoute, Router } from '@angular/router';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { CityService } from 'src/app/Shared/Services/city.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';

@Component({
  selector: 'app-wowithindate',
  templateUrl: './wowithindate.component.html',
  styleUrls: ['./wowithindate.component.css']
})
export class WowithindateComponent implements OnInit {


  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  lstRoleNames: string[] = [];
  isHospital: boolean = false;
  loading: boolean = true;
  page: Paging;
  count: number;
  elementType = "img";
  sortObj: sortWorkOrdersVM;
  sortStatus: string = "ascending";
  woDateObj: SearchWorkOrderDateVM;
  lstWorkOrders: ListWorkOrderVM[] = [];
  allWorkOrders: ListWorkOrderVM[] = [];
  woStatusObj: ListWorkOrderStatusVM;

  statusId: number;
  statusName: string = "";
  startDateTime: Date;
  startStamp: number;
  newDate: Date = new Date();
  newStamp = this.newDate.getTime();
  timer;

  cols: any[];
  _selectedColumns: any[];
  columnsSelected: string = "";
  closedDate: any;

  errorMessage: string = "";
  dateError: boolean = false;

  isAdmin: boolean = false;
  lstGovernorates: ListGovernorateVM[] = [];
  lstCities: ListCityVM[] = [];
  lstOrganizations: ListOrganizationVM[] = [];
  lstSubOrganizations: ListSubOrganizationVM[] = [];
  lstHospitals: ListHospitalVM[] = [];

  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.cols.filter(col => val.includes(col));
  }

  constructor(private authenticationService: AuthenticationService, private workOrderService: WorkOrderService, private workOrderStatusService: WorkOrderStatusService,
    private datePipe: DatePipe, private uploadService: UploadFilesService, private route: Router,
    private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute,
    private hospitalService: HospitalService, private governorateService: GovernorateService, private cityService: CityService, private organizationService: OrganizationService, private subOrganizationService: SubOrganizationService) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });

      this.isAdmin = (['Admin'].some(r => this.lstRoleNames.includes(r)));
    }
    this.page = { pagenumber: 1, pagesize: 10 }

    this.sortObj = {
      assetName: '', assetNameAr: '', modelNumber: '', serialNumber: '', elapsedTime: '', closedDate: '', strSerial: '', strSubject: '', strRequestSubject: '',
      barCode: '', createdBy: '', note: '', creationDate: '', requestSubject: '', subject: '', statusNameAr: '', statusName: '', workOrderNumber: '', sortStatus: ''
      , strWorkOrderNumber: '', periorityId: 0, statusId: 0, strBarCode: '', strModel: '', masterAssetId: 0
    }
    this.woDateObj = { governorateId: 0, cityId: 0, organizationId: 0, subOrganizationId: 0, hospitalId: 0, statusName: '', statusId: 0, userId: '', startDate: new Date, endDate: new Date, strStartDate: '', strEndDate: '', hospitalName: '', hospitalNameAr: '', lang: '', printedBy: '' }
    this.woStatusObj = { id: 0, code: '', color: '', icon: '', name: '', nameAr: '', countAssigned: 0, countClosed: 0, countDone: 0, countEscalate: 0, countExternalSupport: 0, countInProgress: 0, countPending: 0, countReAssigned: 0, countReview: 0, countSparePart: 0, countTechApprove: 0, countUserApprove: 0, countAll: 0, listStatus: [] }

    this.workOrderStatusService.GetAllWOForReportByDate(this.woDateObj).subscribe(statuses => {
      this.woStatusObj = statuses;
    });

    this.governorateService.GetGovernorates().subscribe(items => {
      this.lstGovernorates = items;
    });

    this.organizationService.GetOrganizations().subscribe(items => {
      this.lstOrganizations = items;
    });

    this.woDateObj.startDate = null;
    this.woDateObj.endDate = null;


    const translationKeys = ['Asset.Reports', 'Asset.Assets', 'Asset.WOReport'];
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);


    if (this.lang == "en") {
      this.columnsSelected = "Columns Selected";
      this.cols = [
        { field: 'workOrderNumber', header: 'Number' },
        { field: 'statusName', header: 'Status' },
        { field: 'subject', header: 'Subject' },
        { field: 'requestSubject', header: 'Ticket' },
        { field: 'createdBy', header: 'CreatedBy' },
        { field: 'creationDate', header: 'Date' },
        { field: 'actualEndDate', header: 'Close Date' },
        { field: 'note', header: 'Notes' }
      ];

    }
    else if (this.lang == "ar") {
      this.columnsSelected = "الأعمدة المختارة";
      this.cols = [
        { field: 'workOrderNumber', header: 'رقم الأمر' },
        { field: 'statusNameAr', header: 'الحالة' },
        { field: 'subject', header: 'الموضوع' },
        { field: 'requestSubject', header: 'بلاغ عن عطل' },
        { field: 'createdBy', header: 'انشأ من قبل' },
        { field: 'creationDate', header: 'التاريخ' },
        { field: 'actualEndDate', header: 'تاريخ الإغلاق' },
        { field: 'note', header: 'ملاحظات' }
      ];
    }
    this._selectedColumns = this.cols;
  }
  onSubmit() {
    this.lstWorkOrders = [];
    this.woDateObj.userId = this.currentUser.id;
    this.woDateObj.statusId = this.statusId;
    if (this.currentUser.hospitalId > 0)
      this.woDateObj.hospitalId = this.currentUser.hospitalId;
    else {
      this.woDateObj.hospitalId = this.woDateObj.hospitalId;
    }
    this.workOrderStatusService.GetAllWOForReportByDate(this.woDateObj).subscribe(statuses => {
      this.woStatusObj = statuses;
    });
    this.workOrderService.GetWorkOrdersByDateAndStatus(this.woDateObj, this.page.pagenumber, this.page.pagesize).subscribe(data => {
      data.results.forEach(element => {
        if (element.statusId == 12) {
          this.startDateTime = new Date(element.creationDate);
          this.startStamp = new Date(element.creationDate).getTime();
          this.newDate = new Date(element.closedDate);
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
          this.lstWorkOrders.push(element);
          this.loading = false;
        }
        else {

          this.startDateTime = new Date(element.creationDate);
          this.startStamp = new Date(element.creationDate).getTime();
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
          this.lstWorkOrders.push(element);
        }
      });

      this.count = data.count;
    });
  }

  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;
    this.lstWorkOrders = [];


    this.workOrderStatusService.GetAllWOForReportByDate(this.woDateObj).subscribe(statuses => {
      this.woStatusObj = statuses;
    });


    this.woDateObj.statusId = this.statusId;
    this.woDateObj.userId = this.currentUser.id;
    if (this.currentUser.hospitalId > 0)
      this.woDateObj.hospitalId = this.currentUser.hospitalId;
    else
      this.woDateObj.hospitalId = this.woDateObj.hospitalId;
    this.workOrderService.GetWorkOrdersByDateAndStatus(this.woDateObj, this.page.pagenumber, this.page.pagesize).subscribe(data => {


      data.results.forEach(element => {


        if (element.statusId == 12) {
          this.startDateTime = new Date(element.creationDate);
          this.startStamp = new Date(element.creationDate).getTime();


          this.newDate = new Date(element.closedDate);
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
          this.lstWorkOrders.push(element);
          this.loading = false;
        }
        else {
          this.startDateTime = new Date(element.creationDate);
          this.startStamp = new Date(element.creationDate).getTime();
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
          this.lstWorkOrders.push(element);
        }
      });

      this.count = data.count;
    });
  }

  getStartDate($event) {
    this.woDateObj.strStartDate = this.datePipe.transform($event, "MM-dd-yyyy");
  }
  getEndDate($event) {
    this.woDateObj.strEndDate = this.datePipe.transform($event, "MM-dd-yyyy");
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
    if (field.currentTarget.id == "Number" || field.currentTarget.id == "رقم الأمر") {
      this.sortObj.workOrderNumber = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "Status") {
      this.sortObj.statusName = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "الحالة") {
      this.sortObj.statusNameAr = field.currentTarget.id;
    }
    if (field.currentTarget.id == "Subject" || field.currentTarget.id == "الموضوع") {
      this.sortObj.subject = field.currentTarget.id;
    }
    if (field.currentTarget.id == "Ticket" || field.currentTarget.id == "بلاغ عن عطل") {
      this.sortObj.requestSubject = field.currentTarget.id;
    }
    if (field.currentTarget.id == "Created By" || field.currentTarget.id == "انشأ من قبل") {
      this.sortObj.createdBy = field.currentTarget.id;
    }
    if (field.currentTarget.id == "Date") {
      this.sortObj.creationDate = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "التاريخ") {
      this.sortObj.creationDate = field.currentTarget.id;
    }
    if (field.currentTarget.id == "Notes" || field.currentTarget.id == "ملاحظات") {
      this.sortObj.note = field.currentTarget.id;
    }
    this.lstWorkOrders = [];
    this.workOrderService.sortWorkOrders(this.currentUser.hospitalId, this.currentUser.id, this.page.pagenumber, this.page.pagesize, this.sortObj, this.statusId).subscribe(data => {
      this.lstWorkOrders = data;
      this.sortStatus = this.sortObj.sortStatus,
        this.sortObj = {
          assetName: '', assetNameAr: '', modelNumber: '', serialNumber: '', elapsedTime: '', closedDate: '', strSerial: '', strSubject: '', strRequestSubject: '',
          barCode: '', createdBy: '', note: '', creationDate: '', requestSubject: '', subject: '', statusNameAr: '', statusName: '', workOrderNumber: '', sortStatus: ''
          , strWorkOrderNumber: '', periorityId: 0, statusId: 0, strBarCode: '', strModel: '', masterAssetId: 0
        }
    })
  }

  generatePDF() {
    this.woDateObj.userId = this.currentUser.id;
    this.woDateObj.statusId = this.statusId;
    // if (this.woDateObj.strStartDate == "") {
    //   this.woDateObj.strStartDate = this.datePipe.transform(new Date("1900-01-01"), "MM-dd-yyyy");
    // }
    // if (this.woDateObj.strEndDate == "") {
    //   this.woDateObj.strEndDate = this.datePipe.transform(new Date(), "MM-dd-yyyy");
    // }
    // if (this.woDateObj.startDate == null) {
    //   this.dateError = true;
    //   if (this.lang == "en")
    //     this.errorMessage = "Please Select Start Date";
    //   else
    //     this.errorMessage = "اختر تاريخ البداية";

    //   return false;
    // }
    // else if (this.woDateObj.endDate == null) {

    //   this.dateError = true;
    //   if (this.lang == "en")
    //     this.errorMessage = "Please Select End Date";
    //   else
    //     this.errorMessage = "اختر تاريخ النهاية";
    //   return false;
    // }
    this.woDateObj.statusId = this.statusId;
    this.woDateObj.lang = this.lang;
    this.woDateObj.printedBy = this.currentUser.userName;
    this.woDateObj.hospitalNameAr = this.currentUser.hospitalNameAr;
    this.woDateObj.hospitalName = this.currentUser.hospitalName;

    if (this.woDateObj.statusId != 0) {
      this.woDateObj.statusName = this.statusName;
    }
    if (this.woDateObj.statusId == 0) {
      this.woDateObj.statusName = this.lang == "en" ? "All Status" : "كل الحالات";
    }
    if (this.woDateObj.statusId == undefined) {
      this.woDateObj.statusName = this.lang == "en" ? "All Status" : "كل الحالات";
    }
    this.workOrderService.CreateWOReportWithinDatePDF(this.woDateObj).subscribe(list => {
      this.allWorkOrders = list;

      let fileName = "WOReport.pdf";
      var filePath = `${environment.Domain}UploadedAttachments/`;
      this.uploadService.downloadCreateWOReportWithinDatePDF(fileName).subscribe(file => {
        var dwnldFile = filePath + 'WOReports/' + fileName;
        if (fileName != "" || fileName != null)
          window.open(dwnldFile);
      });
    });
  }

  getWOByStatusId(id: number, $event) {
    this.statusId = id;
    var statusNameWithNoDigits = $event.target.innerText.replace(/[0-9]/g, '');
    this.statusName = statusNameWithNoDigits;

    this.lstWorkOrders = [];
    this.woDateObj.statusId = id;
    this.woDateObj.userId = this.currentUser.id;
    if (this.currentUser.hospitalId > 0)
      this.woDateObj.hospitalId = this.currentUser.hospitalId;
    else
      this.woDateObj.hospitalId = this.woDateObj.hospitalId;



    this.workOrderService.GetWorkOrdersByDateAndStatus(this.woDateObj, this.page.pagenumber, this.page.pagesize).subscribe(data => {
      data.results.forEach(element => {
        if (element.statusId == 12) {
          this.startDateTime = new Date(element.creationDate);
          this.startStamp = new Date(element.creationDate).getTime();


          this.newDate = new Date(element.closedDate);
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
          this.lstWorkOrders.push(element);
          this.loading = false;
        }
        else {
          this.startDateTime = new Date(element.creationDate);
          this.startStamp = new Date(element.creationDate).getTime();
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
          this.lstWorkOrders.push(element);
        }
      });

      this.count = data.count;
    });
  }

  reset() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }

  getCitiesByGovId(govId: number) {
    this.cityService.GetCitiesByGovernorateId(govId).subscribe(cities => {
      this.lstCities = cities;
    });
  }
  getHospitalsByCityId($event) {
    this.woDateObj.hospitalId = 0;
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

}
