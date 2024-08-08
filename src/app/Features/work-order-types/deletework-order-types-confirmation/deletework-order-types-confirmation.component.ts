import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditWorkOrderTypeVM } from 'src/app/Shared/Models/WorkOrderTypeVM';
import { EditWorkOrderVM } from 'src/app/Shared/Models/WorkOrderVM';
import { WorkOrderTypeService } from 'src/app/Shared/Services/work-order-type.service';

@Component({
  selector: 'app-deletework-order-types-confirmation',
  templateUrl: './deletework-order-types-confirmation.component.html',
  styleUrls: ['./deletework-order-types-confirmation.component.css']
})
export class DeleteworkOrderTypesConfirmationComponent implements OnInit {

  public lang = localStorage.getItem("lang");
  textDir: string = 'ltr';

  wrkorderTypeObj: EditWorkOrderTypeVM;
  id: number;
  name = ""
  arabicName = ""
  message = ""
  action: any;
  errorMessage: string;
  errorDisplay: boolean = false;


  constructor(private workOrdertypeService: WorkOrderTypeService, public dialog: MatDialogRef<DeleteworkOrderTypesConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, private route: Router) {
    this.wrkorderTypeObj = { ...data };
    this.id = this.wrkorderTypeObj.id;
    this.name = this.wrkorderTypeObj.name;
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
    this.route.navigate(['/dash/workOrderTypes']);
  }
  delete(): void {
    this.workOrdertypeService.DeleteWorkOrderType(this.id).subscribe(deleted => {
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
