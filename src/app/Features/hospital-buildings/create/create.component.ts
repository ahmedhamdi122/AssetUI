import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateBuildingVM } from 'src/app/Shared/Models/buildingVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { BuildingService } from 'src/app/Shared/Services/building.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  public lang = localStorage.getItem('lang');
  textDir: string = 'ltr';
  errorMessage: string = '';
  errorDisplay: boolean = false;
  display: boolean = false;
  form: FormGroup;
  buildObj: CreateBuildingVM;
  submitted: boolean = false;
  isValidEMail: boolean = false;
  lstHospitals: ListHospitalVM[] = [];

  constructor(
    private buildingService: BuildingService,
    private hospitalService: HospitalService,
    private ref: DynamicDialogRef,
    private config: DynamicDialogConfig
  ) { }

  ngOnInit(): void {
    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }
    this.buildObj = { code: '', name: '', nameAr: '', brief: '', briefAr: '', hospitalId: 0 };
    let hospitalId = this.config.data.hospitalId;


    if (hospitalId != null) {
      this.buildObj.hospitalId = hospitalId;
    }
    else {
      this.buildObj.hospitalId = 0;
    }

    this.hospitalService.GetHospitals().subscribe(hospitals => {
      this.lstHospitals = hospitals;
    });
  }

  onSubmit() {


    if (this.buildObj.code == '') {
      this.submitted = false;
      return false;
    }
    if (this.buildObj.name == '') {
      this.submitted = false;
      return false;
    } else {
      this.submitted = true;
      this.buildingService.CreateBuilding(this.buildObj).subscribe(
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
    this.buildObj = {
      code: '',
      name: '',
      nameAr: '',
      brief: '',
      briefAr: '',
      hospitalId: 0
    };
  }


}
