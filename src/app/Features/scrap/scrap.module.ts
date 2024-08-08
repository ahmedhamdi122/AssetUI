import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

import { ScrapRoutingModule } from './scrap-routing.module';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { NgxBarcodeModule } from 'ngx-barcode';
import { MatStepperModule } from '@angular/material/stepper';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { MatDialogModule } from "@angular/material/dialog";
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { PickListModule } from 'primeng/picklist';
import { ListboxModule } from 'primeng/listbox';
import { DataTablesModule } from 'angular-datatables';
import { MatButtonModule } from '@angular/material/button';
import { ToastModule } from 'primeng/toast';
import { MatExpansionModule } from '@angular/material/expansion';
import { DashboardModule } from 'src/app/dashboard/dashboard.module';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { PaginatorModule } from 'primeng/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatRadioModule } from '@angular/material/radio';
import { MultiSelectModule } from 'primeng/multiselect';
import { FieldsetModule } from 'primeng/fieldset';
import { ViewComponent } from './view/view.component';
import { DeleteconfirmationComponent } from './deleteconfirmation/deleteconfirmation.component';
import { DeleteModule } from 'src/app/Shared/delete/delete.module';
@NgModule({
  declarations: [
    CreateComponent,
    ListComponent,
    ViewComponent,
    DeleteconfirmationComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  imports: [
    DeleteModule,
    CommonModule,
    ScrapRoutingModule,
    TableModule,
    TranslateModule,
    MatTabsModule,
    MatDialogModule,
    TooltipModule,
    DialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    DropdownModule,
    CalendarModule,
    AutoCompleteModule,
    NgxBarcodeModule,
    MatStepperModule,
    MatCheckboxModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    PickListModule,
    ListboxModule,
    DataTablesModule,
    MatButtonModule,
    ToastModule,
    MatExpansionModule,
    DashboardModule,
    DynamicDialogModule,
    PaginatorModule,
    MatIconModule,
    MatBadgeModule,
    MatRadioModule,
    MultiSelectModule,
    FieldsetModule
  ]
})
export class ScrapModule { }
