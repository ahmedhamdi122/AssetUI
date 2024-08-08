import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditDepartmentVM } from 'src/app/Shared/Models/departmentVM';
import { DepartmentService } from 'src/app/Shared/Services/department.service';


@Component({
  selector: 'app-delete-departments-confirmation',
  templateUrl: './delete-departments-confirmation.component.html',
  styleUrls: ['./delete-departments-confirmation.component.css']
})
export class DeleteDepartmentsConfirmationComponent implements OnInit {
  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  deptObj: EditDepartmentVM;
  id: number;
  name = ""
  arabicName = ""
  message = ""
  action: any;
  errorMessage: string;
  errorDisplay: boolean = false;
  constructor(private departmentService: DepartmentService, public dialog: MatDialogRef<DeleteDepartmentsConfirmationComponent>,

    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, private route: Router) {
    this.deptObj = { ...data };
    this.id = this.deptObj.id;
    if (this.lang == "en") {
      this.name = this.deptObj.name;
    }
    else {
      this.name = this.deptObj.nameAr;
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
    this.departmentService.DeleteDepartment(this.id).subscribe(deleted => {
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
      } if (this.lang == 'ar') {
        if (error.error.status == 'hostassets') {
          this.errorMessage = error.error.messageAr;
        }
      }
      return false;
    });



  }
}

