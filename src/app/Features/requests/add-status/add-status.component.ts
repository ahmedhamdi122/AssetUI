import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IndexRequestStatus } from 'src/app/Shared/Models/RequestStatusVM';
import { CreateRequestTracking } from 'src/app/Shared/Models/RequestTrackingVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { RequestStatusService } from 'src/app/Shared/Services/request-status.service';
import { RequestTrackingService } from 'src/app/Shared/Services/request-tracking.service';
import { RequestService } from 'src/app/Shared/Services/request.service';

@Component({
  selector: 'app-add-status',
  templateUrl: './add-status.component.html',
  styleUrls: ['./add-status.component.css']
})
export class AddStatusComponent implements OnInit {

  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  requestId: number;
  requestSubject: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  errorMessage: string = "";
  requestTrackObj: CreateRequestTracking;
  lstRequestStatus: IndexRequestStatus[] = [];

  constructor(private authenticationService: AuthenticationService, private config: DynamicDialogConfig,
    private requestService: RequestService, private datePipe: DatePipe, private requestStatusService: RequestStatusService,
    private requestTrackingService: RequestTrackingService) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.requestId = this.config.data.requestId;
    this.requestTrackObj = { strDescriptionDate: '', requestId: 0, createdById: '', description: '', descriptionDate: new Date, requestStatusId: 0, id: 0, hospitalId: 0 }
    this.requestService.GetRequestById(this.requestId).subscribe(reqObj => {
      this.requestSubject = reqObj.subject;
    });

    this.requestStatusService.GetAllRequestStatus().subscribe(lstStatus => {
      this.lstRequestStatus = lstStatus;
    });

  }

  saveStatus() {
    if (this.requestTrackObj.requestStatusId == 0) {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select Status";
      }
      else {
        this.errorMessage = "من فضلك اختر حالة";
      }
      return false;
    }


    this.requestTrackObj.createdById = this.currentUser.id;
    this.requestTrackObj.requestId = this.requestId;
    this.requestTrackObj.strDescriptionDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
    this.requestTrackingService.AddRequestTracking(this.requestTrackObj).subscribe(saved => {
      this.display = true;
    })
  }

}
