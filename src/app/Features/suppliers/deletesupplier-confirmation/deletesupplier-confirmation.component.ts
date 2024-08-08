import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditSupplierVM } from 'src/app/Shared/Models/SupplierVM';
import { SupplierService } from 'src/app/Shared/Services/supplierService.service';

@Component({
  selector: 'app-deletesupplier-confirmation',
  templateUrl: './deletesupplier-confirmation.component.html',
  styleUrls: ['./deletesupplier-confirmation.component.css']
})
export class DeletesupplierConfirmationComponent implements OnInit {

  public lang = localStorage.getItem("lang");
  textDir: string = 'ltr';

  supplierObj: EditSupplierVM;
  id: number;
  name = ""
  arabicName = ""
  message = ""
  action: any;
  errorMessage: string;
  errorDisplay: boolean = false;


  constructor(private supplierService: SupplierService, public dialog: MatDialogRef<DeletesupplierConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, private route: Router) {
    this.supplierObj = { ...data };
    this.id = this.supplierObj.id;
    if (this.lang == "en") {
      this.name = this.supplierObj.name;
    }
    else {
      this.name = this.supplierObj.nameAr;
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
    this.route.navigate(['/dash/suppliers']);
  }
  delete(): void {
    this.supplierService.DeleteSupplier(this.id).subscribe(deleted => {
      this.message = 'Data is deleted successfully';
      this.action = "close";
      this._snackBar.open(this.message, this.action, { panelClass: 'snackbar' });
      this.dialog.close();
    }, (error) => {
      this.errorDisplay = true;

      if (this.lang == 'en') {
        if (error.error.status == 'hostassets') {
          this.errorMessage = error.error.message;
        }
        if (error.error.status == 'contract') {
          this.errorMessage = error.error.message;
        }

      } if (this.lang == 'ar') {
        if (error.error.status == 'hostassets') {
          this.errorMessage = error.error.messageAr;
        } if (error.error.status == 'contract') {
          this.errorMessage = error.error.messageAr;
        }
      }
      return false;
    });
  }

}
