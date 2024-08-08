import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListClassVM } from 'src/app/Shared/Models/classVM';
import { ListDepartmentVM } from 'src/app/Shared/Models/departmentVM';
import { CreateEmployeeVM, ListGender } from 'src/app/Shared/Models/employeeVM';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { ListHospitalDepartmentVM } from 'src/app/Shared/Models/hospitaldepartmentVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { CityService } from 'src/app/Shared/Services/city.service';
import { ClassifyService } from 'src/app/Shared/Services/classify.service';
import { DepartmentService } from 'src/app/Shared/Services/department.service';
import { EmployeeService } from 'src/app/Shared/Services/employee.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {



  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  currentUser: LoggedUser;
  employeeObj: CreateEmployeeVM;
  lstGovernorates: ListGovernorateVM[];
  lstCities: ListCityVM[];
  lstOrganizations: ListOrganizationVM[];
  lstSubOrganizations: ListSubOrganizationVM[];
  lstHospitals: ListHospitalVM[] = [];
  lstHospitalDepartments: ListHospitalDepartmentVM[] = [];
  lstDepartments: ListDepartmentVM[] = [];
  lstGender: ListGender[] = [];
  lstClasses: ListClassVM[] = [];
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  isDisabled: boolean = false;
  isHR: boolean = false;
  lstRoleNames: string[] = [];

  constructor(private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private governorateService: GovernorateService,
    private cityService: CityService,
    private organizationService: OrganizationService,
    private subOrganizationService: SubOrganizationService,
    private classService: ClassifyService,
    private route: Router,
    private authenticationService: AuthenticationService,
    private hospitalService: HospitalService) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    if (this.currentUser) {
      // const roleNames = JSON.parse(localStorage.getItem('roleNames'));
      // roleNames.forEach(element => {
      //   this.lstRoleNames.push(element.name)
      // });


      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });

      this.isHR = (['Admin', 'HR'].some(r => this.lstRoleNames.includes(r)));
    }



    this.onLoad();

    if (this.currentUser.hospitalId > 0) {
      if (this.isHR) {
        this.isDisabled = true;
        this.hospitalService.GetHospitalById(this.currentUser.hospitalId).subscribe(hostObj => {
          this.employeeObj.governorateId = hostObj.governorateId;
          this.cityService.GetCitiesByGovernorateId(hostObj.governorateId).subscribe(cities => {
            this.lstCities = cities;
          });
          this.employeeObj.cityId = hostObj.cityId;
          this.employeeObj.organizationId = hostObj.organizationId;
          this.subOrganizationService.GetSubOrganizationByOrgId(hostObj.organizationId).subscribe(suborgs => {
            this.lstSubOrganizations = suborgs;
          });
          this.employeeObj.subOrganizationId = hostObj.subOrganizationId;

          this.hospitalService.GetHospitalsBySubOrganizationId(hostObj.subOrganizationId).subscribe(hospitals => {
            this.lstHospitals = hospitals;
          });
          this.employeeObj.hospitalId = hostObj.id;

          this.hospitalService.GetHospitalDepartmentByHospitalId(hostObj.id).subscribe(hospitaldeparts => {
            this.lstHospitalDepartments = hospitaldeparts
            this.lstHospitalDepartments.forEach(element => {
              this.departmentService.GetDepartmentById(element.departmentId).subscribe(department => {
                this.lstDepartments.push(department);
              })
            });
          });
        });
      }
    }
    else {
      this.isDisabled = false;
    }
  }
  onLoad() {
    this.employeeObj = {
      address: '', addressAr: '', cardId: '', code: '', dob: '', email: '', empImg: '', name: '', nameAr: '', phone: '', whatsApp: '',
      hospitalId: 0, classificationId: 0, departmentId: 0, genderId: 0, governorateId: 0, cityId: 0, organizationId: 0, subOrganizationId: 0
    }

    this.lstGender.push({ id: 1, name: 'Male', nameAr: 'ذكر' }, { id: 1, name: 'Female', nameAr: 'أنثى' });


    this.governorateService.GetGovernorates().subscribe(items => {
      this.lstGovernorates = items;

    });

    this.organizationService.GetOrganizations().subscribe(items => {
      this.lstOrganizations = items;
    });

    this.classService.GetClassifications().subscribe(items => { this.lstClasses = items })


  }

  getDepartmentsofHospital($event) {
    this.lstDepartments = [];
    let hospitalId = $event.target.value;
    this.hospitalService.GetHospitalDepartmentByHospitalId(hospitalId).subscribe(hospitaldeparts => {
      this.lstHospitalDepartments = hospitaldeparts
      this.lstHospitalDepartments.forEach(element => {
        this.departmentService.GetDepartmentById(element.departmentId).subscribe(department => {
          this.lstDepartments.push(department);
        })
      });
    });
  }


  getSubOrgByOrgId($event) {
    this.subOrganizationService.GetSubOrganizationByOrgId($event.target.value).subscribe(suborgs => {
      this.lstSubOrganizations = suborgs;
    });
  }


  getCitiesByGovId($event) {
    this.cityService.GetCitiesByGovernorateId($event.target.value).subscribe(cities => {
      this.lstCities = cities;
    });
  }
  getHospitalsBySubOrgId($event) {
    this.hospitalService.GetHospitalsBySubOrganizationId($event.target.value).subscribe(hospitals => {
      this.lstHospitals = hospitals;
    });
  }

  onSubmit() {
    this.employeeObj.phone = this.employeeObj.phone.toString();
    this.employeeObj.cardId = this.employeeObj.cardId.toString();
    this.employeeService.CreateEmployee(this.employeeObj).subscribe(addedObj => {
      this.display = true;
    },
      (error) => {
        this.errorDisplay = true;
        if (this.lang == 'en') {
          if (error.error.status == 'email') {
            this.errorMessage = error.error.message;
          }
          // if (error.error.status == 'phone') {
          //   this.errorMessage = error.error.message;
          // } if (error.error.status == 'whatsApp') {
          //   this.errorMessage = error.error.message;
          // }
        }
        if (this.lang == 'ar') {
          if (error.error.status == 'email') {
            this.errorMessage = error.error.messageAr;
          }
          // if (error.error.status == 'phone') {
          //   this.errorMessage = error.error.messageAr;
          // }
          // if (error.error.status == 'whatsApp') {
          //   this.errorMessage = error.error.messageAr;
          // }
        }
        return false;
      });
  }
  back() { this.route.navigate(['/dash/employees']); }

}
