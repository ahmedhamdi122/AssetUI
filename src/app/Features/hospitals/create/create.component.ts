import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListDepartmentVM } from 'src/app/Shared/Models/departmentVM';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { CreateHospitalVM, MapTable } from 'src/app/Shared/Models/hospitalVM';
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
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  currentUser: LoggedUser;
  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  form: FormGroup;
  hospitalObj: CreateHospitalVM;
  lstDepartments: ListDepartmentVM[];
  lstGovernorates: ListGovernorateVM[];
  lstCities: ListCityVM[];
  lstOrganizations: ListOrganizationVM[];
  lstSubOrganizations: ListSubOrganizationVM[];
  selectedCategory: any;
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;

  lstdeparts: number[] = [];


  isOrgManager: boolean = false;
  isCityManager: boolean = false;
  isGovManager: boolean = false;
  isSubOrgManager: boolean = false;
  lstRoleNames: string[] = [];

  public mapObj: MapTable;
  public curicon = "http://www.google.com/intl/en_us/mapfiles/ms/micons/blue-dot.png";
  address: string;

  isGov: boolean = false;
  isCity: boolean = false;
  isOrg: boolean = false;
  isSubOrg: boolean = false;

  showGov: boolean = false;
  showCity: boolean = false;
  showOrg: boolean = false;
  showSubOrg: boolean = false;


  constructor(private hospitalService: HospitalService, private authenticationService: AuthenticationService, private departmentService: DepartmentService, private organizationService: OrganizationService, private subOrganizationService: SubOrganizationService, private cityService: CityService, private governorateService: GovernorateService,
    private ngZone: NgZone, private datePipe: DatePipe,
    private ref: DynamicDialogRef, private formBuilder: FormBuilder) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.mapObj = { lat: 30.0634890000, lng: 31.2524870000, address: '' };
  }


  ngOnInit(): void {

    this.onLoad();

    if (this.currentUser.governorateId == 0 && this.currentUser.cityId == 0 && this.currentUser.organizationId == 0 && this.currentUser.subOrganizationId == 0 && this.currentUser.hospitalId == 0) {
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
      });
      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
      });
      this.showOrg = true;
    }



    if (this.currentUser.governorateId > 0 && this.currentUser.cityId == 0 && this.currentUser.hospitalId == 0) {
      this.hospitalObj.governorateId = this.currentUser.governorateId;
      this.isGov = true;
      this.cityService.GetCitiesByGovernorateId(this.hospitalObj.governorateId).subscribe(cities => {
        this.lstCities = cities;
      });
    }




    if (this.currentUser.governorateId > 0 && this.currentUser.cityId > 0 && this.currentUser.hospitalId == 0) {
      this.hospitalObj.governorateId = this.currentUser.governorateId;
      this.isGov = true;

      this.cityService.GetCitiesByGovernorateId(this.hospitalObj.governorateId).subscribe(cities => {
        this.lstCities = cities;

        this.hospitalObj.cityId = this.currentUser.cityId;
        this.isCity = true;
      });

    }

    if (this.currentUser.organizationId > 0) {
      this.hospitalObj.organizationId = this.currentUser.organizationId;
      this.isOrg = true;
      this.showOrg = true;
    }

    if (this.currentUser.organizationId > 0 && this.currentUser.subOrganizationId > 0) {
      this.hospitalObj.organizationId = this.currentUser.organizationId;
      this.isOrg = true;

      this.subOrganizationService.GetSubOrganizationByOrgId(this.hospitalObj.organizationId).subscribe(suborgs => {
        this.lstSubOrganizations = suborgs;

        this.hospitalObj.subOrganizationId = this.currentUser.subOrganizationId;
        this.isSubOrg = true;
      });
    }

    this.hospitalObj.contractStart = null;
    this.hospitalObj.contractEnd = null;


  }




  onLoad() {
    this.hospitalObj = {
      code: "", name: "", nameAr: "", mobile: "", email: "", address: "", addressAr: "", managerName: "", managerNameAr: "",
      latitude: 0, longtitude: 0, subOrganizationId: 0, cityId: 0, governorateId: 0, organizationId: 0, departments: [],
      contractEnd: new Date, contractName: '', contractStart: new Date, strContractEnd: '', strContractStart: ''
    }

    this.hospitalService.GenerateHospitalCode().subscribe(hostCode => {
      this.hospitalObj.code = hostCode["code"];
    })

    this.form = this.formBuilder.group({
      name: [null, Validators.required],
      displayName: [null, Validators.required],
    });

    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });

      this.isSubOrgManager = (['Admin', 'TLSubOrgMananger'].some(r => this.lstRoleNames.includes(r)));
      this.isOrgManager = (['Admin', 'TLManager'].some(r => this.lstRoleNames.includes(r)));
      this.isCityManager = (['Admin', 'TLCityManager'].some(r => this.lstRoleNames.includes(r)));
      this.isGovManager = (['Admin', 'TLGovManager'].some(r => this.lstRoleNames.includes(r)));
    }

    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }

    this.governorateService.GetGovernorates().subscribe(items => {
      this.lstGovernorates = items;
    });

    this.departmentService.GetDepartments().subscribe(items => {
      this.lstDepartments = items;
    });


    this.organizationService.GetOrganizations().subscribe(items => {
      this.lstOrganizations = items;
    });



    if (this.isOrgManager) {
      this.hospitalObj.organizationId = this.currentUser.organizationId;
      this.subOrganizationService.GetSubOrganizationByOrgId(this.currentUser.organizationId).subscribe(suborgs => {
        this.lstSubOrganizations = suborgs;
      });
    }


    if (this.isCityManager) {
      this.hospitalObj.governorateId = this.currentUser.governorateId;
      this.cityService.GetCitiesByGovernorateId(this.currentUser.governorateId).subscribe(cities => {
        this.lstCities = cities;
      });
    }

    if (this.isGovManager) {
      this.hospitalObj.governorateId = this.currentUser.governorateId;
    }
  }
  getCitiesByGovId(govId: number) {
    this.cityService.GetCitiesByGovernorateId(govId).subscribe(cities => {
      this.lstCities = cities;
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
        this.hospitalObj.address = results[0].formatted_address;
        return this.hospitalObj.address;
      });
    });
  }
  getCheckedDepartment(depart, $event) {
    this.lstDepartments[depart] = $event.target.checked;
    let isChecked = $event.target.checked;
    if (isChecked == true) {
      if (!this.lstdeparts.includes($event.target.value)) {
        this.lstdeparts.push($event.target.value);
      }
    }
    if (isChecked == false) {
      var index = this.lstdeparts.indexOf($event.target.value);
      this.lstdeparts.splice(index, 1);
    }
  }

  getSubOrgByOrgId($event) {
    this.subOrganizationService.GetSubOrganizationByOrgId($event.target.value).subscribe(suborgs => {
      this.lstSubOrganizations = suborgs;
    });
  }

  onSubmit() {

    this.hospitalObj.departments = this.lstdeparts;

    if (this.hospitalObj.organizationId == 0) {
      this.errorDisplay = true;
      if (this.lang == "en")
        this.errorMessage = "Please select Organization";
      else
        this.errorMessage = "اختر هيئة";
      return false;
    }

    if (this.hospitalObj.governorateId == 0) {
      this.errorDisplay = true;
      if (this.lang == "en")
        this.errorMessage = "Please select governorate";
      else
        this.errorMessage = "اختر محافظة";
      return false;
    }

    if (this.hospitalObj.cityId == 0) {
      this.errorDisplay = true;
      if (this.lang == "en")
        this.errorMessage = "Please select city";
      else
        this.errorMessage = "اختر مدينة";
      return false;
    }

    if (this.hospitalObj.subOrganizationId == 0) {
      this.errorDisplay = true;
      if (this.lang == "en")
        this.errorMessage = "Please select sub organization";
      else
        this.errorMessage = "اختر هيئة فرعية";

      return false;
    }






    // if (this.hospitalObj.strContractStart == "") {
    //   this.errorDisplay = true;
    //   if (this.lang == "en")
    //     this.errorMessage = "Please select start contract date";
    //   else
    //     this.errorMessage = "اختر تاريخ بداية العقد";
    //   return false;
    // }

    // if (this.hospitalObj.strContractEnd == "") {
    //   this.errorDisplay = true;
    //   if (this.lang == "en")
    //     this.errorMessage = "Please select end contract date";
    //   else
    //     this.errorMessage = "اختر تاريخ نهاية العقد";
    //   return false;
    // }


    else {
      this.hospitalObj.departments =this.lstdeparts;
      
      this.hospitalService.CreateHospital(this.hospitalObj).subscribe(result => {
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

  reset() {
    this.hospitalObj = {
      code: "", name: "", nameAr: "", mobile: "", email: "", address: "", addressAr: "", managerName: "", managerNameAr: "",
      latitude: 0, longtitude: 0, subOrganizationId: 0, cityId: 0, governorateId: 0, organizationId: 0, departments: [],
      contractEnd: new Date, contractName: '', contractStart: new Date, strContractEnd: '', strContractStart: ''
    }
  }
  close() {
    this.ref.close();
  }

  getContractStartDate($event) {
    this.hospitalObj.strContractStart = this.datePipe.transform($event, "yyyy-MM-dd");
  }
  getContractEndDate($event) {
    this.hospitalObj.strContractEnd = this.datePipe.transform($event, "yyyy-MM-dd");
  }
}


export class Item {
  name: string;
  value: string;
}


