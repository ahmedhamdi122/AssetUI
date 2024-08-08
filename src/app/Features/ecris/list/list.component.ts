import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { EditECRIVM, ListECRIVM, SortECRIVM } from 'src/app/Shared/Models/ecriVM';
import { Paging } from 'src/app/Shared/Models/paging';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { ECRIService } from 'src/app/Shared/Services/ecri.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { DeleteEcriConfirmationComponent } from '../delete-ecri-confirmation/delete-ecri-confirmation.component'

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  lang = localStorage.getItem("lang");
  page: Paging;
  ecrisList: ListECRIVM[] = [];
  sortObj: SortECRIVM;
  selectedObj: EditECRIVM;
  textDir: string = 'ltr';
  currentUser: LoggedUser;
  count: number;
  sortStatus: string = "descending";
  loading: boolean;
  constructor(private authenticationService: AuthenticationService, private ecriService: ECRIService,
    private dialog: MatDialog, public dialogService: DialogService,
    private route: Router) { this.currentUser = this.authenticationService.currentUserValue; }


  ngOnInit(): void {

    this.sortObj = { nameAr: '', name: '', code: '', sortStatus: '' };
    this.page = {
      pagenumber: 1,
      pagesize: 10,
    }
    this.ecriService.GetECRISWithPaging(this.page).subscribe(data => {
      this.ecrisList = data;
      this.loading = true;
    });
    this.ecriService.getCount().subscribe((data) => {
      this.count = data;
    });
  }

  deleteEcri(id: number) {
    this.ecriService.GetECRIById(id).subscribe((data) => {
      this.selectedObj = data;

      const ecriDialog = this.dialog
        .open(DeleteEcriConfirmationComponent, {
          width: '30%',
          autoFocus: true,
          data: {
            id: this.selectedObj.id,
            name: this.selectedObj.name,
            nameAr: this.selectedObj.nameAr
          },
        });
      ecriDialog.afterClosed().subscribe(result => {
        let currentUrl = this.route.url;
        this.route.routeReuseStrategy.shouldReuseRoute = () => false;
        this.route.onSameUrlNavigation = 'reload';
        this.route.navigate([currentUrl]);
      });
    });
  }

  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;

    this.loading = true;

    setTimeout(() => {
      this.ecriService.GetECRISWithPaging(this.page).subscribe((items) => {
        this.ecrisList = items;
        this.loading = false;
      });
    }, 1000);



    // setTimeout(() => {
    //   this.customerService.getCustomers({ lazyEvent: JSON.stringify(event) }).then(res => {
    //     this.customers = res.customers;
    //     this.totalRecords = res.totalRecords;
    //     this.loading = false;
    //   })
    // }, 1000);

  }


  sort(field) {
    if (this.sortStatus === "descending") {
      this.sortStatus = "ascending";
      this.sortObj.sortStatus = this.sortStatus;
    }
    else {
      this.sortStatus = "descending"
      this.sortObj.sortStatus = this.sortStatus;
    }

    if (field.currentTarget.id == "Code") {
      this.sortObj.code = field.currentTarget.id
    }
    else if (field.currentTarget.id == "الكود") {
      this.sortObj.code = field.currentTarget.id
    }
    if (field.currentTarget.id == "Name") {
      this.sortObj.name = field.currentTarget.id
    }
    else if (field.currentTarget.id == "الاسم") {
      this.sortObj.nameAr = field.currentTarget.id
    }




    this.ecriService.sortECRI(this.page.pagenumber, this.page.pagesize, this.sortObj).subscribe(data => {
      this.ecrisList = data,
        this.sortStatus = this.sortObj.sortStatus,
        this.sortObj = { nameAr: '', name: '', code: '', sortStatus: '' };
    })
  }
}
