import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { LoggedUser } from '../../Models/userVM';
import { AuthenticationService } from './authentication.service';


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    AuthorizedRoles;
    user: LoggedUser;
    public currentUser: LoggedUser;
    constructor(private router: Router,
        private authenticationService: AuthenticationService, private cookieService: CookieService) { }



    canActivate(): boolean {
        if (this.authenticationService.isLogged()) {
            return true;
        }
        else {
            this.router.navigate(['']);
            return false;
        }
    }
}
