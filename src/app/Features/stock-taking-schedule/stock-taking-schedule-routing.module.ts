import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EditComponent } from '../hospitals/edit/edit.component';
import { ViewComponent } from '../hospitals/view/view.component';
import { CreateComponent } from './create/create.component';

import { ListComponent } from './list/list.component';

const routes: Routes = [
  { path: '', component: ListComponent, data: { breadcrumb: 'Asset.StockTakingSchedule' } },
  { path: 'addStockTakingSchedule', component: CreateComponent, data: { breadcrumb: 'Asset.AddStockTakingSchedule' } },
  // { path: 'editexternalfix/:id', component: EditComponent, data: { breadcrumb: 'Asset.EditBrand' } },
  // { path: 'viewexternalfix/:id', component: ViewComponent, data: { breadcrumb: 'Asset.ViewBrand' } },
];;

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockTakingScheduleRoutingModule { }
