import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditWorkOrderStatusVM } from 'src/app/Shared/Models/WorkOrderStatusVM';

import { WorkOrderStatusService } from 'src/app/Shared/Services/work-order-status.service';

@Component({
  selector: 'app-deletework-order-status-confirmation',
  templateUrl: './deletework-order-status-confirmation.component.html',
  styleUrls: ['./deletework-order-status-confirmation.component.css']
})
export class DeleteworkOrderStatusConfirmationComponent implements OnInit {

  public lang = localStorage.getItem("lang");
  textDir: string = 'ltr';

  wrkorderstatusObj: EditWorkOrderStatusVM;
  id: number;
  name = ""
  arabicName = ""
  message = ""
  action: any;
  errorMessage: string;
  errorDisplay: boolean = false;


  constructor(private workOrderStatusService: WorkOrderStatusService, public dialog: MatDialogRef<DeleteworkOrderStatusConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, private route: Router) {
    this.wrkorderstatusObj = { ...data };
    this.id = this.wrkorderstatusObj.id;
    this.name = this.wrkorderstatusObj.name;

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
    this.route.navigate(['/dash/workOrderStatus']);
  }
  delete(): void {
    this.workOrderStatusService.DeleteWorkOrderStatus(this.id).subscribe(deleted => {
      this.message = 'Data is deleted successfully';
      this.action = "close";
      this._snackBar.open(this.message, this.action, { panelClass: 'snackbar' });
      this.dialog.close();
    }, (error) => {
      this.errorDisplay = true;

      if (this.lang == 'en') {
        if (error.error.status == 'wostatus') {
          this.errorMessage = error.error.message;
        }
      } if (this.lang == 'ar') {
        if (error.error.status == 'wostatus') {
          this.errorMessage = error.error.messageAr;
        }
      }
      return false;
    });
  }

}
