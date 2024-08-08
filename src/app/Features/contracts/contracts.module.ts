import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { DataTablesModule } from 'angular-datatables';
import { ContractsRoutingModule } from './contracts-routing.module';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';

import { DialogModule } from 'primeng/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { AvatarModule } from 'primeng/avatar';
import { PickListModule } from 'primeng/picklist';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';
import { ListboxModule } from 'primeng/listbox';
import { ViewContractComponent } from './view/view-contract.component';
import { MatIconModule } from '@angular/material/icon';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { ContractDetailsComponent } from './details/contract-details.component';
import { RadioButtonModule } from 'primeng/radiobutton';


@NgModule({
  declarations: [
    CreateComponent,
    ListComponent,
    EditComponent,
    ViewContractComponent,
    ContractDetailsComponent
  ],
  imports: [
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
    PickListModule,
    ConfirmDialogModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    TooltipModule,
    ContractsRoutingModule,
    PaginatorModule,
    TableModule,
    MultiSelectModule,
    DialogModule,
    ListboxModule,
    MatIconModule,
    MatDatepickerModule,
    AutoCompleteModule,
    MatButtonModule,
    RadioButtonModule
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    }]

})
export class ContractsModule { }
