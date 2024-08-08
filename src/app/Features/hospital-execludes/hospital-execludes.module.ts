import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HospitalExecludesRoutingModule } from './hospital-execludes-routing.module';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { EditComponent } from './edit/edit.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';


import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { MatButtonModule } from '@angular/material/button';
import { TableModule } from 'primeng/table';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { ExecludedateComponent } from './execludedate/execludedate.component';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { ViewComponent } from './view/view.component';
import { FileUploadModule } from 'primeng/fileupload';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DeleteconfirmationComponent } from './deleteconfirmation/deleteconfirmation.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { A11yModule } from '@angular/cdk/a11y';
import { DeleteModule } from 'src/app/Shared/delete/delete.module';


@NgModule({
  declarations: [
    CreateComponent,
    ListComponent,
    EditComponent,
    ViewComponent,
    ExecludedateComponent,
    DeleteconfirmationComponent
  ],
  imports: [
    DeleteModule,
    CommonModule,
    HospitalExecludesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatRadioModule,
    DialogModule,
    DynamicDialogModule,
    TooltipModule,
    PaginatorModule,
    MatButtonModule,
    MatListModule,
    MatBadgeModule,
    MatDialogModule,
    TableModule,
    TranslateModule,
    FileUploadModule,
    AutoCompleteModule,
    A11yModule
  ]
})
export class HospitalExecludesModule { }
