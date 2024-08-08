import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { EditBrandVM, ListBrandVM, SortAndFilterBrandVM, SortBrandVM } from 'src/app/Shared/Models/brandVM';
import { Paging } from 'src/app/Shared/Models/paging';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { BrandService } from 'src/app/Shared/Services/brand.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { DeleteBrandConfirmationComponent } from '../delete-brand-confirmation/delete-brand-confirmation.component';
import { Workbook } from 'exceljs';
import { DatePipe } from '@angular/common';
import * as fs from 'file-saver';
import { environment } from 'src/environments/environment';
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';
import { ListComponent } from '../../hospital-assets/list/list.component';

@Component({
  selector: 'app-list-brand',
  templateUrl: './list-brand.component.html',
  styleUrls: ['./list-brand.component.css']
})
export class ListBrandComponent implements OnInit {
  lang = localStorage.getItem("lang");
  brandsList: ListBrandVM[] = [];
  allBrands: ListBrandVM[] = [];
  autoCompleteBrands: ListBrandVM[] = [];
  selectedObj: EditBrandVM;
  page: Paging;
  count: number;
  currentUser: LoggedUser;

  loading: boolean = true;
  sortStatus: string = "ascending";

  sortFilterObjects: SortAndFilterBrandVM;
  brandObj: EditBrandVM;
  brandName: string = "";
  constructor(private authenticationService: AuthenticationService, private brandService: BrandService, private dialog: MatDialog, public dialogService: DialogService, private datePipe: DatePipe, private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute,
    private route: Router) { this.currentUser = this.authenticationService.currentUserValue; }


  ngOnInit(): void {

    const translationKeys = ['Asset.Assets', 'Asset.Brands']; // Array of translation keys
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);

    this.page = { pagenumber: 1, pagesize: 10 }

    this.sortFilterObjects = {
      sortObj: { code: '', name: '', nameAr: '', sortStatus: '', sortBy: '' },
      searchObj: { id: 0, code: '', name: '', nameAr: '' }
    }
    this.brandService.getBrandsCount().subscribe((data) => {
      this.count = data;
    });

    this.brandService.GetBrands().subscribe((items) => {
      this.allBrands = items;
    });
  }
  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;

    this.brandService.ListBrands(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe((items) => {
      this.brandsList = items.results;
      this.count = items.count;
      this.loading = false;
    });
  }
  addBrand() {
    const dialogRef2 = this.dialogService.open(CreateComponent, {
      header: this.lang == "en" ? 'Add Brand' : "إضافة الماركة",
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
  editBrand(id: number) {
    const ref = this.dialogService.open(EditComponent, {
      header: this.lang == "en" ? 'Edit Brand' : "تعديل الماركة ",
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
  deleteBrand(id: number) {

    this.brandService.GetBrandById(id).subscribe((data) => {
      this.selectedObj = data;

      const orgDialog = this.dialog
        .open(DeleteBrandConfirmationComponent, {
          width: '30%',
          autoFocus: true,
          data: {
            id: this.selectedObj.id,
            name: this.selectedObj.name,
            nameAr: this.selectedObj.nameAr
          },
        });
    });

    this.route.navigate(['/dash/brands']);
  }
  sort(field) {
    if (this.sortStatus === "descending") {
      this.sortStatus = "ascending";
      this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    }
    else {
      this.sortStatus = "descending"
      this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    }
    this.sortFilterObjects.sortObj.sortBy = field.currentTarget.id;
    this.sortFilterObjects.searchObj.id = this.sortFilterObjects.searchObj.id;

    this.brandService.ListBrands(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe((items) => {
      this.brandsList = items.results;
      this.count = items.count;
      this.loading = false;
    });
  }
  viewBrandAssets(brandId: number) {
    this.brandService.GetBrandById(brandId).subscribe(brandObj => {
      this.brandName = this.lang == "en" ? brandObj["name"] : brandObj["nameAr"];
      const ref = this.dialogService.open(ListComponent, {
        header: this.lang == "en" ? 'Assets for this Brand' + " - " + this.brandName : "الأصول لهذه الماركة" + " - " + this.brandName,
        data: {
          brandId: brandId
        },
        style: {
          'dir': this.lang == "en" ? 'ltr' : "rtl",
          "text-align": this.lang == "en" ? 'left' : "right",
          "direction": this.lang == "en" ? 'ltr' : "rtl"
        }
      });
      ref.onClose.subscribe(res => {
        this.reload();
      });
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
      this.allBrands.forEach(e => {
        worksheet.addRow({
          code: e.code,
          name: e.name,
          nameAr: e.nameAr
        }, "n");
      });
      workbook.xlsx.writeBuffer().then((lstBrands) => {
        let blob = new Blob([lstBrands], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
        fs.saveAs(blob, 'Brands_' + today + '.xlsx');
      });
    }
    else {
      worksheet.columns = [
        { header: 'الكود', key: 'code', width: 50 },
        { header: 'الاسم', key: 'name', width: 15 },
        { header: 'الاسم بالعربي', key: 'nameAr', width: 20 }
      ];
      this.allBrands.forEach(e => {
        worksheet.addRow({
          code: e.code,
          name: e.name,
          nameAr: e.nameAr
        }, "n");
      });
      workbook.xlsx.writeBuffer().then((lstBrands) => {
        let blob = new Blob([lstBrands], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        var today = this.datePipe.transform(new Date(), "dd/MM/yyyy_HH:mm:ss");
        fs.saveAs(blob, 'Brands_' + today + '.xlsx');
      });
    }
  }
  exportPDF() {
    this.brandService.CreateBrandPDF(this.lang).subscribe(list => {
      this.allBrands = list;
      let fileName = "BrandList.pdf";
      var filePath = `${environment.Domain}UploadedAttachments/BrandPDF/`;
      this.brandService.downloadBrandPDF(fileName).subscribe(file => {
        var dwnldFile = filePath + fileName;
        if (fileName != "" || fileName != null)
          window.open(dwnldFile);
        this.brandService.GetBrandsWithPaging(this.page).subscribe(data => {
          this.brandsList = data;
          this.loading = false;
        });
        this.brandService.getBrandsCount().subscribe((data) => {
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
  getBrandObject(event) {
    this.sortFilterObjects.searchObj.id = event["id"];
    this.brandService.ListBrands(this.sortFilterObjects, 1, 10).subscribe((items) => {
      this.brandsList = items.results;
      this.count = items.count;
      this.loading = false;
    });
  }
  onBrandSelectionChanged(event) {
    this.brandService.AutoCompleteBrandName(event.query).subscribe(assets => {
      this.autoCompleteBrands = assets;
      if (this.lang == "en") {
        this.autoCompleteBrands.forEach(item => item.name = item.name);
      }
      else {
        this.autoCompleteBrands.forEach(item => item.name = item.nameAr);
      }
    });
  }
  clearSearch() {
    this.autoCompleteBrands = [];
    this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    this.sortFilterObjects.searchObj.id = 0;
    this.brandObj = null;

    this.brandService.ListBrands(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe((items) => {
      this.brandsList = items.results;
      this.count = items.count;
      this.loading = false;
    });




  }
}
