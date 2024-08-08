import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ListCategoryTypeVM } from 'src/app/Shared/Models/categoryTypeVM';
import { CreateCategoryVM } from 'src/app/Shared/Models/categoryVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { CategoryService } from 'src/app/Shared/Services/category.service';
import { CategoryTypeService } from 'src/app/Shared/Services/categoryType.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  cateObj: CreateCategoryVM;
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  lstTypes: ListCategoryTypeVM[] = [];
  selectedTypeId: number;

  constructor(private authenticationService: AuthenticationService, private categoryService: CategoryService,
    private route: Router, private categoryTypeService: CategoryTypeService, private config: DynamicDialogConfig
  ) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.cateObj = { code: '', name: '', nameAr: '', categoryTypeId: 0 }
    this.categoryTypeService.GetCategoryTypes().subscribe(types => { this.lstTypes = types })


    let typeId = this.config.data.typeId;

    this.selectedTypeId = typeId;
    if (typeId != null) {
      this.cateObj.categoryTypeId = this.selectedTypeId;
    }
    else {
      this.cateObj.categoryTypeId = 0;
    }

  }
  onSubmit() {

    this.categoryService.CreateCategory(this.cateObj).subscribe(addedObj => {
      this.display = true;
      //this.route.navigate(['/categories/'])
    },
      (error) => {
        this.errorDisplay = true;
        if (this.lang == 'en') {
          if (error.error.status == 'code') {
            this.errorMessage = error.error.message;
          }
          if (error.error.status == 'name') {
            this.errorMessage = error.error.message;
          } if (error.error.status == 'nameAr') {
            this.errorMessage = error.error.message;
          }
        }
        if (this.lang == 'ar') {
          if (error.error.status == 'code') {
            this.errorMessage = error.error.messageAr;
          }
          if (error.error.status == 'name') {
            this.errorMessage = error.error.messageAr;
          }
          if (error.error.status == 'nameAr') {
            this.errorMessage = error.error.messageAr;
          }
        }
        return false;
      });
  }
  reset() {
    this.cateObj = { code: '', name: '', nameAr: '', categoryTypeId: 0 }
  }
}
