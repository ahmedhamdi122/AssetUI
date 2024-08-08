import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  { path: '', component: ListComponent, data: { breadcrumb: 'Asset.RoleCategories' } },
  { path: 'addrolecategory', component: CreateComponent, data: { breadcrumb: 'Asset.AddRoleCategory' } },
  { path: 'editrolecategory/:id', component: EditComponent, data: { breadcrumb: 'Asset.EditRoleCategory' } },
  { path: 'viewrolecategory/:id', component: ViewComponent, data: { breadcrumb: 'Asset.ViewRoleCategory' } }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RoleCategoriesRoutingModule { }
