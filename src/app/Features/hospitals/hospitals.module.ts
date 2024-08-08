import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DataTablesModule } from 'angular-datatables';


import { HospitalsRoutingModule } from './hospitals-routing.module';
import { DeleteconfirmationComponent } from './deleteconfirmation/deleteconfirmation.component';
import { ListHospitalComponent } from './list/list-hospitals.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from 'primeng/dialog';
import { ViewComponent } from './view/view.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { AvatarModule } from 'primeng/avatar';
import { AgmCoreModule } from '@agm/core';
import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { CalendarModule } from 'primeng/calendar';
import { DeleteModule } from 'src/app/Shared/delete/delete.module';


@NgModule({
  declarations: [
    DeleteconfirmationComponent,
    ListHospitalComponent,
    CreateComponent,
    EditComponent,
    ViewComponent
  ],
  imports: [
    DeleteModule,
    CommonModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDialogModule,
    MatTabsModule,
    MatRadioModule,
    MatCheckboxModule,
    MatListModule,
    AvatarModule,
    TranslateModule,
    DialogModule,
    AgmCoreModule,
    TooltipModule,
    HospitalsRoutingModule,
    PaginatorModule,
    TableModule,
    DialogModule,
    MultiSelectModule,
    CalendarModule
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    },

  ],

})
export class HospitalsModule { }
