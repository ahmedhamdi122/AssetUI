import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreateBrandVM } from 'src/app/Shared/Models/brandVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { BrandService } from 'src/app/Shared/Services/brand.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
@Component({
  selector: 'app-create-brand',
  templateUrl: './create-brand.component.html',
  styleUrls: ['./create-brand.component.css']
})
export class CreateBrandComponent implements OnInit {

  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  brandObj: CreateBrandVM;
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  constructor(private authenticationService: AuthenticationService, private brandService: BrandService,
    private ref: DynamicDialogRef) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.brandObj = { id: 0, code: '', name: '', nameAr: '', governorateId: 0 }
  }
  onSubmit() {
    this.brandObj.code = this.brandObj.code;
    this.brandObj.name = this.brandObj.name;
    this.brandObj.nameAr = this.brandObj.nameAr;

    this.brandService.CreateBrand(this.brandObj).subscribe(addedObj => {
      this.display = true;
      this.brandObj.id = addedObj;
      this.ref.close(addedObj);
    },
      (error) => {
        this.errorDisplay = true;
        if (this.lang == 'en') {
          if (error.error.status == 'code') {
            this.errorMessage = error.error.message;
          }

          if (error.error.status == 'codelen') {
            this.errorMessage = error.error.message;
          }


          if (error.error.status == 'name') {
            this.errorMessage = error.error.message;
          } if (error.error.status == 'nameAr') {
            this.errorMessage = error.error.message;
          }
        }
        if (this.lang == 'ar') {
          if (error.error.status == 'code') {
            this.errorMessage = error.error.messageAr;
          }

          if (error.error.status == 'codelen') {
            this.errorMessage = error.error.messageAr;
          }
          if (error.error.status == 'name') {
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
