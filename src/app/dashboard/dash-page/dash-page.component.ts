import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';



@Component({
  selector: 'app-dash-page',
  templateUrl: './dash-page.component.html',
  styleUrls: ['./dash-page.component.css']
})
export class DashPageComponent implements OnInit {

  lang = localStorage.getItem('lang');
  currentUser: LoggedUser;
  textDir: string = 'rtl';


  constructor(private authenticationService: AuthenticationService, private router: Router) {

    this.currentUser = this.authenticationService.currentUserValue;

    if (localStorage.getItem('lang') == null) {
      // this.lang == 'en';
      // this.textDir = 'ltr';
      // localStorage.setItem('lang', this.lang);
      // this.lang = localStorage.getItem('lang');



      this.lang == 'ar'
      this.textDir = 'rtl';
      localStorage.setItem('lang', this.lang);
      this.lang = localStorage.getItem('lang');
    }
    else {
      this.lang = localStorage.getItem('lang');
    }
  }

  ngOnInit(): void {
    if (this.lang == null) {
      // this.lang == 'en';
      // this.textDir = 'ltr';
      this.lang == 'ar'
      this.textDir = 'rtl';
    }
    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }

  }

}
