import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { DialogService } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { EditBrandVM } from 'src/app/Shared/Models/brandVM';
import { ListClassVM, SortClassVM } from 'src/app/Shared/Models/classVM';
import { Paging } from 'src/app/Shared/Models/paging';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { ClassifyService } from 'src/app/Shared/Services/classify.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { DeleteClassificationsConfirmationComponent } from '../delete-classifications-confirmation/delete-classifications-confirmation.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  lang = localStorage.getItem("lang");
  ClassificationsList: ListClassVM[] = []
  selectedObj: EditBrandVM;
  textDir: string = 'ltr';
  page: Paging;
  count: number;
  currentUser: LoggedUser;
  loading: boolean = true;
  sortStatus: string = "ascending";
  sortObj: SortClassVM;

  // @ViewChild(DataTableDirective, { static: false })
  // datatableElement: DataTableDirective;

  // dtTrigger: Subject<any> = new Subject<any>();
  // dtOptions: DataTables.Settings = {
  //   pagingType: 'full_numbers',
  //   pageLength: 10,
  //   lengthMenu: [10, 25, 50, 100, 'All'],
  //   order: [],
  //   info: false,
  //   paging: false,
  //   responsive: true,
  //   language:
  //     this.lang == "en" ? {
  //       "emptyTable": "No data available in table",
  //       "info": "Showing _START_ to _END_ of _TOTAL_ entries",
  //       "infoEmpty": "Showing 0 to 0 of 0 entries",
  //       "infoFiltered": "(filtered from _MAX_ total entries)",
  //       "lengthMenu": "Show _MENU_ entries",
  //       "loadingRecords": "Loading...",
  //       "processing": "Processing...",
  //       "search": "Search:",
  //       "zeroRecords": "No matching records found",
  //       "thousands": ",",
  //       "paginate": {
  //         "first": "First",
  //         "last": "Last",
  //         "next": "Next",
  //         "previous": "Previous"
  //       },
  //       "aria": {
  //         "sortAscending": ": activate to sort column ascending",
  //         "sortDescending": ": activate to sort column descending"
  //       }
  //     } : {
  //       "emptyTable": "ليست هناك بيانات متاحة في الجدول",
  //       "loadingRecords": "جارٍ التحميل...",
  //       "lengthMenu": "أظهر _MENU_ مدخلات",
  //       "zeroRecords": "لم يعثر على أية سجلات",
  //       "info": "إظهار _START_ إلى _END_ من أصل _TOTAL_ مدخل",
  //       "infoEmpty": "يعرض 0 إلى 0 من أصل 0 سجل",
  //       "infoFiltered": "(منتقاة من مجموع _MAX_ مُدخل)",
  //       "search": "ابحث:",
  //       "paginate": {
  //         "first": "الأول",
  //         "previous": "السابق",
  //         "next": "التالي",
  //         "last": "الأخير"
  //       },
  //       "aria": {
  //         "sortAscending": ": تفعيل لترتيب العمود تصاعدياً",
  //         "sortDescending": ": تفعيل لترتيب العمود تنازلياً"
  //       }
  //     }
  // };


  constructor(private authenticationService: AuthenticationService, private classificationService: ClassifyService,
    private dialog: MatDialog, public dialogService: DialogService,
    private route: Router) { this.currentUser = this.authenticationService.currentUserValue; }


  ngOnInit(): void {
    this.page = {
      pagenumber: 1,
      pagesize: 10,
    }
    this.sortObj = {
      sortStatus: '', name: '', nameAr: '', code: '', id: 0
    }
    this.classificationService.GetclassifysWithPaging(this.page).subscribe(data => {
      this.ClassificationsList = data;
      this.loading = false;
    });
    this.classificationService.getCount().subscribe((data) => {
      this.count = data;
    });
  }
  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;

    this.classificationService.GetclassifysWithPaging(this.page).subscribe((items) => {
      this.ClassificationsList = items;
    });
  }
  deleteClass(id: number) {

    this.classificationService.GetClassificationById(id).subscribe((data) => {
      this.selectedObj = data;

      const classDialog = this.dialog
        .open(DeleteClassificationsConfirmationComponent, {
          width: '30%',
          autoFocus: true,
          data: {
            id: this.selectedObj.id,
            name: this.selectedObj.name,
            nameAr: this.selectedObj.nameAr
          },
        });
      classDialog.afterClosed().subscribe(result => {
        let currentUrl = this.route.url;
        this.route.routeReuseStrategy.shouldReuseRoute = () => false;
        this.route.onSameUrlNavigation = 'reload';
        this.route.navigate([currentUrl]);
      });
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

    if (field.currentTarget.id == "Name") {
      this.sortObj.name = field.currentTarget.id
    }
    else if (field.currentTarget.id == "الاسم") {
      this.sortObj.nameAr = field.currentTarget.id
    }
    if (field.currentTarget.id == "Code") {
      this.sortObj.code = field.currentTarget.id
    }
    else if (field.currentTarget.id == "الكود") {
      this.sortObj.code = field.currentTarget.id
    }


    this.classificationService.SortClassifications(this.page.pagenumber, this.page.pagesize, this.sortObj).subscribe(data => {
      this.ClassificationsList = data;
      this.loading = false;

      this.sortStatus = this.sortObj.sortStatus;
      this.sortObj = {
        sortStatus: '', name: '', nameAr: '', code: '', id: 0
      }
    });


  }
}
