import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditECRIVM } from 'src/app/Shared/Models/ecriVM';
import { ECRIService } from 'src/app/Shared/Services/ecri.service';

@Component({
  selector: 'app-delete-ecri-confirmation',
  templateUrl: './delete-ecri-confirmation.component.html',
  styleUrls: ['./delete-ecri-confirmation.component.css']
})
export class DeleteEcriConfirmationComponent implements OnInit {
  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  ecriObj: EditECRIVM;
  id: number;
  name = ""
  arabicName = ""
  message = ""
  action: any;
  errorMessage: string;
  errorDisplay: boolean = false;
  constructor(private ecriService: ECRIService, public dialog: MatDialogRef<DeleteEcriConfirmationComponent>,
    
    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, private route: Router) {
    this.ecriObj = { ...data };
    this.id = this.ecriObj.id;
    if (this.lang == "en") {
      this.name = this.ecriObj.name;
    }
    else {
      this.name = this.ecriObj.nameAr;
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
    this.ecriService.DeleteECRI(this.id).subscribe(deleted => {
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

