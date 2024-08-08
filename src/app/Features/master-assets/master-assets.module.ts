import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MasterAssetsRoutingModule } from './master-assets-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from "@angular/material/dialog";
import { MatTabsModule } from '@angular/material/tabs';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TranslateModule } from '@ngx-translate/core';
import { DataTablesModule } from 'angular-datatables';
import { MatRadioModule } from '@angular/material/radio';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { MatSnackBarModule } from '@angular/material/snack-bar';


import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { DeleteconfirmationComponent } from './deleteconfirmation/deleteconfirmation.component';
import { MatIconModule } from '@angular/material/icon';
import { ViewComponent } from './view/view.component';
import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { TableModule } from 'primeng/table';
import { DeleteModule } from 'src/app/Shared/delete/delete.module';
import { AutoCompleteModule } from 'primeng/autocomplete';

@NgModule({
  declarations: [
    ListComponent,
    CreateComponent,
    EditComponent,
    DeleteconfirmationComponent,
    ViewComponent
  ],
  imports: [
    DeleteModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    DialogModule,
    MatTabsModule,
    TranslateModule,
    DataTablesModule,
    MatRadioModule,
    MatSnackBarModule,
    NgxMatFileInputModule,
    ConfirmDialogModule,
    MatRadioModule,
    MatIconModule,
    TableModule,
    TooltipModule,
    MasterAssetsRoutingModule,
    PaginatorModule,
    AutoCompleteModule
  ]
})
export class MasterAssetsModule { }
