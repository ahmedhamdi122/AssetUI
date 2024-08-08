import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CreateAssetWorkOrderTaskVM, IndexAssetWorkOrderTaskVM } from 'src/app/Shared/Models/AssetWorkOrderTaskVM';
import { ListEmployees, ListEmployeeVM } from 'src/app/Shared/Models/employeeVM';
import { ViewRequestVM } from 'src/app/Shared/Models/requestVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { CreateWorkOrderAssignVM } from 'src/app/Shared/Models/WorkOrderAssignVM';
import { CreateWorkOrderAttachmentVM } from 'src/app/Shared/Models/WorkOrderAttachmentVM';
import { IndexWorkOrderPeriorityVM } from 'src/app/Shared/Models/WorkOrderPeriorityVM';
import { ListWorkOrderStatusVM } from 'src/app/Shared/Models/WorkOrderStatusVM';
import { CreateTasks, CreateWorkOrderTaskVM } from 'src/app/Shared/Models/WorkOrderTaskVM';
import { CreateWorkOrderTrackingVM, IndexWorkOrderTrackingVM, ListWorkOrderFromTrackingVM } from 'src/app/Shared/Models/WorkOrderTrackingVM';
import { IndexWorkOrderTypeVM } from 'src/app/Shared/Models/WorkOrderTypeVM';
import { CreateWorkOrderVM, ListWorkOrderVM } from 'src/app/Shared/Models/WorkOrderVM';
import { AssetWorkOrderTaskService } from 'src/app/Shared/Services/asset-work-order-task.service';
import { EmployeeService } from 'src/app/Shared/Services/employee.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { RequestTrackingService } from 'src/app/Shared/Services/request-tracking.service';
import { RequestService } from 'src/app/Shared/Services/request.service';
import { WorkOrderAttachmentService } from 'src/app/Shared/Services/work-order-attachment.service';
import { WorkOrderPeriorityService } from 'src/app/Shared/Services/work-order-periority.service';
import { WorkOrderStatusService } from 'src/app/Shared/Services/work-order-status.service';
import { WorkOrderTaskService } from 'src/app/Shared/Services/work-order-task.service';
import { WorkOrderTrackingService } from 'src/app/Shared/Services/work-order-tracking.service';
import { WorkOrderTypeService } from 'src/app/Shared/Services/work-order-type.service';
import { WorkOrderService } from 'src/app/Shared/Services/work-order.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-trackworkorders',
  templateUrl: './trackworkorders.component.html',
  styleUrls: ['./trackworkorders.component.css']
})
export class TrackworkordersComponent implements OnInit {
  lang = localStorage.getItem('lang');
  textDir: string = 'ltr';
  errorMessage: string;
  errorDisplay: boolean = false;

  currentUser: LoggedUser;
  lstWorkOrderPeriority: IndexWorkOrderPeriorityVM[] = [];
  lstWorkOrderType: IndexWorkOrderTypeVM[] = [];
  lstWOStatus: ListWorkOrderStatusVM[] = [];
  lstEngEmployees: ListEmployeeVM[] = [];

  woTaskObj: CreateAssetWorkOrderTaskVM;
  lstWOTasks: CreateAssetWorkOrderTaskVM[] = [];


  createTaskObj: CreateTasks;
  lstAssetWorkOrderTask: IndexAssetWorkOrderTaskVM[] = [];
  lstSelectedCreateTasks: IndexAssetWorkOrderTaskVM[] = [];
  lstSelectedCreateComments: CreateTasks[] = [];
  lstSaveTasks: CreateTasks[] = [];
  saveTasksObj: CreateWorkOrderTaskVM;


  masterAssetId: number;
  serviceRequestId: number;
  isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  thirdFormGroup: FormGroup;
  createWorkOrderObj: CreateWorkOrderVM;

  createWorkOrderAssignVM: CreateWorkOrderAssignVM;

  workOrderId: number;
  CreateWorkOrderAttachmentObj: CreateWorkOrderAttachmentVM;
  workOrderTrackingObj: CreateWorkOrderTrackingVM;
  lstCreateWorkOrderTracking: CreateWorkOrderAttachmentVM[] = [];
  lstUsers: ListEmployees[] = [];
  minDate: Date;
  plannedStartdate: any;
  ActualStartDate: any;
  display: boolean = false;
  isClosed: boolean = false;

  isTLHospitalManager: boolean = false;
  isEng: boolean = false;
  isEngManager: boolean = false;
  lstRoleNames: string[] = [];


  woTrackId: number;
  requestId: number;
  requestObj: ViewRequestVM;
  workOrderObj: ListWorkOrderVM;
  lstTracks: IndexWorkOrderTrackingVM[] = [];
  creatWorkOrderTrackingObj: CreateWorkOrderTrackingVM;

  constructor(
    private authenticationService: AuthenticationService,
    private activeRoute: ActivatedRoute,
    private workOrderType: WorkOrderTypeService,
    private workOrderStatusService: WorkOrderStatusService,
    private workOrderPeriorityService: WorkOrderPeriorityService,
    private _formBuilder: FormBuilder,
    private workOrderservice: WorkOrderService,
    private messageService: MessageService,
    private route: Router,
    private workOrderService: WorkOrderService,
    private workOrderTrackingService: WorkOrderTrackingService,
    private requestService: RequestService,
    private requestTrackingService: RequestTrackingService,
    private config: DynamicDialogConfig,
    private employeeService: EmployeeService,
    private httpClient: HttpClient,
    private datePipe: DatePipe,
    private workOrderAttachmentService: WorkOrderAttachmentService,
    private workOrderTaskService: WorkOrderTaskService,
    private assetWorkOrderTaskService: AssetWorkOrderTaskService) {
    this.currentUser = this.authenticationService.currentUserValue;
  }
  onLoad() {
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


    this.saveTasksObj = { workOrderId: 0, lstCreateTasks: [] }
    this.createWorkOrderAssignVM = { createdBy: '', createdDate: new Date, notes: '', supplierId: 0, userId: '', wOTId: 0 }

    this.requestObj = {
      serialNumber: '', createdById: '', descriptionDate: new Date(), modeName: '', periorityName: '', assetDetailId: 0,
      statusName: '', subProblemName: '', userName: '', id: 0, requestCode: '', subject: '', requestDate: new Date(), requestTypeName: '',
      description: '', assetName: '', assetNameAr: '', modeNameAr: '', periorityNameAr: '', requestTypeNameAr: '', statusNameAr: '', subProblemNameAr: '',
    };

    this.createWorkOrderObj = {
      actualEndDate: "", actualStartDate: "", plannedEndDate: "", plannedStartDate: "", barCode: '', hospitalId: 0, assignedTo: '', createdById: '', requestId: 0, subject: '', creationDate: '', note: '', workOrderNumber: '', workOrderPeriorityId: 0, workOrderTypeId: 0, id: 0
    };

    this.creatWorkOrderTrackingObj = { id: 0, notes: '', createdById: '', creationDate: '', workOrderDate: new Date(), workOrderId: 0, workOrderStatusId: 0, assignedTo: '', actualEndDate: '', actualStartDate: '', plannedStartDate: "", plannedEndDate: "", hospitalId: 0, strWorkOrderDate: '' };
    this.CreateWorkOrderAttachmentObj = { documentName: '', fileName: '', workOrderTrackingId: 0, workOrderFile: File, hospitalId: 0 };
    this.createTaskObj = { comment: '', assetWorkOrderTaskId: 0 }



    this.workOrderStatusService.GetWorkOrderStatuss().subscribe((res) => {
      this.lstWOStatus = res;
    });

    this.workOrderStatusService.GetWorkOrderStatuss().subscribe((res) => {
      this.lstWOStatus = res;
    });

    this.workOrderType.GetWorkOrderTypes().subscribe((res) => {
      this.lstWorkOrderType = res;
    });
    this.workOrderPeriorityService.GetWorkOrderPerioritys().subscribe((res) => {
      this.lstWorkOrderPeriority = res;
    });
  }
  ngOnInit(): void {


    if (this.currentUser) {
      // const roleNames = JSON.parse(localStorage.getItem('roleNames'));
      // roleNames.forEach(element => {
      //   this.lstRoleNames.push(element.name)
      // });

      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });

      this.isTLHospitalManager = (['Admin', 'TLHospitalManager'].some(r => this.lstRoleNames.includes(r)));
      this.isEng = (['Admin', 'Eng'].some(r => this.lstRoleNames.includes(r)));
      this.isEngManager = (['Admin', 'EngDepManager'].some(r => this.lstRoleNames.includes(r)));


    }
    this.onLoad();

    this.requestId = this.config.data.requestId;
    this.requestService.GetById(this.requestId).subscribe(reqObj => {
      this.requestObj = reqObj;
      this.workOrderService.GetWorkOrderByRequestId(reqObj.id).subscribe(woObj => {
        this.workOrderObj = woObj;
        this.workOrderTrackingService.GetTrackOfWorkOrderByWorkOrderId(this.workOrderObj.id).subscribe(trackObj => {
          this.lstTracks = trackObj;



          var count = this.lstTracks.filter(x => x.workOrderStatusId == 6).length;
          if (count == 1) {
            this.isClosed = false;
          }
          else {
            this.isClosed = true;
          }
        })
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

  }


  GetplanndedStartDate($event) {
    this.plannedStartdate = $event.target.value;
    this.createWorkOrderObj.actualStartDate = $event;
  }
  GetActualStartDate($event) {
    this.ActualStartDate = $event.target.value;
    this.createWorkOrderObj.actualEndDate = $event;
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
      this.creatWorkOrderTrackingObj.notes = this.createWorkOrderObj.note;
      this.creatWorkOrderTrackingObj.workOrderId = Number(this.workOrderObj.id);
      this.workOrderTrackingService.CreateWorkOrderTracking(this.creatWorkOrderTrackingObj)
        .subscribe((res) => {
          //    this.workOrderTrackingObj = res;
          this.display = true;
          let currentUrl = this.route.url;
          this.route.routeReuseStrategy.shouldReuseRoute = () => false;
          this.route.onSameUrlNavigation = 'reload';
          this.route.navigate([currentUrl]);
          // this.messageService.add({
          //   key: 'tr',
          //   severity: 'success',
          //   summary: 'Success',
          //   detail: 'Work Order Added Successfully',
          // });
        });




    }
  }

  AddTasksToDB() {
    let lstTasks = [];
    this.lstSelectedCreateTasks.forEach((task, index1) => {
      this.lstSelectedCreateComments.forEach((comment, index2) => {
        if (index1 == index2) {
          let createTaskObj = new CreateTasks();
          createTaskObj.assetWorkOrderTaskId = task.id;
          createTaskObj.comment = JSON.stringify(comment).substring(1).slice(0, -1);
          this.lstSaveTasks.push(createTaskObj);
        }
        lstTasks = this.lstSaveTasks;
      });
    });


    this.saveTasksObj.workOrderId = this.workOrderId;
    this.saveTasksObj.lstCreateTasks = lstTasks;


    this.workOrderTaskService.CreateWorkOrderTask(this.saveTasksObj).subscribe(
      res => {
        // this.display = true;
      });
  }


  closeWorkOrder() {
    this.creatWorkOrderTrackingObj.createdById = this.currentUser.id;
    this.creatWorkOrderTrackingObj.workOrderId = Number(this.workOrderObj.id);
    this.creatWorkOrderTrackingObj.actualStartDate = this.datePipe.transform(new Date, "dd-MM-yyyy HH:mm:ss");
    this.creatWorkOrderTrackingObj.actualEndDate = this.datePipe.transform(new Date, "dd-MM-yyyy HH:mm:ss");
    this.creatWorkOrderTrackingObj.workOrderStatusId = 6;
    this.workOrderTrackingService.CreateWorkOrderTracking(this.creatWorkOrderTrackingObj)
      .subscribe((res) => {
        // this.workOrderTrackingObj = res;
        this.display = true;
        let currentUrl = this.route.url;
        this.route.routeReuseStrategy.shouldReuseRoute = () => false;
        this.route.onSameUrlNavigation = 'reload';
        this.route.navigate([currentUrl]);
      });
  }

  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    this.CreateWorkOrderAttachmentObj.fileName = fileToUpload.name;

    this.httpClient
      .post(environment.uploadWorkOrderDcouments, formData)
      .subscribe((res) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Uploaded Successfully',
        });
      });
  };
  Savedoctolist() {
    if (
      this.CreateWorkOrderAttachmentObj.documentName != '' &&
      this.CreateWorkOrderAttachmentObj.fileName != ''
    ) {
      this.CreateWorkOrderAttachmentObj.workOrderTrackingId = Number(
        this.workOrderTrackingObj
      );
      this.lstCreateWorkOrderTracking.push(this.CreateWorkOrderAttachmentObj);
      this.CreateWorkOrderAttachmentObj = { documentName: '', fileName: '', workOrderTrackingId: 0, workOrderFile: File, hospitalId: 0 };
    } else {
      this.messageService.add({
        key: 'tr',
        severity: 'error',
        summary: 'Attention !!!',
        sticky: true,
        detail: 'Plz Complete Data',
      });
    }
  }
  SaveimageToDB() {
    this.workOrderAttachmentService
      .addListWorkOrderAttachments(this.lstCreateWorkOrderTracking)
      .subscribe((e) => {
        this.messageService.add({
          key: 'tr',
          severity: 'success',
          summary: 'Success',
          detail: 'Documents added successfully',
        });
      });
    this.lstCreateWorkOrderTracking = [];
  }

  removeFileFromObjectArray(doc) {
    const index: number = this.lstCreateWorkOrderTracking.indexOf(doc);
    if (index !== -1) {
      this.lstCreateWorkOrderTracking.splice(index, 1);
    }
  }

  CloseStipper() {
    this.route.navigate(['dash/workOrders/', this.serviceRequestId]);
  }

}
