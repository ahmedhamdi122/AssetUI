import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IndexRequestStatus } from 'src/app/Shared/Models/RequestStatusVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { RequestStatusService } from 'src/app/Shared/Services/request-status.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser
  requestStatusObj: IndexRequestStatus
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  constructor(private authenticationService: AuthenticationService, private reqstatusService: RequestStatusService,
    private route: Router, private config: DynamicDialogConfig) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.requestStatusObj = {
      id: 0, name: '', nameAr: '', color: '', icon: '',
      countOpen: 0, listStatus: [], countAll: 0,
      countClose: 0, countApproved: 0, countInProgress: 0, countSolved: 0
    }
    //  / let id = this.activeRoute.snapshot.params['id'];

    if (this.config.data != null || this.config.data != undefined) {
      let id = this.config.data.id;
      this.reqstatusService.GetRequestStatusById(id).subscribe(
        data => {
          this.requestStatusObj = data;
        });
    }
  }
  onSubmit() {

    this.reqstatusService.UpdateRequestStatus2(this.requestStatusObj).subscribe(addedObj => {
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
