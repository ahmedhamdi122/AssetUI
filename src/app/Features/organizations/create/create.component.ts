import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {
  public lang = localStorage.getItem('lang');
  errorMessage: string = '';
  errorDisplay: boolean = false;
  display: boolean = false;
  form: FormGroup;
  orgObj: CreateOrganizationVM;
  submitted: boolean = false;
  isValidEMail: boolean = false;
  textDir: string = 'ltr';
  constructor(
    private organizationService: OrganizationService,
    private route: Router,
    private ref: DynamicDialogRef
  ) {}

  ngOnInit(): void {
    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }
    this.orgObj = {
      code: '',
      name: '',
      nameAr: '',
      mobile: '',
      email: '',
      address: '',
      addressAr: '',
      directorName: '',
      directorNameAr: '',
    };
  }

  onSubmit() {
    
    if (this.orgObj.email != '') {
      let isValid = this.validateEmail(this.orgObj.email);
      if (isValid == false) {
        this.isValidEMail = true;
        return false;
      }
      if (isValid == true) {
        this.isValidEMail = false;
      }
    }
    if (this.orgObj.code == '') {
      this.submitted = false;
      return false;
    }
    if (this.orgObj.name == '') {
      this.submitted = false;
      return false;
    } else {
      this.submitted = true;
      this.orgObj.mobile =  this.orgObj.mobile.toString();
      this.organizationService.CreateOrganization(this.orgObj).subscribe(
        (id) => {
          this.display = true;
          this.ref.close();
        },
        (error) => {
          this.errorDisplay = true;

          if (this.lang == 'en') {
            if (error.error.status == 'code') {
              this.errorMessage = error.error.message;
            }
            if (error.error.status == 'name') {
              this.errorMessage = error.error.message;
            }

            if (error.error.status == 'nameAr') {
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
        }
      );
    }
  }

  reset() {
    this.orgObj = {
      code: '',
      name: '',
      nameAr: '',
      mobile: '',
      email: '',
      address: '',
      addressAr: '',
      directorName: '',
      directorNameAr: '',
    };
  }
  close(){
    this.ref.close();
  }
  validateEmail(email) {
    const regularExpression =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regularExpression.test(String(email).toLowerCase());
  }
}
