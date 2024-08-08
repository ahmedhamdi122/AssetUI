import { Component, OnInit } from '@angular/core';
import { ResetPasswordVM } from 'src/app/Shared/Models/resetpasswordVM';

import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { PasswordConfirmationValidatorService } from '../../../app/Shared/Services/password-confirmation-validator.service';
import { UserService } from 'src/app/Shared/Services/user.service';

import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  public resetPasswordForm: FormGroup;
  public showSuccess: boolean;
  public showError: boolean;
  public errorMessage: string;
  public _token: string;
  public _email: string;
  fieldTextType: boolean;
  repeatFieldTextType: boolean;
  currentUser: LoggedUser;


  constructor(private userService: UserService,
    private activatedRoute: ActivatedRoute,
    private translateService: TranslateService,
    private authenticationService: AuthenticationService,
    private _passConfValidator: PasswordConfirmationValidatorService,
    private _route: ActivatedRoute) { this.currentUser = this.authenticationService.currentUserValue; }


  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  ngOnInit(): void {
    if (localStorage.getItem("lang") == null) {
      localStorage.setItem("lang", "ar");
      this.textDir = 'rtl';
    }
    if (localStorage.getItem("lang") == undefined) {
      localStorage.setItem("lang", "ar");
      this.textDir = 'rtl';
    }
    if (localStorage.getItem("lang") == "ar") {
      localStorage.setItem("lang", "ar");
      this.lang = "ar";
      this.textDir = 'rtl';
    }
    else if (localStorage.getItem("lang") != "ar") {
      localStorage.setItem("lang", "en");
      this.textDir = 'ltr';
    }

    // if (this.activatedRoute.queryParams != undefined) {
    //   this.activatedRoute.queryParams.subscribe(params => {
    //     this._token = params['token'];
    //     this._email = params['email'];
    //   });
    // }
    if (this.activatedRoute.params != undefined) {
      this.activatedRoute.params.subscribe(params => {
        this._token = params['token'];
        this._email = params['email'];
      });
    }

    this.resetPasswordForm = new FormGroup({
      password: new FormControl('', [Validators.required]),
      confirm: new FormControl('', [Validators.required])
    });

    this.resetPasswordForm.get('confirm').setValidators([Validators.required,
    this._passConfValidator.validateConfirmPassword(this.resetPasswordForm.get('password'))]);
  }
  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
  toggleRepeatFieldTextType() {
    this.repeatFieldTextType = !this.repeatFieldTextType;
  }
  public validateControl = (controlName: string) => {
    return this.resetPasswordForm.controls[controlName].invalid && this.resetPasswordForm.controls[controlName].touched
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.resetPasswordForm.controls[controlName].hasError(errorName)
  }

  public resetPassword = (resetPasswordFormValue) => {
    this.showError = this.showSuccess = false;

    const resetPass = { ...resetPasswordFormValue };
    const resetPassDto: ResetPasswordVM = {
      password: resetPass.password,
      confirmPassword: resetPass.confirm,
      token: this._token,
      email: this._email
    }

    this.userService.resetPassword('api/Authenticate/ResetPassword', resetPassDto)
      .subscribe(_ => {
        this.showSuccess = true;
      },
        error => {
          this.showError = true;
          if (error.error.status == 'Error') {
            this.errorMessage = error.error.messageAr;
          }
        });
  }
}
