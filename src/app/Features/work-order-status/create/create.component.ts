import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { CreateWorkOrderStatusVM } from 'src/app/Shared/Models/WorkOrderStatusVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { WorkOrderStatusService } from 'src/app/Shared/Services/work-order-status.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser
  wrkorderStatusObj: CreateWorkOrderStatusVM
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  constructor(private authenticationService: AuthenticationService, private workorderStatus: WorkOrderStatusService,
    private route: Router,
  ) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.wrkorderStatusObj = { code: '', name: '', nameAr: '', color: '', icon: '' }
  }
  onSubmit() {

    this.workorderStatus.CreateWorkOrderStatus(this.wrkorderStatusObj).subscribe(addedObj => {
      this.display = true;
      this.route.navigate(['/workOrderStatus/'])
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
  back() { this.route.navigate(['/dash/workOrderStatus']); }
}
