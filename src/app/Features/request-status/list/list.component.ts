import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Paging } from 'src/app/Shared/Models/paging';
import { IndexRequestStatus, SortRequestStatusesVM } from 'src/app/Shared/Models/RequestStatusVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { RequestStatusService } from 'src/app/Shared/Services/request-status.service';
import { DeleteRequestStatusConfirmationComponent } from '../delete-request-status-confirmation/delete-request-status-confirmation.component';
import { EditComponent } from '../edit/edit.component';
import { CreateComponent } from '../create/create.component';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';
import { Workbook } from 'exceljs';
import { DatePipe } from '@angular/common';
import * as fs from 'file-saver';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  lang = localStorage.getItem("lang");
  requestStatusList: IndexRequestStatus[] = []
  selectedObj: IndexRequestStatus;
  textDir: string = 'ltr';
  currentUser: LoggedUser;
  page: Paging;
  count: number;
  loading: boolean = true;
  sortStatus: string = "ascending";
  sortObj: SortRequestStatusesVM;

  constructor(private authenticationService: AuthenticationService, private reqStatusServie: RequestStatusService, private datePipe: DatePipe,
    private dialog: MatDialog, public dialogService: DialogService, private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute,
    private route: Router) { this.currentUser = this.authenticationService.currentUserValue; }


  ngOnInit(): void {
    this.page = {
      pagenumber: 1,
      pagesize: 10,
    };

    this.sortObj = {
      sortStatus: '', name: '', nameAr: '', code: '', id: 0
    }
    const translationKeys = ['Asset.Maintainance', 'Asset.RequestStatus']; // Array of translation keys
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);


    this.reqStatusServie.GetRequestStatusesWithPaging(this.page).subscribe(data => {
      this.requestStatusList = data;
      this.loading = false;
    });

    this.reqStatusServie.CountRequestStatuses().subscribe(total => {
      this.count = total;
    });
  }
  deleteRequestStatus(id: number) {

    this.reqStatusServie.GetRequestStatusById(id).subscribe((data) => {
      this.selectedObj = data;

      const reqStatusDialog = this.dialog
        .open(DeleteRequestStatusConfirmationComponent, {
          width: '30%',
          autoFocus: true,
          data: {
            id: this.selectedObj.id,
            name: this.lang === "en" ? this.selectedObj.name : this.selectedObj.nameAr
          },
        });

      reqStatusDialog.afterClosed().subscribe(deleted => {
        this.reload();
      });


    });


  }
  addRequestStatus() {
    const dialogRef2 = this.dialogService.open(CreateComponent, {
      header: this.lang == "en" ? 'Add Request Type' : "إضافة حالة بلاغ عطل",
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
  editRequestStatus(id: number) {
    const ref = this.dialogService.open(EditComponent, {
      header: this.lang == "en" ? 'Edit  Request Type' : "تعديل حالة بلاغ عطل",
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
  reload() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }
  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;

    this.reqStatusServie.GetRequestStatusesWithPaging(this.page).subscribe(data => {
      this.requestStatusList = data;
      this.loading = false;
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


    this.reqStatusServie.sortRequestStatuses(this.page.pagenumber, this.page.pagesize, this.sortObj).subscribe(data => {
      this.requestStatusList = data;
      this.loading = false;

      this.sortStatus = this.sortObj.sortStatus;
      this.sortObj = {
        sortStatus: '', name: '', nameAr: '', code: '', id: 0
      }
    });


  }
  exportExcel() {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Assets Statuses');
    if (this.lang == "en") {
      worksheet.columns = [
        { header: 'name', key: 'name', width: 30 },
        { header: 'nameAr', key: 'nameAr', width: 30 },
        { header: 'Icon', key: 'icon', width: 30 },
        { header: 'Color', key: 'color', width: 30 }
      ];
    }
    else {
      worksheet.columns = [

        { header: 'الاسم', key: 'name', width: 30 },
        { header: 'الاسم بالعربي', key: 'nameAr', width: 30 },
        { header: 'الأيقون', key: 'icon', width: 30 },
        { header: 'اللون', key: 'color', width: 30 }
      ];
    }

    this.requestStatusList.forEach(e => {
      worksheet.addRow({
        name: e.name,
        nameAr: e.nameAr,
        icon: e.icon,
        code: e.color
      }, "n");
    });
    workbook.xlsx.writeBuffer().then((lstExportHospitalAssets) => {
      let blob = new Blob([lstExportHospitalAssets], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
      fs.saveAs(blob, 'AssetStatus' + today + '.xlsx');
    });
  }
  exportPDF() {
    this.reqStatusServie.CreateRequestStatusPDF(this.lang).subscribe(list => {
      this.requestStatusList = list;
      let fileName = "RequestStatusList.pdf";
      var filePath = `${environment.Domain}UploadedAttachments/RequestStatus/`;
      this.reqStatusServie.downloadRequestStatusPDF(fileName).subscribe(file => {
        var dwnldFile = filePath + fileName;
        if (fileName != "" || fileName != null)
          window.open(dwnldFile);
        this.reqStatusServie.GetRequestStatusesWithPaging(this.page).subscribe(data => {
          this.requestStatusList = data;
          this.loading = false;
        });
      });
    });
  }
}
