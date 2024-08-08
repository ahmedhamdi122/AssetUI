import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CreateSupplierAttachment, ListSupplierAttachmentVM } from 'src/app/Shared/Models/SupplierAttachmentVM';
import { EditSupplierVM } from 'src/app/Shared/Models/supplierVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { SupplierService } from 'src/app/Shared/Services/supplierService.service';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  supplierObj: EditSupplierVM
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  lstAllSupplierAttachments: ListSupplierAttachmentVM[] = [];
  lstSupplierAttachments: CreateSupplierAttachment[] = [];
  createSupplierAttachment: CreateSupplierAttachment;
  itmIndex: any[] = [];
  formData = new FormData();
  supplierId: number;
  isDisabled: boolean = false;
  incremant: number = 0;
  constructor(private supplierService: SupplierService, private authenticationService: AuthenticationService,
    private confirmationService: ConfirmationService,
    private uploadService: UploadFilesService, private config: DynamicDialogConfig, private route: Router) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.supplierObj = {countAssets:0, sumPrices:0, printedBy: '', lang: '', id: 0, code: '', name: '', nameAr: '', address: '', addressAr: '', email: '', eMail: '', mobile: '', website: '', contactPerson: '', fax: '', notes: '' }
    this.createSupplierAttachment = { id: 0, supplierId: 0, fileName: '', title: '', supplierFile: File }

    // let id = this.activeRoute.snapshot.params['id'];

    if (this.config.data != null || this.config.data != undefined) {
      this.supplierId = this.config.data.id;
      this.supplierService.GetSupplierById(this.supplierId).subscribe(
        data => {
          this.supplierObj = data;
          this.supplierService.GetSupplierAttachmentsBySupplierId(this.supplierObj.id).subscribe(files => {
            this.lstAllSupplierAttachments = files;
          });
        });
    }
  }
  onSubmit() {

    this.supplierService.UpdateSupplier(this.supplierObj).subscribe(addedObj => {
      if (this.lstSupplierAttachments.length > 0) {
        this.lstSupplierAttachments.forEach((item, index) => {
          item.supplierId = Number(this.supplierObj.id);
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
  downloadFile(fileName) {
    var filePath = `${environment.Domain}UploadedAttachments/`;
    this.uploadService.downloadSupplierFile(fileName).subscribe(file => {
      var dwnldFile = filePath + 'SupplierAttachments/' + fileName;
      if (fileName != "" || fileName != null)
        window.open(dwnldFile);
    })
  }
  uploadMultipleFile = (event: any) => {
    const files: FileList = event.target.files;
    if (files.length === 0) {
      return;
    }
    else {
      for (var i = 0; i < files.length; i++) {
        let fileToUpload = <File>files[i];
        var supplierDocument = new CreateSupplierAttachment();
        this.formData.append('file', fileToUpload, fileToUpload.name);
        supplierDocument.fileName = fileToUpload.name;
        supplierDocument.supplierFile = fileToUpload;
        supplierDocument.title = fileToUpload.name.split('.')[0];
        this.lstSupplierAttachments.push(supplierDocument);
      }
      this.addMultiFilesToList();
    }
  }
  addMultiFilesToList() {
    this.lstSupplierAttachments.forEach(supplierDocument => {
      supplierDocument.supplierId = Number(this.supplierId);
      let ext = supplierDocument.fileName.split('.').pop();
      let lastdocumentName = "";
      let imageIndex = "";
      if (this.itmIndex.length == 0) {
        this.supplierService.GetLastDocumentForSupplierId(Number(this.supplierId)).subscribe(lastDoc => {
          lastdocumentName = lastDoc.fileName;
          if (lastdocumentName == null) {
            var last_element = ++this.incremant;
            this.itmIndex.push(last_element);
            let ext = supplierDocument.fileName.split('.').pop();
            var hCode = this.pad(this.currentUser.hospitalCode, 4);
            var srCode = this.pad(this.supplierObj.code, 10);
            let newIndex = this.pad((last_element).toString(), 2);
            let WOFileName = hCode + "SUP" + srCode + newIndex;
            supplierDocument.fileName = WOFileName + "." + ext;
          }
          else if (lastdocumentName != "") {

            imageIndex = lastdocumentName.split('.').slice(0, -1).join('.');
            imageIndex = imageIndex.substring(imageIndex.length - 2);
            this.itmIndex.push(imageIndex);
            var newImageIndex = parseInt(imageIndex) + (++this.incremant);
            this.itmIndex.push(newImageIndex);
            var hCode = this.pad(this.currentUser.hospitalCode, 4);
            var srCode = this.pad(this.supplierObj.code, 10);
            var last = this.itmIndex[this.itmIndex.length - 1];
            let newIndex = this.pad((last).toString(), 2);
            let woRFileName = hCode + "SUP" + srCode + newIndex + "." + ext;
            supplierDocument.fileName = woRFileName;
          }
          else if (lastdocumentName == "") {

            var last_element = 1;
            this.itmIndex.push(last_element);
            let ext = supplierDocument.fileName.split('.').pop();
            var hCode = this.pad(this.currentUser.hospitalCode, 4);
            var srCode = this.pad(this.supplierObj.code, 10);
            let newIndex = this.pad((last_element).toString(), 2);
            let WOFileName = hCode + "SUP" + srCode + newIndex;
            supplierDocument.fileName = WOFileName + "." + ext;
          }
          supplierDocument = { id: 0, fileName: '', supplierId: 0, title: '', supplierFile: File };
        });
      }
      else if (this.itmIndex.length > 0) {
        var last_element = this.itmIndex[this.itmIndex.length - 1];
        last_element = parseInt(last_element) + (++this.incremant);
        this.itmIndex.push(last_element);

        var hCode = this.pad(this.currentUser.hospitalCode, 4);
        var srCode = this.pad(this.supplierObj.code, 10);
        let newIndex = this.pad((last_element).toString(), 2);
        let SRFileName = hCode + "SUP" + srCode + newIndex;
        supplierDocument.fileName = SRFileName + "." + ext;
        supplierDocument = { id: 0, fileName: '', supplierId: 0, title: '', supplierFile: File };
      }
    });
  }
  removeFileFromObjectArray(rowIndex) {
    if (rowIndex >= 0 && rowIndex < this.lstSupplierAttachments.length) {
      this.lstSupplierAttachments.splice(rowIndex, 1);
    }
  }
  DeleteFile(id: number) {
    if (this.lang == 'en') {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to delete this file?',
        header: 'Delete Item Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.supplierService.DeleteSupplierAttachment(id).subscribe(result => {
          });
        },
        reject: () => {
          this.confirmationService.close();
        }
      });
    }
    else {
      this.confirmationService.confirm({
        message: 'هل أنت متأكد من مسح هذا الملف',
        header: "تأكيد المسح",
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.supplierService.DeleteSupplierAttachment(id).subscribe(result => {

            this.supplierService.GetSupplierAttachmentsBySupplierId(this.supplierObj.id).subscribe(files => {
              this.lstAllSupplierAttachments = files;
            });
          });
        },
        reject: () => {
          this.confirmationService.close();
        }
      });
    }
  }
  pad(num: string, size: number): string {
    while (num.length < size) num = "0" + num;
    return num;
  }







  back() { this.route.navigate(['/dash/suppliers']); }
}
