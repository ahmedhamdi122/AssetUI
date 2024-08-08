import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ListFloorVM } from 'src/app/Shared/Models/floorVM';
import { CreateRoomVM } from 'src/app/Shared/Models/roomVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { FloorService } from 'src/app/Shared/Services/floor.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { RoomService } from 'src/app/Shared/Services/room.service';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.component.html',
  styleUrls: ['./create-room.component.css']
})
export class CreateRoomComponent implements OnInit {
  currentUser: LoggedUser;
  public lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  lstFloors: ListFloorVM[];
  form: FormGroup;
  roomObj: CreateRoomVM;
  submitted: boolean = false;
  isValidEMail: boolean = false;


  constructor(private authenticationService: AuthenticationService, private floorService: FloorService, private roomService: RoomService, private ref: DynamicDialogRef,
    private config: DynamicDialogConfig) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }
    this.roomObj = { code: '', name: '', nameAr: '', floorId: 0, hospitalId: 0 };
    if (this.config.data != null) {
      let buildId = this.config.data.buildId;
      this.floorService.GetFloorsByBuildingId(buildId).subscribe(floors => {
        this.lstFloors = floors;
      })
    }
    if (this.config.data != null) {
      let floorId = this.config.data.floorId;

      if (floorId != null) {
        this.roomObj.floorId = floorId;
      }
      else {
        this.roomObj.floorId = 0;
      }
    }
  }
  onChange($event) {
    this.roomObj.floorId = $event.target.value;
  }

  onSubmit() {
    if (this.roomObj.code == '') {
      this.submitted = false;
      return false;
    }
    if (this.roomObj.name == '') {
      this.submitted = false;
      return false;
    } else {
      this.roomObj.hospitalId = this.currentUser.hospitalId;

      this.roomService.CreateRoom(this.roomObj).subscribe(id => {
        this.display = true;
        this.ref.close();
      }, (error) => {
        this.errorDisplay = true;

        if (this.lang == 'en') {
          if (error.error.status == 'code') {
            this.errorMessage = error.error.message;
          }
          if (error.error.status == 'name') {
            this.errorMessage = error.error.message;
          }
          if (error.error.status == 'nameAr') {
            this.errorMessage = error.error.message;
          }
        } if (this.lang == 'ar') {
          if (error.error.status == 'code') {
            this.errorMessage = error.error.messageAr;
          }
          if (error.error.status == 'name') {
            this.errorMessage = error.error.messageAr;
          }

          if (error.error.status == 'nameAr') {
            this.errorMessage = error.error.messageAr;
          }
        }
        return false;
      });
    }
  }
  reset() {
    this.roomObj = { code: '', name: '', nameAr: '', floorId: 0, hospitalId: 0 };
  }
}
