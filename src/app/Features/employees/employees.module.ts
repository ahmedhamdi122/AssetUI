import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { EmployeesRoutingModule } from './employees-routing.module';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';

import { TooltipModule } from 'primeng/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from "@angular/material/dialog";
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { DataTablesModule } from 'angular-datatables';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
@NgModule({
  declarations: [
    ListComponent,
    CreateComponent,
    EditComponent
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
    TranslateModule,
    DialogModule,
    ConfirmDialogModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    TooltipModule,
    EmployeesRoutingModule,
    PaginatorModule,
    TableModule
  ]
})
export class EmployeesModule { }
