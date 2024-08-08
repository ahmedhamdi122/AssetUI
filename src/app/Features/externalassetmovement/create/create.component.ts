import { Component, OnInit } from '@angular/core';
import { CreateExternalAssetMovementAttachmentVM } from '../../../Shared/Models/externalAssetMovementAttachment';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { ExternalAssetMovementService } from 'src/app/Shared/Services/externalAssetMovement.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { CreateExternalAssetMovementVM, ListExternalAssetMovementVM } from 'src/app/Shared/Models/externalAssetMovementVM';
import { DatePipe } from '@angular/common';
import { AssetStatusTransactionService } from 'src/app/Shared/Services/assetStatusTransaction.service';
import { CreateAssetStatusTransactionVM } from 'src/app/Shared/Models/assetStatusTransactionVM';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { AssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { Router } from '@angular/router';

import { HospitalService } from 'src/app/Shared/Services/hospital.service';

import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  isDisabled: boolean = false;
  lstassetDetailBarcodes: AssetDetailVM[] = [];
  lstassetDetails: AssetDetailVM[] = [];
  applicationStatus: string = "";
  assetStatusId: number = 0;
  assetBarCodeObj: AssetDetailVM;

  externalAssetMovementObj: CreateExternalAssetMovementVM;
  createExternalAssetMovementAttachmentObj: CreateExternalAssetMovementAttachmentVM;
  lstCreateExternalAssetMovementFiles: CreateExternalAssetMovementAttachmentVM[] = [];
  lstExternalMovements: ListExternalAssetMovementVM[] = [];

  itmIndex: any[] = [];

  showBarcode: boolean = false;
  departmentName: string;
  brandName: string;
  serialNumber: string;
  modelNumber: string;
  barCode: string;
  isAdmin: boolean = false;
  lstHospitals: ListHospitalVM[] = [];
  lstRoleNames: string[] = [];

  constructor(private authenticationService: AuthenticationService, private assetStatusTransactionService: AssetStatusTransactionService,
    private assetDetailService: AssetDetailService, private externalAssetMovementService: ExternalAssetMovementService,
    private ref: DynamicDialogRef, private route: Router,private hospitalService: HospitalService,
    private uploadService: UploadFilesService, private datePipe: DatePipe) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {

    this.externalAssetMovementObj = { assetDetailId: 0, movementDate: '', hospitalName: '', notes: '' ,hospitalId:0}
    this.createExternalAssetMovementAttachmentObj = { id: 0, fileName: '', externalAssetMovementId: 0, title: '', externalAssetMovementFile: File, hospitalId: 0 };


    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });
      this.isAdmin = (['Admin'].some(r => this.lstRoleNames.includes(r)));
    }

    
    this.hospitalService.GetHospitals().subscribe(hospitals => {
      this.lstHospitals = hospitals;
    });
  }

  getBarCode(event) {
    this.assetBarCodeObj.barCode = event["barCode"];
    this.assetBarCodeObj.id = event["id"];
    this.externalAssetMovementObj.assetDetailId = event["id"];

    this.showBarcode = true;
    this.brandName = this.lang == 'en' ? event["brandName"] : event["brandNameAr"];
    this.departmentName = this.lang == 'en' ? event["departmentName"] : event["departmentNameAr"];
    this.modelNumber = event["model"];
    this.serialNumber = event["serialNumber"];
    this.barCode = event["barCode"];


    this.assetDetailService.GetHospitalAssetById(this.assetBarCodeObj.id).subscribe(assetObj => {
      this.assetBarCodeObj = assetObj;

      this.applicationStatus = this.lang == "en" ? this.assetBarCodeObj["assetStatus"] : this.assetBarCodeObj["assetStatusAr"];
      this.assetBarCodeObj.name = assetObj["barcode"];
      this.assetStatusId = this.assetBarCodeObj["assetStatusId"];
      if (this.assetStatusId == 1) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it Needs Repair";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه خارج لإصلاح ";
        }
        this.isDisabled = true;
      }
      if (this.assetStatusId == 2) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Scrapped";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه  مكهن";
        }
        this.isDisabled = true;
      }
      if (this.assetStatusId == 4) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Under Maintenance";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه تحت الصيانة";
        }
        this.isDisabled = true;

      }
      if (this.assetStatusId == 5) {

        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Under Installation";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه  تحت الإنشاء";
        }
        this.isDisabled = true;

      }
      if (this.assetStatusId == 6) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is not working ";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه لا يعمل ";
        }
        this.isDisabled = true;

      }
      if (this.assetStatusId == 7) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Moved outside hospital";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه نقل خارج المستشفى ";
        }
        this.isDisabled = true;

      }
      if (this.assetStatusId == 8) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Excluded";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه مستبعد ";
        }
        this.isDisabled = true;

      }
      if (this.assetStatusId == 9) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Hold";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه في حالة إيقاف مؤقت ";
        }
        this.isDisabled = true;

      }
      else {
        this.isDisabled = false;
      }
    });

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
    else
    {
      this.assetDetailService.AutoCompleteAssetBarCode(event.query, this.externalAssetMovementObj.hospitalId).subscribe(assets => {
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

  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);
    this.createExternalAssetMovementAttachmentObj.fileName = fileToUpload.name;
    this.createExternalAssetMovementAttachmentObj.externalAssetMovementFile = fileToUpload;
    this.createExternalAssetMovementAttachmentObj.hospitalId = this.currentUser.hospitalId;
    this.addFilesToList();
  };
  addFilesToList() {

    if (this.itmIndex.length === 0) {
      last_element = 1;
    }
    else if (this.itmIndex.length > 0) {
      var last_element = this.itmIndex[this.itmIndex.length - 1];
      last_element = last_element + 1;
    }
    this.itmIndex.push(last_element);

    let ext = this.createExternalAssetMovementAttachmentObj.fileName.split('.').pop();
    var hCode = this.pad(this.currentUser.hospitalCode, 4);
    // var srCode = this.pad(this.reqObj.requestCode, 10);
    var last = this.itmIndex[this.itmIndex.length - 1];
    let newIndex = this.pad((last).toString(), 2);
    let SRFileName = hCode + "AssetMove" + newIndex;
    this.createExternalAssetMovementAttachmentObj.fileName = SRFileName + "." + ext;

    this.lstCreateExternalAssetMovementFiles.push(this.createExternalAssetMovementAttachmentObj);
    this.createExternalAssetMovementAttachmentObj = { id: 0, fileName: '', externalAssetMovementId: 0, title: '', externalAssetMovementFile: File, hospitalId: 0 };


  }
  removeFileFromObjectArray(doc) {
    const index: number = this.lstCreateExternalAssetMovementFiles.indexOf(doc);
    if (index !== -1) {
      this.lstCreateExternalAssetMovementFiles.splice(index, 1);
    }
  }
  pad(num: string, size: number): string {
    while (num.length < size) num = "0" + num;
    return num;
  }
  addExternalLocation() {

    if (this.externalAssetMovementObj.assetDetailId == 0) {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select asset";
      }
      else {
        this.errorMessage = "اختر أصل";
      }
      return false;
    }
    else {
      this.externalAssetMovementService.CreateExternalAssetMovement(this.externalAssetMovementObj).subscribe(assetMoveId => {
        this.display = true;
        var assetStatusTrans = new CreateAssetStatusTransactionVM();
        assetStatusTrans.assetDetailId = this.externalAssetMovementObj.assetDetailId;
        assetStatusTrans.statusDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
        assetStatusTrans.hospitalId = this.currentUser.hospitalId;
        assetStatusTrans.assetStatusId = 7;
        this.assetStatusTransactionService.CreateAssetStatusTransaction(assetStatusTrans).subscribe(item => { });
        if (this.lstCreateExternalAssetMovementFiles.length > 0) {
          this.lstCreateExternalAssetMovementFiles.forEach((item, index) => {
            item.externalAssetMovementId = Number(assetMoveId);

            this.externalAssetMovementService.CreatetExternalAssetMovementAttachment(item).subscribe(fileObj => {
              this.uploadService.uploadExternalAssetMovementFiles(item.externalAssetMovementFile, item.fileName).subscribe(
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
          this.lstCreateExternalAssetMovementFiles = [];
          this.display = true;
          this.route.navigate(['/dash/externalassetmovement']);
        }
        else {
          this.display = true;
          this.route.navigate(['/dash/externalassetmovement']);
        }

        this.externalAssetMovementService.GetExternalAssetMovementByAssetDetailId(this.externalAssetMovementObj.assetDetailId).subscribe(lst => {
          this.lstExternalMovements = lst;
        });
      });
    }

  }

  back() { this.route.navigate(['/dash/externalassetmovement']); }



  closeDialogue() {
    this.ref.close();
    this.route.navigate(['/dash/externalassetmovement']);
  }
}
