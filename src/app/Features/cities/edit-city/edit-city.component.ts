import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EditCityVM } from 'src/app/Shared/Models/cityVM';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { CityService } from 'src/app/Shared/Services/city.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';

@Component({
  selector: 'app-edit-city',
  templateUrl: './edit-city.component.html',
  styleUrls: ['./edit-city.component.css']
})
export class EditCityComponent implements OnInit {
  public lang = localStorage.getItem("lang");
  errorMessage: string = '';
  errorDisplay: boolean = false;
  display: boolean = false;
  lstGovernorates: ListGovernorateVM[] = [];
  form: FormGroup;
  cityObj: EditCityVM;
  submitted: boolean = false;
  isValidEMail: boolean = false;
  textDir: string = 'ltr';
  constructor(private cityService: CityService,
    private governorateService: GovernorateService, private route: Router,
    private ref: DynamicDialogRef, private config: DynamicDialogConfig) { }

  ngOnInit(): void {
    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }
    this.cityObj = { code: '', governorateId: 0, id: 0, name: '', nameAr: '' }

    this.governorateService.GetGovernorates().subscribe(items => {
      this.lstGovernorates = items;
    });


    let id = this.config.data.id;
    this.cityService.GetCityById(id).subscribe(
      data => {
        this.cityObj = data

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
        } if (this.lang == 'ar') {
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

    if (this.cityObj.code == '') {
      this.submitted = false;
      return false;
    }
    if (this.cityObj.name == '') {
      this.submitted = false;
      return false;
    } else {
      this.cityService.UpdateCity(this.cityObj).subscribe(result => {
        this.display = true;
        this.ref.close();
      }, (error) => {
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
        } if (this.lang == 'ar') {
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

  onOrgChange($event) {
    this.cityObj.governorateId = $event.target.value;
  }

  reset() {
    this.cityObj = {
      id: 0,
      code: '',
      name: '',
      nameAr: '',
      governorateId: 0
    };
  }


}
