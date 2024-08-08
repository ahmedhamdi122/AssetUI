import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Paging } from 'src/app/Shared/Models/paging';
import { EditSupplierExecludeAssetVM, ListSupplierExecludeAssetVM, SortAndFilterSupplierExecludeAssetVM } from 'src/app/Shared/Models/supplierExecludeAssetVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { SupplierExecludeAssetService } from 'src/app/Shared/Services/supplierexecludeasset.service';
import { ExecludedateComponent } from '../execludedate/execludedate.component';
import { DialogService } from 'primeng/dynamicdialog';
import { HospitalSuplierStatusService } from 'src/app/Shared/Services/hospitalsuplierstatus.service';
import { ListHospitalSuplierStatusVM } from 'src/app/Shared/Models/HospitalSuplierStatusVM';
import { ListApplicationTypeVM } from 'src/app/Shared/Models/applicationtype';
import { ApplicationTypeService } from 'src/app/Shared/Services/applicationtype.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteconfirmationComponent } from '../deleteconfirmation/deleteconfirmation.component';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { CityService } from 'src/app/Shared/Services/city.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { AssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { ListMasterAssetVM } from 'src/app/Shared/Models/masterAssetVM';
import { ListDepartmentVM } from 'src/app/Shared/Models/departmentVM';
import { DepartmentService } from 'src/app/Shared/Services/department.service';
import { environment } from 'src/environments/environment';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { DatePipe } from '@angular/common';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';
import { ListBrandVM } from 'src/app/Shared/Models/brandVM';
import { BrandService } from 'src/app/Shared/Services/brand.service';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  lang = localStorage.getItem("lang");
  lstRoleNames: string[] = [];
  isMember: boolean = false;
  isSupplierExeclude: boolean = false;
  textDir: string = 'ltr';
  currentUser: LoggedUser;
  selectedAppType: number = 1;
  selectedObj: EditSupplierExecludeAssetVM;
  lstTypes: ListApplicationTypeVM[] = [];
  lstSupplierExecludeAssets: ListSupplierExecludeAssetVM[] = [];
  page: Paging;
  supplierCount: number;
  lstRadioItems: string[];
  lstArabicRadioItems: string[];
  selectedItem: string;
  selectedArabicItem: string;
  diffMonths: any;
  isMoreThan3Months: boolean = false;
  sortStatus: string = "ascending";
  lstStatuses: ListHospitalSuplierStatusVM;
  isSupplier: boolean = false;
  isSupplierManager: boolean = false;
  hospitalId: number = 0;

  lstassetDetailBarcodes: AssetDetailVM[] = [];
  lstAssetSerailNumberObj: AssetDetailVM[] = [];
  assetSerailNumberObj: AssetDetailVM;

  lstHospitalAssets: ListMasterAssetVM[] = [];
  lstGovernorates: ListGovernorateVM[];
  lstCities: ListCityVM[];
  lstOrganizations: ListOrganizationVM[];
  lstSubOrganizations: ListSubOrganizationVM[];
  lstHospitals: ListHospitalVM[] = [];
  lstMasterAssets: ListMasterAssetVM[] = [];
  lstDepartments: ListDepartmentVM[] = [];
  openStatus: number;
  approveStatus: number;
  rejectStatus: number;
  systemRejectStatus: number;
  totalStatus: number;
  statusId: number = 0;
  errorDisplay: boolean = false;
  sortFilterObjects: SortAndFilterSupplierExecludeAssetVM;
  assetBarCodeObj: any;
  lstBrands: ListBrandVM[];
  constructor(private authenticationService: AuthenticationService, private hospitalSuplierStatusService: HospitalSuplierStatusService,
    private supplierExecludeAssetService: SupplierExecludeAssetService, private applicationTypeService: ApplicationTypeService,
    private governorateService: GovernorateService, private cityService: CityService, private assetDetailService: AssetDetailService,
    private hospitalService: HospitalService, private dialog: MatDialog, private route: Router, public dialogService: DialogService,
    private datePipe: DatePipe, private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute,
    private brandService: BrandService,
    private masterAssetService: MasterAssetService, private departmentService: DepartmentService, private uploadService: UploadFilesService) {

    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    this.sortFilterObjects = {
      searchObj: { appTypeId: 0, hospitalName: '', hospitalNameAr: '', printedBy: '', strEndDate: '', strStartDate: '', assetName: '', brandId: 0, originId: 0, serial: '', supplierId: 0, lang: '', masterAssetId: 0, modelNumber: '', serialNumber: '', code: '', periorityId: 0, statusId: 0, userId: '', cityId: 0, governorateId: 0, hospitalId: 0, barCode: '', subject: '', start: '', end: '', departmentId: 0 },
      sortObj: {
        sortBy: '', barCode: '', modelNumber: '', serialNumber: '', statusId: 0, appNumber: '', statusName: '', statusNameAr: '', assetNameAr: '', assetName: '', date: '', execludeDate: '', ReasonHoldTitles: '', ReasonHoldTitlesAr: '', sortStatus: '', reasonExTitles: '', reasonExTitlesAr: ''
      }
    }

    this.lstStatuses = { totalStatus: 0, approveStatus: 0, color: '', icon: '', id: 0, listStatus: [], name: '', nameAr: '', openStatus: 0, rejectStatus: 0, systemRejectStatus: 0 }
    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });
      this.isSupplier = (['Admin', 'Supplier', 'SupplierExcludeAsset'].some(r => this.lstRoleNames.includes(r)));
      this.isSupplierManager = (['SupplierManager'].some(r => this.lstRoleNames.includes(r)));
    }
    this.page = { pagenumber: 1, pagesize: 10 }

    this.applicationTypeService.GetApplicationTypes().subscribe(types => {
      this.lstTypes = types;
    });

    this.hospitalSuplierStatusService.GetAllStatus(this.selectedAppType, this.currentUser.hospitalId).subscribe(statuses => {
      this.lstStatuses = statuses;
      this.openStatus = statuses["openStatus"];
      this.approveStatus = statuses["approveStatus"];
      this.rejectStatus = statuses["rejectStatus"];
      this.systemRejectStatus = statuses["systemRejectStatus"];
      this.totalStatus = statuses["totalStatus"];
    });
    this.governorateService.GetGovernorates().subscribe(items => {
      this.lstGovernorates = items;
    });
    this.departmentService.GetDepartments().subscribe(items => {
      this.lstDepartments = items;
    });
    this.brandService.GetBrands().subscribe(items => {
      this.lstBrands = items;
    });
    const translationKeys = ['Asset.AssetTransfer', 'Asset.Execludes', 'Asset.SupplierExecludeReport'];
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);
  }
  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;

    this.sortFilterObjects.searchObj.appTypeId = this.selectedAppType;
    this.sortFilterObjects.searchObj.userId = this.currentUser.id;
    this.supplierExecludeAssetService.ListSupplierExcludeAssets(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe((data) => {
      this.supplierCount = data.count;
      this.lstSupplierExecludeAssets = data.results;
    });
  }
  onTypeChange($event) {
    this.selectedItem = $event.value;
    this.lstSupplierExecludeAssets = [];

    this.hospitalSuplierStatusService.GetAllStatus(this.selectedAppType, this.currentUser.hospitalId).subscribe(statuses => {
      this.lstStatuses = statuses;
      this.openStatus = statuses["openStatus"];
      this.approveStatus = statuses["approveStatus"];
      this.rejectStatus = statuses["rejectStatus"];
      this.systemRejectStatus = statuses["systemRejectStatus"];
      this.totalStatus = statuses["totalStatus"];
    });

    this.sortFilterObjects.searchObj.appTypeId = Number(this.selectedItem);
    this.supplierExecludeAssetService.ListSupplierExcludeAssets(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe((data) => {
      this.supplierCount = data.count;
      this.lstSupplierExecludeAssets = data.results;
    });
  }
  updateExecludeDate(id: number) {
    const ref = this.dialogService.open(ExecludedateComponent, {
      data: {
        id: id
      },
      width: '60%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });

    ref.onClose.subscribe(res => {
      this.reload();
    });
  }
  getAllByStatus(id: number) {
    this.statusId = id;
    this.sortFilterObjects.sortObj.statusId = id;
    this.sortFilterObjects.searchObj.statusId = id;
    this.supplierExecludeAssetService.ListSupplierExcludeAssets(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe((data) => {
      this.supplierCount = data.count;
      this.lstSupplierExecludeAssets = data.results;
    });
  }
  Delete(id: number) {
    this.supplierExecludeAssetService.GetSupplierExecludeAssetById(id).subscribe((data) => {
      this.selectedObj = data;
      const dialogRef2 = this.dialog.open(DeleteconfirmationComponent, {
        width: '30%',
        autoFocus: true,
        data: {
          id: this.selectedObj.id,
          exNumber: this.selectedObj.exNumber,
          date: this.selectedObj.date,
          assetId: this.selectedObj.assetId
        },
      });
      dialogRef2.afterClosed().subscribe(deleted => {
        this.reload();
        this.isSupplier = true;
      });
    });
  }
  reload() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }
  getCitiesByGovId(govId: number) {
    this.cityService.GetCitiesByGovernorateId(govId).subscribe(cities => {
      this.lstCities = cities;
    });
  }
  getHospitalsByCityId($event) {
    this.hospitalService.GetHospitalsByCityId($event.target.value).subscribe(hosts => {
      this.lstHospitals = hosts;

    });
  }
  sort(field) {
    if (this.sortStatus == "descending") {
      this.sortStatus = "ascending";
      this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    }
    else {
      this.sortStatus = "descending";
      this.sortFilterObjects.sortObj.sortStatus = this.sortStatus;
    }

    this.sortFilterObjects.searchObj.appTypeId = this.selectedAppType;
    this.sortFilterObjects.sortObj.sortBy = field.currentTarget.id;

    this.supplierExecludeAssetService.ListSupplierExcludeAssets(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe(data => {
      this.lstSupplierExecludeAssets = data.results;
      this.supplierCount = data.count;
    });
  }
  getBarCode(event) {
    this.sortFilterObjects.searchObj.barCode = event["barCode"];
  }
  onSelectionChanged(event) {
    if (this.currentUser.hospitalId != 0) {
      this.assetDetailService.AutoCompleteAssetBarCode(event.query, this.currentUser.hospitalId).subscribe(assets => {
        this.lstassetDetailBarcodes = assets;
        if (this.lang == "en") {
          this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
        }
        else {
          this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
        }
      });
    }
    else if (this.sortFilterObjects.searchObj.hospitalId > 0) {
      this.assetDetailService.AutoCompleteAssetBarCode(event.query, this.sortFilterObjects.searchObj.hospitalId).subscribe(assets => {
        this.lstassetDetailBarcodes = assets;
        if (this.lang == "en") {
          this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
        }
        else {
          this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
        }
      });
    }
    else {
      this.assetDetailService.AutoCompleteAssetBarCode(event.query, this.hospitalId).subscribe(assets => {
        this.lstassetDetailBarcodes = assets;
        if (this.lang == "en") {
          this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
        }
        else {
          this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
        }
      });
    }
  }
  getSerialNumber(event) {
    this.sortFilterObjects.searchObj.serialNumber = event["serialNumber"];
  }
  onSerialNumberSelectionChanged(event) {
    if (this.currentUser.hospitalId != 0) {
      this.assetDetailService.AutoCompleteAssetSerial(event.query, this.currentUser.hospitalId).subscribe(assets => {
        this.lstAssetSerailNumberObj = assets;
        if (this.lang == "en") {
          this.lstAssetSerailNumberObj.forEach(item => item.name = item.serialNumber);
        }
        else {
          this.lstAssetSerailNumberObj.forEach(item => item.name = item.serialNumber);
        }
      });
    }
    else {
      this.assetDetailService.AutoCompleteAssetSerial(event.query, this.hospitalId).subscribe(assets => {
        this.lstAssetSerailNumberObj = assets;
        if (this.lang == "en") {
          this.lstAssetSerailNumberObj.forEach(item => item.name = item.serialNumber);
        }
        else {
          this.lstAssetSerailNumberObj.forEach(item => item.name = item.serialNumber);
        }
      });
    }
  }
  onMasterSelectionChanged(event) {
    this.masterAssetService.AutoCompleteMasterAssetName2(event.query).subscribe(masters => {
      this.lstMasterAssets = masters;
      if (this.lang == "en") {

        this.lstMasterAssets.forEach(item => item.name = item.name + " - " + item.brandName + " - " + item.model);
      }
      else {
        this.lstMasterAssets.forEach(item => item.name = item.nameAr + " - " + item.brandNameAr + " - " + item.model);
      }
    });
  }
  getMasterObject(event) {
    this.sortFilterObjects.searchObj.masterAssetId = event["id"];

  }
  onSearch() {
    this.sortFilterObjects.searchObj.hospitalId = this.sortFilterObjects.searchObj.hospitalId;
    this.supplierExecludeAssetService.ListSupplierExcludeAssets(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe(excludes => {
      this.lstSupplierExecludeAssets = excludes.results;
      this.supplierCount = excludes.count;
    });
  }

  generatePDF() {
    if (this.sortFilterObjects.searchObj.start == "") {
      this.sortFilterObjects.searchObj.strStartDate = this.datePipe.transform(new Date("01/01/1900"), "MM-dd-yyyy");
    }
    else {
      this.sortFilterObjects.searchObj.strStartDate = this.sortFilterObjects.searchObj.start;
    }

    if (this.sortFilterObjects.searchObj.end == "") {
      this.sortFilterObjects.searchObj.strEndDate = this.datePipe.transform(new Date(), "MM-dd-yyyy");
    }
    else {
      this.sortFilterObjects.searchObj.strEndDate = this.sortFilterObjects.searchObj.end;
    }

    if (this.sortFilterObjects.searchObj.hospitalId != 0)
      this.sortFilterObjects.searchObj.hospitalId = this.sortFilterObjects.searchObj.hospitalId;
    else
      this.sortFilterObjects.searchObj.hospitalId = 0;

    this.sortFilterObjects.searchObj.statusId = this.statusId;
    this.sortFilterObjects.searchObj.lang = this.lang;
    this.sortFilterObjects.searchObj.printedBy = this.currentUser.userName;
    this.sortFilterObjects.searchObj.hospitalNameAr = this.currentUser.hospitalNameAr;
    this.sortFilterObjects.searchObj.hospitalName = this.currentUser.hospitalName;
    this.sortFilterObjects.searchObj.appTypeId = this.selectedAppType;


    this.supplierExecludeAssetService.PrintSearchSupplierAssetExecludes(this.sortFilterObjects).subscribe(lstExcludes => {
      this.lstSupplierExecludeAssets = lstExcludes;
      let fileName = "CreateSupplierExecludePDF.pdf";
      var filePath = `${environment.FilePath}UploadedAttachments/SupplierExecludePDF/`;
      this.uploadService.downloadCreateSupplierExecludePDF(fileName).subscribe(file => {
        var dwnldFile = filePath + fileName;
        if (fileName != "" || fileName != null)
          window.open(dwnldFile);
      });


      this.supplierExecludeAssetService.ListSupplierExcludeAssets(this.sortFilterObjects, this.page.pagenumber, this.page.pagesize).subscribe((data) => {
        this.supplierCount = data.count;
        this.lstSupplierExecludeAssets = data.results;
      });
    });
  }


}
