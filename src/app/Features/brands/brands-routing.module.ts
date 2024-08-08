import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ListBrandComponent } from './list/list-brand.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  { path: '', component: ListBrandComponent, data: { breadcrumb: 'Asset.Brands' } },
  { path: 'addbrand', component: CreateComponent, data: { breadcrumb: 'Asset.AddBrand' } },
  { path: 'createbrand', component: CreateComponent, data: { breadcrumb: 'Asset.AddBrand' } },
  { path: 'editbrand/:id', component: EditComponent, data: { breadcrumb: 'Asset.EditBrand' } },
  { path: 'viewbrand/:id', component: ViewComponent, data: { breadcrumb: 'Asset.ViewBrand' } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class BrandsRoutingModule {

}
