import { DatePipe } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { Paging } from 'src/app/Shared/Models/paging';
import { ListRequestVM, SearchRequestDateVM } from 'src/app/Shared/Models/requestModeVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { RequestService } from 'src/app/Shared/Services/request.service';
import "jspdf-autotable";
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { environment } from 'src/environments/environment';
import { RequestStatusService } from 'src/app/Shared/Services/request-status.service';
import { IndexRequestStatus } from 'src/app/Shared/Models/RequestStatusVM';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';
@Component({
  selector: 'app-sr-in-progress',
  templateUrl: './sr-in-progress.component.html',
  styleUrls: ['./sr-in-progress.component.css']
})
export class SrInProgressComponent implements OnInit {

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
  lstMainStatuses: IndexRequestStatus;

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

  statusId: number;
  statusName: string = "";
  @Input() get selectedColumns(): any[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: any[]) {
    this._selectedColumns = this.cols.filter(col => val.includes(col));
  }
  constructor(private authenticationService: AuthenticationService, private requestStatusService: RequestStatusService, private requestService: RequestService, private datePipe: DatePipe, private uploadService: UploadFilesService,
    private route: Router, private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });
    }
    this.requestDateObj = { hospitalId: 0, statusId: 0, userId: '', startDate: new Date, endDate: new Date, strStartDate: '', strEndDate: '', lang: '', hospitalName: '', hospitalNameAr: '', printedBy: '', statusName: '', statusNameAr: '' }
    this.page = { pagenumber: 1, pagesize: 10 }


    const translationKeys = ['Asset.Reports', 'Asset.Assets', 'Asset.SRInProgress'];
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


    this.lstMainStatuses = { countAll: 0, color: '', countApproved: 0, countClose: 0, countInProgress: 0, countOpen: 0, countSolved: 0, icon: '', id: 0, listStatus: [], name: '', nameAr: '' }

    this.requestDateObj.startDate = null;
    this.requestDateObj.endDate = null;

  }
  onSubmit() {
    this.lstRequests = [];
    this.requestDateObj.statusId = 3;
    this.requestDateObj.userId = this.currentUser.id;


    this.requestService.GetRequestsByDateAndStatus(this.requestDateObj, this.page.pagenumber, this.page.pagesize).subscribe(assets => {
      this.lstRequests = assets.results;
      this.count = assets.count;
      this.lstMainStatuses.countClose = assets.countClosed;

      this.loading = false;
    });

  }

  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;


    this.requestStatusService.GetAllForReportByDate(this.requestDateObj).subscribe(statusObj => {
      this.lstMainStatuses = statusObj;
    });


    this.loading = true;
    this.requestDateObj.statusId = 3;
    this.requestDateObj.userId = this.currentUser.id;
    this.requestService.GetRequestsByDateAndStatus(this.requestDateObj, this.page.pagenumber, this.page.pagesize).subscribe(assets => {
      this.lstRequests = assets.results;
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
    this.requestDateObj.lang = this.lang;
    this.requestDateObj.printedBy = this.currentUser.userName;
    this.requestDateObj.hospitalNameAr = this.currentUser.hospitalNameAr;
    this.requestDateObj.hospitalName = this.currentUser.hospitalName;
    this.requestDateObj.statusId = 3;
    this.requestDateObj.userId = this.currentUser.id;
    this.requestService.CreateSRReportWithInProgressPDF(this.requestDateObj).subscribe(list => {
      this.allRequests = list;
      let fileName = "SRInProgressReport.pdf";
      var filePath = `${environment.Domain}UploadedAttachments/`;
      this.uploadService.downloadSRInProgressPDF(fileName).subscribe(file => {
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
  }

  reset() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }


}
