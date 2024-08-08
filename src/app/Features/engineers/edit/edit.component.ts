import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListGender } from 'src/app/Shared/Models/employeeVM';
import {  EditEngineerVM } from 'src/app/Shared/Models/engineerVM';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { EngineerService } from 'src/app/Shared/Services/engineer.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {


  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  currentUser: LoggedUser;

  engineerObj: EditEngineerVM;
  lstGovernorates: ListGovernorateVM[];
  lstCities: ListCityVM[];
  lstGender: ListGender[] = [];

  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  isDisabled: boolean = false;

  constructor( private activeRoute:ActivatedRoute,
    private engineerService: EngineerService,  private route: Router,
    private authenticationService: AuthenticationService)
     {this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.engineerObj = {
     id:0, address: '', addressAr: '', cardId: '', code: '', dob: '', email: '',  name: '', nameAr: '', phone: '', whatsApp: '',
        genderId: 0
    }


    let id = this.activeRoute.snapshot.params['id'];
    this.engineerService.GetEngineerById(id).subscribe(engObj=>{this.engineerObj = engObj});

  }

  onSubmit() {
    this.engineerObj.phone = this.engineerObj.phone.toString();
    this.engineerObj.cardId = this.engineerObj.cardId.toString();
    this.engineerService.UpdateEngineer(this.engineerObj).subscribe(addedObj => {
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
