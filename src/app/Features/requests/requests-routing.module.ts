import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/Shared/Services/guards/authGuard.guard';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';


const routes: Routes = [
  {
    path: '', component: ListComponent, data: { breadcrumb: 'Asset.Requests', canActivate: [AuthGuard] }
    , children: [
      { path: 'srworkorders', loadChildren: () => import('src/app/Features/work-orders/work-orders.module').then(m => m.WorkOrdersModule), canActivate: [AuthGuard] },
    ]
  },

  { path: 'addRequest/:assetId', component: CreateComponent, data: { breadcrumb: 'Asset.DashBoard' }, canActivate: [AuthGuard] },
  { path: 'approveRequest/:id', component: CreateComponent, data: { breadcrumb: 'Asset.Approve' }, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RequetsRoutingModule { }
