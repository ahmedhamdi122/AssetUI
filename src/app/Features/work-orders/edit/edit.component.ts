import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IndexAssetWorkOrderTaskVM } from 'src/app/Shared/Models/AssetWorkOrderTaskVM';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListEmployeeVM } from 'src/app/Shared/Models/employeeVM';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { ListRequestVM } from 'src/app/Shared/Models/requestModeVM';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { CreateWorkOrderAttachmentVM, IndexWorkOrderAttachmentVM } from 'src/app/Shared/Models/WorkOrderAttachmentVM';
import { IndexWorkOrderPeriorityVM } from 'src/app/Shared/Models/WorkOrderPeriorityVM';
import { ListWorkOrderStatusVM } from 'src/app/Shared/Models/WorkOrderStatusVM';
import { CreateWorkOrderTrackingVM, IndexWorkOrderTrackingVM } from 'src/app/Shared/Models/WorkOrderTrackingVM';
import { IndexWorkOrderTypeVM } from 'src/app/Shared/Models/WorkOrderTypeVM';
import { EditWorkOrderVM, IndexWorkOrderVM } from 'src/app/Shared/Models/WorkOrderVM';
import { AssetWorkOrderTaskService } from 'src/app/Shared/Services/asset-work-order-task.service';
import { CityService } from 'src/app/Shared/Services/city.service';
import { EmployeeService } from 'src/app/Shared/Services/employee.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { RequestService } from 'src/app/Shared/Services/request.service';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { WorkOrderAttachmentService } from 'src/app/Shared/Services/work-order-attachment.service';
import { WorkOrderPeriorityService } from 'src/app/Shared/Services/work-order-periority.service';
import { WorkOrderStatusService } from 'src/app/Shared/Services/work-order-status.service';
import { WorkOrderTrackingService } from 'src/app/Shared/Services/work-order-tracking.service';
import { WorkOrderTypeService } from 'src/app/Shared/Services/work-order-type.service';
import { WorkOrderService } from 'src/app/Shared/Services/work-order.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  lang = localStorage.getItem('lang');


  currentUser: LoggedUser;
  lstWorkOrderPeriority: IndexWorkOrderPeriorityVM[]
  lstWorkOrderType: IndexWorkOrderTypeVM[]
  serviceRequestId: number;
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  tracksFormGroup: FormGroup;
  editWorkOrderObj: EditWorkOrderVM;
  requestObj: ListRequestVM;
  lstTracks: IndexWorkOrderTrackingVM[] = [];
  lstDocuments: IndexWorkOrderAttachmentVM[] = [];
  //lstTasks: IndexAssetWorkOrderTaskVM[] = [];
  lstTasks: IndexAssetWorkOrderTaskVM[] = [];



  isShowFiles: boolean = false;
  creatWorkOrderTrackingObj: CreateWorkOrderTrackingVM;
  lstEngEmployees: ListEmployeeVM[] = [];
  isClosed: boolean = false;
  isDisabled: boolean = false;
  isAdminDisabled: boolean = false;
  lstWOStatus: ListWorkOrderStatusVM[] = [];
  display: boolean = false;
  errorMessage: string;
  errorDisplay: boolean = false;
  WorkOrderObj: IndexWorkOrderVM
  disabledButton: boolean = false;
  IsSaveProject: boolean = false;
  workOrderId: number = 0;
  isShowDocs: boolean = false;


  CreateWorkOrderAttachmentObj: CreateWorkOrderAttachmentVM
  workOrderTrackingId: number
  lstCreateWorkOrderTracking: CreateWorkOrderAttachmentVM[] = [];
  lstSaveCreateWorkOrderTracking: CreateWorkOrderAttachmentVM[] = [];

  isAdmin: boolean = false;
  lstGovernorates: ListGovernorateVM[];
  lstCities: ListCityVM[];
  lstOrganizations: ListOrganizationVM[];
  lstSubOrganizations: ListSubOrganizationVM[];
  lstHospitals: ListHospitalVM[] = [];
  hospitalId: number;

  CreateWorkOrderattach: CreateWorkOrderAttachmentVM
  lstAttachmentFiles: IndexWorkOrderAttachmentVM[] = [];
  minplannedStartDate: Date = new Date();
  minActualStartDate: Date = new Date();
  plannedStartDate: any;
  ActualStartDate: any;
  planndedEndDate: any;
  ActualEndDate: any;
  minDate: Date;
  requestId: number;

  isAdminRole: boolean = false;
  isEngManager: boolean = false;
  isEng: boolean = false;
  lstRoleNames: string[] = [];

  startDateTime: Date;// = new Date(2021, 11, 7, 23, 59, 59, 0); // YYYY (M-1) D H m s ms (start time and date from DB)
  startStamp: number;
  newDate: Date = new Date();
  newStamp = this.newDate.getTime();
  timer; // for storing the interval (to stop or pause later if needed)

  itmIndex: any[] = [];

  statusId: number = 0;


  constructor(
    private authenticationService: AuthenticationService,
    private config: DynamicDialogConfig, private activeRoute: ActivatedRoute, private workOrderType: WorkOrderTypeService
    , private workOrderPeriorityService: WorkOrderPeriorityService, private _formBuilder: FormBuilder, private workOrderservice: WorkOrderService,
    private messageService: MessageService, private router: Router, private workOrderTrackingService: WorkOrderTrackingService,
    private uploadService: UploadFilesService, private httpClient: HttpClient, private workOrderStatusService: WorkOrderStatusService,
    private requestService: RequestService, private employeeService: EmployeeService, private datePipe: DatePipe, private assetWorkOrderTaskService: AssetWorkOrderTaskService,
    private workOrderAttachmentService: WorkOrderAttachmentService,
    private organizationService: OrganizationService,
    private subOrganizationService: SubOrganizationService,
    private cityService: CityService,
    private governorateService: GovernorateService,
    private hospitalService: HospitalService,
    private ref: DynamicDialogRef,
    public datepipe: DatePipe) {
    this.currentUser = this.authenticationService.currentUserValue;
  }


  onLoad() {
    this.minDate = new Date();
    this.editWorkOrderObj = {
      workOrderTypeName: '', workOrderTypeNameAr: '',
      id: 0, workOrderStatusId: 0, workOrderTrackingId: 0, masterAssetId: 0, hospitalId: 0, cityId: 0, governorateId: 0,
      organizationId: 0, subOrganizationId: 0, periorityName: '', periorityNameAr: '', typeName: '', typeNameAr: '',
      actualEndDate: new Date, actualStartDate: new Date, plannedEndDate: new Date, plannedStartDate: new Date, barCode: '',
      createdById: '', requestId: 0, subject: '', creationDate: new Date, note: '', workOrderNumber: '', workOrderPeriorityId: 0, workOrderTypeId: 0
    }
    this.creatWorkOrderTrackingObj = {
      id: 0, notes: '', createdById: '', creationDate: '', workOrderDate: new Date, workOrderId: 0, workOrderStatusId: 1, assignedTo: '',
      actualEndDate: '', actualStartDate: '', plannedStartDate: '', plannedEndDate: '', hospitalId: 0, strWorkOrderDate: ''
    }
    this.CreateWorkOrderAttachmentObj = { documentName: '', fileName: '', workOrderTrackingId: 0, workOrderFile: File, hospitalId: 0 }
    this.CreateWorkOrderattach = { documentName: '', fileName: '', workOrderTrackingId: 0, workOrderFile: File, hospitalId: 0 }

    this.workOrderStatusService.GetWorkOrderStatuss().subscribe((res) => {
      this.lstWOStatus = res;
    });


    this.workOrderType.GetWorkOrderTypes().subscribe(
      res => {
        this.lstWorkOrderType = res
      });

    this.workOrderPeriorityService.GetWorkOrderPerioritys().subscribe(
      res => {
        this.lstWorkOrderPeriority = res
      });

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.thirdFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });



    this.governorateService.GetGovernorates().subscribe((items) => {
      this.lstGovernorates = items;
    });

    this.organizationService.GetOrganizations().subscribe((items) => {
      this.lstOrganizations = items;
    });



    if (this.config.data != null || this.config.data != undefined) {
      let statusId = this.config.data.statusId;
      if (statusId != undefined) {
        this.statusId = statusId;
      }
    }
    else {
      this.statusId = 0;
    }



  }


  getDocuments(trackid: number) {
    this.workOrderAttachmentService.GetWorkOrderAttachmentsByWorkOrderTrackingId(trackid).subscribe(lstdocs => {
      this.lstDocuments = lstdocs;
    });
    this.isShowFiles = true;
  }

  GetActualStartDate($event) {
    this.ActualStartDate = $event.target.value;
  }
  GetActualEndDate($event) {
    this.ActualEndDate = $event.target.value;
  }


  getCitiesByGovId($event) {
    this.cityService.GetCitiesByGovernorateId($event.target.value).subscribe((cities) => {
      this.lstCities = cities;
    });
  }

  getSubOrgByOrgId($event) {
    this.subOrganizationService.GetSubOrganizationByOrgId($event.target.value).subscribe(suborgs => {
      this.lstSubOrganizations = suborgs;
    });
  }
  getHospitalsBySubOrgId($event) {
    this.hospitalService
      .GetHospitalsBySubOrganizationId($event.target.value)
      .subscribe((hospitals) => {
        this.lstHospitals = hospitals;
      });
  }
  getHospitalId($event) {
    this.hospitalId = $event.target.value;
    this.employeeService
      .GetEmployeesHasEngRoleInHospital(this.hospitalId)
      .subscribe((lstemployees) => {
        this.lstEngEmployees = lstemployees;
      });
  }

  ngOnInit(): void {

    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });

      this.isEng = (['Eng'].some(r => this.lstRoleNames.includes(r)));
      this.isEngManager = (['EngDepManager'].some(r => this.lstRoleNames.includes(r)));
      this.isAdminRole = (['Admin'].some(r => this.lstRoleNames.includes(r)));
    }


    this.onLoad();
    this.workOrderId = this.config.data.id;
    this.workOrderservice.GetWorkOrderById(this.workOrderId).subscribe(woObj => {
      this.editWorkOrderObj = woObj;


      let woDate = new Date(this.editWorkOrderObj.creationDate);
      this.startDateTime = new Date(woDate.getFullYear(), woDate.getMonth(), woDate.getDate() - 1, woDate.getHours(), woDate.getMinutes(), 0)
      this.startStamp = this.startDateTime.getTime();

      if (this.lang == "en") {
        this.timer = window.setInterval(() => {
          this.updateClock()
        }, 1000);
      }
      else {
        this.timer = window.setInterval(() => {
          this.updateClockInArabic()
        }, 1000);
      }


      if (this.isAdminRole) {
        this.isAdminDisabled = true;
        this.hospitalService.GetHospitals().subscribe(lst => {
          this.lstHospitals = lst;
        });
        this.editWorkOrderObj.hospitalId = woObj.hospitalId;
        this.hospitalService.GetSubOrganizationsByHospitalId(woObj.hospitalId).subscribe(items => {
          this.lstSubOrganizations = items;
        });
        this.hospitalService.GetHospitalById(woObj.hospitalId).subscribe(item => {
          this.editWorkOrderObj.subOrganizationId = item["subOrganizationId"];
          this.editWorkOrderObj.organizationId = item["organizationId"];
          this.editWorkOrderObj.governorateId = item["governorateId"];
          this.cityService.GetCitiesByGovernorateId(Number(item["governorateId"])).subscribe(cities => {
            this.lstCities = cities;
          });
          this.editWorkOrderObj.cityId = item["cityId"];
          this.editWorkOrderObj.hospitalId = item["id"];
        });
      }
      this.requestService.GetRequestByWorkOrderId(this.workOrderId).subscribe(reqObj => { this.requestObj = reqObj });
      this.assetWorkOrderTaskService.GetAllAssetWorkOrderTasksByMasterAssetId(this.editWorkOrderObj.masterAssetId).subscribe(
        res => {
          this.lstTasks = res
        });
      this.workOrderTrackingService.GetTrackOfWorkOrderByWorkOrderId(woObj.id).subscribe(tracks => {
        this.lstTracks = tracks;
        //  var count = this.lstTracks.filter(x => x.workOrderStatusId == 6).length;

        var count = this.lstTracks.length;
        if (count > 1) {
          this.isClosed = false;
          this.isDisabled = true;
        }
        else {
          this.isClosed = true;
          this.isDisabled = false;
        }
      });


    });

    if (this.currentUser.hospitalId > 0) {
      if (this.isEngManager) {
        this.employeeService
          .GetEmployeesHasEngDepManagerRoleInHospital(this.currentUser.hospitalId)
          .subscribe((lstemployees) => {
            this.lstEngEmployees = lstemployees;
          });
      }
      if (this.isEng) {
        this.employeeService
          .GetEmployeesHasEngRoleInHospital(this.currentUser.hospitalId)
          .subscribe((lstemployees) => {
            this.lstEngEmployees = lstemployees;
          });
      }

    }

    else {
      this.isAdmin = true;
    }

  }

  AddworkOrder() {

    if (this.creatWorkOrderTrackingObj.assignedTo == "") {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select person to assigned engineer";
      } else {
        this.errorMessage = "من فضلك اختر المهندس المختص بالصيانة";
      }

      return false;
    }

    else {
      this.creatWorkOrderTrackingObj.createdById = this.currentUser.id;
      this.creatWorkOrderTrackingObj.hospitalId = this.currentUser.hospitalId;
      this.creatWorkOrderTrackingObj.workOrderId = Number(this.workOrderId);
      this.creatWorkOrderTrackingObj.actualStartDate = this.datePipe.transform(this.creatWorkOrderTrackingObj.actualStartDate, "yyyy-MM-dd HH:mm:ss");
      this.creatWorkOrderTrackingObj.actualEndDate = this.datePipe.transform(this.creatWorkOrderTrackingObj.actualEndDate, "yyyy-MM-dd HH:mm:ss");
      this.workOrderTrackingService.CreateWorkOrderTracking(this.creatWorkOrderTrackingObj)
        .subscribe(trackId => {
          this.workOrderTrackingId = trackId;

          this.display = true;
          this.isShowDocs = true;
          this.ref.close();
        });
    }
  }
  closeWorkOrder() {
    this.creatWorkOrderTrackingObj.createdById = this.currentUser.id;
    this.creatWorkOrderTrackingObj.workOrderId = Number(this.workOrderId);
    this.creatWorkOrderTrackingObj.actualStartDate = this.datePipe.transform(new Date, "dd-MM-yyyy HH:mm:ss");
    this.creatWorkOrderTrackingObj.actualEndDate = this.datePipe.transform(new Date, "dd-MM-yyyy HH:mm:ss");
    this.creatWorkOrderTrackingObj.workOrderStatusId = 6;
    this.workOrderTrackingService.CreateWorkOrderTracking(this.creatWorkOrderTrackingObj)
      .subscribe((res) => {
        this.display = true;
      });
  }

  EditworkOrder() {
    this.editWorkOrderObj.hospitalId = this.currentUser.hospitalId;
    this.workOrderservice.UpdateWorkOrder(this.editWorkOrderObj).subscribe(
      res => {
        // this.WorkOrderId = res
        //   this.display = true;
      }
    )
  }

  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    this.CreateWorkOrderAttachmentObj.fileName = fileToUpload.name;
    this.httpClient.post(environment.uploadWorkOrderDcouments, formData)
      .subscribe(res => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Uploaded Successfully' });
      });
  }
  Savedoctolist() {
    if (this.CreateWorkOrderAttachmentObj.documentName != "" && this.CreateWorkOrderAttachmentObj.fileName != "") {
      this.CreateWorkOrderAttachmentObj.workOrderTrackingId = Number(this.workOrderTrackingId);
      this.CreateWorkOrderAttachmentObj.hospitalId = this.currentUser.hospitalId;
      let ext = this.CreateWorkOrderAttachmentObj.fileName.split('.').pop();
      let lastdocumentName = "";
      let imageIndex = "";

      if (this.itmIndex.length == 0) {
        this.workOrderAttachmentService.GetLastDocumentForWorkOrderTrackingId(Number(this.workOrderTrackingId)).subscribe(lastDoc => {
          lastdocumentName = lastDoc.fileName;
          if (lastdocumentName == null) {

            var last_element = 1;
            this.itmIndex.push(last_element);
            let ext = this.CreateWorkOrderAttachmentObj.fileName.split('.').pop();
            var hCode = this.pad(this.currentUser.hospitalCode, 4);
            var srCode = this.pad(this.WorkOrderObj.workOrderNumber, 10);
            let newIndex = this.pad((last_element).toString(), 2);
            let WOFileName = hCode + "WO" + srCode + newIndex;
            this.CreateWorkOrderAttachmentObj.fileName = WOFileName + "." + ext;
          }
          else if (lastdocumentName != "") {
            imageIndex = lastdocumentName.split('.').slice(0, -1).join('.');
            imageIndex = imageIndex.substring(imageIndex.length - 2);
            this.itmIndex.push(imageIndex);

            var newImageIndex = parseInt(imageIndex) + 1;
            this.itmIndex.push(newImageIndex);

            var hCode = this.pad(this.currentUser.hospitalCode, 4);
            var srCode = this.pad(this.WorkOrderObj.workOrderNumber, 10);
            var last = this.itmIndex[this.itmIndex.length - 1];
            let newIndex = this.pad((last).toString(), 2);
            let woRFileName = hCode + "WO" + srCode + newIndex + "." + ext;
            this.CreateWorkOrderAttachmentObj.fileName = woRFileName;

          }
          else if (lastdocumentName == "") {

            var last_element = 1;
            this.itmIndex.push(last_element);
            let ext = this.CreateWorkOrderAttachmentObj.fileName.split('.').pop();
            var hCode = this.pad(this.currentUser.hospitalCode, 4);
            var srCode = this.pad(this.WorkOrderObj.workOrderNumber, 10);
            let newIndex = this.pad((last_element).toString(), 2);
            let WOFileName = hCode + "WO" + srCode + newIndex;
            this.CreateWorkOrderAttachmentObj.fileName = WOFileName + "." + ext;
          }
          this.lstCreateWorkOrderTracking.push(this.CreateWorkOrderAttachmentObj);
          this.CreateWorkOrderAttachmentObj = { fileName: '', workOrderTrackingId: 0, documentName: '', workOrderFile: File, hospitalId: 0 };

        });
      }
      else if (this.itmIndex.length > 0) {
        var last_element = this.itmIndex[this.itmIndex.length - 1];
        last_element = parseInt(last_element) + 1;
        this.itmIndex.push(last_element);

        var hCode = this.pad(this.currentUser.hospitalCode, 4);
        var srCode = this.pad(this.WorkOrderObj.workOrderNumber, 10);
        let newIndex = this.pad((last_element).toString(), 2);
        let SRFileName = hCode + "WO" + srCode + newIndex;
        this.CreateWorkOrderAttachmentObj.fileName = SRFileName + "." + ext;
        this.lstCreateWorkOrderTracking.push(this.CreateWorkOrderAttachmentObj);
        this.CreateWorkOrderAttachmentObj = { fileName: '', workOrderTrackingId: 0, documentName: '', workOrderFile: File, hospitalId: 0 };
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
  SaveimageToDB() {
    this.workOrderAttachmentService.addListWorkOrderAttachments(this.lstCreateWorkOrderTracking).subscribe(e => {
      if (this.lang == "en") {
        this.messageService.add({ key: 'files', severity: 'success', summary: 'Success', detail: 'Files added successfully' });
      }
      else {
        this.messageService.add({ key: 'files', severity: 'نجاح الحفظ', summary: 'نجاح الحفظ', detail: 'تم رفع الملفات بنجاح' });
      }

    });
  }
  pad(num: string, size: number): string {
    while (num.length < size) num = "0" + num;
    return num;
  }


  CloseStipper() {
    this.router.navigate(['dash/workOrders/', this.serviceRequestId]);
  }



  downloadFile(fileName) {
    var filePath = `${environment.Domain}UploadedAttachments/`;
    this.uploadService.downloadWorkOrderFile(fileName).subscribe(file => {
      var dwnldFile = filePath + 'WorkOrderFiles/' + fileName;
      if (fileName != "" || fileName != null)
        window.open(dwnldFile);
    })
  }


  updateClock() {
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


    document.getElementById("time-elapsed").innerHTML = d + " day(s), " + h + " hour(s), " + m + " minute(s), " + s + " second(s)";
  }

  updateClockInArabic() {
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
    document.getElementById("time-elapsed").innerHTML = d + " يوم ، " + h + " ساعة ، " + m + " دقيقة ، " + s + " ثانية";
  }
  close() {
    this.ref.close({ data: this.statusId });
  }
}
