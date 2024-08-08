import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';

const routes: Routes = [

  { path: '', component: ListComponent, data: { breadcrumb: 'Asset.MasterAssets' } },
  { path: 'addmasterasset', component: CreateComponent, data: { breadcrumb: 'Asset.AddMasterAsset' } },
  { path: 'editmasterasset/:id', component: EditComponent, data: { breadcrumb: 'Asset.EditMasterAsset' } },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MasterAssetsRoutingModule { }
