import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { HospitalWithAssetVM } from 'src/app/Shared/Models/hospitalVM';
import * as pdfMake from "pdfmake/build/pdfmake";
import * as pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from 'html-to-pdfmake';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';


import { Chart, LineController, LineElement, PointElement, LinearScale, Title } from 'chart.js'
import { DatePipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';

Chart.register(LineController, LineElement, PointElement, LinearScale, Title);



(pdfMake as any).vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-hospitalcountprice',
  templateUrl: './hospitalcountprice.component.html',
  styleUrls: ['./hospitalcountprice.component.css']
})
export class HospitalcountpriceComponent implements OnInit {
  lang = localStorage.getItem('lang');
  currentUser: LoggedUser;
  @ViewChild('contentToConvert') pdfTable!: ElementRef;


  hosWithAsset: HospitalWithAssetVM[] = [];
  lstHospitalCountPrice: HospitalWithAssetVM[] = [];
  chartOptions1: any;
  data1: any;
  constructor(private authenticationService: AuthenticationService, private hospitalService: HospitalService, private datePipe: DatePipe, private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.linechartForHospital();
    this.hospitalService.getHospitalWithAssets().subscribe(data => {
      this.lstHospitalCountPrice = data;
    });


    const translationKeys = ['Asset.Reports', 'Asset.Hospitals', 'Asset.CountAssetwithTotalPrice'];
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);

  }

  linechartForHospital() {

    this.hospitalService.getHospitalWithAssets().subscribe(data => {
      this.hosWithAsset = data;
      this.hosWithAsset.forEach(element => { });
      if (this.lang == "en") {

        this.data1 = {
          labels: this.lang == "en" ? this.hosWithAsset.map(h => h.name) : this.hosWithAsset.map(h => h.nameAr),
          datasets: [{
            type: 'bar',
            label: this.lang == "en" ? 'Assets Count' : 'عدد الأصول',
            backgroundColor: '#fe7f83',
            data: this.hosWithAsset.map(h => h.assetCount * 10000),
            borderColor: '#fe7f83',
            borderWidth: 2
          },
          {
            type: 'bar',
            label: this.lang == "en" ? 'Assets Price' : 'قيمة الأصول',
            backgroundColor: '#ffa726',
            data: this.hosWithAsset.map(h => h.assetprice),
            borderColor: '#ffa726',
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
              text: 'Count Asset with Total Price',
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

        this.hosWithAsset = this.hosWithAsset.reverse();
        this.data1 = {
          labels: this.hosWithAsset.map(h => h.nameAr),
          datasets: [{
            type: 'bar',
            label: this.lang == "en" ? 'Assets Count' : 'عدد الأصول',
            backgroundColor: '#fe7f83',
            data: this.hosWithAsset.map(h => h.assetCount * 10000),
            borderColor: '#fe7f83',
            borderWidth: 2
          },
          {
            type: 'bar',
            label: this.lang == "en" ? 'Assets Price' : 'قيمة الأصول',
            backgroundColor: '#ffa726',
            data: this.hosWithAsset.map(h => h.assetprice),
            borderColor: '#ffa726',
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
              text: 'إجمالي الأصول وسعرها',
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

        };
      }

    });


    // const canvas = <HTMLCanvasElement>document.getElementById('myChart');
    // const ctx = canvas.getContext('2d');

    // var myLine = new Chart(ctx, this.data1);

    // document.getElementById("hospitalchart").onclick = function (evt) {
    //   var activePoint = myLine.getElementAtEvent(event);

    //   //   myLine.
    //   // make sure click was on an actual point
    //   if (activePoint.length > 0) {
    //     var clickedDatasetIndex = activePoint[0]._datasetIndex;
    //     var clickedElementindex = activePoint[0]._index;
    //     var label = myLine.data.labels[clickedElementindex];
    //     var value = myLine.data.datasets[clickedDatasetIndex].data[clickedElementindex];
    //     alert("Clicked: " + label + " - " + value);
    //   }
    // };
  }
  // exportPdf() {
  //   var data = document.getElementById('contentToConvert');
  //   html2canvas(data, { scrollY: -window.scrollY }).then(canvas => {
  //     // const contentDataURL = canvas.toDataURL('image/png')
  //     // let pdf = new jspdf('l');
  //     // const imgProps = pdf.getImageProperties(contentDataURL);
  //     // const pdfWidth = pdf.internal.pageSize.getWidth();
  //     // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  //     // pdf.addImage(contentDataURL, 'PNG', 0, 0, pdfWidth, pdfHeight);
  //     // pdf.save('file.pdf');

  //     var imgWidth = 208;
  //     var pageHeight = 300;
  //     var y = 0;
  //     var rows = [];
  //     var imgHeight = canvas.height * imgWidth / canvas.width;
  //     var heightLeft = imgHeight;
  //     const contentDataURL = canvas.toDataURL('image/png')
  //     let pdf = new jspdf('p', 'mm', 'a4');
  //     pdf.addImage(contentDataURL, 'PNG', 0, 0, imgWidth, imgHeight);
  //     heightLeft -= pageHeight;
  //     pdf.save('file.pdf');
  //   });
  // }

  async downloadPdf() {
    var data = document.getElementById("contentToConvert");
    await html2canvas(data, { scrollY: -window.scrollY, scale: 3 }).then(
      canvas => {
        const contentDataURL = canvas.toDataURL("image/png", 1.0);
        // enabling the scroll
        // document.getElementById("allhosts").style.overflow = "scroll";
        // document.getElementById("allhosts").style.maxHeight = "150px";

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

        var exportdate = this.datePipe.transform(new Date(), "dd-MM-yyyy_HH:mm:ss");
        pdf.save('hospitalCountPrice_' + exportdate + '.pdf');
      }
    );
  }



}
