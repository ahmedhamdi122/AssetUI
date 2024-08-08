import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';

@Component({
  selector: 'app-deleteconfirmation',
  templateUrl: './deleteconfirmation.component.html',
  styleUrls: ['./deleteconfirmation.component.css']
})
export class DeleteconfirmationComponent implements OnInit {


  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  govObj: EditGovernorateVM;
  id: number;
  name = ""
  arabicName = ""
  message = ""
  action: any;
  errorMessage: string;
  errorDisplay: boolean = false;
  constructor(private governorateService: GovernorateService, public dialog: MatDialogRef<DeleteconfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, private route: Router) {
    this.govObj = { ...data };
    this.id = this.govObj.id;
    if (this.lang == "en") {
      this.name = this.govObj.name;
    }
    else {
      this.name = this.govObj.nameAr;
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
    this.route.navigate(['/dash/governorates']);
  }
  delete(): void {
    this.governorateService.DeleteGovernorate(this.id).subscribe(deleted => {
      this.message = 'Data is deleted successfully';
      this.action = "close";
      this._snackBar.open(this.message, this.action, { panelClass: 'snackbar' });
      this.dialog.close();
    }, (error) => {
      this.errorDisplay = true;

      if (this.lang == 'en') {
        if (error.error.status == 'hospital') {
          this.errorMessage = error.error.message;
        } if (error.error.status == 'city') {
          this.errorMessage = error.error.message;
        }
      } if (this.lang == 'ar') {
        if (error.error.status == 'hospital') {
          this.errorMessage = error.error.messageAr;
        } if (error.error.status == 'city') {
          this.errorMessage = error.error.messageAr;
        }
      }
      return false;
    });



  }


}
