import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExternalFixRoutingMoule } from './external-fix-routing.module';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { TableModule } from 'primeng/table';
import { TranslateModule } from '@ngx-translate/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { ViewComponent } from './view/view.Component';
import { EditComponent } from './edit/edit.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
@NgModule({
  declarations: [
    ListComponent,
    CreateComponent,
    ViewComponent,
    EditComponent

  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
  imports: [

    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ExternalFixRoutingMoule,
    TableModule,
    TranslateModule,
    AutoCompleteModule,
    DialogModule,
    CalendarModule,
    MatRadioModule,
    ConfirmDialogModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule
  ]
})
export class ExternalFixModule { }
