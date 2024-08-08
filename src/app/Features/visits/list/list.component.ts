import { Component, OnInit } from '@angular/core';
import { ListBuildingVM } from 'src/app/Shared/Models/buildingVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { ListVisitVM, SearchVisitVM, SortVisitsVM, VisitVM } from 'src/app/Shared/Models/visitVM';
import { BuildingService } from 'src/app/Shared/Services/building.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { VisitService } from 'src/app/Shared/Services/visit.service';
import { ConfirmationService, SortEvent } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateComponent } from '../create/create.component';
import { Router } from '@angular/router';
import { Paging } from 'src/app/Shared/Models/paging';
import { ListVisitTypeVM } from 'src/app/Shared/Models/visitTypeVM';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { VisitTypeService } from 'src/app/Shared/Services/visitType.service';
import { EditComponent } from '../edit/edit.component';
import { ListEngineerVM } from 'src/app/Shared/Models/engineerVM';
import { ViewComponent } from '../view/view.component';
import { DeleteconfirmationComponent } from '../deleteconfirmation/deleteconfirmation.component';
import { MatDialog } from '@angular/material/dialog';
import { EngineerService } from 'src/app/Shared/Services/engineer.service';

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
  selectedHospitalId: number;
  hospitalId: number;
  isDisabled: boolean = false;
  lstBuildings: ListBuildingVM[] = [];
  lstHospitals: ListHospitalVM[] = [];
  lstEngineers: ListEngineerVM[] = [];
  lstvisitTypes: ListVisitTypeVM[] = [];
  errorDisplay: boolean = false;
  errorMessage: string;
  isvtype: boolean = false;
  isEng: boolean = false;
  searchObj: SearchVisitVM;
  selectedObj: VisitVM;
  lstVisits: ListVisitVM[] = [];
  sortStatus: string = "descending";
  sortObj: SortVisitsVM;
  isVisitEngineer: boolean = false;
  isVisitEngineerManager: boolean = false;
  verified: boolean;

  lstRoleNames: string[] = [];

  constructor(private buildingService: BuildingService, private authenticationService: AuthenticationService,
    private visitService: VisitService, private engineerService: EngineerService, private dialog: MatDialog, private router: Router,
    private hospitalService: HospitalService, private visitTypeService: VisitTypeService,
    public dialogService: DialogService, private confirmationService: ConfirmationService) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.visitService.GetAllVisits().subscribe(visits => {
      this.lstVisits = visits;
    });
    this.hospitalService.GetHospitals().subscribe(allhospitals => {
      this.lstHospitals = allhospitals;
    });
    this.engineerService.GetAllEngineers().subscribe(allengineers => {
      this.lstEngineers = allengineers;
    });
    this.visitTypeService.GetAllVisitTypes().subscribe(allvisitTypes => {
      this.lstvisitTypes = allvisitTypes;
    });


    this.searchObj = { fromVisitDate: '', toVisitDate: '', hospitalId: 0, engineerId: 0, visitTypeId: 0, userId: '' }
    this.sortObj = {
      visitDate: '', sortStatus: '', hospitalName: '', engineerName: '',
      visitTypeName: '', hospitalNameAr: '',
      engineerNameAr: '', visitTypeNameAr: ''
    }

    this.visitService.getCount().subscribe((data) => {
      this.count = data;
    });
    this.page = {
      pagenumber: 1,
      pagesize: 10,
    }
    this.visitService.GetVisitsWithPaging(this.page).subscribe(visits => {
      this.lstVisits = visits;
    });

    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });
      this.isVisitEngineer = (['VisitEngineer'].some(r => this.lstRoleNames.includes(r)));
      this.isVisitEngineerManager = (['VisitManagerEngineer'].some(r => this.lstRoleNames.includes(r)));
    }
  }
  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;

    this.visitService.GetVisitsWithPaging(this.page).subscribe((items) => {
      this.lstVisits = items;
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
    if (field.currentTarget.id == "Visit Date") {
      this.sortObj.visitDate = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "تاريخ الزيارة") {
      this.sortObj.visitDate = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "Hospitals") {
      this.sortObj.hospitalName = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "المستشفيات") {
      this.sortObj.hospitalNameAr = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "Engineers") {
      this.sortObj.engineerName = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "المهندسين") {
      this.sortObj.engineerName = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "Visit Type") {
      this.sortObj.visitTypeName = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "نوع الزيارة") {
      this.sortObj.visitTypeNameAr = field.currentTarget.id;
    }
    this.visitService.SortVisits(this.page.pagenumber, this.page.pagesize, this.sortObj, 0).subscribe(data => {
      this.lstVisits = data;
      this.sortStatus = this.sortObj.sortStatus,
        this.sortObj = {
          visitDate: '', sortStatus: '', hospitalName: '', engineerName: '', visitTypeName: '', hospitalNameAr: '',
          engineerNameAr: '', visitTypeNameAr: ''
        }
    })
  }
  getHospitalId($event) {
    this.hospitalId = $event.target.value;
    this.buildingService.GetAllBuildingsByHospitalId(this.hospitalId).subscribe(builds => {
      this.lstBuildings = builds;
    });
  }
  viewVisit(id: number) {
    const dialogRef2 = this.dialogService.open(ViewComponent, {
      header: this.lang == "en" ? 'View Visit' : "بيانات الزيارة",
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
  reload() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
  onSearch() {
    this.searchObj.userId = this.currentUser.id;
    if (this.lang == "en") {
      if (this.searchObj.hospitalId == 0 && this.searchObj.fromVisitDate == '' && this.searchObj.toVisitDate == '' && this.searchObj.visitTypeId == 0
        && this.searchObj.engineerId == 0) {
        this.errorDisplay = true
        this.errorMessage = "Please select search criteria";
        return false;
      }
    }
    else if (this.lang == "ar") {
      if (this.searchObj.hospitalId == 0 && this.searchObj.fromVisitDate == '' && this.searchObj.toVisitDate == '' && this.searchObj.visitTypeId == 0
        && this.searchObj.engineerId == 0) {
        this.errorDisplay = true
        this.errorMessage = "من فضلك اختر مجال البحث";
        return false;
      }
    }
    this.visitService.SearchInVisits(this.page.pagenumber, this.page.pagesize, this.searchObj).subscribe(results => {
      this.lstVisits = results;
    });

    this.visitService.SearchInVisitsCount(this.searchObj).subscribe((data) => {
      this.count = data;
    });
  }

  verifyVisit(id: number) {
    this.visitService.GetVisitById(id).subscribe(visitObj => {
      visitObj.statusId = 1;
      this.visitService.verifyVisit(visitObj).subscribe(updateStatus => { });
      this.reload();
    });
  }

  deleteVisit(id: number) {
    this.visitService.GetVisitById(id).subscribe((data) => {
      this.selectedObj = data;

      const dialogRef2 = this.dialog.open(DeleteconfirmationComponent, {
        width: '30%',
        autoFocus: true,
        data: {
          id: this.selectedObj.id,
          hospitalId: this.selectedObj.hospitalId,
          visitTypeId: this.selectedObj.visitTypeId,
        },
      });
      dialogRef2.afterClosed().subscribe(deleted => {
        this.reload();
      });
    });

  }
  editVisit(id: number) {
    const dialogRef2 = this.dialogService.open(EditComponent, {
      header: this.lang == "en" ? 'Edit Visit' : "تعديل زيارة",
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
  addVisit() {
    const dialogRef2 = this.dialogService.open(CreateComponent, {
      header: this.lang == "en" ? 'Add Visit' : "اضف زيارة",
      width: '50%',
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
  reset() {
    this.reload();
  }
}
