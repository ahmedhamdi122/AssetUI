import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SupplierExecludeAssetAttachmentVM, ViewSupplierExecludeAssetVM } from 'src/app/Shared/Models/supplierExecludeAssetVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { SupplierExecludeAssetService } from 'src/app/Shared/Services/supplierexecludeasset.service';
import { environment } from 'src/environments/environment';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { SupplierExecludeService } from 'src/app/Shared/Services/supplierexeclude.service';
import { ListSupplierExecludeVM } from 'src/app/Shared/Models/supplierExecludeVM';
import { DatePipe } from '@angular/common';

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
  lstDocuments: SupplierExecludeAssetAttachmentVM[] = [];
  supplierExecludeAssetObj: ViewSupplierExecludeAssetVM;
  showGovCity: boolean = false;
  showOrgAndSub: boolean = false;
  showHExeclude: boolean = false;
  showHHold: boolean = false;
  selectedAppType: number = 1;
  isHospital: boolean = false;
  lstSupplierExecludes: ListSupplierExecludeVM[] = [];


  constructor(private authenticationService: AuthenticationService, private activeRoute: ActivatedRoute,
    private supplierExecludeService: SupplierExecludeService, private datePipe: DatePipe,
    private supplierExecludeAssetService: SupplierExecludeAssetService,
    private route: Router, private uploadService: UploadFilesService) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.supplierExecludeAssetObj = {
      comment: '', date: '', barCode: '', serialNumber: '',
      id: 0, execludeDate: '', exNumber: '', reasonNames: [], holdReasonNames: [], hospitalId: 0, assetName: "", assetNameAr: "", hospitalName: "", hospitalNameAr: "", govName: "", govNameAr: "", cityName: "", cityNameAr: "", subOrgName: "", subOrgNameAr: "", orgName: "", orgNameAr: "", appTypeName: "", appTypeNameAr: "",
    }


    let id = this.activeRoute.snapshot.params['id'];
    //    this.selectedItem = this.activeRoute.snapshot.params['type'];
    this.id = id;

    this.isHospital = true;
    this.showGovCity = false;
    this.showOrgAndSub = false;

    this.supplierExecludeAssetService.GetSupplierExecludeAssetById(id).subscribe(
      data => {
        this.supplierExecludeAssetObj.hospitalId = data["hospitalId"];
        this.supplierExecludeAssetObj.exNumber = data["exNumber"];
        this.supplierExecludeAssetObj.appTypeName = data["appTypeName"];
        this.supplierExecludeAssetObj.appTypeNameAr = data["appTypeNameAr"];
        this.supplierExecludeAssetObj.assetName = data["assetName"];

        this.supplierExecludeAssetObj.serialNumber = data["serialNumber"];
        this.supplierExecludeAssetObj.barCode = data["barCode"];
        this.supplierExecludeAssetObj.comment = data["comment"];
        this.supplierExecludeAssetObj.assetNameAr = data["assetNameAr"];
        this.supplierExecludeAssetObj.hospitalName = data["hospitalName"];
        this.supplierExecludeAssetObj.hospitalNameAr = data["hospitalNameAr"];
        this.supplierExecludeAssetObj.date = this.datePipe.transform(data["date"], "dd/MM/yyyy");

        if (data["execludeDate"] != "")
          this.supplierExecludeAssetObj.execludeDate = this.datePipe.transform(data["execludeDate"], "dd/MM/yyyy");

        this.supplierExecludeAssetService.GetAttachmentBySupplierExcludeAssetId(id).subscribe(items => {
          this.lstSupplierExecludes = items;
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



  printPage() {
    window.print();
  }


  downloadFile(fileName) {
    var filePath = `${environment.Domain}UploadedAttachments/`;

    this.uploadService.downloadSupplierExecludeAssetFile(fileName).subscribe(file => {
      var dwnldFile = filePath + 'SupplierExecludeAssets/' + fileName;
      if (fileName != "" || fileName != null)
        window.open(dwnldFile);
    })
  }

  back() {

    this.route.navigate(['/dash/supplierexecludes']);
    // if (this.lang == "en") {
    //   this.route.navigate(
    //     ['/dash/memberexecludes'],
    //     { queryParams: { hospitalId: 0, 'appTypeName': this.supplierExecludeAssetObj.appTypeName } });
    // }
    // else {
    //   this.route.navigate(
    //     ['/dash/memberexecludes'],
    //     { queryParams: { 'hospitalId': '0', 'appTypeName': this.supplierExecludeAssetObj.appTypeNameAr, 'supplier': 'supplier' } });
    // }

  }
}
