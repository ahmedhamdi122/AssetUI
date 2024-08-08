import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SuppliersRoutingModule } from './suppliers-routing.module';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TooltipModule } from 'primeng/tooltip';
import { MatDialogModule } from "@angular/material/dialog";
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { MultiSelectModule } from 'primeng/multiselect';
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
import { DeletesupplierConfirmationComponent } from './deletesupplier-confirmation/deletesupplier-confirmation.component';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { CreateSupplierComponent } from './create-supplier/create-supplier.component';
import { ViewComponent } from './view/view.component';
import { SupplierassetsComponent } from './supplierassets/supplierassets.component';
import { MatButtonModule } from '@angular/material/button';
import { DeleteModule } from 'src/app/Shared/delete/delete.module';
@NgModule({
  declarations: [CreateComponent,
    EditComponent,
    ListComponent,
    DeletesupplierConfirmationComponent,
    CreateSupplierComponent,
    ViewComponent,
    SupplierassetsComponent],
  imports: [
    DeleteModule,
    CommonModule,
    SuppliersRoutingModule,
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
    MultiSelectModule,
    AutoCompleteModule,
    MatButtonModule,
    MatIconModule

  ]
})
export class SuppliersModule { }
