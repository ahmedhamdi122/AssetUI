import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateAssetStatusVM } from 'src/app/Shared/Models/assetStatusVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AssetStatusService } from 'src/app/Shared/Services/assetStatus.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {



  lang = localStorage.getItem("lang");
  currentUser: LoggedUser
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  assetStatusObj: CreateAssetStatusVM;
  constructor(private authenticationService: AuthenticationService, private assetStatusService: AssetStatusService,
    private router: Router, private ref: DynamicDialogRef,
  ) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.assetStatusObj = { name: '', nameAr: '', code: '' }
  }
  onSubmit() {

    this.assetStatusService.CreateAssetStatus(this.assetStatusObj).subscribe(addedObj => {
      this.display = true;
    },
      (error) => {
        this.errorDisplay = true;
        if (this.lang == 'en') {

          if (error.error.status == 'name') {
            this.errorMessage = error.error.message;
          } if (error.error.status == 'code') {
            this.errorMessage = error.error.message;
          }
        }
        if (this.lang == 'ar') {


          if (error.error.status == 'name') {
            this.errorMessage = error.error.messageAr;
          }
          if (error.error.status == 'code') {
            this.errorMessage = error.error.messageAr;
          }
        }
        return false;
      });

  }

  back() { this.router.navigate(['/dash/AssetStatus']); }
}
