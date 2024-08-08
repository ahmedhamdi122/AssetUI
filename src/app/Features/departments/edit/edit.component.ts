import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { EditDepartmentVM } from 'src/app/Shared/Models/departmentVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { DepartmentService } from 'src/app/Shared/Services/department.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  deptObj: EditDepartmentVM
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  constructor(private deptService: DepartmentService, private authenticationService: AuthenticationService,
    private route: Router, private config: DynamicDialogConfig) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.deptObj = { code: '', id: 0, name: '', nameAr: '', isActive: false }
    if (this.config.data != null || this.config.data != undefined) {
      let id = this.config.data.id;
      this.deptService.GetDepartmentById(id).subscribe(
        data => {
          this.deptObj = data;
        });
    }
  }
  onSubmit() {

    this.deptService.UpdateDepartment(this.deptObj.id, this.deptObj).subscribe(addedObj => {
      this.display = true;
      this.route.navigate(['/departments/'])
    },
      (error) => {
        this.errorDisplay = true;
        if (this.lang == 'en') {
          if (error.error.status == 'code') {
            this.errorMessage = error.error.message;
          }
          if (error.error.status == 'name') {
            this.errorMessage = error.error.message;
          } if (error.error.status == 'nameAr') {
            this.errorMessage = error.error.message;
          }
        }
        if (this.lang == 'ar') {
          if (error.error.status == 'code') {
            this.errorMessage = error.error.messageAr;
          }
          if (error.error.status == 'name') {
            this.errorMessage = error.error.messageAr;
          }
          if (error.error.status == 'nameAr') {
            this.errorMessage = error.error.messageAr;
          }
        }
        return false;
      });
  }
}
