import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ListRoleCategoriesVM } from 'src/app/Shared/Models/rolecategoryVM';
import { EditRoleVM, ListRolesVM } from 'src/app/Shared/Models/roleVM';
import { RoleService } from 'src/app/Shared/Services/role.service';
import { RoleCategoryService } from 'src/app/Shared/Services/rolecategory.service';
import { DeleteconfirmationComponent } from '../deleteconfirmation/deleteconfirmation.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class ListComponent implements OnInit {
  lang = localStorage.getItem("lang");
  loading: boolean = true;
  first = 0;
  rows = 5;
  lstRoles: ListRolesVM[] = [];
  selectedObj: EditRoleVM;
  lstRoleCategories: ListRoleCategoriesVM[];

  constructor(
    private roleService: RoleService,
    private rolecategoryService: RoleCategoryService,
    private dialog: MatDialog,
    private route: Router
  ) { }
  ngOnInit(): void {
    this.roleService.GetRoles().subscribe((items) => {
      this.lstRoles = items;
      this.loading = false;
    });

    this.rolecategoryService.GetRoleCategories().subscribe((items) => {
      this.lstRoleCategories = items;
    });
  }
  deleteRole(id: string) {
    this.roleService.GetRoleById(id).subscribe((data) => {
      this.selectedObj = data;

      const dialogRef2 = this.dialog.open(DeleteconfirmationComponent, {
        width: '30%',
        autoFocus: true,
        data: {
          id: this.selectedObj.id,
          name: this.selectedObj.name,
        },
      });
    });

    this.route.navigate(['/dash/roles']);
  }
  reload() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }


  next() {
    this.first = this.first + this.rows;
  }

  prev() {
    this.first = this.first - this.rows;
  }

  reset() {
    this.first = 0;
  }

  isLastPage(): boolean {
    return this.lstRoles ? this.first === (this.lstRoles.length - this.rows) : true;
  }

  isFirstPage(): boolean {
    return this.lstRoles ? this.first === 0 : true;
  }
}
