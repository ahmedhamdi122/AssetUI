import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AssetDetailVM, SearchHospitalAssetVM, ViewAssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { ListMasterAssetVM } from 'src/app/Shared/Models/masterAssetVM';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { Paging } from 'src/app/Shared/Models/paging';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { CityService } from 'src/app/Shared/Services/city.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';
import { ListDepartmentVM } from 'src/app/Shared/Models/departmentVM';
import { DepartmentService } from 'src/app/Shared/Services/department.service';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
@Component({
  selector: 'app-assethistory',
  templateUrl: './assethistory.component.html',
  styleUrls: ['./assethistory.component.css']
})
export class AssethistoryComponent implements OnInit {

  lang = localStorage.getItem("lang");
  numberLang: string = "";
  textDir: string = 'ltr';
  currentUser: LoggedUser;
  errorMessage: string;
  errorDisplay: boolean = false;
  isAssetOwner: boolean = false;
  isEng: boolean = false;
  isEngManager: boolean = false;
  isAdmin: boolean = false;

  public show: boolean = false;
  public buttonName: any = 'Show';
  elementType = "img";


  height: number = 0;
  width: number = 0;
  assetDetailId: number;
  showAdd: boolean = false;
  isEdit: boolean = false;
  isDelete: boolean = false;
  isView: boolean = false;
  display: boolean = false;
  displayRequestObj: boolean = false;

  page: Paging;
  count: number;
  lstRoleNames: string[] = [];

  assetDetailObj: ViewAssetDetailVM;
  lstassetDetails: AssetDetailVM[] = [];
  lstDepartments: ListDepartmentVM[] = [];
  lstGovernorates: ListGovernorateVM[] = [];
  lstCities: ListCityVM[] = [];
  lstOrganizations: ListOrganizationVM[] = [];
  lstSubOrganizations: ListSubOrganizationVM[] = [];
  lstHospitals: ListHospitalVM[] = [];
  lstMasterAssets: ListMasterAssetVM[] = [];
  lstassetDetailBarcodes: AssetDetailVM[] = [];
  lstAssetSerailNumberObj: AssetDetailVM[] = [];
  assetSerailNumberObj: AssetDetailVM;
  assetBarCodeObj: AssetDetailVM;


  sortStatus: string = "descending";
  isGov: boolean = false;
  isCity: boolean = false;
  isOrg: boolean = false;
  isSubOrg: boolean = false;
  isHospital: boolean = false;
  loading: boolean = true;
  statusId: number = 0;
  hospitalId: number = 0;

  cols: any[];
  _selectedColumns: any[];
  columnsSelected: string = "";
  frozenCols: any[];

  searchObj: SearchHospitalAssetVM;
  isValidDate: boolean = false;
  error: any = { isError: false, errorMessage: '' };

  imgURL: string = "";

  constructor(
    private departmentService: DepartmentService, private authenticationService: AuthenticationService, private assetDetailService: AssetDetailService, private governorateService: GovernorateService,
    private cityService: CityService, private organizationService: OrganizationService, private subOrganizationService: SubOrganizationService,
    private hospitalService: HospitalService, private route: Router, private masterAssetService: MasterAssetService, private datePipe: DatePipe,
    private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute,private uploadService:UploadFilesService) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    this.height = 35;
    this.width = 5;
    this.onLoad();
    this.onLoadByLogIn();

    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });
      this.isAssetOwner = (['AssetOwner'].some(r => this.lstRoleNames.includes(r)));
      this.isEng = (['Eng'].some(r => this.lstRoleNames.includes(r)));
      this.isEngManager = (['EngDepManager'].some(r => this.lstRoleNames.includes(r)));
      this.isAdmin = (['Admin'].some(r => this.lstRoleNames.includes(r)));
    }
    this.page = { pagenumber: 1, pagesize: 10 }

    this.searchObj = { masterAssetName: '', masterAssetNameAr: '', contractTypeId: 0, contractDate: '', contractEnd: '', contractStart: '', end: '', start: '', warrantyTypeId: 0, assetId: 0, assetName: '', barCode: '', brandId: 0, cityId: 0, code: '', departmentId: 0, governorateId: 0, hospitalId: 0, masterAssetId: 0, model: '', organizationId: 0, originId: 0, serial: '', statusId: 0, subOrganizationId: 0, supplierId: 0, userId: '' };
    this.assetDetailObj = { contractDate: '', contractEndDate: '', contractStartDate: '', governorateNameAr: '', cityNameAr: '', orgNameAr: '', subOrgNameAr: '', remainWarrantyExpiresAr: '', warrantyExpiresAr: '', remainWarrantyExpires: '', periorityName: '', periorityNameAr: '', categoryNameAr: '', createdBy: '', assetImg: '', assetName: '', assetNameAr: '', assetStatus: '', assetStatusAr: '', barCode: '', barcode: '', brandName: '', brandNameAr: '', buildId: 0, buildName: "", buildNameAr: '', categoryName: '', cityName: '', code: '', costCenter: "", departmentName: '', departmentNameAr: '', depreciationRate: '', description: '', descriptionAr: '', expectedLifeTime: '', floor: '', floorId: 0, floorName: '', floorNameAr: '', governorateName: '', height: '', hospitalId: 0, hospitalName: '', hospitalNameAr: '', id: 0, installationDate: '', length: '', listRequests: [], listWorkOrders: [], masterAssetId: 0, masterCode: '', modelNumber: '', operationDate: '', orgName: '', originName: '', originNameAr: '', poNumber: '', price: '', purchaseDate: '', qrFilePath: '', receivingDate: '', remarks: '', room: '', roomId: 0, roomName: '', roomNameAr: '', serialNumber: '', subCategoryName: '', subOrgName: '', supplierName: '', supplierNameAr: '', versionNumber: '', warrantyEnd: '', warrantyExpires: '', warrantyStart: '', weight: '', width: '', strInstallationDate: '', strOperationDate: '', strPurchaseDate: '', inContract: '', inContractAr: '', contractFrom: '', contractTo: '' }

    this.imgURL=`${environment.Domain}UploadedAttachments/MasterAssets/UploadMasterAssetImage/UnknownAsset_load.png`;
    const translationKeys = ['Asset.Reports', 'Asset.Assets', 'Asset.AssetHistory'];
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);
  }
  onLoadByLogIn() {
    if (this.currentUser.hospitalId > 0 && this.currentUser.organizationId > 0 && this.currentUser.subOrganizationId > 0) {
      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
        if (this.currentUser.organizationId > 0) {
          this.searchObj.organizationId = this.currentUser.organizationId;
          this.isOrg = true;
          this.subOrganizationService.GetSubOrganizationByOrgId(this.currentUser.organizationId).subscribe(suborgs => {
            this.lstSubOrganizations = suborgs;

            if (this.currentUser.subOrganizationId > 0) {
              this.searchObj.subOrganizationId = this.currentUser.subOrganizationId;
              this.isSubOrg = true;

              this.hospitalService.GetHospitalsBySubOrganizationId(this.currentUser.organizationId).subscribe(hosts => {
                this.lstHospitals = hosts;
                this.searchObj.hospitalId = this.currentUser.hospitalId;
                this.isHospital = true;
              });
            }
          });
        }
      });
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
      });
      this.hospitalService.GetHospitalById(this.currentUser.hospitalId).subscribe(hospitalObj => {
        this.searchObj.governorateId = hospitalObj.governorateId;
        this.isGov = true;
        this.cityService.GetCitiesByGovernorateId(this.searchObj.governorateId).subscribe((cities) => {
          this.lstCities = cities;
        });
        this.searchObj.cityId = hospitalObj.cityId;
        this.isCity = true;
      });
    }
    else if (this.currentUser.hospitalId > 0 && this.currentUser.governorateId > 0 && this.currentUser.cityId > 0) {
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
        if (this.currentUser.governorateId > 0) {
          this.searchObj.governorateId = this.currentUser.governorateId;
          this.isGov = true;
          this.cityService.GetCitiesByGovernorateId(this.currentUser.governorateId).subscribe(cities => {
            this.lstCities = cities;

            if (this.currentUser.cityId > 0) {
              this.searchObj.cityId = this.currentUser.cityId;
              this.isCity = true;

              this.hospitalService.GetHospitalsByCityId(this.currentUser.cityId).subscribe(hosts => {
                this.lstHospitals = hosts;
                this.searchObj.hospitalId = this.currentUser.hospitalId;
                this.isHospital = true;
              });
            }
          });
        }
      });
      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
      });
      this.hospitalService.GetHospitalById(this.currentUser.hospitalId).subscribe(hospitalObj => {
        this.searchObj.organizationId = hospitalObj.organizationId;
        this.isOrg = true;
        this.subOrganizationService.GetSubOrganizationByOrgId(this.searchObj.organizationId).subscribe((subs) => {
          this.lstSubOrganizations = subs;
        });
        this.searchObj.subOrganizationId = hospitalObj.subOrganizationId;
        this.isSubOrg = true;
      });
    }
    else if (this.currentUser.governorateId > 0 && this.currentUser.cityId == 0 && this.currentUser.hospitalId == 0) {
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
        if (this.currentUser.governorateId > 0) {
          this.searchObj.governorateId = this.currentUser.governorateId;
          this.isGov = true;
          this.cityService.GetCitiesByGovernorateId(this.currentUser.governorateId).subscribe(cities => {
            this.lstCities = cities;
          });
        }
      });
      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
      });
    }
    else if (this.currentUser.governorateId > 0 && this.currentUser.cityId > 0 && this.currentUser.hospitalId == 0) {
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
        if (this.currentUser.governorateId > 0) {
          this.searchObj.governorateId = this.currentUser.governorateId;
          this.isGov = true;
          this.cityService.GetCitiesByGovernorateId(this.currentUser.governorateId).subscribe(cities => {
            this.lstCities = cities;
            this.searchObj.cityId = this.currentUser.cityId;
            this.isCity = true;
          });
        }
      });
      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
      });
    }
    else if (this.currentUser.hospitalId == 0 && this.currentUser.organizationId > 0 && this.currentUser.subOrganizationId == 0) {
      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
        if (this.currentUser.organizationId > 0) {
          this.searchObj.organizationId = this.currentUser.organizationId;
          this.isOrg = true;
          this.subOrganizationService.GetSubOrganizationByOrgId(this.currentUser.organizationId).subscribe(suborgs => {
            this.lstSubOrganizations = suborgs;

            if (this.currentUser.subOrganizationId > 0) {
              this.searchObj.subOrganizationId = this.currentUser.subOrganizationId;
            }
          });
        }
      });
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
      });
    }
    else if (this.currentUser.hospitalId == 0 && this.currentUser.organizationId > 0 && this.currentUser.subOrganizationId > 0) {

      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
        if (this.currentUser.organizationId > 0) {
          this.searchObj.organizationId = this.currentUser.organizationId;
          this.isOrg = true;
          this.subOrganizationService.GetSubOrganizationByOrgId(this.currentUser.organizationId).subscribe(suborgs => {
            this.lstSubOrganizations = suborgs;

            if (this.currentUser.subOrganizationId > 0) {
              this.searchObj.subOrganizationId = this.currentUser.subOrganizationId;
              this.isSubOrg = true;

              this.hospitalService.GetHospitalsBySubOrganizationId(this.currentUser.subOrganizationId).subscribe(hosts => {
                this.lstHospitals = hosts;
                this.searchObj.hospitalId = this.currentUser.hospitalId;
              });
            }
          });
        }
      });

      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
      });

    }
    else if (this.currentUser.hospitalId == 0 && this.currentUser.organizationId == 0 && this.currentUser.subOrganizationId == 0 && this.currentUser.governorateId == 0 && this.currentUser.cityId == 0) {
      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
      });
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
      });

    }
  }
  onLoad() {
    if (this.lang == "en") {
      this.columnsSelected = "Columns Selected";
      this.cols = [
        { field: 'assetName', header: 'AssetName' },
        { field: 'barcode', header: 'BarCode' },
        { field: 'serialNumber', header: 'Serial' },
        { field: 'modelNumber', header: 'Model' },
        { field: 'subject', header: 'Subject' },
        { field: 'requestDate', header: 'Date' }
      ];

    }
    else if (this.lang == "ar") {
      this.columnsSelected = "الأعمدة المختارة";
      this.cols = [
        { field: 'assetNameAr', header: 'اسم الأصل' },
        { field: 'barcode', header: 'الباركود' },
        { field: 'serialNumber', header: 'السيريال' },
        { field: 'modelNumber', header: 'الموديل' },
        { field: 'subject', header: 'الموضوع' },
        { field: 'requestDate', header: 'التاريخ' }
      ];
    }
    this._selectedColumns = this.cols;
    this.governorateService.GetGovernorates().subscribe(items => {
      this.lstGovernorates = items;
    });

    this.organizationService.GetOrganizations().subscribe(items => {
      this.lstOrganizations = items;
    });
    this.departmentService.GetDepartments().subscribe(items => {
      this.lstDepartments = items;
    });
  }
  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;
  }

  onSearch() {
    this.assetDetailService.ViewAssetDetailByMasterId(this.searchObj.assetId).subscribe(
      data => {
        this.assetDetailObj = data;

        if (data["assetImg"] == "" || data["assetImg"] == null) {
          this.imgURL = `${environment.Domain}UploadedAttachments/MasterAssets/UploadMasterAssetImage/UnknownAsset.png`;
        }
        else {
          this.imgURL = `${environment.Domain}UploadedAttachments/MasterAssets/UploadMasterAssetImage/` + data["assetImg"];
        }

        if (this.lang == "ar") {
          if (this.assetDetailObj.operationDate != "") {
            let splitOperationDateDate = this.assetDetailObj.operationDate.split('/');
            let month = splitOperationDateDate[0];
            let day = splitOperationDateDate[1];
            let year = splitOperationDateDate[2];
            let newOperationDate = Number(year).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(month).toLocaleString("ar-SA") + "/" + Number(day).toLocaleString("ar-SA");
            this.assetDetailObj.operationDate = newOperationDate;
          }

          if (this.assetDetailObj.purchaseDate != "") {
            let splitPurchaseDate = this.datePipe.transform(this.assetDetailObj.purchaseDate, "MM/dd/yyyy").split('/');
            let pmonth = splitPurchaseDate[0];
            let pday = splitPurchaseDate[1];
            let pyear = splitPurchaseDate[2];
            let newPurchaseDate = Number(pyear).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(pmonth).toLocaleString("ar-SA") + "/" + Number(pday).toLocaleString("ar-SA");
            this.assetDetailObj.purchaseDate = newPurchaseDate;
          }

          if (this.assetDetailObj.receivingDate != "") {
            let splitReceiveDate = this.assetDetailObj.receivingDate.split('/');
            let rmonth = splitReceiveDate[0];
            let rday = splitReceiveDate[1];
            let ryear = splitReceiveDate[2];
            let newReceiveDate = Number(ryear).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(rmonth).toLocaleString("ar-SA") + "/" + Number(rday).toLocaleString("ar-SA");
            this.assetDetailObj.receivingDate = newReceiveDate;
          }

          if (this.assetDetailObj.installationDate != "") {
            let splitInstallDate = this.assetDetailObj.installationDate.split('/');
            let inmonth = splitInstallDate[0];
            let inday = splitInstallDate[1];
            let inyear = splitInstallDate[2];
            let newInstallDate = Number(inyear).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(inmonth).toLocaleString("ar-SA") + "/" + Number(inday).toLocaleString("ar-SA");
            this.assetDetailObj.installationDate = newInstallDate;

          }


          if (this.assetDetailObj.warrantyStart != "") {
            let warrantyStart = this.assetDetailObj.warrantyStart.split('/');
            let wsmonth = warrantyStart[0];
            let wsday = warrantyStart[1];
            let wsyear = warrantyStart[2];
            let newWSDate = Number(wsyear).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(wsmonth).toLocaleString("ar-SA") + "/" + Number(wsday).toLocaleString("ar-SA");
            this.assetDetailObj.warrantyStart = newWSDate;
          }
          if (this.assetDetailObj.warrantyEnd != "") {
            let warrantyEnd = this.assetDetailObj.warrantyEnd.split('/');
            let wemonth = warrantyEnd[0];
            let weday = warrantyEnd[1];
            let weyear = warrantyEnd[2];
            let newWEDate = Number(weyear).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(wemonth).toLocaleString("ar-SA") + "/" + Number(weday).toLocaleString("ar-SA");
            this.assetDetailObj.warrantyEnd = newWEDate;
          }
        }
      });


  }
  reset() {
    this.reload();
  }
  reload() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }
  GetAssetNameByMasterAssetIdAndHospitalId($event) {
    if (this.currentUser.hospitalId != 0) {
      this.assetDetailService.GetAssetNameByMasterAssetIdAndHospitalId($event.target.value, this.currentUser.hospitalId).subscribe(
        res => {
          this.lstassetDetails = res
        });
    }
    else {
      this.assetDetailService.GetAssetNameByMasterAssetIdAndHospitalId($event.target.value, this.searchObj.hospitalId).subscribe(
        res => {
          this.lstassetDetails = res
        });
    }
  }

  getAssetsByHospitalId($event) {

    this.hospitalId = $event.target.value;
    if (this.currentUser.hospitalId == 0 && this.currentUser.organizationId == 0 && this.currentUser.subOrganizationId == 0 && this.currentUser.governorateId == 0 && this.currentUser.cityId == 0) {
      this.masterAssetService.ListMasterAssetsByHospitalId($event.target.value).subscribe(assets => {
        this.lstMasterAssets = assets;
      });
    }
    else {
      this.masterAssetService.ListMasterAssetsByHospitalUserId($event.target.value, this.currentUser.id).subscribe(assets => {
        this.lstMasterAssets = assets;
      });
    }
  }
  getCitiesByGovId(govId: number) {
    this.cityService.GetCitiesByGovernorateId(govId).subscribe(cities => {
      this.lstCities = cities;
    });
  }
  getHospitalsBySubOrgId() {
    if (this.searchObj.subOrganizationId != 0) {
      let subOrgId = this.searchObj.subOrganizationId;
      this.hospitalService.GetHospitalsBySubOrganizationId(subOrgId).subscribe(suborgs => {
        this.lstHospitals = suborgs;
      });
    }
  }
  getSubOrgByOrgId($event) {
    this.subOrganizationService.GetSubOrganizationByOrgId($event.target.value).subscribe(suborgs => {
      this.lstSubOrganizations = suborgs;
    });
  }
  getBarCode(event) {
    this.searchObj.barCode = event["barCode"];
    this.searchObj.assetId = event["id"];
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
    this.searchObj.serial = event["serialNumber"];
    this.searchObj.assetId = event["id"];
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
  clearAssetSerailNumber() {
    this.searchObj.serial = "";
  }
  clearAssetBarCode() {
    this.searchObj.barCode = "";
  }


  public SavePDF() {
    if (this.searchObj.assetId == 0) {
      this.errorDisplay = true;
      if (this.lang == "ar")
        this.errorMessage = "اختر أصل";
      else
        this.errorMessage = "Select Asset";
      return false;
    }
    else {
      this.assetDetailService.PrintAssetHistory(this.searchObj.assetId, this.lang).subscribe(list => {
        let fileName = "AssetHistory.pdf";
        var filePath = `${environment.Domain}UploadedAttachments/`;
        this.uploadService.downloadAssetHistory(fileName).subscribe(file => {
          var dwnldFile = filePath + 'AssetDetails/' + fileName;
          if (fileName != "" || fileName != null)
            window.open(dwnldFile);
        });
      });
    }

  }
}
