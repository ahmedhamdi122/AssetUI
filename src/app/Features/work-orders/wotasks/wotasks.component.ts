import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IndexAssetWorkOrderTaskVM } from 'src/app/Shared/Models/AssetWorkOrderTaskVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { CreateTasks, CreateWorkOrderTaskVM } from 'src/app/Shared/Models/WorkOrderTaskVM';
import { AssetWorkOrderTaskService } from 'src/app/Shared/Services/asset-work-order-task.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { WorkOrderTaskService } from 'src/app/Shared/Services/work-order-task.service';
import { WorkOrderTrackingService } from 'src/app/Shared/Services/work-order-tracking.service';

@Component({
  selector: 'app-wotasks',
  templateUrl:
    './wotasks.component.html',
  styleUrls: ['./wotasks.component.css']
})
export class WotasksComponent implements OnInit {

  public lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  createTaskObj: CreateTasks;
  lstAssetWorkOrderTask: IndexAssetWorkOrderTaskVM[] = [];
  lstSelectedCreateTasks: IndexAssetWorkOrderTaskVM[] = [];
  lstSelectedCreateComments: CreateTasks[] = [];
  lstSaveTasks: CreateTasks[] = [];

  SaveTasksObj: CreateWorkOrderTaskVM;
  subject: string;

  woId: number;
  constructor(private authenticationService: AuthenticationService, private assetWorkOrderTaskService: AssetWorkOrderTaskService,
    private workOrderTaskService: WorkOrderTaskService, private workOrderTrackingService: WorkOrderTrackingService, private config: DynamicDialogConfig) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {

    let id = this.config.data.id;
    this.woId = id;
    this.workOrderTrackingService.GetAllWorkOrderByWorkOrderId(id).subscribe(
      woObj => {
        this.subject = woObj.subject;
        this.assetWorkOrderTaskService.GetAllAssetWorkOrderTasksByMasterAssetId(woObj.masterAssetId).subscribe(
          res => {
            this.lstAssetWorkOrderTask = res
          }
        )
      });

  }


  AddTasksToDB() {
    this.lstSelectedCreateTasks.forEach((task, index1) => {
      this.lstSelectedCreateComments.forEach((comment, index2) => {
        if (index1 == index2) {
          this.createTaskObj = { comment: '', assetWorkOrderTaskId: 0 }
          this.createTaskObj.assetWorkOrderTaskId = task.id
          this.createTaskObj.comment = JSON.stringify(comment).substring(1).slice(0, -1)
          this.lstSaveTasks.push(this.createTaskObj)
        }
      })
    })
    this.SaveTasksObj.workOrderId = this.woId;
    this.SaveTasksObj.lstCreateTasks = this.lstSaveTasks
    this.workOrderTaskService.CreateWorkOrderTask(this.SaveTasksObj).subscribe(
      res => {
      }
    )
  }

}
