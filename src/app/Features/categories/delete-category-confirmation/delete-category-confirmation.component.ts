import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditCategoryVM } from 'src/app/Shared/Models/categoryVM';
import { CategoryService } from 'src/app/Shared/Services/category.service';

@Component({
  selector: 'app-delete-category-confirmation',
  templateUrl: './delete-category-confirmation.component.html',
  styleUrls: ['./delete-category-confirmation.component.css']
})
export class DeleteCategoryConfirmationComponent implements OnInit {
  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  categoryObj: EditCategoryVM;
  id: number;
  name = ""
  arabicName = ""
  message = ""
  action: any;
  errorMessage: string;
  errorDisplay: boolean = false;
  constructor(private categoryService: CategoryService, public dialog: MatDialogRef<DeleteCategoryConfirmationComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, private route: Router) {
    this.categoryObj = { ...data };
    this.id = this.categoryObj.id;
    if (this.lang == "en") {
      this.name = this.categoryObj.name;
    }
    else {
      this.name = this.categoryObj.nameAr;
    }

  }

  ngOnInit(): void {
    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }
  }
  close(): void {
    this.dialog.close();
    this._snackBar.dismiss();
  }
  delete(): void {
    this.categoryService.DeleteCategory(this.id).subscribe(deleted => {
      if (this.lang == 'en') {
        this.message = 'Data is deleted successfully';
        this.action = "close";
      }
      else {
        this.message = 'تم مسح البيانات بنجاح';
        this.action = "إغلاق";
      }
      this._snackBar.open(this.message, this.action, { panelClass: 'snackbar' });
      this.dialog.close();
    }, (error) => {
      this.errorDisplay = true;

      if (this.lang == 'en') {
        if (error.error.status == 'categories') {
          this.errorMessage = error.error.message;
        }
        if (error.error.status == 'mastercategories') {
          this.errorMessage = error.error.message;
        }
      } if (this.lang == 'ar') {
        if (error.error.status == 'categories') {
          this.errorMessage = error.error.messageAr;
        }
        if (error.error.status == 'mastercategories') {
          this.errorMessage = error.error.messageAr;
        }

      }
      return false;
    });



  }
}
