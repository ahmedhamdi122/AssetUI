import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListboxModule } from 'primeng/listbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PickListModule } from 'primeng/picklist';
import { DataTablesModule } from 'angular-datatables';
import { MatStepperModule } from '@angular/material/stepper';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MatButtonModule } from '@angular/material/button';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';

import { WorkOrdersRoutingModule } from './work-orders-routing.module';
import { CreateWOComponent } from './create/createwo.component';
import { EditComponent } from './edit/edit.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CheckboxModule } from 'primeng/checkbox';
import { TranslateModule } from '@ngx-translate/core';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { WotasksComponent } from './wotasks/wotasks.component';
import { ListWOComponent } from './list/listwo.component';
import { AddwotrackstatusComponent } from './addwotrackstatus/addwotrackstatus.component';
import { ViewWorkorderComponent } from './view-workorder/view-workorder.component';
import { MatRadioModule } from '@angular/material/radio';
import { ReassignworkorderComponent } from './reassignworkorder/reassignworkorder.component';
import { PaginatorModule } from 'primeng/paginator';
import { MatBadgeModule } from '@angular/material/badge';
import { MultiSelectModule } from 'primeng/multiselect';
import { FieldsetModule } from "primeng/fieldset";
import { NgxBarcodeModule } from 'ngx-barcode';
import { MatSelectModule } from '@angular/material/select';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { AuthGuard } from 'src/app/Shared/Services/guards/authGuard.guard';
import { MatSidenavModule } from '@angular/material/sidenav';

@NgModule({
  declarations: [
    ListWOComponent,
    CreateWOComponent,
    EditComponent,
    WotasksComponent,
    AddwotrackstatusComponent,
    ViewWorkorderComponent,
    ReassignworkorderComponent
  ],

  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDialogModule,
    PickListModule,
    DialogModule,
    ListboxModule,
    WorkOrdersRoutingModule,
    DataTablesModule,
    MatStepperModule,
    MatSelectModule,
    DropdownModule,
    CalendarModule,
    MatButtonModule,
    TooltipModule,
    MatRadioModule,
    DropdownModule,
    ToastModule,
    TableModule,
    MatDatepickerModule,
    MatFormFieldModule,
    PaginatorModule,
    MatInputModule,
    CheckboxModule,
    TranslateModule,
    TableModule,
    MatBadgeModule,
    MultiSelectModule,
    FieldsetModule,
    NgxBarcodeModule,
    AutoCompleteModule,
    MatCheckboxModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule
  ],
  providers: [MessageService, ConfirmationService, DatePipe, DynamicDialogRef, DynamicDialogConfig, AuthGuard]

})
export class WorkOrdersModule { }
