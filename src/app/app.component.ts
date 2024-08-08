import { Component, HostListener,  OnInit } from '@angular/core';
import { Router } from '@angular/router';;
import {  TranslateService } from '@ngx-translate/core';
import { LoggedUser } from './Shared/Models/userVM';
import { AuthenticationService } from './Shared/Services/guards/authentication.service';


export interface ConfigResponse {
  Id: string;
  EmbedUrl: string;
  EmbedToken: { Token: string; };
}


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Assets Management System';
  nameVariable: string = 'John Doe';
  currentUser: LoggedUser;
  isRefreshed = false;
  lang = localStorage.getItem("lang")
  direction: string = "";
  userCookieObj: LoggedUser;
  userObj: LoggedUser;

  selectedLang: string;

  @HostListener('window:beforeunload')
  unloadHandler(event) {
    if (localStorage.getItem('rememberCurrentUser') == 'true') {
      this.currentUser = this.authenticationService.currentUserValue;
      this.router.navigate(['/dashboard']);
    }
    else {
    this.authenticationService.logout();
    }
  }

  constructor(private authenticationService: AuthenticationService, private router: Router) {
    addEventListener('keydown', event => {
      if (event.key == 'r' || event.key == 'F5') this.isRefreshed = true;
    });



    if (localStorage.getItem("lang") == null) {
      this.lang == 'ar'
      this.direction = 'rtl';
    }
    else if (this.lang == 'en') {
      this.direction = 'ltr';
    } else if (this.lang == 'ar') {
      this.direction = 'rtl';
    }

  }
  ngOnInit(): void {
    this.userCookieObj = {
      hospitalTypeNum: 0, email: '', strInsitute: '', strInsituteAr: '', strLogo: '', isAgency: false, isScrap: false, isVisit: false, isExternalFix: false, isOpenRequest: false,
      userNameAr: '', id: '', userName: '', roleName: '', roleNames: [], displayName: '', token: '', isRemembered: false, hospitalCode: '',
      governorateId: 0, cityId: 0, organizationId: 0, subOrganizationId: 0, hospitalId: 0, supplierId: 0, commetieeMemberId: 0, canAdd: false,
      cityName: '', govName: '', subOrgName: '', orgName: '', cityNameAr: '', govNameAr: '', subOrgNameAr: '', orgNameAr: '', hospitalName: '', hospitalNameAr: ''
    }
  }
}
