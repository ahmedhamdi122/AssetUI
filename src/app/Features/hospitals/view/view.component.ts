import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListDepartmentVM } from 'src/app/Shared/Models/departmentVM';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { DetailHospitalVM, EditHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { CityService } from 'src/app/Shared/Services/city.service';
import { DepartmentService } from 'src/app/Shared/Services/department.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {


  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  lstDepartments: ListDepartmentVM[];
  lstdeparts: number[];
  hospitalObj: DetailHospitalVM = {
    id: 0, type: '', code: '', name: '', nameAr: '', email: '', mobile: '', managerName: '', managerNameAr: '', latitude: '', longtitude: '', address: '', addressAr: '', governorateName: '', governorateNameAr: '', cityName: '', cityNameAr: '', organizationName: '', organizationNameAr: '', subOrganizationName: '', subOrganizationNameAr: '', contractEnd: new Date, contractName: '', contractStart: new Date, strContractEnd: '', strContractStart: '',
    departments: []

  }


  selectedCategory: any;
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;

  constructor(private hospitalService: HospitalService,
    private config: DynamicDialogConfig,
    private ref: DynamicDialogRef,
    private departmentService: DepartmentService) {
  }


  ngOnInit(): void {
    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }



    let id = this.config.data.id;
    this.hospitalService.GetHospitalDetailById(id).subscribe(
      data => {

        this.hospitalObj = data;
        if (this.hospitalObj.departments != null) {
          this.lstdeparts = this.hospitalObj.departments;
        }
        else
          this.lstdeparts = [];


        // this.departmentService.GetDepartments().subscribe(items => {
        //   this.lstDepartments = items;
        // });

        this.departmentService.DepartmentsByHospitalId(id).subscribe(data=>{
          this.lstDepartments = data;
        });

      });
  }

  close() {
    this.ref.close();
  }
}
