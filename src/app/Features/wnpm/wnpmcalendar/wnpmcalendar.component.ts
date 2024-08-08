import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { CalendarOptions, EventClickArg } from '@fullcalendar/angular';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';


import arLocale from '@fullcalendar/core/locales/ar';
import enLocale from '@fullcalendar/core/locales/en-gb';
import { CalendarWNPMAssetTimeVM } from 'src/app/Shared/Models/wnPMAssetTimeVM';
import { WNPMAssetTimeService } from 'src/app/Shared/Services/wnPMAssetTime.service';
import { DialogService } from 'primeng/dynamicdialog';
import { ViewComponent } from '../view/view.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-wnpmcalendar',
  templateUrl: './wnpmcalendar.component.html',
  styleUrls: ['./wnpmcalendar.component.css']
})
export class WnpmcalendarComponent implements OnInit {

  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  output: string;
  strResult: any;
  assetId: number;
  wnpmAssetTimesObj: CalendarWNPMAssetTimeVM;
  lstWNPMAssetTimes: CalendarWNPMAssetTimeVM[] = [];

  calendarOptions: CalendarOptions = {
    initialView: "dayGridMonth",
    slotDuration: "00:10:00",
    locales: [enLocale, arLocale],
    locale: this.lang == "en" ? "en" : "ar",
    direction: this.lang == "en" ? 'ltr' : "rtl",
    slotEventOverlap: false,
    selectOverlap: false,
    eventOverlap: false,
    slotMinTime: '08:00:00',
    slotMaxTime: '18:00:00',
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    firstDay: 1,
    events: [],
  };

  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';


  constructor(
    private authenticationService: AuthenticationService, private route: Router, private wnPMAssetTimeService: WNPMAssetTimeService,
    public datepipe: DatePipe, public dialogService: DialogService, private ngxService: NgxUiLoaderService) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {

    this.ngxService.start("startCal");
    this.output = "[";
    this.wnPMAssetTimeService.GetAllForCalendar(this.currentUser.hospitalId, this.currentUser.id).subscribe((data) => {
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          var item = new CalendarWNPMAssetTimeVM();
          item.id = data[i]["id"];
          item.title = this.lang == "en" ? data[i]["title"] : data[i]["titleAr"];
          item.start = data[i]["start"];
          item.end = data[i]["end"];
          item.allDay = data[i]["allDay"];
          item.color = data[i]["color"];
          item.textColor = data[i]["textColor"];
          item.listMasterAssetTasks = data[i]["listMasterAssetTasks"];
          this.lstWNPMAssetTimes.push(item);
        }
        this.lstWNPMAssetTimes.forEach((element) => {
          this.output += '{ "title": "' + element.title + '" , "start" : "' + element.start + '"  , "end": "' + element.end + '"  , "all-day" : "' + element.allDay + '" , "color" : "' + element.color + '", "textColor" : "' + element.textColor + '" , "id" : "' + element.id + '" },';
        });
        this.output = this.output.substring(0, this.output.lastIndexOf(","));
        this.output += "]";
        let result = JSON.parse(this.output);
        this.calendarOptions.events = result;
        this.calendarOptions.eventClick = this.handleEventClick.bind(this);
        this.ngxService.stop("startCal");
      }
    });

  }

  handleEventClick(clickInfo: EventClickArg) {
    const ref = this.dialogService.open(ViewComponent, {
      header: this.lang == "en" ? 'View PM For adi ElNile' : "بيان الصيانة الدورية لوادي النيل",
      width: '50%', data: {
        id: clickInfo.event.id
      },
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });
    ref.onClose.subscribe((page) => {
    });
  }


  back() { this.route.navigate(['/dash/wnpm/']); }

}
