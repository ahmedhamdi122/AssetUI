import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MasterAssetVM } from 'src/app/Shared/Models/MasterAssetVM';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';

@Component({
  selector: 'app-deleteconfirmation',
  templateUrl: './deleteconfirmation.component.html',
  styleUrls: ['./deleteconfirmation.component.css']
})
export class DeleteconfirmationComponent implements OnInit {

  public lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  masterAssetObj: MasterAssetVM;
  id: number;
  name = ""
  arabicName = ""
  message = ""
  action: any
  constructor(private masterAssetService: MasterAssetService, public dialog: MatDialogRef<DeleteconfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, private route: Router) {
    this.masterAssetObj = { ...data };
    this.id = this.masterAssetObj.id;
    //  this.name = this.masterAssetObj.name;




    if (this.lang == "en") {
      this.name = this.masterAssetObj.name;
    }
    else {
      this.name = this.masterAssetObj.nameAr;
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
    this.route.navigate(['/dash/assets']);
  }
  delete(): void {
    this.masterAssetService.DeleteMasterAsset(this.id).subscribe(deleted => {
      this.message = 'Data is deleted successfully';
      this.action = "close";
      this._snackBar.open(this.message, this.action, { panelClass: 'snackbar' });
      this.dialog.close();
    },
      (error) => {
        if (this.lang == 'en') {
          if (error.error.status == 'code') {
            this.message = error.error.message;
            this.action = "close";
            this._snackBar.open(this.message, this.action, { panelClass: 'snackbar' });
          }
        }
        if (this.lang == 'ar') {
          if (error.error.status == 'code') {
            this.message = error.error.messageAr;
            this.action = "إغلاق";
            this._snackBar.open(this.message, this.action, { panelClass: 'snackbar' });
          }
        }
        return false;
      });
  }


}
