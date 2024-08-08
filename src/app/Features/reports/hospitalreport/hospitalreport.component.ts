import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CountAssetVM } from 'src/app/Shared/Models/assetDetailVM';
import { GetGovernorateWithHospitalsCount } from 'src/app/Shared/Models/governorateVM';

import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { Chart } from 'chart.js';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';
(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;



@Component({
  selector: 'app-hospitalreport',
  templateUrl: './hospitalreport.component.html',
  styleUrls: ['./hospitalreport.component.css']
})
export class HospitalreportComponent implements OnInit {
  @ViewChild('contentToConvert')
  pdfTable!: ElementRef;
  @ViewChild('hospitalChart') hospitalChart;
  doughnutChart: Chart;


  currentUser: LoggedUser;
  assetByHospitals: any;
  data: any;
  chartOptions: any;
  governorate: string[] = [];
  lang = localStorage.getItem('lang');
  lstAssetsByHospitals: CountAssetVM[] = [];
  assetOptions: any;
  govwithHos: GetGovernorateWithHospitalsCount[];
  counter: number = 0;
  length: number;
  temp: string[];
  msgs: [];
  chart: any;
  constructor(private authenticationService: AuthenticationService, private govService: GovernorateService, private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute) { this.currentUser = this.authenticationService.currentUserValue }

  ngOnInit(): void {
    this.linechart();

    const translationKeys = ['Asset.Reports', 'Asset.Hospitals', 'Asset.HospitalinGovernorates'];
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);

  }



  linechart() {

    this.govService.GetGovernorateWithHospitalsCount().subscribe(data => {
      this.assetByHospitals = this.govwithHos;
      if (this.lang == "en") {
        this.govwithHos = data;

      }
      else {
        this.govwithHos = data.reverse();
      }

      this.data = {
        labels: this.lang == "en" ? this.govwithHos.map(a => a.name) : this.govwithHos.map(a => a.nameAr),
        datasets: [{
          type: 'bar',
          label: this.lang == "en" ? 'Hospital Count' : 'عدد المستشفيات',
          backgroundColor: '#79be47',
          data: this.govwithHos.map(a => a.hospitalsCount),
          borderColor: 'white',
          borderWidth: 2
        }]
      }
      if (this.lang == "en") {
        this.chartOptions = {
          responsive: true,
          plugins: {
            legend: {
              display: false,
              labels: {
                color: '#495057',
                font: {
                  size: '30'
                }
              }
            }, title: {
              display: false,
              text: 'Hospitals in Governorates',
              font: {
                size: '30px'
              }
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
              ticks: {
                color: '#495057'
              },
              grid: {
                color: '#ebedef'
              }
            }
          }
        }
      }
      else {
        this.chartOptions = {
          responsive: true,
          plugins: {
            legend: {
              display: false,
              labels: {
                color: '#495057',
                font: {
                  size: '30'
                }
              }

            },
            title: {
              display: false,
              text: 'المستشفيات بالمحافظات',
              font: {
                size: '30px'
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

        }
      }
    });
  }
  selectData(e: any) {
  }

  exportPdf() {
    var data = document.getElementById('contentToConvert');


    html2canvas(data, { scale: 3 }).then(canvas => {

      var imgWidth = 200;
      var pageHeight = 200;
      var y = 0;
      var rows = [];
      var imgHeight = canvas.height * imgWidth / canvas.width;
      var heightLeft = imgHeight;
      const contentDataURL = canvas.toDataURL('image/png')
      let pdf = new jsPDF('p', 'mm', 'a4');
      const pageCount = pdf.internal.getNumberOfPages();
      var position = 0;
      pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
      let printedBy = this.lang == "en" ? "Printed By : " + this.currentUser.userName : "تمت الطباعة بواسطة : " + this.currentUser.userName;
      for (var i = 0; i < pageCount; i++) {
        pdf.setPage(i + 1);
        pdf.text(printedBy, pdf.internal.pageSize.getWidth() - 100, pdf.internal.pageSize.getHeight() - 10);
        pdf.text(String(i + 1) + "/" + String(pageCount), pdf.internal.pageSize.getWidth() - 20, pdf.internal.pageSize.getHeight() - 10);
      }

      pdf.save('file.pdf');
    });
  }
}
const DEFAULT_COLORS = ['#495057', '#EC407A', '#26a69a',
  '#AB47BC',
  '#42A5F5',
  '#7E57C2',
  '#66BB6A',
  '#FFCA28',
  '#26A69A', '#3366CC', '#DC3912', '#FF9900', '#109618', '#990099',
  '#3B3EAC', '#0099C6', '#DD4477', '#66AA00', '#B82E2E',
  '#316395', '#994499', '#22AA99', '#AAAA11', '#6633CC',
  '#E67300', '#8B0707', '#329262', '#5574A6', '#3B3EAC']
