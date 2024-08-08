import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { MasterAssetVM } from 'src/app/Shared/Models/masterAssetVM';
import { EditRequest } from 'src/app/Shared/Models/requestVM';
import { RequestModeVM } from 'src/app/Shared/Models/requestModeVM';
import { RequestPeriority } from 'src/app/Shared/Models/RequestPeriorityVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { RequestService } from 'src/app/Shared/Services/request.service';
import { RequestPeriorityService } from 'src/app/Shared/Services/request-periority.service';
import { RequestModeService } from 'src/app/Shared/Services/request-mode.service';
import { RequestDocumentService } from 'src/app/Shared/Services/request-document.service';
import { CreateRequestDocument, ListRequestDocumentVM } from 'src/app/Shared/Models/RequestDocumentVM';
import { environment } from 'src/environments/environment';
import { MessageService } from 'primeng/api';
import { HttpClient } from '@angular/common/http';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { RequestTrackingService } from 'src/app/Shared/Services/request-tracking.service';
import { CreateRequestTracking, EditRequestTracking, RequestDetails, RequestTrackingView } from 'src/app/Shared/Models/RequestTrackingVM';
import { IndexRequestStatus } from 'src/app/Shared/Models/RequestStatusVM';
import { RequestStatusService } from 'src/app/Shared/Services/request-status.service';
import { IndexProblemVM } from 'src/app/Shared/Models/ProblemVM';
import { IndexSubProblemVM } from 'src/app/Shared/Models/SubProblemVM';
import { IndexRequestTypeVM } from 'src/app/Shared/Models/ProjectTypeVM';
import { RequestTypeService } from 'src/app/Shared/Services/request-type.service';
import { ProblemService } from 'src/app/Shared/Services/problem.service';
import { SubProblemService } from 'src/app/Shared/Services/sub-problem.service';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { MatStepper } from '@angular/material/stepper';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { Paging } from 'src/app/Shared/Models/paging';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']

})
export class EditComponent implements OnInit {

  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  // isLinear = false;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  statusFormGroup: FormGroup;
  reqObj: EditRequest;
  createRequestTrackingObj: CreateRequestTracking;
  editRequestTrackingObj: EditRequestTracking;
  createRequestDocument: CreateRequestDocument;
  requestDetailsObj: RequestDetails;

  lstMasterAsset: MasterAssetVM[] = [];
  lstassetDetails: AssetDetailVM[] = [];
  lstPeriorities: RequestPeriority[] = [];
  lstRequestMode: RequestModeVM[] = [];
  lstCreateRequestDocument: CreateRequestDocument[] = [];
  lstRequestStatus: IndexRequestStatus[] = [];
  lstProblems: IndexProblemVM[] = [];
  lstSubProblems: IndexSubProblemVM[] = [];
  lstRequestTypes: IndexRequestTypeVM[] = [];
  lstTracks: RequestTrackingView[] = [];
  lstDocuments: ListRequestDocumentVM[] = [];

  requestProblemId: number;
  requestTrackId: any;
  RequestTrackingId: number;
  requestId: number;
  isShowFiles: boolean = false;
  isDisabled: boolean = false;
  isDeleted: boolean = false;

  display: boolean = false;
  isAssetOwner: boolean = false;
  lstRoleNames: string[] = [];

  //Requst Open Timer
  startDateTime: Date;
  startStamp: number;
  newDate: Date = new Date();
  newStamp = this.newDate.getTime();
  timer;

  page: Paging;
  errorDisplay: boolean = false;
  errorMessage: string = "";
  srRFileName: string = "";
  statusId: number = 0;
  //File Upload 
  itmIndex: any[] = [];
  formData = new FormData();
  incremant: number = 0;

  constructor(private authenticationService: AuthenticationService, private requestService: RequestService, private _formBuilder: FormBuilder,
    private assetDetailService: AssetDetailService, private masterAssetService: MasterAssetService, private requestPeriorityService: RequestPeriorityService,
    private requestModeService: RequestModeService, private requestDocumentService: RequestDocumentService, private requestTrackingService: RequestTrackingService,
    private config: DynamicDialogConfig, private ref: DynamicDialogRef, private uploadService: UploadFilesService, private messageService: MessageService, private httpClient: HttpClient, private requestStatusService: RequestStatusService,
    private requestTypeService: RequestTypeService, private problemService: ProblemService, private subProblemService: SubProblemService) { this.currentUser = this.authenticationService.currentUserValue; }


  ngOnInit(): void {
    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });
      this.isAssetOwner = (['AssetOwner'].some(r => this.lstRoleNames.includes(r)));
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

    this.page = {
      pagenumber: 1,
      pagesize: 10,
    }

    this.onLoad();
    this.requestId = this.config.data.id;
    if (this.currentUser.hospitalId == 0) {
      this.masterAssetService.GetMasterAssets().subscribe(
        res => {
          this.lstMasterAsset = res
        });
    }
    this.requestService.GetRequestById(this.requestId).subscribe(
      res => {
        this.reqObj = res;
        let reqDate = new Date(this.reqObj.requestDate);
        this.startDateTime = new Date(reqDate.getFullYear(), reqDate.getMonth(), reqDate.getDate(), reqDate.getHours(), reqDate.getMinutes(), 0)
        this.startStamp = this.startDateTime.getTime();
        if (this.lang == "en") {

          this.requestService.GetAllRequestsWithTrackingByUserIdWithPaging(this.currentUser.id, this.page).subscribe((items) => {
            items.forEach(element => {
              if (element.statusId == 4) {
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
              else {
                this.timer = window.setInterval(() => {
                  this.updateClock()
                }, 1000);
              }
            });
          });
        }
        else {
          this.requestService.GetAllRequestsWithTrackingByUserIdWithPaging(this.currentUser.id, this.page).subscribe((items) => {
            items.forEach(element => {
              if (element.statusId == 4) {
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
              else {
                this.timer = window.setInterval(() => {
                  this.updateClockInArabic()
                }, 1000);
              }
            });
          });
        }

        this.problemService.GetProblemByMasterAssetId(this.reqObj.masterAssetId).subscribe(problems => {
          this.lstProblems = problems;
          this.problemService.GetProblemBySubProblemId(this.reqObj.subProblemId).subscribe(problemObj => {

            if (problemObj[0] != null) {
              this.reqObj.problemId = problemObj[0]["id"];
            }
          });
        });

        this.requestTrackingService.GetTracksByRequestId(this.reqObj.id).subscribe(tracks => {
          this.lstTracks = tracks;
          if (this.lstTracks.length > 1) {
            this.isDisabled = true;
          }
          else {
            this.isDisabled = false;
          }
        });
        this.masterAssetService.ListMasterAssetsByHospitalUserId(this.currentUser.hospitalId, this.currentUser.id).subscribe(
          res => {
            this.lstMasterAsset = res;
            this.assetDetailService.GetAssetById(this.reqObj.assetDetailId).subscribe(item => {
              this.assetDetailService.ViewAllAssetDetailByMasterId(item.masterAssetId).subscribe(lstSerials => {
                this.lstassetDetails = lstSerials;
              });
              this.reqObj.masterAssetId = item.masterAssetId;
            });
          });
      });
  }
  close() {
    this.ref.close({ data: this.statusId });
  }
  onLoad() {

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.requestDetailsObj = {
      wONotes: '', departmentName: '', departmentNameAr: '',
      barcode: '', requestTypeName: '', subProblemName: '', modeName: '', periorityName: '', assetCode: '', hospitalId: 0,
      serialNumber: '', createdById: "", id: 0, requestCode: '', descriptionDate: new Date, lstTracking: [], requestId: 0, statusName: "", userName: "",
      subject: '', requestPeriorityId: 0, requestStatusId: 0, requestDate: new Date(), subProblemId: 0, description: '', requestModeId: 0, assetDetailId: 0, requestTypeId: 0,
      assetName: '', assetNameAr: '', modeNameAr: '', periorityNameAr: '', requestTypeNameAr: '', statusNameAr: '', subProblemNameAr: '', problemId: 0, problemName: '', problemNameAr: ''
    }
    this.reqObj = {
      createdBy: '', requestTypeName: '', subProblemName: '', modeName: '', periorityName: '',
      serialNumber: '', createdById: "", problemId: 0, masterAssetId: 0,
      id: 0, requestCode: '', requestTrackingId: 0, barcode: '',
      subject: '', requestPeriorityId: 0, requestStatusId: 0, assetCode: '',
      requestTime: new Date().getHours() + ':' + new Date().getMinutes(), requestDate: new Date(),
      subProblemId: 0, description: '', requestModeId: 0, assetDetailId: 0, requestTypeId: 0, hospitalId: 0
    }
    this.createRequestDocument = { id: 0, requestTrackingId: 0, fileName: '', documentName: '', requestFile: File, hospitalId: 0 }
    this.createRequestTrackingObj = { strDescriptionDate: '', id: 0, createdById: "", description: '', descriptionDate: new Date(), requestId: 0, requestStatusId: 0, hospitalId: 0 }

    this.editRequestTrackingObj = { createdById: '', description: '', descriptionDate: new Date, id: 0, requestId: 0, requestStatusId: 0, hospitalId: 0 }


    this.requestStatusService.GetAllRequestStatus().subscribe(
      res => {
        this.lstRequestStatus = res
      });

    this.requestPeriorityService.GetAllRequestPeriorties().subscribe(
      res => {
        this.lstPeriorities = res
      });
    this.requestModeService.GetAllRequetsMode().subscribe(
      res => {
        this.lstRequestMode = res
      });


    this.requestTypeService.GetAllRequestTypes().subscribe(
      res => {
        this.lstRequestTypes = res
      });

    this.subProblemService.GetAllSubProblems().subscribe(
      res => {
        this.lstSubProblems = res
      });


  }

  getDocuments(trackid: number) {
    this.requestDocumentService.GetRequestDocumentsByRequestTrackingId(trackid).subscribe(lstdocs => {
      this.lstDocuments = lstdocs;
    });
    this.isShowFiles = true;
  }
  addFiles(trackId: number, stepper: MatStepper) {
    stepper.next();
    this.requestTrackId = trackId;
    this.getDocuments(trackId);
    this.isShowFiles = true;
  }
  downloadFile(fileName) {
    var filePath = `${environment.Domain}UploadedAttachments/`;
    this.uploadService.downloadRequestTrackFile(fileName).subscribe(file => {
      var dwnldFile = filePath + 'RequestDocuments/' + fileName;
      if (fileName != "" || fileName != null)
        window.open(dwnldFile);
    })
  }
  CloseStepper() {
    this.ref.close();
  }
  GetAllSubProblemsByProblemId($event) {
    this.subProblemService.GetAllSubProblemsByProblemId($event.target.value).subscribe(
      res => {
        this.lstSubProblems = res
      }
    )
  }
  ViewAllAssetDetailByMasterId($event) {
    this.assetDetailService.ViewAllAssetDetailByMasterId($event.target.value).subscribe(
      res => {
        this.lstassetDetails = res
      });
    this.problemService.GetProblemByMasterAssetId($event.target.value).subscribe(problems => this.lstProblems = problems)
  }
  getAssetCode($event) {
    this.assetDetailService.GetAssetById($event.target.value).subscribe(assetObj => {
      this.reqObj.assetCode = assetObj["code"];
    })
  }
  EditRequest() {
    this.reqObj.hospitalId = this.currentUser.hospitalId;
    this.requestService.updateRequest(this.reqObj).subscribe(res => { });
    this.requestTrackingService.GetFirstTrackForRequestByRequestId(this.reqObj.id).subscribe(trackObj => {
      this.requestTrackingService.GetById(trackObj.id).subscribe(trkObj => {
        trkObj.id = trackObj.id;
        trkObj.requestStatusId = Number(trackObj.statusId);
        trkObj.description = this.reqObj.description;
        trkObj.hospitalId = this.currentUser.hospitalId;
        this.requestTrackingService.updateRequestTrack(trkObj).subscribe(updated => {


          if (this.lstCreateRequestDocument.length > 0) {
            this.lstCreateRequestDocument.forEach((elemnt, index) => {
              elemnt.hospitalId = this.currentUser.hospitalId;
              elemnt.requestTrackingId = Number(trkObj.id);
              this.requestService.CreateRequestAttachments(elemnt).subscribe(lstfiles => {
                this.uploadService.uploadRequestFiles(elemnt.requestFile, elemnt.fileName).subscribe(
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
        });
      });
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
        var requestDocumentObj = new CreateRequestDocument();
        this.formData.append('file', fileToUpload, fileToUpload.name);
        requestDocumentObj.fileName = fileToUpload.name;
        requestDocumentObj.requestFile = fileToUpload;
        requestDocumentObj.documentName = fileToUpload.name.split('.')[0];
        this.lstCreateRequestDocument.push(requestDocumentObj);
      }
    }
    this.addMultiFilesToList();
  }
  addMultiFilesToList() {
    this.createRequestDocument.requestTrackingId = this.requestTrackId;
    this.lstCreateRequestDocument.forEach((requestDocumentObj, index) => {
      requestDocumentObj.requestTrackingId = Number(this.requestTrackId);
      let ext = requestDocumentObj.fileName.split('.').pop();
      let lastdocumentName = "";
      let imageIndex = "";
      if (this.itmIndex.length == 0) {
        this.requestDocumentService.GetLastDocumentForRequestTrackingId(Number(this.requestTrackId)).subscribe(lastDoc => {
          lastdocumentName = lastDoc.fileName;
          if (lastdocumentName == null) {

            if (this.itmIndex.length == 0) {
              var last_element = 1;
              this.itmIndex.push(last_element);
              let ext = requestDocumentObj.fileName.split('.').pop();
              var hCode = this.pad(this.currentUser.hospitalCode, 4);
              var srCode = this.pad(this.reqObj.requestCode, 10);
              let newIndex = this.pad((last_element).toString(), 2);
              let newFileName = hCode + "SR" + srCode + newIndex;
              requestDocumentObj.fileName = newFileName + "." + ext;
            }
            else {
              var lastIndex2 = this.itmIndex[this.itmIndex.length - 1];
              last_element = lastIndex2 + 1;
              this.itmIndex.push(last_element);
              var hCode = this.pad(this.currentUser.hospitalCode, 4);
              var srCode = this.pad(this.reqObj.requestCode, 10);
              let newIndex = this.pad((last_element).toString(), 2);
              let SRFileName = hCode + "SR" + srCode + newIndex;
              requestDocumentObj.fileName = SRFileName + "." + ext;
            }
          }
          else if (lastdocumentName != "") {
            if (this.itmIndex.length == 0) {
              lastdocumentName = lastdocumentName.substring(0, lastdocumentName.lastIndexOf("."));
              var lastIndex = Number(lastdocumentName.slice(-2)) + 1;
              var hCode = this.pad(this.currentUser.hospitalCode, 4);
              var srCode = this.pad(this.reqObj.requestCode, 10);
              let newIndex = this.pad((lastIndex).toString(), 2);
              let woRFileName = hCode + "SR" + srCode + newIndex + "." + ext;
              requestDocumentObj.fileName = woRFileName;
              this.itmIndex.push(lastIndex);
            }
            else {
              var lastIndex2 = this.itmIndex[this.itmIndex.length - 1];
              last_element = lastIndex2 + 1;
              this.itmIndex.push(last_element);
              var hCode = this.pad(this.currentUser.hospitalCode, 4);
              var srCode = this.pad(this.reqObj.requestCode, 10);
              let newIndex = this.pad((last_element).toString(), 2);
              let SRFileName = hCode + "SR" + srCode + newIndex;
              requestDocumentObj.fileName = SRFileName + "." + ext;
            }
          }
          else if (lastdocumentName == "") {
            if (this.itmIndex.length == 0) {
              var last_element = 1;
              this.itmIndex.push(last_element);
              let ext = requestDocumentObj.fileName.split('.').pop();
              var hCode = this.pad(this.currentUser.hospitalCode, 4);
              var srCode = this.pad(this.reqObj.requestCode, 10);
              let newIndex = this.pad((last_element).toString(), 2);
              let WOFileName = hCode + "SR" + srCode + newIndex;
              requestDocumentObj.fileName = WOFileName + "." + ext;
            }
            else {
              var lastIndex2 = this.itmIndex[this.itmIndex.length - 1];
              last_element = lastIndex2 + 1;
              this.itmIndex.push(last_element);
              var hCode = this.pad(this.currentUser.hospitalCode, 4);
              var srCode = this.pad(this.reqObj.requestCode, 10);
              let newIndex = this.pad((last_element).toString(), 2);
              let SRFileName = hCode + "SR" + srCode + newIndex;
              requestDocumentObj.fileName = SRFileName + "." + ext;
            }
          }
          requestDocumentObj = { id: 0, fileName: '', requestTrackingId: 0, documentName: '', requestFile: File, hospitalId: 0 };
        });
      }
      else if (this.itmIndex.length > 0) {
        var last_element = this.itmIndex[this.itmIndex.length - 1];
        last_element = parseInt(last_element) + (++this.incremant);
        this.itmIndex.push(last_element);

        var hCode = this.pad(this.currentUser.hospitalCode, 4);
        var srCode = this.pad(this.reqObj.requestCode, 10);
        let newIndex = this.pad((last_element).toString(), 2);
        let SRFileName = hCode + "SR" + srCode + newIndex;
        requestDocumentObj.fileName = SRFileName + "." + ext;
        requestDocumentObj = { id: 0, fileName: '', requestTrackingId: 0, documentName: '', requestFile: File, hospitalId: 0 };
      }
    });
  }
  pad(num: string, size: number): string {
    while (num.length < size) num = "0" + num;
    return num;
  }
  removeFileFromObjectArray(rowIndex) {
    if (rowIndex >= 0 && rowIndex < this.lstCreateRequestDocument.length) {
      this.lstCreateRequestDocument.splice(rowIndex, 1);
      this.itmIndex = [];
      this.lstCreateRequestDocument.forEach((requestDocumentObj, index) => {
        requestDocumentObj.requestTrackingId = Number(this.requestTrackId);
        let ext = requestDocumentObj.fileName.split('.').pop();
        let lastdocumentName = "";
        let imageIndex = "";
        if (this.itmIndex.length == 0) {
          this.requestDocumentService.GetLastDocumentForRequestTrackingId(Number(this.requestTrackId)).subscribe(lastDoc => {
            lastdocumentName = lastDoc.fileName;
            if (lastdocumentName == null) {

              if (this.itmIndex.length == 0) {
                var last_element = 1;
                this.itmIndex.push(last_element);
                let ext = requestDocumentObj.fileName.split('.').pop();
                var hCode = this.pad(this.currentUser.hospitalCode, 4);
                var srCode = this.pad(this.reqObj.requestCode, 10);
                let newIndex = this.pad((last_element).toString(), 2);
                let newFileName = hCode + "SR" + srCode + newIndex;
                requestDocumentObj.fileName = newFileName + "." + ext;
              }
              else {
                var lastIndex2 = this.itmIndex[this.itmIndex.length - 1];
                last_element = lastIndex2 + 1;
                this.itmIndex.push(last_element);
                var hCode = this.pad(this.currentUser.hospitalCode, 4);
                var srCode = this.pad(this.reqObj.requestCode, 10);
                let newIndex = this.pad((last_element).toString(), 2);
                let SRFileName = hCode + "SR" + srCode + newIndex;
                requestDocumentObj.fileName = SRFileName + "." + ext;
              }
            }
            else if (lastdocumentName != "") {
              if (this.itmIndex.length == 0) {
                lastdocumentName = lastdocumentName.substring(0, lastdocumentName.lastIndexOf("."));
                var lastIndex = Number(lastdocumentName.slice(-2)) + 1;
                var hCode = this.pad(this.currentUser.hospitalCode, 4);
                var srCode = this.pad(this.reqObj.requestCode, 10);
                let newIndex = this.pad((lastIndex).toString(), 2);
                let woRFileName = hCode + "SR" + srCode + newIndex + "." + ext;
                requestDocumentObj.fileName = woRFileName;
                this.itmIndex.push(lastIndex);
              }
              else {
                var lastIndex2 = this.itmIndex[this.itmIndex.length - 1];
                last_element = lastIndex2 + 1;
                this.itmIndex.push(last_element);
                var hCode = this.pad(this.currentUser.hospitalCode, 4);
                var srCode = this.pad(this.reqObj.requestCode, 10);
                let newIndex = this.pad((last_element).toString(), 2);
                let SRFileName = hCode + "SR" + srCode + newIndex;
                requestDocumentObj.fileName = SRFileName + "." + ext;
              }
            }
            else if (lastdocumentName == "") {
              if (this.itmIndex.length == 0) {
                var last_element = 1;
                this.itmIndex.push(last_element);
                let ext = requestDocumentObj.fileName.split('.').pop();
                var hCode = this.pad(this.currentUser.hospitalCode, 4);
                var srCode = this.pad(this.reqObj.requestCode, 10);
                let newIndex = this.pad((last_element).toString(), 2);
                let WOFileName = hCode + "SR" + srCode + newIndex;
                requestDocumentObj.fileName = WOFileName + "." + ext;
              }
              else {
                var lastIndex2 = this.itmIndex[this.itmIndex.length - 1];
                last_element = lastIndex2 + 1;
                this.itmIndex.push(last_element);
                var hCode = this.pad(this.currentUser.hospitalCode, 4);
                var srCode = this.pad(this.reqObj.requestCode, 10);
                let newIndex = this.pad((last_element).toString(), 2);
                let SRFileName = hCode + "SR" + srCode + newIndex;
                requestDocumentObj.fileName = SRFileName + "." + ext;
              }
            }
            requestDocumentObj = { id: 0, fileName: '', requestTrackingId: 0, documentName: '', requestFile: File, hospitalId: 0 };
          });
        }
        else if (this.itmIndex.length > 0) {
          var last_element = this.itmIndex[this.itmIndex.length - 1];
          last_element = parseInt(last_element) + (++this.incremant);
          this.itmIndex.push(last_element);
          var hCode = this.pad(this.currentUser.hospitalCode, 4);
          var srCode = this.pad(this.reqObj.requestCode, 10);
          let newIndex = this.pad((last_element).toString(), 2);
          let SRFileName = hCode + "SR" + srCode + newIndex;
          requestDocumentObj.fileName = SRFileName + "." + ext;
          requestDocumentObj = { id: 0, fileName: '', requestTrackingId: 0, documentName: '', requestFile: File, hospitalId: 0 };
        }
      });

    }
  }
  deleteFile(id: number) {
    this.requestService.DeleteRequestDocument(id).subscribe(deletedfile => {
      this.isDeleted = true;
    });
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
    //document.getElementById("time-elapsed").innerHTML = d + " day(s), " + h + " hour(s), " + m + " minute(s), " + s + " second(s)";
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
    //  document.getElementById("time-elapsed").innerHTML = d + " يوم ، " + h + " ساعة ، " + m + " دقيقة ، " + s + " ثانية";
  }
  // saveStatus() {
  //   this.createRequestTrackingObj.requestId = this.requestId;
  //   this.createRequestTrackingObj.createdById = this.currentUser.id;
  //   this.requestTrackingService.AddRequestTracking(this.createRequestTrackingObj).subscribe(savedTrackId => {
  //     this.requestTrackId = savedTrackId;
  //   }, error => {
  //     this.errorDisplay = true;
  //     if (this.lang == "en") {
  //       this.errorMessage = error.error.message;
  //     }
  //     else {
  //       this.errorMessage = error.error.messageAr;
  //     }
  //     return false;
  //   });
  // }
}
