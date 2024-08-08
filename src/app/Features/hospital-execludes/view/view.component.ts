import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ListHospitalApplicationTransactionVM } from 'src/app/Shared/Models/hospitalApplicationTransactionVM';
import { HospitalApplicationAttachmentVM, ViewHospitalApplicationVM } from 'src/app/Shared/Models/HospitalApplicationVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { HospitalApplicationService } from 'src/app/Shared/Services/hospitalapplication.service';
import { HospitalApplicationTransactionService } from 'src/app/Shared/Services/hospitalapplicationtransaction.service';
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
  id: number;
  lstHospitalDocuments: HospitalApplicationAttachmentVM[] = [];
  hospitalExecludeAssetObj: ViewHospitalApplicationVM;
  showGovCity: boolean = false;
  showOrgAndSub: boolean = false;
  showHExeclude: boolean = false;
  showHHold: boolean = false;
  selectedAppType: number = 1;
  isHospital: boolean = false;
  lstTransactions: ListHospitalApplicationTransactionVM[] = [];


  constructor(private authenticationService: AuthenticationService, private activeRoute: ActivatedRoute, private config: DynamicDialogConfig,
    private hospitalApplicationService: HospitalApplicationService, private datePipe: DatePipe, private hospitalApplicationTransactionService: HospitalApplicationTransactionService, private breadcrumbService: BreadcrumbService,
    private route: Router, private uploadService: UploadFilesService) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.hospitalExecludeAssetObj = {
      departmentName: '', departmentNameAr: '',
      appDate: '', barCode: '', serialNumber: '', comment: '', id: 0, execludeDate: '', appNumber: '', reasonNames: [], holdReasonNames: [], hospitalId: 0, assetName: "", assetNameAr: "", hospitalName: "", hospitalNameAr: "", govName: "", govNameAr: "", cityName: "", cityNameAr: "", subOrgName: "", subOrgNameAr: "", orgName: "", orgNameAr: "", appTypeName: "", appTypeNameAr: "",
    }

    const translationKeys = ['Asset.AssetTransfer', 'Asset.Execludes', 'Asset.HospitalExeclude'];
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activeRoute.snapshot, parentUrlArray, translationKeys);

    if (this.config.data != null || this.config.data != undefined) {

      let id = this.config.data.id;
      this.id = id;

      this.isHospital = true;
      this.showGovCity = false;
      this.showOrgAndSub = false;
      this.hospitalApplicationService.GetHospitalApplicationById(id).subscribe(
        data => {

          this.hospitalExecludeAssetObj.hospitalId = data["hospitalId"];
          this.hospitalExecludeAssetObj.appNumber = data["appNumber"];
          this.hospitalExecludeAssetObj.appTypeName = data["appTypeName"];
          this.hospitalExecludeAssetObj.appTypeNameAr = data["appTypeNameAr"];
          this.hospitalExecludeAssetObj.assetName = data["assetName"];
          this.hospitalExecludeAssetObj.assetNameAr = data["assetNameAr"];
          this.hospitalExecludeAssetObj.serialNumber = data["serialNumber"];
          this.hospitalExecludeAssetObj.barCode = data["barCode"];
          this.hospitalExecludeAssetObj.comment = data["comment"];

          if (data["dueDate"] != "")
            this.hospitalExecludeAssetObj.execludeDate = this.datePipe.transform(data["dueDate"], "dd/MM/yyyy");

          this.hospitalExecludeAssetObj.appDate = this.datePipe.transform(data["appDate"], "dd/MM/yyyy");


          this.hospitalApplicationTransactionService.GetAttachmentsByApplicationId(id).subscribe(items => {
            this.lstTransactions = items;
          });
          if (data["appTypeId"] == 1) {
            this.showHExeclude = true;
            this.showHHold = false;
          }
          if (data["appTypeId"] == 2) {
            this.showHHold = true;
            this.showHExeclude = false;
          }
        });
    }
  }



  printPage() {
    window.print();
  }
  downloadFile(fileName) {
    var filePath = `${environment.Domain}UploadedAttachments/`;
    this.uploadService.downloadHospitalApplicationFile(fileName).subscribe(file => {
      var dwnldFile = filePath + 'HospitalApplications/' + fileName;
      if (fileName != "" || fileName != null)
        window.open(dwnldFile);
    })
  }

  back() {
    this.route.navigate(['/dash/hospitalexecludes']);
  }
}
