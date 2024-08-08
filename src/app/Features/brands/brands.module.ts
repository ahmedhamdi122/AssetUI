import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BrandsRoutingModule } from './brands-routing.module';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ListBrandComponent } from './list/list-brand.component';
import { DeleteBrandConfirmationComponent } from './delete-brand-confirmation/delete-brand-confirmation.component';
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
import { ViewComponent } from './view/view.component';
import { TableModule } from 'primeng/table';
import { CreateBrandComponent } from './create-brand/create-brand.component';
import { DeleteModule } from 'src/app/Shared/delete/delete.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AutoCompleteModule } from 'primeng/autocomplete';


@NgModule({
  declarations: [
    CreateComponent,
    EditComponent,
    ListBrandComponent,
    DeleteBrandConfirmationComponent,
    ViewComponent,
    CreateBrandComponent
  ],
  imports: [
    DeleteModule,

    CommonModule,
    BrandsRoutingModule,
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
    PaginatorModule,
    TableModule,
    AutoCompleteModule
  ]
})
export class BrandsModule { }
