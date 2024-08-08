import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AssetmovementRoutingModule } from './assetmovement-routing.module';
import { ListComponent } from './list/list.component';
import { CreateComponent } from './create/create.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

import { TooltipModule } from 'primeng/tooltip';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DeleteAssetMoveconfirmationComponentComponent } from './delete-asset-moveconfirmation-component/delete-asset-moveconfirmation-component.component';
import { DeleteModule } from 'src/app/Shared/delete/delete.module';
@NgModule({
  declarations: [
    ListComponent,
    CreateComponent,
    DeleteAssetMoveconfirmationComponentComponent
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
    AutoCompleteModule,
    MatButtonModule,
    MatIconModule,
    AssetmovementRoutingModule,
    DeleteModule
  ]
})
export class AssetmovementModule { }
