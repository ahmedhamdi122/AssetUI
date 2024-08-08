import { Component, OnInit } from '@angular/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { PrimeNGConfig } from "primeng/api";
import { DatePipe } from '@angular/common';
import { SupplierService } from 'src/app/Shared/Services/supplierService.service';
import { ListSupplierVM } from 'src/app/Shared/Models/supplierVM';
import { ManfacturerpmassetsService } from 'src/app/Shared/Services/manfacturerpmassets.service';
import { EditManfacturerPMAssetTimeVM } from 'src/app/Shared/Models/manfacturerPMAssetVM';


@Component({
  selector: 'app-addpmdone',
  templateUrl: './addpmdone.component.html',
  styleUrls: ['./addpmdone.component.css']
})
export class AddpmdoneComponent implements OnInit {


  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  id: number;
  itemIndex: number;
  manfacturerPMAssetTaskObj: EditManfacturerPMAssetTimeVM;

  lstRoleNames: string[] = [];
  lstSuppliers: ListSupplierVM[] = [];

  errorDisplay: boolean;
  display: boolean;
  errorMessage: string = "";
  isVisible: boolean = false;
  isDisabled: boolean = false;
  isValidPlannedDate: boolean = false;
  isValidDate: boolean = false;
  error: any = { isError: false, errorMessage: '' };
  isDelay: boolean = false;
  isDoneDate: boolean = false;

  isAgency: boolean = false;


  constructor(private authenticationService: AuthenticationService, private primengConfig: PrimeNGConfig,
    private manfacturerpmassetsService: ManfacturerpmassetsService, private ref: DynamicDialogRef, private datePipe: DatePipe,
    private config: DynamicDialogConfig, private supplierService: SupplierService) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.manfacturerPMAssetTaskObj = { strDoneDate: '', agencyId: 0, strDueDate: '', assetDetailId: 0, doneDate: new Date, dueDate: new Date, hospitalId: 0, id: 0, isDone: false, pmDate: new Date, comment: '' };

    this.errorDisplay = false;
    this.display = false;

    this.primengConfig.ripple = true;

    this.isAgency = this.currentUser.isAgency;

    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });
    }

    if (this.config.data != null || this.config.data != undefined) {
      this.id = this.config.data.id;
      this.itemIndex = this.config.data.itemIndex;

      if (this.itemIndex == 0) {
        this.isDelay = false;
        this.isDoneDate = true;
      }
      else if (this.itemIndex == 1) {
        this.isDelay = true;
        this.isDoneDate = false;
      }

      this.manfacturerpmassetsService.GetManfacturerAssetModelById(this.id).subscribe(assetTimeObj => {
        this.manfacturerPMAssetTaskObj = assetTimeObj;
        this.manfacturerPMAssetTaskObj.dueDate = new Date(this.manfacturerPMAssetTaskObj.dueDate);
        if (this.manfacturerPMAssetTaskObj.agencyId == null) {
          this.manfacturerPMAssetTaskObj.agencyId = 0;

          if (this.manfacturerPMAssetTaskObj.doneDate == null)
            this.manfacturerPMAssetTaskObj.doneDate = new Date();
          else
            this.manfacturerPMAssetTaskObj.doneDate = this.manfacturerPMAssetTaskObj.doneDate;
          if (this.manfacturerPMAssetTaskObj.strDoneDate == null)
            this.manfacturerPMAssetTaskObj.doneDate = new Date();
          else
            this.manfacturerPMAssetTaskObj.doneDate = this.manfacturerPMAssetTaskObj.doneDate;


          if (this.manfacturerPMAssetTaskObj.strDueDate == null)
            this.manfacturerPMAssetTaskObj.dueDate = new Date();
          else
            this.manfacturerPMAssetTaskObj.dueDate = this.manfacturerPMAssetTaskObj.dueDate;
        }
      });


      //  let today = new Date();


    }

    this.supplierService.GetSuppliers().subscribe(listSuppliers => {
      this.lstSuppliers = listSuppliers;
    });
  }

  onSubmit() {
    if (this.itemIndex == 0) {
      this.isDelay = false;
      this.isDoneDate = true;
      this.manfacturerPMAssetTaskObj.isDone = true;
      this.manfacturerPMAssetTaskObj.strDoneDate = this.datePipe.transform(this.manfacturerPMAssetTaskObj.doneDate, "yyyy-MM-dd HH:mm:ss");
      this.manfacturerpmassetsService.UpdateManfacturerAssetTime(this.manfacturerPMAssetTaskObj).subscribe(updated => {
        this.display = true;
      });
    }
    else if (this.itemIndex == 1) {
      this.isDelay = true;
      this.isDoneDate = false;
      if (this.manfacturerPMAssetTaskObj.dueDate == null) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "Please select date";
        }
        else {
          this.errorMessage = "من فضلك اختر تاريخ";
        }
        return false;
      }
      this.manfacturerPMAssetTaskObj.strDueDate = this.datePipe.transform(this.manfacturerPMAssetTaskObj.dueDate, "yyyy-MM-dd HH:mm:ss");
      this.manfacturerpmassetsService.UpdateManfacturerAssetTime(this.manfacturerPMAssetTaskObj).subscribe(updated => {
        this.display = true;
        this.isDisabled = true;
      });
    }
  }

  closeDialogue() {
    this.ref.close();
  }

}
