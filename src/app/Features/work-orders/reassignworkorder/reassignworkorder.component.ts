import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateAssetWorkOrderTaskVM, IndexAssetWorkOrderTaskVM } from 'src/app/Shared/Models/AssetWorkOrderTaskVM';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListEmployees, ListEmployeeVM } from 'src/app/Shared/Models/employeeVM';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { CreateRequestTracking, RequestDetails } from 'src/app/Shared/Models/RequestTrackingVM';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { CreateWorkOrderAssignVM } from 'src/app/Shared/Models/WorkOrderAssignVM';
import { CreateWorkOrderAttachmentVM } from 'src/app/Shared/Models/WorkOrderAttachmentVM';
import { IndexWorkOrderPeriorityVM } from 'src/app/Shared/Models/WorkOrderPeriorityVM';
import { ListWorkOrderStatusVM } from 'src/app/Shared/Models/WorkOrderStatusVM';
import { CreateTasks, CreateWorkOrderTaskVM } from 'src/app/Shared/Models/WorkOrderTaskVM';
import { CreateWorkOrderTrackingVM, IndexWorkOrderTrackingVM } from 'src/app/Shared/Models/WorkOrderTrackingVM';
import { IndexWorkOrderTypeVM } from 'src/app/Shared/Models/WorkOrderTypeVM';
import { CreateWorkOrderVM, IndexWorkOrderVM } from 'src/app/Shared/Models/WorkOrderVM';
import { EmployeeService } from 'src/app/Shared/Services/employee.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { RequestTrackingService } from 'src/app/Shared/Services/request-tracking.service';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { WorkOrderAttachmentService } from 'src/app/Shared/Services/work-order-attachment.service';
import { WorkOrderStatusService } from 'src/app/Shared/Services/work-order-status.service';
import { WorkOrderTrackingService } from 'src/app/Shared/Services/work-order-tracking.service';
import { WorkOrderService } from 'src/app/Shared/Services/work-order.service';
@Component({
  selector: 'app-reassignworkorder',
  templateUrl: './reassignworkorder.component.html',
  styleUrls: ['./reassignworkorder.component.css']
})
export class ReassignworkorderComponent implements OnInit {

  lang = localStorage.getItem('lang');
  textDir: string = 'ltr';
  errorMessage: string;
  errorDisplay: boolean = false;

  currentUser: LoggedUser;
  createdById: LoggedUser;
  lstWorkOrderPeriority: IndexWorkOrderPeriorityVM[] = [];
  lstWorkOrderType: IndexWorkOrderTypeVM[] = [];
  lstWOStatus: ListWorkOrderStatusVM[] = [];
  lstEngEmployees: ListEmployeeVM[] = [];
  requestDetailObj: RequestDetails;
  woTaskObj: CreateAssetWorkOrderTaskVM;
  lstWOTasks: CreateAssetWorkOrderTaskVM[] = [];

  createTaskObj: CreateTasks;
  lstAssetWorkOrderTask: IndexAssetWorkOrderTaskVM[] = [];
  lstSelectedCreateTasks: IndexAssetWorkOrderTaskVM[] = [];
  lstSelectedCreateComments: CreateTasks[] = [];
  lstSaveTasks: CreateTasks[] = [];
  saveTasksObj: CreateWorkOrderTaskVM;
  selectedItem: string;
  masterAssetId: number;
  serviceRequestId: number;
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  createWorkOrderObj: CreateWorkOrderVM;
  disabledButton: boolean;
  IsSaveProject: boolean;
  creatWorkOrderTrackingObj: CreateWorkOrderTrackingVM;
  createWorkOrderAssignVM: CreateWorkOrderAssignVM;
  createRequestTrackingObj: CreateRequestTracking;
  isAdmin: boolean = false;
  statusId: number;
  lstGovernorates: ListGovernorateVM[];
  lstCities: ListCityVM[];
  lstOrganizations: ListOrganizationVM[];
  lstSubOrganizations: ListSubOrganizationVM[];
  lstHospitals: ListHospitalVM[] = [];
  statusName: string;
  hospitalId: number;
  workOrderId: number;
  CreateWorkOrderAttachmentObj: CreateWorkOrderAttachmentVM;
  workOrderTrackingObj: CreateWorkOrderTrackingVM;
  lstRadioItems: string[];
  workOrderObj: IndexWorkOrderVM;
  lstWorkOrderTracks: IndexWorkOrderTrackingVM[] = [];
  lstCreateWorkOrderTracking: CreateWorkOrderAttachmentVM[] = [];
  lstUsers: ListEmployees[] = [];
  minDate: Date;
  plannedStartdate: any;
  actualStartDate: any;
  display: boolean = false;
  isHide: boolean = false;
  isAssigned: boolean = false;
  isReviewed: boolean = false;

  isDisabled: boolean = false;
  assignedEngTo: string = '';
  selectedStatus: string = '';
  employeeObj: ListEmployeeVM;
  itmIndex: any[] = [];
  constructor(
    private authenticationService: AuthenticationService,
    private _formBuilder: FormBuilder,
    private workOrderservice: WorkOrderService,
    private messageService: MessageService,
    private workOrderTrackingService: WorkOrderTrackingService,
    private requestTrackingService: RequestTrackingService,
    private config: DynamicDialogConfig, private ref: DynamicDialogRef,
    private employeeService: EmployeeService,
    private organizationService: OrganizationService,
    private governorateService: GovernorateService,
    private workOrderAttachmentService: WorkOrderAttachmentService,
    private datePipe: DatePipe, private uploadService: UploadFilesService,
    private workOrederStatusService: WorkOrderStatusService) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    this.onLoad();
    this.serviceRequestId = this.config.data.requestId;
    this.statusId = this.config.data.statusId;
    this.workOrderId = this.config.data.workOrderId;
    if (this.lang == "en")
      this.lstRadioItems = ["Reassign", "Reviewed"];

    if (this.lang == "ar")
      this.lstRadioItems = ["إعادة أوامر شغل", "مراجعة"];
    if (this.lang == "en")
      this.selectedItem = "Reassign";
    else
      this.selectedItem = "إعادة أوامر شغل";
    this.isAssigned = true;
    this.workOrederStatusService.GetWorkOrderStatusById(this.statusId).subscribe(stsName => {
      this.statusName = this.lang == "en" ? stsName.name : stsName.nameAr
    })
    if (this.currentUser.hospitalId > 0) {
      this.workOrderservice.GetWorkOrderById(this.workOrderId).subscribe(woObj => {
        this.workOrderObj = woObj;
        this.workOrderTrackingService.GetAllWorkOrderTrackingByWorkOrderId(this.workOrderId).subscribe(tracks => {
          this.lstWorkOrderTracks = tracks;
        });
      });
      this.employeeService
        .GetEmployeesHasEngRoleInHospital(this.currentUser.hospitalId)
        .subscribe((lstemployees) => {
          this.lstEngEmployees = lstemployees;
          this.creatWorkOrderTrackingObj.assignedTo = this.currentUser.id;
        });
    }
    else {
      this.isAdmin = true;
      this.governorateService.GetGovernorates().subscribe((items) => {
        this.lstGovernorates = items;
      });
      this.organizationService.GetOrganizations().subscribe((items) => {
        this.lstOrganizations = items;
      });
      this.requestTrackingService
        .GetById(this.serviceRequestId)
        .subscribe((res) => {
          this.requestDetailObj = res;
        });
    }

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
  onLoad() {
    this.createWorkOrderAssignVM = { createdBy: '', createdDate: new Date, notes: '', supplierId: 0, userId: '', wOTId: 0 }
    this.minDate = new Date();
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });
    this.thirdFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required],
    });

    this.disabledButton = false;
    this.IsSaveProject = false;
    this.lstCreateWorkOrderTracking = [];



    this.creatWorkOrderTrackingObj = { id: 0, hospitalId: 0, notes: '', createdById: '', creationDate: '', workOrderDate: new Date(), workOrderId: 0, workOrderStatusId: 0, assignedTo: '', actualEndDate: '', actualStartDate: '', plannedStartDate: '', plannedEndDate: '', strWorkOrderDate: '' };
    this.CreateWorkOrderAttachmentObj = { documentName: '', fileName: '', workOrderTrackingId: 0, workOrderFile: File, hospitalId: 0 };

  }
  onItemChange($event) {
    if ($event.value == "Reassign" || $event.value == "إعادة أوامر شغل") {
      this.isAssigned = true;
      this.isReviewed = false;
    }
    if ($event.value == "Reviewed" || $event.value == "مراجعة") {
      this.isAssigned = false;
      this.isReviewed = true;
    }
    this.selectedItem = $event.value;
  }
  getHospitalId($event) {
    this.hospitalId = $event.target.value;
    this.employeeService
      .GetEmployeesHasEngRoleInHospital(this.hospitalId)
      .subscribe((lstemployees) => {
        this.lstEngEmployees = lstemployees;
      });
  }
  AddworkOrderTrack() {
    if (this.selectedItem == "Reassign" || this.selectedItem == "إعادة أوامر شغل") {

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
        this.creatWorkOrderTrackingObj.creationDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
        this.creatWorkOrderTrackingObj.strWorkOrderDate = this.datePipe.transform(this.creatWorkOrderTrackingObj.actualStartDate, "yyyy-MM-dd HH:mm:ss");
        this.creatWorkOrderTrackingObj.actualStartDate = this.datePipe.transform(this.creatWorkOrderTrackingObj.actualStartDate, "yyyy-MM-dd HH:mm:ss");
        this.creatWorkOrderTrackingObj.actualEndDate = this.datePipe.transform(this.creatWorkOrderTrackingObj.actualEndDate, "yyyy-MM-dd HH:mm:ss");
        this.creatWorkOrderTrackingObj.plannedStartDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
        this.creatWorkOrderTrackingObj.plannedEndDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
        this.creatWorkOrderTrackingObj.createdById = this.currentUser.id;
        this.creatWorkOrderTrackingObj.notes = this.creatWorkOrderTrackingObj.notes;
        this.creatWorkOrderTrackingObj.workOrderId = Number(this.workOrderId);
        this.creatWorkOrderTrackingObj.workOrderStatusId = 9;
        this.creatWorkOrderTrackingObj.assignedTo = this.currentUser.id;
        this.creatWorkOrderTrackingObj.hospitalId = this.currentUser.hospitalId;
        this.creatWorkOrderTrackingObj.notes = "re-assign";
        this.workOrderTrackingService.AddWorkOrderTracking(this.creatWorkOrderTrackingObj)
          .subscribe((res) => {
            this.workOrderId = res;
            this.display = true;
            this.isDisabled = true;
          });
      }
    }
    if (this.selectedItem == "Reviewed" || this.selectedItem == "مراجعة") {


      this.creatWorkOrderTrackingObj.strWorkOrderDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.creatWorkOrderTrackingObj.creationDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.creatWorkOrderTrackingObj.actualStartDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.creatWorkOrderTrackingObj.actualEndDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.creatWorkOrderTrackingObj.plannedStartDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.creatWorkOrderTrackingObj.plannedEndDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.creatWorkOrderTrackingObj.createdById = this.currentUser.id;
      this.creatWorkOrderTrackingObj.notes = this.creatWorkOrderTrackingObj.notes;
      this.creatWorkOrderTrackingObj.assignedTo = this.currentUser.id;
      this.creatWorkOrderTrackingObj.workOrderId = Number(this.workOrderId);
      this.creatWorkOrderTrackingObj.workOrderStatusId = 10;
      this.creatWorkOrderTrackingObj.hospitalId = this.currentUser.hospitalId;
      this.creatWorkOrderTrackingObj.notes = "Technical Approve";
      this.workOrderTrackingService.AddWorkOrderTracking(this.creatWorkOrderTrackingObj)
        .subscribe((res) => {
          this.workOrderId = res;
          this.display = true;
          this.isDisabled = true;
        });
    }
  }
  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    this.CreateWorkOrderAttachmentObj.fileName = fileToUpload.name;
    this.CreateWorkOrderAttachmentObj.workOrderFile = fileToUpload;
    this.addFilesToList();

  };
  addFilesToList() {

    if (this.CreateWorkOrderAttachmentObj.documentName != "" && this.CreateWorkOrderAttachmentObj.fileName != "") {
      this.CreateWorkOrderAttachmentObj.workOrderTrackingId = Number(this.workOrderId);
      this.CreateWorkOrderAttachmentObj.hospitalId = this.currentUser.hospitalId;

      let ext = this.CreateWorkOrderAttachmentObj.fileName.split('.').pop();
      let lastdocumentName = "";
      let imageIndex = "";

      if (this.itmIndex.length == 0) {
        this.workOrderAttachmentService.GetLastDocumentForWorkOrderTrackingId(Number(this.workOrderTrackingObj)).subscribe(lastDoc => {
          lastdocumentName = lastDoc.fileName;
          if (lastdocumentName == null) {

            var last_element = 1;
            this.itmIndex.push(last_element);
            let ext = this.CreateWorkOrderAttachmentObj.fileName.split('.').pop();
            var hCode = this.pad(this.currentUser.hospitalCode, 4);
            var srCode = this.pad(this.workOrderObj.workOrderNumber, 10);
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
            var srCode = this.pad(this.workOrderObj.workOrderNumber, 10);
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
            var srCode = this.pad(this.workOrderObj.workOrderNumber, 10);
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
        var srCode = this.pad(this.workOrderObj.workOrderNumber, 10);
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
    this.lstCreateWorkOrderTracking.forEach((item, index) => {
      item.hospitalId = this.currentUser.hospitalId;
      this.workOrderservice.CreateWorkOrderAttachments(item).subscribe(fileObj => {
        this.uploadService.uploadWorkOrderFiles(item.workOrderFile, item.fileName).subscribe(
          (event) => {
            if (this.lang == "en") {
              this.messageService.add({ key: 'files', severity: 'success', summary: 'Success', detail: 'Files added successfully' });
            }
            else {
              this.messageService.add({ key: 'files', severity: 'نجاح الحفظ', summary: 'نجاح الحفظ', detail: 'تم رفع الملفات بنجاح' });
            }
          },
          (err) => {

            if (this.lang == "en") {
              this.errorDisplay = true;
              this.errorMessage = 'Could not upload the file:' + item[index].fileName;
            }
            else {
              this.errorDisplay = true;
              this.errorMessage = 'لا يمكن رفع ملف ' + item[index].fileName;
            }
          });
      });
    });
  }


  removeFileFromObjectArray(doc) {
    const index: number = this.lstCreateWorkOrderTracking.indexOf(doc);
    if (index !== -1) {
      this.lstCreateWorkOrderTracking.splice(index, 1);
    }
  }


  pad(num: string, size: number): string {
    while (num.length < size) num = "0" + num;
    return num;
  }

  CloseStepper() {
    this.ref.close();
  }

  close() {
    this.ref.close({ data: this.statusId });
  }
}
