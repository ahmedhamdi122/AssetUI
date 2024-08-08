import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditCityVM } from 'src/app/Shared/Models/cityVM';
import { CityService } from 'src/app/Shared/Services/city.service';

@Component({
  selector: 'app-deletecityconfirmation',
  templateUrl: './deletecityconfirmation.component.html',
  styleUrls: ['./deletecityconfirmation.component.css']
})
export class DeletecityconfirmationComponent implements OnInit {

  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  cityObj: EditCityVM;
  id: number;
  name = ""
  arabicName = ""
  message = ""
  action: any;
  errorMessage: string;
  errorDisplay: boolean = false;

  constructor(private cityService: CityService, public dialog: MatDialogRef<DeletecityconfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, private route: Router) {
    this.cityObj = { ...data };
    this.id = this.cityObj.id;
    if (this.lang == "en") {
      this.name = this.cityObj.name;
    }
    else {
      this.name = this.cityObj.nameAr;
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
    this.cityService.DeleteCity(this.id).subscribe(deleted => {
      this.message = 'Data is deleted successfully';
      this.action = "close";
      this._snackBar.open(this.message, this.action, { panelClass: 'snackbar' });
      this.dialog.close();
    }, (error) => {
      this.errorDisplay = true;

      if (this.lang == 'en') {
        if (error.error.status == 'hospital') {
          this.errorMessage = error.error.message;
        } if (error.error.status == 'sub') {
          this.errorMessage = error.error.message;
        }
      } if (this.lang == 'ar') {
        if (error.error.status == 'hospital') {
          this.errorMessage = error.error.messageAr;
        } if (error.error.status == 'sub') {
          this.errorMessage = error.error.messageAr;
        }
      }
      return false;
    });



  }

}
