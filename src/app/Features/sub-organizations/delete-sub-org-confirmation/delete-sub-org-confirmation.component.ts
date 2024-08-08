import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';

@Component({
  selector: 'app-delete-sub-org-confirmation',
  templateUrl: './delete-sub-org-confirmation.component.html',
  styleUrls: ['./delete-sub-org-confirmation.component.css']
})
export class DeleteSubOrgConfirmationComponent implements OnInit {

  public lang = localStorage.getItem("lang");
  textDir: string = 'ltr';

  subOrgObj: EditSubOrganizationVM;
  id: number;
  name = ""
  arabicName = ""
  message = ""
  action: any;
  errorMessage: string;
  errorDisplay: boolean = false;


  constructor(private subOrganizationService: SubOrganizationService, public dialog: MatDialogRef<DeleteSubOrgConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, private route: Router) {
    this.subOrgObj = { ...data };
    this.id = this.subOrgObj.id;
    // this.name = this.subOrgObj.name;



    if (this.lang == "en") {
      this.name = this.subOrgObj.name;
    }
    else {
      this.name = this.subOrgObj.nameAr;
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
    this.subOrganizationService.DeleteSubOrganization(this.id).subscribe(deleted => {
      this.message = 'Data is deleted successfully';
      this.action = "close";
      this._snackBar.open(this.message, this.action, { panelClass: 'snackbar' });
      this.dialog.close();
    }, (error) => {
      this.errorDisplay = true;

      if (this.lang == 'en') {
        if (error.error.status == 'hospital') {
          this.errorMessage = error.error.message;
        }
      } if (this.lang == 'ar') {
        if (error.error.status == 'hospital') {
          this.errorMessage = error.error.messageAr;
        }
      }
      return false;
    });
  }

}
