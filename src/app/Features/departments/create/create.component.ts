import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreateDepartmentVM } from 'src/app/Shared/Models/departmentVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { DepartmentService } from 'src/app/Shared/Services/department.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser
  deptObj: CreateDepartmentVM
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  constructor(private authenticationService: AuthenticationService, private deptService: DepartmentService,
    private route: Router,
  ) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.deptObj = { id: 0, code: '', name: '', nameAr: '', isActive: false, hospitalId: 0 }

    this.deptService.GenerateDepartmentCode().subscribe(depObj => {
      this.deptObj.code = depObj["code"];
    });
  }
  onSubmit() {

    this.deptService.CreateDepartment(this.deptObj).subscribe(addedObj => {
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
