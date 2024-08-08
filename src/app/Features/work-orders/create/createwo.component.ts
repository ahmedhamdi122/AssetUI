import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateAssetStatusTransactionVM } from 'src/app/Shared/Models/assetStatusTransactionVM';
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
import { CreateWorkOrderTrackingVM } from 'src/app/Shared/Models/WorkOrderTrackingVM';
import { IndexWorkOrderTypeVM } from 'src/app/Shared/Models/WorkOrderTypeVM';
import { CreateWorkOrderVM } from 'src/app/Shared/Models/WorkOrderVM';
import { AssetWorkOrderTaskService } from 'src/app/Shared/Services/asset-work-order-task.service';
import { AssetStatusTransactionService } from 'src/app/Shared/Services/assetStatusTransaction.service';
import { CityService } from 'src/app/Shared/Services/city.service';
import { EmployeeService } from 'src/app/Shared/Services/employee.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { RequestTrackingService } from 'src/app/Shared/Services/request-tracking.service';
import { RequestService } from 'src/app/Shared/Services/request.service';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { WorkOrderPeriorityService } from 'src/app/Shared/Services/work-order-periority.service';
import { WorkOrderStatusService } from 'src/app/Shared/Services/work-order-status.service';
import { WorkOrderTaskService } from 'src/app/Shared/Services/work-order-task.service';
import { WorkOrderTrackingService } from 'src/app/Shared/Services/work-order-tracking.service';
import { WorkOrderTypeService } from 'src/app/Shared/Services/work-order-type.service';
import { WorkOrderService } from 'src/app/Shared/Services/work-order.service';

@Component({
  selector: 'app-createwo',
  templateUrl: './createwo.component.html',
  styleUrls: ['./createwo.component.css'],
})
export class CreateWOComponent implements OnInit {
  lang = localStorage.getItem('lang');
  textDir: string = 'ltr';
  errorMessage: string;
  errorDisplay: boolean = false;
  error: any = { isError: false, errorMessage: '' };
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

  dateError: boolean = false;
  masterAssetId: number;
  serviceRequestId: number;
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  createWorkOrderObj: CreateWorkOrderVM;
  assetStatusObj: CreateAssetStatusTransactionVM;
  disabledButton: boolean;
  IsSaveProject: boolean;
  creatWorkOrderTrackingObj: CreateWorkOrderTrackingVM;
  createWorkOrderAssignVM: CreateWorkOrderAssignVM;
  createRequestTrackingObj: CreateRequestTracking;

  isAdmin: boolean = false;
  isValidDate: boolean = false;
  lstGovernorates: ListGovernorateVM[];
  lstCities: ListCityVM[];
  lstOrganizations: ListOrganizationVM[];
  lstSubOrganizations: ListSubOrganizationVM[];
  lstHospitals: ListHospitalVM[] = [];

  hospitalId: number;
  workOrderId: number;
  workOrderTrackId: number;
  CreateWorkOrderAttachmentObj: CreateWorkOrderAttachmentVM;
  workOrderTrackingObj: CreateWorkOrderTrackingVM;

  lstCreateWorkOrderTracking: CreateWorkOrderAttachmentVM[] = [];
  lstUsers: ListEmployees[] = [];
  minDate: Date;
  plannedStartdate: null;
  ActualStartDate: any;
  display: boolean = false;
  isHide: boolean = false;
  isDisabled: boolean = false;

  selectedStatus: string = '';
  assetDetailId: number;
  isEngManager: boolean = false;
  lstRoleNames: string[] = [];
  itmIndex: any[] = [];
  public woId: number = 0;
  formData = new FormData();
  constructor(
    private authenticationService: AuthenticationService, private assetStatusTransactionService: AssetStatusTransactionService, private ref: DynamicDialogRef, private workOrderType: WorkOrderTypeService,
    private workOrderStatusService: WorkOrderStatusService, private workOrderPeriorityService: WorkOrderPeriorityService, private _formBuilder: FormBuilder, private workOrderservice: WorkOrderService,
    private workOrderTrackingService: WorkOrderTrackingService, private requestService: RequestService, private requestTrackingService: RequestTrackingService,
    private config: DynamicDialogConfig, private employeeService: EmployeeService, private organizationService: OrganizationService, private subOrganizationService: SubOrganizationService, private cityService: CityService, private governorateService: GovernorateService, private hospitalService: HospitalService, private workOrderTaskService: WorkOrderTaskService, private datePipe: DatePipe, private uploadService: UploadFilesService, private assetWorkOrderTaskService: AssetWorkOrderTaskService) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {


    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });
      this.isEngManager = (['EngDepManager'].some(r => this.lstRoleNames.includes(r)));
    }

    this.onLoad();
    this.serviceRequestId = this.config.data.requestId;

    if (this.currentUser.hospitalId > 0) {
      this.requestTrackingService
        .GetById(this.serviceRequestId)
        .subscribe((res) => {
          this.requestDetailObj = res;
        });

      this.employeeService
        .GetEmployeesByHospitalId2(this.currentUser.hospitalId)
        .subscribe((lstemployees) => {
          this.lstEngEmployees = lstemployees;

          this.creatWorkOrderTrackingObj.assignedTo = this.currentUser.id;

        });
      this.workOrderservice.GenerateWorOrderNumber().subscribe(num => {
        this.createWorkOrderObj.workOrderNumber = num.woNumber;
      })

      this.requestService
        .GetRequestById(this.serviceRequestId)
        .subscribe((item) => {
          this.masterAssetId = item.masterAssetId;
          this.assetWorkOrderTaskService.GetAllAssetWorkOrderTasksByMasterAssetId(item.masterAssetId).subscribe(
            res => {
              this.lstAssetWorkOrderTask = res
            });
        });

      this.requestService.GetRequestById(this.serviceRequestId).subscribe(reqObj => {
        this.assetDetailId = reqObj["assetDetailId"];
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
  onLoad() {


    this.createTaskObj = { comment: '', assetWorkOrderTaskId: 0 }
    this.saveTasksObj = { workOrderId: 0, lstCreateTasks: [] }
    this.createWorkOrderAssignVM = { createdBy: '', createdDate: new Date, notes: '', supplierId: 0, userId: '', wOTId: 0 }
    this.createRequestTrackingObj = { strDescriptionDate: '', createdById: '', description: '', descriptionDate: new Date, id: 0, requestId: 0, requestStatusId: 0, hospitalId: 0 }
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
    this.assetStatusObj = { assetDetailId: 0, assetStatusId: 0, statusDate: '', hospitalId: 0 }
    this.requestDetailObj = { departmentName: '', departmentNameAr: '', wONotes: '', hospitalId: 0, barcode: '', serialNumber: '', createdById: '', descriptionDate: new Date(), modeName: '', lstTracking: [], requestStatusId: 0, periorityName: '', requestId: 0, statusName: '', subProblemName: '', userName: '', id: 0, requestCode: '', subject: '', requestPeriorityId: 0, requestDate: new Date(), requestTypeId: 0, requestTypeName: '', subProblemId: 0, description: '', requestModeId: 0, assetDetailId: 0, assetName: '', assetNameAr: '', assetCode: '', modeNameAr: '', periorityNameAr: '', requestTypeNameAr: '', statusNameAr: '', subProblemNameAr: '', problemId: 0, problemName: '', problemNameAr: '' };

    this.createWorkOrderObj = { actualEndDate: "", actualStartDate: "", plannedEndDate: null, plannedStartDate: null, assignedTo: '', createdById: '', requestId: 0, subject: '', creationDate: '', note: '', barCode: '', workOrderNumber: '', workOrderPeriorityId: 0, workOrderTypeId: 0, id: 0, hospitalId: 0 };
    this.creatWorkOrderTrackingObj = { id: 0, notes: '', createdById: '', creationDate: '', strWorkOrderDate: '', workOrderDate: new Date, workOrderId: 0, workOrderStatusId: 0, hospitalId: 0, assignedTo: '', actualEndDate: '', actualStartDate: '', plannedEndDate: "", plannedStartDate: "" };
    this.CreateWorkOrderAttachmentObj = { documentName: '', fileName: '', workOrderTrackingId: 0, workOrderFile: File, hospitalId: 0 };



    this.workOrderStatusService.GetWorkOrderStatuss().subscribe((res) => {
      this.lstWOStatus = res;
    });

    this.workOrderType.GetWorkOrderTypes().subscribe((res) => {
      this.lstWorkOrderType = res;
      this.createWorkOrderObj.workOrderTypeId = 2;
    });
    this.workOrderPeriorityService.GetWorkOrderPerioritys().subscribe((res) => {
      this.lstWorkOrderPeriority = res;

      this.createWorkOrderObj.workOrderPeriorityId = 4;
    });

  }
  AddworkOrder() {

    this.createWorkOrderObj.hospitalId = this.currentUser.hospitalId;
    if (this.creatWorkOrderTrackingObj.assignedTo == "") {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select person to assigned engineer";
      } else {
        this.errorMessage = "من فضلك اختر المهندس المختص بالصيانة";
      }
      return false;
    }

    if (this.createWorkOrderObj.subject == "") {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please write subject";
      } else {
        this.errorMessage = "من فضلك اكتب موضوع أمر الشغل";
      }

      return false;
    }



    if (this.createWorkOrderObj.workOrderPeriorityId == 0) {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select periority";
      } else {
        this.errorMessage = "من فضلك اختر الأولوية";
      }

      return false;
    }

    if (this.createWorkOrderObj.note == "") {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please write description";
      }
      else {
        this.errorMessage = "من فضلك اكتب وصف للعطل";
      }
      return false;
    }
    else {

      this.createWorkOrderObj.createdById = this.currentUser.id;
      this.createWorkOrderObj.requestId = this.serviceRequestId;

      this.createWorkOrderObj.creationDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.createWorkOrderObj.plannedStartDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.createWorkOrderObj.plannedEndDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.createWorkOrderObj.actualStartDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
      this.createWorkOrderObj.actualEndDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");



      this.workOrderservice.CreateWorkOrder(this.createWorkOrderObj)
        .subscribe(id => {
          this.workOrderId = id;
          this.creatWorkOrderTrackingObj.strWorkOrderDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
          this.creatWorkOrderTrackingObj.creationDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
          this.creatWorkOrderTrackingObj.plannedStartDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
          this.creatWorkOrderTrackingObj.plannedEndDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
          this.creatWorkOrderTrackingObj.actualStartDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
          this.creatWorkOrderTrackingObj.actualEndDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
          this.creatWorkOrderTrackingObj.createdById = this.currentUser.id;
          this.creatWorkOrderTrackingObj.notes = this.createWorkOrderObj.note;
          this.creatWorkOrderTrackingObj.workOrderId = Number(this.workOrderId);
          this.creatWorkOrderTrackingObj.workOrderStatusId = 1;
          this.creatWorkOrderTrackingObj.hospitalId = this.currentUser.hospitalId;
          this.workOrderTrackingService.AddWorkOrderTracking(this.creatWorkOrderTrackingObj).subscribe(trackId => {
            this.workOrderTrackId = trackId;
            if (this.lang == "en") {
              this.createRequestTrackingObj.description = "Go to work order";
            }
            else {
              this.createRequestTrackingObj.description = "بداية أمر الشغل";
            }
            this.createRequestTrackingObj.createdById = this.currentUser.id
            this.createRequestTrackingObj.requestId = this.serviceRequestId;
            this.createRequestTrackingObj.hospitalId = this.currentUser.hospitalId;
            this.createRequestTrackingObj.strDescriptionDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
            this.createRequestTrackingObj.requestStatusId = 3;
            this.requestTrackingService.AddRequestTracking(this.createRequestTrackingObj).subscribe(inprogress => {
              this.assetStatusObj.hospitalId = this.currentUser.hospitalId;
              this.assetStatusObj.assetDetailId = this.assetDetailId;
              this.assetStatusObj.statusDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
              this.assetStatusObj.assetStatusId = 4;
              this.assetStatusTransactionService.AddAssetStatusTransaction(this.assetStatusObj).subscribe(() => {
                this.display = true;
                this.isDisabled = true;
              });
            });
            if (this.lstCreateWorkOrderTracking.length > 0) {
              this.lstCreateWorkOrderTracking.forEach((elemnt, index) => {
                elemnt.hospitalId = this.currentUser.hospitalId;
                elemnt.workOrderTrackingId = Number(trackId);
                this.workOrderservice.CreateWorkOrderAttachments(elemnt).subscribe(lstfiles => {
                  this.uploadService.uploadWorkOrderFiles(elemnt.workOrderFile, elemnt.fileName).subscribe(
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

              this.lstCreateWorkOrderTracking = [];
            }
            else {
              this.display = true;
              this.isDisabled = true;
            }
          });
        }, (error) => {
          this.errorDisplay = true;
          if (this.lang == 'en') {
            if (error.error.status == 'sr') {
              this.errorMessage = error.error.message;
            }
          }
          if (this.lang == 'ar') {
            if (error.error.status == 'sr') {
              this.errorMessage = error.error.messageAr;
            }
          }
          return false;
        });
    }
  }
  // AddTasksToDB() {
  //   let lstTasks = [];
  //   this.lstSelectedCreateTasks.forEach((task, index1) => {
  //     this.lstSelectedCreateComments.forEach((comment, index2) => {
  //       if (index1 == index2) {
  //         let createTaskObj = new CreateTasks();

  //         createTaskObj.assetWorkOrderTaskId = task.id;
  //         createTaskObj.comment = JSON.stringify(comment).substring(1).slice(0, -1);
  //         this.lstSaveTasks.push(createTaskObj);
  //       }
  //       lstTasks = this.lstSaveTasks;
  //     });
  //   });


  //   this.saveTasksObj.workOrderId = this.workOrderId;
  //   this.saveTasksObj.lstCreateTasks = lstTasks;


  //   this.workOrderTaskService.CreateWorkOrderTask(this.saveTasksObj).subscribe(
  //     res => {
  //       this.display = true;
  //     });
  // }

  uploadMultipleFile = (event: any) => {
    const files: FileList = event.target.files;
    if (files.length === 0) {
      return;
    }
    else {
      for (var i = 0; i < files.length; i++) {
        let fileToUpload = <File>files[i];
        var woDocumentObj = new CreateWorkOrderAttachmentVM();
        this.formData.append('file', fileToUpload, fileToUpload.name);
        woDocumentObj.fileName = fileToUpload.name;
        woDocumentObj.workOrderFile = fileToUpload;
        woDocumentObj.documentName = fileToUpload.name.split('.')[0];
        this.lstCreateWorkOrderTracking.push(woDocumentObj);
      }
      this.addMultiFilesToList();
    }
  }
  addMultiFilesToList() {
    this.lstCreateWorkOrderTracking.forEach((element, index) => {
      element.workOrderTrackingId = Number(this.workOrderTrackId)
      if (this.itmIndex.length === 0) {
        index = 1;
      }
      else if (this.itmIndex.length > 0) {
        index = this.itmIndex[this.itmIndex.length - 1];
        index = index + 1;
      }
      this.itmIndex.push(index);
      let ext = element.fileName.split('.').pop();
      var hCode = this.pad(this.currentUser.hospitalCode, 4);
      var srCode = this.pad(this.createWorkOrderObj.workOrderNumber, 10);
      var last = this.itmIndex[this.itmIndex.length - 1];
      let newIndex = this.pad((last).toString(), 2);
      let SRFileName = hCode + srCode + newIndex;
      element.fileName = SRFileName + "." + ext;
      element = { fileName: '', workOrderTrackingId: 0, documentName: '', workOrderFile: File, hospitalId: 0 };
    });
  }
  removeFileFromObjectArray(rowIndex) {
    let newIndex;
    if (rowIndex >= 0 && rowIndex < this.lstCreateWorkOrderTracking.length) {
      this.lstCreateWorkOrderTracking.splice(rowIndex, 1);

      this.lstCreateWorkOrderTracking.forEach((element, index) => {
        element.workOrderTrackingId = Number(this.workOrderTrackId)
        if (this.itmIndex.length === 0) {
          last_element = 1;
        }
        else if (this.itmIndex.length > 0 && this.lstCreateWorkOrderTracking.length == 0) {
          var last_element = this.itmIndex[this.itmIndex.length - 1];
          last_element = last_element + 1;
        }
        else if (this.itmIndex.length > 0 && this.lstCreateWorkOrderTracking.length > 0) {
          const incrementedIndex = index + 1;
          newIndex = this.pad((incrementedIndex).toString(), 2);
        }
        this.itmIndex.push(last_element);
        let ext = element.fileName.split('.').pop();
        var hCode = this.pad(this.currentUser.hospitalCode, 4);
        var srCode = this.pad(this.createWorkOrderObj.workOrderNumber, 10);
        let SRFileName = hCode + srCode + newIndex;
        element.fileName = SRFileName + "." + ext;
        element = { fileName: '', workOrderTrackingId: 0, documentName: '', workOrderFile: File, hospitalId: 0 };
      });

    }
  }
  pad(num: string, size: number): string {
    while (num.length < size) num = "0" + num;
    return num;
  }


  validateDates(sDate: string, eDate: string) {
    this.isValidDate = true;
    if ((sDate != null && eDate != null) && (eDate) < (sDate)) {
      if (this.lang == "en") {
        this.error = { isError: true, errorMessage: 'Start Date should be less than End Date.' };
        this.isValidDate = false;
      }
      else {
        this.error = { isError: true, errorMessage: 'تاريخ بداية أمر الشغل لابد أن يكون أقل من تاريخ نهاية الشغل' };
        this.isValidDate = false;
      }
    }
    return this.isValidDate;
  }
}
