import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';
import { SupplierassetsComponent } from './supplierassets/supplierassets.component';
const routes: Routes = [
  { path: '', component: ListComponent, data: { breadcrumb: 'Asset.Supplier' } },
  { path: 'addSupplier', component: CreateComponent, data: { breadcrumb: 'Asset.AddSupplier' } },
  { path: 'editSupplier/:id', component: EditComponent, data: { breadcrumb: 'Asset.EditSupplier' } },
  { path: 'viewSupplier/:id', component: ViewComponent, data: { breadcrumb: 'Asset.ViewSupplier' } },
  { path: 'supplierAssets/:supplierId', component: SupplierassetsComponent, data: { breadcrumb: 'Asset.SupplierAssets' } }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuppliersRoutingModule { }
