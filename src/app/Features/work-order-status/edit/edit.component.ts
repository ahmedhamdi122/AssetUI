import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { EditWorkOrderStatusVM } from 'src/app/Shared/Models/WorkOrderStatusVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { WorkOrderStatusService } from 'src/app/Shared/Services/work-order-status.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  wrkOrderTypeObj: EditWorkOrderStatusVM;
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  constructor(private workorderstatusService: WorkOrderStatusService, private authenticationService: AuthenticationService,
    private route: Router, private config: DynamicDialogConfig) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.wrkOrderTypeObj = { id: 0, code: '', name: '', nameAr: '', color: '', icon: '' }
    //let id = this.activeRoute.snapshot.params['id'];
    if (this.config.data != null || this.config.data != undefined) {
      let id = this.config.data.id;
      this.workorderstatusService.GetWorkOrderStatusById(id).subscribe(
        data => {
          this.wrkOrderTypeObj = data;
        });
    }
  }
  onSubmit() {


    this.workorderstatusService.UpdateWorkOrderStatus2(this.wrkOrderTypeObj).subscribe(addedObj => {
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
