import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { CreateWNPMAssetTimeAttachment, EditWNPMAssetTimeVM, ListWNPMAssetTimeAttachment } from 'src/app/Shared/Models/wnPMAssetTimeVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { WNPMAssetTimeService } from 'src/app/Shared/Services/wnPMAssetTime.service';
import { PrimeNGConfig } from "primeng/api";
import { DatePipe } from '@angular/common';
import { SupplierService } from 'src/app/Shared/Services/supplierService.service';
import { ListSupplierVM } from 'src/app/Shared/Models/supplierVM';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-add-pmdone',
  templateUrl: './add-pmdone.component.html',
  styleUrls: ['./add-pmdone.component.css']
})
export class AddPMDoneComponent implements OnInit {

  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  id: number;
  itemIndex: number;
  wnpmAssetTaskObj: EditWNPMAssetTimeVM;
  lstRoleNames: string[] = [];
  lstSuppliers: ListSupplierVM[] = [];

  errorDisplay: boolean;
  display: boolean;
  errorMessage: string = "";
  isVisible: boolean = false;
  isDisabled: boolean = false;
  isValidPlannedDate: boolean = false;
  isValidDate: boolean = false;
  error: any = { isError: false, errorMessage: '' };
  isDelay: boolean = false;
  isDoneDate: boolean = false;
  isAgency: boolean = false;

  listWNPMAssetTimeAttachments: ListWNPMAssetTimeAttachment[] = [];
  lstCreateWNPMAssetTimeAttachments: CreateWNPMAssetTimeAttachment[] = [];
  createWNPMAssetTimeAttachment: CreateWNPMAssetTimeAttachment;
  itmIndex: any[] = [];
  wnpmAssetTimeId: any;
  formData = new FormData();


  constructor(private authenticationService: AuthenticationService, private primengConfig: PrimeNGConfig, private uploadService: UploadFilesService,
    private wnPMAssetTimeService: WNPMAssetTimeService, private ref: DynamicDialogRef, private datePipe: DatePipe,
    private config: DynamicDialogConfig, private supplierService: SupplierService) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.wnpmAssetTaskObj = { strDoneDate: '', agencyId: 0, strDueDate: '', assetDetailId: 0, doneDate: new Date, dueDate: new Date, hospitalId: 0, id: 0, isDone: false, pmDate: new Date, comment: '' };
    this.createWNPMAssetTimeAttachment = { id: 0, fileName: '', wnpmAssetTimeId: 0, title: '', wnpmFile: File, hospitalId: 0 };

    this.errorDisplay = false;
    this.display = false;

    this.primengConfig.ripple = true;

    this.isAgency = this.currentUser.isAgency;

    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });
    }

    if (this.config.data != null || this.config.data != undefined) {
      this.id = this.config.data.id;
      this.itemIndex = this.config.data.itemIndex;

      if (this.itemIndex == 0) {
        this.isDelay = false;
        this.isDoneDate = true;
      }
      else if (this.itemIndex == 1) {
        this.isDelay = true;
        this.isDoneDate = false;
      }

      this.wnPMAssetTimeService.GetWNAssetTimeById(this.id).subscribe(assetTimeObj => {
        this.wnpmAssetTaskObj = assetTimeObj;
        this.wnpmAssetTaskObj.dueDate = new Date(this.wnpmAssetTaskObj.dueDate);
        if (this.wnpmAssetTaskObj.agencyId == null) {
          this.wnpmAssetTaskObj.agencyId = 0;

          if (this.wnpmAssetTaskObj.doneDate == null)
            this.wnpmAssetTaskObj.doneDate = new Date();
          else
            this.wnpmAssetTaskObj.doneDate = this.wnpmAssetTaskObj.doneDate;



          if (this.wnpmAssetTaskObj.strDoneDate == null)
            this.wnpmAssetTaskObj.doneDate = new Date();
          else
            this.wnpmAssetTaskObj.doneDate = this.wnpmAssetTaskObj.doneDate;


          if (this.wnpmAssetTaskObj.strDueDate == null)
            this.wnpmAssetTaskObj.dueDate = new Date();
          else
            this.wnpmAssetTaskObj.dueDate = this.wnpmAssetTaskObj.dueDate;
        }

        this.wnPMAssetTimeService.GetWNPMAssetTimeAttachmentByWNPMAssetTimeId(assetTimeObj.id).subscribe(lstWNPMAssetTimeAttachments => {
          this.listWNPMAssetTimeAttachments = lstWNPMAssetTimeAttachments;
        });
      });
    }

    this.supplierService.GetSuppliers().subscribe(listSuppliers => { this.lstSuppliers = listSuppliers; });
  }

  onSubmit() {
    if (this.itemIndex == 0) {
      this.isDelay = false;
      this.isDoneDate = true;
      this.wnpmAssetTaskObj.isDone = true;
      this.wnpmAssetTaskObj.strDoneDate = this.datePipe.transform(this.wnpmAssetTaskObj.doneDate, "yyyy-MM-dd HH:mm:ss");
      this.wnPMAssetTimeService.UpdateWNAssetTime(this.wnpmAssetTaskObj).subscribe(updated => {
        if (this.lstCreateWNPMAssetTimeAttachments.length > 0) {
          this.lstCreateWNPMAssetTimeAttachments.forEach((item, index) => {
            item.wnpmAssetTimeId = Number(this.wnpmAssetTaskObj.id);
            item.hospitalId = this.currentUser.hospitalId;
            this.wnPMAssetTimeService.CreateWNPMAssetTimeAttachment(item).subscribe(fileObj => {
              this.uploadService.uploadWNPMAssetTimeFiles(item.wnpmFile, item.fileName).subscribe(
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
          this.lstCreateWNPMAssetTimeAttachments = [];
        }
        else {
          this.display = true;
          this.isDisabled = true;
        }
      });
    }
    else if (this.itemIndex == 1) {
      this.isDelay = true;
      this.isDoneDate = false;
      if (this.wnpmAssetTaskObj.dueDate == null) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please select date";
        }
        else {
          this.errorMessage = "من فضلك اختر تاريخ";
        }
        return false;
      }
      this.wnpmAssetTaskObj.strDueDate = this.datePipe.transform(this.wnpmAssetTaskObj.dueDate, "yyyy-MM-dd HH:mm:ss");
      this.wnPMAssetTimeService.UpdateWNAssetTime(this.wnpmAssetTaskObj).subscribe(updated => {
        if (this.lstCreateWNPMAssetTimeAttachments.length > 0) {
          this.lstCreateWNPMAssetTimeAttachments.forEach((item, index) => {
            item.wnpmAssetTimeId = Number(this.wnpmAssetTaskObj.id);
            item.hospitalId = this.currentUser.hospitalId;
            this.wnPMAssetTimeService.CreateWNPMAssetTimeAttachment(item).subscribe(fileObj => {
              this.uploadService.uploadWNPMAssetTimeFiles(item.wnpmFile, item.fileName).subscribe(
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
          this.lstCreateWNPMAssetTimeAttachments = [];
        }
        else {
          this.display = true;
          this.isDisabled = true;
        }
      });
    }
  }
  closeDialogue() {
    this.ref.close();
  }

  public uploadFile = (files) => {
    if (this.createWNPMAssetTimeAttachment.title == "") {
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
      this.createWNPMAssetTimeAttachment.fileName = fileToUpload.name;
      this.createWNPMAssetTimeAttachment.wnpmFile = fileToUpload;
      this.AddFileToList();
    }
  }
  AddFileToList() {
    this.createWNPMAssetTimeAttachment.wnpmAssetTimeId = this.wnpmAssetTaskObj.id;
    if (this.itmIndex.length === 0) {
      last_element = 1;
    }
    else if (this.itmIndex.length > 0) {
      var last_element = this.itmIndex[this.itmIndex.length - 1];
      last_element = last_element + 1;
    }
    this.itmIndex.push(last_element);
    let ext = this.createWNPMAssetTimeAttachment.fileName.split('.').pop();
    var hCode = this.pad(this.currentUser.hospitalCode, 4);
    var srCode = this.pad(this.wnpmAssetTaskObj.id.toString(), 10);
    var last = this.itmIndex[this.itmIndex.length - 1];
    let newIndex = this.pad((last).toString(), 2);
    let SRFileName = hCode + "WNPM" + srCode + newIndex;
    this.createWNPMAssetTimeAttachment.fileName = SRFileName + "." + ext;

    this.lstCreateWNPMAssetTimeAttachments.push(this.createWNPMAssetTimeAttachment);
    this.createWNPMAssetTimeAttachment = { id: 0, fileName: '', wnpmAssetTimeId: 0, title: '', wnpmFile: File, hospitalId: 0 };
  }

  pad(num: string, size: number): string {
    while (num.length < size) num = "0" + num;
    return num;
  }
  removeFileFromObjectArray(doc) {
    const index: number = this.lstCreateWNPMAssetTimeAttachments.indexOf(doc);
    if (index !== -1) {
      this.lstCreateWNPMAssetTimeAttachments.splice(index, 1);
    }
  }


  downloadFile(fileName) {
    var filePath = `${environment.Domain}UploadedAttachments/`;
    this.uploadService.downloadWNPMAssetTimeFile(fileName).subscribe(file => {
      var dwnldFile = filePath + 'WNPMAssetTime/' + fileName;
      if (fileName != "" || fileName != null) {
        window.open(dwnldFile);
      }
    })
  }
}
