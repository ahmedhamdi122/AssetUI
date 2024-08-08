import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { CreateHospitalApplicationVM, EditHospitalApplicationVM } from 'src/app/Shared/Models/HospitalApplicationVM';
import { CreateSupplierExecludeAssetVM, EditSupplierExecludeAssetVM } from 'src/app/Shared/Models/supplierExecludeAssetVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { HospitalApplicationService } from 'src/app/Shared/Services/hospitalapplication.service';
import { SupplierExecludeAssetService } from 'src/app/Shared/Services/supplierexecludeasset.service';

@Component({
  selector: 'app-execludedate',
  templateUrl: './execludedate.component.html',
  styleUrls: ['./execludedate.component.css']
})
export class ExecludedateComponent implements OnInit {
  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  currentUser: LoggedUser;
  assetName: string = "";
  supplierExecludeObj: EditSupplierExecludeAssetVM;
  hospitalApplicationObj: EditHospitalApplicationVM;
  selectedItem: string;
  supplierId: number;
  hospitalId: number;
  isDate: boolean = false;
  display: boolean = false;
  assetDetailId: number;

  selectedStatusId: number = 2;
  lstStatus: execludeStatus[] = [];
  constructor(private authenticationService: AuthenticationService, private config: DynamicDialogConfig,
    private datePipe: DatePipe,
    private supplierExecludeAssetService: SupplierExecludeAssetService, private hospitalApplicationService: HospitalApplicationService) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.supplierExecludeObj = {
      date: '', memberId: '',
      id: 0, assetId: 0, statusId: 0, exNumber: '', execludeDate: '', userId: '', comment: '',
      reasonIds: [], cityId: 0, governorateId: 0, holdReasonIds: [], organizationId: 0, subOrganizationId: 0, appTypeId: 0,
      hospitalId: 0, assetName: '', assetNameAr: ''
    }
    this.hospitalApplicationObj = { appDate: '', hospitalId: 0, id: 0, assetId: 0, statusId: 0, appTypeId: 0, appNumber: '', dueDate: '', userId: '', reasonIds: [], holdReasonIds: [], exNumber: '', execludeDate: '', comment: '' }
    let id = this.config.data.id;
    let selectedItem = this.config.data.selectedItem;
    this.selectedItem = selectedItem;

    this.lstStatus = [{ id: 2, name: 'Approved', nameAr: 'موافقة', "checked": true }, { id: 3, name: 'Rejected', nameAr: 'رفض', "checked": false }];
    this.isDate = true;
    this.supplierExecludeObj.statusId = 2;


    if (selectedItem == "Supplier") {
      this.supplierExecludeAssetService.GetSupplierExecludeAssetById(id).subscribe(supplierObj => {
        this.supplierId = id;
        this.assetDetailId = supplierObj["assetId"];
        this.assetName = this.lang == "en" ? supplierObj["assetName"] : supplierObj["assetNameAr"];
      });
    }

    if (selectedItem == "Hospital") {
      this.hospitalApplicationService.GetHospitalApplicationById(id).subscribe(hospitalObj => {
        this.hospitalId = hospitalObj["id"];
        this.assetDetailId = hospitalObj["assetId"];
        this.hospitalId = id;
        this.assetName = this.lang == "en" ? hospitalObj["assetName"] : hospitalObj["assetNameAr"];
      })
    }
  }


  getSelecteditem() {
    this.supplierExecludeObj.statusId = Number(this.selectedStatusId);
    if (this.selectedStatusId == 2)
      this.isDate = true;
    else
      this.isDate = false;
  }


  onSubmit() {

    let exDate = new Date();
    let strDate = this.datePipe.transform(exDate, "yyyy-MM-dd");



    if (this.selectedStatusId == 3) {
      this.supplierExecludeObj.execludeDate = strDate;
      this.hospitalApplicationObj.dueDate = strDate;
    }




    if (this.selectedItem == "Supplier") {
      this.supplierExecludeObj.id = this.supplierId;
      this.supplierExecludeObj.userId = this.currentUser.id;
      this.supplierExecludeObj.statusId = this.selectedStatusId;
      this.supplierExecludeObj.assetId = this.assetDetailId;


      this.supplierExecludeAssetService.UpdateExcludedDate(this.supplierExecludeObj).subscribe(updateDate => { this.display = true })
    }

    if (this.selectedItem == "Hospital") {
      this.hospitalApplicationObj.id = this.hospitalId;
      if (this.selectedStatusId !== 3) {
        this.hospitalApplicationObj.dueDate = this.supplierExecludeObj.execludeDate;
      }
      this.hospitalApplicationObj.assetId = this.assetDetailId;
      this.hospitalApplicationObj.userId = this.currentUser.id;
      this.hospitalApplicationObj.statusId = this.selectedStatusId;

      this.hospitalApplicationService.UpdateExcludedDate(this.hospitalApplicationObj).subscribe(updateDate => { this.display = true })
    }
  }
}

export class execludeStatus {
  id: number;
  name: string;
  nameAr: string;
  checked: boolean;
}