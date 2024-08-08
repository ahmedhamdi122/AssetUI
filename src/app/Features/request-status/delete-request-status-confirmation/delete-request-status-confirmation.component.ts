import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IndexRequestStatus } from 'src/app/Shared/Models/RequestStatusVM';
import { RequestStatusService } from 'src/app/Shared/Services/request-status.service';

@Component({
  selector: 'app-delete-request-status-confirmation',
  templateUrl: './delete-request-status-confirmation.component.html',
  styleUrls: ['./delete-request-status-confirmation.component.css']
})
export class DeleteRequestStatusConfirmationComponent implements OnInit {

  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  requestStatusObj: IndexRequestStatus;
  id: number;
  name = ""
  arabicName = ""
  message = ""
  action: any;
  errorMessage: string;
  errorDisplay: boolean = false;
  constructor(private RequestStatusService: RequestStatusService, public dialog: MatDialogRef<DeleteRequestStatusConfirmationComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar) {
    this.requestStatusObj = { ...data };
    this.id = this.requestStatusObj.id;
    this.name = this.requestStatusObj.name;
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
    this.RequestStatusService.DeleteRequestStatus(this.id).subscribe(deleted => {
      this.message = 'Data is deleted successfully';
      this.action = "close";
      this._snackBar.open(this.message, this.action, { panelClass: 'snackbar' });
      this.dialog.close();
    }, (error) => {
      this.errorDisplay = true;

      if (this.lang == 'en') {
        if (error.error.status == 'reqStatus') {
          this.errorMessage = error.error.message;
        }
        //  if (error.error.status == 'name') {
        //   this.errorMessage = error.error.message;
        // }
        // if (error.error.status == 'nameAr') {
        //   this.errorMessage = error.error.message;
        // }
      } if (this.lang == 'ar') {
        if (error.error.status == 'reqStatus') {
          this.errorMessage = error.error.messageAr;
        }

        // if (error.error.status == 'name') {
        //   this.errorMessage = error.error.messageAr;
        // }
        // if (error.error.status == 'nameAr') {
        //   this.errorMessage = error.error.messageAr;
        // }
      }
      return false;
    });



  }
}

