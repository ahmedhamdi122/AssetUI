import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [

  { path: '', component: ListComponent, data: { breadcrumb: 'Asset.AssetMovement' } },
  { path: 'addassetmovement', component: CreateComponent, data: { breadcrumb: 'Asset.Create' } },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetmovementRoutingModule { }
