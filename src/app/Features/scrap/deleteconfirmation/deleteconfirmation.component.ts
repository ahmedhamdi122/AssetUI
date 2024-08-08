import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScrapService } from 'src/app/Shared/Services/scrap.service';
import { EditScrapVM, ScrapVM } from 'src/app/Shared/Models/scrapVM';

@Component({
  selector: 'app-deleteconfirmation',
  templateUrl: './deleteconfirmation.component.html',
  styleUrls: ['./deleteconfirmation.component.css']
})
export class DeleteconfirmationComponent implements OnInit {
  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  id: number;
  name = ""
  arabicName = ""
  message = ""
  action: any;
  errorMessage: string;
  errorDisplay: boolean = false;
  scrapObj: EditScrapVM;
  constructor( public dialog: MatDialogRef<DeleteconfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private scrapService:ScrapService, private _snackBar: MatSnackBar, private route: Router) {
      this.scrapObj = { ...data };
      this.id = this.scrapObj.id;
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
    this.scrapService.DeleteScrap(this.id).subscribe(deleted => {
      this.message = 'Data is deleted successfully';
      this.action = "close";
      this._snackBar.open(this.message, this.action, { panelClass: 'snackbar' });
      this.dialog.close();
    });
  }

}
