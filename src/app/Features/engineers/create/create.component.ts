import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListClassVM } from 'src/app/Shared/Models/classVM';
import { ListGender } from 'src/app/Shared/Models/employeeVM';
import { CreateEngineerVM } from 'src/app/Shared/Models/engineerVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { EngineerService } from 'src/app/Shared/Services/engineer.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  currentUser: LoggedUser;
  engineerObj: CreateEngineerVM;
  lstGender: ListGender[] = [];
  lstClasses: ListClassVM[] = [];
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  isDisabled: boolean = false;
  isHR: boolean = false;
  lstRoleNames: string[] = [];

  constructor(
    private engineerService: EngineerService,
    private route: Router,
    private authenticationService: AuthenticationService)
     {this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    if (this.currentUser) {

    this.currentUser["roleNames"].forEach(element => {
      this.lstRoleNames.push(element["name"]);
    });
  }
  this.onLoad();
}
onLoad() {
  this.engineerObj = {
    address: '', addressAr: '', cardId: '', code: '', dob: '', email: '',  name: '', nameAr: '', phone: '', whatsApp: '',
      genderId: 0
  }

  this.lstGender.push({ id: 1, name: 'Male', nameAr: 'ذكر' }, { id: 1, name: 'Female', nameAr: 'أنثى' });


}


  onSubmit() {
    this.engineerObj.phone = this.engineerObj.phone.toString();
    this.engineerObj.cardId = this.engineerObj.cardId.toString();
    this.engineerService.CreateEngineer(this.engineerObj).subscribe(addedObj => {
      this.display = true;
    },
      (error) => {
        this.errorDisplay = true;
        if (this.lang == 'en') {
          if (error.error.status == 'email') {
            this.errorMessage = error.error.message;
          }
        }
        if (this.lang == 'ar') {
          if (error.error.status == 'email') {
            this.errorMessage = error.error.messageAr;
          }

        }
        return false;
      });
  }
  back() { this.route.navigate(['/dash/engineers']); }
}
