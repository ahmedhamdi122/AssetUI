import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { ListRoleCategoriesVM } from 'src/app/Shared/Models/rolecategoryVM';
import { CreateRoleVM } from 'src/app/Shared/Models/roleVM';
import { RoleService } from 'src/app/Shared/Services/role.service';
import { RoleCategoryService } from 'src/app/Shared/Services/rolecategory.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  public lang = localStorage.getItem("lang");

  form: FormGroup;
  roleObj: CreateRoleVM;
  lstRoleCategories: ListRoleCategoriesVM[] = [];
  errorMessage: string ;
  errorDisplay: boolean = false;


  constructor(private roleService: RoleService, private rolecategoryService: RoleCategoryService,private route: Router, private formBuilder: FormBuilder) {

    this.roleObj = {name: '', displayName: '',roleCategoryId:0  }
    this.form = this.formBuilder.group({
      name: [null, Validators.required],
      displayName:[null, Validators.required],
    });
  }


  ngOnInit(): void {

    this.rolecategoryService.GetRoleCategories().subscribe(items => {
      this.lstRoleCategories = items;
    });
  }

  changeRoleCategoryId($event:any)
  {
    this.roleObj.roleCategoryId = Number($event.target.value);
  }


  onSubmit() {
    if(this.roleObj.roleCategoryId == 0)
    {
      if(this.lang == "en")
      {
        this.errorDisplay = true;
     this.errorMessage ="Please select category";
     return false;
      }

      if(this.lang == "ar")
      {
        this.errorDisplay = true;
        this.errorMessage ="من فضلك اختر فئة";
        return false;
      }
    }
    else
    {
        this.roleService.AddRole(this.roleObj).subscribe(result => {
        this.route.navigate(['/dash/roles']);
      });
    }
  }

  reset(){  this.roleObj = { name: '',roleCategoryId:0,displayName:'' }}
  
  back(){  this.route.navigate(['/dash/roles']);}
  
}
