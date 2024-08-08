import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequetsRoutingModule } from './requests-routing.module';
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
import { MatExpansionModule } from '@angular/material/expansion';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { TranslateModule } from '@ngx-translate/core';
import { ViewComponent } from './view/view.component';
import { AddStatusComponent } from './add-status/add-status.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DashboardModule } from 'src/app/dashboard/dashboard.module';
import { CloseComponent } from './close/close.component';
import { TrackworkordersComponent } from './trackworkorders/trackworkorders.component';
import { MatIconModule } from '@angular/material/icon';
import { PaginatorModule } from 'primeng/paginator';
import { DeleteconfirmationComponent } from './deleteconfirmation/deleteconfirmation.component';
import { CreaterequestComponent } from './createrequest/createrequest.component';
import { MatBadgeModule } from '@angular/material/badge';
import { MatRadioModule } from '@angular/material/radio';
import { MultiSelectModule } from 'primeng/multiselect';
import { FieldsetModule } from 'primeng/fieldset';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { NgxBarcodeModule } from 'ngx-barcode';
import { ApproverequestComponent } from './approverequest/approverequest.component';

import { MessageService } from 'primeng/api';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { AuthGuard } from 'src/app/Shared/Services/guards/authGuard.guard';

import { DeleteModule } from 'src/app/Shared/delete/delete.module';
import { PrintsrComponent } from './printsr/printsr.component';
@NgModule({
  declarations: [
    EditComponent,
    ListComponent,
    CreateComponent,
    ViewComponent,
    AddStatusComponent,
    CloseComponent,
    TrackworkordersComponent,
    DeleteconfirmationComponent,
    CreaterequestComponent,
    ApproverequestComponent,
    PrintsrComponent
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  imports: [

    DeleteModule,
   
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDialogModule,
    PickListModule,
    DialogModule,
    ListboxModule,
    RequetsRoutingModule,
    DataTablesModule,
    MatStepperModule,
    DropdownModule,
    CalendarModule,
    DialogModule,
    MatButtonModule,
    TooltipModule,
    ToastModule,
    TableModule,
    MatExpansionModule,
    TranslateModule,
    DashboardModule,
    DynamicDialogModule,
    PaginatorModule,
    MatIconModule,
    MatBadgeModule,
    MatRadioModule,
    MultiSelectModule,
    FieldsetModule,
    AutoCompleteModule,
    NgxBarcodeModule,
    MatStepperModule,
    MatCheckboxModule
  ],
  providers: [MessageService, AuthGuard]

})
export class RequetsModule { }
