import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { EditOriginVM } from 'src/app/Shared/Models/originVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { OriginService } from 'src/app/Shared/Services/origin.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  originObj: EditOriginVM
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  constructor(private originService: OriginService, private authenticationService: AuthenticationService, private config: DynamicDialogConfig) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.originObj = { code: '', id: 0, name: '', nameAr: '' }
    // let id = this.activeRoute.snapshot.params['id'];

    if (this.config.data != null || this.config.data != undefined) {
      let id = this.config.data.id;
      this.originService.GetOriginById(id).subscribe(
        data => {
          this.originObj = data;
        });
    }
  }
  onSubmit() {

    this.originService.UpdateOrigin(this.originObj).subscribe(addedObj => {
      this.display = true;
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
