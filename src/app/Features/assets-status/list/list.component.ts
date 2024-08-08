import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { EditAssetStatusVM, ListAssetStatusVM, SortAssetStatusVM } from 'src/app/Shared/Models/assetStatusVM';
import { Paging } from 'src/app/Shared/Models/paging';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AssetStatusService } from 'src/app/Shared/Services/assetStatus.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { DeleteAssetsStatusConfirmationComponent } from '../delete-assets-status-confirmation/delete-assets-status-confirmation.component';
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import * as fs from 'file-saver';
import { Workbook } from 'exceljs';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  lang = localStorage.getItem("lang");
  AssetsStatusList: ListAssetStatusVM[] = []
  selectedObj: EditAssetStatusVM;
  currentUser: LoggedUser;
  page: Paging;
  count: number;
  loading: boolean = true;
  sortStatus: string = "ascending";
  sortObj: SortAssetStatusVM;
  display: boolean = false;

  constructor(private authenticationService: AuthenticationService, private assetStatusService: AssetStatusService,
    private dialog: MatDialog, public dialogService: DialogService, private datePipe: DatePipe, private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute,
    private route: Router) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {

    const translationKeys = ['Asset.Assets', 'Asset.AssetStatus']; // Array of translation keys
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);


    this.page = {
      pagenumber: 1,
      pagesize: 10,
    }
    this.sortObj = {
      sortStatus: '', name: '', nameAr: '', code: '', id: 0
    }

  }
  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;
    this.assetStatusService.GetAssetStatusWithPaging(this.page).subscribe(data => {
      this.AssetsStatusList = data;
      this.loading = true;
    });
    this.assetStatusService.GetAssetStatusCount().subscribe(countStatus => {
      this.count = countStatus;
    });
  }
  deleteAssetStatus(id: number) {
    this.assetStatusService.GetAssetStatusById(id).subscribe((data) => {
      this.selectedObj = data;
      const assetStatusDialog = this.dialog
        .open(DeleteAssetsStatusConfirmationComponent, {
          width: '30%',
          autoFocus: true,
          data: {
            id: this.selectedObj.id,
            name: this.selectedObj.name,
            nameAr: this.selectedObj.nameAr
          },
        });
      assetStatusDialog.afterClosed().subscribe(deleted => {
        this.reload();
      });
    });
  }
  addAssetStatus() {
    const dialogRef2 = this.dialogService.open(CreateComponent, {
      header: this.lang == "en" ? 'Add Asset Status' : "إضافة  حالة الأصل ",
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
  editAssetStatus(id: number) {
    const ref = this.dialogService.open(EditComponent, {
      header: this.lang == "en" ? 'Edit Asset Status' : "تعديل  حالة الأصل ",
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
    if (field.currentTarget.id == "Code" || field.currentTarget.id == "الكود") {
      this.sortObj.code = field.currentTarget.id
    }


    this.assetStatusService.SortAssetStatuses(this.page.pagenumber, this.page.pagesize, this.sortObj).subscribe(data => {
      this.AssetsStatusList = data;
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
        { header: 'Code', key: 'code' },
        { header: 'name', key: 'name' },
        { header: 'nameAr', key: 'nameAr' }
      ];
    }
    else {
      worksheet.columns = [
        { header: 'الكود', key: 'code', width: 50 },
        { header: 'الاسم', key: 'name', width: 15 },
        { header: 'الاسم بالعربي', key: 'nameAr', width: 20 }
      ];
    }

    this.AssetsStatusList.forEach(e => {
      worksheet.addRow({
        code: e.code,
        name: e.name,
        nameAr: e.nameAr
      }, "n");
    });
    workbook.xlsx.writeBuffer().then((lstExportHospitalAssets) => {
      let blob = new Blob([lstExportHospitalAssets], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
      fs.saveAs(blob, 'AssetStatus' + today + '.xlsx');
    });
  }
  exportPDF() {
    this.assetStatusService.CreateAssetStatusPDF(this.lang).subscribe(list => {
      this.AssetsStatusList = list;
      let fileName = "AssetStatusList.pdf";
      var filePath = `${environment.Domain}UploadedAttachments/AssetStatus/`;
      this.assetStatusService.downloadAssetStatusPDF(fileName).subscribe(file => {
        var dwnldFile = filePath + fileName;
        if (fileName != "" || fileName != null)
          window.open(dwnldFile);
        this.assetStatusService.GetAssetStatusWithPaging(this.page).subscribe(data => {
          this.AssetsStatusList = data;
          this.loading = true;
        });
      });
    });
  }
  reload() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }
}

