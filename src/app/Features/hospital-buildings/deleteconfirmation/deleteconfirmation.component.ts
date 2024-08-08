import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditBuildingVM } from 'src/app/Shared/Models/buildingVM';
import { BuildingService } from 'src/app/Shared/Services/building.service';

@Component({
  selector: 'app-deleteconfirmation',
  templateUrl: './deleteconfirmation.component.html',
  styleUrls: ['./deleteconfirmation.component.css']
})
export class DeleteconfirmationComponent implements OnInit {

  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  buildObj: EditBuildingVM;
  id: number;
  name = ""
  arabicName = ""
  message = ""
  action: any
  constructor(private buildingService: BuildingService, public dialog: MatDialogRef<DeleteconfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, private route: Router) {
    this.buildObj = { ...data };
    this.id = this.buildObj.id;
  //  this.name = this.buildObj.name;


        
    if (this.lang == "en") {
      this.name = this.buildObj.name;
    }
    else {
      this.name = this.buildObj.nameAr;
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
    this.route.navigate(['/dash/buildings']);
  }
  delete(): void {
    this.buildingService.DeleteBuilding(this.id).subscribe(deleted => {
      this.message = 'Data is deleted successfully';
      this.action = "close";
      this._snackBar.open(this.message, this.action, { panelClass: 'snackbar' });
      this.dialog.close();
    });
  }



}
