import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateComponent } from './create/create.component';
import { EditComponent } from './edit/edit.component';
import { ListComponent } from './list/list.component';
import { ViewComponent } from './view/view.component';

const routes: Routes = [
  { path: '', component: ListComponent, data: { breadcrumb: 'Asset.Visits' } },
  { path: 'Addvisit', component: CreateComponent, data: { breadcrumb: 'Asset.Create' } },
  { path: 'editvisit/:id', component: EditComponent, data: { breadcrumb: 'Asset.Edit' } },
  { path: 'viewvisit/:id', component: ViewComponent, data: { breadcrumb: 'Asset.ViewVisit' } }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisitsRoutingModule { }
