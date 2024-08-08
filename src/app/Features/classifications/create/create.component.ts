import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreateClassVM } from 'src/app/Shared/Models/classVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';

import { ClassifyService } from 'src/app/Shared/Services/classify.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser
  classObj: CreateClassVM
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  constructor(private authenticationService: AuthenticationService, private classService: ClassifyService,
    private route: Router,
  ) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.classObj = { code: '', name: '', nameAr: '', governorateId: 0 }
  }
  onSubmit() {

    this.classService.CreateClassification(this.classObj).subscribe(addedObj => {
      this.display = true;
      this.route.navigate(['/Classifications/'])
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
  back() { this.route.navigate(['/dash/Classifications']); }
}
