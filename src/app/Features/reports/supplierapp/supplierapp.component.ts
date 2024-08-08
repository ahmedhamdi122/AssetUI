import { Component, OnInit } from '@angular/core';
import { fontAmiri } from 'src/assets/fonts/Amiri-Regular';
import jspdf from 'jspdf';
import "jspdf-autotable";
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { Paging } from 'src/app/Shared/Models/paging';
import { ListSupplierExecludeAssetVM, SearchSupplierExecludeAssetDateVM } from 'src/app/Shared/Models/supplierExecludeAssetVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { DatePipe } from '@angular/common';
import { SupplierExecludeAssetService } from 'src/app/Shared/Services/supplierexecludeasset.service';


@Component({
  selector: 'app-supplierapp',
  templateUrl: './supplierapp.component.html',
  styleUrls: ['./supplierapp.component.css']
})
export class SupplierappComponent implements OnInit {

  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  lstRoleNames: string[] = [];
  isHospital: boolean = false;
  loading: boolean = true;
  page: Paging;
  count: number;
  elementType = "img";
  searchObj: SearchSupplierExecludeAssetDateVM;
  lstSupplierExecludeAssets: ListSupplierExecludeAssetVM[] = [];


  constructor(private authenticationService: AuthenticationService,
    private supplierExecludeAssetService: SupplierExecludeAssetService,
    private datePipe: DatePipe) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });
    }
    this.searchObj = { userId: '', startDate: new Date, endDate: new Date, strStartDate: '', strEndDate: '', lang: '' }
    this.page = { pagenumber: 1, pagesize: 10 }

  }
  onSubmit() {
    this.supplierExecludeAssetService.CountSupplierExcludeAssetByDate(this.searchObj).subscribe((data) => {
      this.count = data;
    });

    this.supplierExecludeAssetService.GetSupplierExcludeAssetByDate(this.page.pagenumber, this.page.pagesize, this.searchObj).subscribe(lsthospitals => {
      this.lstSupplierExecludeAssets = lsthospitals;
    });
  }

  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;

    this.supplierExecludeAssetService.CountSupplierExcludeAssetByDate(this.searchObj).subscribe((data) => {
      this.count = data;
    });

    this.supplierExecludeAssetService.GetSupplierExcludeAssetByDate(this.page.pagenumber, this.page.pagesize, this.searchObj).subscribe(lsthospitals => {
      this.lstSupplierExecludeAssets = lsthospitals;
    });
  }
  getStartDate($event) {
    this.searchObj.strStartDate = this.datePipe.transform($event, "MM-dd-yyyy");

  }
  getEndDate($event) {
    this.searchObj.strEndDate = this.datePipe.transform($event, "MM-dd-yyyy");
  }

  // exportPdf() {
  //   if (this.lang == "ar") {
  //     var lstImages = [];
  //     var doc = new jspdf('l', 'mm', 'a4');
  //     const options: Intl.DateTimeFormatOptions = { month: "long", day: 'numeric', year: 'numeric' };
  //     var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

  //     doc.addFileToVFS('Amiri-Regular', fontAmiri);
  //     doc.addFont('Amiri-Regular', 'Amiri-Regular', 'normal');
  //     doc.setFont('Amiri-Regular');

  //     doc.setFontSize(10);
  //     var date = "التاريخ : " + new Intl.DateTimeFormat("ar-EG", options).format(new Date());
  //     doc.text(date, 290, 10, { "align": "right" });

  //     var img = new Image();
  //     img.src = '../../assets/images/MHP.png';
  //     doc.addImage(img, 'png', 250, 15, 30, 30);

  //     doc.setFontSize(14);
  //     var ministry = "وزارة الصحة والسكان";
  //     doc.text(ministry, 240, 25, { "align": "right" });

  //     doc.setFontSize(14);
  //     var hospital = this.currentUser.hospitalNameAr;
  //     doc.text(hospital, 240, 35, { "align": "right" });

  //     doc.text("استبعادات المستشفى", pageWidth / 2, 45, { align: 'center' });


  //     doc.setFontSize(15);
  //     if ((this.searchObj.strStartDate != "") && (this.searchObj.strEndDate != ""))
  //       doc.text(" بحث عن فترة  : " + new Intl.DateTimeFormat("ar-EG", options).format(new Date(this.searchObj.startDate)) + " - " + new Intl.DateTimeFormat("ar-EG", options).format(new Date(this.searchObj.endDate)), pageWidth / 2, 55, { align: 'center' });

  //     else if ((this.searchObj.strStartDate != "") && (this.searchObj.strEndDate == "")) {

  //       var end = new Intl.DateTimeFormat("ar-EG", options).format(new Date());
  //       doc.text(" بحث عن فترة  : " + new Intl.DateTimeFormat("ar-EG", options).format(new Date(this.searchObj.startDate)) + " - " + end, pageWidth / 2, 55, { align: 'center' });
  //     }

  //     else if ((this.searchObj.strStartDate == "") && (this.searchObj.strEndDate != "")) {

  //       var start = new Intl.DateTimeFormat("ar-EG", options).format(new Date("01/01/1900 00:00:00"));
  //       doc.text(" بحث عن فترة  : " + start + " - " + new Intl.DateTimeFormat("ar-EG", options).format(new Date(this.searchObj.endDate)), pageWidth / 2, 55, { align: 'center' });
  //     }
  //     const col = [
  //       {
  //         content: 'الأسباب',
  //         styles: { fontStyle: 'Amiri-Regular', columnWidth: 20 },
  //       },
  //       {
  //         content: 'تاريخ الاستبعاد',
  //         styles: { fontStyle: 'Amiri-Regular' },
  //       },
  //       {
  //         content: 'الحالة',
  //         styles: { fontStyle: 'Amiri-Regular' },
  //       },
  //       {
  //         content: 'التاريخ',
  //         styles: { fontStyle: 'Amiri-Regular' },
  //       },
  //       {
  //         content: "رقم طلب الاستبعاد",
  //         styles: { fontStyle: 'Amiri-Regular' },
  //       },
  //       {
  //         content: "حالة المشكلة",
  //         styles: { fontStyle: 'Amiri-Regular' },
  //       },
  //       {
  //         content: "اسم الأصل",
  //         styles: { fontStyle: 'Amiri-Regular' },
  //       }
  //     ];
  //     var rows = [];
  //     var row = [];
  //     if (this.lstHospitalApplications != null) {
  //       for (let index = 0; index < this.lstHospitalApplications.length; index++) {
  //         const element = this.lstHospitalApplications[index];


  //         var appDate = new Intl.DateTimeFormat("ar-EG", options).format(new Date(element.date));
  //         if (element.execludeDate != "")
  //           var dueDate = new Intl.DateTimeFormat("ar-EG", options).format(new Date(element.execludeDate));

  //         if (element.appTypeId == 1)
  //           row = [element.reasonExTitlesAr, dueDate, element.statusNameAr, appDate, element.exNumber, element.typeNameAr, element.assetNameAr];
  //         if (element.appTypeId == 2)
  //           row = [element.reasonHoldTitlesAr, dueDate, element.statusNameAr, appDate, element.exNumber, element.typeNameAr, element.assetNameAr];

  //         rows.push(row);
  //       }
  //       (doc as any).autoTable(col, rows, {
  //         startY: 65, styles: {
  //           font: 'Amiri-Regular', halign: 'right'
  //         },
  //         columnStyles: {
  //           0: {
  //             cellWidth: 35,
  //           },
  //           1: {
  //             cellWidth: 30
  //           },
  //           2: {
  //             cellWidth: 30
  //           },
  //           3: {
  //             cellWidth: 30
  //           },
  //           4: {
  //             cellWidth: 30
  //           },
  //           5: {
  //             cellWidth: 40
  //           },
  //           6: {
  //             cellWidth: 40
  //           }
  //         }
  //       });
  //     }
  //   }
  //   if (this.lang == "en") {
  //     this.exportEnglishPdf();
  //   }
  //   var exportdate = this.datePipe.transform(new Date, "dd-MM-yyyy_HH:mm:ss");
  //   doc.save('ArSearchByDate_' + exportdate + '.pdf');
  // }

  // exportEnglishPdf() {

  //   var lstImages = [];
  //   var rows = [];
  //   var row = [];
  //   var doc = new jspdf('l', 'mm', 'a4');
  //   var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();


  //   doc.setFontSize(10);
  //   var date = "Date : " + this.datePipe.transform(new Date(), "dd/MM/yyyy");
  //   doc.text(date, 10, 10);

  //   var img = new Image();
  //   img.src = '../../assets/images/MHP.png';
  //   doc.addImage(img, 'png', 20, 15, 30, 30);

  //   doc.setFontSize(14);
  //   var ministry = "Ministry of Health and Communications";
  //   doc.text(ministry, 50, 25);

  //   doc.setFontSize(14);
  //   var hospital = this.currentUser.hospitalName;
  //   doc.text(hospital, 50, 35);

  //   doc.text("Hospital Excludes", pageWidth / 2, 45, { align: 'center' });


  //   doc.setFontSize(15);
  //   if ((this.searchObj.strStartDate != "") && (this.searchObj.strEndDate != ""))
  //     doc.text("Search with in  : " + this.datePipe.transform(new Date(this.searchObj.startDate), "dd/MM/yyyy") + " - " + this.datePipe.transform(new Date(this.searchObj.endDate), "dd/MM/yyyy"), pageWidth / 2, 55, { align: 'center' });

  //   else if ((this.searchObj.strStartDate != "") && (this.searchObj.strEndDate == "")) {

  //     var end = this.datePipe.transform(new Date(), "dd/MM/yyyy");
  //     doc.text("Search with in  : " + this.datePipe.transform(new Date(this.searchObj.startDate), "dd/MM/yyyy") + " - " + end, pageWidth / 2, 55, { align: 'center' });
  //   }

  //   else if ((this.searchObj.strStartDate == "") && (this.searchObj.strEndDate != "")) {

  //     var start = this.datePipe.transform(new Date("01/01/1900 00:00:00"), "dd/MM/yyyy");
  //     doc.text("Search with in  : " + start + " - " + this.datePipe.transform(new Date(this.searchObj.endDate), "dd/MM/yyyy"), pageWidth / 2, 55, { align: 'center' });
  //   }
  //   const col = ["Asset Name", "Type", "App Number", "Date", "Status", "Due Date", "Reasons"];


  //   if (this.lstHospitalApplications != null) {
  //     for (let index = 0; index < this.lstHospitalApplications.length; index++) {
  //       const element = this.lstHospitalApplications[index];

  //       var appDate = this.datePipe.transform(new Date(element.date), 'dd/MM/yyyy');
  //       var dueDate = this.datePipe.transform(new Date(element.dueDate), 'dd/MM/yyyy');

  //       if (element.appTypeId == 1)
  //         row = [element.assetName, element.typeName, element.appNumber, appDate.trim(), element.statusName, dueDate.trim(), element.reasonExTitles];
  //       if (element.appTypeId == 2)
  //         row = [element.assetName, element.typeName, element.appNumber, appDate.trim(), element.statusName, dueDate.trim(), element.reasonHoldTitles];

  //       rows.push(row);
  //     }

  //     (doc as any).autoTable(col, rows, {
  //       startY: 65, styles: {}
  //     });
  //   }

  //   var exportdate = this.datePipe.transform(new Date, "dd-MM-yyyy_HH:mm:ss");
  //   doc.save('EnSearchByDate_' + exportdate + '.pdf');
  // }


}
