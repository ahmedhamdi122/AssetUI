import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReportsRoutingModule } from './reports-routing.module';
import { AssetReportComponent } from './asset-report/asset-report.component';
import { HospitalreportComponent } from './hospitalreport/hospitalreport.component';
import { ChartModule } from 'primeng/chart';
import { TableModule } from 'primeng/table';
import { MatIconModule } from '@angular/material/icon';
import { CardModule } from 'primeng/card';
import { PanelModule } from 'primeng/panel';
import { TranslateModule } from '@ngx-translate/core';
import { HospitalcountpriceComponent } from './hospitalcountprice/hospitalcountprice.component';
import { ButtonModule } from 'primeng/button';
import { AssetagegroupsComponent } from './assetagegroups/assetagegroups.component';
import { FilterassetagegroupsComponent } from './filterassetagegroups/filterassetagegroups.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { DialogModule } from 'primeng/dialog';
import { HospitalassetsQRComponent } from './hospitalassets-qr/hospitalassets-qr.component';
import { NgxQRCodeModule } from '@techiediaries/ngx-qrcode';
import { CheckboxModule } from 'primeng/checkbox';
import { MultiSelectModule } from 'primeng/multiselect';
import { BIReport1Component } from './bireport1/bireport1.component';
import { CalendarModule } from 'primeng/calendar';
import { PowerBIEmbedModule } from 'powerbi-client-angular';
import { HttpClientModule } from '@angular/common/http';
import { SrwithindateComponent } from './srwithindate/srwithindate.component';
import { NgxBarcodeModule } from 'ngx-barcode';
import { WowithindateComponent } from './wowithindate/wowithindate.component';
import { HospitalappComponent } from './hospitalapp/hospitalapp.component';
import { SupplierappComponent } from './supplierapp/supplierapp.component';
import { InputTextModule } from 'primeng/inputtext';
import { SrwotimelineComponent } from './srwotimeline/srwotimeline.component';
import { AssetdepartmentComponent } from './assetdepartment/assetdepartment.component';
import { AssethistoryComponent } from './assethistory/assethistory.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { DepartmentbrandsupplierComponent } from './departmentbrandsupplier/departmentbrandsupplier.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLineModule } from '@angular/material/core';
import { FindSupplierComponent } from './find-supplier/find-supplier.component';
import { OpenRequestsComponent } from './open-requests/open-requests.component';
import { SrInProgressComponent } from './sr-in-progress/sr-in-progress.component';
import { AssetqrComponent } from './assetqr/assetqr.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { GeosearchComponent } from './geosearch/geosearch.component';
import { CarouselModule } from 'primeng/carousel';
import { PmassetsComponent } from './pmassets/pmassets.component';
@NgModule({
  declarations: [
    AssetReportComponent,
    HospitalreportComponent,
    HospitalcountpriceComponent,
    AssetagegroupsComponent,
    FilterassetagegroupsComponent,
    HospitalassetsQRComponent,
    BIReport1Component,
    SrwithindateComponent,
    WowithindateComponent,
    HospitalappComponent,
    SupplierappComponent,
    SrwotimelineComponent,
    AssetdepartmentComponent,
    AssethistoryComponent,
    DepartmentbrandsupplierComponent,
    FindSupplierComponent,
    OpenRequestsComponent,
    SrInProgressComponent,
    AssetqrComponent,
    GeosearchComponent,
    PmassetsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    //  BrowserModule,
    ReactiveFormsModule,
    ReportsRoutingModule,
    ChartModule,
    TableModule,
    MatIconModule,
    CardModule,
    PanelModule,
    ButtonModule,
    TooltipModule,
    DialogModule,
    NgxQRCodeModule,
    CheckboxModule,
    MultiSelectModule,
    TranslateModule,
    PowerBIEmbedModule,
    HttpClientModule,
    CalendarModule,
    TableModule,
    NgxBarcodeModule,
    DialogModule,
    InputTextModule,
    AutoCompleteModule,
    MatButtonModule,
    MatExpansionModule,
    MatListModule,
    MatBadgeModule,
    MatSidenavModule,
    MatLineModule,
    MatCheckboxModule,
    CarouselModule
  ]
})
export class ReportsModule { }
