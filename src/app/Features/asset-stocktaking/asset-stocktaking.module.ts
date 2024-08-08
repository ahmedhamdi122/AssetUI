import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetStocktakingRoutingModule } from './asset-stocktaking-routing.module';
import { ListComponent } from './list/list.component';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
  declarations: [
    ListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AssetStocktakingRoutingModule,
    TranslateModule,
    TableModule,
    TooltipModule,
    AutoCompleteModule,
    MatIconModule,
    MatButtonModule,
    MultiSelectModule
  ]
})
export class AssetStocktakingModule { }
