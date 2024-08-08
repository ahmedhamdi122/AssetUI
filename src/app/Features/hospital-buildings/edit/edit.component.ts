import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EditBuildingVM } from 'src/app/Shared/Models/buildingVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { BuildingService } from 'src/app/Shared/Services/building.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  public lang = localStorage.getItem('lang');
  textDir: string = 'ltr';
  errorMessage: string = '';
  errorDisplay: boolean = false;
  display: boolean = false;
  form: FormGroup;
  buildObj: EditBuildingVM;
  submitted: boolean = false;
  isValidEMail: boolean = false;
  lstHospitals: ListHospitalVM[] = [];
  constructor(
    private buildingService: BuildingService,
    private hospitalService: HospitalService,
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
    this.buildingService.GetBuildingById(id).subscribe((data) => {
      this.buildObj = data;

      this.buildObj.id = id;
    });

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
      this.buildingService.UpdateBuilding(this.buildObj).subscribe(
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
    this.buildObj = {
      id: 0,
      code: '',
      name: '',
      nameAr: '',
      brief: '',
      briefAr: '',
      hospitalId: 0
    };
  }

}
