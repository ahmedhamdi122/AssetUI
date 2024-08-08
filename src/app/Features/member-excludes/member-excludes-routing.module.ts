import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssetdetailComponent } from './assetdetail/assetdetail.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  { path: '', component: ListComponent, data: { breadcrumb: 'Asset.HospitalExeclude' } },
  { path: 'assetdetail/:id', component: AssetdetailComponent, data: { breadcrumb: 'Asset.View' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MemberExcludesRoutingModule { }
