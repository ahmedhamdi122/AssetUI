import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ListSupplierAttachmentVM } from 'src/app/Shared/Models/SupplierAttachmentVM';
import { EditSupplierVM } from 'src/app/Shared/Models/supplierVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { SupplierService } from 'src/app/Shared/Services/supplierService.service';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  supplierObj: EditSupplierVM;
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  lstAllSupplierAttachments: ListSupplierAttachmentVM[] = [];

  constructor(private supplierService: SupplierService, private authenticationService: AuthenticationService,
    private uploadService: UploadFilesService, private config: DynamicDialogConfig, private route: Router) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    this.supplierObj = { printedBy: '', lang: '', id: 0, code: '', name: '', nameAr: '', address: '', addressAr: '', email: '', eMail: '', mobile: '', website: '', contactPerson: '', fax: '', notes: '' ,countAssets:0,sumPrices:0}
    //  let id = this.activeRoute.snapshot.params['id'];
    if (this.config.data != null || this.config.data != undefined) {
      let id = this.config.data.id;
      this.supplierService.GetSupplierById(id).subscribe(
        data => {
          this.supplierObj = data;
          this.supplierService.GetSupplierAttachmentsBySupplierId(this.supplierObj.id).subscribe(files => {
            this.lstAllSupplierAttachments = files;
          });
        });
    }
  }
  downloadFile(fileName) {
    var filePath = `${environment.Domain}UploadedAttachments/`;
    this.uploadService.downloadSupplierFile(fileName).subscribe(file => {
      var dwnldFile = filePath + 'SupplierAttachments/' + fileName;
      if (fileName != "" || fileName != null)
        window.open(dwnldFile);
    })
  }

  back() { this.route.navigate(['/dash/suppliers']); }
}
