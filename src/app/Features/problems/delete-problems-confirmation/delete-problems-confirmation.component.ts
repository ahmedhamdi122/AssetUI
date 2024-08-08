import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditProblemVM } from 'src/app/Shared/Models/ProblemVM';
import { ProblemService } from 'src/app/Shared/Services/problem.service';

@Component({
  selector: 'app-delete-problems-confirmation',
  templateUrl: './delete-problems-confirmation.component.html',
  styleUrls: ['./delete-problems-confirmation.component.css']
})
export class DeleteProblemsConfirmationComponent implements OnInit {

  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  probObj: EditProblemVM;
  id: number;
  name = ""
  arabicName = ""
  message = ""
  action: any;
  errorMessage: string;
  errorDisplay: boolean = false;
  constructor(private problemService: ProblemService, public dialog: MatDialogRef<DeleteProblemsConfirmationComponent>,
    
    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, private route: Router) {
    this.probObj = { ...data };
    this.id = this.probObj.id;
    if (this.lang == "en") {
      this.name = this.probObj.name;
    }
    else {
      this.name = this.probObj.nameAr;
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
    this.problemService.DeleteProblem(this.id).subscribe(deleted => {
      this.message = 'Data is deleted successfully';
      this.action = "close";
      this._snackBar.open(this.message, this.action, { panelClass: 'snackbar' });
      this.dialog.close();
    }, (error) => {
      this.errorDisplay = true;

      if (this.lang == 'en') {
        if (error.error.status == 'code') {
          this.errorMessage = error.error.message;
        } if (error.error.status == 'name') {
          this.errorMessage = error.error.message;
        }
        if (error.error.status == 'nameAr') {
          this.errorMessage = error.error.message;
        }
      } if (this.lang == 'ar') {
        if (error.error.status == 'code') {
          this.errorMessage = error.error.messageAr;
        } if (error.error.status == 'name') {
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

