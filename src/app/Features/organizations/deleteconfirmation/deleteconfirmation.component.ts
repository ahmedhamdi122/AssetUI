import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';

@Component({
  selector: 'app-deleteconfirmation',
  templateUrl: './deleteconfirmation.component.html',
  styleUrls: ['./deleteconfirmation.component.css']
})
export class DeleteconfirmationComponent implements OnInit {


  public lang = localStorage.getItem("lang");
  textDir: string = 'ltr';

  orgObj: EditOrganizationVM;
  id: number;
  name = "";
  arabicName = "";
  message = "";
  action: any;
  errorMessage: string;
  errorDisplay: boolean = false;


  constructor(private organizationService: OrganizationService, public dialog: MatDialogRef<DeleteconfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, private route: Router) {
    this.orgObj = { ...data };
    this.id = this.orgObj.id;
    //  this.name = this.orgObj.name;

    if (this.lang == "en") {
      this.name = this.orgObj.name;
    }
    else {
      this.name = this.orgObj.nameAr;
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
    this.route.navigate(['/dash/organizations']);
  }
  delete(): void {
    this.organizationService.DeleteOrganization(this.id).subscribe(deleted => {
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
