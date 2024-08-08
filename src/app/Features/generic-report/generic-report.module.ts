import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenericReportRoutingModule } from './generic-report-routing.module';
import { AssetReportComponent } from './asset-report/asset-report.component';
import { TranslateModule } from '@ngx-translate/core';;
import { DropdownModule } from 'primeng/dropdown';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { ButtonModule } from 'primeng/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { LayoutModule } from '@angular/cdk/layout';
import { LayoutRoutingModule } from 'src/app/layout/layout-routing.module';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { RippleModule } from 'primeng/ripple';
@NgModule({
  declarations: [
    AssetReportComponent
  ],
  imports: [
    CommonModule,
    GenericReportRoutingModule,
    TranslateModule,
    DropdownModule,
    MatExpansionModule,
    MatIconModule,
    ButtonModule,
    MatToolbarModule,
    MatButtonModule,
    LayoutModule,
    LayoutRoutingModule,
    AutoCompleteModule,
    RippleModule
  ],
  providers: [],
})
export class GenericReportModule { }
