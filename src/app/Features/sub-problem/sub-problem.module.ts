import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubProblemRoutingModule } from './sub-problem-routing.module';
import { DeletesubProblemConfirmationComponent } from './deletesub-problem-confirmation/deletesub-problem-confirmation.component';
import { CreateSubProblemComponent } from './create-sub-problem/create-sub-problem.component';
import { EditSubProblemComponent } from './edit-sub-problem/edit-sub-problem.component';
import { ListComponent } from './list/list.component';
import { DataTablesModule } from 'angular-datatables';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { TooltipModule } from 'primeng/tooltip';
import { MatDialogModule } from "@angular/material/dialog";
import { MatTabsModule } from '@angular/material/tabs';
import { MatRadioModule } from '@angular/material/radio';
import { TranslateModule } from '@ngx-translate/core';
import { DialogModule } from 'primeng/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatListModule } from '@angular/material/list';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { PaginatorModule } from 'primeng/paginator';


import { DeleteModule } from 'src/app/Shared/delete/delete.module';

@NgModule({
  declarations: [
    DeletesubProblemConfirmationComponent,
    CreateSubProblemComponent,
    EditSubProblemComponent,
    ListComponent,
    
  
  ],
  imports: [
   
 DeleteModule,
  CommonModule,
    SubProblemRoutingModule,DataTablesModule,
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
    PaginatorModule
  ]
})
export class SubProblemModule { }
