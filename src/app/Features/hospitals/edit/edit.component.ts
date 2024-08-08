import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListDepartmentVM } from 'src/app/Shared/Models/departmentVM';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { EditHospitalDepartmentVM, EditHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { CityService } from 'src/app/Shared/Services/city.service';
import { DepartmentService } from 'src/app/Shared/Services/department.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';
import { MouseEvent } from '@agm/core';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  currentUser: LoggedUser;
  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';

  form: FormGroup;
  hospitalObj: EditHospitalVM;
  editHospitalDepartmentObj: EditHospitalDepartmentVM;
  lstDepartments: ListDepartmentVM[];
  lstGovernorates: ListGovernorateVM[];
  lstCities: ListCityVM[];
  lstOrganizations: ListOrganizationVM[];
  lstSubOrganizations: ListSubOrganizationVM[];
  selectedCategory: any;
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  lstdeparts: number[];


  public mapObj: MapTable;
  public curicon = "http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png";
  address: string;

  isGov: boolean = false;
  isCity: boolean = false;
  isOrg: boolean = false;
  isSubOrg: boolean = false;


  constructor(private hospitalService: HospitalService, private authenticationService: AuthenticationService, private departmentService: DepartmentService, private organizationService: OrganizationService,
    private subOrganizationService: SubOrganizationService, private cityService: CityService, private governorateService: GovernorateService, private config: DynamicDialogConfig, private ref: DynamicDialogRef,
    private ngZone: NgZone, private datePipe: DatePipe, private route: Router, private formBuilder: FormBuilder) {
    this.currentUser = this.authenticationService.currentUserValue;

    this.form = this.formBuilder.group({
      name: [null, Validators.required],
      code: [null, Validators.required]
    });
  }


  ngOnInit(): void {
    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }



    this.hospitalObj = {
      id: 0, code: "", name: "", nameAr: "", mobile: "", email: "", address: "", addressAr: "", managerName: "", managerNameAr: "", latitude: 0, longtitude: 0, subOrganizationId: 0, cityId: 0, governorateId: 0, organizationId: 0, departments: [],
      enableDisableDepartments: [], contractEnd: new Date, contractName: '', contractStart: new Date, strContractEnd: '', strContractStart: ''
    }
    this.editHospitalDepartmentObj = { id: 0, departmentId: 0, hospitalId: 0 }


    let id = this.config.data.id;
    this.hospitalService.GetHospitalById(id).subscribe(
      data => {
        this.hospitalObj = data;
        this.hospitalObj.contractStart = new Date(this.datePipe.transform(data.contractStart, "yyyy-MM-dd"));
        this.hospitalObj.contractEnd = new Date(this.datePipe.transform(data.contractEnd, "yyyy-MM-dd"));


        if (data.latitude != null && data.longtitude != null) {
          this.mapObj = { lat: this.hospitalObj.latitude, lng: this.hospitalObj.longtitude, address: this.hospitalObj.address };
        }


        if (this.hospitalObj.departments != null) {
          this.lstdeparts = this.hospitalObj.departments;
        }
        else
          this.lstdeparts = [];

         this.cityService.GetCitiesByGovernorateId(this.hospitalObj.governorateId).subscribe(cities => {
          this.lstCities = cities;
        });
        this.subOrganizationService.GetSubOrganizationByOrgId(this.hospitalObj.organizationId).subscribe(subs => {
          this.lstSubOrganizations = subs;
        });



        if (this.currentUser.governorateId > 0) {
          this.isGov = true;
        }

        if (this.currentUser.cityId > 0) {
          this.isGov = true;
          this.isCity = true;
        }

        if (this.currentUser.organizationId > 0) {
          this.isOrg = true;
          this.isSubOrg = false;

          this.isGov = false;
          this.isCity = false;
        }


        if (this.currentUser.subOrganizationId > 0) {
          this.isOrg = true;
          this.isSubOrg = true;


          this.isGov = false;
          this.isCity = false;
        }

      })



    this.departmentService.GetDepartments().subscribe(items => {
      this.lstDepartments = items;
    });
    this.governorateService.GetGovernorates().subscribe(items => {
      this.lstGovernorates = items;
    });

    this.organizationService.GetOrganizations().subscribe(items => {
      this.lstOrganizations = items;
    });
  }

  getCitiesByGovId(govId: number) {
    this.cityService.GetCitiesByGovernorateId(govId).subscribe(cities => {
      this.lstCities = cities;
    });
  }

  getSubOrgByOrgId($event) {
    this.subOrganizationService.GetSubOrganizationByOrgId($event.target.value).subscribe(suborgs => {
      this.lstSubOrganizations = suborgs;
    });
  }


  getCheckedDepartment(depart, $event) {
    let isChecked = $event.target.checked;
    this.lstdeparts = this.hospitalObj.departments;

    console.log(" this.lstdeparts2", this.lstdeparts);

    if (isChecked == false) {
      var index = this.lstdeparts.findIndex(a => a == $event.target.value);
      if (index > -1) {
        this.lstdeparts.splice(index, 1);
      }
    }
    if (isChecked == true) {
      this.lstdeparts.push($event.target.value);
    }
  }





  deactivateDepartment(id: number) {
    this.editHospitalDepartmentObj.hospitalId = this.hospitalObj.id;
    this.editHospitalDepartmentObj.departmentId = id;
    this.hospitalService.UpdateHospitalDepartment(this.editHospitalDepartmentObj).subscribe(updated => {
      //    this.display = true;
    });
  }

  mapClicked($event: MouseEvent) {
    let lat: number = $event.coords.lat;
    let lng: number = $event.coords.lng;
    this.hospitalObj.latitude = lat;
    this.hospitalObj.longtitude = lng;


    this.getAddress(lat, lng);
    this.hospitalObj.address = this.address;
  }

  getAddress(lat, lng) {
    const geocoder = new google.maps.Geocoder();

    var latlng = new google.maps.LatLng(lat, lng);
    const request: google.maps.GeocoderRequest = {
      location: latlng
    };
    geocoder.geocode(request, (results, status) => {
      this.ngZone.run(() => {
        if (results != null) {
          this.hospitalObj.address = results[0].formatted_address;
          return this.hospitalObj.address;
        }
      });
    });
  }


  onSubmit() {
    if (this.hospitalObj.organizationId == 0) {
      this.errorDisplay = true;
      this.errorMessage = "Please select Organization";
      return false;
    }

    if (this.hospitalObj.governorateId == 0) {
      this.errorDisplay = true;
      this.errorMessage = "Please select governorate";
      return false;
    }

    if (this.hospitalObj.cityId == 0) {
      this.errorDisplay = true;
      this.errorMessage = "Please select city";
      return false;
    }

    if (this.hospitalObj.subOrganizationId == 0) {
      this.errorDisplay = true;
      this.errorMessage = "Please select sub organization";
      return false;
    }
    else {
      this.hospitalObj.departments = this.lstdeparts;
      console.log(" this.hospitalObj.departments ", this.hospitalObj.departments );
      this.hospitalService.UpdateHospital(this.hospitalObj).subscribe(result => {
        this.display = true;
        this.ref.close();
      },
        (error) => {
          this.errorDisplay = true;

          if (this.lang == 'en') {
            if (error.error.status == 'codelen') {
              this.errorMessage = error.error.message;
            }

            if (error.error.status == 'code') {
              this.errorMessage = error.error.message;
            }
            if (error.error.status == 'name') {
              this.errorMessage = error.error.message;
            }
          }
          if (this.lang == 'ar') {
            if (error.error.status == 'codelen') {
              this.errorMessage = error.error.messageAr;
            }

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
  }


  getContractStartDate($event) {
    this.hospitalObj.strContractStart = this.datePipe.transform($event, "yyyy-MM-dd");
  }
  getContractEndDate($event) {
    this.hospitalObj.strContractEnd = this.datePipe.transform($event, "yyyy-MM-dd");
  }

  reset() {
    this.hospitalObj = {
      code: "", name: "", nameAr: "", mobile: "", email: "", address: "", addressAr: "", managerName: "", managerNameAr: "",
      latitude: 0, longtitude: 0, subOrganizationId: 0, cityId: 0, governorateId: 0, organizationId: 0, departments: [],
      contractEnd: new Date, contractName: '', contractStart: new Date, strContractEnd: '', strContractStart: '',
      enableDisableDepartments: [], id: 0
    }
  }
  close() {
    this.ref.close();
  }

}




export class MapTable {
  lat: number;
  lng: number;
  address: string;
}

