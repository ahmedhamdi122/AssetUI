import { ScrapService } from './../../../Shared/Services/scrap.service';
import { ScrapReasonService } from './../../../Shared/Services/scrapReason.service';
import { CreateScrapVM, ListScrapVM } from './../../../Shared/Models/scrapVM';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { ListScrapReasonVM } from 'src/app/Shared/Models/scrapReasonVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { Paging } from 'src/app/Shared/Models/paging';
import { RequestService } from 'src/app/Shared/Services/request.service';
import { ListRequestVM } from 'src/app/Shared/Models/requestModeVM';
import { CreateRequest } from 'src/app/Shared/Models/requestVM';
import { IndexProblemVM } from 'src/app/Shared/Models/ProblemVM';
import { ListMasterAssetVM, MasterAssetVM } from 'src/app/Shared/Models/masterAssetVM';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { DatePipe } from '@angular/common';
import { CreateScrapAttachmentVM } from 'src/app/Shared/Models/scrapAttachmentVM';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { AssetStatusTransactionService } from 'src/app/Shared/Services/assetStatusTransaction.service';
import { AssetStatusTransactionVM } from 'src/app/Shared/Models/assetStatusTransactionVM';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  isMasterAsset: boolean = false;
  assetBarCodeObj: AssetDetailVM;
  assetSerialObj: AssetDetailVM;
  masterAssetObj: ListMasterAssetVM;
  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  lstSerials: AssetDetailVM[] = [];
  lstReasons: ListScrapReasonVM[] = [];
  lstassetDetailBarcodes: AssetDetailVM[] = [];
  scrapObj: CreateScrapVM;
  currentUser: LoggedUser;
  lstassetDetails: AssetDetailVM[] = [];
  isDisabled: boolean = false;
  errorDisplay: boolean = false;
  errorMessage: string = "";
  page: Paging;
  count: number;
  loading: boolean = true;
  assetStatusId: number = 0;
  lstScraps: ListScrapVM;
  lstRequests: ListRequestVM[] = [];
  reqObj: CreateRequest;
  lstProblems: IndexProblemVM[] = [];
  lstMasterAsset: MasterAssetVM[] = [];
  lstMaster: ListMasterAssetVM[] = [];
  applicationStatus: string = "";
  radioPerioritySelected: number;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  disabledButton: boolean = false;
  assetId: number;
  addHEReasons: number[] = [];
  lstSelectedReasonIds: number[] = [];
  visibleId: number = 0;
  createScrapAttachment: CreateScrapAttachmentVM;
  lstCreateScrapAttachment: CreateScrapAttachmentVM[] = [];
  formData = new FormData();
  itmIndex: any[] = [];
  scrapId: CreateScrapVM;
  lstMasterAssets: ListMasterAssetVM[] = [];
  isValidDate: any;
  error: any = { isError: false, errorMessage: '' };
  dateError: boolean = false;
  display: boolean = false;

  constructor(private datePipe: DatePipe, private authenticationService: AuthenticationService,
    private scrapService: ScrapService, private scrapReasonService: ScrapReasonService,
    private activeRoute: ActivatedRoute, private masterAssetService: MasterAssetService,
    private formBuilder: FormBuilder, private assetDetailService: AssetDetailService,
    private requestService: RequestService, private route: Router, public dialogService: DialogService,
    private ref: DynamicDialogRef, private assetStatusTransactionService: AssetStatusTransactionService,
    private uploadService: UploadFilesService,
  ) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {

    this.radioPerioritySelected = 4;
    this.disabledButton = false;
    this.firstFormGroup = this.formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this.formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.reqObj = {
      strRequestDate: '', departmentId: 0,
      serialNumber: '', createdById: "", problemId: 0, masterAssetId: 0, requestCode: '', subject: '', requestPeriorityId: 0, requestStatusId: 0, requestTime: new Date().getHours() + ':' + new Date().getMinutes(), requestDate: new Date(),
      subProblemId: 0, description: '', requestModeId: 0, assetDetailId: 0, requestTypeId: 0, hospitalId: 0
    }
    this.scrapObj = {
      hospitalId: 0,
      departmentName: '', departmentNameAr: '', assetDetailId: 0, scrapNo: '', scrapDate: new Date, strScrapDate: '', sysDate: '', comment: '', departmentId: 0, masterAssetId: 0, model: '', brandName: '', brandNameAr: '', reasonIds: []
    }
    this.scrapObj.scrapDate = new Date();
    this.scrapObj.sysDate = new Date().toDateString();

    this.onLoad();
    this.page = {
      pagenumber: 1,
      pagesize: 10
    }
    if (this.currentUser.hospitalId > 0) {
      this.masterAssetService.ListMasterAssetsByHospitalUserId(this.currentUser.hospitalId, this.currentUser.id).subscribe(
        res => {
          this.lstMasterAsset = res;
          this.lstMaster = res
        });
      this.assetDetailService.GetAllAssetDetailsByHospitalId(this.currentUser.hospitalId).subscribe(masters => {
        this.lstassetDetailBarcodes = masters;
        if (this.lang == "en") {
          this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode + "-" + item.name);
        }
        else {
          this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode + "-" + item.nameAr);
        }
      });
    }
    else {
      this.masterAssetService.GetMasterAssets().subscribe(
        res => {
          this.lstMasterAsset = res;
          this.lstMaster = res;
        })
    }
    let assetId = this.activeRoute.snapshot.params['assetId'];
    if (assetId != undefined || assetId != null) {
      this.assetId = assetId;
      this.masterAssetService.ListMasterAssetsByHospitalUserId(this.currentUser.hospitalId, this.currentUser.id).subscribe(
        res => {
          this.lstMasterAsset = res;
          this.lstMaster = res;
        });
      this.assetDetailService.GetAssetById(assetId).subscribe(itemObj => {
        this.reqObj.masterAssetId = itemObj["masterAssetId"];
        this.assetDetailService.GetAssetNameByMasterAssetIdAndHospitalId(Number(itemObj["masterAssetId"]), this.currentUser.hospitalId).subscribe(
          res => {
            this.lstassetDetails = res;
            this.reqObj.assetDetailId = itemObj["id"];
          });
      });
    }
  }
  onLoad() {
    this.scrapService.GenerateScrapNumber().subscribe(num => {
      this.scrapObj.scrapNo = num.scrapNo;
    });
    this.reqObj = { departmentId: 0, strRequestDate: '', hospitalId: 0, assetDetailId: 0, createdById: '', description: '', masterAssetId: 0, problemId: 0, requestCode: '', requestDate: new Date, requestModeId: 0, requestPeriorityId: 0, requestStatusId: 0, requestTime: '', requestTypeId: 0, serialNumber: "", subProblemId: 0, subject: '' };
    this.createScrapAttachment = { id: 0, scrapId: 0, fileName: '', title: '', scrapFile: File }
    this.scrapReasonService.GetAllScrapReasons().subscribe(reasons => {
      this.lstReasons = reasons;
    })
  }
  onSubmit() {
    this.scrapObj.strScrapDate = this.datePipe.transform(this.scrapObj.scrapDate, "yyyy-MM-dd");
    if (this.lstSelectedReasonIds.length > 0) {
      this.scrapObj.reasonIds = this.lstSelectedReasonIds;
    }

    if (this.scrapObj.assetDetailId == 0) {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select Asset";
      }
      else {
        this.errorMessage = "من فضلك اختر جهاز";
      }
      return false;
    }
    if (this.scrapObj.strScrapDate == "") {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select Date";
      }
      else {
        this.errorMessage = "من فضلك اختر تاريخ ";
      }
      return false;
    }
    let start = this.datePipe.transform(this.scrapObj.scrapDate, "yyyy-MM-dd");
    let end = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.isValidDate = this.validateDates(start, end);
    if (!this.isValidDate) {
      this.dateError = true;
      return false;
    }
    else {
      this.scrapObj.hospitalId = this.currentUser.hospitalId;
      this.scrapService.CreateScrap(this.scrapObj).subscribe(scrapObj => {
        var statusObj = new AssetStatusTransactionVM();
        statusObj.assetDetailId = this.scrapObj.assetDetailId;
        statusObj.hospitalId = this.currentUser.hospitalId;
        statusObj.statusDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
        statusObj.assetStatusId = 2;
        this.assetStatusTransactionService.AddAssetStatusTransaction(statusObj).subscribe(addedStatus => {
        });

        if (this.lstCreateScrapAttachment.length > 0) {
          this.lstCreateScrapAttachment.forEach((item) => {
            item.scrapId = Number(scrapObj);
            if (this.lstCreateScrapAttachment.length > 0) {
              this.lstCreateScrapAttachment.forEach((item, index) => {
                item.scrapId = Number(scrapObj);
                this.scrapService.CreateScrapAttachments(item).subscribe(fileObj => {
                  this.uploadService.uploadScrapFiles(item.scrapFile, item.fileName).subscribe(
                    (event) => {
                      this.display = true;
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
              this.lstCreateScrapAttachment = [];
            }
          });

          this.route.navigate(['/dash/scrap']);
        }
        else {
          this.display = true;
          this.route.navigate(['/dash/scrap']);
        }
      },
        (error) => {
          this.errorDisplay = true;
          if (this.lang == 'en') {
            if (error.error.status == 'assetId') {
              this.errorMessage = error.error.message;
            }

          }
          if (this.lang == 'ar') {
            if (error.error.status == 'assetId') {
              this.errorMessage = error.error.messageAr;
            }
          }
          return false;
        });
    }
  }
  public uploadFile = (files) => {
    if (this.createScrapAttachment.title == "") {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "please add document name";
      }
      else {
        this.errorMessage = "من فضلك اكتب اسم ملف قبل اختيار الملف";
      }
      return false;
    }
    else if (files.length === 0) {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "please select file";
      }
      else {
        this.errorMessage = "من فضلك  اختر  ملف";
      }
      return false;
    }
    else {
      let fileToUpload = <File>files[0];
      this.formData.append('file', fileToUpload, fileToUpload.name);
      this.createScrapAttachment.fileName = fileToUpload.name;
      this.createScrapAttachment.scrapFile = fileToUpload;
      this.AddFileToList();
    }
  }
  AddFileToList() {

    this.createScrapAttachment.scrapId = Number(this.scrapId)
    if (this.itmIndex.length === 0) {
      last_element = 1;
    }
    else if (this.itmIndex.length > 0) {
      var last_element = this.itmIndex[this.itmIndex.length - 1];
      last_element = last_element + 1;
    }
    this.itmIndex.push(last_element);
    let ext = this.createScrapAttachment.fileName.split('.').pop();
    var hCode = this.pad(this.currentUser.hospitalCode, 4);
    var srCode = this.pad(this.reqObj.requestCode, 10);
    var last = this.itmIndex[this.itmIndex.length - 1];
    let newIndex = this.pad((last).toString(), 2);
    let SRFileName = hCode + "SR" + srCode + newIndex;
    this.createScrapAttachment.fileName = SRFileName + "." + ext;

    this.lstCreateScrapAttachment.push(this.createScrapAttachment);
    this.createScrapAttachment = { id: 0, fileName: '', title: '', scrapFile: File, scrapId: 0 };



  }
  validateDates(sDate: string, eDate: string) {
    this.isValidDate = true;
    if ((sDate != null && eDate != null) && (eDate) < (sDate)) {
      if (this.lang == "en") {
        this.error = { isError: true, errorMessage: 'Scrap Date should be less than today Date' };
      }
      else {
        this.error = { isError: true, errorMessage: 'تاريخ التكهين لابد أن يكون أقل من تاريخ اليوم' };

      }

      this.isValidDate = false;
    }
    return this.isValidDate;
  }
  closeDialogue() {
    this.ref.close();
  }
  pad(num: string, size: number): string {
    while (num.length < size) num = "0" + num;
    return num;
  }
  selectedHEReasons($event, reasonId: number) {
    if ($event.checked) {
      this.lstSelectedReasonIds.push(reasonId);
    }
    else {
      var index = this.addHEReasons.indexOf($event.source.value);
      this.lstSelectedReasonIds.splice(index, 1);
    }
  }
  getScrapDate($event) {
    this.scrapObj.strScrapDate = this.datePipe.transform($event.value, "MM-dd-yyyy");
  }

  ViewAllAssetDetailByMasterId($event) {
    this.lstassetDetails = [];
    this.lstProblems = [];
    this.reqObj.problemId = 0;
    this.reqObj.subProblemId = 0;
    this.reqObj.assetDetailId = 0;

    this.assetDetailService.GetAssetNameByMasterAssetIdAndHospitalId($event.target.value, this.currentUser.hospitalId).subscribe(
      res => {
        this.lstassetDetails = res
      });

  }
  removeFileFromObjectArray(doc) {
    const index: number = this.lstCreateScrapAttachment.indexOf(doc);
    if (index !== -1) {
      this.lstCreateScrapAttachment.splice(index, 1);
    }
  }
  getBarCode(event) {
    this.assetDetailService.GetHospitalAssetById(event["id"]).subscribe(assetObj => {
      this.assetBarCodeObj = assetObj;
      this.assetSerialObj = assetObj;


      this.assetBarCodeObj.barCode = event["barCode"];
      this.assetSerialObj.serialNumber = event["serialNumber"];
      // this.scrapObj.masterAssetId = event["masterAssetId"];
      this.scrapObj.assetDetailId = assetObj["id"];
      this.scrapObj.model = assetObj["model"];
      this.scrapObj.brandName = assetObj["brandName"];
      this.scrapObj.brandNameAr = assetObj["brandNameAr"];
      this.scrapObj.departmentName = this.lang == "en" ? assetObj["departmentName"] : assetObj["departmentNameAr"];
    });
    this.masterAssetService.GetMasterAssetById2(Number(event["masterAssetId"])).subscribe(master => {
      this.masterAssetObj = master;
      this.masterAssetObj.master = master.nameAr + " - " + master.brandNameAr + " - " + master.model;
    });


  }
  onSelectionChanged(event) {
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
  getSerial(event) {

    this.assetDetailService.GetHospitalAssetById(event["id"]).subscribe(assetObj => {
      this.assetBarCodeObj = assetObj;
      this.assetSerialObj = assetObj;


      this.assetBarCodeObj.barCode = event["barCode"];
      this.assetSerialObj.serialNumber = event["serialNumber"];
      this.reqObj.masterAssetId = event["masterAssetId"];
      this.scrapObj.assetDetailId = assetObj["id"];
      this.scrapObj.model = assetObj["model"];
      this.scrapObj.brandName = assetObj["brandName"];
      this.scrapObj.brandNameAr = assetObj["brandNameAr"];
      this.scrapObj.departmentName = this.lang == "en" ? assetObj["departmentName"] : assetObj["departmentNameAr"];
    });

    this.masterAssetService.GetMasterAssetById2(Number(event["masterAssetId"])).subscribe(master => {
      this.masterAssetObj = master;
      this.masterAssetObj.master = master.nameAr + " - " + master.brandNameAr + " - " + master.model;
    });
  }
  onSerialSelectionChanged(event) {
    this.assetDetailService.AutoCompleteAssetSerial(event.query, this.currentUser.hospitalId).subscribe(assets => {
      this.lstSerials = assets;
      if (this.lang == "en") {
        this.lstSerials.forEach(item => item.serialNumber = item.serialNumber);
      }
      else {
        this.lstSerials.forEach(item => item.serialNumber = item.serialNumber);
      }
    });
  }
  back() { this.route.navigate(['/dash/scrap']); }





  onMasterAssetSelectionChanged(event) {
    this.masterAssetService.AutoCompleteMasterAssetName3(event.query, this.currentUser.hospitalId).subscribe(masters => {
      this.lstMasterAssets = masters;
      if (this.lang == "en") {
        this.lstMasterAssets.forEach(item => item.name = item.name + " - " + item.brandName + " - " + item.model + " - " + item.serialNumber);
      }
      else {
        this.lstMasterAssets.forEach(item => item.name = item.nameAr + " - " + item.brandNameAr + " - " + item.model + " - " + item.serialNumber);
      }
    });
  }
  getMasterObject(event) {
    //  this.scrapObj.masterAssetId = event["id"];

    this.scrapObj.assetDetailId = event["id"];
    this.assetDetailService.GetHospitalAssetById(event["id"]).subscribe(assetObj => {
      this.assetBarCodeObj = assetObj;
      this.assetSerialObj = assetObj;
      this.assetBarCodeObj.barCode = event["barCode"];
      this.assetSerialObj.serialNumber = event["serialNumber"];

      //  this.scrapObj.assetDetailId = assetObj["id"];
      this.scrapObj.model = assetObj["model"];
      this.scrapObj.brandName = assetObj["brandName"];
      this.scrapObj.brandNameAr = assetObj["brandNameAr"];
      this.scrapObj.departmentName = this.lang == "en" ? assetObj["departmentName"] : assetObj["departmentNameAr"];

    });
  }


}
