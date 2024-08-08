import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateRoleCategoryVM } from 'src/app/Shared/Models/rolecategoryVM';
import { RoleCategoryService } from 'src/app/Shared/Services/rolecategory.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  frm: FormGroup;
  roleCategoryObj: CreateRoleCategoryVM;
  showError: boolean = false;
  constructor(private roleCategoryService: RoleCategoryService, private route: Router, private ref: DynamicDialogRef) {

    this.frm = new FormGroup({
      name: new FormControl(null, Validators.required),
      nameAr: new FormControl(null, Validators.required),
      orderId: new FormControl(null, Validators.required)
    });

    this.roleCategoryService.GenerateRoleCategoryOrderId().subscribe(result => {
      this.roleCategoryObj.orderId = result["orderId"];
    });
  }


  ngOnInit(): void {
    this.roleCategoryObj = { name: '', nameAr: '', orderId: 0 }

  }
  onSubmit() {
    if (this.frm.valid) {
      this.showError = false;
      this.roleCategoryService.AddRoleCategories(this.roleCategoryObj).subscribe(result => {
        this.ref.close();
      });
    }
    else {
      this.showError = true;
    }

  }
  reset() {
    this.roleCategoryObj = { name: '', nameAr: '', orderId: 0 };
  }
}
