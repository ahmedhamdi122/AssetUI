import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { Paging } from 'src/app/Shared/Models/paging';
import { ListRoleCategoriesVM } from 'src/app/Shared/Models/rolecategoryVM';
import { EditUserVM, ListUsersVM, LoggedUser, SortUsersVM } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { RoleCategoryService } from 'src/app/Shared/Services/rolecategory.service';
import { UserService } from 'src/app/Shared/Services/user.service';
import { DeleteconfirmationComponent } from '../deleteconfirmation/deleteconfirmation.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  loading: boolean;
  page: Paging;
  count: number;
  lstUsers: ListUsersVM[] = [];
  selectedObj: EditUserVM;
  lstRoleCategories: ListRoleCategoriesVM[] = [];
  sortStatus: string = "descending";
  sortObj: SortUsersVM;
  constructor(
    private authenticationService: AuthenticationService,
    private userService: UserService,
    private rolecategoryService: RoleCategoryService,
    private dialog: MatDialog,
    private route: Router
  ) { this.currentUser = this.authenticationService.currentUserValue; }
  ngOnInit(): void {

    this.userService.getCount().subscribe((data) => {
      this.count = data;
    });
    this.page = {
      pagenumber: 1,
      pagesize: 10
    }


    // this.userService.GetUsersWithPaging(this.page).subscribe((items) => {
    //   this.lstUsers = items;
    //   this.loading = true;
    // });


    this.sortObj = {
      sortStatus: '', id: '', categoryRoleName: '',
      userName: '', email: '', phoneNumber: '', displayName: '', displayNameAr: ''
    }

  }
  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;
    this.userService.GetUsersWithPaging(this.page).subscribe((items) => {
      this.lstUsers = items;
    });
  }


  sort(field) {


    // this.sortObj.userId = this.currentUser.id;
    this.sortObj.id = this.currentUser.id;
    if (this.sortStatus === "descending") {
      this.sortStatus = "ascending";
      this.sortObj.sortStatus = this.sortStatus;
    }
    else {
      this.sortStatus = "descending"
      this.sortObj.sortStatus = this.sortStatus;
    }

    if (field.currentTarget.id == "Mobile") {
      this.sortObj.phoneNumber = field.currentTarget.id
    }
    else if (field.currentTarget.id == "المحمول") {
      this.sortObj.phoneNumber = field.currentTarget.id
    }
    if (field.currentTarget.id == "Username") {
      this.sortObj.userName = field.currentTarget.id
    }
    else if (field.currentTarget.id == "اسم المستخدم") {
      this.sortObj.userName = field.currentTarget.id
    }
    if (field.currentTarget.id == "EMail") {
      this.sortObj.email = field.currentTarget.id
    }
    else if (field.currentTarget.id == "البريد الإلكتروني") {
      this.sortObj.email = field.currentTarget.id
    }


    if (field.currentTarget.id == "Display Name") {
      this.sortObj.displayName = field.currentTarget.id
    }
    else if (field.currentTarget.id == "الاسم") {
      this.sortObj.displayNameAr = field.currentTarget.id
    }

    if (field.currentTarget.id == "Role Category") {
      this.sortObj.categoryRoleName = field.currentTarget.id
    }
    else if (field.currentTarget.id == "فئة الدور") {
      this.sortObj.categoryRoleName = field.currentTarget.id
    }



    this.userService.sortUsers(this.page.pagenumber, this.page.pagesize, this.sortObj).subscribe(data => {
      this.lstUsers = data;
      this.sortStatus = this.sortObj.sortStatus;
      this.sortObj = {
        sortStatus: '', id: '', categoryRoleName: '',
        userName: '', email: '', phoneNumber: '', displayName: '', displayNameAr: ''
      }
    })
  }



  deleteUser(id: string) {
    this.userService.GetUserById(id).subscribe((data) => {
      this.selectedObj = data;

      const dialogRef2 = this.dialog.open(DeleteconfirmationComponent, {
        width: '30%', 
        autoFocus: true,
        data: {
          id: this.selectedObj.id,
          name: this.selectedObj.userName,
        },
      });

      dialogRef2.afterClosed().subscribe(deleted => {
        this.reload();
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
