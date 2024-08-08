import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { EditSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';

@Component({
  selector: 'app-editsuborganization',
  templateUrl: './editsuborganization.component.html',
  styleUrls: ['./editsuborganization.component.css']
})
export class EditsuborganizationComponent implements OnInit {

  public lang =  localStorage.getItem("lang");
  errorMessage: string = '';
  errorDisplay: boolean = false;
  display: boolean = false;
  lstOrganizations: ListOrganizationVM[] =[];
  form: FormGroup;
  subOrgObj: EditSubOrganizationVM;
  submitted: boolean = false;
  isValidEMail: boolean = false;
  textDir: string = 'ltr';
  constructor(private subOrganizationService: SubOrganizationService, 
       private organizationService: OrganizationService,private route:Router,
    private ref: DynamicDialogRef, private config: DynamicDialogConfig) { }

  ngOnInit(): void {

    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }
    this.organizationService.GetOrganizations().subscribe(items => {
      this.lstOrganizations = items;
    });

    
    let id = this.config.data.id;
    this.subOrganizationService.GetSubOrganizationById(id).subscribe(
      data => { 
        this.subOrgObj = data
      
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
        }  if (this.lang == 'ar')  {
          if (error.error.status == 'code') {
            this.errorMessage = error.error.messageAr;
          }
          if (error.error.status == 'name') {
            this.errorMessage = error.error.messageAr;
          }
        }
        return false;
      });
  
  
  }

  onSubmit() {
    if (this.subOrgObj.email != '') {
      let isValid = this.validateEmail(this.subOrgObj.email);
      if (isValid == false) {
        this.isValidEMail = true;
        return false;
      }
      if (isValid == true) {
        this.isValidEMail = false;
      }
    }
    if (this.subOrgObj.code == '') {
      this.submitted = false;
      return false;
    }
    if (this.subOrgObj.name == '') {
      this.submitted = false;
      return false;
    } else {
      this.subOrganizationService.UpdateSubOrganization(this.subOrgObj).subscribe(result => {
        this.display = true;
        this.ref.close();
      });
      this.route.navigate(['/dash/organizations']);

    }
  }

  onOrgChange($event)
  {
    this.subOrgObj.organizationId = $event.target.value;
  }

  reset()
  {
    this.subOrgObj = {
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
      organizationId:0
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
