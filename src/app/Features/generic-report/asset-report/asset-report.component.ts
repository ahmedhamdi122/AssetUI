import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { filterDto, ViewAssetForReportVM } from 'src/app/Shared/Models/assetDetailVM';
import { BrandGroupVM, ListBrandVM } from 'src/app/Shared/Models/brandVM';
import { GroupcityVM, ListCityVM } from 'src/app/Shared/Models/cityVM';
import { GroupGovernorateVM, ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { BrandService } from 'src/app/Shared/Services/brand.service';
import { CityService } from 'src/app/Shared/Services/city.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';

import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { HospitalGroupVM, ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { SupplierService } from 'src/app/Shared/Services/supplierService.service';
import { GroupSupplierVM, ListSupplierVM } from 'src/app/Shared/Models/supplierVM';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { ListMasterAssetVM } from 'src/app/Shared/Models/masterAssetVM';
import { GroupOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { Location } from '@angular/common'
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { MatSidenav } from '@angular/material/sidenav';

import { fontAmiri } from 'src/assets/fonts/Amiri-Regular';

import * as jspdf from 'jspdf';
import 'jspdf-autotable';


@Component({
  selector: 'app-asset-report',
  templateUrl: './asset-report.component.html',
  styleUrls: ['./asset-report.component.css'],
  encapsulation: ViewEncapsulation.None
})

//compile star
export class AssetReportComponent implements OnInit {
  @ViewChild('sidenav') public sidenav: MatSidenav;

  lang = localStorage.getItem("lang");
  textDir: string = '';
  currentUser: LoggedUser;
  lstAssets: ViewAssetForReportVM[] = [];
  lstMasterAssets: ListMasterAssetVM[] = [];
  newLstAssets: ViewAssetForReportVM[] = [];
  filteredObj: filterDto;
  brndList: ListBrandVM[];
  govList: ListGovernorateVM[];
  cityList: ListCityVM[];
  hosList: ListHospitalVM[];
  newRows: string[];
  temp: string[];
  href: any;
  AssetElements: any[];
  AssetElementsAr: any;
  supList: ListSupplierVM[];
  selectedElement: string;
  lstBrandAsset: BrandGroupVM[];
  lstHospitalAsset: HospitalGroupVM[];
  lstGovernorateAsset: GroupGovernorateVM[];
  lstCityAsset: GroupcityVM[];
  lstSupplierAsset: GroupSupplierVM[];
  lstOrganizationAsset: GroupOrganizationVM[];
  direction: string = 'ltr';
  selectedLang: string;
  selectedAsset: number;
  userName = "";
  assetName: string = "";
  isDisplayed: boolean = false;

  constructor(private assetDetailService: AssetDetailService, public translate: TranslateService,
    private authenticationService: AuthenticationService, private brandService: BrandService,
    private governorateService: GovernorateService, private cityService: CityService,
    private datepipe: DatePipe, private router: Router, private hospitalService: HospitalService,
    private supplierService: SupplierService, private masterService: MasterAssetService,
    private masterAssetService: MasterAssetService,
    private location: Location, private route: Router) {
    // translate.use(this.lang);
    if (this.lang == "en") {
      this.direction = 'ltr';
    }
    if (this.lang == "ar") {
      this.direction = 'rtl';
    }
    this.currentUser = this.authenticationService.currentUserValue;
    if (this.currentUser == null || this.currentUser == undefined) {
      this.lang = "en";
      this.route.navigate(['/']);
    }
    else {
      this.userName = this.currentUser["userName"];
    }
  }
  ngOnInit(): void {
    this.filteredObj = {
      assetPeriorityName: '', categoryName: '',
      id: 0, name: '', brandName: '', cityName: '', hosName: '', govName: '', supplierName: '', purchaseDate: null
    }

    this.AssetElements = ["Brand", "Governorate", "City", "Hospital", "Organization", "Supplier"];
    this.AssetElementsAr = ["الصانع", "المحافظه", "المدينه", "الوحده الصحيه", "المنظمه", "المورد"];


    this.masterService.GetMasterAssets().subscribe(items => {
      this.lstMasterAssets = items;
    });

    if (this.filteredObj.name != "" || this.filteredObj.supplierName != "" || this.filteredObj.hosName != "" ||
      this.filteredObj.govName != "" || this.filteredObj.cityName != "" || this.filteredObj.brandName != "" || this.filteredObj.purchaseDate != null) {
      this.assetDetailService.FilterData(this.filteredObj).subscribe(data => {
        this.lstAssets = data;
        if (this.selectedElement != null) {
          this.selectElement(this.selectedElement);
        }
        this.newLstAssets = this.lstAssets;
      });
    }
    else {
      this.assetDetailService.GetAssetsyUserId(this.currentUser.id).subscribe(items => {
        this.lstAssets = items;
      });
    }
    this.brandService.GetBrands().subscribe(brands => {
      this.brndList = brands
    });

    this.governorateService.GetGovernorates().subscribe(govs => {
      this.govList = govs;
    })

    this.supplierService.GetSuppliers().subscribe(sup => {
      this.supList = sup;
    })
    document.getElementById('clcbtn').style.display = "none";
    // document.getElementById("clcgroupingbtn").style.display = "none";
  }

  selectLanguage(lang: string) {
    this.textDir = '';
    if (lang == 'en') {
      this.textDir = 'ltr';
    } if (lang == 'ar') {
      this.textDir = 'rtl';
    }
    localStorage.setItem('lang', lang);
    localStorage.setItem('dir', this.textDir);
    //  this.translate.use(lang);
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }
  logout() {
    this.authenticationService.logout();
  }

  exportPdf1() {
    var row = [];
    var rows = [];
    let col = [];
    var y = 0;
    let pdf = new jspdf('l');
    var img = new Image();
    img.src = './../assets/images/logo.png';
    if (this.lang == "en") {
      pdf.addImage(img, 'png', 10, 10, 23, 23)
      pdf.text("Assets", 50, 25, { "align": "left" });
      col = ["Name", "Brand", "Governorate", "City", "Hospital", "Supplier", "Purchase Date", "Organization"];
      switch (this.selectedElement) {
        case "Brand":
          this.lstBrandAsset.forEach(elem => {
            elem.assetList.forEach(brandObj => {
              row = [brandObj.assetName, brandObj.brandName, brandObj.governorateName, brandObj.cityName, brandObj.hospitalName, brandObj.supplierName,
              this.datepipe.transform(brandObj.purchaseDate, 'yyyy-MM-dd'), brandObj.orgName];
              rows.push(row);
            });
            (pdf as any).autoTable({
              head: [[{ content: `Brand : ${elem.name}`, colSpan: 8, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] } }],
              ["Name", "Brand", "Governorate", "City", "Hospital", "Supplier", "Purchase Date", "Organization"]],
              startY: y += 50,
              body: rows
            });
            rows = [];
          });
          break;
        case "Hospital":
          this.lstHospitalAsset.forEach(elem => {
            elem.assetList.forEach(hospitalObj => {
              row = [hospitalObj.assetName, hospitalObj.brandName, hospitalObj.governorateName, hospitalObj.cityName,
              hospitalObj.hospitalName, hospitalObj.supplierName,
              this.datepipe.transform(hospitalObj.purchaseDate, 'yyyy-MM-dd'), hospitalObj.orgName];
              rows.push(row);
            });
            (pdf as any).autoTable({
              head: [[{ content: `Hospital : ${elem.name}`, colSpan: 8, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] } }],
              ["Name", "Brand", "Governorate", "City", "Hospital", "Supplier", "Purchase Date", "Organization"]],
              startY: y += 80,
              body: rows
            });
            rows = [];
          });
          break;
        case "Governorate":
          this.lstGovernorateAsset.forEach(elem => {
            elem.assetList.forEach(govObj => {
              row = [govObj.assetName, govObj.brandName, govObj.cityName, govObj.hospitalName, govObj.supplierName,
              this.datepipe.transform(govObj.purchaseDate, 'yyyy-MM-dd'), govObj.orgName];
              rows.push(row);
            });
            (pdf as any).autoTable({
              head: [[{ content: `Governorate : ${elem.name}`, colSpan: 7, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] } }],
              ["Name", "Brand", "City", "Hospital", "Supplier", "Purchase Date", "Organization"]],
              startY: y += 50,
              body: rows
            });
            rows = [];
          });
          break;
        case "City":
          this.lstCityAsset.forEach(elem => {
            elem.assetList.forEach(cityObj => {
              row = [cityObj.assetName, cityObj.brandName, cityObj.governorateName, cityObj.hospitalName, cityObj.supplierName,
              this.datepipe.transform(cityObj.purchaseDate, 'yyyy-MM-dd'), cityObj.orgName];
              rows.push(row);
            });
            (pdf as any).autoTable({
              head: [[{ content: `City : ${elem.name}`, colSpan: 7, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }, font: 'ARIALUNI', }],
              ["Name", "Brand", "Governorate", "Hospital", "Supplier", "Purchase Date", "Organization"]],
              startY: y += 65,
              body: rows
            });
            rows = [];
          });
          break;
        case "Organization":
          this.lstOrganizationAsset.forEach(elem => {
            elem.assetList.forEach(orgObj => {
              row = [orgObj.assetName, orgObj.brandName, orgObj.governorateName, orgObj.hospitalName, orgObj.supplierName,
              this.datepipe.transform(orgObj.purchaseDate, 'yyyy-MM-dd'), orgObj.orgName];
              rows.push(row);
            });
            (pdf as any).autoTable({
              head: [[{ content: `Organization : ${elem.name}`, colSpan: 7, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }, font: 'ARIALUNI', }],
              ["Name", "Brand", "Governorate", "Hospital", "Supplier", "Purchase Date", "Organization"]],
              startY: y += 75,
              body: rows
            });
            rows = [];
          });
          break;
        case "Supplier":
          this.lstSupplierAsset.forEach(elem => {
            elem.assetList.forEach(supplyObj => {
              row = [supplyObj.assetName, supplyObj.brandName, supplyObj.governorateName, supplyObj.hospitalName, supplyObj.supplierName,
              this.datepipe.transform(supplyObj.purchaseDate, 'yyyy-MM-dd'), supplyObj.orgName];
              rows.push(row);
            });
            (pdf as any).autoTable({
              head: [[{ content: `Organization : ${elem.name}`, colSpan: 7, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0] }, font: 'ARIALUNI', }],
              ["Name", "Brand", "Governorate", "Hospital", "Supplier", "Purchase Date", "Organization"]],
              startY: y += 50,
              body: rows
            });
            rows = [];
          });
          break;
        default:
          col = ["Name", "Brand", "Governorate", "City", "Hospital", "Supplier", "Purchase Date", "Organization"];
          this.lstAssets.forEach((element) => {
            row = [element.assetName, element.brandName, element.governorateName, element.cityName, element.hospitalName, element.supplierName,
            this.datepipe.transform(element.purchaseDate, 'yyyy-MM-dd'), element.orgName];
            rows.push(row)
          });
          (pdf as any).autoTable(col, rows, { startY: 50 });
          break;
      }
      var exportdate = this.datepipe.transform(new Date, "dd-MM-yyyy_HH:mm:ss");
      pdf.save('AssetGeneralReport_' + exportdate + '.pdf');
    }
    else if (this.lang == "ar") {

      pdf.addFileToVFS('Amiri-Regular', fontAmiri);
      pdf.addFont('Amiri-Regular', 'Amiri-Regular', 'normal');
      pdf.setFont('Amiri-Regular');
      const options: Intl.DateTimeFormatOptions = { month: "long", day: 'numeric', year: 'numeric' };
      var date = new Intl.DateTimeFormat("ar-EG", options).format(new Date());
      pdf.setFontSize(10);
      pdf.text(date, 290, 10, { "align": "right" });



      pdf.addImage(img, 'png', 250, 15, 30, 30);
      var title = "الأصول";
      pdf.setFontSize(20);
      pdf.text(title, 250, 30, { "align": "right" });

      const col = [
        {
          content: 'المنظمه',
          styles: { fontStyle: 'Amiri-Regular', fillColor: [26, 26, 64], halign: 'right' },
        },
        {
          content: 'تاريخ الشراء',
          styles: { fontStyle: 'Amiri-Regular', fillColor: [26, 26, 64], halign: 'right' },
        },
        {
          content: 'المورد',
          styles: { fontStyle: 'Amiri-Regular', fillColor: [26, 26, 64], halign: 'right' },
        },
        {
          content: 'الوحده الصحيه',
          styles: { fontStyle: 'Amiri-Regular', fillColor: [26, 26, 64], halign: 'right' },
        },
        {
          content: 'المدينه',
          styles: { fontStyle: 'Amiri-Regular', fillColor: [26, 26, 64], halign: 'right' },
        },
        {
          content: 'المحافظه',
          styles: { fontStyle: 'Amiri-Regular', fillColor: [26, 26, 64], halign: 'right' },
        },
        {
          content: 'الصانع',
          styles: { fontStyle: 'Amiri-Regular', fillColor: [26, 26, 64], halign: 'right' },
        },
        {
          content: "الاسم",
          styles: { fontStyle: 'Amiri-Regular', fillColor: [26, 26, 64], halign: 'right' },
        }
      ];

      const purchaseoptions: Intl.DateTimeFormatOptions = { month: "long", day: 'numeric', year: 'numeric' };

      switch (this.selectedElement) {
        case "الصانع":
          this.lstBrandAsset.forEach(elem => {
            elem.assetList.forEach(brandObj => {
              var purchaseDate = new Intl.DateTimeFormat("ar-EG", purchaseoptions).format(new Date(brandObj.purchaseDate));
              row = [brandObj.orgNameAr, purchaseDate, brandObj.supplierNameAr, brandObj.hospitalNameAr, brandObj.cityNameAr, brandObj.governorateNameAr, brandObj.brandNameAr, brandObj.assetNameAr];
              rows.push(row);
            });
            (pdf as any).autoTable({
              headStyles: { font: "Amiri-Regular", fontStyle: 'normal', halign: 'right' },
              styles: { font: 'Amiri-Regular', halign: 'right' },
              bodyStyles: { 1: { halign: 'right' }, 2: { halign: 'right' }, 3: { halign: 'right' }, 4: { halign: 'right' }, 5: { halign: 'right' }, 6: { halign: 'right' }, 7: { halign: 'right' }, 8: { halign: 'right' } },
              columnStyles: { halign: 'right' },
              head: [[{
                content: `الصانع : ${elem.nameAr}`, colSpan: 8, styles: {
                  fillColor: [255, 255, 255], textColor: [0, 0, 0]
                }
              }], col],
              startY: y += 55,
              body: rows
            });
            rows = [];
          });
          break;
        case "الوحده الصحيه":
          this.lstHospitalAsset.forEach(elem => {
            elem.assetList.forEach(Ass => {
              var purchaseDate = new Intl.DateTimeFormat("ar-EG", purchaseoptions).format(new Date(Ass.purchaseDate));
              row = [Ass.orgNameAr, purchaseDate, Ass.supplierNameAr, Ass.cityNameAr, Ass.governorateNameAr, Ass.brandNameAr, Ass.assetNameAr];
              rows.push(row);
            });
            (pdf as any).autoTable({
              headStyles: { font: "Amiri-Regular", fontStyle: 'normal' },
              styles: { font: 'Amiri-Regular', halign: 'right' },
              bodyStyles: { 1: { halign: 'right' }, 2: { halign: 'right' }, 3: { halign: 'right' }, 4: { halign: 'right' }, 5: { halign: 'right' }, 6: { halign: 'right' }, 7: { halign: 'right' }, 8: { halign: 'right' } },
              columnStyles: { halign: 'right' },
              head: [[{
                content: `الوحده الصحيه : ${elem.nameAr}`, colSpan: 8, styles: {
                  fillColor: [255, 255, 255], textColor: [0, 0, 0],
                  halign: 'right'
                }, font: 'Amiri-Regular',
              }], col],
              startY: y += 55,
              body: rows,
              //  styles: { font: 'Amiri-Regular', halign: 'right' }
            });
            rows = [];
          });
          break;
        case "المحافظه":
          this.lstGovernorateAsset.forEach(elem => {

            elem.assetList.forEach(Ass => {
              var purchaseDate = new Intl.DateTimeFormat("ar-EG", purchaseoptions).format(new Date(Ass.purchaseDate));
              this.temp = [Ass.orgNameAr, purchaseDate, Ass.supplierNameAr, Ass.hospitalNameAr, Ass.cityNameAr, Ass.brandNameAr, Ass.assetNameAr];
              rows.push(this.temp);
            });
            (pdf as any).autoTable({
              headStyles: { font: "Amiri-Regular", fontStyle: 'normal' },
              styles: { font: 'Amiri-Regular', halign: 'right' },
              bodyStyles: { 1: { halign: 'right' }, 2: { halign: 'right' }, 3: { halign: 'right' }, 4: { halign: 'right' }, 5: { halign: 'right' }, 6: { halign: 'right' }, 7: { halign: 'right' }, 8: { halign: 'right' } },
              columnStyles: { halign: 'right' },
              head: [[{ content: `المحافظه : ${elem.nameAr}`, colSpan: 8, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], halign: 'right' }, font: 'Amiri-Regular', }],
                col],
              startY: y += 55,
              body: rows,
              //     styles: { font: 'Amiri-Regular', halign: 'right' }
            });
            rows = [];
          });
          break;
        case "المدينه":

          this.lstCityAsset.forEach(elem => {
            elem.assetList.forEach(Ass => {
              var purchaseDate = new Intl.DateTimeFormat("ar-EG", purchaseoptions).format(new Date(Ass.purchaseDate));
              row = [Ass.orgNameAr, purchaseDate, Ass.supplierNameAr, Ass.hospitalNameAr, Ass.cityNameAr, Ass.brandNameAr, Ass.assetNameAr];
              rows.push(row);
            });
            (pdf as any).autoTable({
              headStyles: { font: "Amiri-Regular", fontStyle: 'normal' },
              styles: { font: 'Amiri-Regular', halign: 'right' },
              bodyStyles: { 1: { halign: 'right' }, 2: { halign: 'right' }, 3: { halign: 'right' }, 4: { halign: 'right' }, 5: { halign: 'right' }, 6: { halign: 'right' }, 7: { halign: 'right' }, 8: { halign: 'right' } },
              columnStyles: { halign: 'right' },
              head: [[{ content: `المدينه : ${elem.nameAr}`, colSpan: 8, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], halign: 'right', font: 'Amiri-Regular' } }],
                col],
              startY: y += 55,
              body: rows,
              // styles: { font: 'Amiri-Regular', halign: 'right' }
            });
            rows = [];
          });
          break;
        case "المنظمه":
          this.lstOrganizationAsset.forEach(elem => {
            elem.assetList.forEach(Ass => {
              var purchaseDate = new Intl.DateTimeFormat("ar-EG", purchaseoptions).format(new Date(Ass.purchaseDate));
              row = [Ass.orgNameAr, purchaseDate, Ass.supplierNameAr, Ass.hospitalNameAr, Ass.cityNameAr, Ass.governorateNameAr, Ass.brandNameAr, Ass.assetNameAr];
              rows.push(row);
            });
            (pdf as any).autoTable({
              headStyles: { font: "Amiri-Regular", fontStyle: 'normal' },
              styles: { font: 'Amiri-Regular', halign: 'right' },
              bodyStyles: { 1: { halign: 'right' }, 2: { halign: 'right' }, 3: { halign: 'right' }, 4: { halign: 'right' }, 5: { halign: 'right' }, 6: { halign: 'right' }, 7: { halign: 'right' }, 8: { halign: 'right' } },
              columnStyles: { halign: 'right' },
              head: [[{ content: `المنظمه : ${elem.nameAr}`, colSpan: 8, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], font: 'Amiri-Regular', halign: 'right' } }],
                col],
              startY: y += 55,
              body: rows,
              // styles: { font: 'Amiri-Regular', halign: 'right' }
            });
            rows = [];
          });
          break;
        case "المورد":
          this.lstSupplierAsset.forEach(elem => {
            elem.assetList.forEach(Ass => {
              var purchaseDate = new Intl.DateTimeFormat("ar-EG", purchaseoptions).format(new Date(Ass.purchaseDate));
              row = [Ass.orgNameAr, purchaseDate, Ass.hospitalNameAr, Ass.cityNameAr, Ass.governorateNameAr, Ass.brandNameAr, Ass.assetNameAr];
              rows.push(row);
            });
            (pdf as any).autoTable({
              headStyles: { font: "Amiri-Regular", fontStyle: 'normal' },
              styles: { font: 'Amiri-Regular', halign: 'right' },
              bodyStyles: { 1: { halign: 'right' }, 2: { halign: 'right' }, 3: { halign: 'right' }, 4: { halign: 'right' }, 5: { halign: 'right' }, 6: { halign: 'right' }, 7: { halign: 'right' }, 8: { halign: 'right' } },
              columnStyles: { halign: 'right' },
              head: [[{ content: `المورد : ${elem.nameAr}`, colSpan: 8, styles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], halign: 'right' }, font: 'Amiri-Regular' }],
                col],
              startY: y += 55,
              body: rows,
              //styles: { font: 'Amiri-Regular', halign: 'right' }
            });
            rows = [];
          });
          break;
        default:
          this.lstAssets.forEach((element) => {
            var purchaseDate = new Intl.DateTimeFormat("ar-EG", purchaseoptions).format(new Date(element.purchaseDate));
            row = [element.orgNameAr, purchaseDate, element.supplierNameAr, element.hospitalNameAr, element.cityNameAr, element.governorateNameAr, element.brandNameAr, element.assetNameAr];
            rows.push(row);
          });
          pdf.autoTable(col, rows, { startY: 50, styles: { font: 'Amiri-Regular', halign: 'right' } });
          break;
      }

      var exportdate = this.datepipe.transform(new Date, "dd-MM-yyyy_HH:mm:ss");
      pdf.save('AssetGeneralReport_' + exportdate + '.pdf');
    }

    if (this.filteredObj.name != null) {
      this.filterByName(this.filteredObj.name);
    }
    if (this.filteredObj.brandName != null) {
      this.filterByBrand(this.filteredObj.brandName);
    }
    if (this.filteredObj.govName != null) {
      this.filterByGov(this.filteredObj.govName);
    }
    if (this.filteredObj.cityName != null) {
      this.filterByCity(this.filteredObj.cityName);
    }
    if (this.filteredObj.hosName != null) {
      this.filterByHos(this.filteredObj.hosName);
    }
    if (this.filteredObj.supplierName != null) {
      this.filterBySupplier(this.filteredObj.supplierName);
    }
    if (this.filteredObj.purchaseDate != null) {
      this.filterByPurchaseDate(this.filteredObj.purchaseDate);
    }
    if (this.newLstAssets.length > 0) {
      if (this.lang == "en") {
        this.newLstAssets.forEach(Asset => {
          this.temp = [Asset.assetName, Asset.brandName, Asset.governorateName, Asset.cityName, Asset.hospitalName, Asset.supplierName,
          this.datepipe.transform(Asset.purchaseDate, 'yyyy-MM-dd'), Asset.orgName];
          rows.push(this.temp);
        });
        (pdf as any).autoTable({
          head: [["Name", "Brand", "Governorate", "City", "Hospital", "Supplier", "Purchase Date", "Organization"]],
          startY: y += 40,
          body: rows
        });
      }
      else if (this.lang == "ar") {
        pdf.addFileToVFS('Amiri-Regular', fontAmiri);
        pdf.addFont('Amiri-Regular', 'Amiri-Regular', 'normal');
        pdf.setFont('Amiri-Regular');
        pdf.setFontSize(16);

        this.newLstAssets.forEach(Asset => {
          this.temp = [Asset.assetNameAr, Asset.brandNameAr, Asset.governorateNameAr, Asset.cityNameAr, Asset.hospitalNameAr, Asset.supplierNameAr,
          this.datepipe.transform(Asset.purchaseDate, 'yyyy-MM-dd'), Asset.orgNameAr];
          rows.push(this.temp);
        });
        (pdf as any).autoTable({
          headStyles: { font: "Amiri-Regular", fontStyle: 'normal' },
          head: [col],
          startY: y += 40,
          body: rows,
          styles: { font: 'Amiri-Regular', halign: 'right' }
        });
      }
    }



    var exportdate = this.datepipe.transform(new Date, "dd-MM-yyyy_HH:mm:ss");
    pdf.save('AssetGeneralReport_' + exportdate + '.pdf');
  }
  fillCity(name: string) {
    this.cityService.GetGovIdByname(name).subscribe(data => {
      this.cityService.GetCitiesByGovernorateId(data).subscribe(data => {
        this.cityList = data
      });
    });

  }
  fillHospital(name: string) {
    this.cityService.getCityIdByName(name).subscribe(data => {
      this.hospitalService.getHosByCityId(data).subscribe(data => {
        this.hosList = data;
        this.newLstAssets = this.lstAssets;
      })
    })
  }
  filterByName(elem) {
    this.filteredObj.name = elem;
    this.assetDetailService.FilterData(this.filteredObj).subscribe(data => {
      this.lstAssets = data;
      if (this.selectedElement != null) {
        this.selectElement(this.selectedElement);
      }
      this.newLstAssets = this.lstAssets;
    });
  }
  filterByBrand(elem) {
    this.filteredObj.brandName = elem;
    this.assetDetailService.FilterData(this.filteredObj).subscribe(data => {
      this.lstAssets = data;
      if (this.selectedElement != null) {
        this.selectElement(this.selectedElement);
      }
      this.newLstAssets = this.lstAssets;
    });
  }
  filterByGov(elem) {
    this.filteredObj.govName = elem;
    this.assetDetailService.FilterData(this.filteredObj).subscribe(data => {
      this.lstAssets = data;
      if (this.selectedElement != null) {
        this.selectElement(this.selectedElement);
      }
      this.newLstAssets = this.lstAssets;
    });
  }
  filterByCity(elem) {
    this.filteredObj.cityName = elem;
    this.assetDetailService.FilterData(this.filteredObj).subscribe(data => {
      this.lstAssets = data;
      if (this.selectedElement != null) {
        this.selectElement(this.selectedElement);
      }
      this.newLstAssets = this.lstAssets;
    });
  }
  filterByHos(elem) {
    this.filteredObj.hosName = elem;
    this.assetDetailService.FilterData(this.filteredObj).subscribe(data => {
      this.lstAssets = data;
      if (this.selectedElement != null) {
        this.selectElement(this.selectedElement);
      }
      this.newLstAssets = this.lstAssets;
    });
  }
  filterBySupplier(elem) {
    this.filteredObj.supplierName = elem;
    this.assetDetailService.FilterData(this.filteredObj).subscribe(data => {
      this.lstAssets = data;
      if (this.selectedElement != null) {
        this.selectElement(this.selectedElement);
      }
      this.newLstAssets = this.lstAssets;
    });
  }
  filterByPurchaseDate(elem) {
    if (elem != "") {
      document.getElementById('clcbtn').style.display = "block";
      document.getElementById('clcbtn').style.marginTop = "-1.6rem";
      document.getElementById('clcbtn').style.marginLeft = "8rem";
    }
    this.filteredObj.purchaseDate = elem;
    this.assetDetailService.FilterData(this.filteredObj).subscribe(data => {
      this.lstAssets = data;
      if (this.selectedElement != null) {
        this.selectElement(this.selectedElement);
      }
      this.newLstAssets = this.lstAssets;
    });
  }
  selectElement(elem) {
    this.isDisplayed = true;
    this.selectedElement = elem;
    if (elem != "") {
      //  document.getElementById('clcgroupingbtn').style.display = "block";
      this.isDisplayed = true;
    }
    else {
      this.isDisplayed = false;
      document.getElementById('clcgroupingbtn').style.display = "none";
    }
    //   if (this.lang == "en") {
    //     document.getElementById('clcgroupingbtn').style.display = "block";
    //     document.getElementById('clcgroupingbtn').style.marginTop = "0.3rem";
    //     document.getElementById('clcgroupingbtn').style.zIndex = "1";
    //     document.getElementById('clcgroupingbtn').style.marginLeft = "-5rem";
    //   }

    //   else if (this.lang == "ar") {
    //     document.getElementById('clcgroupingbtn').style.display = "block";
    //     // document.getElementById('clcgroupingbtn').style.marginTop = "0";
    //     document.getElementById('clcgroupingbtn').style.zIndex = "1";
    //     // document.getElementById('clcgroupingbtn').style.textAlign = "left";
    //     document.getElementById('clcgroupingbtn').style.alignContent = "left"
    //   }
    // }


    if (elem === "Brand" || elem === "الصانع") {
      this.assetDetailService.getAssetByBrand(this.lstAssets).subscribe(data => {
        this.lstBrandAsset = data;
      })
    }
    else if (elem === "Hospital" || elem === "الوحده الصحيه") {
      this.assetDetailService.getAssetByHospital(this.lstAssets).subscribe(data => {
        this.lstHospitalAsset = data;
      });
    }
    else if (elem === "Governorate" || elem === "المحافظه") {
      this.assetDetailService.getAssetByGovernorate(this.lstAssets).subscribe(data => {
        this.lstGovernorateAsset = data;
      });
    }
    else if (elem === "City" || elem === "المدينه") {
      this.assetDetailService.getAssetByCity(this.lstAssets).subscribe(data => {
        this.lstCityAsset = data;
      });
    }
    else if (elem === "Organization" || elem === "المنظمه") {
      this.assetDetailService.getAssetByOrganization(this.lstAssets).subscribe(data => {
        this.lstOrganizationAsset = data;
      });
    }
    else if (elem === "Supplier" || elem === "المورد") {
      this.assetDetailService.getAssetBySupplier(this.lstAssets).subscribe(data => {
        this.lstSupplierAsset = data;
      });
    }
    else {
      this.assetDetailService.GetAssetsyUserId(this.currentUser.id).subscribe(items => {
        this.lstAssets = items;
      });
    }
  }

  checkValue() {
    $('#installationDate').val("");
    document.getElementById('clcbtn').style.display = "none";
    this.filteredObj.purchaseDate = null;
    this.assetDetailService.FilterData(this.filteredObj).subscribe(data => {
      this.lstAssets = data;
      if (this.selectedElement != null) {
        this.selectElement(this.selectedElement);
      }
      this.newLstAssets = this.lstAssets;
    });
  }
  checkGroupingValue() {
    this.selectedElement = null;
    //document.getElementById('clcgroupingbtn').style.display = "none";
    this.isDisplayed = false;
    this.assetDetailService.FilterData(this.filteredObj).subscribe(data => {
      this.lstAssets = data;
      this.newLstAssets = this.lstAssets;
    });
  }

  Back(): void {
    this.location.back();
  }


  onSelectionChanged(event) {
    this.masterAssetService.AutoCompleteMasterAssetName(event.query).subscribe(masters => {
      this.lstMasterAssets = masters;
      if (this.lang == "en") {

        this.lstMasterAssets.forEach(item => item.name = item.code + "-" + item.name);
      }
      else {
        this.lstMasterAssets.forEach(item => item.name = item.code + "-" + item.nameAr);
      }
    });
  }


  getObject(event) {
    if (this.lang == "en") {
      this.assetName = (event["name"].substring(event["name"].indexOf('-') + 1)).trim();
    }
    else {
      this.assetName = (event["nameAr"].substring(event["nameAr"].indexOf('-') + 1)).trim();
    }

    this.filteredObj.name = this.assetName;
    if (this.filteredObj.name != "") {
      this.assetDetailService.FilterData(this.filteredObj).subscribe(data => {
        this.lstAssets = data;
        if (this.selectedElement != null) {
          this.selectElement(this.selectedElement);
        }
        this.newLstAssets = this.lstAssets;
      });
    }
    else {
      this.assetDetailService.GetAssetsyUserId(this.currentUser.id).subscribe(items => {
        this.lstAssets = items;
      });
    }


  }
}


