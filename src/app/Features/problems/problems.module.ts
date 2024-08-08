import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProblemsRoutingModule } from './problems-routing.module';

import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TooltipModule } from 'primeng/tooltip';
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
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { ListboxModule } from 'primeng/listbox';
import { DeleteProblemsConfirmationComponent } from './delete-problems-confirmation/delete-problems-confirmation.component';
import { PaginatorModule } from 'primeng/paginator';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DeleteModule } from 'src/app/Shared/delete/delete.module';
@NgModule({
  declarations: [CreateComponent,
    EditComponent,
    ListComponent,
    DeleteProblemsConfirmationComponent],
  imports: [
    DeleteModule,
    CommonModule,
    ProblemsRoutingModule,
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
    ListboxModule,
    PaginatorModule,
    AutoCompleteModule
  ]
})
export class ProblemsModule { }
