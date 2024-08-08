import { Component, OnInit } from '@angular/core';
import { NgxQrcodeElementTypes, NgxQrcodeErrorCorrectionLevels } from '@techiediaries/ngx-qrcode';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ViewManfacturerPMAssetTimeVM } from 'src/app/Shared/Models/manfacturerPMAssetVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';

import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { ManfacturerpmassetsService } from 'src/app/Shared/Services/manfacturerpmassets.service';
import { WNPMAssetTimeService } from 'src/app/Shared/Services/wnPMAssetTime.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  viewWNPMAssetTimeObj: ViewManfacturerPMAssetTimeVM;
  id: number;
  imgURL: string = "";
  public elementType = NgxQrcodeElementTypes.CANVAS;
  public correctionLevel = NgxQrcodeErrorCorrectionLevels.HIGH;
  public width = 80;


  constructor(private authenticationService: AuthenticationService, private wnPMAssetTimeService: WNPMAssetTimeService, private config: DynamicDialogConfig, private manfacturerpmassetsService: ManfacturerpmassetsService) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.viewWNPMAssetTimeObj = { supplierName: '', supplierNameAr: '', brandName: '', brandNameAr: '', hospitalName: '', hospitalNameAr: '', assetDetailId: 0, assetName: '', assetNameAr: '', barCode: '', departmentName: '', departmentNameAr: '', doneDate: new Date, dueDate: new Date, hospitalId: 0, id: 0, isDone: false, listMasterAssetTasks: [], modelNumber: '', pmDate: '', serialNumber: '' }
    if (this.config.data != null || this.config.data != undefined) {
      this.id = this.config.data.id;
      this.manfacturerpmassetsService.GetManfacturerAssetById(this.id).subscribe(itemObj => {
        this.viewWNPMAssetTimeObj = itemObj;
      });
    }
  }


}
