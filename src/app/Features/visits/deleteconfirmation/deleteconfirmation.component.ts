import { VisitService } from './../../../Shared/Services/visit.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EditVisitVM } from 'src/app/Shared/Models/visitVM';

@Component({
  selector: 'app-deleteconfirmation',
  templateUrl: './deleteconfirmation.component.html',
  styleUrls: ['./deleteconfirmation.component.css']
})
export class DeleteconfirmationComponent implements OnInit {

  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  visitObj: EditVisitVM;
  id: number;
  name = ""
  arabicName = "" 
  message = ""
  action: any;
  errorMessage: string;
  errorDisplay: boolean = false;

  constructor(private visitService: VisitService, public dialog: MatDialogRef<DeleteconfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, private route: Router) {

    this.visitObj = { ...data };
    this.id = this.visitObj.id;
    // this.name = this.visitObj.name;
    // if (this.lang == "en") {
    //   this.name = this.visitObj.name;
    // }
    // else {
    //   this.name = this.visitObj.nameAr;
    // }
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
    this.visitService.DeleteVisit(this.id).subscribe(deleted => {
      this.message = 'Data is deleted successfully';
      this.action = "close";
      this._snackBar.open(this.message, this.action, { panelClass: 'snackbar' });
      this.dialog.close();
    });
  }

}
