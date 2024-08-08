import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Paging } from 'src/app/Shared/Models/paging';
import { EditRoleCategoryVM, ListRoleCategoriesVM, SortRoleCategoryVM } from 'src/app/Shared/Models/rolecategoryVM';
import { RoleCategoryService } from 'src/app/Shared/Services/rolecategory.service';
import { DeleteconfirmationComponent } from '../deleteconfirmation/deleteconfirmation.component';
import { CreateComponent } from '../create/create.component';
import { DialogService } from 'primeng/dynamicdialog';
import { EditComponent } from '../edit/edit.component';
import { ViewComponent } from '../view/view.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  public lang = localStorage.getItem("lang");
  page: Paging;
  count: number;
  sortStatus: string = "ascending";
  sortObj: SortRoleCategoryVM;
  loading: boolean = true;
  lstRoleCategories: ListRoleCategoriesVM[] = [];
  selectedObj: EditRoleCategoryVM;
  cols: any[];

  constructor(private rolecategoryService: RoleCategoryService, private dialog: MatDialog, private route: Router, public dialogService: DialogService) { }
  ngOnInit(): void {

    this.sortObj = { name: '', nameAr: '', sortStatus: '', id: 0, orderId: 0 }

    this.page = { pagenumber: 1, pagesize: 10 }
    this.rolecategoryService.GetRoleCategories().subscribe(items => {
      this.lstRoleCategories = items;
      this.loading = false;
    });

    if (this.lang == "en") {
      this.cols = [
        { field: 'id', header: 'Id' },
        { field: 'name', header: 'Name' },
        { field: 'orderId', header: 'OrderId' }
      ];
    }
    else if (this.lang == "ar") {
      this.cols = [
        { field: 'id', header: 'م' },
        { field: 'nameAr', header: 'الاسم' },
        { field: 'orderId', header: 'الترتيب' }
      ];

    }
  }
  deleteRoleCategory(id: number) {
    this.rolecategoryService.GetRoleCategoryById(id).subscribe((data) => {
      this.selectedObj = data;

      const dialogRef2 = this.dialog
        .open(DeleteconfirmationComponent, {
          width: '30%',
          autoFocus: true,
          data: {
            id: this.selectedObj.id,
            name: this.lang == this.selectedObj.name,
            nameAr: this.selectedObj.nameAr,
          },
        });
      dialogRef2.afterClosed().subscribe(() => {
        this.reload();
      })
    });
  }


  addRoleCategory() {
    const dialogRef2 = this.dialogService.open(CreateComponent, {
      header: this.lang == "en" ? 'Add Role Category' : "إضافة  فئة الأدوار",
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


  editRoleCategory(id: number) {
    const ref = this.dialogService.open(EditComponent, {
      header: this.lang == "en" ? 'Edit Role Category' : "تعديل  فئة الأدوار",
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


  viewRoleCategory(id: number) {
    const ref = this.dialogService.open(ViewComponent, {
      header: this.lang == "en" ? 'View Role Category' : "بيان  فئة الأدوار",
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

    this.rolecategoryService.GetRoleCategories().subscribe(items => {
      this.lstRoleCategories = items;
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

    else if (field.currentTarget.id == "id" || field.currentTarget.id == "م") {
      this.sortObj.id = field.currentTarget.id;
    }


    else if (field.currentTarget.id == "OrderId" || field.currentTarget.id == "الترتيب") {
      this.sortObj.orderId = field.currentTarget.id;
    }

    this.rolecategoryService.SortRoleCategories(this.page.pagenumber, this.page.pagesize, this.sortObj).subscribe(data => {
      this.lstRoleCategories = data.results;
      this.count = data.count;
      this.loading = false;
      this.sortStatus = this.sortObj.sortStatus;
      this.sortObj = { name: '', nameAr: '', sortStatus: '', id: 0, orderId: 0 }
    });
  }
  reload() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }
}
