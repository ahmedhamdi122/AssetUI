import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { EditBrandVM } from 'src/app/Shared/Models/brandVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { BrandService } from 'src/app/Shared/Services/brand.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  brandObj: EditBrandVM
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  constructor(private brandService: BrandService, private authenticationService: AuthenticationService,
    private route: Router, private config: DynamicDialogConfig) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.brandObj = { code: '', id: 0, name: '', nameAr: '' }
    //  let id = this.activeRoute.snapshot.params['id'];
    if (this.config.data != null || this.config.data != undefined) {
      let id = this.config.data.id;
      this.brandService.GetBrandById(id).subscribe(
        data => {
          this.brandObj = data;
        });
    }
  }
  onSubmit() {
    this.brandObj.code = this.brandObj.code;
    this.brandObj.name = this.brandObj.name;
    this.brandObj.nameAr = this.brandObj.nameAr;
    this.brandService.UpdateBrand(this.brandObj).subscribe(addedObj => {
      this.display = true;
      this.route.navigate(['/brands/'])
    },
      (error) => {
        this.errorDisplay = true;
        if (this.lang == 'en') {
          if (error.error.status == 'codelen') {
            this.errorMessage = error.error.message;
          }
          if (error.error.status == 'code') {
            this.errorMessage = error.error.message;
          }
          if (error.error.status == 'name') {
            this.errorMessage = error.error.message;
          }
        }
        if (this.lang == 'ar') {
          if (error.error.status == 'codelen') {
            this.errorMessage = error.error.messageAr;
          }
          if (error.error.status == 'code') {
            this.errorMessage = error.error.messageAr;
          }
          if (error.error.status == 'name') {
            this.errorMessage = error.error.messageAr;
          }

        }
        return false;
      });
  }
}
