import { Component, OnInit } from '@angular/core';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { ListWNPMAssetTimeAttachment, ViewWNPMAssetTimeVM } from 'src/app/Shared/Models/wnPMAssetTimeVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { WNPMAssetTimeService } from 'src/app/Shared/Services/wnPMAssetTime.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  viewWNPMAssetTimeObj: ViewWNPMAssetTimeVM;
  id: number;
  imgURL: string = "";
  public elementType = NgxQrcodeElementTypes.CANVAS;
  public correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  public width = 80;

  listWNPMAssetTimeAttachments: ListWNPMAssetTimeAttachment[] = [];
  constructor(private authenticationService: AuthenticationService, private wnPMAssetTimeService: WNPMAssetTimeService,
    private config: DynamicDialogConfig, private uploadService: UploadFilesService) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.viewWNPMAssetTimeObj = { supplierName: '', supplierNameAr: '', brandName: '', brandNameAr: '', hospitalName: '', hospitalNameAr: '', assetDetailId: 0, assetName: '', assetNameAr: '', barCode: '', departmentName: '', departmentNameAr: '', doneDate: new Date, dueDate: new Date, hospitalId: 0, id: 0, isDone: false, listMasterAssetTasks: [], modelNumber: '', pmDate: '', serialNumber: '' }
    if (this.config.data != null || this.config.data != undefined) {
      this.id = this.config.data.id;
      this.wnPMAssetTimeService.GetAssetTimeById(this.id).subscribe(itemObj => {
        this.viewWNPMAssetTimeObj = itemObj;
      });
      this.wnPMAssetTimeService.GetWNPMAssetTimeAttachmentByWNPMAssetTimeId(this.id).subscribe(lstWNPMAssetTimeAttachments => {
        this.listWNPMAssetTimeAttachments = lstWNPMAssetTimeAttachments;
      });
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
