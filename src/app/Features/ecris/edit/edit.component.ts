import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditECRIVM } from 'src/app/Shared/Models/ecriVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { ECRIService } from 'src/app/Shared/Services/ecri.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  ECRIObj: EditECRIVM
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  constructor(private ecriService: ECRIService, private authenticationService: AuthenticationService,
    private route: Router, private activeRoute: ActivatedRoute) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.ECRIObj = { code: '', id: 0, name: '', nameAr: '' }
    let id = this.activeRoute.snapshot.params['id'];
    this.ecriService.GetECRIById(id).subscribe(
      data => {
        this.ECRIObj = data;
      });
  }
  onSubmit() {

    this.ecriService.UpdateECRI(this.ECRIObj).subscribe(addedObj => {
      this.display = true;
      this.route.navigate(['/ecris/'])
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

  back() { this.route.navigate(['/dash/ecris']); }

}
