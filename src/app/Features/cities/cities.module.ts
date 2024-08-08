import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CitiesRoutingModule } from './cities-routing.module';
import { EditCityComponent } from './edit-city/edit-city.component';
import { CreateCityComponent } from './create-city/create-city.component';
import { DeletecityconfirmationComponent } from './deletecityconfirmation/deletecityconfirmation.component';

import { TooltipModule } from 'primeng/tooltip';


import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from "@angular/material/dialog";
import { PickListModule } from 'primeng/picklist';
import { DialogModule } from 'primeng/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { DeleteModule } from 'src/app/Shared/delete/delete.module';

@NgModule({
  declarations: [
    EditCityComponent,
    CreateCityComponent,
    DeletecityconfirmationComponent
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
    CitiesRoutingModule,
    TooltipModule
  ]
})
export class CitiesModule { }
