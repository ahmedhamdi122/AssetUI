import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditFloorVM } from 'src/app/Shared/Models/floorVM';
import { FloorService } from 'src/app/Shared/Services/floor.service';

@Component({
  selector: 'app-delete-floor-confirmation',
  templateUrl: './delete-floor-confirmation.component.html',
  styleUrls: ['./delete-floor-confirmation.component.css']
})
export class DeleteFloorConfirmationComponent implements OnInit {


  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  floorObj: EditFloorVM;
  id: number;
  name = ""
  arabicName = ""
  message = ""
  action: any
  constructor(private floorService: FloorService, public dialog: MatDialogRef<DeleteFloorConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, private route: Router) {
    this.floorObj = { ...data };
    this.id = this.floorObj.id;
  //  this.name = this.floorObj.name;

        
    if (this.lang == "en") {
      this.name = this.floorObj.name;
    }
    else {
      this.name = this.floorObj.nameAr;
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
    this.floorService.DeleteFloor(this.id).subscribe(deleted => {
      this.message = 'Data is deleted successfully';
      this.action = "close";
      this._snackBar.open(this.message, this.action, { panelClass: 'snackbar' });
      this.dialog.close();
    });
  }


}
