import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EditExternalFixVM, ViewExternalFixVM } from 'src/app/Shared/Models/ExternalFixVM';
import { ExternalFixService } from 'src/app/Shared/Services/external-fix.service';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateExternalFixFileVM } from 'src/app/Shared/Models/externalFixFilesVM';
import { AssetStatusTransactionVM } from 'src/app/Shared/Models/assetStatusTransactionVM';
import { AssetStatusTransactionService } from 'src/app/Shared/Services/assetStatusTransaction.service';
@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})

export class EditComponent implements OnInit {
  lang = localStorage.getItem('lang');
  currentUser: LoggedUser;
  textDir: string = 'ltr';
  id: number;
  editExternalFixVMObj: EditExternalFixVM;
  externalFixObj: ViewExternalFixVM;
  display: boolean = false;
  formData = new FormData();
  itmIndex: any[] = [];
  errorMessage: string;
  errorDisplay: boolean = false;
  isValidDate: boolean = false;
  error: any = { isError: false, errorMessage: '' };
  dateError: boolean = false;
  lstCreateExternalFixFiles: CreateExternalFixFileVM[] = [];
  createExternalFixFile: CreateExternalFixFileVM;
  assetobj: any;

  constructor(private authenticationService: AuthenticationService, private assetStatusTransactionService: AssetStatusTransactionService, private activeRoute: ActivatedRoute,
    public datePipe: DatePipe, private externalFixService: ExternalFixService,
    private uploadService: UploadFilesService, private route: Router, private ref: DynamicDialogRef) {
    this.currentUser = this.authenticationService.currentUserValue;
  }
  ngOnInit(): void {
    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }
    this.editExternalFixVMObj = {
      strComingDate: '', id: 0, comingDate: new Date(), comingNotes: '', isChecked: false
    };
    this.createExternalFixFile = { id: 0, fileName: '', externalFixId: 0, title: '', externalFixFile: File, hospitalId: 0 };

    this.externalFixObj = {
      id: 0,
      serialNumber: '', barcode: '', supplierName: '', supplierNameAr: '', departmentName: '', departmentNameAr: '', brandName: '', brandNameAr: '', assetName: '', assetNameAr: '', modelNumber: '',
      assetDetailId: 0, hospitalId: 0, assetStatusId: 0, outDate: new Date(), comingNotes: '', supplierId: 0, expectedDate: new Date(), notes: '', comingDate: new Date(), outNumber: '', listExternalFixFiles: []
    };
    // let id = this.config.data.id;
    let id = this.activeRoute.snapshot.params["id"];
    this.id = id
    this.externalFixService.ViewExternalFixById(id).subscribe(
      data => {
        this.externalFixObj = data;
      });
  }

  onSubmit() {



    let from = this.datePipe.transform(this.externalFixObj.outDate, "yyyy-MM-dd");
    let to = this.datePipe.transform(this.editExternalFixVMObj.comingDate, "yyyy-MM-dd");


    this.isValidDate = this.validateDates(from, to);
    if (!this.isValidDate) {
      this.dateError = true;
      return false;
    }


    this.editExternalFixVMObj.id = this.id;
    this.editExternalFixVMObj.strComingDate = this.datePipe.transform(this.editExternalFixVMObj.comingDate, "yyyy-MM-dd HH:mm:ss");
    this.externalFixService.UpdateExternalFix(this.editExternalFixVMObj).subscribe(
      res => {

        var statusObj = new AssetStatusTransactionVM();
        if (this.editExternalFixVMObj.isChecked == true) {
          statusObj.assetDetailId = this.externalFixObj.assetDetailId;
          statusObj.hospitalId = this.currentUser.hospitalId;
          statusObj.statusDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
          statusObj.assetStatusId = 3;
          this.assetStatusTransactionService.AddAssetStatusTransaction(statusObj).subscribe(addedStatus => {
          });

        }
        else {
          //function get last status of asset
          this.assetStatusTransactionService.GetLastTransactionByAssetId(this.externalFixObj.assetDetailId).subscribe(assetobj => {
            statusObj.assetDetailId = this.externalFixObj.assetDetailId;
            statusObj.hospitalId = this.currentUser.hospitalId;
            statusObj.assetStatusId = assetobj[0].assetStatusId;
            statusObj.statusDate = this.datePipe.transform(new Date(), "yyyy-MM-dd HH:mm:ss");
            this.assetStatusTransactionService.AddAssetStatusTransaction(statusObj).subscribe(addedStatus => {
            });
          });

        }

        if (this.lstCreateExternalFixFiles.length > 0) {
          this.lstCreateExternalFixFiles.forEach((item, index) => {
            item.externalFixId = Number(this.id);
            item.hospitalId = this.currentUser.hospitalId;
            this.externalFixService.CreateExternalFixFile(item).subscribe(fileObj => {
              this.uploadService.uploadExternalFixFiles(item.externalFixFile, item.fileName).subscribe(
                (event) => {
                  this.display = true;
                  //  this.isDisabled = true;
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


    this.createExternalFixFile.externalFixId = Number(this.id)
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
    var srCode = this.pad(this.externalFixObj.outNumber, 10);
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

  closeDialogue() {
    this.ref.close();
    this.route.navigate(['/dash/externalfix/']);
  }
  validateDates(sDate: string, eDate: string) {
    this.isValidDate = true;
    if ((sDate != null && eDate != null) && (eDate) < (sDate)) {
      if (this.lang == "en") {
        this.error = { isError: true, errorMessage: 'Contract start date should be less than end date.' };
      }
      else {
        this.error = { isError: true, errorMessage: 'ناريخ بداية العقد لابد أن يكون قبل تاريخ النهاية' };
      }
      this.isValidDate = false;
    }
    return this.isValidDate;
  }


}




