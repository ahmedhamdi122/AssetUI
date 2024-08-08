import { ViewScrapVM } from './../../../Shared/Models/scrapVM';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ListScrapAttachmentVM } from 'src/app/Shared/Models/scrapAttachmentVM';
import { DetailScrapVM } from 'src/app/Shared/Models/scrapVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { ScrapService } from 'src/app/Shared/Services/scrap.service';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  currentUser: LoggedUser;
  requestDetailObj;
  errorMessage: string = '';
  errorDisplay: boolean = false;
  statusId: number = 0;
  lstScrapAttachment: ListScrapAttachmentVM[] = [];
  lstScrapReasons: ViewScrapVM[] = [];
  scrapObj: DetailScrapVM;

  constructor(private ref: DynamicDialogRef, private scrapService: ScrapService, private config: DynamicDialogConfig,
    private uploadService: UploadFilesService) {

  }

  ngOnInit(): void {
    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }
    this.scrapObj = {
      id: 0, scrapNo: '', scrapDate: '', model: '', brandName: '', brandNameAr: '', assetName: '', assetNameAr: '', barcode: ''
      , comment: '', reasonName: '', reasonNameAr: '', serialNumber: '', departmentName: '', departmentNameAr: ''
    }
    if (this.config.data != null || this.config.data != undefined) {
      let id = this.config.data.id;
      this.scrapService.ViewScrapById(id).subscribe(
        data => {
          this.scrapObj = data;
          this.scrapObj.departmentName = this.lang == "en" ? this.scrapObj.departmentName : this.scrapObj.departmentNameAr;


          this.scrapService.GetScrapAttachmentByScrapId(id).subscribe(lstdocs => {
            this.lstScrapAttachment = lstdocs;
          });
          this.scrapService.GetScrapReasonByScrapId(id).subscribe(lstreasons => {
            this.lstScrapReasons = lstreasons;
          });
        },
        (error) => console.log(error)
      );
    }
  }
  downloadFile(fileName) {
    var filePath = `${environment.Domain}UploadedAttachments/`;
    this.uploadService.downloadScrapFile(fileName).subscribe(file => {
      var dwnldFile = filePath + 'ScrapFiles/' + fileName;
      if (fileName != "" || fileName != null)
        window.open(dwnldFile);
    })
  }
  close() {
    this.ref.close({ data: this.statusId });
  }
}
