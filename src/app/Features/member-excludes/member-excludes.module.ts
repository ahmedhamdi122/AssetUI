import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MemberExcludesRoutingModule } from './member-excludes-routing.module';
import { ListComponent } from './list/list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatRadioModule } from '@angular/material/radio';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import { PaginatorModule } from 'primeng/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { TableModule } from 'primeng/table';
import { ExecludedateComponent } from './execludedate/execludedate.component';
import { AssetdetailComponent } from './assetdetail/assetdetail.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
@NgModule({
  declarations: [
    ListComponent,
    ExecludedateComponent,
    AssetdetailComponent
  ],
  imports: [
    CommonModule,
    MemberExcludesRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatRadioModule,
    DynamicDialogModule,
    DialogModule,
    TooltipModule,
    PaginatorModule,
    MatButtonModule,
    MatListModule,
    MatBadgeModule,
    TableModule,
    MatRadioModule,
    MatListModule,
    TooltipModule,
    PaginatorModule,
    TableModule,
    NgxQRCodeModule,
    MatButtonModule,
    MatBadgeModule,
    MatListModule,
    MatButtonModule,
    MatDialogModule,
    ConfirmDialogModule

  ]
})
export class MemberExcludesModule { }
