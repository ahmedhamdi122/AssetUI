import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Paging } from 'src/app/Shared/Models/paging';
import { EditRequestTypeVM, IndexRequestTypeVM, SortRequestTypeVM } from 'src/app/Shared/Models/ProjectTypeVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { RequestTypeService } from 'src/app/Shared/Services/request-type.service';
import { DeleteRequestTypesConfirmationComponent } from '../delete-request-types-confirmation/delete-request-types-confirmation.component';
import { EditComponent } from '../edit/edit.component';
import { CreateComponent } from '../create/create.component';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';
import { Workbook } from 'exceljs';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import * as fs from 'file-saver';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  lang = localStorage.getItem("lang");
  reqTypesList: IndexRequestTypeVM[] = []
  selectedObj: EditRequestTypeVM;
  currentUser: LoggedUser;

  page: Paging;
  count: number;
  loading: boolean = true;
  sortStatus: string = "ascending";
  sortObj: SortRequestTypeVM;
  constructor(private authenticationService: AuthenticationService, private reqTypeService: RequestTypeService,
    private datePipe: DatePipe, private dialog: MatDialog, public dialogService: DialogService, private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute,
    private route: Router) { this.currentUser = this.authenticationService.currentUserValue; }


  ngOnInit(): void {

    this.page = {
      pagenumber: 1,
      pagesize: 10,
    };
    this.sortObj = {
      sortStatus: '', name: '', nameAr: '', code: '', id: 0
    }

    const translationKeys = ['Asset.Maintainance', 'Asset.requestTypes']; // Array of translation keys
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);

    this.reqTypeService.GetAllRequestTypes().subscribe(data => {
      this.reqTypesList = data;
      this.loading = false;
    });

    this.reqTypeService.CountRequestTypes().subscribe((data) => {
      this.count = data;
    });
  }
  deleteRequestType(id: number) {

    this.reqTypeService.GetRequestTypeById(id).subscribe((data) => {
      this.selectedObj = data;
      const reqTypeDialog = this.dialog
        .open(DeleteRequestTypesConfirmationComponent, {
          width: '50%',
          autoFocus: true,
          data: {
            id: this.selectedObj.id,
            name: this.lang === "en" ? this.selectedObj.name : this.selectedObj.nameAr
          },
        });
      reqTypeDialog.afterClosed().subscribe(result => {
        this.reload();
      });
    });
  }

  addRequestType() {
    const dialogRef2 = this.dialogService.open(CreateComponent, {
      header: this.lang == "en" ? 'Add Request Type' : "إضافة نوع بلاغ عطل",
      width: '50%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });
    dialogRef2.onClose.subscribe((res) => {
      this.reload();
    });
  }
  editRequestType(id: number) {
    const ref = this.dialogService.open(EditComponent, {
      header: this.lang == "en" ? 'Edit  Request Type' : "تعديل نوع بلاغ عطل",
      width: '50%',
      data: {
        id: id
      },
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });
    ref.onClose.subscribe((page) => {
      this.reload();
    });
  }


  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;
    this.reqTypeService.GetRequestTypesWithPaging(this.page).subscribe((items) => {
      this.reqTypesList = items;
    });
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

    if (field.currentTarget.id == "Name") {
      this.sortObj.name = field.currentTarget.id
    }
    else if (field.currentTarget.id == "الاسم") {
      this.sortObj.nameAr = field.currentTarget.id
    }

    if (field.currentTarget.id == "Code") {
      this.sortObj.code = field.currentTarget.id
    }
    else if (field.currentTarget.id == "الكود") {
      this.sortObj.code = field.currentTarget.id
    }

    this.reqTypeService.SortRequestTypes(this.page.pagenumber, this.page.pagesize, this.sortObj).subscribe(data => {
      this.reqTypesList = data;
      this.sortStatus = this.sortObj.sortStatus;
      this.sortObj = {
        sortStatus: '', name: '', nameAr: '', code: '', id: 0
      }
    });
  }

  reload() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }

  exportExcel() {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Request Types');
    if (this.lang == "en") {
      worksheet.columns = [
        { header: 'Code', key: 'code', width: 30 },
        { header: 'name', key: 'name', width: 30 },
        { header: 'nameAr', key: 'nameAr', width: 30 }
      ];
    }
    else {
      worksheet.columns = [
        { header: 'الكود', key: 'code', width: 30 },
        { header: 'الاسم', key: 'name', width: 30 },
        { header: 'الاسم بالعربي', key: 'nameAr', width: 30 }
      ];
    }

    this.reqTypesList.forEach(e => {
      worksheet.addRow({
        code: e.code,
        name: e.name,
        nameAr: e.nameAr
      }, "n");
    });
    workbook.xlsx.writeBuffer().then((lstExportHospitalAssets) => {
      let blob = new Blob([lstExportHospitalAssets], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
      fs.saveAs(blob, 'RequestType' + today + '.xlsx');
    });
  }
  exportPDF() {
    this.reqTypeService.CreateRequestTypePDF(this.lang).subscribe(list => {
      this.reqTypesList = list;
      let fileName = "RequestTypesList.pdf";
      var filePath = `${environment.Domain}UploadedAttachments/RequestTypes/`;
      this.reqTypeService.downloadRequestTypePDF(fileName).subscribe(file => {
        var dwnldFile = filePath + fileName;
        if (fileName != "" || fileName != null)
          window.open(dwnldFile);
        this.reqTypeService.GetRequestTypesWithPaging(this.page).subscribe((items) => {
          this.reqTypesList = items;
        });
      });
    });
  }

}
