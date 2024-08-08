import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';

@Component({
  selector: 'app-deleteconfirmation',
  templateUrl: './deleteconfirmation.component.html',
  styleUrls: ['./deleteconfirmation.component.css']
})
export class DeleteconfirmationComponent implements OnInit {


  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  hospitalObj: HospitalVM;
  id: number;
  name = ""
  arabicName = ""
  message = ""
  action: any;

  errorMessage: string;
  errorDisplay: boolean = false;


  constructor(private hospitalService: HospitalService, public dialog: MatDialogRef<DeleteconfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, private route: Router) {
    this.hospitalObj = { ...data };
    this.id = this.hospitalObj.id;
    // this.name = this.hospitalObj.name;





    if (this.lang == "en") {
      this.name = this.hospitalObj.name;
    }
    else {
      this.name = this.hospitalObj.nameAr;
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
    this.hospitalService.DeleteHospital(this.id).subscribe(deleted => {
      this.message = 'Data is deleted successfully';
      this.action = "close";
      this._snackBar.open(this.message, this.action, { panelClass: 'snackbar' });
      this.dialog.close();
    }, (error) => {
      this.errorDisplay = true;
      if (this.lang == 'en') {
        if (error.error.status == 'build') {
          this.errorMessage = error.error.message;
        }
        if (error.error.status == 'asset') {
          this.errorMessage = error.error.message;
        }
        if (error.error.status == 'emp') {
          this.errorMessage = error.error.message;
        }
      }
      if (this.lang == 'ar') {
        if (error.error.status == 'build') {
          this.errorMessage = error.error.messageAr;
        }
        if (error.error.status == 'asset') {
          this.errorMessage = error.error.messageAr;
        }
        if (error.error.status == 'asset') {
          this.errorMessage = error.error.messageAr;
        }
      }
      return false;
    });
  }


}
