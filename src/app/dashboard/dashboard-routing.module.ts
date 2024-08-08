import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ChartdashboardComponent } from './chartdashboard/chartdashboard.component';
import { DashPageComponent } from './dash-page/dash-page.component';

const routes: Routes = [
  {
    path: '', component: DashPageComponent, data: { breadcrumb: 'Asset.Home' }, children: [

      { path: 'dashboard', component: ChartdashboardComponent, data: { breadcrumb: 'Asset.DashBoard' } },
      { path: 'rolecategories', loadChildren: () => import('src/app/Features/role-categories/role-categories.module').then(m => m.RoleCategoriesModule) },
      { path: 'roles', loadChildren: () => import('src/app/Features/roles/roles.module').then(m => m.RolesModule) },
      { path: 'organizations', loadChildren: () => import('src/app/Features/organizations/organizations.module').then(m => m.OrganizationsModule) },
      { path: 'governorates', loadChildren: () => import('src/app/Features/governorates/governorates.module').then(m => m.GovernoratesModule) },
      { path: 'hospitals', loadChildren: () => import('src/app/Features/hospitals/hospitals.module').then(m => m.HospitalsModule) },
      { path: 'users', loadChildren: () => import('src/app/Features/users/users.module').then(m => m.UsersModule) },
      { path: 'assets', loadChildren: () => import('src/app/Features/master-assets/master-assets.module').then(m => m.MasterAssetsModule) },
      { path: 'hospitalassets', loadChildren: () => import('src/app/Features/hospital-assets/hospital-assets.module').then(m => m.HospitalAssetsModule) },
      { path: 'hospitalcontract', loadChildren: () => import('src/app/Features/contracts/contracts.module').then(m => m.ContractsModule) },
      { path: 'servicerequests/:assetdetailId', loadChildren: () => import('src/app/Features/requests/requests.module').then(m => m.RequetsModule) },
      { path: 'servicerequests', loadChildren: () => import('src/app/Features/requests/requests.module').then(m => m.RequetsModule) },
      { path: 'buildings', loadChildren: () => import('src/app/Features/hospital-buildings/hospital-buildings.module').then(m => m.HospitalBuildingsModule) },
      { path: 'employees', loadChildren: () => import('src/app/Features/employees/employees.module').then(m => m.EmployeesModule) },
      { path: 'workorders', loadChildren: () => import('src/app/Features/work-orders/work-orders.module').then(m => m.WorkOrdersModule) },
      { path: 'brands', loadChildren: () => import('src/app/Features/brands/brands.module').then(m => m.BrandsModule) },
      { path: 'AssetStatus', loadChildren: () => import('src/app/Features/assets-status/assets-status.module').then(m => m.AssetsStatusModule) },
      { path: 'origins', loadChildren: () => import('src/app/Features/origins/origins.module').then(m => m.OriginsModule) },
      { path: 'requestTypes', loadChildren: () => import('src/app/Features/request-types/request-types.module').then(m => m.RequestTypesModule) },
      { path: 'Problems', loadChildren: () => import('src/app/Features/problems/problems.module').then(m => m.ProblemsModule) },
      { path: 'categories', loadChildren: () => import('src/app/Features/categories/categories.module').then(m => m.CategoriesModule) },
      { path: 'Subcategories', loadChildren: () => import('src/app/Features/sub-categories/sub-categories.module').then(m => m.SubCategoriesModule) },
      { path: 'Classifications', loadChildren: () => import('src/app/Features/classifications/classifications.module').then(m => m.ClassificationsModule) },
      { path: 'ecris', loadChildren: () => import('src/app/Features/ecris/ecris.module').then(m => m.ECRISModule) },
      { path: 'requestTypes', loadChildren: () => import('src/app/Features/request-types/request-types.module').then(m => m.RequestTypesModule) },
      { path: 'requestStatus', loadChildren: () => import('src/app/Features/request-status/request-status.module').then(m => m.RequestStatusModule) },
      { path: 'workOrderStatus', loadChildren: () => import('src/app/Features/work-order-status/work-order-status.module').then(m => m.WorkOrderStatusModule) },
      { path: 'workOrderTypes', loadChildren: () => import('src/app/Features/work-order-types/work-order-types.module').then(m => m.WorkOrderTypesModule) },
      { path: 'departments', loadChildren: () => import('src/app/Features/departments/departments.module').then(m => m.DepartmentsModule) },
      { path: 'suppliers', loadChildren: () => import('src/app/Features/suppliers/suppliers.module').then(m => m.SuppliersModule) },
      { path: 'subProblems', loadChildren: () => import('src/app/Features/sub-problem/sub-problem.module').then(m => m.SubProblemModule) },
      { path: 'supplierexecludes', loadChildren: () => import('src/app/Features/supplier-execludes/supplier-execludes.module').then(m => m.SupplierExecludesModule) },
      { path: 'hospitalexecludes', loadChildren: () => import('src/app/Features/hospital-execludes/hospital-execludes-routing.module').then(m => m.HospitalExecludesRoutingModule) },
      { path: 'memberexecludes', loadChildren: () => import('src/app/Features/member-excludes/member-excludes-routing.module').then(m => m.MemberExcludesRoutingModule) },
      { path: 'reports', loadChildren: () => import('src/app/Features/reports/reports.module').then(m => m.ReportsModule) },
      { path: 'visits', loadChildren: () => import('src/app/Features/visits/visits.module').then(m => m.VisitsModule) },
      { path: 'engineers', loadChildren: () => import('src/app/Features/engineers/engineers.module').then(m => m.EngineersModule) },
      { path: 'wnpm', loadChildren: () => import('src/app/Features/wnpm/wnpm.module').then(m => m.WnpmModule) },
      { path: 'scrap', loadChildren: () => import('src/app/Features/scrap/scrap.module').then(m => m.ScrapModule) },
      { path: 'externalfix', loadChildren: () => import('src/app/Features/external-fix/external-fix.module').then(m => m.ExternalFixModule) },
      { path: 'stockTakingSchedule', loadChildren: () => import('src/app/Features/stock-taking-schedule/stock-taking-schedule.module').then(m => m.StockTakingScheduleModule) },
      { path: 'assetStockTaking', loadChildren: () => import('src/app/Features/asset-stocktaking/asset-stocktaking.module').then(m => m.AssetStocktakingModule) },
      { path: 'manfacturerPMAssets', loadChildren: () => import('src/app/Features/manfacturerpmassets/manfacturerpmassets.module').then(m => m.ManfacturerpmassetsModule) },
      { path: 'assetmovement', loadChildren: () => import('src/app/Features/assetmovement/assetmovement.module').then(m => m.AssetmovementModule) },
      { path: 'externalassetmovement', loadChildren: () => import('src/app/Features/externalassetmovement/externalassetmovement.module').then(m => m.ExternalassetmovementModule) },

      //   { path: 'genericReport', loadChildren: () => import('src/app/Features/generic-report/generic-report.module').then(m => m.GenericReportModule) }
    ]
  },
  {
    path: 'genericReport', loadChildren: () => import('src/app/Features/generic-report/generic-report.module').then(m => m.GenericReportModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }
