import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [
  { path: '', component: ListComponent, data: { breadcrumb: 'Asset.AssetStatus' } },
  { path: 'addAssetStatus', component: CreateComponent, data: { breadcrumb: 'Asset.Create' } },
  { path: 'editAssetStatus/:id', component: EditComponent, data: { breadcrumb: 'Asset.Edit' } },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssetsStatusRoutingModule { }
