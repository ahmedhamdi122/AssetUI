import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HospitalFloorsRoutingModule } from './hospital-floors-routing.module';
import { DeleteFloorConfirmationComponent } from './delete-floor-confirmation/delete-floor-confirmation.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { TooltipModule } from 'primeng/tooltip';
import { DeleteModule } from 'src/app/Shared/delete/delete.module';

@NgModule({
  declarations: [
    DeleteFloorConfirmationComponent
  ],
  imports: [
    DeleteModule,
    CommonModule,
    BrowserModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    TooltipModule,
    HospitalFloorsRoutingModule
  ]
})
export class HospitalFloorsModule { }
