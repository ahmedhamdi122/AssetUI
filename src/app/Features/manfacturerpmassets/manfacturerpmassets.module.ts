import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManfacturerpmassetsRoutingModule } from './manfacturerpmassets-routing.module';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';

import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge'
import { NgxBarcodeModule } from 'ngx-barcode';
import { DialogModule } from 'primeng/dialog';

import { FullCalendarModule } from '@fullcalendar/angular';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
import { ManfacturerpmcalendarComponent } from './manfacturerpmcalendar/manfacturerpmcalendar.component';
import { ViewComponent } from './view/view.component';
import { AddpmdoneComponent } from './addpmdone/addpmdone.component';


@NgModule({
  declarations: [
    CreateComponent,
    ListComponent,
    ManfacturerpmcalendarComponent,
    ViewComponent,
    AddpmdoneComponent
  ],
  imports: [

    CommonModule,
    ManfacturerpmassetsRoutingModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    MatDialogModule,
    DynamicDialogModule,
    DialogModule,
    CalendarModule,
    MatDialogModule,
    MatButtonModule,
    AutoCompleteModule,
    MatIconModule,
    MatBadgeModule,
    NgxBarcodeModule,
    FullCalendarModule,
    MatSnackBarModule,
    TooltipModule,
    DropdownModule,

  ]
  ,
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class ManfacturerpmassetsModule { }
