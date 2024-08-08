import { Component, OnInit } from '@angular/core';
import { ListRoleCategoriesVM } from 'src/app/Shared/Models/rolecategoryVM';
import { EditRoleVM, ListRolesVM } from 'src/app/Shared/Models/roleVM';
import {
  CreateUserVM,
  EditUserVM,
  selectedHospitalType,
} from 'src/app/Shared/Models/userVM';
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
import { UserService } from 'src/app/Shared/Services/user.service';
import { Router } from '@angular/router';
import { EmployeeService } from 'src/app/Shared/Services/employee.service';
import { ListEmployeeVM } from 'src/app/Shared/Models/employeeVM';
import { SupplierService } from 'src/app/Shared/Services/supplierService.service';
import { ListSupplierVM } from 'src/app/Shared/Models/SupplierVM';
import { CommetieeMemberService } from 'src/app/Shared/Services/commetieeMember.service';
import { ListCommetieeMemberVM } from 'src/app/Shared/Models/CommetieeMemberVM';
import { ListEngineerVM } from 'src/app/Shared/Models/engineerVM';
import { EngineerService } from './../../../Shared/Services/engineer.service';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent implements OnInit {

  lang = localStorage.getItem('lang');
  userObj: CreateUserVM;
  lstRoleCategories: ListRoleCategoriesVM[];
  lstRoles: ListRolesVM[];
  lstUnregisteredEngineers: ListEngineerVM[] = [];
  lstRoles2: ListRolesVM[];

  editRole: EditRoleVM;
  lstEditRoles: EditRoleVM[] = [];


  addRoles: string[] = [];
  lstGovernorates: ListGovernorateVM[];
  lstCities: ListCityVM[];
  lstOrganizations: ListOrganizationVM[];
  lstSubOrganizations: ListSubOrganizationVM[];
  lstHospitals: ListHospitalVM[] = [];
  lstUnregisteredUsers: ListEmployeeVM[] = [];
  lstSuppliers: ListSupplierVM[] = [];
  lstMembers: ListCommetieeMemberVM[] = [];

  lstHospitalTypes: selectedHospitalType[];

  selectedCategory: number;
  selectedHospitalType: any;
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  displayerror: boolean = false;
  showGov: boolean = false;
  showCity: boolean = false;
  showOrg: boolean = false;
  showSubOrg: boolean = false;
  showHospitals: boolean = false;
  showRadioHospitals: boolean = false;
  showEmployees: boolean = false;
  showRoles: boolean = false;
  showSuppliers: boolean = false;
  showMembers: boolean = false;
  showVisits: boolean = false;

  constructor(
    private roleCategoryService: RoleCategoryService,
    private roleService: RoleService,
    private organizationService: OrganizationService,
    private subOrganizationService: SubOrganizationService,
    private cityService: CityService,
    private governorateService: GovernorateService,
    private hospitalService: HospitalService,
    private userService: UserService,
    private employeeService: EmployeeService,
    private supplierService: SupplierService,
    private commetieeMemberService: CommetieeMemberService,
    private route: Router,
    private engineerService: EngineerService,
  ) { }

  ngOnInit(): void {
    this.userObj = {
      email2: '', userRoleIds: [],
      roleId: '', commetieeMemberId: 0, supplierId: 0, roleCategoryId: 0, cityId: 0, subOrganizationId: 0, governorateId: 0, organizationId: 0, hospitalId: 0, email: '', phoneNumber: '', passwordHash: '', userName: '', roleIds: []
    };



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

    this.roleCategoryService.GetRoleCategories().subscribe((items) => {
      this.lstRoleCategories = items;
      this.selectedCategory = this.lstRoleCategories[0].id;
      this.roleService
        .GetRolesByRoleCategoryId(Number(this.selectedCategory))
        .subscribe((roles) => {
          this.lstRoles = roles;

          this.lstRoles2 = roles;
        });
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



    // if (this.userObj.hospitalId > 0) {
    //   //  this.getUnregisteredEmployees(this.userObj.hospitalId);
    // }


    this.engineerService.GetUnregisteredEngineerUsers().subscribe(usrs => {
      this.lstUnregisteredEngineers = usrs;
    })
  }


  selectedRoles($event) {
    if ($event.checked) {
      this.addRoles.push($event.source.value);
    }
    else {
      var index = this.addRoles.indexOf($event.source.value);
      var roleindex = this.lstEditRoles.indexOf($event.source.value);
      this.addRoles.splice(index, 1);
    }
  }

  removeRoleFromObjectArray(doc) {
    const index: number = this.lstEditRoles.indexOf(doc);
    if (index !== -1) {
      this.lstEditRoles.splice(index, 1);
    }
  }
  onTypeChange($event) {
    let typeId = $event.value;
    this.selectedHospitalType = typeId;
    if (typeId == 1) {
      this.showGov = true;
      this.showCity = true;
      this.showOrg = false;
      this.showSubOrg = false;
      this.showHospitals = true;
    }
    if (typeId == 2) {
      this.showGov = false;
      this.showCity = false;
      this.showOrg = true;
      this.showSubOrg = true;
      this.showHospitals = true;
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
      this.showVisits = false;
      this.showRadioHospitals = false;

    }

    if ($event.value == '2') {
      this.showGov = false;
      this.showCity = false;
      this.showOrg = true;
      this.showSubOrg = false;
      this.showHospitals = false;
      this.showEmployees = false;
      this.showMembers = false;
      this.showSuppliers = false;
      this.showVisits = false;

    }
    if ($event.value == '3') {
      this.showGov = true;
      this.showCity = false;
      this.showOrg = false;
      this.showSubOrg = false;
      this.showHospitals = false;
      this.showEmployees = false;
      this.showMembers = false;
      this.showSuppliers = false;
      this.showVisits = false;


    }

    if ($event.value == '4') {
      this.showGov = true;
      this.showCity = true;
      this.showOrg = false;
      this.showSubOrg = false;
      this.showHospitals = false;
      this.showEmployees = false;
      this.showRoles = true;
      this.showMembers = false;
      this.showSuppliers = false;
      this.showVisits = false;

    }

    if ($event.value == '5') {
      this.selectedHospitalType = 1;
      this.showGov = true;
      this.showCity = true;
      this.showOrg = false;
      this.showSubOrg = false;
      this.showHospitals = true;
      this.showRadioHospitals = true;
      this.showEmployees = true;
      this.showRoles = true;
      this.showMembers = false;
      this.showSuppliers = false;
      this.showVisits = false;

    }

    if ($event.value == '6') {
      this.selectedHospitalType = 1;
      this.showGov = false;
      this.showCity = false;
      this.showOrg = true;
      this.showHospitals = false;
      this.showSubOrg = true;
      this.showRadioHospitals = false;
      this.showEmployees = false;
      this.showSuppliers = false;
      this.showVisits = false;


    }

    if ($event.value == '7') {
      this.showGov = false;
      this.showCity = false;
      this.showOrg = false;
      this.showSubOrg = false;
      this.showHospitals = false;
      this.showEmployees = false;
      this.showRoles = false;
      this.showSuppliers = true;
      this.showMembers = false;
      this.showVisits = false;

    }
    if ($event.value == '8') {

      this.showGov = false;
      this.showCity = false;
      this.showOrg = false;
      this.showSubOrg = false;
      this.showHospitals = false;
      this.showEmployees = false;
      this.showSuppliers = false;
      this.showMembers = true;
      this.showVisits = false;

    }
    if ($event.value == '9') {

      this.showGov = false;
      this.showCity = false;
      this.showOrg = false;
      this.showSubOrg = false;
      this.showHospitals = false;
      this.showEmployees = false;
      this.showSuppliers = false;
      this.showMembers = false;
      this.showVisits = true;
    }
  }
  changeUnregiteredValue($event) {
    const email = $event.target.value;
    this.userObj.email = email;
    this.userObj.userName = this.userObj.email.split('@')[0].trim();
  }

  getEmployeesByHospitalId($event) {
    this.employeeService.GetUnregisteredUsers($event.target.value).subscribe((items) => {
      this.lstUnregisteredUsers = items;
    });
  }




  getCitiesByGovId(govId: number) {
    this.cityService.GetCitiesByGovernorateId(govId).subscribe((cities) => {
      this.lstCities = cities;
    });
  }
  getHospitalsByCityId($event) {
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
    this.hospitalService
      .GetHospitalsBySubOrganizationId($event.target.value)
      .subscribe((hospitals) => {
        this.lstHospitals = hospitals;
      });
  }

  onSubmit() {

    this.userObj.roleCategoryId = this.selectedCategory;
    this.userObj.roleIds = this.addRoles;
    if (this.userObj.roleIds.length == 0) {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = 'Please select at least one Role';
      }
      else {
        this.errorMessage = 'من فضلك اختر أحد المهام';
      }
      return false;
    }


    if (this.selectedCategory == 1) {
      this.userObj.roleIds = this.addRoles;
      this.userService.AddUser(this.userObj).subscribe((user) => {
        this.display = true;
      },
        error => {
          this.errorDisplay = true;
          if (this.lang == 'en') {
            if (error.error.status == 'Error') {
              this.errorMessage = error.error.message;
            }
          }
          else {
            if (error.error.status == 'Error') {
              this.errorMessage = error.error.messageAr;
            }
          }
          return false;
        });

    }
    if (this.selectedCategory == 2) {
      if (this.userObj.organizationId == 0) {
        alert('Please select organization');
        return false;
      }
      else {
        this.userObj.roleIds = this.addRoles;
        this.userService.AddUser(this.userObj).subscribe((user) => {
          this.display = true;
        }, error => {
          this.errorDisplay = true;
          this.errorMessage = error.error.message;
          return false;
        });
      }
    }
    if (this.selectedCategory == 3) {
      if (this.userObj.governorateId == 0) {
        this.errorDisplay = true;
        this.errorMessage = "Please select governorate";
        return false;
      } else {

        this.userObj.roleIds = this.addRoles;
        this.userService.AddUser(this.userObj).subscribe((user) => {
          this.display = true;
        }, error => {
          this.displayerror = true;
          this.errorMessage = error.error.message;
          return false;
        });
      }
    }
    if (this.selectedCategory == 4) {
      if (this.userObj.governorateId == 0) {
        this.errorDisplay = true;
        this.errorMessage = 'Please select governorate';
        return false;
      }
      if (this.userObj.cityId == 0) {
        this.errorDisplay = true;
        this.errorMessage = 'Please select city';
        return false;
      } else {

        this.userObj.roleIds = this.addRoles;
        this.userService.AddUser(this.userObj).subscribe((user) => {
          this.display = true;
        }, error => {
          this.errorDisplay = true;
          this.errorMessage = error.error.message;
          return false;
        });
      }
    }
    if (this.selectedCategory == 5) {
      if (this.selectedHospitalType == 1) {
        if (this.userObj.governorateId == 0) {
          this.errorDisplay = true;
          this.errorMessage = 'Please select governorate';
          return false;
        }
        if (this.userObj.cityId == 0) {
          this.errorDisplay = true;
          this.errorMessage = 'Please select city';
          return false;
        } else {
          this.userObj.roleIds = this.addRoles;
          this.userService.AddUser(this.userObj).subscribe((user) => {
            this.display = true;
          }, error => {
            this.errorDisplay = true;
            this.errorMessage = error.error.message;
            return false;
          });
        }
      }

      if (this.selectedHospitalType == 2) {
        if (this.userObj.organizationId == 0) {
          this.errorDisplay = true;
          if (this.lang == "en") {
            this.errorMessage = 'Please select Organization';
          } else {
            this.errorMessage = 'من فضلك اختر هيئة';
          }
          return false;
        }
        if (this.userObj.subOrganizationId == 0) {
          this.errorDisplay = true;
          if (this.lang == "en") {
            this.errorMessage = 'Please select sub Organization';
          }
          else {
            this.errorMessage = 'من فضلك اختر هيئة فرعية';
          }
          return false;
        } else {

          this.userObj.roleIds = this.addRoles;
          this.userService.AddUser(this.userObj).subscribe((user) => {
            this.display = true;
          }, error => {
            this.errorDisplay = true;
            this.errorMessage = error.error.message;
            return false;
          });
        }
      }
    }
    if (this.selectedCategory == 6) {

      if (this.userObj.organizationId == 0) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = 'Please select Organization';
        } else {
          this.errorMessage = 'من فضلك اختر هيئة';
        }
        return false;
      }
      if (this.userObj.subOrganizationId == 0) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = 'Please select sub Organization';
        }
        else {
          this.errorMessage = 'من فضلك اختر هيئة فرعية';
        }
        return false;
      } else {

        this.userObj.roleIds = this.addRoles;
        this.userService.AddUser(this.userObj).subscribe((user) => {
          this.display = true;
        }, error => {
          this.errorDisplay = true;
          this.errorMessage = error.error.message;
          return false;
        });
      }

    }
    if (this.selectedCategory == 7) {
      if (this.userObj.supplierId == 0) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = 'Please select supplier';
        }
        else {
          this.errorMessage = 'من فضلك اختر مورد';
        }
        return false;
      }
      else {
        this.userObj.roleIds = this.addRoles;
        this.userService.AddUser(this.userObj).subscribe((user) => {
          this.display = true;
        }, error => {
          this.errorDisplay = true;
          this.errorMessage = error.error.message;
          return false;
        });
      }
    }
    if (this.selectedCategory == 8) {
      if (this.userObj.commetieeMemberId == 0) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = 'Please select commetiee member';
        }
        else {
          this.errorMessage = 'من فضلك اختر عضو لجنة';
        }
        return false;
      }
      else {
        this.userObj.roleIds = this.addRoles;
        this.userService.AddUser(this.userObj).subscribe((user) => {
          this.display = true;
        }, error => {
          this.errorDisplay = true;
          this.errorMessage = error.error.message;
          return false;
        });
      }
    }
    if (this.selectedCategory == 9) {
      if (this.userObj.email2 == '') {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = 'Please select engineer';
        }
        else {
          this.errorMessage = 'من فضلك اختر مهندس';
        }
        return false;
      }
      else {
        this.userObj.roleIds = this.addRoles;
        this.userObj.email = this.userObj.email2;
        this.userService.AddUser(this.userObj).subscribe((user) => {
          this.display = true;
        }, error => {
          this.errorDisplay = true;
          this.errorMessage = error.error.message;
          return false;
        });
      }
    }


  }
  back() { this.route.navigate(['/dash/users']); }
  changeUnregiteredEngineer($event) {
    const email = $event.target.value;
    this.engineerService.GetEngineerByEmail(email).subscribe(engObj => {
      this.userObj.email2 = email;
      this.userObj.phoneNumber = engObj.phone;
      this.userObj.userName = engObj.email.split('@')[0].trim();
    });

  }
}
