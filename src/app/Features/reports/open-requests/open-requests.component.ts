import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Paging } from 'src/app/Shared/Models/paging';
import { OpenRequestVM, SearchOpenRequestVM } from 'src/app/Shared/Models/requestModeVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { RequestService } from 'src/app/Shared/Services/request.service';
import { environment } from 'src/environments/environment';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { HospitalApplicationService } from 'src/app/Shared/Services/hospitalapplication.service';
import { ListHospitalApplicationVM, SearchHospitalApplicationDateVM } from 'src/app/Shared/Models/HospitalApplicationVM';
import { SupplierExecludeAssetService } from 'src/app/Shared/Services/supplierexecludeasset.service';
import { ListSupplierExecludeAssetVM, SearchSupplierExecludeAssetDateVM } from 'src/app/Shared/Models/supplierExecludeAssetVM';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';


@Component({
  selector: 'app-open-requests',
  templateUrl: './open-requests.component.html',
  styleUrls: ['./open-requests.component.css']
})
export class OpenRequestsComponent implements OnInit {

  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  lstRoleNames: string[] = [];
  isHospital: boolean = false;
  loading: boolean = true;
  page: Paging;
  count: number;
  lstOpenRequests: OpenRequestVM[] = [];
  searchOpenRequestObj: SearchOpenRequestVM;
  lstAllOpenRequests: OpenRequestVM[] = [];
  errorMessage: string = "";
  dateError: boolean = false;



  lstAllHospitalExcludes: ListHospitalApplicationVM[];
  lstAllHospitalHolds: ListHospitalApplicationVM[];
  lstAllSupplierExcludes: ListSupplierExecludeAssetVM[] = [];
  lstAllSupplierHolds: ListSupplierExecludeAssetVM[] = [];
  excludecount: number;
  holdcount: number;
  supplierExcludeCount: number;
  supplierHoldCount: number;


  constructor(private authenticationService: AuthenticationService, private datePipe: DatePipe, private requestService: RequestService, private uploadService: UploadFilesService,
    private hospitalApplicationService: HospitalApplicationService, private supplierExecludeAssetService: SupplierExecludeAssetService, private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });
    }
    this.searchOpenRequestObj = { strStartDate: '', strEndDate: '', lang: '', userId: '', startDate: new Date("2022-07-01"), endDate: new Date(), hospitalId: 0, hospitalName: '', hospitalNameAr: '', printedBy: '' }
    this.page = { pagenumber: 1, pagesize: 10 };


    const translationKeys = ['Asset.Reports', 'Asset.Assets', 'Asset.OpenRequestReport'];
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);
  }
  onSubmit() {
    this.searchOpenRequestObj.userId = this.currentUser.id;
    this.requestService.GetOpenRequestsByDate(this.searchOpenRequestObj, this.page.pagenumber, this.page.pagesize).subscribe(requests => {
      this.lstOpenRequests = requests.results;
      this.count = requests.count;
      this.loading = false;
    });


    var searchExcludeDate = new SearchHospitalApplicationDateVM();
    // searchExcludeDate.strStartDate = this.searchOpenRequestObj.strStartDate;
    searchExcludeDate.strStartDate = "2022-07-01";
    searchExcludeDate.strEndDate = this.searchOpenRequestObj.strEndDate;
    searchExcludeDate.lang = this.lang;

    // this.hospitalApplicationService.GetAllHospitalExecludes(searchExcludeDate, 2, 1, this.currentUser.hospitalId, this.page.pagenumber, this.page.pagesize).subscribe(lsthospitals => {
    //   this.lstAllHospitalExcludes = lsthospitals.results;
    //   this.excludecount = lsthospitals.count;
    // });


    // this.hospitalApplicationService.GetAllHospitalHolds(searchExcludeDate, 2, 2, this.currentUser.hospitalId, this.page.pagenumber, this.page.pagesize).subscribe(lsthospitals => {
    //   this.lstAllHospitalHolds = lsthospitals.results;
    //   this.holdcount = lsthospitals.count;
    // });



    var searchSupplierExcludeDate = new SearchSupplierExecludeAssetDateVM();
    // searchSupplierExcludeDate.strStartDate = this.searchOpenRequestObj.strStartDate;
    searchSupplierExcludeDate.strStartDate = "2022-07-01";
    searchSupplierExcludeDate.strEndDate = this.searchOpenRequestObj.strEndDate;
    searchSupplierExcludeDate.lang = this.lang;

    this.supplierExecludeAssetService.GetAllSupplierExecludes(searchSupplierExcludeDate, 2, 1, this.currentUser.hospitalId, this.page.pagenumber, this.page.pagesize).subscribe(lstexcludes => {
      this.lstAllSupplierExcludes = lstexcludes.results;
      this.supplierExcludeCount = lstexcludes.count;
    });

    this.supplierExecludeAssetService.GetAllSupplierHolds(searchSupplierExcludeDate, 2, 2, this.currentUser.hospitalId, this.page.pagenumber, this.page.pagesize).subscribe(lstexcludes => {
      this.lstAllSupplierHolds = lstexcludes.results;
      this.supplierHoldCount = lstexcludes.count;
    });


  }
  clickHospitalExcludes(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;


    this.searchOpenRequestObj.strStartDate = this.datePipe.transform(new Date(this.searchOpenRequestObj.startDate), "MM-dd-yyyy");
    this.searchOpenRequestObj.strEndDate = this.datePipe.transform(new Date(this.searchOpenRequestObj.endDate), "MM-dd-yyyy");
    if (this.currentUser.hospitalId != 0) {
      this.searchOpenRequestObj.hospitalId = this.currentUser.hospitalId;
    }
    else
      this.searchOpenRequestObj.hospitalId = 0;

    var searchExcludeDate = new SearchHospitalApplicationDateVM();
    searchExcludeDate.strStartDate = this.searchOpenRequestObj.strStartDate;
    searchExcludeDate.strEndDate = this.searchOpenRequestObj.strEndDate;
    searchExcludeDate.lang = this.lang;

    // this.hospitalApplicationService.GetAllHospitalExecludes(searchExcludeDate, 2, 1, this.currentUser.hospitalId, this.page.pagenumber, this.page.pagesize).subscribe(lsthospitals => {
    //   this.lstAllHospitalExcludes = lsthospitals.results;
    //   this.excludecount = lsthospitals.count;
    // });
  }
  clickHospitalHolds(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;


    this.searchOpenRequestObj.strStartDate = this.datePipe.transform(new Date(this.searchOpenRequestObj.startDate), "MM-dd-yyyy");
    this.searchOpenRequestObj.strEndDate = this.datePipe.transform(new Date(this.searchOpenRequestObj.endDate), "MM-dd-yyyy");
    if (this.currentUser.hospitalId != 0) {
      this.searchOpenRequestObj.hospitalId = this.currentUser.hospitalId;
    }
    else
      this.searchOpenRequestObj.hospitalId = 0;

    var searchExcludeDate = new SearchHospitalApplicationDateVM();
    searchExcludeDate.strStartDate = this.searchOpenRequestObj.strStartDate;
    searchExcludeDate.strEndDate = this.searchOpenRequestObj.strEndDate;
    searchExcludeDate.lang = this.lang;

    // this.hospitalApplicationService.GetAllHospitalHolds(searchExcludeDate, 2, 2, this.currentUser.hospitalId, this.page.pagenumber, this.page.pagesize).subscribe(lsthospitals => {
    //   this.lstAllHospitalHolds = lsthospitals.results;
    //   this.holdcount = lsthospitals.count;
    // });
  }
  clickSupplierExcludes(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;


    this.searchOpenRequestObj.strStartDate = this.datePipe.transform(new Date(this.searchOpenRequestObj.startDate), "MM-dd-yyyy");
    this.searchOpenRequestObj.strEndDate = this.datePipe.transform(new Date(this.searchOpenRequestObj.endDate), "MM-dd-yyyy");
    if (this.currentUser.hospitalId != 0) {
      this.searchOpenRequestObj.hospitalId = this.currentUser.hospitalId;
    }
    else
      this.searchOpenRequestObj.hospitalId = 0;

    var searchSupplierExcludeDate = new SearchSupplierExecludeAssetDateVM();
    searchSupplierExcludeDate.strStartDate = this.searchOpenRequestObj.strStartDate;
    searchSupplierExcludeDate.strEndDate = this.searchOpenRequestObj.strEndDate;
    searchSupplierExcludeDate.lang = this.lang;

    this.supplierExecludeAssetService.GetAllSupplierExecludes(searchSupplierExcludeDate, 2, 1, this.currentUser.hospitalId, this.page.pagenumber, this.page.pagesize).subscribe(lstexcludes => {
      this.lstAllSupplierExcludes = lstexcludes.results;
      this.supplierExcludeCount = lstexcludes.count;
    });
  }
  clickSupplierHolds(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;


    this.searchOpenRequestObj.strStartDate = this.datePipe.transform(new Date(this.searchOpenRequestObj.startDate), "MM-dd-yyyy");
    this.searchOpenRequestObj.strEndDate = this.datePipe.transform(new Date(this.searchOpenRequestObj.endDate), "MM-dd-yyyy");
    if (this.currentUser.hospitalId != 0) {
      this.searchOpenRequestObj.hospitalId = this.currentUser.hospitalId;
    }
    else
      this.searchOpenRequestObj.hospitalId = 0;

    var searchSupplierExcludeDate = new SearchSupplierExecludeAssetDateVM();
    searchSupplierExcludeDate.strStartDate = this.searchOpenRequestObj.strStartDate;
    searchSupplierExcludeDate.strEndDate = this.searchOpenRequestObj.strEndDate;
    searchSupplierExcludeDate.lang = this.lang;


    this.supplierExecludeAssetService.GetAllSupplierHolds(searchSupplierExcludeDate, 2, 2, this.currentUser.hospitalId, this.page.pagenumber, this.page.pagesize).subscribe(lstexcludes => {
      this.lstAllSupplierHolds = lstexcludes.results;
      this.supplierHoldCount = lstexcludes.count;
    });
  }



  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;


    this.searchOpenRequestObj.strStartDate = this.datePipe.transform(new Date(this.searchOpenRequestObj.startDate), "MM-dd-yyyy");
    this.searchOpenRequestObj.strEndDate = this.datePipe.transform(new Date(this.searchOpenRequestObj.endDate), "MM-dd-yyyy");
    if (this.currentUser.hospitalId != 0) {
      this.searchOpenRequestObj.hospitalId = this.currentUser.hospitalId;
    }
    else
      this.searchOpenRequestObj.hospitalId = 0;

    this.searchOpenRequestObj.userId = this.currentUser.id;

    this.requestService.GetOpenRequestsByDate(this.searchOpenRequestObj, this.page.pagenumber, this.page.pagesize).subscribe(requests => {
      this.lstOpenRequests = requests.results;
      this.count = requests.count;
      this.loading = false;
    });

  }

  getStartDate($event) {
    this.searchOpenRequestObj.strStartDate = this.datePipe.transform($event, "MM-dd-yyyy");

    this.searchOpenRequestObj.startDate = $event;

  }
  getEndDate($event) {
    this.searchOpenRequestObj.strEndDate = this.datePipe.transform($event, "MM-dd-yyyy");

    this.searchOpenRequestObj.endDate = $event;
  }
  generatePDF() {
    this.searchOpenRequestObj.userId = this.currentUser.id;
    this.searchOpenRequestObj.hospitalId = this.currentUser.hospitalId;
    if (this.searchOpenRequestObj.strStartDate == "") {
      this.searchOpenRequestObj.strStartDate = this.datePipe.transform(new Date("1900-01-01"), "MM-dd-yyyy");
    }

    if (this.searchOpenRequestObj.strEndDate == "") {
      this.searchOpenRequestObj.strEndDate = this.datePipe.transform(new Date(), "MM-dd-yyyy");
    }

    this.searchOpenRequestObj.lang = this.lang;
    this.searchOpenRequestObj.printedBy = this.currentUser.userName;
    this.searchOpenRequestObj.hospitalNameAr = this.currentUser.hospitalNameAr;
    this.searchOpenRequestObj.hospitalName = this.currentUser.hospitalName;

    var searchExcludeDate = new SearchHospitalApplicationDateVM();
    searchExcludeDate.strStartDate = this.searchOpenRequestObj.strStartDate;
    searchExcludeDate.strEndDate = this.searchOpenRequestObj.strEndDate;

    // this.hospitalApplicationService.GetAllHospitalHolds(searchExcludeDate, 2, 2, this.currentUser.hospitalId, this.page.pagenumber, this.page.pagesize).subscribe(lsthospitals => {
    //   this.lstAllHospitalHolds = lsthospitals.results;
    //   this.holdcount = lsthospitals.count;
    // });

    // this.hospitalApplicationService.GetAllHospitalExecludes(searchExcludeDate, 2, 1, this.currentUser.hospitalId, this.page.pagenumber, this.page.pagesize).subscribe(lsthospitals => {
    //   this.lstAllHospitalExcludes = lsthospitals.results;
    //   this.excludecount = lsthospitals.count;
    // });


    this.requestService.CreateOpenServiceRequestPDF(this.searchOpenRequestObj).subscribe(list => {
      this.lstAllOpenRequests = list;

      let fileName = "AllOpenRequestReport.pdf";
      var filePath = `${environment.Domain}UploadedAttachments/`;
      this.uploadService.downloadAllOpenRequests(fileName).subscribe(file => {
        var dwnldFile = filePath + 'SRReports/' + fileName;
        if (fileName != "" || fileName != null)
          window.open(dwnldFile);
      });
    });
  }
}
