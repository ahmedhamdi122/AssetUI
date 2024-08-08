import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditRoleVM } from 'src/app/Shared/Models/roleVM';
import { RoleService } from 'src/app/Shared/Services/role.service';

@Component({
  selector: 'app-deleteconfirmation',
  templateUrl: './deleteconfirmation.component.html',
  styleUrls: ['./deleteconfirmation.component.css']
})
export class DeleteconfirmationComponent implements OnInit {

  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  roleObj: EditRoleVM = {
    id: '',
    roleCategoryId: 0,
    name: '',
    displayName: ''
  };
  id: string = '';
  name = ""
  arabicName = ""
  message = ""
  action: any
  constructor(private roleService: RoleService, public dialog: MatDialogRef<DeleteconfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, private route:Router) {
    this.roleObj = { ...data };
    this.id = this.roleObj.id;
    this.name = this.roleObj.name;

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
    this.route.navigate(['/dash/roles']);
  }
  delete(): void {
    this.roleService.DeleteRole(this.id).subscribe(deleted => {
      this.message = 'Data is deleted successfully';
      this.action = "close";
      this._snackBar.open(this.message, this.action, {panelClass: 'snackbar'});
      this.dialog.close();
      this.route.navigate(['/dash/roles']);
    });


    this.route.navigate(['/dash/roles']);
  }

}
