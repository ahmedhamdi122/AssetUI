import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { Paging } from 'src/app/Shared/Models/paging';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { EditWorkOrderStatusVM, ListWorkOrderStatusVM, SortWOStatusVM } from 'src/app/Shared/Models/WorkOrderStatusVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { WorkOrderStatusService } from 'src/app/Shared/Services/work-order-status.service';
import { DeleteworkOrderStatusConfirmationComponent } from '../deletework-order-status-confirmation/deletework-order-status-confirmation.component';
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
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
  workorederstatusList: ListWorkOrderStatusVM[] = []
  selectedObj: EditWorkOrderStatusVM;
  textDir: string = 'ltr';
  currentUser: LoggedUser;
  page: Paging;
  count: number;
  loading: boolean = true;

  sortStatus: string = "ascending";
  sortObj: SortWOStatusVM;


  constructor(private authenticationService: AuthenticationService, private workorerstatusService: WorkOrderStatusService, private datePipe: DatePipe,
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

    this.workorerstatusService.GetWorkOrderStatusesWithPaging(this.page).subscribe(data => {
      this.workorederstatusList = data;
      this.loading = false;
    });

    this.workorerstatusService.CountWorkOrderStatuses().subscribe(total => {
      this.count = total;
    });


    const translationKeys = ['Asset.Maintainance', 'Asset.WorkOrderStatus']; // Array of translation keys
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);
  }
  deleteBrand(id: number) {

    this.workorerstatusService.GetWorkOrderStatusById(id).subscribe((data) => {
      this.selectedObj = data;

      const woDialog = this.dialog
        .open(DeleteworkOrderStatusConfirmationComponent, {
          width: '30%',
          autoFocus: true,
          data: {
            id: this.selectedObj.id,
            name: this.lang === "en" ? this.selectedObj.name : this.selectedObj.nameAr
          },
        });
      woDialog.afterClosed().subscribe(result => {
        this.reload();
      });
    });

  }

  addWorkOrderStatus() {
    const dialogRef2 = this.dialogService.open(CreateComponent, {
      header: this.lang == "en" ? 'Add WorkOrder Type' : "إضافة حالة أمر الشغل",
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
  editWorkOrderStatus(id: number) {
    const ref = this.dialogService.open(EditComponent, {
      header: this.lang == "en" ? 'Edit  WorkOrder Type' : "تعديل حالة أمر الشغل",
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
    this.workorerstatusService.GetWorkOrderStatusesWithPaging(this.page).subscribe(data => {
      this.workorederstatusList = data;
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

    this.workorerstatusService.sortWorkOrderStatuses(this.page.pagenumber, this.page.pagesize, this.sortObj).subscribe(data => {
      this.workorederstatusList = data;
      this.sortStatus = this.sortObj.sortStatus;
      this.sortObj = {
        sortStatus: '', name: '', nameAr: '', code: '', id: 0
      }
    })
  }

  reload() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }


  exportExcel() {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('WorkOrder Status');
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

    this.workorederstatusList.forEach(e => {
      worksheet.addRow({
        code: e.code,
        name: e.name,
        nameAr: e.nameAr
      }, "n");
    });
    workbook.xlsx.writeBuffer().then((lstExportHospitalAssets) => {
      let blob = new Blob([lstExportHospitalAssets], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
      fs.saveAs(blob, 'WorkOrderStatus' + today + '.xlsx');
    });
  }
  exportPDF() {
    this.workorerstatusService.CreateWorkOrderStatusPDF(this.lang).subscribe(list => {
      this.workorederstatusList = list;
      let fileName = "WOStatusList.pdf";
      var filePath = `${environment.Domain}UploadedAttachments/`;
      this.workorerstatusService.downloadWorkOrderStatusPDF(fileName).subscribe(file => {
        var dwnldFile = filePath + fileName;
        if (fileName != "" || fileName != null)
          window.open(dwnldFile);
        this.workorerstatusService.GetWorkOrderStatusesWithPaging(this.page).subscribe(data => {
          this.workorederstatusList = data;
        });
      });
    });
  }
}
