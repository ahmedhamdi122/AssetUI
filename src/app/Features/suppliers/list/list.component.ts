import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { Paging } from 'src/app/Shared/Models/paging';
import { EditSupplierVM, ListSupplierVM, SortSupplierVM } from 'src/app/Shared/Models/supplierVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { SupplierService } from 'src/app/Shared/Services/supplierService.service';
import { DeletesupplierConfirmationComponent } from '../deletesupplier-confirmation/deletesupplier-confirmation.component';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { environment } from 'src/environments/environment';
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ViewComponent } from '../view/view.component';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';
// import { ListComponent } from 'src/app/Features/hospital-assets/list/list.component';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  lang = localStorage.getItem("lang");
  suppliersList: ListSupplierVM[] = [];
  allSuppliers: ListSupplierVM[] = [];
  selectedObj: EditSupplierVM;
  page: Paging;
  currentUser: LoggedUser;
  count: number;
  loading: boolean = true;

  sortStatus: string = "descending";
  sortObj: SortSupplierVM;


  lstSupplierIds: number[] = [];
  lstCheckedSuppliers: ListSupplierVM[] = [];
  checkedSupplier: ListSupplierVM;
  constructor(private authenticationService: AuthenticationService, private supplierService: SupplierService,
    private dialog: MatDialog, public dialogService: DialogService, private datePipe: DatePipe, private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute,
    private route: Router, private ngxService: NgxUiLoaderService) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {


    const translationKeys = ['Asset.Assets', 'Asset.Suppliers']; // Array of translation keys
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);
    this.page = {
      pagenumber: 1,
      pagesize: 10,
    };
    this.sortObj = {
      sortStatus: '', name: '', nameAr: '', code: '', id: 0, address: '', addressAr: '', contactPerson: '', email: '', mobile: ''
    }
  }
  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;


    this.supplierService.GetAllSuppliersWithPaging(this.page.pagenumber, this.page.pagesize).subscribe((items) => {
      this.suppliersList = items.results;
      this.count = items.count;
      this.loading = false;
    });

    this.supplierService.GetSuppliers().subscribe(all => {
      this.allSuppliers = all;
    })
  }
  addSupplier() {
    const dialogRef2 = this.dialogService.open(CreateComponent, {
      header: this.lang == "en" ? 'Add Supplier' : "إضافة مورد",
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
  editSupplier(id: number) {
    const ref = this.dialogService.open(EditComponent, {
      header: this.lang == "en" ? 'Edit Supplier' : "تعديل مورد ",
      width: '50%', data: {
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
  viewSupplier(id: number) {
    const ref = this.dialogService.open(ViewComponent, {
      header: this.lang == "en" ? 'Edit Supplier' : "بيان المورد ",
      width: '50%', data: {
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
  deleteSupplier(id: number) {

    this.supplierService.GetSupplierById(id).subscribe((data) => {
      this.selectedObj = data;

      const supplierDialog = this.dialog
        .open(DeletesupplierConfirmationComponent, {
          width: '30%',
          autoFocus: true,
          data: {
            id: this.selectedObj.id,
            name: this.selectedObj.name,
            nameAr: this.selectedObj.nameAr
          },
        });

      supplierDialog.afterClosed().subscribe(result => {
        let currentUrl = this.route.url;
        this.route.routeReuseStrategy.shouldReuseRoute = () => false;
        this.route.onSameUrlNavigation = 'reload';
        this.route.navigate([currentUrl]);
      });

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
      this.sortObj.name = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "الاسم") {
      this.sortObj.nameAr = field.currentTarget.id;
    }
    if (field.currentTarget.id == "Code" || field.currentTarget.id == "الكود") {
      this.sortObj.code = field.currentTarget.id;
    }


    if (field.currentTarget.id == "Mobile" || field.currentTarget.id == "المحمول") {
      this.sortObj.mobile = field.currentTarget.id;
    }


    if (field.currentTarget.id == "Address") {
      this.sortObj.address = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "العنوان") {
      this.sortObj.addressAr = field.currentTarget.id;
    }

    if (field.currentTarget.id == "EMail") {
      this.sortObj.email = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "البريد الإلكتروني") {
      this.sortObj.email = field.currentTarget.id
    }
    if (field.currentTarget.id == "Contact Person") {
      this.sortObj.contactPerson = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "التواصل") {
      this.sortObj.contactPerson = field.currentTarget.id;
    }
    this.supplierService.sortSuppliers(this.page.pagenumber, this.page.pagesize, this.sortObj).subscribe(data => {
      this.suppliersList = data;
      this.sortStatus = this.sortObj.sortStatus;
      this.sortObj = {
        sortStatus: '', name: '', nameAr: '', code: '', id: 0, address: '', addressAr: '', contactPerson: '', email: '', mobile: ''
      }
    })
  }
  exportExcel() {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Suppliers');
    if (this.lstCheckedSuppliers.length == 0) {
      if (this.lang == "en") {
        worksheet.columns = [
          { header: 'Code', key: 'code', width: 15 },
          { header: 'name', key: 'name', width: 25 },
          { header: 'nameAr', key: 'nameAr', width: 25 },
          { header: 'Mobile', key: 'mobile', width: 15 },
          { header: 'WebSite', key: 'website', width: 15 },
          { header: 'E-Mail', key: 'eMail', width: 15 },
          { header: 'Address', key: 'address', width: 15 },
          { header: 'Arabic Address', key: 'addressAr', width: 15 },
          { header: 'ContactPerson', key: 'contactPerson', width: 15 },
          { header: 'Fax', key: 'fax', width: 15 },
          { header: 'Notes', key: 'notes', width: 15 }
        ];
        this.allSuppliers.forEach(e => {
          worksheet.addRow({
            code: e.code,
            name: e.name,
            nameAr: e.nameAr,
            mobile: e.mobile,
            website: e.website,
            email: e.eMail,
            address: e.address,
            addressAr: e.addressAr,
            contactPerson: e.contactPerson,
            notes: e.notes,
            fax: e.fax
          }, "n");
        });
        workbook.xlsx.writeBuffer().then((lstSuppliers) => {
          let blob = new Blob([lstSuppliers], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
          fs.saveAs(blob, 'Suppliers_' + today + '.xlsx');
        });
      }
      else {
        worksheet.columns = [
          { header: 'الكود', key: 'code', width: 20 },
          { header: 'الاسم', key: 'name', width: 25 },
          { header: 'الاسم بالعربي', key: 'nameAr', width: 25 },
          { header: 'المحمول', key: 'mobile', width: 15 },
          { header: 'الموقع الالكتروني', key: 'website', width: 15 },
          { header: 'البريد الالكتروني', key: 'eMail', width: 15 },
          { header: 'العنوان', key: 'address', width: 15 },
          { header: 'العنوان بالعربي', key: 'addressAr', width: 15 },
          { header: 'الاتصال ب', key: 'contactPerson', width: 15 },
          { header: 'فاكس', key: 'fax', width: 15 },
          { header: 'ملاحظات', key: 'notes', width: 15 }
        ];
        this.allSuppliers.forEach(e => {
          worksheet.addRow({
            code: e.code,
            name: e.name,
            nameAr: e.nameAr,
            mobile: e.mobile,
            website: e.website,
            email: e.eMail,
            address: e.address,
            addressAr: e.addressAr,
            contactPerson: e.contactPerson,
            notes: e.notes,
            fax: e.fax
          }, "n");
        });
        workbook.xlsx.writeBuffer().then((lstSuppliers) => {
          let blob = new Blob([lstSuppliers], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
          fs.saveAs(blob, 'Suppliers_' + today + '.xlsx');
        });
      }
    }

    else if (this.lstCheckedSuppliers.length > 0) {
      if (this.lang == "en") {
        worksheet.columns = [
          { header: 'Code', key: 'code', width: 15 },
          { header: 'name', key: 'name', width: 25 },
          { header: 'nameAr', key: 'nameAr', width: 25 },
          { header: 'Mobile', key: 'mobile', width: 15 },
          { header: 'WebSite', key: 'website', width: 15 },
          { header: 'E-Mail', key: 'eMail', width: 15 },
          { header: 'Address', key: 'address', width: 15 },
          { header: 'Arabic Address', key: 'addressAr', width: 15 },
          { header: 'ContactPerson', key: 'contactPerson', width: 15 },
          { header: 'Fax', key: 'fax', width: 15 },
          { header: 'Notes', key: 'notes', width: 15 }
        ];
      }
      else {
        worksheet.columns = [
          { header: 'الكود', key: 'code', width: 20 },
          { header: 'الاسم', key: 'name', width: 25 },
          { header: 'الاسم بالعربي', key: 'nameAr', width: 25 },
          { header: 'المحمول', key: 'mobile', width: 15 },
          { header: 'الموقع الالكتروني', key: 'website', width: 15 },
          { header: 'البريد الالكتروني', key: 'eMail', width: 15 },
          { header: 'العنوان', key: 'address', width: 15 },
          { header: 'العنوان بالعربي', key: 'addressAr', width: 15 },
          { header: 'الاتصال ب', key: 'contactPerson', width: 15 },
          { header: 'فاكس', key: 'fax', width: 15 },
          { header: 'ملاحظات', key: 'notes', width: 15 }
        ];
      }
      this.lstCheckedSuppliers.forEach(e => {
        worksheet.addRow({
          code: e.code,
          name: e.name,
          nameAr: e.nameAr,
          mobile: e.mobile,
          website: e.website,
          email: e.eMail,
          address: e.address,
          addressAr: e.addressAr,
          contactPerson: e.contactPerson,
          notes: e.notes,
          fax: e.fax
        }, "n");

      });
      workbook.xlsx.writeBuffer().then((lstCheckedSuppliers) => {
        let blob = new Blob([lstCheckedSuppliers], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
        fs.saveAs(blob, 'Suppliers_' + today + '.xlsx');
      });
    }
  }
  exportPDF() {
    if (this.lstCheckedSuppliers.length == 0) {
      this.supplierService.CreateSupplierPDF(this.lang).subscribe(list => {
        this.allSuppliers = list;
        let fileName = "SupplierList.pdf";
        var filePath = `${environment.Domain}UploadedAttachments/SupplierPDF/`;
        this.supplierService.downloadSupplierPDF(fileName).subscribe(file => {
          var dwnldFile = filePath + fileName;
          if (fileName != "" || fileName != null)
            window.open(dwnldFile);
          this.supplierService.GetAllSuppliersWithPaging(this.page.pagenumber, this.page.pagesize).subscribe((items) => {
            this.suppliersList = items.results;
            this.count = items.count;
            this.loading = false;
          });
        });
      });
    }
    else {
      this.lstCheckedSuppliers[0].lang = this.lang;
      this.lstCheckedSuppliers[0].printedBy = this.currentUser.userName;
      this.supplierService.CreateSelectedSupplierPDF(this.lstCheckedSuppliers).subscribe(list => {
        this.allSuppliers = list;
        let fileName = "SupplierReport.pdf";
        var filePath = `${environment.Domain}UploadedAttachments/`;
        this.supplierService.downloadSupplierCheckBoxPDF(fileName).subscribe(file => {
          var dwnldFile = filePath + fileName;
          if (fileName != "" || fileName != null)
            window.open(dwnldFile);
          this.supplierService.GetAllSuppliersWithPaging(this.page.pagenumber, this.page.pagesize).subscribe((items) => {
            this.suppliersList = items.results;
            this.count = items.count;
            this.loading = false;
          });
        });
      });

      this.lstCheckedSuppliers = [];
    }
  }
  printSupplier($event, id: number) {
    if ($event.checked) {
      this.lstSupplierIds.push(id);
      this.supplierService.GetSupplierById(id).subscribe((item) => {
        this.checkedSupplier = item;
        this.lstCheckedSuppliers.push(this.checkedSupplier);
      });
    }
    else {
      var index = this.lstSupplierIds.indexOf(id);
      this.lstSupplierIds.splice(index, 1);
      this.lstCheckedSuppliers.splice(index, 1);
    }
  }
  printSelectedSupplier() {
    var fileName = "";
    if (this.lstCheckedSuppliers.length > 0) {
      this.ngxService.start("generateSupplierCard");
      this.supplierService.GenerateWordForSelectedSupplier(this.lstCheckedSuppliers, this.lang).subscribe(result => {
        var filePath = `${environment.Domain}UploadedAttachments/`;
        if (this.lang == "ar")
          fileName = "ArabicSupplierCards.docx";
        else
          fileName = "EnglishSupplierCards.docx";
        this.supplierService.DownloadSupplierCardPDF(fileName).subscribe(file => {

          var dwnldFile = filePath + 'SupplierTemplates/' + fileName;
          if (fileName != "" || fileName != null)
            window.open(dwnldFile);
          this.ngxService.stop("generateSupplierCard");
        });
      });
    }
    else if (this.lstCheckedSuppliers.length == 0) {
      this.ngxService.start("generateSupplierCard");
      this.supplierService.GenerateWordForAllSupplier(this.lang).subscribe(result => {
        var filePath = `${environment.Domain}UploadedAttachments/`;
        if (this.lang == "ar")
          fileName = "ArabicSupplierCards.docx";
        else
          fileName = "EnglishSupplierCards.docx";
        this.supplierService.DownloadSupplierCardPDF(fileName).subscribe(file => {
          var dwnldFile = filePath + 'SupplierTemplates/' + fileName;
          if (fileName != "" || fileName != null)
            window.open(dwnldFile);
          this.ngxService.stop("generateSupplierCard");
        });
      });
    }
  }

  reload() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }

  viewAssets(supplierId: number) {
    // const ref = this.dialogService.open(ListComponent, {
    //   header: this.lang == "en" ? 'List Assets' : "بيانات الأصول",
    //   closable: true,
    //   width: '70%',
    //   data: {
    //     supplierId: supplierId
    //   },
    //   style: {
    //     'dir': this.lang == "en" ? 'ltr' : "rtl",
    //     "text-align": this.lang == "en" ? 'left' : "right",
    //     "direction": this.lang == "en" ? 'ltr' : "rtl"
    //   }
    // });
    // ref.onClose.subscribe((page) => {
    // });
  }
}
