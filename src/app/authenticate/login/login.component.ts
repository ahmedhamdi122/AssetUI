import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoggedUser, User } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { AuthGuard } from 'src/app/Shared/Services/guards/authGuard.guard';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loggingUserObj: User;
  userObj: LoggedUser;
  userCookieObj: LoggedUser;
  display: boolean = false;
  displayerror: string = "";
  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  cookieValue: string = "";
  constructor(private router: Router, private authenticationService: AuthenticationService,
    private cookieService: CookieService, private activateRoute: ActivatedRoute, private Authguardservice: AuthGuard) {
  }
  ngOnInit(): void {


    this.loggingUserObj = { userName: '', passwordHash: '', isRemembered: false }
    this.userObj = {
      hospitalTypeNum: 0, email: '', userNameAr: '', strInsitute: '', strInsituteAr: '', strLogo: '', isAgency: false, isScrap: false, isVisit: false, isExternalFix: false, isOpenRequest: false,
      id: '', userName: '', roleName: '', roleNames: [], displayName: '', token: '', isRemembered: false, hospitalCode: '', canAdd: false,
      governorateId: 0, cityId: 0, organizationId: 0, subOrganizationId: 0, hospitalId: 0, supplierId: 0, commetieeMemberId: 0,
      cityName: '', govName: '', subOrgName: '', orgName: '', cityNameAr: '', govNameAr: '', subOrgNameAr: '', orgNameAr: '', hospitalName: '', hospitalNameAr: ''
    }
    this.userCookieObj = {
      hospitalTypeNum: 0, email: '', strInsitute: '', strInsituteAr: '', strLogo: '', isAgency: false, isScrap: false, isVisit: false, isExternalFix: false, isOpenRequest: false,
      userNameAr: '', id: '', userName: '', roleName: '', roleNames: [], displayName: '', token: '', isRemembered: false, hospitalCode: '',
      governorateId: 0, cityId: 0, organizationId: 0, subOrganizationId: 0, hospitalId: 0, supplierId: 0, commetieeMemberId: 0, canAdd: false,
      cityName: '', govName: '', subOrgName: '', orgName: '', cityNameAr: '', govNameAr: '', subOrgNameAr: '', orgNameAr: '', hospitalName: '', hospitalNameAr: ''
    }
    this.lang = "en";
    this.textDir = "ltr";


  }
  login() {
    this.authenticationService.login(this.loggingUserObj).subscribe(
      data => {
        this.userObj = this.authenticationService.currentUserValue;
        this.userObj.isRemembered = this.loggingUserObj.isRemembered;

        this.lang = "ar";
        this.textDir = "rtl";
        this.router.navigate(['/dashboard']);
      },
      error => {
        this.display = true;
        this.displayerror = error.error.message;
        return false;
      });
  }

  forgetPassword() {
    this.router.navigate(['/forget']);
  }
}
