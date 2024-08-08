import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ListBuildingVM } from 'src/app/Shared/Models/buildingVM';
import { CreateFloorVM } from 'src/app/Shared/Models/floorVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { BuildingService } from 'src/app/Shared/Services/building.service';
import { FloorService } from 'src/app/Shared/Services/floor.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';

@Component({
  selector: 'app-create-floor',
  templateUrl: './create-floor.component.html',
  styleUrls: ['./create-floor.component.css']
})
export class CreateFloorComponent implements OnInit {

  currentUser: LoggedUser;
  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  lstBuildings: ListBuildingVM[];
  form: FormGroup;
  floorObj: CreateFloorVM;
  submitted: boolean = false;
  isValidEMail: boolean = false;


  constructor(private floorService: FloorService, private buildingService: BuildingService,
    private authenticationService: AuthenticationService, private ref: DynamicDialogRef,
    private config: DynamicDialogConfig) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }
    this.floorObj = { code: '', name: '', nameAr: '', buildingId: 0, hospitalId: 0 };
    let hospitalId = this.config.data.hospitalId;
    this.buildingService.GetAllBuildingsByHospitalId(hospitalId).subscribe(items => {
      this.lstBuildings = items;
    });
    if (this.config.data != undefined) {
      let buildId = this.config.data.buildId;
      if (buildId != null) {
        this.floorObj.buildingId = buildId;
      }
      else {
        this.floorObj.buildingId = 0;
      }
    }
  }
  onChange($event) {
    this.floorObj.buildingId = $event.target.value;
  }
  onSubmit() {
    if (this.floorObj.code == '') {
      this.submitted = false;
      return false;
    }
    if (this.floorObj.name == '') {
      this.submitted = false;
      return false;
    } else {
      this.floorObj.hospitalId = this.currentUser.hospitalId;
      this.floorService.CreateFloor(this.floorObj).subscribe(id => {
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
    this.floorObj = { code: '', name: '', nameAr: '', buildingId: 0, hospitalId: 0 };
  }
}
