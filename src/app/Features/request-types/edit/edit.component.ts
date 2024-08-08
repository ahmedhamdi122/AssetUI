import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { EditRequestTypeVM } from 'src/app/Shared/Models/ProjectTypeVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { RequestTypeService } from 'src/app/Shared/Services/request-type.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  reqTypeObj: EditRequestTypeVM
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  constructor(private reqTypeService: RequestTypeService, private authenticationService: AuthenticationService,
    private route: Router, private config: DynamicDialogConfig) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.reqTypeObj = { id: 0, name: '', nameAr: '', code: '' }
    //   let id = this.activeRoute.snapshot.params['id'];

    if (this.config.data != null || this.config.data != undefined) {
      let id = this.config.data.id;
      this.reqTypeService.GetRequestTypeById(id).subscribe(
        data => {
          this.reqTypeObj = data;
        });
    }
  }
  onSubmit() {
    this.reqTypeService.UpdateRequestType(this.reqTypeObj).subscribe(addedObj => {
      this.reqTypeObj = addedObj
      this.display = true;
      this.route.navigate(['/dash/requestTypes/'])
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
}
