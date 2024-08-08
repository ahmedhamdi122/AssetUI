import { Component, OnInit } from '@angular/core';
import { HospitalAssetAge } from 'src/app/Shared/Models/assetDetailVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import jspdf from 'jspdf';
import html2canvas from 'html2canvas';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-assetagegroups',
  templateUrl: './assetagegroups.component.html',
  styleUrls: ['./assetagegroups.component.css']
})
export class AssetagegroupsComponent implements OnInit {
  lang = localStorage.getItem('lang');
  currentUser: LoggedUser;
  lstHospitalAssetAges: HospitalAssetAge[] = [];

  chartOptions1: any;
  data1: any;
  constructor(private authenticationService: AuthenticationService, private assetDetailService: AssetDetailService, private datePipe: DatePipe) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.linechartForHospital();
  }
  linechartForHospital() {

    this.assetDetailService.GetAssetsByAgeGroup(this.currentUser.hospitalId).subscribe(data => {
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
              text: 'Assets',
              font: {
                size: '50px'
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
              display: false,
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
