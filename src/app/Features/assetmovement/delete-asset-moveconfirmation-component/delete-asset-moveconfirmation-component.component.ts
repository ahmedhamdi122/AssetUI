import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditAssetMovementVM, ListAssetMovementVM } from 'src/app/Shared/Models/assetMovementVM';
import { AssetMovementService } from 'src/app/Shared/Services/assetMovement.service';

@Component({
  selector: 'app-delete-asset-moveconfirmation-component',
  templateUrl: './delete-asset-moveconfirmation-component.component.html',
  styleUrls: ['./delete-asset-moveconfirmation-component.component.css']
})
export class DeleteAssetMoveconfirmationComponentComponent implements OnInit {


  public lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  assetMovementObj: EditAssetMovementVM;
  id: number;
  name = ""
  arabicName = ""
  message = ""
  action: any;
  errorMessage: string;
  errorDisplay: boolean = false;

  constructor(private assetMovementService: AssetMovementService, public dialog: MatDialogRef<DeleteAssetMoveconfirmationComponentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, private route: Router) {
    this.assetMovementObj = { ...data };
    this.id = this.assetMovementObj.id;
    console.log("xx", this.assetMovementObj);
    this.name = this.lang == "en" ? this.assetMovementObj.assetName : this.assetMovementObj.assetNameAr;

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
    this.assetMovementService.DeleteAssetMovement(this.id).subscribe(deleted => {
      this.message = 'Data is deleted successfully';
      this.action = "close";
      this._snackBar.open(this.message, this.action, { panelClass: 'snackbar' });
      this.dialog.close();
    }, (error) => {
      if (this.lang == 'en') {
        if (error.error.status == 'move') {
          this.errorMessage = error.error.message;
        }
        if (error.error.status == 'request') {
          this.errorMessage = error.error.message;
        }
        if (error.error.status == 'wo') {
          this.errorMessage = error.error.message;
        }
      }
      if (this.lang == 'ar') {
        if (error.error.status == 'move') {
          this.errorMessage = error.error.messageAr;
        }
        if (error.error.status == 'request') {
          this.errorMessage = error.error.messageAr;
        }
        if (error.error.status == 'wo') {
          this.errorMessage = error.error.messageAr;
        }
      }
      return false;
    });
  }

}
