import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditUserVM, selectedHospitalType } from 'src/app/Shared/Models/userVM';
import { UserService } from 'src/app/Shared/Services/user.service';

import { RoleService } from 'src/app/Shared/Services/role.service';
import { RoleCategoryService } from 'src/app/Shared/Services/rolecategory.service';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';
import { CityService } from 'src/app/Shared/Services/city.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { ListRoleCategoriesVM } from 'src/app/Shared/Models/rolecategoryVM';
import { ListRolesVM } from 'src/app/Shared/Models/roleVM';
import { ListEmployeeVM } from 'src/app/Shared/Models/employeeVM';
import { EmployeeService } from 'src/app/Shared/Services/employee.service';
import { ListSupplierVM } from 'src/app/Shared/Models/SupplierVM';
import { ListCommetieeMemberVM } from 'src/app/Shared/Models/CommetieeMemberVM';
import { CommetieeMemberService } from 'src/app/Shared/Services/commetieeMember.service';
import { SupplierService } from 'src/app/Shared/Services/supplierService.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  lang = localStorage.getItem('lang');
  userObj: EditUserVM;
  lstRoleCategories: ListRoleCategoriesVM[] = [];
  lstRoles: ListRolesVM[] = [];
  lstRoles2: ListRolesVM[];
  lstRoleIds: string[] = [];
  addRoles: string[] = [];
  lstGovernorates: ListGovernorateVM[];
  lstCities: ListCityVM[];
  lstOrganizations: ListOrganizationVM[];
  lstSubOrganizations: ListSubOrganizationVM[];
  lstHospitals: ListHospitalVM[] = [];
  lstEmployees: ListEmployeeVM[] = [];
  lstSuppliers: ListSupplierVM[] = [];
  lstMembers: ListCommetieeMemberVM[] = [];
  lstHospitalTypes: selectedHospitalType[];
  selectedCategory: number;
  selectedHospital: number;
  selectedHospitalType: any;
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  showGov: boolean = false;
  showCity: boolean = false;
  showOrg: boolean = false;
  showHospitals: boolean = false;
  showRadioHospitals: boolean = false;
  showSubOrg: boolean = false;
  showEmployees: boolean = false;
  showSuppliers: boolean = false;
  showMembers: boolean = false;

  constructor(
    private userService: UserService,
    private roleCategoryService: RoleCategoryService,
    private roleService: RoleService,
    private organizationService: OrganizationService,
    private subOrganizationService: SubOrganizationService,
    private cityService: CityService,
    private governorateService: GovernorateService,
    private hospitalService: HospitalService,
    private employeeService: EmployeeService,
    private supplierService: SupplierService,
    private commetieeMemberService: CommetieeMemberService,
    private route: Router,
    private activeRoute: ActivatedRoute
  ) { }


  toggleCheckBox(elementId) {
    return (this.userObj.roleIds.indexOf(elementId) != -1) ? true : false;
  }
  ngOnInit(): void {

    if (this.lang == "en") {
      this.lstHospitalTypes = [
        { name: 'Get hospitals by City', id: 1 },
        { name: 'Get hospitals by Organization', id: 2 },
      ];
    }
    else {
      this.lstHospitalTypes = [
        { name: 'المستشفيات بالمدينة', id: 1 },
        { name: 'المستشفيات بالهيئات', id: 2 },
      ];
    }
    this.userObj = {
      id: '', roleId: '', roleCategoryId: 0, cityId: 0, subOrganizationId: 0, governorateId: 0, organizationId: 0, hospitalId: 0, commetieeMemberId: 0, supplierId: 0,
      email: '', phoneNumber: '', userName: '', roleIds: []
    };
    this.roleCategoryService.GetRoleCategories().subscribe((items) => {
      this.lstRoleCategories = items;
    });

    this.governorateService.GetGovernorates().subscribe((items) => {
      this.lstGovernorates = items;
    });

    this.organizationService.GetOrganizations().subscribe((items) => {
      this.lstOrganizations = items;
    });

    this.supplierService.GetSuppliers().subscribe(suppliers => {
      this.lstSuppliers = suppliers;
    });
    this.commetieeMemberService.GetCommetieeMembers().subscribe(members => {
      this.lstMembers = members;
    });



    this.showGov = true;


    let id = this.activeRoute.snapshot.params['id'];
    this.userService.GetUserById(id).subscribe(
      (data) => {
        this.userObj = data;
        this.selectedCategory = data['roleCategoryId'];
        this.userObj.roleIds = data.roleIds;
        this.userObj.roleIds.forEach(element => {
          this.addRoles.push(element);
        });
        if (this.userObj.hospitalId > 0) {
          this.employeeService.GetEditEmployeesByHospitalId(this.userObj.hospitalId).subscribe((items) => {
            this.lstEmployees = items;
          });
        }
        this.roleService.GetRolesByRoleCategoryId(Number(this.selectedCategory))
          .subscribe((roles) => {
            this.lstRoles = roles;
            this.lstRoles2 = roles;
          });

        if (this.selectedCategory == 1) {
          this.showGov = false;
          this.showCity = false;
          this.showOrg = false;
          this.showSubOrg = false;
          this.showHospitals = false;
          this.showRadioHospitals = false;
          this.showMembers = false;
        }
        if (this.selectedCategory == 2) {
          this.showGov = false;
          this.showCity = false;
          this.showOrg = true;
          this.showSubOrg = false;
          this.showHospitals = false;
          this.showRadioHospitals = false;
          this.showEmployees = false;
          this.showMembers = false;
          this.subOrganizationService.GetSubOrganizationByOrgId(this.userObj.organizationId).subscribe(suborgs => {
            this.lstSubOrganizations = suborgs;
          });
        }


        if (this.selectedCategory == 3) {
          this.showGov = true;
          this.showCity = false;
          this.showOrg = false;
          this.showSubOrg = false;
          this.showHospitals = false;
          this.showRadioHospitals = false;
          this.showEmployees = false;
        }
        if (this.selectedCategory == 4) {

          this.showGov = true;
          this.showCity = true;
          this.showOrg = false;
          this.showSubOrg = false;
          this.showHospitals = false;
          this.showEmployees = false;
          this.showMembers = false;
          this.cityService.GetCitiesByGovernorateId(this.userObj.governorateId).subscribe(cities => {
            this.lstCities = cities;
          });
        }
        if (this.selectedCategory == 5) {
          this.showRadioHospitals = true;
          if (this.userObj.governorateId != 0 && this.userObj.cityId != 0 && this.userObj.hospitalId != 0) {
            this.showGov = true;
            this.showCity = true;
            this.showOrg = false;
            this.showSubOrg = false;
            this.showHospitals = true;
            this.showEmployees = true;
            this.showMembers = false;
            this.selectedHospitalType = 1;

            this.hospitalService.GetHospitalsByCityId(this.userObj.cityId).subscribe(hospitals => {
              this.lstHospitals = hospitals;
            });
          }


          if (this.userObj.organizationId != 0 && this.userObj.subOrganizationId != 0 && this.userObj.hospitalId != 0) {
            this.showGov = false;
            this.showCity = false;
            this.showOrg = true;
            this.showSubOrg = true;
            this.showHospitals = true;
            this.showMembers = false;
            this.selectedHospitalType = 2;

            this.hospitalService.GetHospitalsBySubOrganizationId(this.userObj.subOrganizationId).subscribe(hospitals => {
              this.lstHospitals = hospitals;
              this.selectedHospital = this.userObj.hospitalId;
            });

            this.subOrganizationService.GetSubOrganizationByOrgId(this.userObj.organizationId).subscribe(suborgs => {
              this.lstSubOrganizations = suborgs;
            });
          }
          this.cityService.GetCitiesByGovernorateId(this.userObj.governorateId).subscribe(cities => {
            this.lstCities = cities;
          });

          this.hospitalService.GetHospitalsByCityId(this.userObj.cityId).subscribe(hospitals => {
            this.lstHospitals = hospitals;
            this.selectedHospital = this.userObj.hospitalId;
          });
        }

        if (this.selectedCategory == 6) {
          this.showRadioHospitals = false;
          this.showEmployees = false;
          if (this.userObj.organizationId != 0 && this.userObj.subOrganizationId != 0) {
            this.showGov = false;
            this.showCity = false;
            this.showOrg = true;
            this.showSubOrg = true;
            this.showHospitals = false;
            this.selectedHospitalType = 2;

            this.subOrganizationService.GetSubOrganizationByOrgId(this.userObj.organizationId).subscribe(suborgs => {
              this.lstSubOrganizations = suborgs;
            });

            this.hospitalService.GetHospitalsBySubOrganizationId(this.userObj.subOrganizationId).subscribe(hospitals => {
              this.lstHospitals = hospitals;
              this.selectedHospital = this.userObj.hospitalId;
            });
          }
          this.cityService.GetCitiesByGovernorateId(this.userObj.governorateId).subscribe(cities => {
            this.lstCities = cities;
          });
          this.hospitalService.GetHospitalsByCityId(this.userObj.cityId).subscribe(hospitals => {
            this.lstHospitals = hospitals;
            this.selectedHospital = this.userObj.hospitalId;
          });
        }
        if (this.selectedCategory == 7) {
          this.showGov = false;
          this.showCity = false;
          this.showOrg = false;
          this.showSubOrg = false;
          this.showHospitals = false;
          this.showRadioHospitals = false;
          this.showEmployees = false;
          this.showMembers = false;
          this.showSuppliers = true;
        }

        if (this.selectedCategory == 8) {
          this.showGov = false;
          this.showCity = false;
          this.showOrg = false;
          this.showSubOrg = false;
          this.showHospitals = false;
          this.showRadioHospitals = false;
          this.showEmployees = false;
          this.showMembers = true;
          this.showSuppliers = false;
        }


        if (this.selectedCategory == 9) {
          this.showGov = false;
          this.showCity = false;
          this.showOrg = false;
          this.showSubOrg = false;
          this.showHospitals = false;
          this.showRadioHospitals = false;
          this.showEmployees = false;
          this.showMembers = false;
          this.showSuppliers = false;
        }
      },
      (error) => console.log(error)
    );
  }

  selectedRoles($event) {

    if ($event.checked) {
      this.addRoles.push($event.source.value);
    }
    else {
      var index = this.addRoles.indexOf($event.source.value);
      this.addRoles.splice(index, 1);
    }
  }



  onRoleChange($event) {
    this.roleService
      .GetRolesByRoleCategoryId(Number($event.value))
      .subscribe((roles) => {
        this.lstRoles = roles;
        this.lstRoles2 = roles;
      });
    if ($event.value == '1') {
      this.showGov = false;
      this.showCity = false;
      this.showOrg = false;
      this.showSubOrg = false;
      this.showHospitals = false;
      this.showEmployees = false;
      this.showMembers = false;
      this.showSuppliers = false;
      this.showRadioHospitals = false;

    }
    if ($event.value == '2') {
      this.showGov = false;
      this.showCity = false;
      this.showOrg = true;
      this.showHospitals = false;
    }
    if ($event.value == '3') {
      this.showGov = true;
      this.showCity = false;
      this.showOrg = false;
      this.showHospitals = false;
      this.showSuppliers = false;
      this.showMembers = false;
    }

    if ($event.value == '4') {
      this.showGov = true;
      this.showCity = true;
      this.showOrg = false;
      this.showHospitals = false;
      this.showSuppliers = false;
      this.showMembers = false;
    }

    if ($event.value == '5') {
      this.selectedHospitalType = 1;
      this.showGov = true;
      this.showCity = true;
      this.showOrg = false;
      this.showHospitals = true;
      this.showRadioHospitals = true;
      this.showSuppliers = false;
      this.showMembers = false;
    }

    if ($event.value == '6') {
      this.selectedHospitalType = 2;
      this.showGov = false;
      this.showCity = false;
      this.showOrg = true;
      this.showSubOrg = true;
      this.showHospitals = false;
      this.showRadioHospitals = false;
    }


    if ($event.value == '7') {
      this.selectedHospitalType = 2;
      this.showGov = false;
      this.showCity = false;
      this.showOrg = true;
      this.showSubOrg = true;
      this.showHospitals = false;
      this.showRadioHospitals = false;
      this.showSuppliers = true;
      this.showMembers = false;
    }

    if ($event.value == '8') {
      this.selectedHospitalType = 2;
      this.showGov = false;
      this.showCity = false;
      this.showOrg = true;
      this.showSubOrg = true;
      this.showHospitals = false;
      this.showRadioHospitals = false;
      this.showSuppliers = false;
      this.showMembers = true;
    }

    if ($event.value == '9') {
      this.selectedHospitalType = 2;
      this.showGov = false;
      this.showCity = false;
      this.showOrg = false;
      this.showSubOrg = false;
      this.showHospitals = false;
      this.showRadioHospitals = false;
      this.showSuppliers = false;
      this.showMembers = true;
    }
  }

  getCitiesByGovId(govId: number) {
    this.cityService.GetCitiesByGovernorateId(govId).subscribe((cities) => {
      this.lstCities = cities;
    });
  }
  getHospitalsByCityId($event) {
    // this.lstHospitals =[];
    this.hospitalService
      .GetHospitalsByCityId($event.target.value)
      .subscribe((hospitals) => {
        this.lstHospitals = hospitals;
      });
  }
  getSubOrgByOrgId($event) {
    this.subOrganizationService
      .GetSubOrganizationByOrgId($event.target.value)
      .subscribe((suborgs) => {
        this.lstSubOrganizations = suborgs;
      });
  }

  getHospitalsBySubOrgId($event) {
    // this.lstHospitals =[];
    this.hospitalService
      .GetHospitalsBySubOrganizationId($event.target.value)
      .subscribe((hospitals) => {
        this.lstHospitals = hospitals;
      });
  }

  onSubmit() {

    this.userObj.roleIds = this.addRoles;
    if (this.userObj.roleIds.length == 0) {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select at least one role";
      }
      else {
        this.errorMessage = "اختر على الأقل مهمة واحدة";
      }
      return false;
    }

    if (this.selectedCategory == 1) {
      this.userObj.roleIds = this.addRoles;
      this.userService.UpdateUser(this.userObj).subscribe((user) => {
        this.display = true;
      });
      this.route.navigate(['/dash/users']);
    }
    if (this.selectedCategory == 2) {
      if (this.userObj.organizationId == 0) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please select organization";
        }
        else {
          this.errorMessage = "اختر هيئة";
        }
        return false;
      }
      else {
        this.userObj.roleIds = this.addRoles;
        this.userService.UpdateUser(this.userObj).subscribe((user) => {
          this.display = true;
        });
      }
    }
    if (this.selectedCategory == 3) {
      if (this.userObj.governorateId == 0) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please select governorate";
        }
        else {
          this.errorMessage = "اختر محافظة";
        }
        return false;
      } else {
        this.userObj.roleIds = this.addRoles;
        this.userService.UpdateUser(this.userObj).subscribe((user) => {
          this.display = true;
        });
      }
    }
    if (this.selectedCategory == 4) {
      if (this.userObj.governorateId == 0) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please select governorate";
        }
        else {
          this.errorMessage = "اختر محافظة";
        }
        return false;
      }
      if (this.userObj.cityId == 0) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please select city";
        }
        else {
          this.errorMessage = "اختر مدينة";
        }
        return false;
      } else {
        this.userObj.roleIds = this.addRoles;
        this.userService.UpdateUser(this.userObj).subscribe((user) => {
          this.display = true;
        });
      }
    }
    if (this.selectedCategory == 5) {
      if (this.selectedHospitalType == 1) {
        if (this.userObj.governorateId == 0) {
          this.errorDisplay = true;
          if (this.lang == "en") {
            this.errorMessage = "Please select governorate";
          }
          else {
            this.errorMessage = "اختر محافظة";
          }
          return false;
        }
        if (this.userObj.cityId == 0) {
          this.errorDisplay = true;
          if (this.lang == "en") {
            this.errorMessage = "Please select city";
          }
          else {
            this.errorMessage = "اختر المدينة";
          }
          return false;
        } else {
          this.userObj.roleIds = this.addRoles;
          this.userObj.hospitalId = this.selectedHospital;
          this.userService.UpdateUser(this.userObj).subscribe((user) => {
            this.display = true;
          });
        }
      }
      if (this.selectedHospitalType == 2) {
        if (this.userObj.organizationId == 0) {
          this.errorDisplay = true;
          if (this.lang == "en") {
            this.errorMessage = "Please select organization";
          }
          else {
            this.errorMessage = "اختر الهيئة";
          }
          return false;
        }
        if (this.userObj.subOrganizationId == 0) {
          this.errorDisplay = true;
          if (this.lang == "en") {
            this.errorMessage = "Please select sub organization";
          }
          else {
            this.errorMessage = "اختر الهيئة الفرعية";
          }
          return false;
        } else {
          this.userObj.roleIds = this.addRoles;
          this.userObj.hospitalId = this.selectedHospital;
          this.userService.UpdateUser(this.userObj).subscribe((user) => {
            this.display = true;
          });
        }
      }
    }
    if (this.selectedCategory == 6) {
      if (this.userObj.organizationId == 0) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please select organization";
        }
        else {
          this.errorMessage = "اختر هيئة";
        }
        return false;
      }
      if (this.userObj.subOrganizationId == 0) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please select sub organization";
        }
        else {
          this.errorMessage = "اختر هيئة فرعية";
        }
        return false;
      } else {
        this.userObj.roleIds = this.addRoles;
        this.userService.UpdateUser(this.userObj).subscribe((user) => {
          this.display = true;
        });
      }
    }
    if (this.selectedCategory == 7) {
      if (this.userObj.supplierId == 0) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please select supplier";
        }
        else {
          this.errorMessage = "اختر مورد";
        }
        return false;
      }
      else {
        this.userObj.roleIds = this.addRoles;
        this.userService.UpdateUser(this.userObj).subscribe((user) => {
          this.display = true;
        });

      }
    }
    if (this.selectedCategory == 8) {
      if (this.userObj.commetieeMemberId == 0) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please select member";
        }
        else {
          this.errorMessage = "اختر أحد أعضاء اللجنة";
        }
        return false;
      }
      else {
        this.userObj.roleIds = this.addRoles;
        this.userService.UpdateUser(this.userObj).subscribe((user) => {
          this.display = true;
        });

      }
    }
    if (this.selectedCategory == 9) {

      this.userObj.roleIds = this.addRoles;
      this.userService.UpdateUser(this.userObj).subscribe((user) => {
        this.display = true;
      });
    }
    //this.route.navigate(['/dash/users']);
  }

  back() { this.route.navigate(['/dash/users']); }
}
