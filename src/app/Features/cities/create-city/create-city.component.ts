import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateCityVM } from 'src/app/Shared/Models/cityVM';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { CityService } from 'src/app/Shared/Services/city.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';

@Component({
  selector: 'app-create-city',
  templateUrl: './create-city.component.html',
  styleUrls: ['./create-city.component.css']
})
export class CreateCityComponent implements OnInit {

  public lang = localStorage.getItem("lang");
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  lstGovernorates: ListGovernorateVM[];
  form: FormGroup;
  cityObj: CreateCityVM;
  submitted: boolean = false;
  isValidEMail: boolean = false;
  textDir: string = 'ltr';

  constructor(private cityService: CityService,
    private governorateService: GovernorateService, private route: Router, private ref: DynamicDialogRef,
    private config: DynamicDialogConfig) { }

  ngOnInit(): void {
    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }
    this.cityObj = {
      code: '',
      name: '',
      nameAr: '',
      governorateId: 0
    };



    this.governorateService.GetGovernorates().subscribe(items => {
      this.lstGovernorates = items;
    });

    let govId = this.config.data.govId;

    if (govId != null) {
      this.cityObj.governorateId = govId;
    }
    else {
      this.cityObj.governorateId = 0;
    }


  }
  onOrgChange($event) {
    this.cityObj.governorateId = $event.target.value;
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

      this.cityService.CreateCity(this.cityObj).subscribe(id => {
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


  reset() {
    this.cityObj = {
      code: '',
      name: '',
      nameAr: '',
      governorateId: 0
    };
  }


}
