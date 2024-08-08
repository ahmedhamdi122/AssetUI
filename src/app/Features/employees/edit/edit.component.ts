import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListClassVM } from 'src/app/Shared/Models/classVM';
import { ListDepartmentVM } from 'src/app/Shared/Models/departmentVM';
import { EditEmployeeVM, ListGender } from 'src/app/Shared/Models/employeeVM';
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
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {


  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  currentUser: LoggedUser;
  employeeObj: EditEmployeeVM;
  lstGovernorates: ListGovernorateVM[];
  lstCities: ListCityVM[];
  lstOrganizations: ListOrganizationVM[];
  lstSubOrganizations: ListSubOrganizationVM[];
  lstHospitals: ListHospitalVM[] = [];
  lstHospitalDepartments: ListHospitalDepartmentVM[] = [];
  lstDepartments: ListDepartmentVM[] = [];
  lstClasses: ListClassVM[] = [];
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  lstGender: ListGender[] = [];
  isDisabled: boolean = false;
  constructor(private authenticationService: AuthenticationService, private employeeService: EmployeeService,
    private departmentService: DepartmentService,
    private governorateService: GovernorateService,
    private cityService: CityService,
    private organizationService: OrganizationService,
    private subOrganizationService: SubOrganizationService,
    private activeRoute: ActivatedRoute,
    private classService: ClassifyService,
    private route: Router,
    private hospitalService: HospitalService) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.onLoad();

    let id = this.activeRoute.snapshot.params['id'];
    this.employeeService.GetEmployeeById(id).subscribe(
      (data) => {
        this.employeeObj = data;
        if (this.currentUser.hospitalId > 0) {
          this.isDisabled = true;
        }
        else {
          this.isDisabled = false;
        }
        this.hospitalService.GetSubOrganizationsByHospitalId(this.employeeObj.hospitalId).subscribe(items => {
          this.lstSubOrganizations = items;
        });
        this.hospitalService.GetHospitals().subscribe(items => {
          this.lstHospitals = items;
        });
        this.hospitalService.GetHospitalById(this.employeeObj.hospitalId).subscribe(item => {
          this.employeeObj.subOrganizationId = item["subOrganizationId"];
          this.employeeObj.organizationId = item["organizationId"];
          this.employeeObj.governorateId = item["governorateId"];
          this.cityService.GetCitiesByGovernorateId(this.employeeObj.governorateId).subscribe(cities => {
            this.lstCities = cities;
          });
          this.employeeObj.cityId = item["cityId"];
        });



        this.hospitalService.GetHospitalDepartmentByHospitalId(this.employeeObj.hospitalId).subscribe(hospitaldeparts => {
          this.lstHospitalDepartments = hospitaldeparts
          this.lstHospitalDepartments.forEach(element => {
            this.departmentService.GetDepartmentById(element.departmentId).subscribe(department => {
              this.lstDepartments.push(department);
            })
          });
        });


        this.departmentService.GetDepartmentById(this.employeeObj.departmentId).subscribe(item => {
          this.employeeObj.departmentId = item["id"];
        });



      },
      (error) => console.log(error)
    );
  }
  onLoad() {
    this.employeeObj = {
      id: 0, address: '', addressAr: '', cardId: '', code: '',
      dob: '', email: '', empImg: '', name: '', nameAr: '', phone: '', whatsApp: '',
      hospitalId: 0, classificationId: 0, departmentId: 0, genderId: 0, governorateId: 0, cityId: 0, subOrganizationId: 0, organizationId: 0
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
    this.employeeObj.empImg = "";
    this.employeeService.UpdateEmployee(this.employeeObj).subscribe(addedObj => {

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
