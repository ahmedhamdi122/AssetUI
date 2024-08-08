import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { EditHospitalApplicationVM } from 'src/app/Shared/Models/HospitalApplicationVM';
import { EditSupplierExecludeAssetVM } from 'src/app/Shared/Models/supplierExecludeAssetVM';
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

  dbSupplierExecludeObj: EditSupplierExecludeAssetVM;
  dbhospitalApplicationObj: EditHospitalApplicationVM;

  selectedItem: string;
  supplierId: number;
  hospitalId: number;
  isDate: boolean = false;
  display: boolean = false;
  assetDetailId: number;

  selectedStatusId: number = 2;
  lstStatus: execludeStatus[] = [];

  isValidDate: any;
  error: any = { isError: false, errorMessage: '' };
  dateError: boolean = false;
  errorDisplay: boolean = false;
  errorMessage: string = "";
  hospitalAppDate: string;

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

    this.dbSupplierExecludeObj = {
      date: '', memberId: '',
      id: 0, assetId: 0, statusId: 0, exNumber: '', execludeDate: '', userId: '', comment: '',
      reasonIds: [], cityId: 0, governorateId: 0, holdReasonIds: [], organizationId: 0, subOrganizationId: 0, appTypeId: 0,
      hospitalId: 0, assetName: '', assetNameAr: ''
    }

    this.hospitalApplicationObj = { appDate: '', hospitalId: 0, id: 0, assetId: 0, statusId: 0, appTypeId: 0, appNumber: '', dueDate: '', userId: '', reasonIds: [], holdReasonIds: [], exNumber: '', execludeDate: '', comment: '' }
    this.dbhospitalApplicationObj = { appDate: '', hospitalId: 0, id: 0, assetId: 0, statusId: 0, appTypeId: 0, appNumber: '', dueDate: '', userId: '', reasonIds: [], holdReasonIds: [], exNumber: '', execludeDate: '', comment: '' }
    let id = this.config.data.id;
    let selectedItem = this.config.data.selectedItem;
    this.selectedItem = selectedItem;

    this.lstStatus = [{ id: 2, name: 'Approved', nameAr: 'موافقة', "checked": true }, { id: 3, name: 'Rejected', nameAr: 'رفض', "checked": false }];
    this.isDate = true;
    this.hospitalApplicationObj.statusId = 2;


    if (selectedItem == "Supplier" || selectedItem == "المورد") {
      this.supplierExecludeAssetService.GetSupplierExecludeAssetById(id).subscribe(supplierObj => {
        this.supplierId = id;
        this.assetDetailId = supplierObj["assetId"];
        this.assetName = this.lang == "en" ? supplierObj["assetName"] : supplierObj["assetNameAr"];
      });
    }

    if (selectedItem == "Hospital" || selectedItem == "المستشفى") {
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
    else {
      this.supplierExecludeObj.execludeDate = this.hospitalApplicationObj.execludeDate;
    }



    if (this.selectedItem == "Supplier" || this.selectedItem == "المورد") {

      this.supplierExecludeObj.id = this.supplierId;
      this.supplierExecludeObj.memberId = this.currentUser.id;
      this.supplierExecludeObj.statusId = this.selectedStatusId;
      this.supplierExecludeObj.assetId = this.assetDetailId;
      this.supplierExecludeObj.comment = this.hospitalApplicationObj.comment;


      let id = this.config.data.id;
      this.supplierExecludeAssetService.GetSupplierExecludeAssetById(id).subscribe(supplierObj => {
        this.dbSupplierExecludeObj = supplierObj;
        let createdDate = this.datePipe.transform(this.dbSupplierExecludeObj.date, "yyyy-MM-dd");
        let excludeDate = this.datePipe.transform(this.supplierExecludeObj.execludeDate, "yyyy-MM-dd");
        this.isValidDate = this.validateDates(createdDate, excludeDate);
        if (!this.isValidDate) {
          this.dateError = true;
          return false;
        }
        else {
          this.supplierExecludeAssetService.UpdateExcludedDate(this.supplierExecludeObj).subscribe(updateDate => { this.display = true });
        }
      });
      // let createdDate = this.datePipe.transform(this.supplierExecludeObj.date, "yyyy-MM-dd");
      // let excludeDate = this.datePipe.transform(this.supplierExecludeObj.execludeDate, "yyyy-MM-dd");
      // this.isValidDate = this.validateDates(createdDate, excludeDate);
      // if (!this.isValidDate) {
      //   this.dateError = true;
      //   return false;
      // }
      // else {
      //   this.supplierExecludeAssetService.UpdateExcludedDate(this.supplierExecludeObj).subscribe(updateDate => { this.display = true });
      // }
    }

    if (this.selectedItem == "Hospital" || this.selectedItem == "المستشفى") {
      this.hospitalApplicationObj.id = this.hospitalId;
      if (this.selectedStatusId !== 3) {
        this.hospitalApplicationObj.dueDate = this.hospitalApplicationObj.execludeDate;
      }
      this.hospitalApplicationObj.assetId = this.assetDetailId;
      this.hospitalApplicationObj.userId = this.currentUser.id;
      this.hospitalApplicationObj.statusId = this.selectedStatusId;
      this.hospitalApplicationObj.comment = this.hospitalApplicationObj.comment;


      this.hospitalApplicationService.GetHospitalApplicationById(this.hospitalApplicationObj.id).subscribe(hospitalObj => {
        this.dbhospitalApplicationObj = hospitalObj;
        let createdDate = this.datePipe.transform(this.dbhospitalApplicationObj.appDate, "yyyy-MM-dd");
        let excludeDate = this.datePipe.transform(this.hospitalApplicationObj.dueDate, "yyyy-MM-dd");
        this.isValidDate = this.validateDates(createdDate, excludeDate);
        if (!this.isValidDate) {
          this.dateError = true;
          return false;
        }
        else {
          this.hospitalApplicationService.UpdateExcludedDate(this.hospitalApplicationObj).subscribe(updateDate => { this.display = true; });
        }
      });
      // this.hospitalApplicationService.GetHospitalApplicationById(this.hospitalApplicationObj.id).subscribe(item => {
      //   this.hospitalAppDate = item.appDate;
      // });
      // let createdDate = this.datePipe.transform(this.hospitalAppDate, "yyyy-MM-dd");
      // let excludeDate = this.datePipe.transform(this.hospitalApplicationObj.dueDate, "yyyy-MM-dd");
      // this.isValidDate = this.validateDates(createdDate, excludeDate);
      // if (!this.isValidDate) {
      //   this.dateError = true;
      //   return false;
      // }
      // else {
      //   this.hospitalApplicationObj.assetId = this.assetDetailId;
      //   this.hospitalApplicationObj.userId = this.currentUser.id;
      //   this.hospitalApplicationObj.statusId = this.selectedStatusId;
      //   this.hospitalApplicationObj.comment = this.hospitalApplicationObj.comment;
      //   this.hospitalApplicationService.UpdateExcludedDate(this.hospitalApplicationObj).subscribe(updateDate => { this.display = true; });
      // }
    }
  }

  validateDates(sDate: string, eDate: string) {
    this.isValidDate = true;
    if ((sDate != null && eDate != null) && (eDate) < (sDate)) {
      if (this.lang == "en") {
        this.error = { isError: true, errorMessage: 'Exclude date should be later than demanded date.' };
      }
      else {
        this.error = { isError: true, errorMessage: 'تاريخ الاستبعاد لابد أن يكون بعد تاريخ طلب الاستبعاد' };
      }
      this.isValidDate = false;
    }
    return this.isValidDate;
  }


}

export class execludeStatus {
  id: number;
  name: string;
  nameAr: string;
  checked: boolean;
}