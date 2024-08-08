import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { DialogModule } from 'primeng/dialog';
import { RoleCategoriesRoutingModule } from './role-categories-routing.module';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { DeleteconfirmationComponent } from './deleteconfirmation/deleteconfirmation.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ViewComponent } from './view/view.component';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { TableModule } from 'primeng/table';
import { DeleteModule } from 'src/app/Shared/delete/delete.module';
@NgModule({
  declarations: [
    ListComponent,
    CreateComponent,
    EditComponent,
    DeleteconfirmationComponent,
    ViewComponent,
  ],
  imports: [
   
    DeleteModule,
     CommonModule,
    DataTablesModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatDialogModule,
    DialogModule,
    TranslateModule,
    TooltipModule,
    RoleCategoriesRoutingModule,
    TableModule
  ],
})
export class RoleCategoriesModule { }
