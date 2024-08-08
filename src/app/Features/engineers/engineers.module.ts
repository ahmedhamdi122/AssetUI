import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';


import { EngineersRoutingModule } from './engineers-routing.module';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';

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
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewComponent } from './view/view.component';
import { DeleteconfirmationComponent } from './deleteconfirmation/deleteconfirmation.component';
import { DeleteModule } from 'src/app/Shared/delete/delete.module';

@NgModule({
  declarations: [
    CreateComponent,
    EditComponent,
    ListComponent,
    ViewComponent,
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
    PaginatorModule,
    TableModule,
    EngineersRoutingModule
  ]
})
export class EngineersModule { }
