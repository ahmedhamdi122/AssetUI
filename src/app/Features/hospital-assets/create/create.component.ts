import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Observable } from 'rxjs';
import { CreateAssetDetailAttachmentVM, CreateAssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { ListAssetStatusVM } from 'src/app/Shared/Models/assetStatusVM';
import { ListBuildingVM } from 'src/app/Shared/Models/buildingVM';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListDepartmentVM } from 'src/app/Shared/Models/departmentVM';
import { ListEmployees } from 'src/app/Shared/Models/employeeVM';
import { ListFloorVM } from 'src/app/Shared/Models/floorVM';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { ListHospitalDepartmentVM } from 'src/app/Shared/Models/hospitaldepartmentVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { ListMasterAssetVM } from 'src/app/Shared/Models/masterAssetVM';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { ListRoomVM } from 'src/app/Shared/Models/roomVM';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { ListSupplierVM } from 'src/app/Shared/Models/supplierVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { AssetStatusService } from 'src/app/Shared/Services/assetStatus.service';
import { BuildingService } from 'src/app/Shared/Services/building.service';
import { CityService } from 'src/app/Shared/Services/city.service';
import { DepartmentService } from 'src/app/Shared/Services/department.service';
import { EmployeeService } from 'src/app/Shared/Services/employee.service';
import { FloorService } from 'src/app/Shared/Services/floor.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { RoomService } from 'src/app/Shared/Services/room.service';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';
import { SupplierService } from 'src/app/Shared/Services/supplierService.service';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { CreateDepartmentComponent } from '../../departments/create-department/create-department.component';
import { CreateSupplierComponent } from '../../suppliers/create-supplier/create-supplier.component';
import { ListBrandVM } from 'src/app/Shared/Models/brandVM';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateComponent implements OnInit {


  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  currentUser: LoggedUser;
  assetObj: CreateAssetDetailVM;
  assetId: number;
  selectedFiles: FileList;
  progressInfos = [];
  message = '';
  fname = '';
  abbr: any;
  fileInfos: Observable<any>;
  savedfilesdisplay: boolean = false;
  errorDisplay: boolean = false;
  dateError: boolean = false;
  isSaved: boolean = false;
  display: boolean = false;
  error: any = { isError: false, errorMessage: '' };
  errorMessage: string = "";
  isValidDate: any;
  isValidDate2: any;
  lstMasterAssets: ListMasterAssetVM[] = [];
  masterAssetObj: ListMasterAssetVM;
  lstHospitals: ListHospitalVM[] = [];
  lstHospitalDepartments: ListHospitalDepartmentVM[] = [];
  lstDepartments: ListDepartmentVM[] = [];
  lstSuppliers: ListSupplierVM[] = [];
  lstBuildings: ListBuildingVM[] = [];
  lstFloors: ListFloorVM[] = [];
  lstRooms: ListRoomVM[] = [];
  lstEmployees: ListEmployees[] = [];
  lstGovernorates: ListGovernorateVM[];
  lstCities: ListCityVM[];
  lstOrganizations: ListOrganizationVM[];
  lstSubOrganizations: ListSubOrganizationVM[];

  lstAssetStatus: ListAssetStatusVM[] = [];
  assetDetailDocument: CreateAssetDetailAttachmentVM;
  lstAssetDetailDocument: CreateAssetDetailAttachmentVM[] = [];
  selectedEmployees: number[] = [];
  selectedGovernorateId: number;
  selectedCityId: number;
  selectedDepartmentId: number;
  today = new Date();
  isDisabled: boolean = false;

  selectedAssetStatusId: number;
  isGov: boolean = false;
  isCity: boolean = false;
  isOrg: boolean = false;
  isSubOrg: boolean = false;
  isHospital: boolean = false;
  masterAssetId: number;

  isAdmin: boolean = false;
  isHospitalManager: boolean = false;
  canAddSupplier: boolean = false;
  canAddDepartment: boolean = false;
  lstRoleNames: string[] = [];
  lstModels: string[] = [];
  lstBrands: ListBrandVM[] = [];



  fileToUpload: File;
  uploadFileName: string;
  itmIndex: any[] = [];
  formData = new FormData();

  constructor(
    private authenticationService: AuthenticationService, private assetDetailService: AssetDetailService, private masterAssetService: MasterAssetService,
    private departmentService: DepartmentService, private supplierService: SupplierService, private uploadService: UploadFilesService, private ref: DynamicDialogRef,
    private assetStatusService: AssetStatusService, private messageService: MessageService,
    private floorService: FloorService, private buildingService: BuildingService, private roomService: RoomService, private datePipe: DatePipe, private organizationService: OrganizationService, private subOrganizationService: SubOrganizationService, private cityService: CityService,
    private governorateService: GovernorateService, private employeeService: EmployeeService,
    private hospitalService: HospitalService, private dialogService: DialogService) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {




    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
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

    this.assetObj = { createdBy: '', assetConditionId: 0, assetStatusId: 0, barcode: '', cityId: 0, code: '', costCenter: '', departmentId: 0, depreciationRate: 0, governorateId: 0, hospitalId: 0, listOwners: [], masterAssetId: 0, organizationId: 0, poNumber: '', price: 0, purchaseDate: '', remarks: '', serialNumber: '', subOrganizationId: 0, warrantyExpires: '', buildingId: 0, floorId: 0, installationDate: '', operationDate: '', receivingDate: '', roomId: 0, supplierId: 0, warrantyEnd: '', warrantyStart: '' }

    this.governorateService.GetGovernorates().subscribe(items => {
      this.lstGovernorates = items;
    });

    this.organizationService.GetOrganizations().subscribe(orgs => {
      this.lstOrganizations = orgs;
    });

    if (this.currentUser.hospitalId > 0) {
      this.assetObj.hospitalId = this.currentUser.hospitalId;
      this.hospitalService.GetHospitalById(this.currentUser.hospitalId).subscribe(host => {
        this.selectedGovernorateId = host["governorateId"];
        this.assetObj.organizationId = host["organizationId"];
        this.cityService.GetCitiesByGovernorateId(host.governorateId).subscribe((cities) => {
          this.lstCities = cities;
          this.selectedCityId = host["cityId"];
          this.isGov = true;
          this.isCity = true;
        });
        this.isOrg = true;
        this.subOrganizationService.GetSubOrganizationByOrgId(this.assetObj.organizationId).subscribe(suborgs => {
          this.lstSubOrganizations = suborgs;
          this.assetObj.subOrganizationId = host["subOrganizationId"];
          if (this.currentUser.subOrganizationId > 0) {
            this.isSubOrg = true;
            this.hospitalService.GetHospitalsBySubOrganizationId(this.currentUser.subOrganizationId).subscribe(hosts => {
              this.lstHospitals = hosts;

              this.assetObj.hospitalId = this.currentUser.hospitalId;
              this.isHospital = true;
            });
          }
          else {
            this.hospitalService.GetHospitalsByCityId(this.currentUser.cityId).subscribe(hosts => {
              this.lstHospitals = hosts;
              this.assetObj.hospitalId = this.currentUser.hospitalId;
              this.isHospital = true;
              this.isSubOrg = true;
            });
          }
        });

        if (this.currentUser.hospitalId != 0) {
          this.hospitalService.GetHospitalDepartmentByHospitalId2(this.currentUser.hospitalId).subscribe(hospitaldeparts => {
            this.lstHospitalDepartments = hospitaldeparts;
          });
        }
        else {
          this.hospitalService.GetHospitalDepartmentByHospitalId2(this.assetObj.hospitalId).subscribe(hospitaldeparts => {
            this.lstHospitalDepartments = hospitaldeparts;

          });
        }
      });
      this.employeeService.GetEmployeesByHospitalId(this.currentUser.hospitalId).subscribe(employees => {
        this.lstEmployees = employees;
      });
      this.buildingService.GetAllBuildingsByHospitalId(this.currentUser.hospitalId).subscribe(builds => {
        this.lstBuildings = builds;
      });
    }
    else if (this.currentUser.governorateId > 0 && this.currentUser.cityId == 0 && this.currentUser.hospitalId == 0) {
      this.governorateService.GetGovernorates().subscribe(governorates => {
        this.lstGovernorates = governorates;
        this.selectedGovernorateId = this.currentUser.governorateId;
        this.isGov = true;
      });

      this.cityService.GetCitiesByGovernorateId(this.currentUser.governorateId).subscribe((cities) => {
        this.lstCities = cities;
      });
    }
    else if (this.currentUser.governorateId > 0 && this.currentUser.cityId > 0 && this.currentUser.hospitalId == 0) {
      this.governorateService.GetGovernorates().subscribe(governorates => {
        this.lstGovernorates = governorates;
        this.selectedGovernorateId = this.currentUser.governorateId;
        this.isGov = true;
      });
      this.cityService.GetCitiesByGovernorateId(this.currentUser.governorateId).subscribe((cities) => {
        this.lstCities = cities;
        this.selectedCityId = this.currentUser.cityId;
        this.isGov = true;
        this.isCity = true;
      });
    }
    else if (this.currentUser.organizationId > 0 && this.currentUser.subOrganizationId == 0 && this.currentUser.hospitalId == 0) {
      this.organizationService.GetOrganizations().subscribe(orgs => {
        this.lstOrganizations = orgs;
        this.assetObj.organizationId = this.currentUser.organizationId;
        this.isOrg = true;
      });
      this.subOrganizationService.GetSubOrganizationByOrgId(this.currentUser.organizationId).subscribe(suborgs => {
        this.lstSubOrganizations = suborgs;
        this.isOrg = true;
      });
    }
    else if (this.currentUser.organizationId > 0 && this.currentUser.subOrganizationId > 0 && this.currentUser.hospitalId == 0) {
      // this.assetObj.organizationId = this.currentUser.organizationId;
      // this.isOrg = true;
      this.organizationService.GetOrganizations().subscribe(orgs => {
        this.lstOrganizations = orgs;
        this.assetObj.organizationId = this.currentUser.organizationId;
        this.isOrg = true;
      });
      this.subOrganizationService.GetSubOrganizationByOrgId(this.currentUser.organizationId).subscribe(suborgs => {
        this.lstSubOrganizations = suborgs;
        this.assetObj.subOrganizationId = this.currentUser.subOrganizationId;
        this.isSubOrg = true;
        this.hospitalService.GetHospitalsBySubOrganizationId(this.assetObj.subOrganizationId).subscribe(hosts => {
          this.lstHospitals = hosts;
        });
      });
    }
    this.onLoad();
    this.selectedGovernorateId = 0;
    this.selectedCityId = 0;
  }
  onLoad() {
    this.assetDetailDocument = { fileName: '', assetDetailId: 0, title: '', assetFile: File, hospitalId: 0 };

    this.assetObj = {
      assetConditionId: 0, assetStatusId: 0, createdBy: '',
      barcode: '', code: '', departmentId: 0, hospitalId: 0, installationDate: '', costCenter: '', depreciationRate: 0,
      masterAssetId: 0, price: 0, purchaseDate: '', remarks: '', serialNumber: '', supplierId: null, warrantyExpires: '',
      warrantyStart: '', warrantyEnd: '', buildingId: null, floorId: null, roomId: null, operationDate: '', poNumber: '', receivingDate: '',
      listOwners: [], cityId: 0, governorateId: 0, organizationId: 0, subOrganizationId: 0
    }
    this.masterAssetService.GetMasterAssets().subscribe(masters => {
      this.lstMasterAssets = masters;
    });


    this.supplierService.GetSuppliers().subscribe(items => {
      this.lstSuppliers = items;
    });

    this.assetStatusService.GetAssetStatus().subscribe(lstStatus => {
      this.lstAssetStatus = lstStatus;
      this.selectedAssetStatusId = 3;
    });



    this.assetDetailService.GenerateAssetDetailBarcode().subscribe(code => {
      this.assetObj.barcode = code["barCode"];
      this.assetObj.code = code["barCode"];
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
    this.lstDepartments = [];
    let hospitalId = $event.target.value;
    this.assetObj.hospitalId = $event.target.value;
    this.hospitalService.GetHospitalDepartmentByHospitalId2(hospitalId).subscribe(hospitaldeparts => {
      this.lstHospitalDepartments = hospitaldeparts;
    });
    this.buildingService.GetAllBuildingsByHospitalId(hospitalId).subscribe(builds => {
      this.lstBuildings = builds;
    });
    this.employeeService.GetEmployeesByHospitalId(hospitalId).subscribe(employees => {
      this.lstEmployees = employees;
    });
  }
  getDifferenceInMonths() {
    let warrantyStart = this.datePipe.transform(this.assetObj.warrantyStart, "yyyy-MM-dd");
    let warrantyEnd = this.datePipe.transform(this.assetObj.warrantyEnd, "yyyy-MM-dd");

    if (warrantyStart != null && warrantyEnd != null) {
      this.isValidDate = this.validateWarrantyDates(warrantyStart, warrantyEnd);
      if (!this.isValidDate) {
        this.dateError = true;
        return false;
      }
      if (warrantyStart != null && warrantyEnd == null) {
        let start = new Date(this.assetObj.warrantyStart);
        let months = (start.getFullYear()) * 12 + (start.getMonth() + this.assetObj.warrantyExpires);
        this.assetObj.warrantyExpires = months.toString();
      }
      else {
        let end = new Date(this.assetObj.warrantyEnd);
        let start = new Date(this.assetObj.warrantyStart);
        // let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) + 1;
        let months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
        this.assetObj.warrantyExpires = months.toString();
      }
    }
  }
  getLastWarrantyDate(value) {
    var date = new Date(this.assetObj.warrantyStart.toString());
    date.setMonth(date.getMonth() + Number(value));
    var endDate = date.toISOString().slice(0, 10);
    this.assetObj.warrantyEnd = endDate;
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
  onSubmit() {
    this.assetObj.governorateId = this.selectedGovernorateId;
    this.assetObj.cityId = this.selectedCityId;
    this.assetObj.listOwners = this.selectedEmployees;
    this.assetObj.assetStatusId = this.selectedAssetStatusId;
    //  this.assetObj.hospitalId = this.currentUser.hospitalId;
    this.assetObj.createdBy = this.currentUser.id;

    let today = this.datePipe.transform(this.today, "yyyy-MM-dd");
    if (this.assetObj.warrantyEnd != "" && this.assetObj.warrantyStart != "") {
      let end = this.datePipe.transform(this.assetObj.warrantyEnd, "yyyy-MM-dd");
      let start = this.datePipe.transform(this.assetObj.warrantyStart, "yyyy-MM-dd");

      if (start != null && end != null) {
        this.isValidDate = this.validateWarrantyDates(start, end);
        if (!this.isValidDate) {
          this.dateError = true;
          return false;
        }
      }
    }
    if (this.assetObj.installationDate != "" && this.assetObj.purchaseDate == "") {
      let installDate = this.datePipe.transform(this.assetObj.installationDate, "yyyy-MM-dd");
      if (installDate != null) {
        this.isValidDate = this.validateIntallationDates(installDate, today);
        if (!this.isValidDate) {
          this.dateError = true;
          return false;
        }
      }
    }
    if (this.assetObj.purchaseDate != "" && this.assetObj.installationDate == "") {
      let purchaseDate = this.datePipe.transform(this.assetObj.purchaseDate, "yyyy-MM-dd");
      this.isValidDate2 = this.validatePurchaseDates(purchaseDate, today);
      if (!this.isValidDate2) {
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
    if (this.assetObj.code == "" || this.assetObj.code == null) {
      this.errorDisplay = true;
      this.errorMessage = "Please insert code";
      return false;
    }

    if (this.assetObj.masterAssetId == 0) {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select asset";
      }
      else {
        this.errorMessage = "من فضلك اختر أصل";
      }
      return false;
    }
    if (this.currentUser.hospitalId == 0) {
      if (this.assetObj.hospitalId == 0) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please select hospital";
        }
        else {
          this.errorMessage = "من فضلك اختر مستشفى";
        }
        return false;
      }
    }
    else if (this.currentUser.hospitalId != 0) {
      this.assetObj.hospitalId = this.currentUser.hospitalId;
    }


    this.assetDetailService.CreateAsset(this.assetObj).subscribe(assetObj => {
      this.assetId = assetObj;
      if (this.lstAssetDetailDocument.length > 0) {
        this.lstAssetDetailDocument.forEach((elemnt, index) => {
          elemnt.hospitalId = this.currentUser.hospitalId;
          elemnt.assetDetailId = this.assetId;
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
        this.ref.close();
      }
      else {
        this.display = true;
        this.ref.close();
      }
      // });
    },
      error => {
        this.errorDisplay = true;
        if (this.lang == 'en') {
          if (error.error.status == 'code') {
            this.errorMessage = error.error.message;
          }
          if (error.error.status == 'name') {
            this.errorMessage = error.error.message;
          }
        } else {
          if (error.error.status == 'code') {
            this.errorMessage = error.error.messageAr;
          }
          if (error.error.status == 'name') {
            this.errorMessage = error.error.messageAr;
          }
        }
        return false;
      }
    );



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
  uploadMultipleFile = (event: any) => {
    const files: FileList = event.target.files;
    if (files.length === 0) {
      return;
    }
    else {
      for (var i = 0; i < files.length; i++) {
        let fileToUpload = <File>files[i];
        var assetDetailDocument = new CreateAssetDetailAttachmentVM();
        this.formData.append('file', fileToUpload, fileToUpload.name);
        assetDetailDocument.fileName = fileToUpload.name;
        assetDetailDocument.assetFile = fileToUpload;
        assetDetailDocument.title = fileToUpload.name.split('.')[0];
        this.lstAssetDetailDocument.push(assetDetailDocument);
      }
      this.addMultiFilesToList();
    }
  }
  addMultiFilesToList() {
    this.lstAssetDetailDocument.forEach((element, index) => {
      element.assetDetailId = Number(this.assetId);
      if (this.itmIndex.length === 0) {
        last_element = 1;
      }
      else if (this.itmIndex.length > 0) {
        var last_element = this.itmIndex[this.itmIndex.length - 1];
        last_element = last_element + 1;
      }
      this.itmIndex.push(last_element);
      let ext = element.fileName.split('.').pop();
      var hCode = this.pad(this.currentUser.hospitalCode, 4);
      var srCode = this.pad(this.assetObj.code, 10);
      var last = this.itmIndex[this.itmIndex.length - 1];
      let newIndex = this.pad((last).toString(), 2);
      let SRFileName = hCode + "HA" + srCode + newIndex;
      element.fileName = SRFileName + "." + ext;
      element = { fileName: '', assetDetailId: 0, title: '', assetFile: File, hospitalId: 0 };
    });
  }
  removeFileFromObjectArray(rowIndex) {
    let newIndex;
    if (rowIndex >= 0 && rowIndex < this.lstAssetDetailDocument.length) {
      this.lstAssetDetailDocument.splice(rowIndex, 1);

      this.lstAssetDetailDocument.forEach((element, index) => {
        element.assetDetailId = Number(this.assetId);
        if (this.itmIndex.length === 0) {
          last_element = 1;
        }
        else if (this.itmIndex.length > 0 && this.lstAssetDetailDocument.length == 0) {
          var last_element = this.itmIndex[this.itmIndex.length - 1];
          last_element = last_element + 1;
        }
        else if (this.itmIndex.length > 0 && this.lstAssetDetailDocument.length > 0) {
          const incrementedIndex = index + 1;
          newIndex = this.pad((incrementedIndex).toString(), 2);
        }
        this.itmIndex.push(last_element);
        let ext = element.fileName.split('.').pop();
        var hCode = this.pad(this.currentUser.hospitalCode, 4);
        var srCode = this.pad(this.assetObj.code, 10);
        let SRFileName = hCode + "HA" + srCode + newIndex;
        element.fileName = SRFileName + "." + ext;
        element = { fileName: '', assetDetailId: 0, title: '', assetFile: File, hospitalId: 0 };
      });

    }
  }
  pad(num: string, size: number): string {
    while (num.length < size) num = "0" + num;
    return num;
  }
  onSelectionChanged(event) {
    // this.masterAssetService.AutoCompleteMasterAssetName2(event.query).subscribe(masters => {
    //   this.lstMasterAssets = masters;
    //   if (this.lang == "en") {
    //     this.lstMasterAssets.forEach(item => item.name = item.name + " - " + item.model + " - " + item.brandName);
    //   }
    //   else {
    //     this.lstMasterAssets.forEach(item => item.name = item.nameAr + " - " + item.model + " - " + item.brandNameAr);
    //   }
    // });

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

  assetName:string;
  getObject(event) {
    this.assetObj.masterAssetId = event["id"];

     this.assetName = this.lang == "en" ? event["name"] : event["nameAr"];






    this.masterAssetService.GetDistintMasterAssetBrands(this.assetName).subscribe(brands => {
      this.lstBrands = brands;
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
      this.lstSuppliers = [];
      this.supplierService.GetSuppliers().subscribe(suppliers => {
        this.lstSuppliers = suppliers;
        this.assetObj.supplierId = res;
      });
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
      this.hospitalService.GetHospitalDepartmentByHospitalId2(this.currentUser.hospitalId).subscribe(hospitaldeparts => {
        this.lstHospitalDepartments = hospitaldeparts;
      });
      if (this.lstHospitalDepartments != null || this.lstHospitalDepartments.length != 0) {
        this.hospitalService.GetSelectedHospitalDepartmentByDepartmentId(this.currentUser.hospitalId, res).subscribe(department => {
          this.assetObj.departmentId = res;
          //  this.assetObj.departmentId = department["departmentId"];
        });
      }
    });
  }

  getModel($event){
    this.masterAssetService.GetDistintMasterAssetModels($event.target.value,  this.assetName ).subscribe(models => {
      this.lstModels = models;
    });
  }
}
