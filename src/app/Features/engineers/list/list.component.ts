import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { EngineerVM, ListEngineerVM, SortEngineerVM } from 'src/app/Shared/Models/engineerVM';
import { Paging } from 'src/app/Shared/Models/paging';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { EngineerService } from 'src/app/Shared/Services/engineer.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { DeleteconfirmationComponent } from '../deleteconfirmation/deleteconfirmation.component';
import { ViewComponent } from '../view/view.component';
import { CreateComponent } from '../create/create.component';


@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  currentUser: LoggedUser;
  page: Paging;
  count: number;
  sortObj: SortEngineerVM;
  sortStatus: string = "descending";
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  selectedObj: EngineerVM;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 10,
    lengthMenu: [10, 25, 50, 100, 'All'],
    order: [],
    info: false,
    paging: false,
    responsive: true,

  };

  lstEngineers: ListEngineerVM[] = [];
  isVisitEngineerManager: boolean = false;

  lstRoleNames: string[] = [];

  constructor(private authenticationService: AuthenticationService, private route: Router,
    private engineerService: EngineerService, public dialogService: DialogService, private dialog: MatDialog) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.sortObj = {
      name: '', nameAr: '', code: '', email: '', sortStatus: ''
    }
    this.engineerService.getCount().subscribe((data) => {
      this.count = data;
    });
    this.page = {
      pagenumber: 1,
      pagesize: 5,
    }
    this.engineerService.GetEngineersWithPaging(this.page).subscribe(engineers => {
      this.lstEngineers = engineers;
    });

    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });
      this.isVisitEngineerManager = (['VisitManagerEngineer'].some(r => this.lstRoleNames.includes(r)));
    }
  }


  clicktbl(event) {
    this.page.pagenumber = (event.first + 5) / 5;
    this.page.pagesize = event.rows;
    this.engineerService.GetEngineersWithPaging(this.page).subscribe((items) => {
      this.lstEngineers = items;
    });
  }

  viewEngineer(id: number) {
    const dialogRef2 = this.dialogService.open(ViewComponent, {
      header: this.lang == "en" ? 'View Engineer' : "بيانات المهندس",
      width: '50%',
      data: {
        id: id
      },
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });
    dialogRef2.onClose.subscribe((res) => {
      this.reload();
    });
  }

  deleteEngineer(id: number) {
    this.engineerService.GetEngineerById(id).subscribe((data) => {
      this.selectedObj = data;
      const dialogRef2 = this.dialog.open(DeleteconfirmationComponent, {
        width: '30%',
        autoFocus: true,
        data: {
          id: this.selectedObj.id,
          genderId: this.selectedObj.genderId
        },
      });
      dialogRef2.afterClosed().subscribe(deleted => {
        this.reload();
      });
    });
  }

  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    $.fn['dataTable'].ext.search.pop();
  }

  reload() {
    this.ngOnDestroy();
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }
  addEngineer() {
    const dialogRef2 = this.dialogService.open(CreateComponent, {
      header: this.lang == "en" ? 'Add Engineer' : "أضف مهندس",
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });
    dialogRef2.onClose.subscribe((res) => {
      this.reload();
    });
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

    if (field.currentTarget.id == "Engineers") {
      this.sortObj.name = field.currentTarget.id
    }
    else if (field.currentTarget.id == "المهندسين") {
      this.sortObj.nameAr = field.currentTarget.id
    }

    this.engineerService.sortEngineers(this.page.pagenumber, this.page.pagesize, this.sortObj).subscribe(data => {
      this.lstEngineers = data,
        this.sortStatus = this.sortObj.sortStatus,
        this.sortObj = {
          name: '', nameAr: '', code: '', email: '', sortStatus: ''
        }
    })
  }
}
