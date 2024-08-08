import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { DetailVisitAttachmentVM, ListVisitAttachmentVM } from 'src/app/Shared/Models/visitAttachmentVM';
import { DetailVisitVM } from 'src/app/Shared/Models/visitVM';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { VisitService } from 'src/app/Shared/Services/visit.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  visitObj: DetailVisitVM;
  visitAttachmentObj: DetailVisitAttachmentVM = { id: 0, fileName: '', visitId: 0, title: '', visitFile: File };
  lstVisitAttachment: ListVisitAttachmentVM[] = [];

  constructor(private visitService: VisitService, private config: DynamicDialogConfig,
    private uploadService: UploadFilesService) { }
  ngOnInit() {
    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }
    this.visitObj = {
      id: 0, visitDescr: '', visitDate: '', visitTypeName: '', hospitalName: '', hospitalNameAr: '', engineerName: '', visitTypeNameAr: '', verified: false
    }
    if (this.config.data != null || this.config.data != undefined) {
      let id = this.config.data.id;
      this.visitService.ViewVisitById(id).subscribe(
        data => {
          this.visitObj = data;
          this.visitService.GetVisitAttachmentByVisitId(id).subscribe(lstdocs => {
            this.lstVisitAttachment = lstdocs;
          });
        },
        (error) => console.log(error)
      );
    }
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
