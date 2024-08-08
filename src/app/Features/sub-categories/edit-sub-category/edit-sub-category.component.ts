import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ListCategoryVM } from 'src/app/Shared/Models/categoryVM';
import { EditSubCategoryVM } from 'src/app/Shared/Models/subCategoryVM';
import { CategoryService } from 'src/app/Shared/Services/category.service';
import { SubCategoryService } from 'src/app/Shared/Services/subcategory.service';

@Component({
  selector: 'app-edit-sub-category',
  templateUrl: './edit-sub-category.component.html',
  styleUrls: ['./edit-sub-category.component.css']
})
export class EditSubCategoryComponent implements OnInit {

  public lang = localStorage.getItem("lang");
  errorMessage: string = '';
  errorDisplay: boolean = false;
  display: boolean = false;
  lstCategories: ListCategoryVM[] = [];
  form: FormGroup;
  subCategoryObj: EditSubCategoryVM;
  submitted: boolean = false;
  isValidEMail: boolean = false;
  textDir: string = 'ltr';
  constructor(private subCategoryService: SubCategoryService,
    private categoryService: CategoryService, private route: Router,
    private ref: DynamicDialogRef, private config: DynamicDialogConfig) { }

  ngOnInit(): void {
    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }
    this.subCategoryObj = { code: '', id: 0, name: '', nameAr: '', categoryId: 0 }

    this.categoryService.GetCategories().subscribe(items => {
      this.lstCategories = items;
    });


    let id = this.config.data.id;
    this.subCategoryService.GetSubCategoryById(id).subscribe(
      data => {
        this.subCategoryObj = data

      },
      (error) => {
        this.errorDisplay = true;
        if (this.lang == 'en') {
          if (error.error.status == 'code') {
            this.errorMessage = error.error.message;
          }
          if (error.error.status == 'name') {
            this.errorMessage = error.error.message;
          }
        } if (this.lang == 'ar') {
          if (error.error.status == 'code') {
            this.errorMessage = error.error.messageAr;
          }
          if (error.error.status == 'name') {
            this.errorMessage = error.error.messageAr;
          }
        }
        return false;
      });


  }

  onSubmit() {

    if (this.subCategoryObj.code == '') {
      this.submitted = false;
      return false;
    }
    if (this.subCategoryObj.name == '') {
      this.submitted = false;
      return false;
    } else {
      this.subCategoryService.UpdateSubCategory(this.subCategoryObj).subscribe(result => {
        this.display = true;
        this.ref.close();
      }, (error) => {
        this.errorDisplay = true;

        if (this.lang == 'en') {
          if (error.error.status == 'code') {
            this.errorMessage = error.error.message;
          }
          if (error.error.status == 'name') {
            this.errorMessage = error.error.message;
          }
          if (error.error.status == 'nameAr') {
            this.errorMessage = error.error.message;
          }
        } if (this.lang == 'ar') {
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

  onCategoryChange($event) {
    this.subCategoryObj.categoryId = $event.target.value;
  }

  reset() {
    this.subCategoryObj = {
      id: 0,
      code: '',
      name: '',
      nameAr: '', categoryId: 0
    };
  }


}
