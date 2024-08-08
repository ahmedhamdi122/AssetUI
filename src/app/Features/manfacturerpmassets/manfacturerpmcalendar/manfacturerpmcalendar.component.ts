import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { CalendarOptions, EventClickArg } from '@fullcalendar/angular';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarHorizontalPosition, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';


import arLocale from '@fullcalendar/core/locales/ar';
import enLocale from '@fullcalendar/core/locales/en-gb';
import { CalendarManfacturerPMAssetTimeVM } from 'src/app/Shared/Models/manfacturerPMAssetVM';
import { ManfacturerpmassetsService } from 'src/app/Shared/Services/manfacturerpmassets.service';

@Component({
  selector: 'app-manfacturerpmcalendar',
  templateUrl: './manfacturerpmcalendar.component.html',
  styles: [
  ]
})
export class ManfacturerpmcalendarComponent implements OnInit {

  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  output: string;
  strResult: any;
  assetId: number;
  manfacturerPMAssetTimeObj: CalendarManfacturerPMAssetTimeVM;
  lstmanfacturerPMAssetTimes: CalendarManfacturerPMAssetTimeVM[] = [];
  horizontalPosition: MatSnackBarHorizontalPosition = 'start';
  verticalPosition: MatSnackBarVerticalPosition = 'bottom';

  calendarOptions: CalendarOptions = {
    initialView: "dayGridMonth",
    slotDuration: "00:10:00",
    locales: [enLocale, arLocale],
    locale: this.lang == "en" ? "en" : "ar",
    direction: this.lang == "en" ? 'ltr' : "rtl",
    headerToolbar: {
      left: 'prev,next',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },
    firstDay: 1,
    events: [],
  };



  constructor(
    private authenticationService: AuthenticationService, private route: Router,
    private snackBar: MatSnackBar
    , public datepipe: DatePipe, private manfacturerPmAssetService: ManfacturerpmassetsService) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.output = "[";
    //this.manfacturerPmAssetService.
    this.manfacturerPmAssetService.GetAllForManfacturerCalendar(this.currentUser.hospitalId, this.currentUser.id)
      .subscribe({
        next: (data) => {
          for (var i = 0; i < data.length; i++) {
            var item = new CalendarManfacturerPMAssetTimeVM();
            item.id = data[i]["id"];
            item.title = this.lang == "en" ? data[i]["title"] : data[i]["titleAr"];
            item.start = data[i]["start"];
            item.end = data[i]["end"];
            item.allDay = data[i]["allDay"];
            item.color = data[i]["color"];
            item.textColor = data[i]["textColor"];
            item.listMasterAssetTasks = data[i]["listMasterAssetTasks"];
            this.lstmanfacturerPMAssetTimes.push(item);
          }
          this.lstmanfacturerPMAssetTimes.forEach((element) => {
            this.output += '{ "title": "' + element.title + '" , "start" : "' + element.start + '"  , "end": "' + element.end + '"  , "all-day" : "' + element.allDay + '" , "color" : "' + element.color + '", "textColor" : "' + element.textColor + '" , "id" : "' + element.id + '" },';
          });
          this.output = this.output.substring(0, this.output.lastIndexOf(","));
          this.output += "]";
          let result = JSON.parse(this.output);
          this.calendarOptions.events = result;
          this.calendarOptions.eventClick = this.handleEventClick.bind(this);





        }
      })

    // this.manfacturerPmAssetService.GetAllForManfacturerCalendar
  }

  
  handleEventClick(clickInfo: EventClickArg) {
    // this.action = "close";
    // /info.event.url
    var strTasks = [];

    this.lstmanfacturerPMAssetTimes.forEach(element => {
      if (element.id.toString() == clickInfo.event.id) {
        if (element.listMasterAssetTasks != null) {
          element.listMasterAssetTasks.forEach(taskObj => {
            if (this.lang == "en") {
              strTasks.push(taskObj.taskName);
            }
            else {
              strTasks.push(taskObj.taskNameAr);
            }
          });
        }
        else {
          strTasks.push(clickInfo.event.start);
        }
      }
    });


    this.snackBar.open(strTasks.toString(), "close");
  }





  // handleEventClick
  back() {
    this.route.navigate(['/dash/manfacturerPMAssets/'])
  }

}
