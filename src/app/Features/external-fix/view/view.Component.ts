import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ViewExternalFixVM } from 'src/app/Shared/Models/ExternalFixVM';
import { ExternalFixService } from 'src/app/Shared/Services/external-fix.service';
import { environment } from 'src/environments/environment';

import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {


  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  externalFixObj: ViewExternalFixVM;


  constructor(private externalFixService: ExternalFixService,
    private activeRoute: ActivatedRoute, private uploadService: UploadFilesService,
    private config: DynamicDialogConfig, private ref: DynamicDialogRef) {
  }


  ngOnInit(): void {

    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }

    this.externalFixObj = {
      id: 0,
      serialNumber: '',
      barcode: '',
      supplierName: '',
      supplierNameAr: '',
      departmentName: '',
      departmentNameAr: '',
      brandName: '',
      brandNameAr: '',
      assetName: '',
      assetNameAr: '',
      modelNumber: '',
      assetDetailId: 0,
      hospitalId: 0,

      assetStatusId: 0,
      outDate: new Date(),
      comingNotes: '',
      supplierId: 0,
      expectedDate: new Date(),
      notes: '',
      comingDate: new Date(),
      outNumber: '',
      listExternalFixFiles: []
    };
    // let id = this.config.data.id;
    let id = this.activeRoute.snapshot.params["id"];

    this.externalFixService.ViewExternalFixById(id).subscribe(
      data => {
        this.externalFixObj = data;
      });
  }

  downloadFile(fileName) {
    var filePath = `${environment.Domain}UploadedAttachments/`;
    this.uploadService.DownloadExternalFixFiles(fileName).subscribe(file => {
      var dwnldFile = filePath + 'ExternalFixFiles/' + fileName;
      if (fileName != "" || fileName != null) {
        window.open(dwnldFile);
      }
    })
  }


}
