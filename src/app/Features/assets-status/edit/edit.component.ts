import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EditAssetStatusVM } from 'src/app/Shared/Models/assetStatusVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AssetStatusService } from 'src/app/Shared/Services/assetStatus.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {

  assetStatusObj: EditAssetStatusVM
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  constructor(private AssetStatusService: AssetStatusService, private authenticationService: AuthenticationService,
    private route: Router, private ref: DynamicDialogRef, private config: DynamicDialogConfig) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.assetStatusObj = { id: 0, name: '', nameAr: '', code: '' }
    //let id = this.activeRoute.snapshot.params['id'];
    if (this.config.data != null || this.config.data != undefined) {
      let id = this.config.data.id;

      this.AssetStatusService.GetAssetStatusById(id).subscribe(
        data => {
          this.assetStatusObj = data;
        });
    }
  }
  onSubmit() {

    this.AssetStatusService.UpdateAssetStatus(this.assetStatusObj).subscribe(addedObj => {
      this.display = true;
      this.ref.close();
    },
      (error) => {
        this.errorDisplay = true;
        if (this.lang == 'en') {

          if (error.error.status == 'name') {
            this.errorMessage = error.error.message;
          }
          if (error.error.status == 'code') {
            this.errorMessage = error.error.message;
          }
        }
        if (this.lang == 'ar') {

          if (error.error.status == 'nameAr') {
            this.errorMessage = error.error.messageAr;
          }
          if (error.error.status == 'code') {
            this.errorMessage = error.error.messageAr;
          }
        }
        return false;
      });
  }



}
