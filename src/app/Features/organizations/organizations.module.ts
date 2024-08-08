import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from "@angular/material/dialog";

import { OrganizationsRoutingModule } from './organizations-routing.module';
import { DeleteconfirmationComponent } from './deleteconfirmation/deleteconfirmation.component';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';


import { PickListModule } from 'primeng/picklist';
import { DialogModule } from 'primeng/dialog';
import { ListboxModule } from 'primeng/listbox';
import { TranslateModule } from '@ngx-translate/core';
import { DeleteModule } from 'src/app/Shared/delete/delete.module';

import { TooltipModule } from 'primeng/tooltip';
@NgModule({
  declarations: [
    DeleteconfirmationComponent,
    ListComponent,
    CreateComponent,
    EditComponent
  ],
  imports: [
    DeleteModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDialogModule,
    PickListModule,
    DialogModule,
    ListboxModule,
    TranslateModule,
    TooltipModule,
    OrganizationsRoutingModule
  ]
})
export class OrganizationsModule { }
