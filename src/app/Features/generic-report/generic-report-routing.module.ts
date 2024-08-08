import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetReportComponent } from './asset-report/asset-report.component';
import { TableModule } from 'primeng/table';
const routes: Routes = [
  { path: 'assetReport', component: AssetReportComponent, data: { breadcrumb: 'Asset.Report' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [
    RouterModule,
    TableModule
  ]
})
export class GenericReportRoutingModule { }
