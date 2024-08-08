import { Component, OnInit, Inject } from '@angular/core';
import { RoomService } from 'src/app/Shared/Services/room.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EditRoomVM } from 'src/app/Shared/Models/roomVM';
@Component({
  selector: 'app-delete-room-confirmation',
  templateUrl: './delete-room-confirmation.component.html',
  styleUrls: ['./delete-room-confirmation.component.css']
})
export class DeleteRoomConfirmationComponent implements OnInit {

  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  roomObj: EditRoomVM;
  id: number;
  name = ""
  arabicName = ""
  message = ""
  action: any
  constructor(private roomService: RoomService, public dialog: MatDialogRef<DeleteRoomConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private _snackBar: MatSnackBar, private route: Router) {
    this.roomObj = { ...data };
    this.id = this.roomObj.id;
  //  this.name = this.roomObj.name;

        
    if (this.lang == "en") {
      this.name = this.roomObj.name;
    }
    else {
      this.name = this.roomObj.nameAr;
    }


  }

  ngOnInit(): void {
        
    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }
  }


  close(): void {
    this.dialog.close();
    this._snackBar.dismiss();
  }
  delete(): void {
    this.roomService.DeleteRoom(this.id).subscribe(deleted => {
      this.message = 'Data is deleted successfully';
      this.action = "close";
      this._snackBar.open(this.message, this.action, { panelClass: 'snackbar' });
      this.dialog.close();
    });
  }


}
