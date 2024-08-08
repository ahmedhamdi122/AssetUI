import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
const routes: Routes = [

  { path: '', component: ListComponent, data: { breadcrumb: 'Asset.ExternalAssetMovement' } },
  { path: 'addexternalassetmovement', component: CreateComponent, data: { breadcrumb: 'Asset.Create' } },
  { path: 'viewexternalassetmovement/:id', component: ViewComponent, data: { breadcrumb: 'Asset.View' } },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternalassetmovementRoutingModule { }
