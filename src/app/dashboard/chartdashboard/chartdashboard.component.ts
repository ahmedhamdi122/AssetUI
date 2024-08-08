import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
// import { ListComponent } from 'src/app/Features/hospitals/list/list.component';
import { CountAssetVM, ListAssetDetailVM, SortAndFilterVM } from 'src/app/Shared/Models/assetDetailVM';
import { ListBrandVM } from 'src/app/Shared/Models/brandVM';
import { CountHospitalVM, ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { CountMasterAssetByBrandVM, CountMasterAssetBySupplierVM, ListMasterAssetVM } from 'src/app/Shared/Models/masterAssetVM';
import { ListSupplierVM } from 'src/app/Shared/Models/supplierVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { BrandService } from 'src/app/Shared/Services/brand.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { SupplierService } from 'src/app/Shared/Services/supplierService.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { RequestService } from 'src/app/Shared/Services/request.service';
import { WorkOrderService } from 'src/app/Shared/Services/work-order.service';
import { CookieService } from 'ngx-cookie-service';
import { ListRequestVM } from 'src/app/Shared/Models/requestModeVM';
import { ListWorkOrderVM } from 'src/app/Shared/Models/WorkOrderVM';
import { DepartmentService } from 'src/app/Shared/Services/department.service';
import { ListDepartmentVM } from 'src/app/Shared/Models/departmentVM';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { AssetPeriorityService } from 'src/app/Shared/Services/assetperiority.service';
import { ListAssetPeriorityVM } from 'src/app/Shared/Models/assetPeriorityVM';
import { MasterContractService } from 'src/app/Shared/Services/masterContract.service';
import { ListMasterContractVM } from 'src/app/Shared/Models/masterContractVM';
import { ViewComponent } from 'src/app/Features/requests/view/view.component';
import { Paging } from 'src/app/Shared/Models/paging';
import { ExternalFixService } from 'src/app/Shared/Services/external-fix.service';
import { ListExternalFixVM } from 'src/app/Shared/Models/ExternalFixVM';
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';
import { DetailsComponent } from 'src/app/Features/hospital-assets/details/details.component';
import { ContractDetailsComponent } from 'src/app/Features/contracts/details/contract-details.component';
import { ListComponent } from 'src/app/Features/hospital-assets/list/list.component';
import { ListHospitalComponent } from 'src/app/Features/hospitals/list/list-hospitals.component';


@Component({
  selector: 'app-chartdashboard',
  templateUrl: './chartdashboard.component.html',
  styleUrls: ['./chartdashboard.component.css']
})
export class ChartdashboardComponent implements OnInit {
  lang = localStorage.getItem('lang');
  currentUser: LoggedUser;
  textDir: string = 'rtl';
  page: Paging;
  warrantyPage: Paging;
  periorityPage: Paging;
  fixPage: Paging;
  periorityCount: number = 0;
  contractCount: number = 0;
  data: any;
  assetByHospitals: any;
  assetsInHospitals: any;
  assetsByBrands: any;
  assetsBySuppliers: any;
  assetsByGovernorate: any;
  assetsByCity: any;
  lstHosts: any;
  options: any;
  assetOptions: any;
  assetOptions2: any;
  assetBrandOptions: any;
  assetSupplierOptions: any;
  assetGovernorateOptions: any;
  assetCityOptions: any;
  lstHospitals: CountHospitalVM[] = [];
  lstAssetsByHospitals: CountAssetVM[] = [];
  lstAssetsByHospitals2: CountAssetVM[] = [];
  lstAssetsByGovernorate: CountAssetVM[] = [];

  lstAssetsByCity: CountAssetVM[] = [];

  lstAssetPerioritiesWithCount: ListAssetPeriorityVM[] = [];

  lstMasterAssetsByBrand: CountMasterAssetByBrandVM[] = [];
  lstMasterAssetsBySupplier: CountMasterAssetBySupplierVM[] = [];
  lstHighPeriorityRequest: ListRequestVM[] = [];
  lstMasterContracts: ListMasterContractVM[] = [];
  listHospitals: ListHospitalVM[] = [];
  displayHospitals: boolean = false;
  listSuppliers: ListSupplierVM[] = [];
  displaySuppliers: boolean = false;
  displayDepartments: boolean = false;
  listBrands: ListBrandVM[] = [];
  displayBrands: boolean = false;
  displayTicket: boolean = false;
  displayWO: boolean = false;

  lstAssetPeriorities: ListAssetPeriorityVM[] = [];
  listMasterAssets: ListMasterAssetVM[] = [];
  listHospitalAssets: ListAssetDetailVM[] = [];


  listDelayHospitalAssetFixes: ListExternalFixVM[] = [];
  allRequests: ListRequestVM[] = [];
  listWO: ListWorkOrderVM[] = [];
  listDepartments: ListDepartmentVM[] = [];
  displayAssets: boolean = false;
  countexternalfix: number = 0;
  totalHospitals: number = 0;
  totalMasterAssets: number = 0;
  totalBrands: number = 0;
  totalSuppliers: number = 0;
  totalRequests: number = 0;
  totalWorkOrders: number = 0;
  totalDepartments: number = 0;
  totalHospitalAssets: number = 0;

  direction: string = "";
  lstRoleNames: string[] = [];

  isAdmin: boolean = false;
  isAssetOwner: boolean = false;
  isEngManager: boolean = false;
  isHospitalManager: boolean = false;

  user: LoggedUser;

  errorMessage: string;
  errorDisplay: boolean = false;

  lstAssetsWarrantyEndBefore3Monthes: ListAssetDetailVM[] = [];
  lstDuration: DurationList[];
  lstContractDuration: DurationList[];
  selectedItem: any;
  selectedPeriorityItem: any;
  selectedContractItem: any;

  hospitalId: number;

  warrantyCount: number;

  sortFilterObjects: SortAndFilterVM;

  highCount: number;
  mediumCount: number;
  normalCount: number;
  medicalCount: number;
  productionCount: number;
  totalCount: number = 0;
  displayAssetPeriorities: boolean = false;
  displayExternalFixDelay: boolean = false;
  displayMasterContract: boolean = false;
  displayAssetsBefore3Monthes: boolean = false;

  brandName: string = "";

  constructor(
    public dialogService: DialogService, private datePipe: DatePipe, private cookieService: CookieService, private hospitalService: HospitalService, private assetDetailService: AssetDetailService,
    private authenticationService: AuthenticationService, private masterAssetService: MasterAssetService, private brandService: BrandService, private supplierService: SupplierService,
    private requestService: RequestService, private workOrderService: WorkOrderService, private governorateService: GovernorateService, private assetPeriorityService: AssetPeriorityService,
    private masterContractService: MasterContractService, private departmentService: DepartmentService, private externalFixService: ExternalFixService, private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.lang == 'ar'
    this.direction = 'rtl';

  }

  ngOnInit(): void {
    if (localStorage.getItem("lang") == null) {
      this.lang == 'ar'
      this.direction = 'rtl';
    }

    const translationKeys = ['Asset.DashBoard']; // Array of translation keys
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);

    this.page = {
      pagenumber: 1,
      pagesize: 10,
    }


    this.fixPage = {
      pagenumber: 1,
      pagesize: 10,
    }


    this.warrantyPage = {
      pagenumber: 1,
      pagesize: 10,
    }
    this.periorityPage = {
      pagenumber: 1,
      pagesize: 10,
    }
    const cookieExists: boolean = this.cookieService.check('usercookie');
    if (cookieExists) {
      this.lang == 'ar'
      this.direction = 'rtl';
    }
    if (!cookieExists) {
      this.lang == 'ar'
      this.direction = 'rtl';
    }



    else if (this.lang == 'en') {
      this.direction = 'ltr';
    } else if (this.lang == 'ar') {
      this.direction = 'rtl';
    }

    this.currentUser["roleNames"].forEach(element => {
      this.lstRoleNames.push(element["name"]);
    });


    this.isAdmin = (['Admin'].some(r => this.lstRoleNames.includes(r)));
    this.isAssetOwner = (['AssetOwner'].some(r => this.lstRoleNames.includes(r)));
    this.isEngManager = (['EngDepManager'].some(r => this.lstRoleNames.includes(r)));
    this.isHospitalManager = (['TLHospitalManager', 'EngDepManager'].some(r => this.lstRoleNames.includes(r)));




    this.lstContractDuration = [
      { id: 1, name: 'Through 70 days', nameAr: 'خلال 70 يوم' },
      { id: 2, name: 'Through 80 days', nameAr: 'خلال 80 يوم' },
      { id: 3, name: 'Through 90 days', nameAr: 'خلال 90 يوم' }
    ];
    this.lstDuration = [
      { id: 1, name: 'Through 30 days', nameAr: 'خلال 30 يوم' },
      { id: 2, name: 'Through 60 days', nameAr: 'خلال 60 يوم' },
      { id: 3, name: 'Through 90 days', nameAr: 'خلال 90 يوم' }
    ];

    if (this.selectedItem == undefined) {
      this.selectedItem = 1;
    }


    if (this.selectedPeriorityItem == undefined) {
      this.selectedPeriorityItem = 0;
    }
    if (this.selectedContractItem == undefined) {
      this.selectedContractItem = 1;
    }


    if (this.currentUser.hospitalId != 0) {
      this.hospitalId = this.currentUser.hospitalId;
    }
    else
      this.hospitalId = 0;



    this.sortFilterObjects = {
      searchObj: { assetName: '', assetId: 0, barCode: '', brandId: 0, cityId: 0, code: '', contractDate: '', contractEnd: '', contractStart: '', contractTypeId: 0, departmentId: 0, end: '', governorateId: 0, hospitalId: 0, masterAssetId: 0, masterAssetName: '', masterAssetNameAr: '', model: '', organizationId: 0, originId: 0, serial: '', start: '', statusId: 0, subOrganizationId: 0, supplierId: 0, userId: '', warrantyTypeId: 0 },
      sortObj: { sortBy: '', assetName: '', assetNameAr: '', barCode: '', barCodeValue: '', brand: '', brandId: 0, brandName: '', brandNameAr: '', cityId: 0, cityName: '', cityNameAr: '', Code: '', departmentId: 0, governorateId: 0, governorateName: '', governorateNameAr: '', hospitalId: 0, hospitalName: '', hospitalNameAr: '', Id: 0, masterAssetId: 0, model: '', organizationId: 0, orgName: '', orgNameAr: '', originId: 0, serial: '', serialValue: '', sortStatus: '', statusId: 0, subOrganizationId: 0, subOrgName: '', subOrgNameAr: '', supplier: '', supplierId: 0, supplierName: '', supplierNameAr: '', userId: '' },
      isSearchAndSort: false
    };










    this.assetPeriorityService.ListAssetPerioritiesByHospitalId(this.hospitalId).subscribe(perioties => {
      this.lstAssetPerioritiesWithCount = perioties;
      this.highCount = perioties[0].highCount;
      this.mediumCount = perioties[0].medicalCount;
      this.normalCount = perioties[0].normalCount;
      this.medicalCount = perioties[0].medicalCount;
      this.productionCount = perioties[0].productionCount;
      this.totalCount = perioties[0].totalCount;
    });


    this.assetPeriorityService.GetAssetPeriorities().subscribe(perioties => {
      this.lstAssetPeriorities = perioties;
    });






    this.listTopAssetsByHospitalId(this.hospitalId);
    this.countAssetsInHospitalByHospitalId(this.hospitalId);
    this.getMasterAssetsByBrand();
    this.countHospitalsByCities();
    this.loadTotalCounts();
  }

  displayAssetPeriorityDialogue() {
    this.displayAssetPeriorities = true;
  }
  displayExternalFixDelayDialogue() {
    this.displayExternalFixDelay = true;
  }
  displayMasterContractDialogue() {
    this.displayMasterContract = true;
  }
  displayAssetsBefore3MonthesDialogue() {
    this.displayAssetsBefore3Monthes = true;
  }

  loadTotalCounts() {

    this.hospitalService.GetTop10Hospitals(this.currentUser.hospitalId).subscribe(listHosts => {
      this.listHospitals = listHosts.results;
      this.totalHospitals = listHosts.count;
    });

    this.brandService.GetTop10Brands(this.currentUser.hospitalId).subscribe(brands => {
      this.listBrands = brands.results;
      this.totalBrands = brands.count;
    });


    this.supplierService.GetTop10SuppliersCount(this.currentUser.hospitalId).subscribe(count => {
      this.totalSuppliers = count;
    })


    this.requestService.CountRequestsByHospitalId(this.currentUser.hospitalId, this.currentUser.id).subscribe(count => {
      this.totalRequests = count;
    });

    this.workOrderService.CountWorkOrdersByHospitalId(this.currentUser.hospitalId, this.currentUser.id).subscribe(count => {
      this.totalWorkOrders = count;
    });

    this.hospitalService.CountDepartmentsByHospitalId(this.currentUser.hospitalId).subscribe(count => {
      this.totalDepartments = count;
    });

    this.assetDetailService.CountAssetsByHospitalId(this.currentUser.hospitalId).subscribe(count => {
      this.totalHospitalAssets = count;
    });
  }
  listTopAssetsByHospitalId(hospitalId: number) {

    var assets = [];
    this.assetDetailService.ListTopAssetsByHospitalId(hospitalId).subscribe(items => {
      this.lstAssetsByHospitals = items;
      this.lstAssetsByHospitals.forEach(element => {
        assets.push({ "assetName": element["assetName"], "assetNameAr": element["assetNameAr"], "countAssetsByHospital": element["countAssetsByHospital"], "assetPrice": element["assetPrice"], });
      });

      this.assetByHospitals = {
        labels: this.lang == "en" ? assets.map(a => a.assetName + " Count: (" + a.countAssetsByHospital + ") total price: ( " + a.assetPrice + " )") : assets.map(a => a.assetNameAr + " العدد : (" + a.countAssetsByHospital + ")  إجمالي السعر : ( " + a.assetPrice + " )"),
        datasets: [
          {
            label: 'Assets in Hospitals',
            backgroundColor: DEFAULT_COLORS,
            borderColor: DEFAULT_COLORS,
            data: assets.map(a => a.countAssetsByHospital)
          }
        ]
      }
      this.assetOptions = {
        title: {
          display: true,
          text: 'Assets In Hospitals',
          fontSize: 20,
        },
        legend: {
          position: 'bottom'
        },
        labels: {
          render: 'label'
        },
      };
    });
  }
  getMasterAssetsByBrand() {
    const masterAssets = [];
    this.masterAssetService.CountMasterAssetsByBrand(this.currentUser.hospitalId).subscribe(items => {
      this.lstMasterAssetsByBrand = items;

      this.lstMasterAssetsByBrand.forEach(element => {
        masterAssets.push({ "brandName": element["brandName"], "brandNameAr": element["brandNameAr"], "countOfMasterAssets": element["countOfMasterAssets"] });
      });
      this.assetsByBrands = {
        labels: this.lang == "en" ? masterAssets.map(a => a.brandName + " Count: (" + a.countOfMasterAssets + ") ") : masterAssets.map(a => a.brandNameAr + " العدد :(" + a.countOfMasterAssets + ")"),
        datasets: [
          {
            label: this.lang == "en" ? 'Assets By Brand' : 'الأصول حسب الماركة',
            backgroundColor: PolarArea_COLORS,
            borderColor: PolarArea_COLORS,
            data: masterAssets.map(a => a.countOfMasterAssets)
          }
        ]
      }
      this.assetBrandOptions = {
        title: {
          display: true,
          text: this.lang == "en" ? 'Assets By Brand' : 'الأصول حسب الماركة',
          fontSize: 16,
        },
        legend: {
          position: 'right'
        },
        plugins: {
          legend: {
            labels: {
              color: '#495057'
            }
          }
        },
        scales: {
        }
      };
    });
  }
  countAssetsInHospitalByHospitalId(hospitalId: number) {
    var hospitalAssets = [];
    this.assetDetailService.CountAssetsInHospitalByHospitalId(hospitalId).subscribe(items => {
      this.lstAssetsByHospitals2 = items;
      this.lstAssetsByHospitals2.forEach(element => {
        hospitalAssets.push({ "assetName": element["assetName"], "assetNameAr": element["assetNameAr"], "countAssetsByHospital": element["countAssetsByHospital"], "assetPrice": element["assetPrice"], });
      });
      this.assetsInHospitals = {
        labels: this.lang == "en" ? hospitalAssets.map(a => a.assetName + " Count: (" + a.countAssetsByHospital + ") total price: ( " + a.assetPrice + " )") : hospitalAssets.map(a => a.assetNameAr + " العدد : (" + a.countAssetsByHospital + ")  إجمالي السعر : ( " + a.assetPrice + " )"),
        datasets: [
          {
            label: 'Assets in Hospitals',
            backgroundColor: DEFAULT_COLORS,
            borderColor: DEFAULT_COLORS,
            data: hospitalAssets.map(a => a.countAssetsByHospital)
          }
        ]
      }
      this.assetOptions2 = {
        title: {
          display: true,
          text: 'Assets In Hospitals',
          fontSize: 20,
        },
        legend: {
          position: 'bottom'
        },
        labels: {
          render: 'label'
        },
      };
    });

  }

  alertContractsEndBefore3Months($event) {

    this.page.pagenumber = ($event.first + 10) / 10;
    this.page.pagesize = $event.rows;
    this.lstMasterContracts = [];
    if (this.currentUser.hospitalId != 0)
      this.hospitalId = this.currentUser.hospitalId;
    else
      this.hospitalId = 0;

    this.masterContractService.AlertContractsEndBefore3Months(this.currentUser.hospitalId, this.selectedContractItem, this.page.pagenumber, this.page.pagesize).subscribe(lst => {
      this.lstMasterContracts = lst.results;
      this.contractCount = lst.count;
    });
  }
  onContractItemChange($event) {
    this.selectedContractItem = $event.value;
    this.lstMasterContracts = [];
    this.page.pagenumber = 1;
    this.page.pagesize = 10;
    if (this.currentUser.hospitalId != 0)
      this.hospitalId = this.currentUser.hospitalId;
    else
      this.hospitalId = 0;

    this.masterContractService.AlertContractsEndBefore3Months(this.hospitalId, this.selectedContractItem, this.page.pagenumber, this.page.pagesize).subscribe(lst => {
      this.lstMasterContracts = lst.results;
      this.contractCount = lst.count;
    });
  }

  pageWarranty(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;
    this.lstAssetsWarrantyEndBefore3Monthes = [];


    if (this.currentUser.hospitalId != 0)
      this.hospitalId = this.currentUser.hospitalId;
    else
      this.hospitalId = 0;

    this.assetDetailService.AlertAssetsWarrantyEndBefore3Monthes(this.hospitalId, this.selectedItem, this.warrantyPage.pagenumber, this.warrantyPage.pagesize).subscribe(lstAssets => {
      this.lstAssetsWarrantyEndBefore3Monthes = lstAssets.results;
      this.warrantyCount = lstAssets.count;
    });
  }
  onWarrantyItemChange($event) {
    this.lstAssetsWarrantyEndBefore3Monthes = [];
    this.selectedItem = $event.value;

    if (this.currentUser.hospitalId != 0)
      this.hospitalId = this.currentUser.hospitalId;
    else
      this.hospitalId = 0;

    this.assetDetailService.AlertAssetsWarrantyEndBefore3Monthes(this.hospitalId, this.selectedItem, this.warrantyPage.pagenumber, this.warrantyPage.pagesize).subscribe(lstAssets => {
      this.lstAssetsWarrantyEndBefore3Monthes = lstAssets.results;
      this.warrantyCount = lstAssets.count;
    });
  }

  loadPeriorityRequest(event) {
    this.periorityPage.pagenumber = (event.first + 10) / 10;
    this.periorityPage.pagesize = event.rows;
    this.lstHighPeriorityRequest = [];

    this.requestService.AlertOpenedRequestAssetsAndHighPeriority(this.selectedPeriorityItem, this.hospitalId, this.periorityPage.pagenumber, this.periorityPage.pagesize).subscribe(lst => {
      this.lstHighPeriorityRequest = lst.results;
      this.periorityCount = lst.count;
      this.highCount = lst.highCount;
      this.mediumCount = lst.medicalCount;
      this.normalCount = lst.normalCount;
      this.medicalCount = lst.medicalCount;
      this.productionCount = lst.productionCount;
      this.totalCount = lst.totalCount;
    });
  }
  onPeriorityChange($event) {
    this.selectedPeriorityItem = $event.value;
    this.requestService.AlertOpenedRequestAssetsAndHighPeriority(this.selectedPeriorityItem, this.currentUser.hospitalId, this.periorityPage.pagenumber, this.periorityPage.pagesize).subscribe(lst => {
      this.lstHighPeriorityRequest = lst.results;
      this.periorityCount = lst.count;
      this.highCount = lst.highCount;
      this.mediumCount = lst.medicalCount;
      this.normalCount = lst.normalCount;
      this.medicalCount = lst.medicalCount;
      this.productionCount = lst.productionCount;
    });
  }

  loadExternalFix($event) {
    this.fixPage.pagenumber = ($event.first + 10) / 10;
    this.fixPage.pagesize = $event.rows;
    this.listDelayHospitalAssetFixes = [];
    this.externalFixService.GetAssetsExceed72HoursInExternalFix(this.currentUser.hospitalId, this.fixPage.pagenumber, this.fixPage.pagesize).subscribe(data => {
      this.listDelayHospitalAssetFixes = data.results;
      this.countexternalfix = data.count;
    });
  }


  countHospitalsByCities() {

    var Axis = [];
    this.hospitalService.CountHospitalsByCities().subscribe(cities => {
      this.lstHospitals = cities;
      this.lstHospitals.forEach(element => {
        Axis.push({ "cityName": element["cityName"], "cityNameAr": element["cityNameAr"], "countOfHospitals": element["countOfHospitals"] });
      });

      this.data = {
        labels: this.lang == "en" ? Axis.map(a => a.cityName) : Axis.map(a => a.cityNameAr),
        datasets: [
          {
            label: 'Hospitals By Cities',
            backgroundColor: DEFAULT_COLORS,
            borderColor: DEFAULT_COLORS,
            data: Axis.map(a => a.countOfHospitals)
          }
        ]
      }
      this.lstHosts = {
        labels: this.lang == "en" ? Axis.map(a => a.cityName) : Axis.map(a => a.cityNameAr),
        datasets: [
          {
            label: 'Hospitals By Cities',
            backgroundColor: DEFAULT_COLORS,
            borderColor: DEFAULT_COLORS,
            data: Axis.map(a => a.countOfHospitals),
            responsive: false,
            maintainAspectRatio: false
          }
        ]
      }
      this.options = {
        title: {
          display: true,
          text: 'Hospitals By Cities',
          fontSize: 16,

        },
        legend: {
          position: 'bottom'
        }
      };
    });

  }
  displayHospitalAssetsInDialog() {
    this.displayAssets = true;
    this.sortFilterObjects.searchObj.userId = this.currentUser.id;
    this.assetDetailService.ListHospitalAssets(this.sortFilterObjects, 1, 10).subscribe(assets => {
      this.listHospitalAssets = assets.results;
    });
  }
  showHospitals() {
    const ref = this.dialogService.open(ListHospitalComponent, {
      width: '70%'
    });
  }
  displayHospitalsInDialog() {
    this.displayHospitals = true;
    this.hospitalService.GetTop10Hospitals(this.currentUser.hospitalId).subscribe(listHosts => {
      this.listHospitals = listHosts.results;
      this.totalHospitals = listHosts.count;
    });
  }
  displaySuppliersInDialog() {
    this.displaySuppliers = true;
    this.supplierService.GetTop10Suppliers(this.currentUser.hospitalId).subscribe(listSuppliers => {
      this.listSuppliers = listSuppliers;
    })
  }
  displayBrandsInDialog() {
    this.displayBrands = true;
    this.brandService.GetTop10Brands(this.currentUser.hospitalId).subscribe(brands => {
      this.listBrands = brands.results;
      this.totalBrands = brands.count;
    });
  }
  displayTicketInDialog() {
    this.displayTicket = true;
    this.requestService.GetAllRequests().subscribe(tickets => {
      tickets.forEach(element => {
        if (element.closedDate == "") {
          element.closedDate = "";
        }
        else if (element.closedDate != "") {
          element.closedDate = this.datePipe.transform(element.closedDate, "dd/MM/yyyy")
        }
        this.allRequests.push(element);
      });
    });

  }
  displayWOInDialog() {

    this.displayWO = true;
    this.workOrderService.GetAllWorkOrdersByHospitalId(this.currentUser.hospitalId).subscribe(wo => {
      this.listWO = wo;
    });

  }
  displayDepartmentsInDialog() {

    this.displayDepartments = true;
    this.departmentService.DepartmentsByHospitalId(this.currentUser.hospitalId).subscribe(departs => {
      this.listDepartments = departs
    });

  }
  viewRequest(id: number) {
    const ref = this.dialogService.open(ViewComponent, {
      header: this.lang == 'en' ? 'View Ticket' : "بيانات بلاغ العطل  ",
      data: {
        id: id
      },
      width: '70%',
      rtl: this.lang == 'en' ? false : true,
      style: {
        "text-align": this.lang == "en" ? 'left' : 'right',
        "direction": this.lang == "en" ? 'ltr' : "rtl",
        "font-family": "sans-serif"
      }
    });

    ref.onClose.subscribe(() => {
      this.requestService.AlertOpenedRequestAssetsAndHighPeriority(this.selectedPeriorityItem, this.currentUser.hospitalId, this.periorityPage.pagenumber, this.periorityPage.pagesize).subscribe(lst => {
        this.lstHighPeriorityRequest = lst.results;
        this.periorityCount = lst.count;
      });
    });
  }
  viewDetail(id: number) {
    const dialogRef2 = this.dialogService.open(DetailsComponent, {
      header: this.lang == "en" ? "Asset Details" : "بيانات الأصل",
      data: {
        id: id
      },
      width: '75%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl",
        "font-family": "sans-serif"
      }
    });
    dialogRef2.onClose.subscribe((res) => {
    });
  }


  viewContract(id: number) {
    const ref = this.dialogService.open(ContractDetailsComponent, {
      header: this.lang == "en" ? 'Contract' : "العقد",
      closable: true,
      width: '70%',
      data: {
        masterId: id
      },
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });
    ref.onClose.subscribe((page) => {
    });
  }

  // viewAssets(brandId: number) {
  //   const ref = this.dialogService.open(ListComponent, {
  //     header: this.lang == "en" ? 'List Assets' : "بيانات الأصول",
  //     closable: true,
  //     width: '70%',
  //     data: {
  //       brandId: brandId
  //     },
  //     style: {
  //       'dir': this.lang == "en" ? 'ltr' : "rtl",
  //       "text-align": this.lang == "en" ? 'left' : "right",
  //       "direction": this.lang == "en" ? 'ltr' : "rtl"
  //     }
  //   });
  //   ref.onClose.subscribe((page) => {
  //   });
  // }
}





const DEFAULT_COLORS = ['#495057', '#EC407A', '#26a69a', '#AB47BC', '#42A5F5', '#7E57C2', '#66BB6A', '#FFCA28', '#26A69A', '#3366CC', '#DC3912', '#FF9900', '#109618', '#990099', '#3B3EAC', '#0099C6', '#DD4477', '#66AA00', '#B82E2E',
  '#316395', '#994499', '#22AA99', '#AAAA11', '#6633CC', '#E67300', '#8B0707', '#329262', '#5574A6', '#3B3EAC', '#495057', '#EC407A', '#26a69a', '#AB47BC', '#42A5F5', '#7E57C2', '#66BB6A', '#FFCA28', '#26A69A', '#3366CC', '#DC3912', '#FF9900', '#109618', '#990099', '#3B3EAC', '#0099C6', '#DD4477', '#66AA00', '#B82E2E',
  '#316395', '#994499', '#22AA99', '#AAAA11', '#6633CC', '#E67300', '#8B0707', '#329262', '#5574A6', '#3B3EAC']


const PolarArea_COLORS = ["#42A5F5", '#ffa726', '#26a69a', "#66BB6A", '#42a5f5', "#FFA726", "#26C6DA", "#7E57C2"]

export class DurationList {
  id: number;
  name: string;
  nameAr: string;
}