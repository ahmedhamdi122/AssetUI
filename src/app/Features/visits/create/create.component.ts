import { DatePipe } from '@angular/common';
import { HospitalService } from './../../../Shared/Services/hospital.service';
import { Component, OnInit } from '@angular/core';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { CreateVisitVM, ListVisitVM } from 'src/app/Shared/Models/visitVM';
import { MessageService } from 'primeng/api';
import { CreateVisitAttachmentVM } from 'src/app/Shared/Models/visitAttachmentVM';
import { ListAssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { ListVisitTypeVM } from 'src/app/Shared/Models/visitTypeVM';
import { VisitTypeService } from 'src/app/Shared/Services/visitType.service';
import { VisitService } from 'src/app/Shared/Services/visit.service';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormBuilder } from '@angular/forms';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  lang = localStorage.getItem('lang');
  textDir: string = 'ltr';

  lsthosp: ListHospitalVM[] = [];
  lstvis: ListVisitVM[] = [];
  lstvisitTypes: ListVisitTypeVM[] = [];
  visitObj: CreateVisitVM;
  formData = new FormData();
  visitAttachmentObj: CreateVisitAttachmentVM;
  itmIndex: any[] = [];
  currentUser: LoggedUser;
  lstCreateVisitAttachments: CreateVisitAttachmentVM[] = [];
  value: Date;
  value1: Date;
  lstAssets: ListAssetDetailVM[] = [];
  display: boolean = false;
  errorMessage: string;
  errorDisplay: boolean = false;
  hospitalCode: string;
  visitId: number;

  isValidDate: any;
  error: any = { isError: false, errorMessage: '' };
  dateError: boolean = false;


  constructor(private messageService: MessageService, private assetDetailService: AssetDetailService,
    private hospitalService: HospitalService, private visitTypeService: VisitTypeService,
    private visitService: VisitService, private datePipe: DatePipe, private ref: DynamicDialogRef,
    private uploadService: UploadFilesService, private formBuilder: FormBuilder, private authenticationService: AuthenticationService) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.visitObj = { id: 0, visitDescr: '', visitDate: '', visitTypeId: 0, hospitalId: 0, engineerId: '', userId: '', code: '' },
      this.visitAttachmentObj = { id: 0, fileName: '', visitId: 0, title: '', visitFile: File };

    this.hospitalService.GetHospitals().subscribe(allhospitals => {
      this.lsthosp = allhospitals;
    });
    this.visitTypeService.GetAllVisitTypes().subscribe(allvisitTypes => {
      this.lstvisitTypes = allvisitTypes;
    });
    this.visitService.GenerateVisitCode().subscribe(item => {
      this.visitObj.code = item.visitCode;
    });

  }

  public uploadFile = (files) => {

    if (this.visitAttachmentObj.title == "") {
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
      this.visitAttachmentObj.fileName = fileToUpload.name;
      this.visitAttachmentObj.visitFile = fileToUpload;
      this.addFileToList();
    }
  }

  addFileToList() {

    this.hospitalService.GetHospitalById(this.visitObj.hospitalId).subscribe(hostObj => {
      if (this.itmIndex.length === 0) {
        last_element = 1;
      }
      else if (this.itmIndex.length > 0) {
        var last_element = this.itmIndex[this.itmIndex.length - 1];
        last_element = last_element + 1;
      }
      this.itmIndex.push(last_element);
      let ext = this.visitAttachmentObj.fileName.split('.').pop();
      var hCode = this.pad(hostObj.code, 4);
      var visitCode = this.pad(this.visitObj.code, 10);
      var last = this.itmIndex[this.itmIndex.length - 1];
      let newIndex = this.pad((last).toString(), 2);
      let SRFileName = hCode + visitCode + newIndex;
      this.visitAttachmentObj.fileName = SRFileName + "." + ext;


      this.lstCreateVisitAttachments.push(this.visitAttachmentObj);
      this.visitAttachmentObj = { id: 0, fileName: '', visitId: 0, title: '', visitFile: File };
    });
  }
  pad(num: string, size: number): string {
    while (num.length < size) num = "0" + num;
    return num;
  }
  removeFileFromObjectArray(doc) {
    const index: number = this.lstCreateVisitAttachments.indexOf(doc);
    if (index !== -1) {
      this.lstCreateVisitAttachments.splice(index, 1);
    }
  }
  getVisitDate($event) {
    this.visitObj.visitDate = this.datePipe.transform($event, "MM-dd-yyyy");
  }
  onSubmit() {
    this.visitObj.userId = this.currentUser.id;

    if (this.visitObj.hospitalId == 0) {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select Hospital";
      }
      else {
        this.errorMessage = "من فضلك اختر مستشفي";
      }
      return false;
    }
    if (this.visitObj.visitTypeId == 0) {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select Visit Type";
      }
      else {
        this.errorMessage = "من فضلك اختر نوع الزيارة";
      }
      return false;
    }
    if (this.visitObj.visitDate == "") {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select Date";
      }
      else {
        this.errorMessage = "من فضلك اختر تاريخ ";
      }
      return false;
    }
    let start = this.datePipe.transform(this.visitObj.visitDate, "yyyy-MM-dd");
    let end = this.datePipe.transform(new Date(), "yyyy-MM-dd");
    this.isValidDate = this.validateDates(start, end);
    if (!this.isValidDate) {
      this.dateError = true;
      return false;
    }

    else {
      this.visitService.CreateVisit(this.visitObj).subscribe(visitObj => {
        if (this.lstCreateVisitAttachments.length > 0) {
          this.lstCreateVisitAttachments.forEach((item) => {
            item.visitId = Number(visitObj);
            if (this.lstCreateVisitAttachments.length > 0) {
              this.lstCreateVisitAttachments.forEach((item, index) => {
                item.visitId = Number(visitObj);
                this.visitService.CreateVisitAttachments(item).subscribe(fileObj => {
                  this.uploadService.uploadVisitFiles(item.visitFile, item.fileName).subscribe(
                    (event) => {
                      // alert("Saved");
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
              this.lstCreateVisitAttachments = [];
            }
          });


          this.ref.close();
        }
        else {
          this.display = true;
          this.ref.close();
        }
      },
        (error) => {
          this.errorDisplay = true;
        });
    }
  }

  validateDates(sDate: string, eDate: string) {
    this.isValidDate = true;
    if ((sDate != null && eDate != null) && (eDate) < (sDate)) {
      if (this.lang == "en") {
        this.error = { isError: true, errorMessage: 'Visit Date should be less than today Date' };
      }
      else {
        this.error = { isError: true, errorMessage: 'تاريخ الزياره لابد أن يكون أقل من تاريخ اليوم' };

      }

      this.isValidDate = false;
    }
    return this.isValidDate;
  }
}
