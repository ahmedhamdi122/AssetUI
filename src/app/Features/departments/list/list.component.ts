import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { EditDepartmentVM, ListDepartmentVM, SortDepartmentVM } from 'src/app/Shared/Models/departmentVM';
import { Paging } from 'src/app/Shared/Models/paging';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { DepartmentService } from 'src/app/Shared/Services/department.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { DeleteDepartmentsConfirmationComponent } from '../delete-departments-confirmation/delete-departments-confirmation.component';
import { CreateComponent } from '../create/create.component';
import { EditComponent } from '../edit/edit.component';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  public get deptService(): DepartmentService {
    return this._deptService;
  }
  public set deptService(value: DepartmentService) {
    this._deptService = value;
  }
  lang = localStorage.getItem("lang");
  deptsList: ListDepartmentVM[] = []
  selectedObj: EditDepartmentVM;
  textDir: string = 'ltr';
  currentUser: LoggedUser;
  count: number;
  page: Paging;
  loading: boolean = true;
  sortStatus: string = "descending";
  sortObj: SortDepartmentVM;
  constructor(private authenticationService: AuthenticationService, private _deptService: DepartmentService,
    private dialog: MatDialog, public dialogService: DialogService, private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute,
    private route: Router) { this.currentUser = this.authenticationService.currentUserValue; }


  ngOnInit(): void {

    const translationKeys = ['Asset.heirarchicalstructure', 'Asset.Departments']; // Array of translation keys
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);

    this.page = {
      pagenumber: 1,
      pagesize: 10,
    }

    this.sortObj = {
      sortStatus: '', name: '', nameAr: '', code: '', id: 0
    }

    this.deptService.GetDepartmentWithPaging(this.page).subscribe(data => {
      this.deptsList = data;
      this.loading = false;
    });
    this.deptService.getDepartmentsCount().subscribe((data) => {
      this.count = data;
    });
  }
  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;
    this.deptService.GetDepartmentWithPaging(this.page).subscribe((items) => {
      this.deptsList = items;
    });
  }

  deleteDepartment(id: number) {
    this.deptService.GetDepartmentById(id).subscribe((data) => {
      this.selectedObj = data;
      const departDialog = this.dialog
        .open(DeleteDepartmentsConfirmationComponent, {
          width: '30%',
          autoFocus: true,
          data: {
            id: this.selectedObj.id,
            name: this.selectedObj.name,
            nameAr: this.selectedObj.nameAr
          },
        });
      departDialog.afterClosed().subscribe(result => {
        let currentUrl = this.route.url;
        this.route.routeReuseStrategy.shouldReuseRoute = () => false;
        this.route.onSameUrlNavigation = 'reload';
        this.route.navigate([currentUrl]);
      });
    });


  }


  addDepartment() {
    const dialogRef2 = this.dialogService.open(CreateComponent, {
      header: this.lang == "en" ? 'Add Origin' : "إضافة القسم ",
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
  editDepartment(id: number) {
    const ref = this.dialogService.open(EditComponent, {
      header: this.lang == "en" ? 'Edit  Origin' : "تعديل القسم ",
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
    if (field.currentTarget.id == "Code") {
      this.sortObj.code = field.currentTarget.id
    }
    else if (field.currentTarget.id == "الكود") {
      this.sortObj.code = field.currentTarget.id
    }

    this.deptService.sortDepartments(this.page.pagenumber, this.page.pagesize, this.sortObj).subscribe(data => {
      this.deptsList = data;
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
}
