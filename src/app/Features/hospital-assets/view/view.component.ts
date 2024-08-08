import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AssetDetailAttachmentVM, ViewAssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { environment } from 'src/environments/environment';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  currentUser: LoggedUser;
  assetObj: ViewAssetDetailVM;
  public assetName: string = "";
  public hospitalName: string = "";
  lstAttachment: AssetDetailAttachmentVM[] = [];
  imgURL: string = "";
  public elementType = NgxQrcodeElementTypes.CANVAS;
  public correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;

  public width = 80;
  constructor(private datePipe: DatePipe, private assetDetailService: AssetDetailService, private config: DynamicDialogConfig, private authenticationService: AuthenticationService) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }

    this.assetObj = {
      governorateNameAr: '', cityNameAr: '', orgNameAr: '', subOrgNameAr: '', contractDate: '', contractEndDate: '', contractStartDate: '',
      categoryNameAr: '', periorityName: '', periorityNameAr: '', remainWarrantyExpires: '', remainWarrantyExpiresAr: '', warrantyExpiresAr: '',
      buildId: 0, roomId: 0, floorId: 0, masterAssetId: 0, barCode: '', hospitalId: 0, id: 0, assetImg: '', code: '', masterCode: '', purchaseDate: '', price: '', serialNumber: '', remarks: '', barcode: '', installationDate: '', warrantyExpires: '', room: '', floor: '', assetName: '', assetNameAr: '', supplierName: '', brandName: '', brandNameAr: '', hospitalName: '', originName: '', originNameAr: '', categoryName: '', subCategoryName: '', governorateName: '', cityName: '', orgName: '', subOrgName: '', length: '', height: '', width: '', weight: '', modelNumber: '',
      versionNumber: '', description: '', descriptionAr: '', costCenter: '', depreciationRate: '', expectedLifeTime: '', warrantyEnd: '', warrantyStart: '', departmentName: '', departmentNameAr: '', hospitalNameAr: '', supplierNameAr: '', buildName: '', receivingDate: '', operationDate: '', poNumber: '', buildNameAr: '', floorName: '', floorNameAr: '', roomName: '', roomNameAr: '', contractFrom: '', contractTo: ''
      , assetStatusAr: '', assetStatus: '', qrFilePath: '', listRequests: [], listWorkOrders: [], createdBy: '', strInstallationDate: '', strOperationDate: '', strPurchaseDate: '', inContract: '', inContractAr: ''
    }



    let id = this.config.data.id;
    this.assetDetailService.ViewAssetDetailByMasterId(id).subscribe(
      data => {
        this.assetObj = data;


        if (this.assetObj.contractDate != "") {
          let splitContractDate = this.assetObj.contractDate.split('/');
          let contractmonth = splitContractDate[0];
          let contractday = splitContractDate[1];
          let contractyear = splitContractDate[2];
          if (contractyear != "1900") {
            let newContractDate = Number(contractyear).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(contractmonth).toLocaleString("ar-SA") + "/" + Number(contractday).toLocaleString("ar-SA");
            this.assetObj.contractDate = newContractDate;
          }
          else {
            this.assetObj.contractDate = "";
          }
        }
        if (this.assetObj.contractStartDate != "") {
          let splitContractStartDate = this.assetObj.contractStartDate.split('/');
          let contractStartmonth = splitContractStartDate[0];
          let contractStartday = splitContractStartDate[1];
          let contractStartyear = splitContractStartDate[2];
          if (contractStartyear != "1900") {
            let newContractStartDate = Number(contractStartyear).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(contractStartmonth).toLocaleString("ar-SA") + "/" + Number(contractStartday).toLocaleString("ar-SA");
            this.assetObj.contractStartDate = newContractStartDate;
          }
          else {
            this.assetObj.contractStartDate = "";
          }
        }

        if (this.assetObj.contractEndDate != "") {
          let splitContractEndDate = this.assetObj.contractEndDate.split('/');
          let contractEndmonth = splitContractEndDate[0];
          let contractEndday = splitContractEndDate[1];
          let contractEndyear = splitContractEndDate[2];
          if (contractEndyear != "1900") {
            let newContractEndDate = Number(contractEndyear).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(contractEndmonth).toLocaleString("ar-SA") + "/" + Number(contractEndday).toLocaleString("ar-SA");
            this.assetObj.contractEndDate = newContractEndDate;
          }
          else {
            this.assetObj.contractEndDate = "";
          }
        }
        if (this.assetObj.operationDate != "") {

          let splitOperationDateDate = this.assetObj.operationDate.split('/');
          let month = splitOperationDateDate[0];
          let day = splitOperationDateDate[1];
          let year = splitOperationDateDate[2];
          if (year != "1900") {
            let newOperationDate = Number(year).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(month).toLocaleString("ar-SA") + "/" + Number(day).toLocaleString("ar-SA");
            this.assetObj.operationDate = newOperationDate;
          } else {
            this.assetObj.operationDate = "";
          }
        }
        if (this.assetObj.purchaseDate != "") {
          let splitPurchaseDate = this.datePipe.transform(this.assetObj.purchaseDate, "MM/dd/yyyy").split('/');
          let pmonth = splitPurchaseDate[0];
          let pday = splitPurchaseDate[1];
          let pyear = splitPurchaseDate[2];

          if (pyear != "1900") {
            let newPurchaseDate = Number(pyear).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(pmonth).toLocaleString("ar-SA") + "/" + Number(pday).toLocaleString("ar-SA");
            this.assetObj.purchaseDate = newPurchaseDate;
          } else {
            this.assetObj.purchaseDate = "";
          }
        }


        if (this.assetObj.receivingDate != "") {
          let splitReceiveDate = this.assetObj.receivingDate.split('/');
          let rmonth = splitReceiveDate[0];
          let rday = splitReceiveDate[1];
          let ryear = splitReceiveDate[2];

          if (ryear != "1900") {
            let newReceiveDate = Number(ryear).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(rmonth).toLocaleString("ar-SA") + "/" + Number(rday).toLocaleString("ar-SA");
            this.assetObj.receivingDate = newReceiveDate;
          } else {
            this.assetObj.receivingDate = "";
          }
        }

        if (this.assetObj.installationDate != "") {
          let splitInstallDate = this.assetObj.installationDate.split('/');
          let inmonth = splitInstallDate[0];
          let inday = splitInstallDate[1];
          let inyear = splitInstallDate[2];
          if (inyear != "1900") {
            let newInstallDate = Number(inyear).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(inmonth).toLocaleString("ar-SA") + "/" + Number(inday).toLocaleString("ar-SA");
            this.assetObj.installationDate = newInstallDate;
          } else {
            this.assetObj.installationDate = "";
          }
        }


        if (this.assetObj.warrantyStart != "") {
          let splitWarrantyStartDate = this.assetObj.warrantyStart.split('/');
          let warrantyStartMonth = splitWarrantyStartDate[0];
          let warrantyStartDay = splitWarrantyStartDate[1];
          let warrantyStartYear = splitWarrantyStartDate[2];

          if (warrantyStartYear != "1900") {
            let newWarrantyStartDate = Number(warrantyStartYear).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(warrantyStartMonth).toLocaleString("ar-SA") + "/" + Number(warrantyStartDay).toLocaleString("ar-SA");
            this.assetObj.warrantyStart = newWarrantyStartDate;
          } else {
            this.assetObj.warrantyStart = "";
          }
        }





        if (this.assetObj.warrantyEnd != "") {
          let splitWarrantyEndDate = this.assetObj.warrantyEnd.split('/');
          let warrantyEndMonth = splitWarrantyEndDate[0];
          let warrantyEndDay = splitWarrantyEndDate[1];
          let warrantyEndYear = splitWarrantyEndDate[2];
          if (warrantyEndYear != "1900") {
            let newWarrantyEndDate = Number(warrantyEndYear).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(warrantyEndMonth).toLocaleString("ar-SA") + "/" + Number(warrantyEndDay).toLocaleString("ar-SA");
            this.assetObj.warrantyEnd = newWarrantyEndDate;
          } else {
            this.assetObj.warrantyEnd = "";
          }
        }

        this.assetName = this.assetObj["assetName"];

        if (this.lang == "en")
          this.hospitalName = this.assetObj["hospitalName"];
        else
          this.hospitalName = this.assetObj["hospitalNameAr"];


        if (data["assetImg"] == "" || data["assetImg"] == null) {
          this.imgURL = `${environment.Domain}UploadedAttachments/MasterAssets/UploadMasterAssetImage/UnknownAsset.png`;
        }
        else {
          this.imgURL = `${environment.Domain}UploadedAttachments/MasterAssets/UploadMasterAssetImage/` + data["assetImg"];
        }
      });

    this.assetDetailService.GetAttachmentByAssetDetailId(id).subscribe(
      (files => {
        this.lstAttachment = files;
      }), (error => console.log(error)));
  }

  // getBase64Image(img) {
  //   var canvas = document.createElement("canvas");
  //   canvas.width = 200;//img.width;
  //   canvas.height = 200;//img.height;
  //   var ctx = canvas.getContext("2d");
  //   ctx.drawImage(img, 0, 0);
  //   var dataURL = canvas.toDataURL("image/jpg");
  //   return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
  // }
  // downloadFile(fileName) {
  //   var filePath = `${environment.Domain}UploadedAttachments/`;

  //   this.uploadService.downloadAssetDetailFile(fileName).subscribe(file => {
  //     var dwnldFile = filePath + 'AssetDetails/' + fileName;
  //     if (fileName != "" || fileName != null)
  //       window.open(dwnldFile);
  //   });
  // }

  public convetToPDF() {
    window.print();
  }
}
