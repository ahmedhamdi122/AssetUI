import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreateSupplierVM } from 'src/app/Shared/Models/supplierVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { SupplierService } from 'src/app/Shared/Services/supplierService.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateSupplierAttachment } from 'src/app/Shared/Models/SupplierAttachmentVM';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
@Component({
  selector: 'app-create-supplier',
  templateUrl: './create-supplier.component.html',
  styleUrls: ['./create-supplier.component.css']
})
export class CreateSupplierComponent implements OnInit {

  lang = localStorage.getItem("lang");
  currentUser: LoggedUser
  supplierObj: CreateSupplierVM;
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  isSaved: boolean = false;
  lstSupplierAttachments: CreateSupplierAttachment[] = [];
  createSupplierAttachment: CreateSupplierAttachment;

  itmIndex: any[] = [];
  formData = new FormData();
  supplierId: number;
  constructor(private authenticationService: AuthenticationService, private supplierService: SupplierService,
    private uploadService: UploadFilesService,
    private route: Router, private ref: DynamicDialogRef) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.supplierObj = { id: 0, code: '', name: '', nameAr: '', address: '', addressAr: '', email: '', mobile: '', website: '', contactPerson: '', fax: '', notes: '' }
    this.createSupplierAttachment = { id: 0, supplierId: 0, fileName: '', title: '', supplierFile: File }
    this.supplierService.GenerateSupplierCode().subscribe(suplierObj => {
      this.supplierObj.code = suplierObj["code"];
    });
  }
  onSubmit() {

    this.supplierService.CreateSupplier(this.supplierObj).subscribe(addedObj => {
      this.display = true;
      this.isSaved = true;
      this.supplierId = Number(addedObj);
      this.supplierObj.id = Number(addedObj);
      // this.ref.close(addedObj);
    },
      (error) => {
        this.errorDisplay = true;
        if (this.lang == 'en') {
          if (error.error.status == 'code') {
            this.errorMessage = error.error.message;
          }
          if (error.error.status == 'codelen') {
            this.errorMessage = error.error.message;
          }
          if (error.error.status == 'name') {
            this.errorMessage = error.error.message;
          } if (error.error.status == 'nameAr') {
            this.errorMessage = error.error.message;
          }
        }
        if (this.lang == 'ar') {
          if (error.error.status == 'code') {
            this.errorMessage = error.error.messageAr;
          }
          if (error.error.status == 'codelen') {
            this.errorMessage = error.error.messageAr;
          }
          if (error.error.status == 'name') {
            this.errorMessage = error.error.messageAr;
          }
          if (error.error.status == 'nameAr') {
            this.errorMessage = error.error.messageAr;
          }
        }
        return false;
      });
  }

  saveFiles() {
    if (this.lstSupplierAttachments.length > 0) {
      this.lstSupplierAttachments.forEach((item, index) => {
        item.supplierId = Number(this.supplierId);
        this.supplierService.CreateSupplierAttachment(item).subscribe(fileObj => {
          this.uploadService.uploadSupplierFile(item.supplierFile, item.fileName).subscribe(
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
      this.lstSupplierAttachments = [];
      this.display = true;
      this.ref.close(this.supplierId);
    }
  }
  uploadFile = (files) => {
    if (this.createSupplierAttachment.title == "") {
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
      this.createSupplierAttachment.fileName = fileToUpload.name;
      this.createSupplierAttachment.supplierFile = fileToUpload;
      this.AddFileToList();
    }
  }
  AddFileToList() {
    if (this.itmIndex.length === 0) {
      last_element = 1;
    }
    else if (this.itmIndex.length > 0) {
      var last_element = this.itmIndex[this.itmIndex.length - 1];
      last_element = last_element + 1;
    }
    this.itmIndex.push(last_element);
    let ext = this.createSupplierAttachment.fileName.split('.').pop();
    var supplierCode = this.pad(this.supplierObj.code, 10);
    var last = this.itmIndex[this.itmIndex.length - 1];
    let newIndex = this.pad((last).toString(), 2);
    let fileName = "SUP" + supplierCode + newIndex;
    this.createSupplierAttachment.fileName = fileName + "." + ext;

    this.lstSupplierAttachments.push(this.createSupplierAttachment);
    this.createSupplierAttachment = { id: 0, supplierId: 0, fileName: '', title: '', supplierFile: File }
  }
  pad(num: string, size: number): string {
    while (num.length < size) num = "0" + num;
    return num;
  }
  removeFileFromObjectArray(doc) {
    const index: number = this.lstSupplierAttachments.indexOf(doc);
    if (index !== -1) {
      this.lstSupplierAttachments.splice(index, 1);
    }
  }
}
