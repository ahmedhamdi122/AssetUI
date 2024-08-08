import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';

import { MatDialogModule } from "@angular/material/dialog";
import { MatTabsModule } from '@angular/material/tabs';

import { VisitsRoutingModule } from './visits-routing.module';
import { ListComponent } from './list/list.component';
import { TableModule } from 'primeng/table';
import { CreateComponent } from './create/create.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EditComponent } from './edit/edit.component';
import { ViewComponent } from './view/view.component';
import { DeleteconfirmationComponent } from './deleteconfirmation/deleteconfirmation.component';
import { MatInputModule } from '@angular/material/input';
import { DeleteModule } from 'src/app/Shared/delete/delete.module';

@NgModule({
  declarations: [
    ListComponent,
    CreateComponent,
    EditComponent,
    ViewComponent,
    DeleteconfirmationComponent
  ],
  imports: [
    DeleteModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    VisitsRoutingModule,
    TableModule,
    TranslateModule,
    MatTabsModule,
    MatDialogModule,
    TooltipModule,
    DialogModule,
    MatFormFieldModule,
    MatInputModule ,
    MatDatepickerModule,
    DropdownModule,
    CalendarModule
  ]
})
export class VisitsModule { }
