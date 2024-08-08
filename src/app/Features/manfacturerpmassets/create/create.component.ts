import { Component, OnInit } from '@angular/core';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { ManfacturerpmassetsService } from 'src/app/Shared/Services/manfacturerpmassets.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { Paging } from 'src/app/Shared/Models/paging';
import { ListUnScheduledManfacturerPMAssetVM } from 'src/app/Shared/Models/manfacturerPMAssetVM';

ManfacturerpmassetsService
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';

  direction: string = 'ltr';
  dir: string = "rtl";
  selectedLang: string;
  currentUser: LoggedUser;
  selectedYear: number = 0;
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  page: Paging;
  lstUnscheduledAsset: ListUnScheduledManfacturerPMAssetVM[] = [];
  count: number = 0;
  displayUnscheduledList: boolean = false;
  loading: boolean = true;
  showingTable: boolean = false;

  constructor(private manfacturerPMAssetService: ManfacturerpmassetsService,
    private router: Router, private authenticationService: AuthenticationService, private ngxService: NgxUiLoaderService
  ) {
    this.currentUser = this.authenticationService.currentUserValue;

  }

  ngOnInit(): void {

    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }
    this.page = {
      pagenumber: 1,
      pagesize: 10,
    }

  }

  onSubmit() {

    //this.ngxService.start();
    //  this.manfacturerPMAssetService.CreateManfacturerAssetTimes().subscribe({next:()=>{
    //   setTimeout(() => {
    //     this.ngxService.stop(); // stop foreground spinner of the master loader with 'default' taskId
    //   }, 1500);

    //  }});

    this.manfacturerPMAssetService.CreateManfacturerAssetTimes(this.page.pagenumber, this.page.pagesize)
      .subscribe({
        next: (res) => {
          this.lstUnscheduledAsset = res.results;
          this.count = res.count;
          this.displayUnscheduledList = true;
          this.loading = false;
          this.showingTable = true;
        }
      })


  }

  // function responsible for pagination
  clicktbl(event) {


    if (this.showingTable == true) {

      // code here to paginate 
      this.page.pagenumber = (event.first + 10) / 10;
      this.page.pagesize = event.rows;

      // write your service here to call method 
      this.manfacturerPMAssetService.CreateManfacturerAssetTimes(this.page.pagenumber, this.page.pagesize)
        .subscribe({
          next: (res) => {
            this.lstUnscheduledAsset = res.results;
            this.count = res.count;
            this.displayUnscheduledList = true;
            this.loading = false;
          }
        })

    }




  }

}
