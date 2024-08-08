import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierExecludesRoutingModule } from './supplier-execludes-routing.module';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { TranslateModule } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { DialogModule } from 'primeng/dialog';
import { ExecludedateComponent } from './execludedate/execludedate.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ViewComponent } from './view/view.component';
import { PaginatorModule } from 'primeng/paginator';
import { MatButtonModule } from '@angular/material/button';
import { TableModule } from 'primeng/table';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteconfirmationComponent } from './deleteconfirmation/deleteconfirmation.component';
import { FileUploadModule } from 'primeng/fileupload';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DeleteModule } from 'src/app/Shared/delete/delete.module';

@NgModule({
  declarations: [
    ListComponent,
    CreateComponent,
    EditComponent,
    ExecludedateComponent,
    ViewComponent,
    DeleteconfirmationComponent
  ],
  imports: [
    DeleteModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SupplierExecludesRoutingModule,
    TranslateModule,
    DataTablesModule,
    MatCheckboxModule,
    MatRadioModule,
    DynamicDialogModule,
    DialogModule,
    TooltipModule,
    PaginatorModule,
    MatButtonModule,
    MatListModule,
    FileUploadModule,
    MatBadgeModule,
    MatDialogModule,
    TableModule,
    AutoCompleteModule,
    MatIconModule
  ]
})
export class SupplierExecludesModule { }
