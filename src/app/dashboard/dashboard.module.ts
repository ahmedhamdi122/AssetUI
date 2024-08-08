import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatRadioModule } from '@angular/material/radio';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashPageComponent } from './dash-page/dash-page.component';
import { LayoutModule } from '../layout/layout.module';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ChartModule } from 'primeng/chart';
import { ChartdashboardComponent } from './chartdashboard/chartdashboard.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
@NgModule({
  declarations: [DashPageComponent, ChartdashboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    FormsModule,
    DashboardRoutingModule,
    LayoutModule,
    ChartModule,
    DynamicDialogModule,
    TranslateModule,
    DialogModule,
    TableModule,
    MatRadioModule
  ],
  exports: [DashPageComponent, TranslateModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class DashboardModule { }


