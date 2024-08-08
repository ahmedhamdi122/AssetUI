import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.Component';

const routes: Routes = [
  { path: '', component: ListComponent, data: { breadcrumb: 'Asset.ExternalFix' } },
  { path: 'addexternalfix', component: CreateComponent, data: { breadcrumb: 'Asset.AddExternalFix' } },
  { path: 'editexternalfix/:id', component: EditComponent, data: { breadcrumb: 'Asset.EditBrand' } },
  { path: 'viewexternalfix/:id', component: ViewComponent, data: { breadcrumb: 'Asset.ViewBrand' } },
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExternalFixRoutingMoule { }
