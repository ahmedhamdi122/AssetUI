import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { EditOriginVM, ListOriginVM, SortOriginVM } from 'src/app/Shared/Models/originVM';
import { Paging } from 'src/app/Shared/Models/paging';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { OriginService } from 'src/app/Shared/Services/origin.service';
import { DeleteOriginsConfirmationComponent } from '../delete-origins-confirmation/delete-origins-confirmation.component';
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { Workbook } from 'exceljs';
import { DatePipe } from '@angular/common';
import * as fs from 'file-saver';
import { environment } from 'src/environments/environment';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  lang = localStorage.getItem("lang");
  originsList: ListOriginVM[] = [];
  allOrigins: ListOriginVM[] = [];
  selectedObj: EditOriginVM;
  page: Paging;
  currentUser: LoggedUser;
  count: number;
  loading: boolean = true;
  sortStatus: string = "ascending";
  sortObj: SortOriginVM;

  constructor(private authenticationService: AuthenticationService, private originService: OriginService,
    private dialog: MatDialog, public dialogService: DialogService, private datePipe: DatePipe, private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute,
    private route: Router) { this.currentUser = this.authenticationService.currentUserValue; }


  ngOnInit(): void {


    const translationKeys = ['Asset.Assets', 'Asset.Origins']; // Array of translation keys
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);

    this.page = {
      pagenumber: 1,
      pagesize: 10,
    }
    this.sortObj = {
      sortStatus: '', name: '', nameAr: '', code: '', id: 0
    }
    this.originService.GetOriginsWithPaging(this.page).subscribe(data => {
      this.originsList = data;
      this.loading = false;
    });
    this.originService.getCount().subscribe((data) => {
      this.count = data;
    });


    this.originService.GetOrigins().subscribe(data => {
      this.allOrigins = data;
    });
  }

  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;
    this.originService.GetOriginsWithPaging(this.page).subscribe((items) => {
      this.originsList = items;
      this.loading = false;
    });
  }


  addOrigin() {
    const dialogRef2 = this.dialogService.open(CreateComponent, {
      header: this.lang == "en" ? 'Add Origin' : "إضافة بلد المنشأ",
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
  editOrigin(id: number) {
    const ref = this.dialogService.open(EditComponent, {
      header: this.lang == "en" ? 'Edit  Origin' : "تعديل بلد المنشأ",
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

  deleteOrigin(id: number) {

    this.originService.GetOriginById(id).subscribe((data) => {
      this.selectedObj = data;

      const orgDialog = this.dialog
        .open(DeleteOriginsConfirmationComponent, {
          width: '30%',
          autoFocus: true,
          data: {
            id: this.selectedObj.id,
            name: this.selectedObj.name,
            nameAr: this.selectedObj.nameAr
          },
        });

    });

    this.route.navigate(['/dash/origins']);
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
      this.sortObj.name = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "الاسم") {
      this.sortObj.nameAr = field.currentTarget.id;
    }
    if (field.currentTarget.id == "Code" || field.currentTarget.id == "الكود") {
      this.sortObj.code = field.currentTarget.id;
    }


    this.originService.SortOrigins(this.page.pagenumber, this.page.pagesize, this.sortObj).subscribe(data => {
      this.originsList = data;
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
      this.allOrigins.forEach(e => {
        worksheet.addRow({
          code: e.code,
          name: e.name,
          nameAr: e.nameAr
        }, "n");
      });
      workbook.xlsx.writeBuffer().then((lstOrigins) => {
        let blob = new Blob([lstOrigins], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
        fs.saveAs(blob, 'Origins_' + today + '.xlsx');
      });
    }
    else {
      worksheet.columns = [
        { header: 'الكود', key: 'code', width: 50 },
        { header: 'الاسم', key: 'name', width: 15 },
        { header: 'الاسم بالعربي', key: 'nameAr', width: 20 }
      ];
      this.allOrigins.forEach(e => {
        worksheet.addRow({
          code: e.code,
          name: e.name,
          nameAr: e.nameAr
        }, "n");
      });
      workbook.xlsx.writeBuffer().then((lstOrigins) => {
        let blob = new Blob([lstOrigins], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
        fs.saveAs(blob, 'Origins_' + today + '.xlsx');
      });
    }
  }
  exportPDF() {
    this.originService.CreateOriginPDF(this.lang).subscribe(list => {
      this.originsList = list;
      let fileName = "OriginList.pdf";
      var filePath = `${environment.Domain}UploadedAttachments/OriginPDF/`;
      this.originService.downloadOriginPDF(fileName).subscribe(file => {
        var dwnldFile = filePath + fileName;
        if (fileName != "" || fileName != null)
          window.open(dwnldFile);
        this.originService.GetOriginsWithPaging(this.page).subscribe(data => {
          this.originsList = data;
          this.loading = false;
        });
        this.originService.getCount().subscribe((data) => {
          this.count = data;
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
