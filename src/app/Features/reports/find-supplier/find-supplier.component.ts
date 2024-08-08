import { Component, OnInit } from '@angular/core';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { Paging } from 'src/app/Shared/Models/paging';
import { ListSupplierVM, SortSupplierVM, ViewSupplierVM } from 'src/app/Shared/Models/supplierVM';
import { SupplierService } from '../../../Shared/Services/supplierService.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';
@Component({
  selector: 'app-find-supplier',
  templateUrl: './find-supplier.component.html',
  styleUrls: ['./find-supplier.component.css']
})

export class FindSupplierComponent implements OnInit {


  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  currentUser: LoggedUser;
  public show: boolean = false;
  loading: boolean = false;
  displaySupplierObj: boolean = false;
  page: Paging;
  count: number;
  lstSuppliers: ListSupplierVM[] = [];
  supplierObj: ViewSupplierVM;
  sortStatus: string = "descending";
  sortObj: SortSupplierVM;
  constructor(private authenticationService: AuthenticationService, private supplierService: SupplierService, private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute, private route: Router) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.page = { pagenumber: 1, pagesize: 10 }
    this.supplierObj = {
      id: 0, code: '', name: '', nameAr: '', address: '', addressAr: '', mobile: '', website: '', contactPerson: '', notes: '', fax: '', email: '', eMail: ''
    }
    this.sortObj = {
      sortStatus: '', name: '', nameAr: '', code: '', id: 0, address: '', addressAr: '', contactPerson: '', email: '', mobile: ''
    }



    const translationKeys = ['Asset.Reports', 'Asset.Assets', 'Asset.SupplierCompany'];
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);
  }

  clicktbl(event) {

    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;

    this.supplierService.findSupplier("", this.page.pagenumber, this.page.pagesize).subscribe(suppliers => {
      this.lstSuppliers = suppliers.results;
      this.count = suppliers.count;
      this.loading = false;
    });

  }

  onSupplierChanged(event) {
    this.supplierService.findSupplier(event.query, this.page.pagenumber, this.page.pagesize).subscribe(suppliers => {
      this.lstSuppliers = suppliers.results;
      this.count = suppliers.count;
      if (this.lang == "en") {
        this.lstSuppliers.forEach(item => item.name = item.name + " - " + item.mobile + " - " + item.address);
      }
      else {
        this.lstSuppliers.forEach(item => item.name = item.nameAr + " - " + item.mobile + " - " + item.addressAr);
      }
    });
  }
  getSupplierObject(event) {

    this.lstSuppliers = [];
    this.supplierService.SearchGetSupplierById(event["id"]).subscribe(supplierObj => {
      this.lstSuppliers.push(supplierObj);
      this.count = this.lstSuppliers.length;
      this.loading = false;
    });
  }
  viewSupplier(id: number) {
    this.displaySupplierObj = true;
    this.supplierService.GetSupplierById(id).subscribe(itemObj => {
      this.supplierObj = itemObj;
    });
  }
  close() {
    this.displaySupplierObj = false;
    this.reload();
  }

  reload() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }


  sort(field) {
    console.log("this.sortObj.",this.sortObj);

    if (this.sortStatus === "descending") {
      this.sortStatus = "ascending";
      this.sortObj.sortStatus = this.sortStatus;
    }
    else {
      this.sortStatus = "descending"
      this.sortObj.sortStatus = this.sortStatus;
    }

    if (field.currentTarget.id == "Name") {
      this.sortObj.name = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "الاسم") {
      this.sortObj.nameAr = field.currentTarget.id;
    }
    if (field.currentTarget.id == "Code" || field.currentTarget.id == "الكود") {
      this.sortObj.code = field.currentTarget.id;
    }


    if (field.currentTarget.id == "Mobile" || field.currentTarget.id == "المحمول") {
      this.sortObj.mobile = field.currentTarget.id;
    }


    if (field.currentTarget.id == "Address") {
      this.sortObj.address = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "العنوان") {
      this.sortObj.addressAr = field.currentTarget.id;
    }

    if (field.currentTarget.id == "EMail") {
      this.sortObj.email = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "البريد الإلكتروني") {
      this.sortObj.email = field.currentTarget.id
    }
    if (field.currentTarget.id == "Contact Person") {
      this.sortObj.contactPerson = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "التواصل") {
      this.sortObj.contactPerson = field.currentTarget.id;
    }
    this.supplierService.sortSuppliers(this.page.pagenumber, this.page.pagesize, this.sortObj).subscribe(data => {
      this.lstSuppliers = data;
      this.sortStatus = this.sortObj.sortStatus;
      this.sortObj = {
        sortStatus: '', name: '', nameAr: '', code: '', id: 0, address: '', addressAr: '', contactPerson: '', email: '', mobile: ''
      }
    })
  }
}
