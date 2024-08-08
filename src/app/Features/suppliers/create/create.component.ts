import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CreateSupplierVM } from 'src/app/Shared/Models/supplierVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { SupplierService } from 'src/app/Shared/Services/supplierService.service';
import { CreateSupplierAttachment } from 'src/app/Shared/Models/SupplierAttachmentVM';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  supplierObj: CreateSupplierVM;
  errorMessage: string;
  errorDisplay: boolean = false;
  isDisabled: boolean = false;
  isSaved: boolean = false;
  display: boolean = false;
  lstSupplierAttachments: CreateSupplierAttachment[] = [];
  createSupplierAttachment: CreateSupplierAttachment;

  itmIndex: any[] = [];
  formData = new FormData();
  supplierId: number;

  constructor(private authenticationService: AuthenticationService, private supplierService: SupplierService,
    private route: Router, private uploadService: UploadFilesService
  ) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.supplierObj = { id: 0, code: '', name: '', nameAr: '', address: '', addressAr: '', email: '', mobile: '', website: '', contactPerson: '', fax: '', notes: '' }
    this.createSupplierAttachment = { id: 0, supplierId: 0, fileName: '', title: '', supplierFile: File }
    this.supplierService.GenerateSupplierCode().subscribe(suplierObj => {
      this.supplierObj.code = suplierObj["code"];
    });
  }
  onSubmit() {
    this.supplierService.CreateSupplier(this.supplierObj).subscribe(addedObj => {
      this.supplierId = Number(addedObj);
      if (this.lstSupplierAttachments.length > 0) {
        this.lstSupplierAttachments.forEach((item, index) => {
          item.supplierId = Number(this.supplierId);
          this.supplierService.CreateSupplierAttachment(item).subscribe(fileObj => {
            this.uploadService.uploadSupplierFile(item.supplierFile, item.fileName).subscribe(
              (event) => {
                this.display = true;
                this.route.navigate(['/suppliers/']);
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
      }
      else {
        this.display = true;
      }
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
  uploadMultipleFile = (event: any) => {
    const files: FileList = event.target.files;
    if (files.length === 0) {
      return;
    }
    else {
      for (var i = 0; i < files.length; i++) {
        let fileToUpload = <File>files[i];
        var createSupplierAttachment = new CreateSupplierAttachment();
        this.formData.append('file', fileToUpload, fileToUpload.name);
        createSupplierAttachment.fileName = fileToUpload.name;
        createSupplierAttachment.supplierFile = fileToUpload;
        createSupplierAttachment.title = fileToUpload.name.split('.')[0];
        this.lstSupplierAttachments.push(createSupplierAttachment);
      }
      this.addMultiFilesToList();
    }
  }
  addMultiFilesToList() {
    this.lstSupplierAttachments.forEach((element, index) => {
      element.supplierId = Number(this.supplierId)
      if (this.itmIndex.length === 0) {
        last_element = 1;
      }
      else if (this.itmIndex.length > 0) {
        var last_element = this.itmIndex[this.itmIndex.length - 1];
        last_element = last_element + 1;
      }
      this.itmIndex.push(last_element);
      let ext = element.fileName.split('.').pop();
      var hCode = this.pad(this.currentUser.hospitalCode, 4);
      var srCode = this.pad(this.supplierObj.code, 10);
      var last = this.itmIndex[this.itmIndex.length - 1];
      let newIndex = this.pad((last).toString(), 2);
      let SRFileName = hCode + "SR" + srCode + newIndex;
      element.fileName = SRFileName + "." + ext;
      element = { id: 0, fileName: '', supplierId: 0, title: '', supplierFile: File };
    });
  }
  removeFileFromObjectArray(rowIndex) {
    let newIndex;
    if (rowIndex >= 0 && rowIndex < this.lstSupplierAttachments.length) {
      this.lstSupplierAttachments.splice(rowIndex, 1);

      this.lstSupplierAttachments.forEach((element, index) => {
        element.supplierId = Number(this.supplierId)
        if (this.itmIndex.length === 0) {
          last_element = 1;
        }
        else if (this.itmIndex.length > 0 && this.lstSupplierAttachments.length == 0) {
          var last_element = this.itmIndex[this.itmIndex.length - 1];
          last_element = last_element + 1;
        }
        else if (this.itmIndex.length > 0 && this.lstSupplierAttachments.length > 0) {
          const incrementedIndex = index + 1;
          newIndex = this.pad((incrementedIndex).toString(), 2);
        }
        this.itmIndex.push(last_element);
        let ext = element.fileName.split('.').pop();
        var hCode = this.pad(this.currentUser.hospitalCode, 4);
        var srCode = this.pad(this.supplierObj.code, 10);
        let SRFileName = hCode + "SR" + srCode + newIndex;
        element.fileName = SRFileName + "." + ext;
        element = { id: 0, fileName: '', supplierId: 0, title: '', supplierFile: File };
      });

    }
  }
  pad(num: string, size: number): string {
    while (num.length < size) num = "0" + num;
    return num;
  }
  back() { this.route.navigate(['/dash/suppliers']); }



}
