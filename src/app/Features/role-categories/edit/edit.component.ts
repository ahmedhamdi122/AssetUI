import { noUndefined } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EditRoleCategoryVM } from 'src/app/Shared/Models/rolecategoryVM';
import { RoleCategoryService } from 'src/app/Shared/Services/rolecategory.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {


  frm: FormGroup;
  roleCategoryObj: EditRoleCategoryVM;
  selectedlang: string = '';
  constructor(private roleCategoryService: RoleCategoryService, private formBuilder: FormBuilder, private config: DynamicDialogConfig, private ref: DynamicDialogRef) {
  }

  ngOnInit(): void {

    this.frm = this.formBuilder.group({
      name: [null, Validators.required],
      nameAr: [null, Validators.required],
      orderId: [null, Validators.required]
    });

    if (this.config.data != null || this.config.data != undefined) {
      let id = this.config.data.id;
      this.roleCategoryService.GetRoleCategoryById(id).subscribe(
        (data => {
          this.roleCategoryObj = data;
        }), (error => console.log(error)));
    }
  }

  onSubmit() {
    if (this.frm.valid) {
      this.roleCategoryService.UpdateRoleCategory(this.roleCategoryObj).subscribe(() => {
        this.ref.close();
      });
    }
  }

  reset() {
    this.roleCategoryObj = { name: '', nameAr: '', id: 0, orderId: 0 }
  }

}
