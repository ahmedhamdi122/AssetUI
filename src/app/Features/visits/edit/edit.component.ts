import { Title } from 'chart.js';
import { Component, OnInit } from '@angular/core';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { EditVisitAttachmentVM, ListVisitAttachmentVM } from 'src/app/Shared/Models/visitAttachmentVM';
import { ListVisitTypeVM } from 'src/app/Shared/Models/visitTypeVM';
import { EditVisitVM } from 'src/app/Shared/Models/visitVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { MessageService } from 'primeng/api';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { VisitTypeService } from 'src/app/Shared/Services/visitType.service';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { VisitService } from 'src/app/Shared/Services/visit.service';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { environment } from 'src/environments/environment';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})

export class EditComponent implements OnInit {

  lang = localStorage.getItem('lang');
  lsthosp: ListHospitalVM[] = [];
  lstvisitTypes: ListVisitTypeVM[] = [];
  visitObj: EditVisitVM;
  visitDate: string;
  formData = new FormData();
  visitAttachmentObj: EditVisitAttachmentVM;
  lstEditVisitAttachments: EditVisitAttachmentVM[] = [];
  value: Date;
  itmIndex: any[] = [];
  currentUser: LoggedUser;
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  lstVisitAttachment: ListVisitAttachmentVM[] = [];
  hospitalCode: string;
  visitId: number;
  constructor(private messageService: MessageService, private hospitalService: HospitalService,
    private visitService: VisitService, private visitTypeService: VisitTypeService,
    private datePipe: DatePipe, private activeRoute: ActivatedRoute, private ref: DynamicDialogRef,
    private config: DynamicDialogConfig, private uploadService: UploadFilesService) { }

  ngOnInit(): void {
    this.visitObj = { id: 0, visitDescr: '', visitDate: '', visitTypeId: 0, hospitalId: 0, engineerId: '', code: '', userId: '', statusId: 0 }
    this.visitAttachmentObj = { id: 0, fileName: '', visitId: 0, title: '', visitFile: File };

    this.hospitalService.GetHospitals().subscribe(allhospitals => {
      this.lsthosp = allhospitals;
    })
    this.visitTypeService.GetAllVisitTypes().subscribe(allvisitTypes => {
      this.lstvisitTypes = allvisitTypes;
    });
    if (this.config.data != null || this.config.data != undefined) {
      let id = this.config.data.id;
      this.visitId = id;
      this.visitService.GetVisitById(id).subscribe(visit => {
        this.visitObj = visit;

        this.visitService.GetVisitAttachmentByVisitId(this.visitObj.id).subscribe(lstdocs => {
          this.lstVisitAttachment = lstdocs;
        });

      },
        (error) => console.log(error)
      );
    }
  }
  changeVisitDate(event: MatDatepickerInputEvent<Date>) {
    this.visitDate = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    this.visitObj.visitDate = this.visitDate;
  }
  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    this.formData.append('file', fileToUpload, fileToUpload.name);
    this.visitAttachmentObj.fileName = fileToUpload.name;
    this.visitAttachmentObj.visitFile = fileToUpload;
    this.addFileToList();
  }
  addFileToList() {
    let ext = this.visitAttachmentObj.fileName.split('.').pop();
    this.hospitalService.GetHospitalById(this.visitObj.hospitalId).subscribe(hostObj => {

      if (this.itmIndex.length === 0) {
        last_element = 1;
      }
      else if (this.itmIndex.length > 0) {
        var last_element = this.itmIndex[this.itmIndex.length - 1];
        last_element = last_element + 1;
      }
      this.itmIndex.push(last_element);

      //this.hospitalCode = hostObj.code;
      var hCode = this.pad(hostObj.code, 4);
      var visitCode = this.pad(this.visitObj.code, 10);
      var visitId = this.pad(this.visitId.toString(), 10);

      var last = this.itmIndex[this.itmIndex.length - 1];
      let newIndex = this.pad((last).toString(), 2);
      let visitFileName = hCode + visitCode + newIndex;

      this.visitAttachmentObj.fileName = visitFileName + "." + ext;
      this.visitAttachmentObj.visitId = Number(visitId);

      this.lstEditVisitAttachments.push(this.visitAttachmentObj);
      this.visitAttachmentObj = { id: 0, fileName: '', visitId: 0, title: '', visitFile: File };
    });
  }
  pad(num: string, size: number): string {
    while (num.length < size) num = "0" + num;
    return num;
  }
  removeFileFromObjectArray(doc) {
    const index: number = this.lstEditVisitAttachments.indexOf(doc);
    if (index !== -1) {
      this.lstEditVisitAttachments.splice(index, 1);
    }
  }
  onSubmit() {
    //this.visitObj.userId = this.currentUser.id;
    if (this.visitObj.hospitalId == 0) {
      this.errorDisplay = true;
      this.errorMessage = "Please select Hospital";
      return false;
    }
    if (this.visitObj.visitTypeId == 0) {
      this.errorDisplay = true;
      this.errorMessage = "Please select Visit Type";
      return false;
    }
    if (this.visitObj.visitDate == "") {
      this.errorDisplay = true;
      this.errorMessage = "Please select Date";
      return false;
    }
    else {
      this.visitService.UpdateVisit(this.visitObj).subscribe(result => {
        if (this.lstEditVisitAttachments.length > 0) {
          this.lstEditVisitAttachments.forEach((item, index) => {
            item.visitId = Number(this.visitId);
            this.visitService.CreateVisitAttachments(item).subscribe(fileObj => {
              this.uploadService.uploadVisitFiles(item.visitFile, item.fileName).subscribe(
                (event) => {

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
          this.lstEditVisitAttachments = [];

          this.visitService.GetVisitAttachmentByVisitId(this.visitObj.id).subscribe(lstdocs => {
            this.lstVisitAttachment = lstdocs;
          });
          this.display = true;
          this.ref.close();
        }
        else {

          this.display = true;
          this.ref.close();
        }
      },
        (error) => {
          this.errorDisplay = true;

          if (this.lang == 'en') {
            // if (error.error.status == 'codelen') {
            //   this.errorMessage = error.error.message;
            // }
            // if (error.error.status == 'code') {
            //   this.errorMessage = error.error.message;
            // }
            // if (error.error.status == 'name') {
            //   this.errorMessage = error.error.message;
            // }
          }
          if (this.lang == 'ar') {

            // if (error.error.status == 'codelen') {
            //   this.errorMessage = error.error.messageAr;
            // }

            // if (error.error.status == 'code') {
            //   this.errorMessage = error.error.messageAr;
            // }
            // if (error.error.status == 'name') {
            //   this.errorMessage = error.error.messageAr;
            // }
          }
          return false;
        });
    }
    this.visitService.GetVisitAttachmentByVisitId(this.visitId).subscribe(lstdocs => {
      this.lstVisitAttachment = lstdocs;
    });
  }

  downloadFile(fileName) {
    var filePath = `${environment.Domain}UploadedAttachments/`;
    this.uploadService.downloadVisitFile(fileName).subscribe(file => {
      var dwnldFile = filePath + 'VisitFiles/' + fileName;
      if (fileName != "" || fileName != null)
        window.open(dwnldFile);
    })
  }
}
