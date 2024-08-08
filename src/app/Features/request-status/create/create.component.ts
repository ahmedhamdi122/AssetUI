import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreateBrandVM } from 'src/app/Shared/Models/brandVM';
import { IndexRequestStatus } from 'src/app/Shared/Models/RequestStatusVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { BrandService } from 'src/app/Shared/Services/brand.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { RequestStatusService } from 'src/app/Shared/Services/request-status.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser
  requestStatusObj: IndexRequestStatus
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  constructor(private authenticationService: AuthenticationService, private reqstatusService: RequestStatusService,
    private route: Router,
  ) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.requestStatusObj = {
      name: '', nameAr: '', id: 0, color: '', icon: '',
      countOpen: 0, listStatus: [], countAll: 0,
      countClose: 0, countApproved: 0, countInProgress: 0, countSolved: 0
    }
  }
  onSubmit() {

    this.reqstatusService.CreateRequestStatus(this.requestStatusObj).subscribe(addedObj => {
      this.display = true;
      this.route.navigate(['/dash/requestStatus/'])
    },
      (error) => {
        this.errorDisplay = true;
        if (this.lang == 'en') {

          if (error.error.status == 'name') {
            this.errorMessage = error.error.message;
          } if (error.error.status == 'nameAr') {
            this.errorMessage = error.error.message;
          }
        }
        if (this.lang == 'ar') {

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

  back() { this.route.navigate(['/dash/requestStatus']); }
}
