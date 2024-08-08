import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditAssetStatusVM } from 'src/app/Shared/Models/assetStatusVM';
import { AssetStatusService } from 'src/app/Shared/Services/assetStatus.service';

@Component({
  selector: 'app-delete-assets-status-confirmation',
  templateUrl: './delete-assets-status-confirmation.component.html',
  styleUrls: ['./delete-assets-status-confirmation.component.css']
})
export class DeleteAssetsStatusConfirmationComponent implements OnInit {

  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  AssetStatusObj: EditAssetStatusVM;
  //nameVariable=""
  id: number;
  name = ""
  arabicName = ""
  message = ""
  action: any;
  errorMessage: string;
  errorDisplay: boolean = false;
  constructor(private assetStatusService: AssetStatusService, public dialog: MatDialogRef<DeleteAssetsStatusConfirmationComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, private router: Router) {
    this.AssetStatusObj = { ...data };
    this.id = this.AssetStatusObj.id;
    if (this.lang == "en") {
      this.name = this.AssetStatusObj.name;
      //this.nameVariable=this.name;
    }
    else {
      this.name = this.AssetStatusObj.nameAr;
      //this.nameVariable=this.name;
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
    this.assetStatusService.DeleteAssetStatus(this.id).subscribe(deleted => {
      this.message = 'Data is deleted successfully';
      this.action = "close";
      this._snackBar.open(this.message, this.action, { panelClass: 'snackbar' });
      this.dialog.close();
    }, (error) => {
      this.errorDisplay = true;

      if (this.lang == 'en') {
        if (error.error.status == 'name') {
          this.errorMessage = error.error.message;
        }
        if (error.error.status == 'nameAr') {
          this.errorMessage = error.error.message;
        }
      } if (this.lang == 'ar') {
        if (error.error.status == 'name') {
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
