import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { AssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { CreateAssetMovementVM } from 'src/app/Shared/Models/assetMovementVM';
import { ListBuildingVM } from 'src/app/Shared/Models/buildingVM';
import { ListFloorVM } from 'src/app/Shared/Models/floorVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { ListRoomVM } from 'src/app/Shared/Models/roomVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { AssetMovementService } from 'src/app/Shared/Services/assetMovement.service';
import { BuildingService } from 'src/app/Shared/Services/building.service';
import { FloorService } from 'src/app/Shared/Services/floor.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { RoomService } from 'src/app/Shared/Services/room.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  isDisabled: boolean = false;
  isAdmin: boolean = false;
  lstRoleNames: string[] = [];
  applicationStatus: string = "";
  assetStatusId: number = 0;

  assetMovementObj: CreateAssetMovementVM;
  assetBarCodeObj: AssetDetailVM;


  lstBuildings: ListBuildingVM[] = [];
  lstFloors: ListFloorVM[] = [];
  lstRooms: ListRoomVM[] = [];
  lstassetDetailBarcodes: AssetDetailVM[] = [];
  lstassetDetails: AssetDetailVM[] = [];
  lstHospitals: ListHospitalVM[] = [];

  showBarcode: boolean = false;
  departmentName: string;
  brandName: string;
  serialNumber: string;
  modelNumber: string;
  barCode: string;
  constructor(private authenticationService: AuthenticationService, private assetMovementService: AssetMovementService, private route: Router,
    private floorService: FloorService, private buildingService: BuildingService, private roomService: RoomService, private hospitalService: HospitalService,
    private assetDetailService: AssetDetailService, private ref: DynamicDialogRef) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.assetMovementObj = {
      assetDetailId: 0, buildingId: 0, floorId: 0, roomId: 0, movementDate: '', moveDesc: '', hospitalId: 0, roomName: '', roomNameAr: '', floorName: '', floorNameAr: '', buildingName: '', buildingNameAr: ''
    }

    if (this.currentUser.hospitalId != 0) {
      this.buildingService.GetAllBuildingsByHospitalId(this.currentUser.hospitalId).subscribe(builds => {
        this.lstBuildings = builds;
      })
    }
    else {
      this.buildingService.GetAllBuildingsByHospitalId(this.assetMovementObj.hospitalId).subscribe(builds => {
        this.lstBuildings = builds;
      });
    }

    this.hospitalService.GetHospitals().subscribe(hospitals => {
      this.lstHospitals = hospitals;
    });


    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });
      this.isAdmin = (['Admin'].some(r => this.lstRoleNames.includes(r)));
    }
  }
  getBuildingByHospitalId($event)
  {
    let hospitalId = $event.target.value;

    this.buildingService.GetAllBuildingsByHospitalId(hospitalId).subscribe(builds => {
      this.lstBuildings = builds;
    });
  }
  getFloorsByBuildId($event) {
    let buildId = $event.target.value;
    this.floorService.GetFloorsByBuildingId(buildId).subscribe(floors => {
      this.lstFloors = floors;
    })
  }
  getRoomsByfloorId($event) {
    let floorId = $event.target.value;
    this.roomService.GetRoomsByFloorId(floorId).subscribe(rooms => {
      this.lstRooms = rooms;
    })
  }
  getBarCode(event) {
    this.assetBarCodeObj.barCode = event["barCode"];
    this.assetBarCodeObj.id = event["id"];
    this.assetMovementObj.assetDetailId = event["id"];



    this.showBarcode = true;
    this.brandName = this.lang == 'en' ? event["brandName"] : event["brandNameAr"];
    this.departmentName = this.lang == 'en' ? event["departmentName"] : event["departmentNameAr"];
    this.modelNumber = event["model"];
    this.serialNumber = event["serialNumber"];
    this.barCode = event["barCode"];

    this.assetDetailService.GetHospitalAssetById(this.assetBarCodeObj.id).subscribe(assetObj => {
      this.assetBarCodeObj = assetObj;

      this.applicationStatus = this.lang == "en" ? this.assetBarCodeObj["assetStatus"] : this.assetBarCodeObj["assetStatusAr"];
      this.assetBarCodeObj.name = assetObj["barcode"];
      this.assetStatusId = this.assetBarCodeObj["assetStatusId"];
      if (this.assetStatusId == 1) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it Needs Repair";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه خارج لإصلاح ";
        }
        this.isDisabled = true;
      }
      if (this.assetStatusId == 2) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Scrapped";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه  مكهن";
        }
        this.isDisabled = true;
      }
      if (this.assetStatusId == 4) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Under Maintenance";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه تحت الصيانة";
        }
        this.isDisabled = true;

      }
      if (this.assetStatusId == 5) {

        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Under Installation";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه  تحت الإنشاء";
        }
        this.isDisabled = true;

      }
      if (this.assetStatusId == 6) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is not working ";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه لا يعمل ";
        }
        this.isDisabled = true;

      }
      if (this.assetStatusId == 7) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Moved outside hospital";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه نقل خارج المستشفى ";
        }
        this.isDisabled = true;

      }
      if (this.assetStatusId == 8) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Excluded";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه مستبعد ";
        }
        this.isDisabled = true;

      }
      if (this.assetStatusId == 9) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Hold";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه في حالة إيقاف مؤقت ";
        }
        this.isDisabled = true;

      }
      else {
        this.isDisabled = false;
      }
    });

  }
  onSelectionChanged(event) {
    if (this.currentUser.hospitalId != 0) {
      this.assetDetailService.AutoCompleteAssetBarCode(event.query, this.currentUser.hospitalId).subscribe(assets => {
        this.lstassetDetailBarcodes = assets;
        if (this.lang == "en") {
          this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
        }
        else {
          this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
        }
      });
    }
    else {
      this.assetDetailService.AutoCompleteAssetBarCode(event.query, this.assetMovementObj.hospitalId).subscribe(assets => {
        this.lstassetDetailBarcodes = assets;
        if (this.lang == "en") {
          this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
        }
        else {
          this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
        }
      });
    }
  }
  onLocationSubmit() {
    if (this.assetMovementObj.assetDetailId == 0) {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select asset";
      }
      else {
        this.errorMessage = "اختر أصل";
      }
      return false;
    }
    if (this.assetMovementObj.buildingId == 0) {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select building";
      }
      else {
        this.errorMessage = "اختر مبنى";
      }
      return false;
    }
    if (this.assetMovementObj.floorId == 0) {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select floor ";
      }
      else {
        this.errorMessage = "اختر دور";
      }
      return false;
    }
    if (this.assetMovementObj.roomId == 0) {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select room";
      }
      else {
        this.errorMessage = "اختر غرفة";
      }
      return false;
    }
    if (this.assetMovementObj.movementDate == "" || this.assetMovementObj.movementDate == null) {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select date";
      }
      else {
        this.errorMessage = "من فضلك اختر تاريخ";
      }
      return false;
    }
    else {
      this.assetMovementObj.hospitalId = this.currentUser.hospitalId!=0 ? this.currentUser.hospitalId:  this.assetMovementObj.hospitalId;
      this.assetMovementService.CreateAssetMovement(this.assetMovementObj).subscribe(() => {
        this.display = true;

      }, (error) => {
        this.errorDisplay = true;

        if (this.lang == 'en') {
          if (error.error.status == 'same') {
            this.errorMessage = error.error.message;
          }
        } if (this.lang == 'ar') {
          if (error.error.status == 'same') {
            this.errorMessage = error.error.messageAr;
          }
        }
        return false;
      });
    }
  }
  closeDialogue() {
    this.ref.close();
    this.route.navigate(['/dash/assetmovement']);
  }
}
