import { Component, Input, OnInit } from '@angular/core';

import { fontAmiri } from 'src/assets/fonts/Amiri-Regular';
import jspdf from 'jspdf';
import "jspdf-autotable";
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { Paging } from 'src/app/Shared/Models/paging';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { ListHospitalApplicationVM, SearchHospitalApplicationDateVM } from 'src/app/Shared/Models/HospitalApplicationVM';
import { HospitalApplicationService } from 'src/app/Shared/Services/hospitalapplication.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';


@Component({
  selector: 'app-hospitalapp',
  templateUrl: './hospitalapp.component.html',
  styleUrls: ['./hospitalapp.component.css']
})
export class HospitalappComponent implements OnInit {


  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  lstRoleNames: string[] = [];
  isHospital: boolean = false;
  loading: boolean = true;
  page: Paging;
  count: number;
  elementType = "img";
  searchObj: SearchHospitalApplicationDateVM;
  lstHospitalApplications: ListHospitalApplicationVM[] = [];


  constructor(private authenticationService: AuthenticationService, private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute,
    private hospitalApplicationService: HospitalApplicationService, private datePipe: DatePipe) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });
    }
    this.searchObj = { userId: '', startDate: new Date, endDate: new Date, strStartDate: '', strEndDate: '', lang: '', statusId: 0, appTypeId: 0, hospitalName: '', hospitalNameAr: '', printedBy: '', assetName: '', brandId: 0, originId: 0, serial: '', supplierId: 0, masterAssetId: 0, modelNumber: '', serialNumber: '', code: '', periorityId: 0, cityId: 0, governorateId: 0, hospitalId: 0, barCode: '', subject: '', start: '', end: '', departmentId: 0 }
    this.page = { pagenumber: 1, pagesize: 10 }
    const translationKeys = ['Asset.Reports', 'Asset.Assets', 'Asset.HospitalExecludeReport'];
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);
  }
  onSubmit() {
    // this.hospitalApplicationService.CountGetHospitalApplicationByDate(this.searchObj).subscribe((data) => {
    //   this.count = data;
    // });

    this.hospitalApplicationService.GetHospitalApplicationByDate(this.page.pagenumber, this.page.pagesize, this.searchObj).subscribe(lsthospitals => {
      this.lstHospitalApplications = lsthospitals;
    });

  }

  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;

    // this.hospitalApplicationService.CountGetHospitalApplicationByDate(this.searchObj).subscribe((data) => {
    //   this.count = data;
    // });

    this.hospitalApplicationService.GetHospitalApplicationByDate(this.page.pagenumber, this.page.pagesize, this.searchObj).subscribe(lsthospitals => {
      this.lstHospitalApplications = lsthospitals;
    });
  }
  getStartDate($event) {
    this.searchObj.strStartDate = this.datePipe.transform($event, "MM-dd-yyyy");

  }
  getEndDate($event) {
    this.searchObj.strEndDate = this.datePipe.transform($event, "MM-dd-yyyy");
  }

  exportPdf() {
    if (this.lang == "ar") {
      var doc = new jspdf('l', 'mm', 'a4');
      const pageCount = doc.internal.getNumberOfPages();
      const options: Intl.DateTimeFormatOptions = { month: "long", day: 'numeric', year: 'numeric' };
      var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

      doc.addFileToVFS('Amiri-Regular', fontAmiri);
      doc.addFont('Amiri-Regular', 'Amiri-Regular', 'normal');
      doc.setFont('Amiri-Regular');

      doc.setFontSize(10);
      var date = "التاريخ : " + new Intl.DateTimeFormat("ar-EG", options).format(new Date());
      doc.text(date, 290, 10, { "align": "right" });

      var img = new Image();
      img.src = '../../assets/images/' + this.currentUser.strLogo;
      doc.addImage(img, 'png', 250, 15, 30, 30);

      doc.setFontSize(14);
      var ministry = this.currentUser.strInsituteAr;//"وزارة الصحة والسكان";
      doc.text(ministry, 240, 25, { "align": "right" });

      doc.setFontSize(14);
      var hospital = this.currentUser.hospitalNameAr;
      doc.text(hospital, 240, 35, { "align": "right" });

      doc.text("استبعادات المستشفى", pageWidth / 2, 45, { align: 'center' });


      doc.setFontSize(15);
      if ((this.searchObj.strStartDate != "") && (this.searchObj.strEndDate != ""))
        doc.text(" بحث عن فترة  : " + new Intl.DateTimeFormat("ar-EG", options).format(new Date(this.searchObj.startDate)) + " - " + new Intl.DateTimeFormat("ar-EG", options).format(new Date(this.searchObj.endDate)), pageWidth / 2, 55, { align: 'center' });

      else if ((this.searchObj.strStartDate != "") && (this.searchObj.strEndDate == "")) {

        var end = new Intl.DateTimeFormat("ar-EG", options).format(new Date());
        doc.text(" بحث عن فترة  : " + new Intl.DateTimeFormat("ar-EG", options).format(new Date(this.searchObj.startDate)) + " - " + end, pageWidth / 2, 55, { align: 'center' });
      }

      else if ((this.searchObj.strStartDate == "") && (this.searchObj.strEndDate != "")) {

        var start = new Intl.DateTimeFormat("ar-EG", options).format(new Date("01/01/1900 00:00:00"));
        doc.text(" بحث عن فترة  : " + start + " - " + new Intl.DateTimeFormat("ar-EG", options).format(new Date(this.searchObj.endDate)), pageWidth / 2, 55, { align: 'center' });
      }
      const col = [
        {
          content: 'الأسباب',
          styles: { fontStyle: 'Amiri-Regular', columnWidth: 20 },
        },
        {
          content: 'تاريخ الاستبعاد',
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
          content: "رقم طلب الاستبعاد",
          styles: { fontStyle: 'Amiri-Regular' },
        },
        {
          content: "حالة المشكلة",
          styles: { fontStyle: 'Amiri-Regular' },
        },
        {
          content: "اسم الأصل",
          styles: { fontStyle: 'Amiri-Regular' },
        }
      ];
      var rows = [];
      var row = [];
      if (this.lstHospitalApplications != null) {
        for (let index = 0; index < this.lstHospitalApplications.length; index++) {
          const element = this.lstHospitalApplications[index];


          var appDate = new Intl.DateTimeFormat("ar-EG", options).format(new Date(element.date));
          if (element.dueDate != "")
            var dueDate = new Intl.DateTimeFormat("ar-EG", options).format(new Date(element.dueDate));

          if (element.appTypeId == 1)
            row = [element.reasonExTitlesAr, dueDate, element.statusNameAr, appDate, element.appNumber, element.typeNameAr, element.assetNameAr];
          if (element.appTypeId == 2)
            row = [element.reasonHoldTitlesAr, dueDate, element.statusNameAr, appDate, element.appNumber, element.typeNameAr, element.assetNameAr];

          rows.push(row);
        }
        (doc as any).autoTable(col, rows, {
          startY: 65, styles: {
            font: 'Amiri-Regular', halign: 'right'
          },
          columnStyles: {
            0: {
              cellWidth: 35,
            },
            1: {
              cellWidth: 30
            },
            2: {
              cellWidth: 30
            },
            3: {
              cellWidth: 30
            },
            4: {
              cellWidth: 30
            },
            5: {
              cellWidth: 40
            },
            6: {
              cellWidth: 40
            }
          }
        });
      }


      let printedBy = "تمت الطباعة بواسطة : " + this.currentUser.userName;
      for (var i = 0; i < pageCount; i++) {
        doc.setPage(i + 1);
        doc.text(printedBy, doc.internal.pageSize.getWidth() - 100, doc.internal.pageSize.getHeight() - 10);
        doc.text(String(i + 1) + "/" + String(pageCount), doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 10);
      }

    }
    if (this.lang == "en") {
      this.exportEnglishPdf();
    }


    var exportdate = this.datePipe.transform(new Date, "dd-MM-yyyy_HH:mm:ss");
    doc.save('ArSearchByDate_' + exportdate + '.pdf');
  }

  exportEnglishPdf() {

    var lstImages = [];
    var rows = [];
    var row = [];
    var doc = new jspdf('l', 'mm', 'a4');
    const pageCount = doc.internal.getNumberOfPages();
    var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();


    doc.setFontSize(10);
    var date = "Date : " + this.datePipe.transform(new Date(), "dd/MM/yyyy");
    doc.text(date, 10, 10);

    var img = new Image();
    img.src = '../../assets/images/MHP.png';
    doc.addImage(img, 'png', 20, 15, 30, 30);

    doc.setFontSize(14);

    var ministry = this.lang == "en" ? this.currentUser.strInsitute : this.currentUser.strInsituteAr;// "Ministry of Health and Communications";
    doc.text(ministry, 50, 25);

    doc.setFontSize(14);
    var hospital = this.currentUser.hospitalName;
    doc.text(hospital, 50, 35);

    doc.text("Hospital Excludes", pageWidth / 2, 45, { align: 'center' });


    doc.setFontSize(15);
    if ((this.searchObj.strStartDate != "") && (this.searchObj.strEndDate != ""))
      doc.text("Search with in  : " + this.datePipe.transform(new Date(this.searchObj.startDate), "dd/MM/yyyy") + " - " + this.datePipe.transform(new Date(this.searchObj.endDate), "dd/MM/yyyy"), pageWidth / 2, 55, { align: 'center' });

    else if ((this.searchObj.strStartDate != "") && (this.searchObj.strEndDate == "")) {

      var end = this.datePipe.transform(new Date(), "dd/MM/yyyy");
      doc.text("Search with in  : " + this.datePipe.transform(new Date(this.searchObj.startDate), "dd/MM/yyyy") + " - " + end, pageWidth / 2, 55, { align: 'center' });
    }

    else if ((this.searchObj.strStartDate == "") && (this.searchObj.strEndDate != "")) {

      var start = this.datePipe.transform(new Date("01/01/1900 00:00:00"), "dd/MM/yyyy");
      doc.text("Search with in  : " + start + " - " + this.datePipe.transform(new Date(this.searchObj.endDate), "dd/MM/yyyy"), pageWidth / 2, 55, { align: 'center' });
    }
    const col = ["Asset Name", "Type", "App Number", "Date", "Status", "Due Date", "Reasons"];


    if (this.lstHospitalApplications != null) {
      for (let index = 0; index < this.lstHospitalApplications.length; index++) {
        const element = this.lstHospitalApplications[index];

        var appDate = this.datePipe.transform(new Date(element.date), 'dd/MM/yyyy');
        var dueDate = this.datePipe.transform(new Date(element.dueDate), 'dd/MM/yyyy');

        if (element.appTypeId == 1)
          row = [element.assetName, element.typeName, element.appNumber, appDate.trim(), element.statusName, dueDate.trim(), element.reasonExTitles];
        if (element.appTypeId == 2)
          row = [element.assetName, element.typeName, element.appNumber, appDate.trim(), element.statusName, dueDate.trim(), element.reasonHoldTitles];

        rows.push(row);
      }

      (doc as any).autoTable(col, rows, {
        startY: 65, styles: {}
      });
    }
    let printedBy = "Printed By : " + this.currentUser.userName;
    for (var i = 0; i < pageCount; i++) {
      doc.setPage(i + 1);
      doc.text(printedBy, doc.internal.pageSize.getWidth() - 100, doc.internal.pageSize.getHeight() - 10);
      doc.text(String(i + 1) + "/" + String(pageCount), doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 10);
    }

    var exportdate = this.datePipe.transform(new Date, "dd-MM-yyyy_HH:mm:ss");
    doc.save('EnSearchByDate_' + exportdate + '.pdf');
  }

}
