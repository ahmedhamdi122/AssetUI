import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  lang = localStorage.getItem('lang');
  errorMessage: string = '';
  errorDisplay: boolean = false;
  display: boolean = false;
  form: FormGroup;
  govObj: CreateGovernorateVM;
  submitted: boolean = false;
  isValidEMail: boolean = false;
  textDir: string = 'ltr';
  constructor(
    private governorateService: GovernorateService,
    private route: Router,
    private ref: DynamicDialogRef
  ) { }

  ngOnInit(): void {
    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }
    this.govObj = {
      code: '',
      name: '',
      nameAr: '', area: 0, population: 0
    };
  }

  onSubmit() {


    if (this.govObj.code == '') {
      this.submitted = false;
      return false;
    }
    if (this.govObj.name == '') {
      this.submitted = false;
      return false;
    } else {
      this.submitted = true;
      this.governorateService.CreateGovernorate(this.govObj).subscribe(
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

  reset() {
    this.govObj = {
      code: '',
      name: '',
      nameAr: '', area: 0, population: 0
    };
  }



}
