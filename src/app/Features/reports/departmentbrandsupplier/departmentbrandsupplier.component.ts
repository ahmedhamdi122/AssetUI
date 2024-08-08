import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { FilterAssetDetail, ListAssetDetailVM, SortAssetDetailsVM, ViewAssetForReportVM } from 'src/app/Shared/Models/assetDetailVM';
import { BrandGroupVM, ListBrandVM } from 'src/app/Shared/Models/brandVM';
import { GroupcityVM, ListCityVM } from 'src/app/Shared/Models/cityVM';
import { GovernorateVM, GroupGovernorateVM, ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { BrandService } from 'src/app/Shared/Services/brand.service';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HospitalGroupVM, ListHospitalVM } from 'src/app/Shared/Models/hospitalVM'
import { SupplierService } from 'src/app/Shared/Services/supplierService.service';
import { GroupSupplierVM, ListSupplierVM } from 'src/app/Shared/Models/supplierVM';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { ListMasterAssetVM } from 'src/app/Shared/Models/masterAssetVM';
import { GroupOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { Location } from '@angular/common'
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import 'jspdf-autotable';
import { DepartmentService } from 'src/app/Shared/Services/department.service';
import { DepartmentGroupVM, DepartmentVM } from 'src/app/Shared/Models/departmentVM';
import { ListAssetStatusVM } from 'src/app/Shared/Models/assetStatusVM';
import { AssetStatusService } from 'src/app/Shared/Services/assetStatus.service';
import { environment } from 'src/environments/environment';
import { Paging } from 'src/app/Shared/Models/paging';
import { NgxUiLoaderService } from "ngx-ui-loader";
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { CityService } from 'src/app/Shared/Services/city.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';


@Component({
  selector: 'app-departmentbrandsupplier',
  templateUrl: './departmentbrandsupplier.component.html',
  styleUrls: ['./departmentbrandsupplier.component.css']
})
export class DepartmentbrandsupplierComponent implements OnInit {

  @ViewChild('departmentId', { static: false }) departmentIdInformation: ElementRef;
  @ViewChild('brandId', { static: false }) brandIdInformation: ElementRef;
  @ViewChild('supplierId', { static: false }) supplierIdInformation: ElementRef;
  @ViewChild('statusId', { static: false }) statusIdInformation: ElementRef;
  @ViewChild('assetElement') groupByCriteria: ElementRef;
  selectedItem: any;

  showDetails: boolean;
  myEvent: any;
  sortField: string;
  sortDirection: string;
  lang = localStorage.getItem("lang");
  textDir: string = '';
  currentUser: LoggedUser;
  lstAssets: ViewAssetForReportVM[] = [];

  lstAssets2: ListAssetDetailVM[] = [];
  lstAssets3: ListAssetDetailVM[] = [];
  lstAssets4: ViewAssetForReportVM[] = [];
  listAssetsGroupByBrand: ListAssetDetailVM[] = [];
  listAssetsGroupByDepartment: ListAssetDetailVM[] = [];
  listAssetsGroupBySupplier: ListAssetDetailVM[] = [];
  listAssetsGroupByGovernorate: ListAssetDetailVM[] = [];
  listAssetsGroupByCity: ListAssetDetailVM[] = [];
  listAssetsGroupByHospital: ListAssetDetailVM[] = [];
  supplierId: number = 0;
  showSearch: boolean = false;
  sortStatus: string = "ascending";
  sortObject: SortAssetDetailsVM;

  lstMasterAssets: ListMasterAssetVM[] = [];
  newLstAssets: ViewAssetForReportVM[] = [];
  filteredObj: FilterAssetDetail;
  brndList: ListBrandVM[] = [];
  brandList: ListBrandVM[] = [];
  govList: ListGovernorateVM[];
  cityList: ListCityVM[];
  hosList: ListHospitalVM[];
  newRows: string[];
  temp: string[];
  href: any;
  AssetElements: any[];
  AssetElementsAr: any;
  supList: ListSupplierVM[];
  statusList: ListAssetStatusVM[] = [];
  selectedElement: string;
  lstBrandAsset: BrandGroupVM[];
  lstDepartments: DepartmentVM[] = [];
  //  lstGovernorates: GovernorateVM[] = [];
  lstHospitalAsset: HospitalGroupVM[];
  lstGovernorateAsset: GroupGovernorateVM[];
  lstCityAsset: GroupcityVM[];
  lstHospitalAssets: HospitalGroupVM[];

  lstDetails: ListAssetDetailVM[] = [];
  lstSupplierAsset: GroupSupplierVM[];
  lstDepartmentAsset: DepartmentGroupVM[] = [];
  lstGovernorateAssets: GroupGovernorateVM[] = [];
  lstOrganizationAsset: GroupOrganizationVM[];
  direction: string = 'ltr';
  selectedLang: string;
  selectedAsset: number;
  userName = "";
  assetName: string = "";
  isDisplayed: boolean = false;
  uploadService: any;

  errorMessage: string = "";
  dateError: boolean = false;

  page: Paging;
  count: number = 0;
  loading: boolean = false;
  /*-------------- */
  departmentNameAtDialog: string = '';
  departmentNameAtDialogAr: string = '';
  departmentCountAtDialog: number = 0;
  departmentExpanded: boolean = true;
  departmentVisible: boolean = false;
  /*-------------- */
  brandVisible: boolean = false;
  brandExpanded: boolean = true;
  brandNameAtDialog: string = '';
  brandNameAtDialogAr: string = '';
  brandCountAtDialog: number = 0;
  /*-------------- */
  supplierVisible: boolean = false;
  supplierExpanded: boolean = true;
  supplierNameAtDialog: string = '';
  supplierNameAtDialogAr: string = '';
  supplierCountAtDialog: number = 0;



  /*-------------- */
  governorateVisible: boolean = false;
  governorateExpanded: boolean = true;
  governorateNameAtDialog: string = '';
  governorateNameAtDialogAr: string = '';
  governorateCountAtDialog: number = 0;
  governorateId: number = 0;

  /*-------------- */
  cityVisible: boolean = false;
  cityExpanded: boolean = true;
  cityNameAtDialog: string = '';
  cityNameAtDialogAr: string = '';
  cityCountAtDialog: number = 0;
  cityId: number = 0;



  /*-------------- */
  hospitalVisible: boolean = false;
  hospitalExpanded: boolean = true;
  hospitalNameAtDialog: string = '';
  hospitalNameAtDialogAr: string = '';
  hospitalCountAtDialog: number = 0;
  hospitalId: number = 0;


  lstGovernorates: ListGovernorateVM[] = [];
  lstCities: ListCityVM[] = [];
  lstHospitals: ListHospitalVM[] = [];

  selectedOptions: any[] = [];

  constructor(private assetDetailService: AssetDetailService, private authenticationService: AuthenticationService, private brandService: BrandService,
    private departmentService: DepartmentService, private assetStatusService: AssetStatusService, private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute,
    private datePipe: DatePipe, private supplierService: SupplierService, private masterService: MasterAssetService,
    private masterAssetService: MasterAssetService, private governorateService: GovernorateService,
    private cityService: CityService, private hospitalService: HospitalService,
    private location: Location, private route: Router, private ngxService: NgxUiLoaderService) {


    this.currentUser = this.authenticationService.currentUserValue;
    if (this.currentUser == null || this.currentUser == undefined) {
      this.lang = "en";
      this.route.navigate(['/']);
    }
    else {
      this.userName = this.currentUser["userName"];
    }
  }
  ngOnInit(): void {

    this.ngxService.start("startPage");
    this.filteredObj = { governorateId: 0, cityId: 0, hospitalId: 0, hospitalIds: [], categoryId: 0, periorityId: 0, selectedElement: '', hospitalName: '', hospitalNameAr: '', lang: '', printedBy: '', userId: '', statusId: 0, id: 0, name: '', brandId: 0, supplierId: 0, masterAssetId: 0, departmentId: 0, purchaseDateFrom: null, purchaseDateTo: null, start: '', end: '', assetName: '', assetNameAr: '' }

    this.AssetElements = ["Brand", "Supplier", "Department", "Governorate", "City", "Hospital"];
    this.AssetElementsAr = ["الصانع", "المورد", "القسم", "المحافظة", "المدينة", "المستشفى"];

    this.page = { pagenumber: 1, pagesize: 10 };

    this.masterService.GetMasterAssets().subscribe(items => {
      this.lstMasterAssets = items;
    });


    this.assetDetailService.GetAssetsyUserId(this.currentUser.id).subscribe(items => {
      this.lstAssets3 = items;
    });


    this.brandService.GetBrands().subscribe(brands => {
      this.brndList = brands

    });

    this.departmentService.GetDepartments().subscribe(departs => {
      this.lstDepartments = departs
    });

    this.governorateService.GetGovernorates().subscribe(govs => {
      this.lstGovernorates = govs;
    });
    this.cityService.GetCities().subscribe(cities => {
      this.lstCities = cities;
    });

    this.hospitalService.GetHospitals().subscribe(hosts => {
      this.lstHospitals = hosts;
    });


    this.supplierService.GetSuppliers().subscribe(sup => {
      this.supList = sup;
    });

    this.assetStatusService.GetAssetStatus().subscribe(statuses => {
      this.statusList = statuses;
    });
    this.sortObject = { assetName: '', assetNameAr: '', sortStatus: '', sortBy: '' }
    this.ngxService.stop("startPage");



    const translationKeys = ['Asset.Reports', 'Asset.Assets', 'Asset.Generic'];
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);
  }

  getCitiesByGovId($event) {
    this.selectedOptions = [];
    this.cityService.GetCitiesByGovernorateId($event.target.value).subscribe(cities => {
      this.lstCities = cities;
    });
    this.filteredObj.hospitalIds = this.selectedOptions;

    this.assetDetailService.FilterDataByDepartmentBrandSupplierIdAndPaging(this.filteredObj, this.currentUser.id, this.page.pagenumber, this.page.pagesize).subscribe(assets => {
      this.lstAssets2 = assets.results;
      this.count = assets.count;
      this.loading = false;
      if (this.selectedElement != null) {
        this.selectElement(this.selectedElement);
      }
      this.newLstAssets = this.lstAssets2;
    });
    this.showSearch = true;
  }
  getHospitalsByCityId($event) {
    this.lstHospitals = [];
    this.hospitalService.getHosByCityId($event.target.value).subscribe(hospitals => {
      this.lstHospitals = hospitals;

      if (this.lang == "en") {
        this.lstHospitals.forEach(item => item.name = item.name);
      }
      else {
        this.lstHospitals.forEach(item => item.name = item.nameAr);
      }
    });
    this.filteredObj.hospitalIds = this.selectedOptions;
    this.assetDetailService.FilterDataByDepartmentBrandSupplierIdAndPaging(this.filteredObj, this.currentUser.id, this.page.pagenumber, this.page.pagesize).subscribe(assets => {
      this.lstAssets2 = assets.results;
      this.count = assets.count;
      this.loading = false;
      if (this.selectedElement != null) {
        this.selectElement(this.selectedElement);
      }
      this.newLstAssets = this.lstAssets2;
    });
    this.showSearch = true;
  }
  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;

    if (this.sortObject.sortBy != "") {

      this.assetDetailService.SortAssetDetail(this.sortObject, this.page.pagenumber, this.page.pagesize).subscribe
        (data => {
          this.lstAssets = data.results;
          this.count = data.count;
          this.sortStatus = this.sortObject.sortStatus
        })

    }

    else {
      this.page.pagenumber = (event.first + 10) / 10;
      this.page.pagesize = event.rows;

      this.lstAssets = [];
      this.assetDetailService.GenericReportGetAssetsByUserIdAndPaging(this.currentUser.id, this.page.pagenumber, this.page.pagesize).subscribe(assets => {
        this.lstAssets = assets.results;
        this.count = assets.count;
        this.loading = false;
      });
    }
  }
  search() {
    this.clicktbl2(this.myEvent);
  }
  clicktbl2(event) {
    this.myEvent = event

    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;

    this.lstAssets2 = [];
    this.assetDetailService.FilterDataByDepartmentBrandSupplierIdAndPaging(this.filteredObj, this.currentUser.id, this.page.pagenumber, this.page.pagesize).subscribe(assets => {
      this.lstAssets2 = assets.results;
      this.count = assets.count;
      this.loading = false;
    });
  }
  exportPdf() {
    this.filteredObj.userId = this.currentUser.id;
    if (this.filteredObj.end == "") {
      this.filteredObj.end = this.datePipe.transform(new Date(), "MM-dd-yyyy");
    }
    this.filteredObj.lang = this.lang;
    this.filteredObj.printedBy = this.currentUser.userName;
    this.filteredObj.hospitalNameAr = this.currentUser.hospitalNameAr;
    this.filteredObj.hospitalName = this.currentUser.hospitalName;
    this.filteredObj.selectedElement = this.selectedElement;

    this.assetDetailService.CreateAssetDepartmentBrandSupplierPDF(this.filteredObj).subscribe(list => {
      let fileName = "FilterAssetDetails.pdf";
      var filePath = `${environment.Domain}UploadedAttachments/`;
      this.uploadService.DownloadAssetDepartmentBrandSupplierPDF(fileName).subscribe(file => {
        var dwnldFile = filePath + 'AssetDetails/FilterAssetDetails/' + fileName;
        if (fileName != "" || fileName != null)
          window.open(dwnldFile);
      });
    });
  }
  filterByStatus($event) {

    this.page.pagenumber = 1;
    this.page.pagesize = 10;
    this.lstAssets2 = [];
    this.filteredObj.statusId = $event.target.value;
    this.assetDetailService.FilterDataByDepartmentBrandSupplierIdAndPaging(this.filteredObj, this.currentUser.id, this.page.pagenumber, this.page.pagesize).subscribe(data => {
      this.lstAssets2 = data.results;
      this.count = data.count;
      this.loading = false;
      if (this.selectedElement != null) {
        this.selectElement(this.selectedElement);
      }
      this.newLstAssets = this.lstAssets2;
    });
    this.showSearch = true;
  }
  filterByDepartment($event) {
    this.page.pagenumber = 1;
    this.page.pagesize = 10;
    this.lstAssets2 = [];

    this.filteredObj.departmentId = $event.target.value;

    this.assetDetailService.FilterDataByDepartmentBrandSupplierIdAndPaging(this.filteredObj, this.currentUser.id, this.page.pagenumber, this.page.pagesize).subscribe(assets => {
      // this.lstAssets2 = assets.results;
      this.lstAssets2 = assets.results;
      this.count = assets.count;
      this.loading = false;
      if (this.selectedElement != null) {
        this.selectElement(this.selectedElement);
      }
      this.newLstAssets = this.lstAssets2;

    });


    this.showSearch = true;
  }
  filterByBrand($event) {
    this.page.pagenumber = 1;
    this.page.pagesize = 10;
    this.lstAssets2 = [];

    this.filteredObj.brandId = $event.target.value;
    this.assetDetailService.FilterDataByDepartmentBrandSupplierIdAndPaging(this.filteredObj, this.currentUser.id, this.page.pagenumber, this.page.pagesize).subscribe(assets => {
      this.lstAssets2 = assets.results;
      this.count = assets.count;
      this.loading = false;
      if (this.selectedElement != null) {
        this.selectElement(this.selectedElement);
      }
      this.newLstAssets = this.lstAssets2;
    });
    this.showSearch = true;
  }
  filterBySupplier($event) {

    this.page.pagenumber = 1;
    this.page.pagesize = 10;
    this.lstAssets2 = [];
    this.filteredObj.supplierId = $event.target.value;
    this.assetDetailService.FilterDataByDepartmentBrandSupplierIdAndPaging(this.filteredObj, this.currentUser.id, this.page.pagenumber, this.page.pagesize).subscribe(assets => {
      this.lstAssets2 = assets.results;
      this.count = assets.count;
      this.loading = false;
      if (this.selectedElement != null) {
        this.selectElement(this.selectedElement);
      }
      this.newLstAssets = this.lstAssets2;
    });
    this.showSearch = true;
  }
  filterByPurchaseDateFrom(elem) {
    this.page.pagenumber = 1;
    this.page.pagesize = 10;
    this.lstAssets2 = [];
    this.filteredObj.start = elem;
    this.assetDetailService.FilterDataByDepartmentBrandSupplierIdAndPaging(this.filteredObj, this.currentUser.id, this.page.pagenumber, this.page.pagesize).subscribe(assets => {
      this.lstAssets2 = assets.results;
      this.count = assets.count;
      this.loading = false;
      if (this.selectedElement != null) {
        this.selectElement(this.selectedElement);
      }
      this.newLstAssets = this.lstAssets2;
    });
    this.showSearch = true;
  }
  filterByPurchaseDateTo(elem) {
    this.page.pagenumber = 1;
    this.page.pagesize = 10;
    this.lstAssets2 = [];
    this.filteredObj.purchaseDateTo = elem;
    this.filteredObj.end = elem;
    this.assetDetailService.FilterDataByDepartmentBrandSupplierIdAndPaging(this.filteredObj, this.currentUser.id, this.page.pagenumber, this.page.pagesize).subscribe(assets => {
      this.lstAssets2 = assets.results;
      this.count = assets.count;
      this.loading = false;
      if (this.selectedElement != null) {
        this.selectElement(this.selectedElement);
      }
      this.newLstAssets = this.lstAssets2;
    });
    this.showSearch = true;
  }

  selectElement(elem) {

    this.isDisplayed = true;
    this.selectedElement = elem;
    if (elem != "") {
      this.isDisplayed = true;
    }
    else {
      this.isDisplayed = false;
      document.getElementById('clcgroupingbtn').style.display = "none";
    }

    if (elem === "Brand" || elem === "الصانع") {
      if (this.showSearch == false) {
      }
      else {
        this.assetDetailService.GroupAssetDetailsByBrand(this.filteredObj).subscribe
          (result => { this.lstBrandAsset = result })
      }
    }
    else if (elem === "Supplier" || elem === "المورد") {
      if (this.showSearch == false) {
        this.assetDetailService.getAssetBySupplier(this.lstAssets3).subscribe(data => {
          this.lstSupplierAsset = data;
        })
      }
      else {
        this.assetDetailService.GroupAssetDetailsBySuppliers(this.filteredObj).subscribe
          (result => { this.lstSupplierAsset = result })
      }
    }
    else if (elem === "Department" || elem === "القسم") {
      if (this.showSearch == false) {
        this.assetDetailService.getAssetByDepartment(this.lstAssets3).subscribe(data => {
          this.lstDepartmentAsset = data;
        })
      }
      else {
        this.assetDetailService.GroupAssetDetailsByDepartment(this.filteredObj).subscribe
          (result => this.lstDepartmentAsset = result)
      }
    }


    else if (elem === "Governorate" || elem === "المحافظة") {
      if (this.showSearch == false) {
        this.assetDetailService.getAssetByGovernorate(this.lstAssets3).subscribe(data => {
          this.lstGovernorateAssets = data;
        })
      }
      else {
        this.assetDetailService.GroupAssetDetailsByGovernorate(this.filteredObj).subscribe
          (result => this.lstGovernorateAssets = result)
      }
    }

    else if (elem === "City" || elem === "المدينة") {
      if (this.showSearch == false) {
        this.assetDetailService.getAssetByCity(this.lstAssets3).subscribe(data => {
          this.lstCityAsset = data;
        })
      }
      else {
        this.assetDetailService.GroupAssetDetailsByCity(this.filteredObj).subscribe
          (result => this.lstCityAsset = result)
      }
    }


    else if (elem === "Hospital" || elem === "المستشفى") {
      if (this.showSearch == false) {
        this.assetDetailService.getAssetByHospital(this.lstAssets3).subscribe(data => {
          this.lstHospitalAssets = data;
        })
      }
      else {
        this.assetDetailService.GroupAssetDetailsByHospital(this.filteredObj).subscribe
          (result => this.lstHospitalAssets = result)
      }
    }

    else {
      this.assetDetailService.GetAssetsyUserId(this.currentUser.id).subscribe(items => {
        this.lstAssets = items;
      });
    }


  }

  checkValue() {
    this.page.pagenumber = 1;
    this.page.pagesize = 10;
    $('#purchaseDateFrom').val("");
    this.filteredObj.purchaseDateFrom = null;
    this.assetDetailService.FilterDataByDepartmentBrandSupplierIdAndPaging(this.filteredObj, this.currentUser.id, this.page.pagenumber, this.page.pagesize).subscribe(assets => {
      this.lstAssets2 = assets.results;
      this.count = assets.count;
      this.loading = false;
      if (this.selectedElement != null) {
        this.selectElement(this.selectedElement);
      }
      this.newLstAssets = this.lstAssets;
    });

  }
  checkGroupingValue() {

    this.page.pagenumber = 1;
    this.page.pagesize = 10;
    this.lstAssets = [];
    this.ngxService.start();
    this.groupByCriteria.nativeElement.value = null;
    this.selectedElement = null;
    this.isDisplayed = false;
    this.assetDetailService.GenericReportGetAssetsByUserIdAndPaging(this.currentUser.id, this.page.pagenumber, this.page.pagesize).subscribe(assets => {
      this.lstAssets = assets.results;
      this.count = assets.count;
      this.loading = false;
    });

    this.ngxService.stop();
  }
  Back(): void {
    this.location.back();
  }
  onSelectionChanged(event) {
    this.masterAssetService.DistinctAutoCompleteMasterAssetName(event.query).subscribe(masters => {
      this.lstMasterAssets = masters;
      if (this.lang == "en") {
        this.lstMasterAssets.forEach(item => item.name = item.name);
      }
      else {
        this.lstMasterAssets.forEach(item => item.name = item.nameAr);
      }
    });
  }
  getObject(event) {
    this.page.pagenumber = 1;
    this.page.pagesize = 10;
    this.lstAssets2 = [];

    if (this.lang == 'en')
      this.filteredObj.assetName = event.name;
    else
      this.filteredObj.assetNameAr = event.name;

    this.assetDetailService.FilterDataByDepartmentBrandSupplierIdAndPaging(this.filteredObj, this.currentUser.id, this.page.pagenumber, this.page.pagesize).subscribe(data => {
      this.lstAssets2 = data.results;
      this.count = data.count;
      this.loading = false;

      if (this.selectedElement != null) {
        this.selectElement(this.selectedElement);
      }
      this.newLstAssets = this.lstAssets2;
    });


    this.showSearch = true;
  }
  onFilter() {

    this.page.pagenumber = 1;
    this.page.pagesize = 10;
    this.assetDetailService.FilterDataByDepartmentBrandSupplierIdAndPaging(this.filteredObj, this.currentUser.id, this.page.pagenumber, this.page.pagesize).subscribe(data => {
      // this.lstAssets = data;
      this.lstAssets2 = data.results;
      this.count = data.count;
      this.loading = false;
      if (this.selectedElement != null) {
        this.selectElement(this.selectedElement);
      }
      this.newLstAssets = this.lstAssets2;
    });


  }
  getAssetsByBrandId(brandObject: ListBrandVM) {
    this.brandNameAtDialog = brandObject.name;
    this.brandNameAtDialogAr = brandObject.nameAr;
    this.assetDetailService.GetAssetsByBrandId(brandObject.id).subscribe(items => {
      this.listAssetsGroupByBrand = items.results;
      this.brandCountAtDialog = items.count;

    });
    this.brandVisible = true;
  }
  getAssetsByDepartmentId(departmentObject: DepartmentVM) {
    //listAssetsGroupByDepartment
    this.departmentNameAtDialog = departmentObject.name;
    this.departmentNameAtDialogAr = departmentObject.nameAr;
    var departmentId: number = 0;
    departmentId = departmentObject.id;
    this.assetDetailService.GetAssetsByDepartmentId(departmentId).subscribe(item => {
      this.listAssetsGroupByDepartment = item.results;
      this.departmentCountAtDialog = item.count;

    });

    this.departmentVisible = true;
  }
  getAssetsBySupplierId(supplierObject: ListSupplierVM, pgaeNumber: number, pageSize: number) {
    this.supplierVisible = true;
    this.supplierNameAtDialog = supplierObject.name;
    this.supplierNameAtDialogAr = supplierObject.nameAr;

    this.supplierId = supplierObject.id;
    this.assetDetailService.GetAssetsBySupplierIdWithPaging(supplierObject.id, pgaeNumber, pageSize)
      .subscribe(res => {
        this.listAssetsGroupBySupplier = res.results
        this.count = res.count;
        this.supplierCountAtDialog = res.count;
      }
      )
  }
  getAssetsByGovernorateId(govObj: ListGovernorateVM, pgaeNumber: number, pageSize: number) {

    this.governorateVisible = true;
    this.governorateNameAtDialog = govObj.name;
    this.governorateNameAtDialogAr = govObj.nameAr;

    this.governorateId = govObj.id;
    this.assetDetailService.GetAssetsByGovernorateId(govObj.id)
      .subscribe(res => {
        this.listAssetsGroupByGovernorate = res.results
        this.count = res.count;
        this.governorateCountAtDialog = res.count;
      });
  }
  getAssetsByCityId(cityObj: ListCityVM, pgaeNumber: number, pageSize: number) {

    this.cityVisible = true;
    this.cityNameAtDialog = cityObj.name;
    this.cityNameAtDialogAr = cityObj.nameAr;

    this.cityId = cityObj.id;
    this.assetDetailService.GetAssetsByCityId(cityObj.id)
      .subscribe(res => {
        this.listAssetsGroupByCity = res.results
        this.count = res.count;
        this.cityCountAtDialog = res.count;
      });
  }

  getAssetsByHospitalId(hospitalObj: ListHospitalVM, pgaeNumber: number, pageSize: number) {

    this.hospitalVisible = true;
    this.hospitalNameAtDialog = hospitalObj.name;
    this.hospitalNameAtDialogAr = hospitalObj.nameAr;

    this.hospitalId = hospitalObj.id;
    this.assetDetailService.GetAssetsByHospitalId(hospitalObj.id)
      .subscribe(res => {
        this.listAssetsGroupByHospital = res.results;
        this.count = res.count;
        this.hospitalCountAtDialog = res.count;
      });
  }
  clickSupplierTable(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;
    if (this.supplierId > 0) {
      this.assetDetailService.GetAssetsBySupplierIdWithPaging(this.supplierId, this.page.pagenumber, this.page.pagesize).subscribe(assets => {
        this.listAssetsGroupBySupplier = assets.results;
        this.count = assets.count;
        this.loading = false;
      });
    }
  }

  clickGovernorateTable(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;
    if (this.governorateId > 0) {
      this.assetDetailService.GetAssetsByGovernorateIdWithPaging(this.governorateId, this.page.pagenumber, this.page.pagesize).subscribe(assets => {
        this.listAssetsGroupByGovernorate = assets.results;
        this.count = assets.count;
        this.loading = false;
      });
    }
  }
  sort(event) {
    if (this.sortStatus == "descending") {
      this.sortStatus = "ascending";
      this.sortObject.sortStatus = this.sortStatus;
    }
    else {
      this.sortStatus = "descending";

      this.sortObject.sortStatus = this.sortStatus;
    }

    switch (event.currentTarget.id) {

      case 'الاسم':
        this.sortObject.assetNameAr = event.currentTarget.id;
        this.sortObject.sortBy = event.currentTarget.id;
        break;
      case 'الباركود':
        this.sortObject.sortBy = event.currentTarget.id;
        break;
      case 'السيريال':
        this.sortObject.sortBy = event.currentTarget.id;
        break;
      case 'رقم الموديل':
        this.sortObject.sortBy = event.currentTarget.id;
        break;
      case 'القسم':
        this.sortObject.sortBy = event.currentTarget.id;
        break;
      case 'الماركة':
        this.sortObject.sortBy = event.currentTarget.id;
        break;
      case 'المورد':
        this.sortObject.sortBy = event.currentTarget.id;
        break;
      case 'تاريخ الشراء':
        this.sortObject.sortBy = event.currentTarget.id;
        break;
      case 'Name':
        this.sortObject.assetName = event.currentTarget.id;
        this.sortObject.sortBy = event.currentTarget.id;
        break;
      case 'Barcode':
        this.sortObject.sortBy = event.currentTarget.id;
        break;
      case 'Serial':
        this.sortObject.sortBy = event.currentTarget.id;
        break;
      case 'Model Number':
        this.sortObject.sortBy = event.currentTarget.id;
        break;
      case 'Department':
        this.sortObject.sortBy = event.currentTarget.id;
        break;
      case 'Manufacture':
        this.sortObject.sortBy = event.currentTarget.id;
        break;
      case 'Supplier':
        this.sortObject.sortBy = event.currentTarget.id;
        break;
      case 'Purchased Date':
        this.sortObject.sortBy = event.currentTarget.id;
        break;



    }

    this.assetDetailService.SortAssetDetail(this.sortObject, this.page.pagenumber, this.page.pagesize).subscribe
      (data => {
        this.lstAssets = data.results;
        this.count = data.count;
        this.sortStatus = this.sortObject.sortStatus
      })
  }
  addHospitals($event) {
    this.page.pagenumber = 1;
    this.page.pagesize = 10;
    this.lstAssets2 = [];
    this.filteredObj.hospitalIds = this.selectedOptions;

    this.assetDetailService.FilterDataByDepartmentBrandSupplierIdAndPaging(this.filteredObj, this.currentUser.id, this.page.pagenumber, this.page.pagesize).subscribe(assets => {
      this.lstAssets2 = assets.results;
      this.count = assets.count;
      this.loading = false;
    });
  }
  sortAfterSearch(event) {
    if (this.sortStatus == "descending") {
      this.sortStatus = "ascending";
      this.sortObject.sortStatus = this.sortStatus;
    }
    else {
      this.sortStatus = "descending";

      this.sortObject.sortStatus = this.sortStatus;
    }

    switch (event.currentTarget.id) {

      case 'الاسم':
        this.sortObject.assetNameAr = event.currentTarget.id;
        this.sortObject.sortBy = event.currentTarget.id;
        break;
      case 'الباركود':
        this.sortObject.sortBy = event.currentTarget.id;
        break;
      case 'السيريال':
        this.sortObject.sortBy = event.currentTarget.id;
        break;
      case 'رقم الموديل':
        this.sortObject.sortBy = event.currentTarget.id;
        break;
      case 'القسم':
        this.sortObject.sortBy = event.currentTarget.id;
        break;
      case 'الماركة':
        this.sortObject.sortBy = event.currentTarget.id;
        break;
      case 'المورد':
        this.sortObject.sortBy = event.currentTarget.id;
        break;
      case 'تاريخ الشراء':
        this.sortObject.sortBy = event.currentTarget.id;
        break;
      case 'Name':
        this.sortObject.assetName = event.currentTarget.id;
        this.sortObject.sortBy = event.currentTarget.id;
        break;
      case 'Barcode':
        this.sortObject.sortBy = event.currentTarget.id;
        break;
      case 'Serial':
        this.sortObject.sortBy = event.currentTarget.id;
        break;
      case 'Model Number':
        this.sortObject.sortBy = event.currentTarget.id;
        break;
      case 'Department':
        this.sortObject.sortBy = event.currentTarget.id;
        break;
      case 'Manufacture':
        this.sortObject.sortBy = event.currentTarget.id;
        break;
      case 'Supplier':
        this.sortObject.sortBy = event.currentTarget.id;
        break;
      case 'Purchased Date':
        this.sortObject.sortBy = event.currentTarget.id;
        break;

    }
    this.sortObject.sortBy = event.currentTarget.id;


    this.assetDetailService.SortAssetDetailAfterSearch(this.sortObject, this.filteredObj, this.page.pagenumber, this.page.pagesize)
      .subscribe(data => {
        this.lstAssets2 = data.results;
        this.count = data.count;
      });
  }
  trackByDepartmentId(index: number, department: DepartmentVM): number {
    return department.id;
  }
  afterCloseDepartmentDialog() {
    this.departmentExpanded = true;
    this.departmentVisible = false;
  }

  afterCloseGovernorateDialog() {
    this.governorateExpanded = true;
    this.governorateExpanded = false;
  }
  afterCloseCityDialog() {
    this.cityExpanded = true;
    this.cityExpanded = false;
  }

  afterCloseHospitalDialog() {
    this.hospitalExpanded = true;
    this.hospitalExpanded = false;
  }
  afterCloseBrandtDialog() {
    this.brandExpanded = true;
    this.brandVisible = false;
  }
  afterCloseSuppliertDialog() {
    this.supplierExpanded = true; // to remain the expansion panel open even after click on it and hide the toggle panel
    this.departmentVisible = false; // to show or hide the dialog
  }
  clearAutoCompelete(event) {
    this.filteredObj.assetName = "";
    this.filteredObj.assetNameAr = "";
  }
  reset() {
    this.ngxService.start("rest");
    this.selectedItem = '';
    this.lstMasterAssets = null;
    //#region   set properties of filteredObject which used to search at API To Default Value
    this.filteredObj.brandId = 0;
    this.filteredObj.departmentId = 0;
    this.filteredObj.supplierId = 0;
    this.filteredObj.statusId = 0;
    this.filteredObj.governorateId = 0;
    this.filteredObj.cityId = 0;
    this.filteredObj.hospitalId = 0;
    this.filteredObj.hospitalIds = [];
    this.filteredObj.assetName = '';
    this.filteredObj.assetNameAr = '';
    //#endregion

    //#region  
    this.departmentIdInformation.nativeElement.value = 0;
    this.brandIdInformation.nativeElement.value = 0;
    this.supplierIdInformation.nativeElement.value = 0;
    this.statusIdInformation.nativeElement.value = 0;

    //#endregion

    this.showSearch = false;
    this.page.pagenumber = 1;
    this.page.pagesize = 10;
    this.lstAssets = [];
    this.assetDetailService.GenericReportGetAssetsByUserIdAndPaging(this.currentUser.id, this.page.pagenumber, this.page.pagesize).subscribe(assets => {
      this.lstAssets = assets.results;
      this.count = assets.count;
      this.loading = false;

    });

    this.ngxService.stop("rest");
  }

}
