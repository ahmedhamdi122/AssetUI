import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { AlertdeleteComponent } from 'src/app/Features/hospital-assets/alertdelete/alertdelete.component'

@Component({
  selector: 'app-deleteconfirmation',
  templateUrl: './deleteconfirmation.component.html',
  styleUrls: ['./deleteconfirmation.component.css']
})
export class DeleteconfirmationComponent implements OnInit {

  public lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  assetDetailObj: AssetDetailVM;
  id: number;
  name = ""
  arabicName = ""
  message = ""
  action: any;
  errorMessage: string;
  errorDisplay: boolean = false;

  constructor(private assetDetailService: AssetDetailService, public dialog: MatDialogRef<DeleteconfirmationComponent>,
    private dialog2: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, private route: Router) {
    this.assetDetailObj = { ...data };
    this.id = this.assetDetailObj.id;
    if (this.lang == "en") {
      this.name = this.assetDetailObj.name;
    }
    else {
      this.name = this.assetDetailObj.nameAr;
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
    this.route.navigate(['/dash/hospitalassets']);
  }
  delete(): void {
    this.assetDetailService.DeleteAsset(this.id).subscribe(deleted => {
      this.message = 'Data is deleted successfully';
      this.action = "close";
      this._snackBar.open(this.message, this.action, { panelClass: 'snackbar' });
      this.dialog.close();
    }, (error) => {
      // this.errorDisplay = true;
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


      const dialogRef2 = this.dialog2.open(AlertdeleteComponent, {
        width: '30%',
        autoFocus: true,
        data: {
          message: this.errorMessage,
        },
      });
      dialogRef2.afterClosed().subscribe(deleted => {
        this.dialog.close();
        this.route.navigate(['/dash/hospitalassets']);
      });


      return false;
    });
  }



}
