import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditSubCategoryVM } from 'src/app/Shared/Models/subCategoryVM';
import { SubCategoryService } from 'src/app/Shared/Services/subcategory.service';

@Component({
  selector: 'app-deletesub-category-confirmation',
  templateUrl: './deletesub-category-confirmation.component.html',
  styleUrls: ['./deletesub-category-confirmation.component.css']
})
export class DeletesubCategoryConfirmationComponent implements OnInit {
  public lang = localStorage.getItem("lang");
  textDir: string = 'ltr';

  subCatgoryObj: EditSubCategoryVM;
  id: number;
  name = ""
  arabicName = ""
  message = ""
  action: any;
  errorMessage: string;
  errorDisplay: boolean = false;


  constructor(private subCategoryservice: SubCategoryService, public dialog: MatDialogRef<DeletesubCategoryConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, private route: Router) {
    this.subCatgoryObj = { ...data };
    this.id = this.subCatgoryObj.id;
    if (this.lang == "en") {
      this.name = this.subCatgoryObj.name;
    }
    else {
      this.name = this.subCatgoryObj.nameAr;
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
    this.route.navigate(['/dash/subCategories']);
  }
  delete(): void {
    this.subCategoryservice.DeleteSubCategory(this.id).subscribe(deleted => {
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
        if (error.error.status == 'mastersubcategories') {
          this.errorMessage = error.error.message;
        }
      } if (this.lang == 'ar') {
        if (error.error.status == 'mastersubcategories') {
          this.errorMessage = error.error.messageAr;
        }
      }
      return false;
    });
  }

}

