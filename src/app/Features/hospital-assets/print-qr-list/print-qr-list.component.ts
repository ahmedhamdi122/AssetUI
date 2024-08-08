import { Component, OnInit } from '@angular/core';
import jsPDF from 'jspdf';
import 'jspdf-autotable'
import * as faker from "faker";
import { ListAssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { Paging } from 'src/app/Shared/Models/paging';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
@Component({
  selector: 'app-print-qr-list',
  templateUrl: './print-qr-list.component.html',
  styleUrls: ['./print-qr-list.component.css']
})
export class PrintQrListComponent implements OnInit {
  page: Paging;
  lstAssets: ListAssetDetailVM[] = [];
  currentUser: LoggedUser;
  selectedQrFilePath: string[] = []
  value: string
  qrId: string

  pageHeight: number
  constructor(private assetDetailService: AssetDetailService, private authenticationService: AuthenticationService) {
    this.currentUser = this.authenticationService.currentUserValue;
  }
  ngOnInit(): void {
    this.selectedQrFilePath
    this.page = {
      pagenumber: 1,
      pagesize: 10,

    }
    this.assetDetailService.GetAssetDetailsByUserIdWithPaging(this.currentUser.id, this.page).subscribe(items => {
      this.lstAssets = items;
    });
  }
  getBase64Image(img) {
    var canvas = document.createElement("canvas");
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL;
  }
  download() {
    var x = 0;
    var y = 0;
    let doc = new jsPDF("p", "mm", "a4");
    //     this.pageHeight= doc.internal.pageSize.height;
    //     if (y >= this.pageHeight)
    // {
    //   doc.addPage();
    //   y = 0 // Restart height position
    // }
    for (var i = 0; i < this.selectedQrFilePath.length; i++) {
      this.value = this.selectedQrFilePath[i]
      var qrcode = document.getElementById(this.selectedQrFilePath[i]);
      let imageData = this.getBase64Image(qrcode.firstChild.firstChild);
      if (x > 150) {
        x = 0;
        y = 50
      }
      if (i == 0 || (i % 5) == 0) {
        doc.addImage(imageData, "JPG", x, y, 40, 40);
      }
      else {
        doc.addImage(imageData, "JPG", x += 40, y, 40, 40);
      }
    }
    doc.save('AssetsQrCodes.pdf');
  }
  checked(id, assetname) {
    this.qrId = id
  }

  bodyRows(rowCount) {

    for (var i = 0; i < this.selectedQrFilePath.length; i++) {
      rowCount = rowCount || 5;
      let body = [];
      for (var j = 1; j <= rowCount; j++) {
        this.value = this.selectedQrFilePath[i]
        var qrcode = document.getElementById(this.selectedQrFilePath[i]);
        let imageData = this.getBase64Image(qrcode.firstChild.firstChild);
        var image = new Image()
        image.src = imageData

        body.push({
          imageData
          // doc.addImage(imageData, "JPG",x += 40, y, 40, 40);
        });
        return body;
      }
    }
  }

  createPdf() {
    var doc = new jsPDF('p', 'mm');

    doc.setFontSize(18);
    doc.text("With content", 14, 22);
    doc.setFontSize(11);
    doc.setTextColor(100);

    // jsPDF 1.4+ uses getWidth, <1.4 uses .width
    var pageSize = doc.internal.pageSize;
    var pageWidth = pageSize.width ? pageSize.width : pageSize.getWidth();
    var text = doc.splitTextToSize(
      faker.lorem.sentence(45),
      pageWidth - 35,
      {}
    );
    doc.text(text, 14, 30);

    (doc as any).autoTable({

      body: this.bodyRows(1000),
      startY: 50,
      showHead: "firstPage"
    });
    var x = 0
    doc.text(text, 14, (doc as any).autoTable.previous.finalY + 10);
    for (var i = 0; i < this.selectedQrFilePath.length; i++) {
      var rowCount = this.selectedQrFilePath.length;

      for (var j = 1; j <= rowCount; j++) {
        this.value = this.selectedQrFilePath[i]
        var qrcode = document.getElementById(this.selectedQrFilePath[i]);
        let imageData = this.getBase64Image(qrcode.firstChild.firstChild);
        doc.addImage(imageData, "JPG", x += 40, (doc as any).autoTable.previous.finalY + 10, 40, 40);
      }
    }
    doc.save("table.pdf");
  }




}

