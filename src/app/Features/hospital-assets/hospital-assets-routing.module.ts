import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
//import { AuthGuard } from 'src/app/Shared/Services/guards/authGuard.guard';
import { CreateComponent } from './create/create.component';
import { DetailsComponent } from './details/details.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { ListhorizontalComponent } from './listhorizontal/listhorizontal.component';
import { ListverticalComponent } from './listvertical/listvertical.component';
import { PmcalendarComponent } from './pmcalendar/pmcalendar.component';
import { PrintQrListComponent } from './print-qr-list/print-qr-list.component';

const routes: Routes = [

  { path: '', component: ListComponent, data: { breadcrumb: 'Asset.HospitalAssets' } },



  { path: 'hospitalAssetSupplier/:supplierId', component: ListComponent, data: { breadcrumb: 'Asset.HospitalAssets' } },



  { path: 'assetsBrand/:brandId', component: ListComponent, data: { breadcrumb: 'Asset.HospitalAssets' } },
  { path: 'addhospitalasset', component: CreateComponent, data: { breadcrumb: 'Asset.Create' } },
  { path: 'edithospitalasset/:id', component: EditComponent, data: { breadcrumb: 'Asset.Edit' } },
  { path: 'detail/:id', component: DetailsComponent, data: { breadcrumb: 'Asset.AssetDetails' } },
  { path: 'detail1/:id/:pageNumber', component: DetailsComponent, data: { breadcrumb: 'Asset.AssetDetails' } },
  // { path: 'detail/:id/:pageNumber', component: DetailsComponent, data: { breadcrumb: 'Asset.AssetDetails' } },
  { path: 'print-qrs', component: PrintQrListComponent, data: { breadcrumb: 'Asset.Qr' } },
  //  { path: 'pmcalender', component: PmcalendarComponent, canActivate: [AuthGuard], data: { breadcrumb: 'Asset.PMCalendar' } },
  { path: 'pmcalender/:id', component: PmcalendarComponent, data: { breadcrumb: 'Asset.PMCalendar' } },
  { path: 'lsthorizontal', component: ListhorizontalComponent, data: { breadcrumb: 'Asset.HospitalAssets' } },
  { path: 'lstvertical', component: ListverticalComponent, data: { breadcrumb: 'Hospital Asset Vertical List' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HospitalAssetsRoutingModule { }
