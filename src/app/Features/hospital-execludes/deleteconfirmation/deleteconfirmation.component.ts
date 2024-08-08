import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditHospitalApplicationVM } from 'src/app/Shared/Models/HospitalApplicationVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { HospitalApplicationService } from 'src/app/Shared/Services/hospitalapplication.service';

@Component({
  selector: 'app-deleteconfirmation',
  templateUrl: './deleteconfirmation.component.html',
  styleUrls: ['./deleteconfirmation.component.css']
})
export class DeleteconfirmationComponent implements OnInit {


  public lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  detailObj: EditHospitalApplicationVM;
  id: number;
  name = "";
  appNumber = "";
  execludeDate = "";
  message = "";
  action: any;
  errorMessage: string;
  errorDisplay: boolean = false;
  assetName: string;

  constructor(private hospitalApplicationService: HospitalApplicationService, private assetDetailSerive: AssetDetailService, public dialog: MatDialogRef<DeleteconfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, private route: Router, private dataPipe: DatePipe) {
    this.detailObj = { ...data };
    this.id = this.detailObj.id;

    this.assetDetailSerive.GetAssetById(this.detailObj.assetId).subscribe(assetObj => {
      this.assetName = this.lang == "en" ? assetObj["assetName"] : assetObj["assetNameAr"];

      this.name = this.assetName + " - " + this.detailObj.appNumber + " - " + this.dataPipe.transform(this.detailObj.appDate, "dd-MM-yyyy");
    });

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
    this.route.navigate(['/dash/hospitalexecludes']);
  }
  delete(): void {
    this.hospitalApplicationService.DeleteHospitalApplication(this.id).subscribe(deleted => {
      this.message = 'Data is deleted successfully';
      this.action = "close";
      this._snackBar.open(this.message, this.action, { panelClass: 'snackbar' });
      this.dialog.close();
    }, (error) => {
      this.errorDisplay = true;
      if (this.lang == 'en') {
        if (error.error.status == 'move') {
          this.errorMessage = error.error.message;
        }
        if (error.error.status == 'request') {
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
      }
      return false;
    });
  }


}
