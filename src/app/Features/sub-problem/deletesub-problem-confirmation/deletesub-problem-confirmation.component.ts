import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditSubProblemVM } from 'src/app/Shared/Models/SubProblemVM';
import { SubProblemService } from 'src/app/Shared/Services/sub-problem.service';

@Component({
  selector: 'app-deletesub-problem-confirmation',
  templateUrl: './deletesub-problem-confirmation.component.html',
  styleUrls: ['./deletesub-problem-confirmation.component.css']
})
export class DeletesubProblemConfirmationComponent implements OnInit {

  public lang = localStorage.getItem("lang");
  textDir: string = 'ltr';

  subProbObj: EditSubProblemVM;
  id: number;
  name = ""
  arabicName = ""
  message = ""
  action: any;
  errorMessage: string;
  errorDisplay: boolean = false;


  constructor(private subProblemService: SubProblemService, public dialog: MatDialogRef<DeletesubProblemConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, private route: Router) {
    this.subProbObj = { ...data };
    this.id = this.subProbObj.id;
    // this.name = this.subOrgObj.name;



    if (this.lang == "en") {
      this.name = this.subProbObj.name;
    }
    else {
      this.name = this.subProbObj.nameAr;
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
    this.route.navigate(['/dash/subProblems']);
  }
  delete(): void {
    this.subProblemService.DeleteSubProblem(this.id).subscribe(deleted => {
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

