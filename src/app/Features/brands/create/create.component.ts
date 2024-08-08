import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreateBrandVM } from 'src/app/Shared/Models/brandVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { BrandService } from 'src/app/Shared/Services/brand.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser
  brandObj: CreateBrandVM
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  constructor(private authenticationService: AuthenticationService, private brandService: BrandService,
    private route: Router,
  ) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.brandObj = { id: 0, code: '', name: '', nameAr: '', governorateId: 0 };
    this.brandService.GenerateBrandCode().subscribe(brndObj => {
      this.brandObj.code = brndObj["code"];
    });
  }
  onSubmit() {
    this.brandObj.code = this.brandObj.code;
    this.brandObj.name = this.brandObj.name;
    this.brandObj.nameAr = this.brandObj.nameAr;
    this.brandService.CreateBrand(this.brandObj).subscribe(addedObj => {
      this.display = true;
      this.route.navigate(['/dash/brands/'])
    },
      (error) => {
        this.errorDisplay = true;
        if (this.lang == 'en') {
          if (error.error.status == 'code') {
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

  back() { this.route.navigate(['/dash/brands']); }
}
