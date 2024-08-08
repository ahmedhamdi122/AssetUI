import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Router } from '@angular/router';
@Component({
  selector: 'app-alertdelete',
  templateUrl: './alertdelete.component.html',
  styleUrls: ['./alertdelete.component.css']
})
export class AlertdeleteComponent implements OnInit {

  public lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  alertErrorMessage: any;
  constructor(public dialog: MatDialogRef<AlertdeleteComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private router: Router) {
    this.alertErrorMessage = { ...data };
  }
  ngOnInit(): void {
  }
  close(): void {
    this.dialog.close();
    // this.router.navigate(['/dash/hospitalassets']);
  }
}
