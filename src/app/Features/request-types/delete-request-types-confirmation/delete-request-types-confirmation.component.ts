import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditRequestTypeVM } from 'src/app/Shared/Models/ProjectTypeVM';
import { RequestTypeService } from 'src/app/Shared/Services/request-type.service';

@Component({
  selector: 'app-delete-request-types-confirmation',
  templateUrl: './delete-request-types-confirmation.component.html',
  styleUrls: ['./delete-request-types-confirmation.component.css']
})
export class DeleteRequestTypesConfirmationComponent implements OnInit {
  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  requestTypeObj: EditRequestTypeVM;
  id: number;
  name = ""
  arabicName = ""
  message = ""
  action: any;
  errorMessage: string;
  errorDisplay: boolean = false;
  constructor(private RequestTypeService: RequestTypeService, public dialog: MatDialogRef<DeleteRequestTypesConfirmationComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, private route: Router) {
    this.requestTypeObj = { ...data };
    this.id = this.requestTypeObj.id;
    this.name = this.requestTypeObj.name;
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
    this.RequestTypeService.DeleteRequestType(this.id).subscribe(deleted => {
      this.message = 'Data is deleted successfully';
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

