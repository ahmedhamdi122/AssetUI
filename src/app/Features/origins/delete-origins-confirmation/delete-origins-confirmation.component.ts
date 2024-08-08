import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditOriginVM } from 'src/app/Shared/Models/originVM';
import { OriginService } from 'src/app/Shared/Services/origin.service';

@Component({
  selector: 'app-delete-origins-confirmation',
  templateUrl: './delete-origins-confirmation.component.html',
  styleUrls: ['./delete-origins-confirmation.component.css']
})
export class DeleteOriginsConfirmationComponent implements OnInit {
  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  originObj: EditOriginVM;
  id: number;
  name = ""
  arabicName = ""
  message = ""
  action: any;
  errorMessage: string;
  errorDisplay: boolean = false;
  constructor(private originService: OriginService, public dialog: MatDialogRef<DeleteOriginsConfirmationComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, private route: Router) {
    this.originObj = { ...data };
    this.id = this.originObj.id;
    if (this.lang == "en") {
      this.name = this.originObj.name;
    }
    else {
      this.name = this.originObj.nameAr;
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
    this.originService.DeleteOrigin(this.id).subscribe(deleted => {
      this.message = this.lang == "en" ? this.message = 'Data is deleted successfully' : 'تم مسح البيانات بنجاح';

      this.action = "close";
      this._snackBar.open(this.message, this.action, { panelClass: 'snackbar' });
      this.dialog.close();
    }, (error) => {
      this.errorDisplay = true;

      if (this.lang == 'en') {
        if (error.error.status == 'code') {
          this.errorMessage = error.error.message;
        } if (error.error.status == 'name') {
          this.errorMessage = error.error.message;
        }
        if (error.error.status == 'nameAr') {
          this.errorMessage = error.error.message;
        }
      } if (this.lang == 'ar') {
        if (error.error.status == 'code') {
          this.errorMessage = error.error.messageAr;
        } if (error.error.status == 'name') {
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

