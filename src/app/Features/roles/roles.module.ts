import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RolesRoutingModule } from './roles-routing.module';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DataTablesModule } from 'angular-datatables';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteconfirmationComponent } from './deleteconfirmation/deleteconfirmation.component';

import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { TranslateModule } from '@ngx-translate/core';
import { PaginatorModule } from 'primeng/paginator';
import { ColumnFilter, TableModule } from 'primeng/table';
import { MultiSelectModule } from 'primeng/multiselect';

import { DeleteModule } from 'src/app/Shared/delete/delete.module';
@NgModule({
  declarations: [
    ListComponent,
    CreateComponent,
    EditComponent,
    DeleteconfirmationComponent
  ],
  imports: [
    DeleteModule,
    CommonModule,
    DataTablesModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDialogModule,
    RolesRoutingModule,
    DialogModule,
    TranslateModule,
    TooltipModule,
    DynamicDialogModule,
    PaginatorModule,
    TableModule,
    MultiSelectModule
  ]
})
export class RolesModule { }
