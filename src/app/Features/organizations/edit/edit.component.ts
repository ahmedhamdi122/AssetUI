import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EditOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  public lang = localStorage.getItem('lang');
  errorMessage: string = '';
  errorDisplay: boolean = false;
  display: boolean = false;
  form: FormGroup;
  orgObj: EditOrganizationVM;
  submitted: boolean = false;
  isValidEMail: boolean = false;
  textDir: string = 'ltr';
  constructor(
    private organizationService: OrganizationService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private route: Router
  ) {}

  ngOnInit(): void {
    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }
    let id = this.config.data.id;
    this.organizationService.GetOrganizationById(id).subscribe((data) => {
      this.orgObj = data;

      this.orgObj.id = id;
    });
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
    }
    else {
      this.orgObj.mobile =  this.orgObj.mobile.toString();
      this.organizationService.UpdateOrganization(this.orgObj).subscribe(
        (result) => {
          this.display = true;
          this.ref.close();

          this.route.navigate(['/dash/organizations']);
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
          }
          if (this.lang == 'ar') {
            if (error.error.status == 'code') {
              this.errorMessage = error.error.messageAr;
            }
            if (error.error.status == 'name') {
              this.errorMessage = error.error.messageAr;
            }
          }
          return false;
        }
      );
    }
  }

  validateEmail(email) {
    const regularExpression =
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regularExpression.test(String(email).toLowerCase());
  }

  reset()
  {
    this.orgObj = {
      id:0,
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
}
