import { Component, OnInit } from '@angular/core';
import { HospitalAssetAge, SearchHospitalAssetVM, ViewAssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { DatePipe } from '@angular/common';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { ListSupplierVM } from 'src/app/Shared/Models/supplierVM';
import { ListOriginVM } from 'src/app/Shared/Models/originVM';
import { ListBrandVM } from 'src/app/Shared/Models/brandVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { CityService } from 'src/app/Shared/Services/city.service';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';
import { BrandService } from 'src/app/Shared/Services/brand.service';
import { OriginService } from 'src/app/Shared/Services/origin.service';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { SupplierService } from 'src/app/Shared/Services/supplierService.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';



@Component({
  selector: 'app-filterassetagegroups',
  templateUrl: './filterassetagegroups.component.html',
  styleUrls: ['./filterassetagegroups.component.css']
})
export class FilterassetagegroupsComponent implements OnInit {
  lang = localStorage.getItem('lang');
  currentUser: LoggedUser;
  lstHospitalAssetAges: HospitalAssetAge[] = [];

  lstGovernorates: ListGovernorateVM[] = [];
  lstCities: ListCityVM[] = [];
  lstOrganizations: ListOrganizationVM[] = [];
  lstSubOrganizations: ListSubOrganizationVM[] = [];
  lstSuppliers: ListSupplierVM[] = [];
  lstOrigins: ListOriginVM[] = [];
  lstBrands: ListBrandVM[] = [];
  lstHospitals: ListHospitalVM[] = [];
  lstHospitalAssets: ViewAssetDetailVM[] = [];
  searchObj: SearchHospitalAssetVM;
  isGov: boolean = false;
  isCity: boolean = false;
  isOrg: boolean = false;
  isSubOrg: boolean = false;
  isHospital: boolean = false;

  errorDisplay: boolean = false;
  errorMessage: string;

  chartOptions1: any;
  data1: any;
  constructor(private authenticationService: AuthenticationService, private assetDetailService: AssetDetailService,
    private governorateService: GovernorateService, private cityService: CityService, private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute,
    private organizationService: OrganizationService, private subOrganizationService: SubOrganizationService,
    private supplierService: SupplierService, private originService: OriginService, private brandService: BrandService,
    private hospitalService: HospitalService, private datePipe: DatePipe, private router: Router) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.onload();
    this.onLoadByLogIn();
    this.linechartForHospital();

    const translationKeys = ['Asset.Reports', 'Asset.Assets', 'Asset.FilterAgeGroup'];
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);

  }

  onload() {
    this.searchObj = {
      masterAssetName: '', masterAssetNameAr: '',
      contractTypeId: 0, barCode: '', masterAssetId: 0, statusId: 0, departmentId: 0, end: '', start: '', warrantyTypeId: 0, contractDate: '', contractEnd: '', contractStart: '',
      userId: '', model: '', code: '', cityId: 0, governorateId: 0, organizationId: 0, subOrganizationId: 0, originId: 0, supplierId: 0, brandId: 0, hospitalId: 0, assetName: '', serial: '', assetId: 0
    }
    this.supplierService.GetSuppliers().subscribe(items => {
      this.lstSuppliers = items;
    });

    this.originService.GetOrigins().subscribe(items => {
      this.lstOrigins = items;
    });
    this.brandService.GetBrands().subscribe(items => {
      this.lstBrands = items;
    });
  }
  onLoadByLogIn() {
    if (this.currentUser.hospitalId > 0 && this.currentUser.organizationId > 0 && this.currentUser.subOrganizationId > 0) {
      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
        if (this.currentUser.organizationId > 0) {
          this.searchObj.organizationId = this.currentUser.organizationId;
          this.isOrg = true;
          this.subOrganizationService.GetSubOrganizationByOrgId(this.currentUser.organizationId).subscribe(suborgs => {
            this.lstSubOrganizations = suborgs;

            if (this.currentUser.subOrganizationId > 0) {
              this.searchObj.subOrganizationId = this.currentUser.subOrganizationId;
              this.isSubOrg = true;

              this.hospitalService.GetHospitalsBySubOrganizationId(this.currentUser.organizationId).subscribe(hosts => {
                this.lstHospitals = hosts;
                this.searchObj.hospitalId = this.currentUser.hospitalId;
                this.isHospital = true;
              });
            }
          });
        }
      });
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
      });
      this.hospitalService.GetHospitalById(this.currentUser.hospitalId).subscribe(hospitalObj => {
        this.searchObj.governorateId = hospitalObj.governorateId;
        this.isGov = true;
        this.cityService.GetCitiesByGovernorateId(this.searchObj.governorateId).subscribe((cities) => {
          this.lstCities = cities;
        });
        this.searchObj.cityId = hospitalObj.cityId;
        this.isCity = true;
      });
    }
    else if (this.currentUser.hospitalId > 0 && this.currentUser.governorateId > 0 && this.currentUser.cityId > 0) {

      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
        if (this.currentUser.governorateId > 0) {
          this.searchObj.governorateId = this.currentUser.governorateId;
          this.isGov = true;
          this.cityService.GetCitiesByGovernorateId(this.currentUser.governorateId).subscribe(cities => {
            this.lstCities = cities;

            if (this.currentUser.cityId > 0) {
              this.searchObj.cityId = this.currentUser.cityId;
              this.isCity = true;

              this.hospitalService.GetHospitalsBySubOrganizationId(this.currentUser.governorateId).subscribe(hosts => {
                this.lstHospitals = hosts;
                this.searchObj.hospitalId = this.currentUser.hospitalId;
                this.isHospital = true;
              });
            }
          });
        }
      });
      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
      });
      this.hospitalService.GetHospitalById(this.currentUser.hospitalId).subscribe(hospitalObj => {
        this.searchObj.organizationId = hospitalObj.organizationId;
        this.isOrg = true;
        this.subOrganizationService.GetSubOrganizationByOrgId(this.searchObj.organizationId).subscribe((subs) => {
          this.lstSubOrganizations = subs;
        });
        this.searchObj.subOrganizationId = hospitalObj.subOrganizationId;
        this.isSubOrg = true;
      });
    }
    else if (this.currentUser.governorateId > 0 && this.currentUser.cityId == 0 && this.currentUser.hospitalId == 0) {
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
        if (this.currentUser.governorateId > 0) {
          this.searchObj.governorateId = this.currentUser.governorateId;
          this.isGov = true;
          this.cityService.GetCitiesByGovernorateId(this.currentUser.governorateId).subscribe(cities => {
            this.lstCities = cities;
          });
        }
      });
      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
      });
    }
    else if (this.currentUser.governorateId > 0 && this.currentUser.cityId > 0 && this.currentUser.hospitalId == 0) {
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
        if (this.currentUser.governorateId > 0) {
          this.searchObj.governorateId = this.currentUser.governorateId;
          this.isGov = true;
          this.cityService.GetCitiesByGovernorateId(this.currentUser.governorateId).subscribe(cities => {
            this.lstCities = cities;
            this.searchObj.cityId = this.currentUser.cityId;
            this.isCity = true;
          });
        }
      });
      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
      });
    }
    else if (this.currentUser.hospitalId == 0 && this.currentUser.organizationId > 0 && this.currentUser.subOrganizationId == 0) {
      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
        if (this.currentUser.organizationId > 0) {
          this.searchObj.organizationId = this.currentUser.organizationId;
          this.isOrg = true;
          this.subOrganizationService.GetSubOrganizationByOrgId(this.currentUser.organizationId).subscribe(suborgs => {
            this.lstSubOrganizations = suborgs;

            if (this.currentUser.subOrganizationId > 0) {
              this.searchObj.subOrganizationId = this.currentUser.subOrganizationId;
            }
          });
        }
      });
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
      });
    }
    else if (this.currentUser.hospitalId == 0 && this.currentUser.organizationId > 0 && this.currentUser.subOrganizationId > 0) {

      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
        if (this.currentUser.organizationId > 0) {
          this.searchObj.organizationId = this.currentUser.organizationId;
          this.isOrg = true;
          this.subOrganizationService.GetSubOrganizationByOrgId(this.currentUser.organizationId).subscribe(suborgs => {
            this.lstSubOrganizations = suborgs;

            if (this.currentUser.subOrganizationId > 0) {
              this.searchObj.subOrganizationId = this.currentUser.subOrganizationId;
              this.isSubOrg = true;

              this.hospitalService.GetHospitalsBySubOrganizationId(this.currentUser.subOrganizationId).subscribe(hosts => {
                this.lstHospitals = hosts;
                this.searchObj.hospitalId = this.currentUser.hospitalId;
              });
            }
          });
        }
      });

      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
      });

    }
    else if (this.currentUser.hospitalId == 0 && this.currentUser.organizationId == 0 && this.currentUser.subOrganizationId == 0 && this.currentUser.governorateId == 0 && this.currentUser.cityId == 0) {
      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
      });
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
      });

    }
  }



  reset() {
    let currentUrl = this.router.url;
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl]);
  }
  getCitiesByGovId($event) {
    this.cityService.GetCitiesByGovernorateId($event.target.value).subscribe(cities => {
      this.lstCities = cities;
    });
  }


  getSubOrgByOrgId($event) {
    this.subOrganizationService.GetSubOrganizationByOrgId($event.target.value).subscribe(suborgs => {
      this.lstSubOrganizations = suborgs;
    });
  }
  getHospitalsBySubOrgId($event) {
    if (this.searchObj.subOrganizationId != 0) {
      let subOrgId = this.searchObj.subOrganizationId;
      this.hospitalService.GetHospitalsBySubOrganizationId($event.target.value).subscribe(suborgs => {
        this.lstHospitals = suborgs;
      });
    }
  }
  onSearch() {
    this.searchObj.userId = this.currentUser.id;
    if (this.searchObj.assetName == '' && this.searchObj.assetId == 0 &&
      this.searchObj.brandId == 0 && this.searchObj.hospitalId == 0 && this.searchObj.serial == '' &&
      this.searchObj.governorateId == 0 && this.searchObj.cityId == 0 && this.searchObj.organizationId == 0 && this.searchObj.subOrganizationId == 0
      && this.searchObj.originId == 0 && this.searchObj.supplierId == 0) {
      this.errorDisplay = true
      if (this.lang == "en") {
        this.errorMessage = "Please select search criteria";
      }
      else {
        this.errorMessage = "من فضلك اختر مجال البحث";
      }
    }
    else {

      this.assetDetailService.GetGeneralAssetsByAgeGroup(this.searchObj).subscribe(data => {
        this.lstHospitalAssetAges = data;
        if (this.lang == "en") {

          this.data1 = {
            labels: this.lstHospitalAssetAges.map(h => h.ageGroup),
            datasets: [{
              type: 'bar',
              label: 'Assets Age',
              backgroundColor: '#409bcd',
              data: this.lstHospitalAssetAges.map(h => h.count),
              borderColor: '#409bcd',
              borderWidth: 2
            }]
          };
          this.chartOptions1 = {
            plugins: {
              legend: {
                labels: {
                  color: '#495057'
                }
              },
              title: {
                display: false,
              }
            },
            scales: {
              x: {
                ticks: {
                  color: '#495057'
                },
                grid: {
                  color: '#ebedef'
                }
              },
              y: {
                position: 'left',
                ticks: {
                  color: '#495057'
                },
                grid: {
                  color: '#ebedef'
                }
              }
            }
          };
        }
        else {

          this.lstHospitalAssetAges = this.lstHospitalAssetAges.reverse();
          this.data1 = {
            labels: this.lstHospitalAssetAges.map(h => h.ageGroup),
            datasets: [{
              type: 'bar',
              label: 'عمر الأصول',
              backgroundColor: '#409bcd',
              data: this.lstHospitalAssetAges.map(h => h.count),
              borderColor: '#409bcd',
              borderWidth: 2
            }]
          };
          this.chartOptions1 = {
            plugins: {
              legend: {
                labels: {
                  color: '#495057'
                }
              },
              title: {
                display: true,
                text: 'الأصول',
                font: {
                  size: '50px'
                }
              }
            },
            tooltips: {
              rtl: true,
              bodyFontSize: 10,
              titleFontSize: 11,
            },
            scales: {
              x: {
                ticks: {
                  color: '#495057',
                },
                grid: {
                  color: '#ebedef',
                  textDirection: 'rtl',
                  rtl: true,
                }
              },
              y: {

                position: 'right',
                ticks: {
                  color: '#495057'
                },
                grid: {
                  color: '#ebedef',
                  textDirection: 'rtl',
                  rtl: true,
                }
              }
            }
          };
        }

      });

    }


  }
  linechartForHospital() {
    if (this.currentUser.hospitalId > 0 && this.currentUser.organizationId > 0 && this.currentUser.subOrganizationId > 0) {
      this.searchObj.hospitalId = this.currentUser.hospitalId;
      this.searchObj.organizationId = this.currentUser.organizationId;
      this.searchObj.subOrganizationId = this.currentUser.subOrganizationId;
    }
    else if (this.currentUser.hospitalId > 0 && this.currentUser.governorateId > 0 && this.currentUser.cityId > 0) {
      this.searchObj.hospitalId = this.currentUser.hospitalId;
      this.searchObj.governorateId = this.currentUser.governorateId;
      this.searchObj.cityId = this.currentUser.cityId;
    }

    else if (this.currentUser.governorateId > 0 && this.currentUser.cityId == 0 && this.currentUser.hospitalId == 0) {
      this.searchObj.governorateId = this.currentUser.governorateId;
    }
    else if (this.currentUser.governorateId > 0 && this.currentUser.cityId > 0 && this.currentUser.hospitalId == 0) {
      this.searchObj.governorateId = this.currentUser.governorateId;
      this.searchObj.cityId = this.currentUser.cityId;
    }

    else if (this.currentUser.hospitalId == 0 && this.currentUser.organizationId > 0 && this.currentUser.subOrganizationId == 0) {
      this.searchObj.organizationId = this.currentUser.organizationId;
      this.searchObj.subOrganizationId = this.currentUser.subOrganizationId;
    }
    else if (this.currentUser.hospitalId == 0 && this.currentUser.organizationId > 0 && this.currentUser.subOrganizationId > 0) {
      this.searchObj.organizationId = this.currentUser.organizationId;
      this.searchObj.subOrganizationId = this.currentUser.subOrganizationId;
    }
    else if (this.currentUser.hospitalId == 0 && this.currentUser.organizationId == 0 && this.currentUser.subOrganizationId == 0 && this.currentUser.governorateId == 0 && this.currentUser.cityId == 0) {

    }
    this.assetDetailService.GetGeneralAssetsByAgeGroup(this.searchObj).subscribe(data => {
      this.lstHospitalAssetAges = data;
      if (this.lang == "en") {

        this.data1 = {
          labels: this.lstHospitalAssetAges.map(h => h.ageGroup),
          datasets: [{
            type: 'bar',
            label: 'Assets Age',
            backgroundColor: '#409bcd',
            data: this.lstHospitalAssetAges.map(h => h.count),
            borderColor: '#409bcd',
            borderWidth: 2
          }]
        };
        this.chartOptions1 = {
          plugins: {
            legend: {
              labels: {
                color: '#495057'
              }
            },
            title: {
              display: false,
            }
          },
          scales: {
            x: {
              ticks: {
                color: '#495057'
              },
              grid: {
                color: '#ebedef'
              }
            },
            y: {
              position: 'left',
              ticks: {
                color: '#495057'
              },
              grid: {
                color: '#ebedef'
              }
            }
          }
        };
      }
      else {

        this.lstHospitalAssetAges = this.lstHospitalAssetAges.reverse();
        this.data1 = {
          labels: this.lstHospitalAssetAges.map(h => h.ageGroup),
          datasets: [{
            type: 'bar',
            label: 'عمر الأصول',
            backgroundColor: '#409bcd',
            data: this.lstHospitalAssetAges.map(h => h.count),
            borderColor: '#409bcd',
            borderWidth: 2
          }]
        };
        this.chartOptions1 = {
          plugins: {
            legend: {
              labels: {
                color: '#495057'
              }
            },
            title: {
              display: true,
              text: 'الأصول',
              font: {
                size: '50px'
              }
            }
          },
          tooltips: {
            rtl: true,
            bodyFontSize: 10,
            titleFontSize: 11,
          },
          scales: {
            x: {
              ticks: {
                color: '#495057',
              },
              grid: {
                color: '#ebedef',
                textDirection: 'rtl',
                rtl: true,
              }
            },
            y: {

              position: 'right',
              ticks: {
                color: '#495057'
              },
              grid: {
                color: '#ebedef',
                textDirection: 'rtl',
                rtl: true,
              }
            }
          }
        };
      }

    });
  }
  async downloadPdf() {
    var data = document.getElementById("contentToConvert");
    await html2canvas(data, { scrollY: -window.scrollY, scale: 3 }).then(
      canvas => {
        const contentDataURL = canvas.toDataURL("image/png", 1.0);
        let pdf = new jspdf("l", "mm", "a4"); // A4 size page of PDF
        const pageCount = pdf.internal.getNumberOfPages();
        let imgWidth = 300;
        let pageHeight = 500;// pdf.internal.pageSize.height;
        let imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        pdf.addImage(contentDataURL, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(contentDataURL, "PNG", 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        let printedBy = this.lang == "en" ? "Printed By : " + this.currentUser.userName : "تمت الطباعة بواسطة : " + this.currentUser.userName;
        for (var i = 0; i < pageCount; i++) {
          pdf.setPage(i + 1);
          pdf.text(printedBy, pdf.internal.pageSize.getWidth() - 100, pdf.internal.pageSize.getHeight() - 10);
          pdf.text(String(i + 1) + "/" + String(pageCount), pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 10);
        }
        let filedate = this.datePipe.transform(new Date(), "ddMMyyyyHHmmss");
        pdf.save('assetAge_' + filedate + '.pdf');
      }
    );
  }

}
