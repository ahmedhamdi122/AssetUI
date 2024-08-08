import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ListCategoryVM } from 'src/app/Shared/Models/categoryVM';
import { CreateSubCategoryVM } from 'src/app/Shared/Models/subCategoryVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { CategoryService } from 'src/app/Shared/Services/category.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { SubCategoryService } from 'src/app/Shared/Services/subcategory.service';

@Component({
  selector: 'app-create-sub-category',
  templateUrl: './create-sub-category.component.html',
  styleUrls: ['./create-sub-category.component.css']
})
export class CreateSubCategoryComponent implements OnInit {
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser
  subCategoryObj: CreateSubCategoryVM;
  lstCategories: ListCategoryVM[] = [];
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  constructor(private authenticationService: AuthenticationService, private subCategoryService: SubCategoryService,
    private categoryService: CategoryService, private config: DynamicDialogConfig, private route: Router
  ) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.subCategoryObj = { code: '', name: '', nameAr: '', categoryId: 0 };
    this.categoryService.GetCategories().subscribe(categories => {
      this.lstCategories = categories;
    });

    let cateId = this.config.data.cateId;

    if (cateId != null) {
      this.subCategoryObj.categoryId = cateId;
    }
    else {
      this.subCategoryObj.categoryId = 0;
    }

  }


  onCategoryChange($event) {
    this.subCategoryObj.categoryId = $event.target.value;
  }
  onSubmit() {

    this.subCategoryService.CreateSubCategory(this.subCategoryObj).subscribe(addedObj => {
      this.display = true;
      this.route.navigate(['/subCategories/'])
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
}
