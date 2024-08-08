import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe, HashLocationStrategy, LocationStrategy } from '@angular/common';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule, MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ChartModule } from 'primeng/chart';

import { AvatarModule } from 'primeng/avatar';
import { TableModule } from 'primeng/table';
import { ListboxModule } from 'primeng/listbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { PickListModule } from 'primeng/picklist';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LayoutRoutingModule } from './layout/layout-routing.module';
import { LayoutModule } from './layout/layout.module';
import { AuthenticateRoutingModule } from './authenticate/authenticate-routing.module';
import { AuthenticateModule } from './authenticate/authenticate.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { DashboardRoutingModule } from './dashboard/dashboard-routing.module';
import { RoleCategoriesModule } from './Features/role-categories/role-categories.module';
import { RoleCategoriesRoutingModule } from './Features/role-categories/role-categories-routing.module';
import { OrganizationsModule } from './Features/organizations/organizations.module';
import { OrganizationsRoutingModule } from './Features/organizations/organizations-routing.module';
import { SubOrganizationsModule } from './Features/sub-organizations/sub-organizations.module';
import { SubOrganizationsRoutingModule } from './Features/sub-organizations/sub-organizations-routing.module';
import { GovernoratesModule } from './Features/governorates/governorates.module';
import { GovernoratesRoutingModule } from './Features/governorates/governorates-routing.module';
import { CitiesModule } from './Features/cities/cities.module';
import { CitiesRoutingModule } from './Features/cities/cities-routing.module';
import { HospitalsModule } from './Features/hospitals/hospitals.module';
import { HospitalsRoutingModule } from './Features/hospitals/hospitals-routing.module';
import { UsersModule } from './Features/users/users.module';
import { UsersRoutingModule } from './Features/users/users-routing.module';
import { MasterAssetsModule } from './Features/master-assets/master-assets.module';
import { MasterAssetsRoutingModule } from './Features/master-assets/master-assets-routing.module';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { ConfirmationService } from 'primeng/api';
import { HospitalAssetsModule } from './Features/hospital-assets/hospital-assets.module';
import { HospitalAssetsRoutingModule } from './Features/hospital-assets/hospital-assets-routing.module';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ContractsModule } from './Features/contracts/contracts.module';
import { ContractsRoutingModule } from './Features/contracts/contracts-routing.module';
import { RequetsRoutingModule } from './Features/requests/requests-routing.module';
import { RequetsModule } from './Features/requests/requests.module';
import { CreateFloorComponent } from './Features/hospital-floors/create-floor/create-floor.component';
import { EditFloorComponent } from './Features/hospital-floors/edit-floor/edit-floor.component';
import { EditRoomComponent } from './Features/hospital-rooms/edit-room/edit-room.component';
import { CreateRoomComponent } from './Features/hospital-rooms/create-room/create-room.component';
import { HospitalBuildingsModule } from './Features/hospital-buildings/hospital-buildings.module';
import { HospitalBuildingsRoutingModule } from './Features/hospital-buildings/hospital-buildings-routing.module';
import { HospitalFloorsModule } from './Features/hospital-floors/hospital-floors.module';
import { HospitalRoomsModule } from './Features/hospital-rooms/hospital-rooms.module';
import { HospitalRoomsRoutingModule } from './Features/hospital-rooms/hospital-rooms-routing.module';
import { EmployeesModule } from './Features/employees/employees.module';
import { EmployeesRoutingModule } from './Features/employees/employees-routing.module';


import { FullCalendarModule } from '@fullcalendar/angular';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

import { AgmCoreModule } from '@agm/core';
import { WorkOrdersRoutingModule } from './Features/work-orders/work-orders-routing.module';
import { WorkOrdersModule } from './Features/work-orders/work-orders.module';
import { BrandsModule } from './Features/brands/brands.module';
import { BrandsRoutingModule } from './Features/brands/brands-routing.module';
import { AssetsStatusRoutingModule } from './Features/assets-status/assets-status-routing.module';
import { AssetsStatusModule } from './Features/assets-status/assets-status.module';
import { CategoriesRoutingModule } from './Features/categories/categories-routing.module';
import { OriginsModule } from './Features/origins/origins.module';
import { OriginsRoutingModule } from './Features/origins/origins-routing.module';
import { RequestTypesModule } from './Features/request-types/request-types.module';
import { RequestTypesRoutingModule } from './Features/request-types/request-types-routing.module';
import { ProblemsModule } from './Features/problems/problems.module';
import { ProblemsRoutingModule } from './Features/problems/problems-routing.module';
import { SuppliersModule } from './Features/suppliers/suppliers.module';
import { SuppliersRoutingModule } from './Features/suppliers/suppliers-routing.module';
import { DepartmentsModule } from './Features/departments/departments.module';
import { DepartmentsRoutingModule } from './Features/departments/departments-routing.module';
import { RequestStatusModule } from './Features/request-status/request-status.module';
import { RequestStatusRoutingModule } from './Features/request-status/request-status-routing.module';
import { WorkOrderStatusModule } from './Features/work-order-status/work-order-status.module';
import { WorkOrderStatusRoutingModule } from './Features/work-order-status/work-order-status-routing.module';
import { WorkOrderTypesModule } from './Features/work-order-types/work-order-types.module';
import { WorkOrderTypesRoutingModule } from './Features/work-order-types/work-order-types-routing.module';
import { ClassificationsModule } from './Features/classifications/classifications.module';
import { ClassificationsRoutingModule } from './Features/classifications/classifications-routing.module';
import { ECRISModule } from './Features/ecris/ecris.module';
import { ECRISRoutingModule } from './Features/ecris/ecris-routing.module';
import { SubCategoriesModule } from './Features/sub-categories/sub-categories.module';
import { SubCategoriesRoutingModule } from './Features/sub-categories/sub-categories-routing.module';
import { CategoriesModule } from './Features/categories/categories.module';
import { SubProblemModule } from './Features/sub-problem/sub-problem.module';
import { SubProblemRoutingModule } from './Features/sub-problem/sub-problem-routing.module';
import { SupplierExecludesModule } from './Features/supplier-execludes/supplier-execludes.module';
import { SupplierExecludesRoutingModule } from './Features/supplier-execludes/supplier-execludes-routing.module';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { ReportsModule } from './Features/reports/reports.module';
import { ReportsRoutingModule } from './Features/reports/reports-routing.module';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BadgeModule } from 'primeng/badge';
import { MatBadgeModule } from '@angular/material/badge';
import { CarouselModule } from 'primeng/carousel';
import { FieldsetModule } from "primeng/fieldset";


import { PowerBIEmbedModule } from 'powerbi-client-angular';
import { NgxBarcodeModule } from 'ngx-barcode';
import { HospitalExecludesModule } from './Features/hospital-execludes/hospital-execludes.module';
import { HospitalExecludesRoutingModule } from './Features/hospital-execludes/hospital-execludes-routing.module';
import { MemberExcludesModule } from './Features/member-excludes/member-excludes.module';
import { MemberExcludesRoutingModule } from './Features/member-excludes/member-excludes-routing.module';
import { DropdownModule } from 'primeng/dropdown';

import { FileUploadModule } from 'primeng/fileupload';
import { A11yModule } from '@angular/cdk/a11y';
import { CookieService } from 'ngx-cookie-service';
import { AuthGuard } from './Shared/Services/guards/authGuard.guard';
import { EngineersRoutingModule } from './Features/engineers/engineers-routing.module';
import { EngineersModule } from './Features/engineers/engineers.module';
import { VisitsRoutingModule } from './Features/visits/visits-routing.module';
import { VisitsModule } from './Features/visits/visits.module';
import { WnpmModule } from './Features/wnpm/wnpm.module';
import { WnpmRoutingModule } from './Features/wnpm/wnpm-routing.module';

import { ExternalFixModule } from './Features/external-fix/external-fix.module'
import { ExternalFixRoutingMoule } from './Features/external-fix/external-fix-routing.module';

import { StockTakingScheduleModule } from './Features/stock-taking-schedule/stock-taking-schedule.module';
import { StockTakingScheduleRoutingModule } from './Features/stock-taking-schedule/stock-taking-schedule-routing.module';
import { AssetStocktakingModule } from './Features/asset-stocktaking/asset-stocktaking.module';
import { AssetStocktakingRoutingModule } from './Features/asset-stocktaking/asset-stocktaking-routing.module';
import { ManfacturerpmassetsRoutingModule } from './Features/manfacturerpmassets/manfacturerpmassets-routing.module';
import { ManfacturerpmassetsModule } from './Features/manfacturerpmassets/manfacturerpmassets.module';
import { AssetmovementModule } from './Features/assetmovement/assetmovement.module';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { DeleteModule } from './Shared/delete/delete.module';
import { ViewComponent } from './Features/errors/view/view.component';
import { AuthenticationService } from './Shared/Services/guards/authentication.service';

FullCalendarModule.registerPlugins([
  interactionPlugin,
  dayGridPlugin,
  timeGridPlugin, listPlugin
]);
@NgModule({
  declarations: [AppComponent, CreateFloorComponent,
    EditFloorComponent, EditRoomComponent, CreateRoomComponent, ViewComponent
  ],
  imports: [
    DeleteModule,
    BrowserModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatSidenavModule,
    TooltipModule,
    MatToolbarModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatListModule,
    MatSnackBarModule,
    MatDialogModule,
    MatRadioModule,
    MatInputModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMatFileInputModule,
    AvatarModule,
    PickListModule,
    MultiSelectModule,
    DynamicDialogModule,
    MatFormFieldModule,
    DialogModule,
    ListboxModule,
    MatTabsModule,
    MatSelectModule,
    MatExpansionModule,
    MatCheckboxModule,
    TableModule,
    NgbModule,
    ChartModule,
    FullCalendarModule,
    NgxQRCodeModule,
    AutoCompleteModule,
    BadgeModule,
    MatBadgeModule,
    CarouselModule,
    MatButtonModule,
    FieldsetModule,
    NgxBarcodeModule,
    PowerBIEmbedModule,
    DropdownModule,
    MatSelectModule,
    FileUploadModule,
    A11yModule,
    NgxUiLoaderModule,
    MatProgressSpinnerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }, isolate: false // isolate property is the key point to remember/
    }),
    AgmCoreModule.forRoot({
      libraries: ["places", "geometry"],
      apiKey: 'AIzaSyCxvNEG1CRZ0pzoriAujg07y101MbOkFrQ'
    }),


    AuthenticateModule,
    AuthenticateRoutingModule,

    LayoutModule,
    LayoutRoutingModule,

    AuthenticateModule,
    AuthenticateRoutingModule,

    DashboardModule,
    DashboardRoutingModule,

    RoleCategoriesModule,
    RoleCategoriesRoutingModule,

    OrganizationsModule,
    OrganizationsRoutingModule,

    SubOrganizationsModule,
    SubOrganizationsRoutingModule,

    GovernoratesModule,
    GovernoratesRoutingModule,

    CitiesModule,
    CitiesRoutingModule,

    HospitalsModule,
    HospitalsRoutingModule,

    UsersModule,
    UsersRoutingModule,

    MasterAssetsModule,
    MasterAssetsRoutingModule,

    HospitalAssetsModule,
    HospitalAssetsRoutingModule,

    ContractsModule,
    ContractsRoutingModule,


    RequetsModule,
    RequetsRoutingModule,


    WorkOrdersModule,
    WorkOrdersRoutingModule,

    HospitalBuildingsModule,
    HospitalBuildingsRoutingModule,

    HospitalFloorsModule,
    HospitalAssetsRoutingModule,

    HospitalRoomsModule,
    HospitalRoomsRoutingModule,

    EmployeesModule,
    EmployeesRoutingModule,

    BrandsModule,
    BrandsRoutingModule,

    AssetsStatusRoutingModule,
    AssetsStatusModule,

    OriginsRoutingModule,
    OriginsModule,

    RequestTypesModule,
    RequestTypesRoutingModule,

    ProblemsModule,
    ProblemsRoutingModule,


    SuppliersModule,
    SuppliersRoutingModule,

    DepartmentsModule,
    DepartmentsRoutingModule,

    RequestStatusModule,
    RequestStatusRoutingModule,

    WorkOrderStatusModule,
    WorkOrderStatusRoutingModule,

    WorkOrderTypesModule,
    WorkOrderTypesRoutingModule,

    ClassificationsModule,
    ClassificationsRoutingModule,

    ECRISModule,
    ECRISRoutingModule,

    SubCategoriesModule,
    SubCategoriesRoutingModule,

    CategoriesModule,
    CategoriesRoutingModule,

    SubProblemModule,
    SubProblemRoutingModule,

    SupplierExecludesModule,
    SupplierExecludesRoutingModule,

    ReportsModule,
    ReportsRoutingModule,

    HospitalExecludesModule,
    HospitalExecludesRoutingModule,

    MemberExcludesModule,
    MemberExcludesRoutingModule,

    VisitsModule,
    VisitsRoutingModule,

    EngineersModule,
    EngineersRoutingModule,

    WnpmModule,
    WnpmRoutingModule,



    ExternalFixModule,
    ExternalFixRoutingMoule,
    StockTakingScheduleModule,
    StockTakingScheduleRoutingModule,

    AssetStocktakingModule,
    AssetStocktakingRoutingModule,

    ManfacturerpmassetsModule,
    ManfacturerpmassetsRoutingModule,

    AssetmovementModule,
    AssetsStatusRoutingModule,


  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },
  { provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: { hasBackdrop: false } },
    DialogService, ConfirmationService, DatePipe, CookieService, AuthGuard
  ],
  bootstrap: [AppComponent],
})
export class AppModule {

  _token: string;
  _email: string;

  constructor(private cookieService: CookieService, private route: Router, private activatedRoute: ActivatedRoute, private authenticationService: AuthenticationService) {

    // this.authenticationService.validateMBSerial().subscribe(validMBSerial => {
    // },
    //   error => {
    //     this.route.navigate(['/errors']);
    //   });

    // this.authenticationService.validateMacAddress().subscribe(validMac => {
    // },
    //   error => {
    //     this.route.navigate(['/errors']);
    //   });


    const cookieExists: boolean = this.cookieService.check('usercookie');
    if (cookieExists) {
      this.route.navigate(['/dashboard']);
    }
    const user = localStorage.getItem("currentUser");
    if (user && (this.activatedRoute.queryParams == undefined || this.activatedRoute.queryParams == null)) {
      (['/dashboard']);
    }
    else if ((this.activatedRoute.queryParams != undefined || this.activatedRoute.queryParams != null)) {
      this.activatedRoute.queryParams.subscribe(params => {
        if (params['email'] != undefined && params['token'] != undefined) {
          this.route.navigate(['/reset', { token: params['token'], email: params['email'] }]);
        }
      });
    }
    if (!cookieExists && !user) {
      this.route.navigate(['']);
    }
  }
}



export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}