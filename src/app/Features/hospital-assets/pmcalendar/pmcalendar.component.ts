import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventClickArg } from '@fullcalendar/angular';
import { ListPMAssetTaskScheduleVM } from 'src/app/Shared/Models/assetDetailVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';

import arLocale from '@fullcalendar/core/locales/ar';
import enLocale from '@fullcalendar/core/locales/en-gb';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
  selector: 'app-pmcalendar',
  templateUrl: './pmcalendar.component.html',
  styleUrls: ['./pmcalendar.component.css']
})
export class PmcalendarComponent implements OnInit {
  [x: string]: any;
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  scheduleObj: ListPMAssetTaskScheduleVM;

  lstItems: ListPMAssetTaskScheduleVM[];
  output: string;
  strResult: any;
  assetId: number;
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
    private authenticationService: AuthenticationService, private assetDetailService: AssetDetailService, private route: Router,
    private activatedRoute: ActivatedRoute, private snackBar: MatSnackBar, public datepipe: DatePipe) { this.currentUser = this.authenticationService.currentUserValue; }



  ngOnInit(): void {
    this.scheduleObj = {
      id: 0, title: '', start: '', end: '', color: '', textColor: '', assetName: '', allDay: false,
      assetNameAr: '', listTasks: [], titleAr: ''
    };
    let id = this.activatedRoute.snapshot.params['id'];
    this.assetId = id;

    this.lstItems = [];
    this.output = "[";
    this.assetDetailService.GetAllPMAssetTaskScheduleByAssetId(this.assetId).subscribe((data) => {
      this.lstSchedule = data;
      for (var i = 0; i < this.lstSchedule.length; i++) {
        var item = new ListPMAssetTaskScheduleVM();
        item.id = this.lstSchedule[i]["id"];
        item.title = this.lang == "en" ? this.lstSchedule[i]["title"] : this.lstSchedule[i]["titleAr"];
        item.start = this.lstSchedule[i]["start"];
        item.end = this.lstSchedule[i]["end"];
        item.allDay = this.lstSchedule[i]["allDay"];
        item.color = this.lstSchedule[i]["color"];
        item.textColor = this.lstSchedule[i]["textColor"];
        item.listTasks = this.lstSchedule[i]["listTasks"];
        this.lstItems.push(item);
      }
      this.lstItems.forEach((element) => {
        element.start = this.datepipe.transform(element.start, 'yyyy-MM-dd');
        element.end = this.datepipe.transform(element.end, 'yyyy-MM-dd');

        this.output += '{ "title": "' + element.title + '" , "start" : "' + element.start + '"  , "end": "' + element.end + '"  , "all-day" : "' + element.allDay + '" , "color" : "' + element.color + '", "textColor" : "' + element.textColor + '" , "id" : "' + element.id + '" },';
      });
      this.output = this.output.substring(0, this.output.lastIndexOf(","));
      this.output += "]";
      let result = JSON.parse(this.output);
      this.calendarOptions.events = result;
      this.calendarOptions.eventClick = this.handleEventClick.bind(this);
    });




    // this.assetDetailService.GetAllPMAssetTaskSchedules(0).subscribe((data) => {
    //   this.lstSchedule = data;
    //   for (var i = 0; i < this.lstSchedule.length; i++) {
    //     var item = new ListPMAssetTaskScheduleVM();
    //     item.id = this.lstSchedule[i]["id"];
    //     item.title = this.lang == "en" ? this.lstSchedule[i]["title"] : this.lstSchedule[i]["titleAr"];
    //     item.start = this.lstSchedule[i]["start"];
    //     item.end = this.lstSchedule[i]["end"];
    //     item.allDay = this.lstSchedule[i]["allDay"];
    //     item.color = this.lstSchedule[i]["color"];
    //     item.textColor = this.lstSchedule[i]["textColor"];
    //     item.listTasks = this.lstSchedule[i]["listTasks"];
    //     this.lstItems.push(item);
    //   }
    //   this.lstItems.forEach((element) => {
    //     element.start = this.datepipe.transform(element.start, 'yyyy-MM-dd');
    //     element.end = this.datepipe.transform(element.end, 'yyyy-MM-dd');

    //     this.output += '{ "title": "' + element.title + '" , "start" : "' + element.start + '"  , "end": "' + element.end + '"  , "all-day" : "' + element.allDay + '" , "color" : "' + element.color + '", "textColor" : "' + element.textColor + '" , "id" : "' + element.id + '" },';
    //   });
    //   this.output = this.output.substring(0, this.output.lastIndexOf(","));
    //   this.output += "]";
    //   let result = JSON.parse(this.output);
    //   this.calendarOptions.events = result;
    //   this.calendarOptions.eventClick = this.handleEventClick.bind(this);
    // });
    // let id = this.activatedRoute.snapshot.params['id'];
    // this.assetId = id;
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.action = "close";
    var strTasks = [];
    this.lstItems.forEach(element => {
      if (element.id.toString() == clickInfo.event.id) {
        element.listTasks.forEach(taskObj => {
          if (this.lang == "en") {
            strTasks.push(taskObj.name);
          }
          else {
            strTasks.push(taskObj.nameAr);
          }
        });
      }
    });

    this.snackBar.open(strTasks.toString(), this.action, { panelClass: 'snackbar' });
  }


  back() { this.route.navigate(['/hospitalassets/detail/', this.assetId]); }
}
