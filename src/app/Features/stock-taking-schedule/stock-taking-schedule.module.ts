import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockTakingScheduleRoutingModule } from './stock-taking-schedule-routing.module';

import { ListComponent } from './list/list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExternalFixRoutingMoule } from '../external-fix/external-fix-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TableModule } from 'primeng/table';
import {CreateComponent} from './create/create.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { TooltipModule } from 'primeng/tooltip';



@NgModule({
  declarations: [
  
    ListComponent,
    CreateComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    StockTakingScheduleRoutingModule,
    TableModule,
    TranslateModule,
    AutoCompleteModule,
    DialogModule,
    CalendarModule,
    MatRadioModule,
    ConfirmDialogModule,
    MatCheckboxModule,
    MultiSelectModule
    ,MatDatepickerModule,
    MatButtonModule,
    DialogModule,
    TooltipModule

  ]
})
export class StockTakingScheduleModule { }
