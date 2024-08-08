import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { AssetDetailAttachmentVM, AssetOwnerVM, CreateAssetDetailAttachmentVM, EditAssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { ListDepartmentVM } from 'src/app/Shared/Models/departmentVM';
import { ListHospitalDepartmentVM } from 'src/app/Shared/Models/hospitaldepartmentVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { ListMasterAssetVM } from 'src/app/Shared/Models/masterAssetVM';
import { ListSupplierVM } from 'src/app/Shared/Models/supplierVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { DepartmentService } from 'src/app/Shared/Services/department.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { SupplierService } from 'src/app/Shared/Services/supplierService.service';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { environment } from 'src/environments/environment';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FloorService } from 'src/app/Shared/Services/floor.service';
import { BuildingService } from 'src/app/Shared/Services/building.service';
import { RoomService } from 'src/app/Shared/Services/room.service';
import { ListBuildingVM } from 'src/app/Shared/Models/buildingVM';
import { ListFloorVM } from 'src/app/Shared/Models/floorVM';
import { ListRoomVM } from 'src/app/Shared/Models/RoomVM';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';
import { CityService } from 'src/app/Shared/Services/city.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { ListEmployees } from 'src/app/Shared/Models/employeeVM';
import { EmployeeService } from 'src/app/Shared/Services/employee.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { AutoComplete } from 'primeng/autocomplete';
import { ListRequestVM } from 'src/app/Shared/Models/requestModeVM';
import { Paging } from 'src/app/Shared/Models/paging';
import { RequestService } from 'src/app/Shared/Services/request.service';
import { SortRequestVM } from 'src/app/Shared/Models/requestVM';
import { ListAssetStatusVM } from 'src/app/Shared/Models/assetStatusVM';
import { AssetStatusService } from 'src/app/Shared/Services/assetStatus.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateSupplierComponent } from '../../suppliers/create-supplier/create-supplier.component';
import { CreateDepartmentComponent } from '../../departments/create-department/create-department.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})

export class EditComponent implements OnInit {
  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  currentUser: LoggedUser;
  assetObj: EditAssetDetailVM;
  selectedFiles: FileList;
  progressInfos = [];
  message = '';
  fname = '';
  abbr: any;
  fileInfos: Observable<any>;
  savedfilesdisplay: boolean = false;
  dateError: boolean = false;
  display: boolean = false;
  error: any = { isError: false, errorMessage: '' };
  isValidDate: any;
  lstMasterAssets: ListMasterAssetVM[] = [];
  lstAssetStatus: ListAssetStatusVM[] = [];
  masterAssetObj: any;
  lstHospitals: ListHospitalVM[] = [];
  lstHospitalDepartments: ListHospitalDepartmentVM[] = [];
  lstDepartments: ListDepartmentVM[] = [];
  lstSuppliers: ListSupplierVM[] = [];
  lstBuildings: ListBuildingVM[] = [];
  lstFloors: ListFloorVM[] = [];
  lstRooms: ListRoomVM[] = [];
  lstAttachment: AssetDetailAttachmentVM[] = [];
  lstEmployees: ListEmployees[] = [];
  lstGovernorates: ListGovernorateVM[];
  lstCities: ListCityVM[];
  lstOrganizations: ListOrganizationVM[];
  lstSubOrganizations: ListSubOrganizationVM[];
  assetDetailDocument: CreateAssetDetailAttachmentVM
  lstAssetDetailDocument: CreateAssetDetailAttachmentVM[] = [];
  lstAssetDetailDocumentToAdd: CreateAssetDetailAttachmentVM[] = [];
  lstAssetOwners: AssetOwnerVM[] = [];
  selectedEmployees: number[] = [];
  lstRequests: ListRequestVM[] = [];

  errorMessage: string;
  errorDisplay: boolean = false;
  loading: boolean = true;
  assetId: number;
  selectedHospitalId: number;
  purchaseDateStr: string = "";
  installDateStr: string = "";
  WarrantyDateStr: string = "";
  WarrantyEndDateStr: string = "";
  today = new Date();
  isDisabled: boolean = false;

  listOwners: number[];

  isAdmin: boolean = false;
  isHospitalManager: boolean = false;
  isAssetOwner: boolean = false;
  isEngManager: boolean = false;
  lstRoleNames: string[] = [];

  isGov: boolean = false;
  isCity: boolean = false;
  isOrg: boolean = false;
  isSubOrg: boolean = false;
  isHospital: boolean = false;
  canAddSupplier: boolean = false;
  canAddDepartment: boolean = false;
  page: Paging;
  count: number;

  startDateTime: Date;
  startStamp: number;
  newDate: Date = new Date();
  newStamp = this.newDate.getTime();
  timer;
  sortStatus: string = "ascending";
  sortObj: SortRequestVM;
  uploadFileName: string;
  fileToUpload: File;
  selectedAssetStatusId: number = 0;

  formData = new FormData();
  itmIndex: any[] = [];
  selectedValue = null;
  imgURL: string = "";


  selectedPage: Paging;
  pageNumber: number;
  pageSize: number;
  incremant: number = 0;
  @ViewChild('autoItems', { static: false }) public autoItems: AutoComplete;

  constructor(private authenticationService: AuthenticationService, private dialogService: DialogService,
    private assetDetailService: AssetDetailService, private masterAssetService: MasterAssetService, private departmentService: DepartmentService, private supplierService: SupplierService, private uploadService: UploadFilesService,
    private floorService: FloorService, private buildingService: BuildingService, private roomService: RoomService, private datePipe: DatePipe,
    private config: DynamicDialogConfig, private ref: DynamicDialogRef, private confirmationService: ConfirmationService, private route: Router,
    private organizationService: OrganizationService, private subOrganizationService: SubOrganizationService, private cityService: CityService, private governorateService: GovernorateService,
    private requestService: RequestService, private assetStatusService: AssetStatusService, private messageService: MessageService,
    private employeeService: EmployeeService, private hospitalService: HospitalService, private activeRoute: ActivatedRoute) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    this.page = {
      pagenumber: 1,
      pagesize: 10,
    }
    this.assetObj = { createdBy: '', id: 0, assetStatusId: 0, barcode: '', cityId: 0, code: '', costCenter: '', departmentId: 0, depreciationRate: 0, governorateId: 0, hospitalId: 0, listOwners: [], masterAssetId: 0, organizationId: 0, poNumber: '', price: 0, purchaseDate: '', remarks: '', serialNumber: '', subOrganizationId: 0, warrantyExpires: '', buildingId: 0, floorId: 0, installationDate: '', operationDate: '', receivingDate: '', roomId: 0, supplierId: 0, warrantyEnd: '', warrantyStart: '', assetName: '', assetNameAr: '', qrFilePath: '' }

    this.sortObj = {
      userId: '', assetId: 0, hospitalId: 0, closedDate: '', createdBy: '', serial: '', requestCode: '', woLastTrackDescription: '', sortBy: '',
      assetName: '', assetNameAr: '', barCode: '', modeName: '', periorityName: '', periorityNameAr: '', requestDate: '', masterAssetId: 0,
      statusName: '', statusNameAr: '', subject: '', sortStatus: '', modeNameAr: '', description: '', periorityId: 0, statusId: 0, strBarCode: '', strModel: '', strRequestCode: '', strSerial: '', strSubject: ''
    }
    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });
      this.isAdmin = (['Admin'].some(r => this.lstRoleNames.includes(r)));
      this.isHospitalManager = (['TLHospitalManager'].some(r => this.lstRoleNames.includes(r)));
      this.canAddSupplier = (['AddSupplier'].some(r => this.lstRoleNames.includes(r)));
      this.canAddDepartment = (['AddDepartment'].some(r => this.lstRoleNames.includes(r)));

    }
    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }
    this.initPage();

    this.governorateService.GetGovernorates().subscribe(items => {
      this.lstGovernorates = items;
    });

    this.organizationService.GetOrganizations().subscribe(items => {
      this.lstOrganizations = items;
    });
    if (this.currentUser.governorateId == 0 && this.currentUser.cityId == 0 && this.currentUser.organizationId == 0 && this.currentUser.subOrganizationId == 0 && this.currentUser.hospitalId == 0) {
      this.isGov = false;
      this.isCity = false;
      this.isOrg = false;
      this.isSubOrg = false;
      this.isHospital = false;
      this.isDisabled = false;
    }
    if (this.currentUser.governorateId > 0) {
      this.isGov = true;
    }
    if (this.currentUser.cityId > 0) {
      this.isGov = true;
      this.isCity = true;
    }
    if (this.currentUser.organizationId > 0) {
      this.isGov = true;
      this.isCity = true;
      this.isOrg = true;
      this.isSubOrg = false;
      this.isHospital = false;
      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
        this.subOrganizationService.GetSubOrganizationByOrgId(this.currentUser.organizationId).subscribe(items => {
          this.lstSubOrganizations = items;
        });
      });
    }
    if (this.currentUser.subOrganizationId > 0) {
      this.isGov = true;
      this.isCity = true;
      this.isOrg = true;
      this.isSubOrg = true;
      this.isHospital = false;
      this.hospitalService.GetHospitalsBySubOrganizationId(this.currentUser.subOrganizationId).subscribe(hosts => {
        this.lstHospitals = hosts;
      });
    }
    if (this.currentUser.hospitalId > 0) {
      this.isGov = true;
      this.isCity = true;
      this.isOrg = true;
      this.isSubOrg = true;
      this.isHospital = true;
      this.isDisabled = true;
    }
    if (this.config.data != null || this.config.data != undefined) {

      this.pageNumber = this.config.data.pageNumber;
      this.pageSize = this.config.data.pageSize;
      this.page = {
        pagenumber: this.pageNumber,
        pagesize: this.pageSize,
      }

      let id = this.config.data.id;
      this.assetId = id;
      this.assetDetailService.GetAssetById(this.assetId).subscribe(
        data => {
          this.assetObj = data;
          this.masterAssetService.GetMasterAssetById(data["masterAssetId"]).subscribe(masterObj => {
            this.masterAssetObj = masterObj;
            if (this.lang == "en") {
              this.masterAssetObj.name = masterObj.name + " - " + masterObj.model + " - " + masterObj.brandName;
            } else {
              this.masterAssetObj.name = masterObj.nameAr + " - " + masterObj.model + " - " + masterObj.brandNameAr;
            }

          });
          if (this.currentUser.hospitalId > 0) {
            this.hospitalService.GetHospitalById(this.currentUser.hospitalId).subscribe(item => {
              this.selectedHospitalId = item["id"];
              this.assetObj.organizationId = item["organizationId"];
              this.assetObj.governorateId = item["governorateId"];
              this.cityService.GetCitiesByGovernorateId(Number(item["governorateId"])).subscribe(cities => {
                this.lstCities = cities;
                this.assetObj.cityId = item["cityId"];
              });
              this.subOrganizationService.GetSubOrganizationByOrgId(item["organizationId"]).subscribe(items => {
                this.lstSubOrganizations = items;
                this.assetObj.subOrganizationId = item["subOrganizationId"];
              });
            });
          }
          else {
            this.hospitalService.GetHospitalById(this.assetObj.hospitalId).subscribe(item => {
              this.selectedHospitalId = item["id"];
              this.assetObj.organizationId = item["organizationId"];
              this.assetObj.governorateId = item["governorateId"];
              this.cityService.GetCitiesByGovernorateId(Number(item["governorateId"])).subscribe(cities => {
                this.lstCities = cities;
                this.assetObj.cityId = item["cityId"];
              });
              this.subOrganizationService.GetSubOrganizationByOrgId(item["organizationId"]).subscribe(items => {
                this.lstSubOrganizations = items;
                this.assetObj.subOrganizationId = item["subOrganizationId"];
              });
            });
          }
          this.assetDetailService.GetOwnersByAssetDetailId(this.assetObj.id).forEach(items => {
            this.lstAssetOwners = items;
            this.lstAssetOwners.forEach(element => {
              element.hospitalId = this.currentUser.hospitalId;
              this.selectedEmployees.push(element.employeeId);
            });
          });
          this.employeeService.GetEmployeesByHospitalId(this.assetObj.hospitalId).subscribe(employees => {
            this.lstEmployees = employees;
          });
          this.hospitalService.GetHospitalDepartmentByHospitalId(this.assetObj.hospitalId).subscribe(hospitaldeparts => {
            this.lstHospitalDepartments = hospitaldeparts
            this.lstHospitalDepartments.forEach(element => {
              this.departmentService.GetDepartmentById(element.departmentId).subscribe(department => {
                this.lstDepartments.push(department);
              })
            });
          });

          if (this.assetObj.buildingId != null) {
            this.floorService.GetFloorsByBuildingId(this.assetObj.buildingId).subscribe(floors => {
              this.lstFloors = floors;
            });
          }
          if (this.assetObj.floorId != null) {
            this.roomService.GetRoomsByFloorId(this.assetObj.floorId).subscribe(rooms => {
              this.lstRooms = rooms;
            });
          }

          this.assetStatusService.GetAssetStatus().subscribe(lstStatus => {
            this.lstAssetStatus = lstStatus;
          })
          this.assetObj.installationDate = this.datePipe.transform(this.assetObj.installationDate, "MM/dd/yyyy");
          this.assetObj.purchaseDate = this.datePipe.transform(this.assetObj.purchaseDate, "MM/dd/yyyy");
          this.assetObj.warrantyStart = this.datePipe.transform(this.assetObj.warrantyStart, "MM/dd/yyyy");
          this.assetObj.warrantyEnd = this.datePipe.transform(this.assetObj.warrantyEnd, "MM/dd/yyyy");

          if (data["assetImg"] == "" || data["assetImg"] == null) {
            this.imgURL = `${environment.Domain}UploadedAttachments/MasterAssets/UploadMasterAssetImage/UnknownAsset.png`;
          }
          else {
            this.imgURL = `${environment.Domain}UploadedAttachments/MasterAssets/UploadMasterAssetImage/` + data["assetImg"];
          }

          this.assetDetailService.GetAttachmentByAssetDetailId(this.assetObj.id).subscribe(
            (files => {
              this.lstAttachment = files;
            }), (error => console.log(error)));
        });
    }
  }
  getLastWarrantyDate(value) {
    var date = new Date(this.assetObj.warrantyStart.toString());
    date.setMonth(date.getMonth() + Number(value));
    var endDate = date.toISOString().slice(0, 10);
    this.assetObj.warrantyEnd = endDate;
  }
  initPage() {
    this.assetDetailDocument = { fileName: '', assetDetailId: 0, title: '', assetFile: File, hospitalId: 0 };

    this.assetObj = {
      id: 0, assetName: '', assetNameAr: '', qrFilePath: '', assetStatusId: 0, createdBy: '',
      barcode: '', code: '', departmentId: 0, hospitalId: 0, installationDate: '', masterAssetId: 0, price: 0,
      purchaseDate: '', remarks: '', serialNumber: '', supplierId: 0, warrantyExpires: '',
      warrantyStart: '', warrantyEnd: '', receivingDate: '', poNumber: '', operationDate: '', roomId: 0, floorId: 0, buildingId: 0,
      cityId: 0, governorateId: 0, organizationId: 0, subOrganizationId: 0, costCenter: '', depreciationRate: 0, listOwners: []
    }
    this.supplierService.GetSuppliers().subscribe(suppliers => {
      this.lstSuppliers = suppliers
    });

    this.masterAssetService.GetMasterAssets().subscribe(masters => {
      this.lstMasterAssets = masters;
      if (this.lang == "en") {
        this.lstMasterAssets.forEach(item => item.name = item.name + " - " + item.model + " - " + item.brandName);
      }
      else {
        this.lstMasterAssets.forEach(item => item.name = item.nameAr + " - " + item.model + " - " + item.brandNameAr);
      }
    });

    if (this.currentUser.hospitalId > 0) {
      this.buildingService.GetAllBuildingsByHospitalId(this.currentUser.hospitalId).subscribe(builds => {
        this.lstBuildings = builds;
      })
    }
    else {
      this.buildingService.GetBuildings().subscribe(builds => {
        this.lstBuildings = builds;
      });
    }

    this.hospitalService.GetHospitals().subscribe(hosts => {
      this.lstHospitals = hosts;
    });




  }
  getSubOrgByOrgId($event) {
    this.subOrganizationService.GetSubOrganizationByOrgId($event.target.value).subscribe(suborgs => {
      this.lstSubOrganizations = suborgs;
    });
  }
  getCitiesByGovId($event) {
    this.cityService.GetCitiesByGovernorateId($event.target.value).subscribe(cities => {
      this.lstCities = cities;
    });
  }
  getHospitalsBySubOrgId($event) {
    this.hospitalService.GetHospitalsBySubOrganizationId($event.target.value).subscribe(hospitals => {
      this.lstHospitals = hospitals;
    });
  }
  getFloorsByBuildId($event) {
    let buildId = $event.target.value;

    this.floorService.GetFloorsByBuildingId(buildId).subscribe(floors => {
      this.lstFloors = floors;
    })
  }
  getRoomsByfloorId($event) {
    let floorId = $event.target.value;
    this.roomService.GetRoomsByFloorId(floorId).subscribe(rooms => {
      this.lstRooms = rooms;
    })
  }
  getDepartmentsofHospital($event) {
    this.selectedHospitalId = $event.target.value;
    this.lstDepartments = [];
    let hospitalId = $event.target.value;
    this.hospitalService.GetHospitalDepartmentByHospitalId(hospitalId).subscribe(hospitaldeparts => {
      this.lstHospitalDepartments = hospitaldeparts
      this.lstHospitalDepartments.forEach(element => {
        this.departmentService.GetDepartmentById(element.departmentId).subscribe(department => {
          this.lstDepartments.push(department);
        })
      });
    });

  }
  changeInstallationDate(event: MatDatepickerInputEvent<Date>) {
    this.assetObj.installationDate = this.datePipe.transform(event.value, "yyyy-MM-dd");
  }
  changePurchaseDate(event: MatDatepickerInputEvent<Date>) {
    this.assetObj.purchaseDate = this.datePipe.transform(event.value, "yyyy-MM-dd");
  }
  changeReceivingDate(event: MatDatepickerInputEvent<Date>) {
    this.assetObj.receivingDate = this.datePipe.transform(event.value, "yyyy-MM-dd");
  }
  changeOperationDate(event: MatDatepickerInputEvent<Date>) {
    this.assetObj.operationDate = this.datePipe.transform(event.value, "yyyy-MM-dd");
  }
  changWarrantyStartDate(event: MatDatepickerInputEvent<Date>) {

    this.WarrantyDateStr = this.datePipe.transform(event.value, "yyyy-MM-dd");
    this.assetObj.warrantyStart = this.WarrantyDateStr;
  }
  getDifferenceInMonths(event: MatDatepickerInputEvent<Date>) {

    if (this.assetObj.warrantyStart == "") {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select start warranty";
      }
      else {
        this.errorMessage = "من فضلك اختر تاريخ بداية الضمان";
      }
    }
    if (this.assetObj.warrantyStart != null && this.assetObj.warrantyEnd == null) {
      let start = new Date(this.assetObj.warrantyStart);
      let months = (start.getFullYear()) * 12 + (start.getMonth() + this.assetObj.warrantyExpires);
      this.assetObj.warrantyExpires = months.toString();
    }
    else {
      let start = new Date(this.assetObj.warrantyStart);
      //let months = (event.value.getFullYear() - start.getFullYear()) * 12 + (event.value.getMonth() - start.getMonth()) + 1;
      let months = (event.value.getFullYear() - start.getFullYear()) * 12 + (event.value.getMonth() - start.getMonth());
      this.assetObj.warrantyExpires = months.toString() + " Months";
      this.WarrantyEndDateStr = this.datePipe.transform(event.value, "yyyy-MM-dd");
      this.assetObj.warrantyEnd = this.WarrantyEndDateStr;

    }
  }
  onSubmit() {
    let today = this.datePipe.transform(this.today, "MM/dd/yyyy");
    this.isValidDate = this.validateIntallationDates(this.installDateStr, today);
    if (!this.isValidDate) {
      this.dateError = true;
      return false;
    }
    this.isValidDate = this.validatePurchaseDates(this.purchaseDateStr, today);
    if (!this.isValidDate) {

      this.dateError = true;
      return false;
    }
    if (this.installDateStr == null || this.installDateStr == "")
      this.assetObj.installationDate = this.assetObj.installationDate;
    if (this.purchaseDateStr == null || this.purchaseDateStr == "")
      this.assetObj.purchaseDate = this.assetObj.purchaseDate;

    if (this.assetObj.installationDate != "" && this.assetObj.purchaseDate == "") {
      let installDate = this.datePipe.transform(this.assetObj.installationDate, "yyyy-MM-dd");
      this.isValidDate = this.validateIntallationDates(installDate, today);
      if (!this.isValidDate) {
        this.dateError = true;
        return false;
      }
    }
    if (this.assetObj.purchaseDate != "" && this.assetObj.installationDate == "") {
      let purchaseDate = this.datePipe.transform(this.assetObj.purchaseDate, "yyyy-MM-dd");
      this.isValidDate = this.validatePurchaseDates(purchaseDate, today);
      if (!this.isValidDate) {
        this.dateError = true;
        return false;
      }
    }
    else if (this.assetObj.purchaseDate != "" && this.assetObj.installationDate != "") {
      let purchase = this.datePipe.transform(this.assetObj.purchaseDate, "yyyy-MM-dd");
      let install = this.datePipe.transform(this.assetObj.installationDate, "yyyy-MM-dd");
      this.isValidDate = this.validatePurchaseInstallDates(purchase, install);
      if (!this.isValidDate) {
        this.dateError = true;
        return false;
      }
    }
    if (this.assetObj.operationDate != "" && this.assetObj.installationDate == "") {
      let operation = this.datePipe.transform(this.assetObj.operationDate, "yyyy-MM-dd");
      this.isValidDate = this.validateOperationInstallDates(operation, today);
      if (!this.isValidDate) {
        this.dateError = true;
        return false;
      }
    }
    else if (this.assetObj.operationDate != "" && this.assetObj.installationDate != "") {

      let operation = this.datePipe.transform(this.assetObj.operationDate, "yyyy-MM-dd");
      let install = this.datePipe.transform(this.assetObj.installationDate, "yyyy-MM-dd");
      this.isValidDate = this.validateOperationInstallDates(install, operation);
      if (!this.isValidDate) {
        this.dateError = true;
        return false;
      }
    }
    if (this.assetObj.warrantyStart != "" && this.assetObj.warrantyEnd != "") {
      this.isValidDate = this.validateWarrantyDates(this.assetObj.warrantyStart, this.assetObj.warrantyEnd);
      if (!this.isValidDate) {
        this.dateError = true;
        return false;
      }
    }
    if (this.assetObj.receivingDate != "" && this.assetObj.purchaseDate == "") {
      let receive = this.datePipe.transform(this.assetObj.receivingDate, "yyyy-MM-dd");
      this.isValidDate = this.validateOperationInstallDates(receive, today);
      if (!this.isValidDate) {
        this.dateError = true;
        return false;
      }
    }
    if (this.assetObj.receivingDate != "" && this.assetObj.purchaseDate != "") {
      let receive = this.datePipe.transform(this.assetObj.receivingDate, "yyyy-MM-dd");
      let purchase = this.datePipe.transform(this.assetObj.purchaseDate, "yyyy-MM-dd");
      this.isValidDate = this.validateReceivePurchaseDates(purchase, receive);
      if (!this.isValidDate) {
        this.dateError = true;
        return false;
      }
    }
    if (this.assetObj.receivingDate != "" && this.assetObj.installationDate != "") {
      let receive = this.datePipe.transform(this.assetObj.receivingDate, "yyyy-MM-dd");
      let install = this.datePipe.transform(this.assetObj.installationDate, "yyyy-MM-dd");
      this.isValidDate = this.validateReceiveIntallationDates(receive, install);
      if (!this.isValidDate) {
        this.dateError = true;
        return false;
      }
    }
    if (this.assetObj.receivingDate != "" && this.assetObj.operationDate != "") {
      let receive = this.datePipe.transform(this.assetObj.receivingDate, "yyyy-MM-dd");
      let operation = this.datePipe.transform(this.assetObj.operationDate, "yyyy-MM-dd");
      this.isValidDate = this.validateReceiveOperationDates(receive, operation);
      if (!this.isValidDate) {
        this.dateError = true;
        return false;
      }
    }

    this.assetObj.warrantyStart = this.datePipe.transform(this.assetObj.warrantyStart, "yyyy-MM-dd");
    this.assetObj.warrantyEnd = this.datePipe.transform(this.assetObj.warrantyEnd, "yyyy-MM-dd");
    this.assetObj.operationDate = this.datePipe.transform(this.assetObj.operationDate, "yyyy-MM-dd");
    this.assetObj.receivingDate = this.datePipe.transform(this.assetObj.receivingDate, "yyyy-MM-dd");
    this.assetObj.hospitalId = this.currentUser.hospitalId;
    this.assetObj.createdBy = this.currentUser.id;

    this.assetObj.listOwners = this.selectedEmployees;
    if (this.selectedHospitalId != 0) {
      this.assetObj.hospitalId = this.selectedHospitalId;
    }
    else {
      this.assetObj.hospitalId = this.currentUser.hospitalId;
    }

    this.page.pagenumber = this.pageNumber;
    this.page.pagesize = this.pageSize;

    this.assetDetailService.UpdateAsset(this.assetObj).subscribe(savedId => {
      if (this.lstAssetDetailDocument.length > 0) {
        this.lstAssetDetailDocument.forEach((elemnt, index) => {
          elemnt.hospitalId = this.currentUser.hospitalId;
          elemnt.assetDetailId = this.assetObj.id;
          this.assetDetailService.CreateAssetDetailAttachments(elemnt).subscribe(lstfiles => {
            this.uploadService.uploadAssetDetailFiles(elemnt.assetFile, elemnt.fileName).subscribe(
              (event) => {
                this.display = true;
              },
              (err) => {
                if (this.lang == "en") {
                  this.errorDisplay = true;
                  this.errorMessage = 'Could not upload the file:' + elemnt[index].fileName;
                }
                else {
                  this.errorDisplay = true;
                  this.errorMessage = 'لا يمكن رفع ملف ' + elemnt[index].fileName;
                }
              });
          });
        });

        this.display = true;
        this.ref.close(this.page);
      }




      else {
        this.display = true;
        this.ref.close(this.page);
      }
    }, error => {
      this.errorDisplay = true;
      if (this.lang == "en") {
        if (error.error.status == 'code') {
          this.errorMessage = error.error.message;
        }
        if (error.error.status == 'serial') {
          this.errorMessage = error.error.message;
        }
      }
      else {
        if (error.error.status == 'code') {
          this.errorMessage = error.error.messageAr;
        }
        if (error.error.status == 'serial') {
          this.errorMessage = error.error.messageAr;
        }
      }
      return false;
    }
    );
  }
  close() {
    this.page.pagenumber = this.pageNumber;
    this.page.pagesize = this.pageSize;
    this.ref.close(this.page);
  }
  reload() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }
  validateWarrantyDates(sDate: string, eDate: string) {
    this.isValidDate = true;
    if ((sDate != null && eDate != null) && (eDate) < (sDate)) {
      if (this.lang == "en") {
        this.error = { isError: true, errorMessage: 'Warranty start date should be less than warranty end date.' };
      }
      else {
        this.error = { isError: true, errorMessage: ' تاريخ البداية لابد أن يكون قبل تاريخ الضمان' };
      }
      this.isValidDate = false;
    }
    return this.isValidDate;
  }
  validateIntallationDates(sDate: string, eDate: string) {
    this.isValidDate = true;
    if ((sDate != null && eDate != null) && (eDate) < (sDate)) {
      if (this.lang == "en") {
        this.error = { isError: true, errorMessage: 'Install date should be less than today date.' };
      }
      else {
        this.error = { isError: true, errorMessage: 'تاريخ إعداد الجهاز لابد أن يكون أقل من تاريخ اليوم' };
      }
      this.isValidDate = false;
    }
    return this.isValidDate;
  }
  validateReceiveIntallationDates(sDate: string, eDate: string) {
    this.isValidDate = true;
    if ((sDate != null && eDate != null) && (eDate) < (sDate)) {
      if (this.lang == "en") {
        this.error = { isError: true, errorMessage: 'Install date should be greater than receive date.' };
      }
      else {
        this.error = { isError: true, errorMessage: 'تاريخ تشغيل الجهاز لابد أن يكون بعد  تاريخ الوصول' };
      }
      this.isValidDate = false;
    }
    return this.isValidDate;
  }
  validatePurchaseInstallDates(sDate: string, eDate: string) {
    this.isValidDate = true;
    if ((sDate != null && eDate != null) && (eDate) < (sDate)) {
      if (this.lang == "en") {
        this.error = { isError: true, errorMessage: 'Purchase date should be less than install date.' };
      }
      else {
        this.error = { isError: true, errorMessage: 'تاريخ شراء الجهاز لابد أن يكون قبل  تاريخ الإعداد' };
      }
      this.isValidDate = false;
    }
    return this.isValidDate;
  }
  validateReceivePurchaseDates(sDate: string, eDate: string) {
    this.isValidDate = true;
    if ((sDate != null && eDate != null) && (eDate) < (sDate)) {
      if (this.lang == "en") {
        this.error = { isError: true, errorMessage: 'Purchase date should be less than receive date.' };
      }
      else {
        this.error = { isError: true, errorMessage: 'تاريخ شراء الجهاز لابد أن يكون قبل  تاريخ الوصول' };
      }
      this.isValidDate = false;
    }
    return this.isValidDate;
  }
  validateOperationInstallDates(sDate: string, eDate: string) {
    this.isValidDate = true;
    if ((sDate != null && eDate != null) && (eDate) < (sDate)) {
      if (this.lang == "en") {
        this.error = { isError: true, errorMessage: 'Operation date should be greater than install date.' };
      }
      else {
        this.error = { isError: true, errorMessage: 'تاريخ تشغيل الجهاز لابد أن يكون بعد  تاريخ الإعداد' };
      }
      this.isValidDate = false;
    }
    return this.isValidDate;
  }
  validatePurchaseDates(sDate: string, eDate: string) {
    this.isValidDate = true;
    if ((sDate != null && eDate != null) && (eDate) < (sDate)) {
      if (this.lang == "en") {
        this.error = { isError: true, errorMessage: 'Purchase date should be less than today date.' };
      }
      else {
        this.error = { isError: true, errorMessage: 'تاريخ شراء الجهاز لابد أن يكون قبل  تاريخ اليوم' };
      }

      this.isValidDate = false;
    }
    return this.isValidDate;
  }
  validateReceiveOperationDates(sDate: string, eDate: string) {
    this.isValidDate = true;
    if ((sDate != null && eDate != null) && (eDate) < (sDate)) {
      if (this.lang == "en") {
        this.error = { isError: true, errorMessage: 'Operation date should be greater than receive date.' };
      }
      else {
        this.error = { isError: true, errorMessage: 'تاريخ تشغيل الجهاز لابد أن يكون بعد  تاريخ الوصول' };
      }
      this.isValidDate = false;
    }
    return this.isValidDate;
  }
  DeleteFile(id: number) {
    if (this.lang == 'en') {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to delete this file?',
        header: 'Delete Item Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.assetDetailService.DeleteAssetDetailAttachmentById(id).subscribe(result => {
          });
        },
        reject: () => {
          this.confirmationService.close();
        }
      });
    }
    else {
      this.confirmationService.confirm({
        message: 'هل أنت متأكد من مسح هذا الملف',
        header: "تأكيد المسح",
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.assetDetailService.DeleteAssetDetailAttachmentById(id).subscribe(result => {
          });
        },
        reject: () => {
          this.confirmationService.close();
        }
      });
    }
  }
  downloadFile(fileName) {
    var filePath = `${environment.Domain}UploadedAttachments/`;

    this.uploadService.downloadAssetDetailFile(fileName).subscribe(file => {
      var dwnldFile = filePath + 'AssetDetails/' + fileName;
      if (fileName != "" || fileName != null)
        window.open(dwnldFile);
    });
  }


  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    this.formData.append('file', fileToUpload, fileToUpload.name);
    this.assetDetailDocument.fileName = fileToUpload.name;
    this.assetDetailDocument.assetFile = fileToUpload;
    this.addFileToList();
  }
  addFileToList() {
    if (this.assetDetailDocument.title != "" && this.assetDetailDocument.fileName != "") {
      this.assetDetailDocument.assetDetailId = Number(this.assetId);
      let ext = this.assetDetailDocument.fileName.split('.').pop();
      let lastdocumentName = "";
      let imageIndex = "";

      if (this.itmIndex.length == 0) {
        this.assetDetailService.GetLastDocumentForAssetDetailId(Number(this.assetId)).subscribe(lastDoc => {
          lastdocumentName = lastDoc.fileName;
          if (lastdocumentName == null) {

            var last_element = 1;
            this.itmIndex.push(last_element);
            let ext = this.assetDetailDocument.fileName.split('.').pop();
            var hCode = this.pad(this.currentUser.hospitalCode, 4);
            var srCode = this.pad(this.assetObj.barcode, 10);
            let newIndex = this.pad((last_element).toString(), 2);
            let WOFileName = hCode + "HA" + srCode + newIndex;
            this.assetDetailDocument.fileName = WOFileName + "." + ext;
          }
          else if (lastdocumentName != "") {
            imageIndex = lastdocumentName.split('.').slice(0, -1).join('.');
            imageIndex = imageIndex.substring(imageIndex.length - 2);
            this.itmIndex.push(imageIndex);

            var newImageIndex = parseInt(imageIndex) + 1;
            this.itmIndex.push(newImageIndex);

            var hCode = this.pad(this.currentUser.hospitalCode, 4);
            var srCode = this.pad(this.assetObj.barcode, 10);
            var last = this.itmIndex[this.itmIndex.length - 1];
            let newIndex = this.pad((last).toString(), 2);
            let woRFileName = hCode + "HA" + srCode + newIndex + "." + ext;
            this.assetDetailDocument.fileName = woRFileName;

          }
          else if (lastdocumentName == "") {

            var last_element = 1;
            this.itmIndex.push(last_element);
            let ext = this.assetDetailDocument.fileName.split('.').pop();
            var hCode = this.pad(this.currentUser.hospitalCode, 4);
            var srCode = this.pad(this.assetObj.barcode, 10);
            let newIndex = this.pad((last_element).toString(), 2);
            let WOFileName = hCode + "HA" + srCode + newIndex;
            this.assetDetailDocument.fileName = WOFileName + "." + ext;
          }
          this.lstAssetDetailDocument.push(this.assetDetailDocument);
          this.assetDetailDocument = { fileName: '', assetDetailId: 0, title: '', assetFile: File, hospitalId: 0 };
        });
      }
      else if (this.itmIndex.length > 0) {
        var last_element = this.itmIndex[this.itmIndex.length - 1];
        last_element = parseInt(last_element) + 1;
        this.itmIndex.push(last_element);

        var hCode = this.pad(this.currentUser.hospitalCode, 4);
        var srCode = this.pad(this.assetObj.barcode, 10);
        let newIndex = this.pad((last_element).toString(), 2);
        let SRFileName = hCode + "HA" + srCode + newIndex;
        this.assetDetailDocument.fileName = SRFileName + "." + ext;
        this.lstAssetDetailDocument.push(this.assetDetailDocument);
        this.assetDetailDocument = { fileName: '', assetDetailId: 0, title: '', assetFile: File, hospitalId: 0 };
      }
    }
    else {
      if (this.lang == "en") {
        this.messageService.add({ key: 'files', severity: 'error', summary: 'Attention !!!', sticky: true, detail: 'Please Complete Data' });
      }
      else {
        this.messageService.add({ key: 'files', severity: 'خطأ', summary: 'انتبه !!!', sticky: true, detail: 'من فضلك أدخل اسم الملف وعنوانه' });
      }
    }
  }


  onSelectionChanged(event) {
    this.masterAssetService.AutoCompleteMasterAssetName2(event.query).subscribe(masters => {
      this.lstMasterAssets = masters;
      if (this.lang == "en") {
        this.lstMasterAssets.forEach(item => item.name = item.name + " - " + item.modelNumber + " - " + item.brandName);
      }
      else {
        this.lstMasterAssets.forEach(item => item.name = item.nameAr + " - " + item.modelNumber + " - " + item.brandNameAr);
      }
    });

  }
  getObject(event) {
    this.assetObj.masterAssetId = event["id"];
  }
  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;

    this.loading = true;

    this.assetDetailService.GetRequestsForAssetId(this.assetId, this.page.pagenumber, this.page.pagesize).subscribe((items) => {
      items.results.forEach(element => {
        if (element.statusId < 5 && (element.statusId != 2)) {
          this.timer = window.setInterval(() => {
            this.startDateTime = new Date(element.requestDate);
            this.startStamp = new Date(element.requestDate).getTime();
            this.newDate = new Date();
            this.newStamp = this.newDate.getTime();
            var diff = Math.round((this.newStamp - this.startStamp) / 1000);
            var d = Math.floor(diff / (24 * 60 * 60)); /* though I hope she won't be working for consecutive days :) */
            diff = diff - (d * 24 * 60 * 60);
            var h = Math.floor(diff / (60 * 60));
            diff = diff - (h * 60 * 60);
            var m = Math.floor(diff / (60));
            diff = diff - (m * 60);
            var s = diff;
            element.elapsedTime = d + " day(s), " + h + ":" + m + ":" + s + "";
          }, 1000);
        }
        else if (element.statusId == 2) {
          if (element.listTracks != null) {
            var firstItem = element.listTracks[0];
            var lastItem = element.listTracks[element.listTracks.length - 1];
            this.startDateTime = new Date(firstItem.date);
            this.startStamp = new Date(firstItem.date).getTime();
            this.newDate = new Date(lastItem.date);
            this.newStamp = this.newDate.getTime();
            var diff2 = Math.round((this.newStamp - this.startStamp) / 1000);
            var d2 = Math.floor(diff2 / (24 * 60 * 60)); /* though I hope she won't be working for consecutive days :) */
            diff2 = diff2 - (d2 * 24 * 60 * 60);
            var h2 = Math.floor(diff2 / (60 * 60));
            diff2 = diff2 - (h2 * 60 * 60);
            var m2 = Math.floor(diff2 / (60));
            diff2 = diff2 - (m2 * 60);
            var s2 = diff2;
            element.elapsedTime = d2 + " day(s), " + h2 + ":" + m2 + ":" + s2 + "";
          }
        }
        this.lstRequests.push(element);
        this.count = items.count;
        this.loading = false;
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
    if (field.currentTarget.id == "BarCode") {
      this.sortObj.barCode = field.currentTarget.id
    }
    else if (field.currentTarget.id == "الباركود") {
      this.sortObj.barCode = field.currentTarget.id
    }


    if (field.currentTarget.id == "Serial") {
      this.sortObj.serial = field.currentTarget.id
    }
    else if (field.currentTarget.id == "السيريال") {
      this.sortObj.serial = field.currentTarget.id
    }

    if (field.currentTarget.id == "Code") {
      this.sortObj.requestCode = field.currentTarget.id
    }
    else if (field.currentTarget.id == "الكود") {
      this.sortObj.requestCode = field.currentTarget.id
    }

    if (field.currentTarget.id == "Subject") {
      this.sortObj.subject = field.currentTarget.id
    }

    if (field.currentTarget.id == "Date") {
      this.sortObj.requestDate = field.currentTarget.id
    }
    else if (field.currentTarget.id == "التاريخ") {
      this.sortObj.requestDate = field.currentTarget.id
    }
    if (field.currentTarget.id == 'Status') {
      this.sortObj.statusName = field.currentTarget.id
    }
    else if (field.currentTarget.id === "الحاله") {
      this.sortObj.statusNameAr = field.currentTarget.id
    }
    if (field.currentTarget.id == "Periority") {
      this.sortObj.periorityName = field.currentTarget.id
    }
    else if (field.currentTarget.id == "الأولوية") {
      this.sortObj.periorityNameAr = field.currentTarget.id
    }
    if (field.currentTarget.id == "Mode") {
      this.sortObj.modeName = field.currentTarget.id
    }
    else if (field.currentTarget.id == "طريقة الإبلاغ") {
      this.sortObj.modeNameAr = field.currentTarget.id
    }

    this.lstRequests = [];
    this.sortObj.userId = this.currentUser.id;
    this.sortObj.hospitalId = this.currentUser.hospitalId;
    this.sortObj.assetId = this.assetId;

    this.assetDetailService.GetRequestsForAssetId(this.assetId, this.page.pagenumber, this.page.pagesize).subscribe((items) => {
      items.results.forEach(element => {
        if (element.statusId < 5 && (element.statusId != 2)) {
          this.timer = window.setInterval(() => {
            this.startDateTime = new Date(element.requestDate);
            this.startStamp = new Date(element.requestDate).getTime();
            this.newDate = new Date();
            this.newStamp = this.newDate.getTime();
            var diff = Math.round((this.newStamp - this.startStamp) / 1000);
            var d = Math.floor(diff / (24 * 60 * 60)); /* though I hope she won't be working for consecutive days :) */
            diff = diff - (d * 24 * 60 * 60);
            var h = Math.floor(diff / (60 * 60));
            diff = diff - (h * 60 * 60);
            var m = Math.floor(diff / (60));
            diff = diff - (m * 60);
            var s = diff;
            element.elapsedTime = d + " day(s), " + h + ":" + m + ":" + s + "";
          }, 1000);
        }
        else if (element.statusId == 2) {
          if (element.listTracks != null) {
            var firstItem = element.listTracks[0];
            var lastItem = element.listTracks[element.listTracks.length - 1];
            this.startDateTime = new Date(firstItem.date);
            this.startStamp = new Date(firstItem.date).getTime();
            this.newDate = new Date(lastItem.date);
            this.newStamp = this.newDate.getTime();
            var diff2 = Math.round((this.newStamp - this.startStamp) / 1000);
            var d2 = Math.floor(diff2 / (24 * 60 * 60)); /* though I hope she won't be working for consecutive days :) */
            diff2 = diff2 - (d2 * 24 * 60 * 60);
            var h2 = Math.floor(diff2 / (60 * 60));
            diff2 = diff2 - (h2 * 60 * 60);
            var m2 = Math.floor(diff2 / (60));
            diff2 = diff2 - (m2 * 60);
            var s2 = diff2;
            element.elapsedTime = d2 + " day(s), " + h2 + ":" + m2 + ":" + s2 + "";
          }
        }
        this.lstRequests.push(element);
        this.count = items.count;
        this.loading = false;
      });
    });
  }
  addSupplier() {
    const dialogRef2 = this.dialogService.open(CreateSupplierComponent, {
      // header: this.lang == "en" ? 'Add New Brand' : "بيان إضافة ماركة جديدة",
      width: '50%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });
    dialogRef2.onClose.subscribe((res) => {
      if (res != this.assetObj.supplierId) {
        this.lstSuppliers = [];
        this.supplierService.GetSuppliers().subscribe(suppliers => {
          this.lstSuppliers = suppliers;
          this.assetObj.supplierId = res;
        });
      }
      else {
        this.assetObj.supplierId = this.assetObj.supplierId;
      }
    });
  }
  addDepartment() {
    const dialogRef2 = this.dialogService.open(CreateDepartmentComponent, {
      // header: this.lang == "en" ? 'Add New Brand' : "بيان إضافة ماركة جديدة",
      width: '50%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });
    dialogRef2.onClose.subscribe((res) => {
      this.assetObj.departmentId = res;
      this.hospitalService.GetHospitalDepartmentByHospitalId(this.currentUser.hospitalId).subscribe(hospitaldeparts => {
        this.lstHospitalDepartments = hospitaldeparts;
        this.lstHospitalDepartments.forEach(element => {
          if (element.departmentId == res) {
            this.departmentService.GetDepartmentById(res).subscribe(department => {
              this.lstDepartments.push(department);
            });
          }
        });
      });
      if (this.lstHospitalDepartments != null || this.lstHospitalDepartments.length != 0) {
        this.hospitalService.GetSelectedHospitalDepartmentByDepartmentId(this.currentUser.hospitalId, res).subscribe(department => {
          this.assetObj.departmentId = res;
        });
      }



      // this.hospitalService.GetHospitalDepartmentByHospitalId2(this.currentUser.hospitalId).subscribe(hospitaldeparts => {
      //   this.lstHospitalDepartments = hospitaldeparts;
      // });
      // if (this.lstHospitalDepartments != null || this.lstHospitalDepartments.length != 0) {
      //   this.hospitalService.GetSelectedHospitalDepartmentByDepartmentId(this.currentUser.hospitalId, res).subscribe(department => {
      //     this.assetObj.departmentId = res;
      //     //  this.assetObj.departmentId = department["departmentId"];
      //   });
      // }
    });
  }



  uploadMultipleFile = (event: any) => {
    const files: FileList = event.target.files;

    if (files.length === 0) {
      return;
    }
    else {

      for (var i = 0; i < files.length; i++) {
        let fileToUpload = <File>files[i];
        var assetDetailDoc = new CreateAssetDetailAttachmentVM();
        this.formData.append('file', fileToUpload, fileToUpload.name);
        assetDetailDoc.fileName = fileToUpload.name;
        assetDetailDoc.assetFile = fileToUpload;
        // make document title as the file name 
        assetDetailDoc.title = fileToUpload.name.split('.')[0];
        this.lstAssetDetailDocumentToAdd.push(assetDetailDoc);
      }
    }
    this.addMultiFilesToList();
  }
  addMultiFilesToList() {
    this.lstAssetDetailDocumentToAdd.forEach(assetDetailDocument => {
      assetDetailDocument.assetDetailId = Number(this.assetId);
      let ext = assetDetailDocument.fileName.split('.').pop();
      let lastdocumentName = "";
      let imageIndex = "";
      if (this.itmIndex.length == 0) {
        this.assetDetailService.GetLastDocumentForAssetDetailId(Number(this.assetId)).subscribe(lastDoc => {
          lastdocumentName = lastDoc.fileName;
          if (lastdocumentName == null) {


            var last_element = ++this.incremant;
            this.itmIndex.push(last_element);
            let ext = assetDetailDocument.fileName.split('.').pop();
            var hCode = this.pad(this.currentUser.hospitalCode, 4);
            var srCode = this.pad(this.assetObj.barcode, 10);
            let newIndex = this.pad((last_element).toString(), 2);
            let WOFileName = hCode + "HA" + srCode + newIndex;
            assetDetailDocument.fileName = WOFileName + "." + ext;

          }
          else if (lastdocumentName != "") {

            imageIndex = lastdocumentName.split('.').slice(0, -1).join('.');
            imageIndex = imageIndex.substring(imageIndex.length - 2);
            this.itmIndex.push(imageIndex);
            //
            var newImageIndex = parseInt(imageIndex) + (++this.incremant);
            this.itmIndex.push(newImageIndex);

            var hCode = this.pad(this.currentUser.hospitalCode, 4);
            var srCode = this.pad(this.assetObj.barcode, 10);
            var last = this.itmIndex[this.itmIndex.length - 1];
            let newIndex = this.pad((last).toString(), 2);
            let woRFileName = hCode + "HA" + srCode + newIndex + "." + ext;
            assetDetailDocument.fileName = woRFileName;
          }
          else if (lastdocumentName == "") {

            var last_element = 1;
            this.itmIndex.push(last_element);
            let ext = assetDetailDocument.fileName.split('.').pop();
            var hCode = this.pad(this.currentUser.hospitalCode, 4);
            var srCode = this.pad(this.assetObj.barcode, 10);
            let newIndex = this.pad((last_element).toString(), 2);
            let WOFileName = hCode + "HA" + srCode + newIndex;
            assetDetailDocument.fileName = WOFileName + "." + ext;

          }
          this.lstAssetDetailDocument.push(assetDetailDocument);
          assetDetailDocument = { fileName: '', assetDetailId: 0, title: '', assetFile: File, hospitalId: 0 };
        });
      }
      else if (this.itmIndex.length > 0) {
        var last_element = this.itmIndex[this.itmIndex.length - 1];
        last_element = parseInt(last_element) + (++this.incremant);
        this.itmIndex.push(last_element);

        var hCode = this.pad(this.currentUser.hospitalCode, 4);
        var srCode = this.pad(this.assetObj.barcode, 10);
        let newIndex = this.pad((last_element).toString(), 2);
        let SRFileName = hCode + "HA" + srCode + newIndex;
        assetDetailDocument.fileName = SRFileName + "." + ext;
        this.lstAssetDetailDocument.push(assetDetailDocument);
        assetDetailDocument = { fileName: '', assetDetailId: 0, title: '', assetFile: File, hospitalId: 0 };
      }
    });



  }
  removeFileFromObjectArray(rowIndex) {
    if (rowIndex >= 0 && rowIndex < this.lstAssetDetailDocument.length) {
      this.lstAssetDetailDocument.splice(rowIndex, 1);
    }
  }
  pad(num: string, size: number): string {
    while (num.length < size) num = "0" + num;
    return num;
  }
}
