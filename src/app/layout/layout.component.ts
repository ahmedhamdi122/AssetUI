import { Component, HostListener, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { LoggedUser } from '../Shared/Models/userVM';
import { AuthenticationService } from '../Shared/Services/guards/authentication.service';
import { Router } from '@angular/router';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.css'],
})
export class LayoutComponent implements OnInit {

  lang = localStorage.getItem('lang');
  textDir: string = 'rtl';
  currentUser: LoggedUser;
  isRefreshed = false;
  direction: string;
  selectedLang: string;
  done: string;


  constructor(private observer: BreakpointObserver,
    private authenticationService: AuthenticationService, private router: Router,
    private translate: TranslateService) {

 
      this.done = undefined;
      if (this.lang == 'ar') {
        this.textDir = 'rtl';
        this.direction = 'rtl';
      }
      else {
        this.textDir = 'ltr';
        this.direction = 'ltr';
      }

  }

  ngOnInit(): void {
    if (localStorage.getItem("lang") == null) {
      this.lang == 'ar'
      this.textDir = 'rtl';
    }



    if (localStorage.getItem('lang') == "en") {
      this.textDir = "ltr";
    }
    if (localStorage.getItem('lang') == "ar") {
      this.textDir = "rtl";
    }


  }
}
