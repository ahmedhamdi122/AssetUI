import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateExternalFixVM } from 'src/app/Shared/Models/ExternalFixVM';
import { ListSupplierVM } from 'src/app/Shared/Models/supplierVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { ExternalFixService } from 'src/app/Shared/Services/external-fix.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { SupplierService } from 'src/app/Shared/Services/supplierService.service';
import { ListMasterAssetVM, MasterAssetVM } from 'src/app/Shared/Models/masterAssetVM';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { AssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';

import { CreateExternalFixFileVM } from 'src/app/Shared/Models/externalFixFilesVM';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';

import { AssetStatusTransactionVM } from 'src/app/Shared/Models/assetStatusTransactionVM';
import { AssetStatusTransactionService } from 'src/app/Shared/Services/assetStatusTransaction.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser
  externalfixObj: CreateExternalFixVM;
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  dateError: boolean = false;
  error: any = { isError: false, errorMessage: '' };

  masterAssetObj: MasterAssetVM;

  lstSuppliers: ListSupplierVM[] = [];
  lstMasterAssets: ListMasterAssetVM[] = [];

  selectedType: number = 1;
  lstTypes: FilterList2[] = [];
  showBarcode: boolean = false;
  showSerial: boolean = false;
  showName: boolean = false;

  assetBarCodeObj: any;
  masterAssetObj1: any;
  assetSerialObj: any;
  lstHospitalAssets: AssetDetailVM[] = [];
  lstSerials: AssetDetailVM[] = [];
  lstassetDetailBarcodes: AssetDetailVM[] = [];
  lstassetDetails: AssetDetailVM[] = [];
  lstMasterAsset: MasterAssetVM[] = [];

  assetStatusId: number;
  isDisabled: boolean = false;
  applicationStatus: string = "";


  lstCreateExternalFixFiles: CreateExternalFixFileVM[] = [];
  createExternalFixFile: CreateExternalFixFileVM;
  externalFixId: number;
  formData = new FormData();
  itmIndex: any[] = [];

  constructor(private authenticationService: AuthenticationService, private externalfixService: ExternalFixService, private masterAssetService: MasterAssetService, private assetDetailService: AssetDetailService,
    private supplierService: SupplierService, private uploadService: UploadFilesService, private assetStatusTransactionService: AssetStatusTransactionService,
    private route: Router, private ref: DynamicDialogRef, private datePipe: DatePipe
  ) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.externalfixObj = { strOutDate: '', strExpectedDate: '', assetStatusId: 0, masterAssetId: 0, id: 0, assetDetailId: 0, outDate: new Date(), comingNotes: '', hospitalId: 0, supplierId: 0, expectedDate: new Date(), notes: '', comingDate: '', outNumber: '' }
    this.createExternalFixFile = { id: 0, fileName: '', externalFixId: 0, title: '', externalFixFile: File, hospitalId: 0 };

    this.supplierService.GetSuppliers().subscribe(suppliers => {
      this.lstSuppliers = suppliers;
    });

    this.masterAssetService.GetMasterAssets().subscribe(masters => { this.lstMasterAssets = masters });

    this.lstTypes = [{ id: 1, name: "Select By Barcode", nameAr: "بحث بالباركود" },
    { id: 2, name: "Select By Serial", nameAr: "بحث بالسيريال" },
    { id: 3, name: "Select By Name", nameAr: "بحث بالإسم" }]
    this.selectedType = 1;

    this.showBarcode = true;
    this.showSerial = false;
    this.showName = false;


    this.masterAssetService.GetMasterAssets().subscribe(
      res => {
        this.lstMasterAsset = res
      });

    this.externalfixService.GenerateExternalFixNumber().subscribe(num => {
      this.externalfixObj.outNumber = num.outNumber;
    });
  }
  onSubmit() {
    if (this.externalfixObj.assetDetailId == 0) {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select asset";
      }
      else {
        this.errorMessage = "من فضلك اختر جهاز";
      }
      return false;
    }

    this.externalfixObj.hospitalId = this.currentUser.hospitalId;
    this.externalfixObj.strOutDate = this.datePipe.transform(this.externalfixObj.outDate, "yyyy-MM-dd HH:mm:ss");
    this.externalfixObj.strExpectedDate = this.datePipe.transform(this.externalfixObj.expectedDate, "yyyy-MM-dd HH:mm:ss");

    this.externalfixService.CreateExternalFix(this.externalfixObj).subscribe(addedObj => {
      var statusObj = new AssetStatusTransactionVM();
      statusObj.assetDetailId = this.externalfixObj.assetDetailId;
      statusObj.hospitalId = this.currentUser.hospitalId;
      statusObj.statusDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
      statusObj.assetStatusId = 1;
      this.assetStatusTransactionService.AddAssetStatusTransaction(statusObj).subscribe(addedStatus => {
      });

      if (this.lstCreateExternalFixFiles.length > 0) {
        this.lstCreateExternalFixFiles.forEach((item, index) => {
          item.externalFixId = Number(addedObj);
          item.hospitalId = this.currentUser.hospitalId;
          this.externalfixService.CreateExternalFixFile(item).subscribe(fileObj => {
            this.uploadService.uploadExternalFixFiles(item.externalFixFile, item.fileName).subscribe(
              (event) => {
                this.display = true;
                this.isDisabled = true;
                //  this.ref.close();
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
        this.lstCreateExternalFixFiles = [];
        this.display = true;

      }
      else {
        this.display = true;
      }
    });
  }

  uploadFile = (files) => {
    if (this.createExternalFixFile.title == "") {
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
      this.createExternalFixFile.fileName = fileToUpload.name;
      this.createExternalFixFile.externalFixFile = fileToUpload;
      this.AddFileToList();
    }
  }
  AddFileToList() {


    this.createExternalFixFile.externalFixId = Number(this.externalFixId)
    if (this.itmIndex.length === 0) {
      last_element = 1;
    }
    else if (this.itmIndex.length > 0) {
      var last_element = this.itmIndex[this.itmIndex.length - 1];
      last_element = last_element + 1;
    }
    this.itmIndex.push(last_element);
    let ext = this.createExternalFixFile.fileName.split('.').pop();
    var hCode = this.pad(this.currentUser.hospitalCode, 4);
    var srCode = this.pad(this.externalfixObj.outNumber, 10);
    var last = this.itmIndex[this.itmIndex.length - 1];
    let newIndex = this.pad((last).toString(), 2);
    let SRFileName = hCode + "ExtrnFix" + srCode + newIndex;
    this.createExternalFixFile.fileName = SRFileName + "." + ext;

    this.lstCreateExternalFixFiles.push(this.createExternalFixFile);
    this.createExternalFixFile = { id: 0, fileName: '', externalFixId: 0, title: '', externalFixFile: File, hospitalId: 0 };



  }

  pad(num: string, size: number): string {
    while (num.length < size) num = "0" + num;
    return num;
  }
  removeFileFromObjectArray(doc) {
    const index: number = this.lstCreateExternalFixFiles.indexOf(doc);
    if (index !== -1) {
      this.lstCreateExternalFixFiles.splice(index, 1);
    }
  }
  back() { this.route.navigate(['/dash/externalfix']); }
  closeDialogue() {
    this.ref.close();
    this.route.navigate(['/dash/externalfix']);
  }
  getBarCode(event: any) {

    this.assetBarCodeObj.barCode = event["barCode"];
    this.assetBarCodeObj.id = event["id"];
    this.externalfixObj.assetDetailId = event["id"];
    this.externalfixObj.assetStatusId = this.assetBarCodeObj["assetStatusId"];


    this.assetDetailService.GetAssetNameByMasterAssetIdAndHospitalId(Number(event["masterAssetId"]), this.currentUser.hospitalId).subscribe(
      res => {
        this.lstassetDetails = res;
        this.externalfixObj.assetDetailId = event["id"];
        this.externalfixObj.masterAssetId = event["masterAssetId"];

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
              this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه خارج للصيانة ";
            }
            this.isDisabled = true;
          }
          if (this.assetStatusId == 2) {
            this.errorDisplay = true;
            if (this.lang == "en") {
              this.errorMessage = "You cannot make ticket for this asset because it is InActive";
            }
            else {
              this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه مكهن ";
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
              this.errorMessage = "You cannot make ticket for this asset because it is Shut Down";
            }
            else {
              this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه تم خروج الجهاز من المستشفى ";
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
  getMasterAssetObject(event) {
    this.lstHospitalAssets = [];
    this.masterAssetObj1.id = event["id"];
    this.externalfixObj.assetDetailId = event["id"];

    this.assetDetailService.GetAssetNameByMasterAssetIdAndHospitalId(event["id"], this.currentUser.hospitalId).subscribe(assets => {
      this.lstHospitalAssets = assets;
    });
  }
  getSerial(event) {
    this.assetSerialObj.serialNumber = event["serialNumber"];
    this.assetSerialObj.id = event["id"];
    this.externalfixObj.assetDetailId = event["id"];
    this.externalfixObj.assetStatusId = this.assetSerialObj["assetStatusId"];
    this.assetDetailService.GetAssetNameByMasterAssetIdAndHospitalId(Number(event["masterAssetId"]), this.currentUser.hospitalId).subscribe(
      res => {
        this.lstassetDetails = res;

        this.assetDetailService.GetHospitalAssetById(this.assetSerialObj.id).subscribe(assetObj => {
          this.assetSerialObj = assetObj;

          this.applicationStatus = this.lang == "en" ? this.assetSerialObj["assetStatus"] : this.assetSerialObj["assetStatusAr"];
          this.assetSerialObj.serialNumber = assetObj["serialNumber"];

          this.externalfixObj.masterAssetId = assetObj["masterAssetId"];


          //AssetStatusId
          this.assetStatusId = this.assetSerialObj["assetStatusId"];
          if (this.assetStatusId == 1) {
            this.errorDisplay = true;
            if (this.lang == "en") {
              this.errorMessage = "You cannot make ticket for this asset because it Needs Repair";
            }
            else {
              this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه يحتاج لإصلاح ";
            }
            this.isDisabled = true;
          }
          if (this.assetStatusId == 2) {
            this.errorDisplay = true;
            if (this.lang == "en") {
              this.errorMessage = "You cannot make ticket for this asset because it is InActive";
            }
            else {
              this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه غير فعال";
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
              this.errorMessage = "You cannot make ticket for this asset because it is Shut Down";
            }
            else {
              this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه متوقف ";
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
            this.isDisabled = true;
          }


        });
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
  onTypeChange($event) {
    let typeId = $event.value;
    this.selectedType = typeId;
    if (this.selectedType == 1) {
      this.showBarcode = true;
      this.showSerial = false;
      this.showName = false;


      // this.assetSerialObj = null;
      // this.masterAssetObj1 = null;
      // this.lstMasterAsset =[];
      // this.masterAssetService.GetMasterAssets().subscribe(
      //   res => {
      //     this.lstMasterAsset = res
      //   });

    }
    if (this.selectedType == 2) {
      this.showBarcode = false;
      this.showSerial = true;
      this.showName = false;
      // this.assetBarCodeObj = null;
      // this.assetSerialObj = null;
      // this.masterAssetObj1 = null;

      // this.lstMasterAsset =[];
      // this.masterAssetService.GetMasterAssets().subscribe(
      //   res => {
      //     this.lstMasterAsset = res
      //   });
    }

    if (this.selectedType == 3) {
      this.showBarcode = false;
      this.showSerial = false;
      this.showName = true;
      // this.assetBarCodeObj = null;
      // this.assetSerialObj = null;
      // this.masterAssetObj1 = null;

      // this.lstMasterAsset =[];
      // this.masterAssetService.GetMasterAssets().subscribe(
      //   res => {
      //     this.lstMasterAsset = res
      //   });
    }
  }

}


export class FilterList2 {
  id: number;
  name: string;
  nameAr: string;
}