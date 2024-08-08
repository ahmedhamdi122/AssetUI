import { CUSTOM_ELEMENTS_SCHEMA, NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WnpmRoutingModule } from './wnpm-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatDialogModule } from '@angular/material/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { TableModule } from 'primeng/table';
import { AddPMDoneComponent } from './add-pmdone/add-pmdone.component';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { ViewComponent } from './view/view.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { DialogModule } from 'primeng/dialog';
import { WnpmcalendarComponent } from './wnpmcalendar/wnpmcalendar.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TooltipModule } from 'primeng/tooltip';
import { DropdownModule } from 'primeng/dropdown';
@NgModule({
  declarations: [
    ListComponent,
    CreateComponent,
    EditComponent,
    AddPMDoneComponent,
    ViewComponent,
    WnpmcalendarComponent
  ],
  imports: [
    CommonModule,
    WnpmRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
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
    DropdownModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
})
export class WnpmModule { }
