import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { PrintServiceRequestVM } from 'src/app/Shared/Models/requestModeVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { RequestService } from 'src/app/Shared/Services/request.service';

@Component({
  selector: 'app-printsr',
  templateUrl: './printsr.component.html',
  styleUrls: ['./printsr.component.css']
})
export class PrintsrComponent implements OnInit {
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  displayRequestObj: boolean = false;
  printServiceRequestObj: PrintServiceRequestVM;
  printedBy: string = "";
  elementType = "img";
  height: number = 80;
  width: number = 2;
  fontSize: number = 12;


  constructor(private authenticationService: AuthenticationService, private requestService: RequestService, private config: DynamicDialogConfig) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.printServiceRequestObj = { departmentName: '', departmentNameAr: '', lastRequestDate: '', brandName: '', brandNameAr: '', buildingName: '', buildingNameAr: '', floorName: '', floorNameAr: '', roomName: '', roomNameAr: '', assetBarCode: '', assetCode: '', id: 0, lstWorkOrderTracking: [], masterAssetCode: '', modelNumber: '', requestNote: '', requestTrackingList: [], workOrderSubject: '', assetName: '', assetNameAr: '', assetSerial: '', createdBy: '', creationDate: new Date, hospitalName: '', hospitalNameAr: '', modeName: '', modeNameAr: '', note: '', periorityName: '', periorityNameAr: '', plannedEndDate: new Date, plannedStartDate: new Date, problemName: '', problemNameAr: '', requestCode: '', requestDate: '', requestSubject: '', requestTypeName: '', requestTypeNameAr: '', requestTypeNameName: '', requestTypeNameNameAr: '', serialNumber: '', subProblemName: '', subProblemNameAr: '', subject: '', typeName: '', typeNameAr: '', workOrderNumber: '' }
    if (this.config.data != null || this.config.data != undefined) {
      let requestId = this.config.data.id;
      this.GetRequestById(requestId);
    }
  }
  print() {
    window.print();
  }
  GetRequestById(id) {
    const options: Intl.DateTimeFormatOptions = { month: "long", day: 'numeric', year: 'numeric' };
    this.requestService.PrintServieRequestById(id).subscribe(async woObj => {
      this.printServiceRequestObj = woObj;
      this.printServiceRequestObj.requestDate = new Intl.DateTimeFormat("ar-EG", options).format(new Date(this.printServiceRequestObj.requestDate));

      this.printServiceRequestObj.requestTrackingList.forEach(element => {
        element.descriptionDate = new Intl.DateTimeFormat("ar-EG", options).format(new Date(element.descriptionDate));
      });
    });
    let printedBy = this.currentUser.userName + " تمت الطباعة بواسطة ";
    this.printedBy = printedBy;
  }
}
