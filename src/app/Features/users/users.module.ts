import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule, MatDialogRef } from "@angular/material/dialog";

import { TranslateModule } from '@ngx-translate/core';

import { DialogModule } from 'primeng/dialog';
import { DeleteconfirmationComponent } from './deleteconfirmation/deleteconfirmation.component';
import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TableModule } from 'primeng/table';
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
    FormsModule,
    ReactiveFormsModule,
    MatRadioModule,
    MatSnackBarModule,
    MatDialogModule,
    TranslateModule,
    DialogModule,
    TooltipModule,
    PaginatorModule,
    UsersRoutingModule,
    MatCheckboxModule,
    TableModule
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    },

  ],
})
export class UsersModule { }
