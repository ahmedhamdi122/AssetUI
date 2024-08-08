import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetagegroupsComponent } from './assetagegroups/assetagegroups.component';
import { BIReport1Component } from './bireport1/bireport1.component';
import { FilterassetagegroupsComponent } from './filterassetagegroups/filterassetagegroups.component';
import { HospitalappComponent } from './hospitalapp/hospitalapp.component';
import { HospitalassetsQRComponent } from './hospitalassets-qr/hospitalassets-qr.component';
import { HospitalcountpriceComponent } from './hospitalcountprice/hospitalcountprice.component';
import { HospitalreportComponent } from './hospitalreport/hospitalreport.component';
import { SrwithindateComponent } from './srwithindate/srwithindate.component';
import { SrwotimelineComponent } from './srwotimeline/srwotimeline.component';
import { WowithindateComponent } from './wowithindate/wowithindate.component';
import { AssetdepartmentComponent } from './assetdepartment/assetdepartment.component';
import { AssethistoryComponent } from './assethistory/assethistory.component';
import { DepartmentbrandsupplierComponent } from './departmentbrandsupplier/departmentbrandsupplier.component';
import { FindSupplierComponent } from './find-supplier/find-supplier.component';
import { OpenRequestsComponent } from './open-requests/open-requests.component';
import { SrInProgressComponent } from './sr-in-progress/sr-in-progress.component';
import { AssetqrComponent } from './assetqr/assetqr.component';
import { GeosearchComponent } from './geosearch/geosearch.component';
import { PmassetsComponent } from './pmassets/pmassets.component';
const routes: Routes = [
  { path: 'governoratehospitals', component: HospitalreportComponent, data: { breadcrumb: 'Asset.Report' } },
  { path: 'hospitalcountprice', component: HospitalcountpriceComponent, data: { breadcrumb: 'Asset.Report' } },
  { path: 'assetagegroup', component: AssetagegroupsComponent, data: { breadcrumb: 'Asset.Report' } },
  { path: 'filterassetagegroup', component: FilterassetagegroupsComponent, data: { breadcrumb: 'Asset.Report' } },
  { path: 'hospitalassetsQR', component: HospitalassetsQRComponent, data: { breadcrumb: 'Asset.Report' } },
  { path: 'srinprogress', component: SrInProgressComponent, data: { breadcrumb: 'Asset.Report' } },
  { path: 'srwithindate', component: SrwithindateComponent, data: { breadcrumb: 'Asset.Report' } },
  { path: 'wowithindate', component: WowithindateComponent, data: { breadcrumb: 'Asset.Report' } },
  { path: 'bireport', component: BIReport1Component, data: { breadcrumb: 'Asset.Power BI' } },
  { path: 'hospitalreport', component: HospitalappComponent, data: { breadcrumb: 'Asset.Report' } },
  { path: 'srwotimeline', component: SrwotimelineComponent, data: { breadcrumb: 'Asset.Report' } },
  { path: 'assetsdepartments', component: AssetdepartmentComponent, data: { breadcrumb: 'Asset.Report' } },
  { path: 'assethistorypage', component: AssethistoryComponent, data: { breadcrumb: 'Asset.Report' } },
  { path: 'dbs', component: DepartmentbrandsupplierComponent, data: { breadcrumb: 'Asset.Report' } },
  { path: 'findsuppliers', component: FindSupplierComponent, data: { breadcrumb: 'Asset.Report' } },
  { path: 'openRequests', component: OpenRequestsComponent, data: { breadcrumb: 'Asset.Report' } },
  { path: 'assetsQR', component: AssetqrComponent, data: { breadcrumb: 'Asset.Report' } },
  { path: 'geo', component: GeosearchComponent, data: { breadcrumb: 'Asset.Geo' } },
  { path: 'pmAssetsReport', component: PmassetsComponent, data: { breadcrumb: 'Asset.PM' } }
  
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
