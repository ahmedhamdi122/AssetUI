import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { EditHospitalApplicationVM } from 'src/app/Shared/Models/HospitalApplicationVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { HospitalApplicationService } from 'src/app/Shared/Services/hospitalapplication.service';

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
    private datePipe: DatePipe, private hospitalApplicationService: HospitalApplicationService) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {

    this.hospitalApplicationObj = { appDate: '', hospitalId: 0, id: 0, assetId: 0, statusId: 0, appTypeId: 0, appNumber: '', dueDate: '', userId: '', reasonIds: [], holdReasonIds: [], exNumber: '', execludeDate: '', comment: '' }
    let id = this.config.data.id;
    let selectedItem = this.config.data.selectedItem;
    this.selectedItem = selectedItem;

    this.lstStatus = [{ id: 2, name: 'Approved', nameAr: 'موافقة', "checked": true }, { id: 3, name: 'Rejected', nameAr: 'رفض', "checked": false }];
    this.isDate = true;

    this.hospitalApplicationService.GetHospitalApplicationById(id).subscribe(hospitalObj => {
      this.hospitalId = hospitalObj["id"];
      this.assetDetailId = hospitalObj["assetId"];
      this.hospitalId = id;
      this.assetName = this.lang == "en" ? hospitalObj["assetName"] : hospitalObj["assetNameAr"];
    });
  }
  getSelecteditem() {
  }

  onSubmit() {
    let exDate = new Date();
    let strDate = this.datePipe.transform(exDate, "yyyy-MM-dd");
    if (this.selectedStatusId == 3) {
      this.hospitalApplicationObj.dueDate = strDate;
    }
    this.hospitalApplicationObj.id = this.hospitalId;
    this.hospitalApplicationObj.assetId = this.assetDetailId;
    this.hospitalApplicationObj.userId = this.currentUser.id;
    this.hospitalApplicationObj.statusId = this.selectedStatusId;
    this.hospitalApplicationObj.hospitalId = this.currentUser.hospitalId;
    this.hospitalApplicationService.UpdateExcludedDate(this.hospitalApplicationObj).subscribe(updateDate => { this.display = true })

  }

}
export class execludeStatus {
  id: number;
  name: string;
  nameAr: string;
  checked: boolean;
}