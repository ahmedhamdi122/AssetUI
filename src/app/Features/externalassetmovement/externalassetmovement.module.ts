import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExternalassetmovementRoutingModule } from './externalassetmovement-routing.module';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipModule } from 'primeng/tooltip';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { ViewComponent } from './view/view.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [
    CreateComponent,
    ListComponent,
    ViewComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TooltipModule,
    AutoCompleteModule,
    DialogModule,
    TableModule,
    TooltipModule,
    AutoCompleteModule,
    MatButtonModule,
    MatIconModule,
    ExternalassetmovementRoutingModule
  ]
})
export class ExternalassetmovementModule { }
