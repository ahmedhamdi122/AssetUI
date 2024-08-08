import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EditGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';

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
  govObj: EditGovernorateVM;
  submitted: boolean = false;
  isValidEMail: boolean = false;
  textDir: string = 'ltr';
  constructor(
    private governorateService: GovernorateService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig,
    private route: Router
  ) { }

  ngOnInit(): void {

    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }


    let id = this.config.data.id;
    this.governorateService.GetGovernorateById(id).subscribe((data) => {
      this.govObj = data;

      this.govObj.id = id;
    });
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
      this.governorateService.UpdateGovernorate(this.govObj).subscribe(
        (result) => {
          this.display = true;
          this.ref.close();
          this.ngOnInit();
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
      id: 0,
      code: '',
      name: '',
      nameAr: '', area: 0, population: 0
    };
  }
}
