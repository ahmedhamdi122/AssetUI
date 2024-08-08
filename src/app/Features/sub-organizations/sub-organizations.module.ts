import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from "@angular/material/dialog";
import { PickListModule } from 'primeng/picklist';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';


import { SubOrganizationsRoutingModule } from './sub-organizations-routing.module';
import { CreatesuborganizationComponent } from './createsuborganization/createsuborganization.component';
import { EditsuborganizationComponent } from './editsuborganization/editsuborganization.component';
import { DeleteSubOrgConfirmationComponent } from './delete-sub-org-confirmation/delete-sub-org-confirmation.component';
import { TranslateModule } from '@ngx-translate/core';
import { DeleteModule } from 'src/app/Shared/delete/delete.module';

@NgModule({
  declarations: [
    CreatesuborganizationComponent,
    EditsuborganizationComponent,
    DeleteSubOrgConfirmationComponent
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
    TranslateModule,
    TooltipModule,
    SubOrganizationsRoutingModule
  ]
})
export class SubOrganizationsModule { }
