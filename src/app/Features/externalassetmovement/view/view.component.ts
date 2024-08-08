import { Component, OnInit } from '@angular/core';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { EditExternalAssetMovementVM } from 'src/app/Shared/Models/externalAssetMovementVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ExternalAssetMovementService } from 'src/app/Shared/Services/externalAssetMovement.service';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { environment } from 'src/environments/environment';
import { DatePipe } from '@angular/common';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  viewExternalAssetMovementObj: EditExternalAssetMovementVM;
  constructor(private authenticationService: AuthenticationService, private activeRoute: ActivatedRoute,
    private datePipe: DatePipe, private externalAssetMovementService: ExternalAssetMovementService,
    private config: DynamicDialogConfig,
    private route: Router, private uploadService: UploadFilesService) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.viewExternalAssetMovementObj = { assetName: '', assetNameAr: '', barCode: '', modelNumber: '', serialNumber: '', assetDetailId: 0, hospitalName: '', id: 0, movementDate: '', notes: '', listMovementAttachments: [] }


    // let id = this.activeRoute.snapshot.params['id'];
    if (this.config.data != null || this.config.data != undefined) {
      let id = this.config.data.id;
      this.externalAssetMovementService.GetExternalAssetMovementById(id).subscribe(
        data => {
          this.viewExternalAssetMovementObj = data;

          if (this.lang == "ar") {
            let movementDate = this.datePipe.transform(data.movementDate, "MM/dd/yyyy").split('/');
            let pmonth = movementDate[0];
            let pday = movementDate[1];
            let pyear = movementDate[2];
            let newPurchaseDate = Number(pyear).toLocaleString("ar-SA", { minimumFractionDigits: 0, maximumFractionDigits: 0, useGrouping: false }) + "/" + Number(pmonth).toLocaleString("ar-SA") + "/" + Number(pday).toLocaleString("ar-SA");
            data.movementDate = newPurchaseDate;
          }
        });
    }
  }


  downloadFile(fileName) {
    var filePath = `${environment.Domain}UploadedAttachments/`;

    this.uploadService.downloadExternalAssetMovementFile(fileName).subscribe(file => {
      var dwnldFile = filePath + 'ExternalAssetMovements/' + fileName;
      if (fileName != "" || fileName != null)
        window.open(dwnldFile);
    });
  }

  back() {
    this.route.navigate(['/dash/externalassetmovement/']);
  }

  printPage() {
    window.print();
  }
}
