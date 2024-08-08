import { Component, OnInit } from '@angular/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { WNPMAssetTimeService } from 'src/app/Shared/Services/wnPMAssetTime.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  years: Years[] = [];
  selectedYear: number = 0;
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;

  constructor(private authenticationService: AuthenticationService, private wnPMAssetTimeService: WNPMAssetTimeService, private ngxService: NgxUiLoaderService) {
    this.currentUser = this.authenticationService.currentUserValue;
  }
  ngOnInit(): void {
    this.getYear();
  }


  getYear() {
    var currentYear = new Date().getFullYear();
    for (var i = currentYear; i <= 2050; i++) {
      var y = new Years();
      y.id = i;
      y.name = i;
      this.years.push(y);
    }
  }
  selectAssetTimeYear(year) {
    this.selectedYear = year;
  }
  onSubmit() {
    if (this.selectedYear == 0) {
      this.errorDisplay = true;
      if (this.lang == 'en') {
        this.errorMessage = "Please select Year";
      } if (this.lang == 'ar') {
        this.errorMessage = "من فضلك اختر سنة";
      }
      return false;
    }
    else {
      this.ngxService.start("startCal1");
      this.wnPMAssetTimeService.CreateAssetTimes(this.selectedYear, this.currentUser.hospitalId).subscribe(addtimes => {
        this.display = true;
        this.ngxService.stop("startCal1");
      }, (error) => {
        this.errorDisplay = true;
        if (this.lang == 'en') {
          if (error.error.status == 'year') {
            this.errorMessage = error.error.message;
          }
        } if (this.lang == 'ar') {
          if (error.error.status == 'year') {
            this.errorMessage = error.error.messageAr;
          }
        }
        return false;
      });
    }
  }
}

export class Years {
  id: number;
  name: number;
}