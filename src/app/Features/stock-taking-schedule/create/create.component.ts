import { Component, OnInit } from '@angular/core';
import {  ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { TranslateModule } from '@ngx-translate/core';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { CreateStockTakingScheduleVM } from 'src/app/Shared/Models/StockTakingScheduleVM';
import { data } from 'jquery';
import { Router } from '@angular/router';
import { StockTakingScheduleService } from 'src/app/Shared/Services/stock-taking-schedule.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  lang = localStorage.getItem('lang');
  dir: string = "ltr";
  currentUser: LoggedUser;
  hospitals: ListHospitalVM[] = [];
  isDisabled: boolean = false;
  stockTakingScheduleObj:CreateStockTakingScheduleVM;
  display:boolean=false;
  isValidDate: any;
  error: any = { isError: false, errorMessage: '' };
  dateError: boolean = false;
  errorDisplay: boolean = false;
  errorMessage: string = "";
  formData = new FormData();




  
  //select list of hospital objects
  //selectedHospitals: ListHospitalVM[] = [];


  //select list of hospital Ids
  selectedHospitals: number[] = [];


  constructor( private hospitalService: HospitalService , private router:Router
     ,private stockTakingScheduleService:StockTakingScheduleService 
     ,private authenticationService: AuthenticationService , private datePipe: DatePipe )
      { this.currentUser = this.authenticationService.currentUserValue;}

  ngOnInit(): void {
    this.stockTakingScheduleObj={creationDate: new Date(),endDate:new Date(),id:0,startDate:new Date(),stCode:"",userId:"",listHospitalIds:[]}
    this.hospitalService.GetHospitals().subscribe({
      next:(res)=>this.hospitals=res
    });

    this.stockTakingScheduleService.GenerateStockScheduleTakingNumber().subscribe({
      next:(res)=>this.stockTakingScheduleObj.stCode=res.outNumber
    })
    
  }
  onSubmit(){
    this.stockTakingScheduleObj.userId=this.currentUser.id;
    this.stockTakingScheduleObj.listHospitalIds = this.selectedHospitals;

    let creationDate = this.datePipe.transform(this.stockTakingScheduleObj.creationDate, "yyyy-MM-dd");
    let endDate = this.datePipe.transform(this.stockTakingScheduleObj.endDate, "yyyy-MM-dd");

    this.isValidDate = this.validateDates(creationDate, endDate);
    if (!this.isValidDate) {
      this.dateError = true;
      return false;
    }

  
    this.stockTakingScheduleService
    .CreateStockTakingSchedule(this.stockTakingScheduleObj)
    .subscribe(item=>{
      this.display=true;
    });
    
  }


 


  back() {this.router.navigate(['/dash/stockTakingSchedule']);}


  validateDates(creationDate: string, endDate: string) {
    this.isValidDate = true;
    if ((creationDate != null && endDate != null) && (endDate) < (creationDate)) {
      if (this.lang == "en") {
        this.error = { isError: true, errorMessage: 'Stock Taking Start Date should be less than end date.' };
      }
      else {
        this.error = { isError: true, errorMessage: 'ناريخ بداية الجرد لابد أن يكون قبل تاريخ النهاية' };
      }
      this.isValidDate = false;
    }
    return this.isValidDate;
  }

}
