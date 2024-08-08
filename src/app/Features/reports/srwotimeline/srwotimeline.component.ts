import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Paging } from 'src/app/Shared/Models/paging';
import { SearchRequestDateVM } from 'src/app/Shared/Models/requestModeVM';
import { ReportRequestVM } from 'src/app/Shared/Models/requestVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { RequestService } from 'src/app/Shared/Services/request.service';
import { fontAmiri } from 'src/assets/fonts/Amiri-Regular';
import jspdf from 'jspdf';
import "jspdf-autotable";
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { environment } from 'src/environments/environment';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';

@Component({
  selector: 'app-srwotimeline',
  templateUrl: './srwotimeline.component.html',
  styleUrls: ['./srwotimeline.component.css']
})
export class SrwotimelineComponent implements OnInit {

  lstTimeline: ReportRequestVM[] = [];
  lstTimeline2: ReportRequestVM[] = [];
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  lstRoleNames: string[] = [];
  page: Paging;
  count: number = 0;
  loading: boolean = true;
  searchRequestDateObj: SearchRequestDateVM;

  errorMessage: string = "";
  dateError: boolean = false;

  constructor(private authenticationService: AuthenticationService, private requestService: RequestService,
    private datePipe: DatePipe, private uploadService: UploadFilesService, private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });
    }
    this.page = { pagenumber: 1, pagesize: 10 }
    this.searchRequestDateObj = { hospitalId: 0, statusId: 0, userId: '', startDate: new Date, endDate: new Date, strStartDate: '', strEndDate: '', lang: '', hospitalName: '', hospitalNameAr: '', printedBy: '', statusName: '', statusNameAr: '' }



    const translationKeys = ['Asset.Reports', 'Asset.Hospitals', 'Asset.ReportCertificate'];
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);

  }

  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;
    this.searchRequestDateObj.lang = this.lang;
    this.requestService.GetRequestEstimations(this.page.pagenumber, this.page.pagesize, this.searchRequestDateObj).subscribe(list => {
      this.lstTimeline = list;
      this.loading = false;
    });
    this.requestService.CountGetRequestEstimations(this.searchRequestDateObj).subscribe(cnt => {
      this.count = cnt;
    });

  }

  getStartDate($event) {
    this.searchRequestDateObj.strStartDate = this.datePipe.transform($event, "MM-dd-yyyy");

  }
  getEndDate($event) {
    this.searchRequestDateObj.strEndDate = this.datePipe.transform($event, "MM-dd-yyyy");
  }


  onSubmit() {
    this.searchRequestDateObj.userId = this.currentUser.id;
    if (this.searchRequestDateObj.strStartDate == "") {
      if (this.lang == "en") {
        this.dateError = true;
        this.errorMessage = "Please select start date";
      }
      else {
        this.dateError = true;
        this.errorMessage = "من فضلك اختر تاريخ البداية";
      }
    }

    if (this.searchRequestDateObj.strEndDate == "") {
      this.searchRequestDateObj.strEndDate = this.datePipe.transform(new Date(), "MM-dd-yyyy");
    }

    this.searchRequestDateObj.lang = this.lang;
    this.searchRequestDateObj.printedBy = this.currentUser.userName;
    this.searchRequestDateObj.hospitalNameAr = this.currentUser.hospitalNameAr;
    this.searchRequestDateObj.hospitalName = this.currentUser.hospitalName;

    this.requestService.GetRequestEstimations(this.page.pagenumber, this.page.pagesize, this.searchRequestDateObj).subscribe(list => {
      this.lstTimeline = list;
      this.loading = false;
    });
    this.requestService.CountGetRequestEstimations(this.searchRequestDateObj).subscribe(cnt => {
      this.count = cnt;
    });

    this.requestService.GetAllRequestEstimations(this.searchRequestDateObj).subscribe(list => {
      this.lstTimeline2 = list;
    });
  }


  exportPdf() {
    if (this.lang == "en") { this.exportEnglishPdf(); }
    else { this.exportArabicPDF(); }
  }

  generatePDF() {
    this.searchRequestDateObj.userId = this.currentUser.id;
    if (this.searchRequestDateObj.strStartDate == "") {
      if (this.lang == "en") {
        this.dateError = true;
        this.errorMessage = "Please select start date";
      }
      else {
        this.dateError = true;
        this.errorMessage = "من فضلك اختر تاريخ البداية";
      }
    }

    if (this.searchRequestDateObj.strEndDate == "") {
      this.searchRequestDateObj.strEndDate = this.datePipe.transform(new Date(), "MM-dd-yyyy");
    }

    this.searchRequestDateObj.lang = this.lang;
    this.searchRequestDateObj.printedBy = this.currentUser.userName;
    this.searchRequestDateObj.hospitalNameAr = this.currentUser.hospitalNameAr;
    this.searchRequestDateObj.hospitalName = this.currentUser.hospitalName;

    this.requestService.PrintServiceRequestList(this.searchRequestDateObj).subscribe(list => {

      let fileName = "SRWOReport.pdf";
      var filePath = `${environment.Domain}UploadedAttachments/`;
      this.uploadService.downloadCreateSRWOReportWithinDatePDF(fileName).subscribe(file => {
        var dwnldFile = filePath + 'SRWOReports/' + fileName;
        if (fileName != "" || fileName != null)
          window.open(dwnldFile);
      });
    });
  }


  exportArabicPDF() {
    var doc = new jspdf('l', 'mm', 'a4');

    const options: Intl.DateTimeFormatOptions = { month: "long", day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' };
    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
    doc.addFileToVFS('Amiri-Regular', fontAmiri);
    doc.addFont('Amiri-Regular', 'Amiri-Regular', 'normal');
    doc.setFont('Amiri-Regular');

    const col = [
      {
        content: 'المدة',
        styles: { fontStyle: 'Amiri-Regular', halign: 'right' },
      },
      {
        content: 'إغلاق أمر الشغل',
        styles: { fontStyle: 'Amiri-Regular', halign: 'right' },
      },
      {
        content: 'إغلاق البلاغ',
        styles: { fontStyle: 'Amiri-Regular', halign: 'right' },
      },
      {
        content: 'مدة أمر الشغل',
        styles: { fontStyle: 'Amiri-Regular', halign: 'right' },
      },
      {
        content: 'نهاية أمر الشغل',
        styles: { fontStyle: 'Amiri-Regular', halign: 'right' },
      },
      {
        content: 'بداية أمر الشغل',
        styles: { fontStyle: 'Amiri-Regular', halign: 'right' },
      },
      {
        content: 'المدة من البلاغ إلى إنشاء أمر الشغل',
        styles: { fontStyle: 'Amiri-Regular', halign: 'right' },
      },

      {
        content: 'إنشاء أمر الشغل',
        styles: { fontStyle: 'Amiri-Regular', halign: 'right' },
      },
      {
        content: 'تاريخ البلاغ',
        styles: { fontStyle: 'Amiri-Regular', halign: 'right' },
      },
      {
        content: 'رقم البلاغ',
        styles: { fontStyle: 'Amiri-Regular', halign: 'right' },
      }

    ];
    var rows = [];
    var row = [];


    var startRequestDate = "";
    var closeRequestDate = "";
    var closedWorkOrderDate = "";
    var initialWorkOrderDate = "";
    var firstStepInTrackWorkOrderInProgress = "";
    var lastStepInTrackWorkOrderInProgress = "";

    if (this.lstTimeline2 != null) {
      for (let index = 0; index < this.lstTimeline2.length; index++) {
        const element = this.lstTimeline2[index];


        if (element.startRequestDate != null) {
          startRequestDate = new Intl.DateTimeFormat("ar-EG", options).format(new Date(element.startRequestDate));
          var splitComma = startRequestDate.split(',');
          startRequestDate = splitComma[0].trim() + "\n" + splitComma[1].trim();
        }
        else
          startRequestDate = "";


        if (element.initialWorkOrderDate != null) {
          initialWorkOrderDate = new Intl.DateTimeFormat("ar-EG", options).format(new Date(element.initialWorkOrderDate));
          var splitComma = initialWorkOrderDate.split(',');
          initialWorkOrderDate = splitComma[0].trim() + "\n" + splitComma[1].trim();
        }
        else
          initialWorkOrderDate = "";

        if (element.firstStepInTrackWorkOrderInProgress != null) {
          firstStepInTrackWorkOrderInProgress = new Intl.DateTimeFormat("ar-EG", options).format(new Date(element.firstStepInTrackWorkOrderInProgress));
          var splitComma = firstStepInTrackWorkOrderInProgress.split(',');
          firstStepInTrackWorkOrderInProgress = splitComma[0].trim() + "\n" + splitComma[1].trim();
        }
        else
          firstStepInTrackWorkOrderInProgress = "";


        if (element.lastStepInTrackWorkOrderInProgress != null) {
          lastStepInTrackWorkOrderInProgress = new Intl.DateTimeFormat("ar-EG", options).format(new Date(element.lastStepInTrackWorkOrderInProgress));
          var splitComma = lastStepInTrackWorkOrderInProgress.split(',');
          lastStepInTrackWorkOrderInProgress = splitComma[0].trim() + "\n" + splitComma[1].trim();
        }
        else
          lastStepInTrackWorkOrderInProgress = "";


        if (element.closedWorkOrderDate != null) {
          closedWorkOrderDate = new Intl.DateTimeFormat("ar-EG", options).format(new Date(element.closedWorkOrderDate));
          var splitComma = closedWorkOrderDate.split(',');
          closedWorkOrderDate = splitComma[0].trim() + "\n" + splitComma[1].trim();
        }
        else
          closedWorkOrderDate = "";

        if (element.closeRequestDate != null) {
          closeRequestDate = new Intl.DateTimeFormat("ar-EG", options).format(new Date(element.closeRequestDate));
          var splitComma = closeRequestDate.split(',');
          closeRequestDate = splitComma[0].trim() + "\n" + splitComma[1].trim();
        }
        else
          closeRequestDate = "";

        row = [element.durationTillCloseDate, closedWorkOrderDate, closeRequestDate, element.durationBetweenWorkOrders, lastStepInTrackWorkOrderInProgress, firstStepInTrackWorkOrderInProgress, element.durationBetweenStartRequestWorkOrder, initialWorkOrderDate, startRequestDate.trim(), element.requestNumber];
        rows.push(row);
      }
      (doc as any).autoTable(col, rows, {
        startY: 65,
        displayposition: 'right',
        //  theme: 'grid',
        margin: { top: 65 },
        styles: {
          font: 'Amiri-Regular',
          halign: 'right',
          pageBreak: 'always',
          valign: 'middle'
        },
        columnStyles: {
          // halign: 'right',
          0: {
            cellWidth: 35,
            halign: 'right'
          },
          1: {
            cellWidth: 25,
            halign: 'right'
          },
          2: {
            cellWidth: 25,
            halign: 'right'
          },
          3: {
            cellWidth: 25,
            halign: 'right'
          },
          4: {
            cellWidth: 25,
            halign: 'right'
          },
          5: {
            cellWidth: 25,
            halign: 'right'
          },
          6: {
            cellWidth: 25,
            halign: 'right'
          },
          7: {
            cellWidth: 28,
            halign: 'right'
          },
          8: {
            cellWidth: 35,
            halign: 'right'
          },
          9: {
            cellWidth: 20,
          }
        },
        bodyStyles: {
          halign: 'right'
        },
        didDrawCell: data => {
          data.row.raw[8].style.align = 'right';
          // for (let index = 0; index < data.row.raw.length; index++) {
          //   const element = data.row.raw[1];
          // }
        }

      });
      const pageCount = doc.internal.getNumberOfPages();
      let printedBy = "تمت الطباعة بواسطة  :" + this.currentUser.userName;
      for (var i = 0; i < pageCount; i++) {
        doc.setPage(i + 1);
        var img = new Image();
        img.src = '../../assets/images/' + this.currentUser.strLogo;
        doc.addImage(img, 'png', 250, 15, 30, 30);

        doc.setFontSize(14);
        var ministry = this.lang == "en" ? this.currentUser.strInsitute : this.currentUser.strInsituteAr;//"وزارة الصحة والسكان";
        doc.text(ministry, 240, 25, { "align": "right" });

        doc.setFontSize(14);
        var hospital = this.currentUser.hospitalNameAr;
        doc.text(hospital, 240, 35, { "align": "right" });

        doc.text("طلبات الخدمة", pageWidth / 2, 45, { align: 'center' });

        doc.setFontSize(15);
        if ((this.searchRequestDateObj.strStartDate != "") && (this.searchRequestDateObj.strEndDate != "")) {

          let splitStartDate = this.searchRequestDateObj.strStartDate.split('-');
          let month = splitStartDate[0];
          let day = splitStartDate[1];
          let year = splitStartDate[2];
          let newStartDate = Number(year).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(month).toLocaleString("ar-SA") + "/" + Number(day).toLocaleString("ar-SA");


          let splitEndDate = this.searchRequestDateObj.strEndDate.split('-');
          let endmonth = splitEndDate[0];
          let endday = splitEndDate[1];
          let endyear = splitEndDate[2];
          let newEndDate = Number(endyear).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(endmonth).toLocaleString("ar-SA") + "/" + Number(endday).toLocaleString("ar-SA");

          doc.text(" بحث عن فترة  : " + newStartDate + " - " + newEndDate, pageWidth / 2, 55, { align: 'center' });
        }
        else if (this.searchRequestDateObj.strStartDate != "" && (this.searchRequestDateObj.strEndDate == "" || this.searchRequestDateObj.strEndDate == null || this.searchRequestDateObj.strEndDate == undefined)) {

          let splitStartDate = this.searchRequestDateObj.strStartDate.split('-');
          let month = splitStartDate[0];
          let day = splitStartDate[1];
          let year = splitStartDate[2];
          let newStartDate = Number(year).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(month).toLocaleString("ar-SA") + "/" + Number(day).toLocaleString("ar-SA");




          let splitDefaultEndDate = this.datePipe.transform(new Date().toString(), "MM-dd-yyyy").split('-');
          let endmonth = splitDefaultEndDate[0];
          let endday = splitDefaultEndDate[1];
          let endyear = splitDefaultEndDate[2];
          let end = Number(endyear).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(endmonth).toLocaleString("ar-SA") + "/" + Number(endday).toLocaleString("ar-SA");

          doc.text(" بحث عن فترة  : " + newStartDate + " - " + end, pageWidth / 2, 55, { align: 'center' });
        }
        else if ((this.searchRequestDateObj.strStartDate == "") && (this.searchRequestDateObj.strEndDate != "")) {

          let splitEndDate = this.searchRequestDateObj.strEndDate.split('-');
          let endmonth = splitEndDate[0];
          let endday = splitEndDate[1];
          let endyear = splitEndDate[2];
          let newEndDate = Number(endyear).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(endmonth).toLocaleString("ar-SA") + "/" + Number(endday).toLocaleString("ar-SA");




          let splitDefaultStartDate = this.datePipe.transform(new Date("01-01-1900 00:00:00").toString(), "MM-dd-yyyy").split('-');
          let month = splitDefaultStartDate[0];
          let day = splitDefaultStartDate[1];
          let year = splitDefaultStartDate[2];
          let start = Number(year).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(month).toLocaleString("ar-SA") + "/" + Number(day).toLocaleString("ar-SA");

          doc.text(" بحث عن فترة  : " + start + " - " + newEndDate, pageWidth / 2, 55, { align: 'center' });
        }

        doc.setFontSize(12);
        doc.text(printedBy, doc.internal.pageSize.getWidth() - 100, doc.internal.pageSize.getHeight() - 10);
        let pageIndex = (i + 1).toLocaleString("ar-SA").toString();
        let totalPages = pageCount.toLocaleString("ar-SA").toString();
        doc.text(totalPages + "/" + pageIndex, doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 10);


      }
    }

    var exportdate = this.datePipe.transform(new Date, "dd-MM-yyyy_HH:mm:ss");
    doc.save('ArSRWorkorder_' + exportdate + '_' + this.currentUser.userName + '.pdf');


  }

  exportEnglishPdf() {

  }
}
