import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { ListBuildingVM } from 'src/app/Shared/Models/buildingVM';
import { ListFloorVM } from 'src/app/Shared/Models/floorVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { ListRoomVM } from 'src/app/Shared/Models/roomVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { BuildingService } from 'src/app/Shared/Services/building.service';
import { FloorService } from 'src/app/Shared/Services/floor.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { RoomService } from 'src/app/Shared/Services/room.service';
import { CreateFloorComponent } from '../../hospital-floors/create-floor/create-floor.component';
import { DeleteFloorConfirmationComponent } from '../../hospital-floors/delete-floor-confirmation/delete-floor-confirmation.component';
import { EditFloorComponent } from '../../hospital-floors/edit-floor/edit-floor.component';
import { CreateRoomComponent } from '../../hospital-rooms/create-room/create-room.component';
import { DeleteRoomConfirmationComponent } from '../../hospital-rooms/delete-room-confirmation/delete-room-confirmation.component';
import { EditRoomComponent } from '../../hospital-rooms/edit-room/edit-room.component';
import { CreateComponent } from '../create/create.component';
import { DeleteconfirmationComponent } from '../deleteconfirmation/deleteconfirmation.component';
import { EditComponent } from '../edit/edit.component';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {


  currentUser: LoggedUser;
  lang = localStorage.getItem("lang");
  dir: string = "ltr";
  lstBuildings: ListBuildingVM[] = [];
  lstFloors: ListFloorVM[] = [];
  lstRooms: ListRoomVM[] = [];
  lstHospitals: ListHospitalVM[] = [];
  display: boolean = false;
  errorDisplay: boolean = false;

  errorMessage: string = "";
  selectedbuildObj: ListBuildingVM;
  selectedFloorObj: ListFloorVM;
  selectedRoomObj: ListRoomVM;

  selectedBuildId: number;
  selectedFloorId: number;
  hospitalId: number;
  selectedHospitalId: number;
  isDisabled: boolean = false;

  lstRoleNames: string[] = [];
  isSuperAdmin: boolean = false;
  isAdmin: boolean = false;
  constructor(private buildingService: BuildingService, private floorService: FloorService, private roomService: RoomService,
    private hospitalService: HospitalService, private authenticationService: AuthenticationService,
    private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute,
    private dialog: MatDialog, public dialogService: DialogService) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    if (this.lang == "en") {
      this.dir = "ltr";
    }
    else {
      this.dir = "rtl";
    }

    const translationKeys = ['Asset.heirarchicalstructure', 'Asset.Buildings']; // Array of translation keys
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);

    this.currentUser["roleNames"].forEach(element => {
      this.lstRoleNames.push(element["name"]);
    });
    this.isSuperAdmin = (['SuperAdmin'].some(r => this.lstRoleNames.includes(r)));
    this.isAdmin = (['Admin'].some(r => this.lstRoleNames.includes(r)));

    if (this.currentUser.hospitalId > 0) {
      this.hospitalService.GetHospitals().subscribe(hospitals => {
        this.lstHospitals = hospitals;
        this.selectedHospitalId = this.currentUser.hospitalId;
        this.isDisabled = true;

        this.buildingService.GetAllBuildingsByHospitalId(this.currentUser.hospitalId).subscribe(builds => {
          this.lstBuildings = builds;
        });

      });
    }

    else if (this.currentUser.hospitalId == 0) {
      this.loadBuildings();
    }
  }
  loadBuildings() {
    this.isDisabled = false;
    this.hospitalService.GetHospitals().subscribe(hospitals => {
      this.lstHospitals = hospitals;
      this.selectedHospitalId = 0;
    });



  }

  filterFloorByBuildingId(buildId: number) {
    this.lstFloors = [];
    this.floorService.GetFloorsByBuildingId(buildId).subscribe(items => {
      this.lstFloors = items;
    });

    this.selectedBuildId = buildId;
  }


  filterRoomsByFloorId(floorId: number) {
    this.roomService.GetRoomsByFloorId(floorId).subscribe(items => {
      this.lstRooms = items;
    })
    this.selectedFloorId = floorId;
  }


  getHospitalId($event) {
    this.hospitalId = $event.target.value;
    this.buildingService.GetAllBuildingsByHospitalId(this.hospitalId).subscribe(builds => {
      this.lstBuildings = builds;
    });
  }
  addBuilding() {
    const ref = this.dialogService.open(CreateComponent, {
      header: this.lang == "en" ? 'Add Building' : "اضف مبني",
      data: {
        hospitalId: this.hospitalId
      },
      width: '50%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });

    ref.onClose.subscribe(() => {
      //  this.display = true;

      this.buildingService.GetAllBuildingsByHospitalId(this.hospitalId).subscribe(builds => {
        this.lstBuildings = builds;
      })
    });
  }
  editBuilding(id: number) {
    const ref = this.dialogService.open(EditComponent, {
      header: this.lang == "en" ? 'Edit Building' : "تعديل مبني",

      data: {
        id: id
      },
      width: '50%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });
    ref.onClose.subscribe(() => {
      this.buildingService.GetAllBuildingsByHospitalId(this.hospitalId).subscribe(builds => {
        this.lstBuildings = builds;
      })
    });
  }
  addFloor() {
    if (this.selectedBuildId != null) {
      const ref2 = this.dialogService.open(CreateFloorComponent, {
        header: this.lang == "en" ? 'Add Floor' : "اضف طابق",
        data: {
          hospitalId: this.selectedHospitalId,// this.currentUser.hospitalId > 0 ? this.currentUser.hospitalId : this.selectedHospitalId,
          buildId: this.selectedBuildId
        },
        width: '50%',
        style: {
          'dir': this.lang == "en" ? 'ltr' : "rtl",
          "text-align": this.lang == "en" ? 'left' : "right",
          "direction": this.lang == "en" ? 'ltr' : "rtl"
        }
      });
      ref2.onClose.subscribe(res => {
        this.hospitalId = this.selectedHospitalId;
        this.filterFloorByBuildingId(this.selectedBuildId);
        this.buildingService.GetAllBuildingsByHospitalId(this.hospitalId).subscribe(builds => {
          this.lstBuildings = builds;
        });
      });
    }
  }
  editFloor(id: number) {
    this.selectedFloorId = id;
    const ref = this.dialogService.open(EditFloorComponent, {
      header: this.lang == "en" ? 'Edit Floor' : "تعديل طابق",

      data: {
        id: id,
        hospitalId: this.hospitalId,
        buildId: this.selectedBuildId
      },
      width: '50%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });

    ref.onClose.subscribe(res => {
      this.filterFloorByBuildingId(this.selectedBuildId);
      this.filterRoomsByFloorId(this.selectedFloorId);
    });
  }
  addRoom() {
    if (this.selectedFloorId != null) {
      const ref2 = this.dialogService.open(CreateRoomComponent, {
        header: this.lang == "en" ? 'Add Room' : "اضف غرفة",
        data: {
          floorId: this.selectedFloorId,
          buildId: this.selectedBuildId
        },
        width: '50%',
        style: {
          'dir': this.lang == "en" ? 'ltr' : "rtl",
          "text-align": this.lang == "en" ? 'left' : "right",
          "direction": this.lang == "en" ? 'ltr' : "rtl"
        }
      });
      ref2.onClose.subscribe(res => {
        this.filterFloorByBuildingId(this.selectedBuildId);
        this.filterRoomsByFloorId(this.selectedFloorId);
      });
    }
    else {
      const ref3 = this.dialogService.open(CreateRoomComponent, {
        header: this.lang == "en" ? 'Add Room' : "اضف غرفة",

        width: '50%'
      });
      ref3.onClose.subscribe(res => {
        this.filterFloorByBuildingId(this.selectedBuildId);
        this.filterRoomsByFloorId(this.selectedFloorId);
      });
    }
  }
  editRoom(id: number) {
    const ref = this.dialogService.open(EditRoomComponent, {
      header: this.lang == "en" ? 'Edit Room' : "تعديل غرفة",

      data: {
        id: id,
        floorId: this.selectedFloorId,
        buildId: this.selectedBuildId
      },
      width: '50%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });
    ref.onClose.subscribe(res => {
      this.filterFloorByBuildingId(this.selectedBuildId);
      this.filterRoomsByFloorId(this.selectedFloorId);
    });
  }

  deleteBuilding(id: number) {
    this.buildingService.GetBuildingById(id).subscribe((data) => {
      this.selectedbuildObj = data;
      const buildDialog = this.dialog
        .open(DeleteconfirmationComponent, {
          width: '30%',
          autoFocus: true,
          data: {
            id: this.selectedbuildObj.id,
            name: this.selectedbuildObj.name,
            nameAr: this.selectedbuildObj.nameAr
          },
        });
      buildDialog.afterClosed().subscribe(deleted => {
        this.filterFloorByBuildingId(this.selectedBuildId);
        this.lstRooms = [];
        this.buildingService.GetAllBuildingsByHospitalId(this.hospitalId).subscribe(builds => {
          this.lstBuildings = builds;
        });
      });
    });
  }
  deleteFloor(id: number) {
    this.floorService.GetFloorById(id).subscribe((data) => {
      this.selectedFloorObj = data;
      const floorDialog = this.dialog
        .open(DeleteFloorConfirmationComponent, {
          width: '30%',
          autoFocus: true,
          data: {
            id: this.selectedFloorObj.id,
            name: this.selectedFloorObj.name,
            nameAr: this.selectedFloorObj.nameAr
          },
        });
      floorDialog.afterClosed().subscribe(res => {
        this.buildingService.GetAllBuildingsByHospitalId(this.hospitalId).subscribe(builds => {
          this.lstBuildings = builds;
        });
        this.filterFloorByBuildingId(this.selectedBuildId);
        this.filterRoomsByFloorId(this.selectedFloorId);
      });
    });
  }
  deleteRoom(id: number) {
    this.roomService.GetRoomById(id).subscribe((data) => {
      this.selectedRoomObj = data;
      const roomDialog = this.dialog
        .open(DeleteRoomConfirmationComponent, {
          width: '30%',
          autoFocus: true,
          data: {
            id: this.selectedRoomObj.id,
            name: this.selectedRoomObj.name,
            nameAr: this.selectedRoomObj.nameAr
          },
        });

      roomDialog.afterClosed().subscribe(res => {
        this.buildingService.GetAllBuildingsByHospitalId(this.hospitalId).subscribe(builds => {
          this.lstBuildings = builds;
        });
        this.filterFloorByBuildingId(this.selectedBuildId);
        this.filterRoomsByFloorId(this.selectedFloorId);
      });
    });
  }
}