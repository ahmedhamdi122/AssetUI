import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditRoleCategoryVM } from 'src/app/Shared/Models/rolecategoryVM';
import { RoleCategoryService } from 'src/app/Shared/Services/rolecategory.service';

@Component({
  selector: 'app-deleteconfirmation',
  templateUrl: './deleteconfirmation.component.html',
  styleUrls: ['./deleteconfirmation.component.css']
})
export class DeleteconfirmationComponent implements OnInit {

  public lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  roleCategoryObj: EditRoleCategoryVM = { id: 0, name: '', nameAr: '', orderId: 0 };
  id: number = 0;
  name = ""
  arabicName = ""
  message = ""
  action: any;
  errorMessage: string;
  errorDisplay: boolean = false;

  constructor(private roleCategoryService: RoleCategoryService, public dialog: MatDialogRef<DeleteconfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar) {

    this.roleCategoryObj = { ...data };
    this.id = this.roleCategoryObj.id;
    if (this.lang == "en") {
      this.name = this.roleCategoryObj.name;
    }
    else {
      this.name = this.roleCategoryObj.nameAr;
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
    this.roleCategoryService.DeleteRoleCategory(this.id).subscribe(deleted => {
      this.message = 'Data is deleted successfully';
      this.action = "close";
      this._snackBar.open(this.message, this.action, {
        panelClass: 'snackbar'
      });

      this.dialog.close();
    }, (error) => {
      this.errorDisplay = true;
      if (this.lang == 'en') {
        if (error.error.status == 'role') {
          this.errorMessage = error.error.message;
        }
      }
      if (this.lang == 'ar') {
        if (error.error.status == 'role') {
          this.errorMessage = error.error.messageAr;
        }
      }
      return false;
    });


  }
}
