import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ForgetPasswordVM } from 'src/app/Shared/Models/forgetpasswordVM';
import { environment } from '../../../../src/environments/environment';
import { UserService } from 'src/app/Shared/Services/user.service';
import { TranslateService } from '@ngx-translate/core';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { LoggedUser } from 'src/app/Shared/Models/userVM';


@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']
})
export class ForgetPasswordComponent implements OnInit {

  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  currentUser: LoggedUser;
  userObj: LoggedUser;
  public forgotPasswordForm: FormGroup;
  public successMessage: string;
  public errorMessage: string;
  public showSuccess: boolean;
  public showError: boolean;
  public _token: string;
  public _email: string;
  constructor(private userService: UserService, public translate: TranslateService,
    private authenticationService: AuthenticationService) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {

    this.userObj = {
      hospitalTypeNum: 0, email: '',
      userNameAr: '', strInsitute: '', strInsituteAr: '', strLogo: '', isAgency: false, isScrap: false, isVisit: false, isExternalFix: false, isOpenRequest: false,
      id: '', userName: '', roleName: '', roleNames: [], displayName: '', token: '', isRemembered: false, hospitalCode: '', canAdd: false,
      governorateId: 0, cityId: 0, organizationId: 0, subOrganizationId: 0, hospitalId: 0, supplierId: 0, commetieeMemberId: 0,
      cityName: '', govName: '', subOrgName: '', orgName: '', cityNameAr: '', govNameAr: '', subOrgNameAr: '', orgNameAr: '', hospitalName: '', hospitalNameAr: ''
    }


    this.userObj = this.authenticationService.currentUserValue;
    if (localStorage.getItem("lang") == null) {
      localStorage.setItem("lang", "ar");
    }
    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }

    this.forgotPasswordForm = new FormGroup({
      email: new FormControl("", [Validators.required])
    });

    // if (this.currentUser != null || this.currentUser != undefined) {
    //   //    this.forgotPasswordForm["email"] = this.userObj.email;

    //   this.forgotPasswordForm.value.email = this.userObj.email;
    // }
  }
  public validateControl = (controlName: string) => {
    return this.forgotPasswordForm.controls[controlName].invalid && this.forgotPasswordForm.controls[controlName].touched
  }
  public hasError = (controlName: string, errorName: string) => {
    return this.forgotPasswordForm.controls[controlName].hasError(errorName)
  }
  public forgotPassword = (forgotPasswordFormValue) => {
    this.showError = this.showSuccess = false;
    const forgotPass = { ...forgotPasswordFormValue };

    //Url of API
    var strUrl = `${environment.urlAddress4200}` + "/ResetPassword?"
    const forgotPassDto: ForgetPasswordVM = {
      email: forgotPass.email,
      clientURI: strUrl
    }

    this.userService.forgotPassword('api/Authenticate/ForgotPassword', forgotPassDto)
      .subscribe(_ => {
        this.showSuccess = true;
        if (this.lang == "ar") {
          this.successMessage = 'تم ارسال اللينك، من فضلك راجع بريدك الالكتروني لتغيير كلمة المرور'
        }
        else {
          this.successMessage = 'The link has been sent, please check your email to reset your password.'
        }
      },
        err => {
          this.showError = true;
          this.errorMessage = err;

          if (localStorage.getItem("lang") == null) {
            localStorage.setItem("lang", "ar");
          }
          if (this.lang == 'en') {
            this.textDir = 'ltr';
          } else if (this.lang == 'ar') {
            this.textDir = 'rtl';
          }
        });
  }
}
