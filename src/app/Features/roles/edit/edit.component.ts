import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ListRoleCategoriesVM } from 'src/app/Shared/Models/rolecategoryVM';
import { EditRoleVM } from 'src/app/Shared/Models/roleVM';
import { RoleService } from 'src/app/Shared/Services/role.service';
import { RoleCategoryService } from 'src/app/Shared/Services/rolecategory.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  public lang = localStorage.getItem('lang');
  lstRoleCategories: ListRoleCategoriesVM[] = [];
  errorMessage: string;
  errorDisplay: boolean = false;

  frm: FormGroup;
  roleObj: EditRoleVM;

  constructor(
    private roleService: RoleService,
    private rolecategoryService: RoleCategoryService,
    private route: Router,
    private activeRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.rolecategoryService.GetRoleCategories().subscribe((items) => {
      this.lstRoleCategories = items;
    });

    this.roleObj = { name: '', displayName: '', id: '', roleCategoryId: 0 };
    this.frm = this.formBuilder.group({
      name: ['', Validators.required],
      displayName: ['', Validators.required],
    });

    let id = this.activeRoute.snapshot.params['roleId'];
    this.roleService.GetRoleById(id).subscribe(
      (data) => {
        this.roleObj = data;
      },
      (error) => console.log(error)
    );
  }

  changeRoleCategoryId($event: any) {
    this.roleObj.roleCategoryId = Number($event.target.value);
  }

  onSubmit() {
    if (this.roleObj.roleCategoryId == 0) {
      if (this.lang == 'en') {
        this.errorDisplay = true;
        this.errorMessage = 'Please select category';
        return false;
      }

      if (this.lang == 'ar') {
        this.errorDisplay = true;
        this.errorMessage = 'من فضلك اختر فئة';
        return false;
      }
    } else {
      if (this.frm.valid) {
        this.roleService.UpdateRole(this.roleObj).subscribe(() => {
          this.route.navigate(['/dash/roles']);
        });
      }
    }
  }

  reset() {
    this.roleObj = { name: '', displayName: '', id: '', roleCategoryId: 0 };
  }
  back(){  this.route.navigate(['/dash/roles']);}
  
}
