import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HospitalRoomsRoutingModule } from './hospital-rooms-routing.module';
import { DeleteRoomConfirmationComponent } from './delete-room-confirmation/delete-room-confirmation.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TooltipModule } from 'primeng/tooltip';
import { DeleteModule } from 'src/app/Shared/delete/delete.module';

@NgModule({
  declarations: [
    DeleteRoomConfirmationComponent
  ],
  imports: [
    DeleteModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TooltipModule,
    HospitalRoomsRoutingModule
  ]
})
export class HospitalRoomsModule { }
