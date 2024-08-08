import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { DetailMasterContractVM, ListMasterContractVM } from 'src/app/Shared/Models/masterContractVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { MasterContractService } from 'src/app/Shared/Services/masterContract.service';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { ListContractDetailVM } from 'src/app/Shared/Models/contractDetailVM';
import { SupplierService } from 'src/app/Shared/Services/supplierService.service';
import { environment } from 'src/environments/environment';
import { ListContractAttachmentVM } from 'src/app/Shared/Models/contractAttachmentVM';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { DetailsComponent } from '../../hospital-assets/details/details.component';
import { DialogService } from 'primeng/dynamicdialog';
;


@Component({
  selector: 'app-view-contract',
  templateUrl: './view-contract.component.html',
  styleUrls: ['./view-contract.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ViewContractComponent implements OnInit {

  lang = localStorage.getItem('lang');
  direction = localStorage.getItem('dir');;
  currentUser: LoggedUser;
  contractObj: DetailMasterContractVM;
  lstMasterContracts: ListMasterContractVM[] = [];
  lstAssetsHospital: ListHospitalVM[] = [];
  lstContracts: ListContractDetailVM[] = [];
  lstContractAttachment: ListContractAttachmentVM[] = [];
  masterContractId: number = 0;
  selectedHospitalId: number = 0;
  display: boolean = false;
  supplierName: string = "";
  contractTitle: string = '';


  constructor(public dialogService: DialogService, private authenticationService: AuthenticationService, private uploadService: UploadFilesService, private masterContractService: MasterContractService, private supplierService: SupplierService, private route: Router) { this.currentUser = this.authenticationService.currentUserValue; }


  ngOnInit(): void {
    this.contractObj = { listDetails: [], supplierName: '', supplierNameAr: '', totalVisits: 0, contractDate: '', from: '', serial: '', subject: '', to: '', id: 0, cost: 0, supplierId: 0, hospitalId: 0, notes: '' };

    this.masterContractService.GetMasterContractsByHospitalId2(this.currentUser.hospitalId).subscribe(items => {
      this.lstMasterContracts = items.results;
    });
  }

  getHospitalsOfContract(masterId: number) {
    this.masterContractId = masterId;
    this.lstAssetsHospital = [];
    this.masterContractService
      .GetListofHospitalsFromAssetContractDetailByMasterContractId(masterId)
      .subscribe((items) => {
        this.lstAssetsHospital = items;
      });

    this.masterContractService.MasterContractById(masterId).subscribe(
      (data) => {
        this.contractObj = data;
        var supplier = this.lang == 'en' ? this.contractObj.supplierName : this.contractObj.supplierNameAr;
        this.contractTitle = this.contractObj.subject + " -  " + supplier;

      });
  }


  getContractAssetsByHospitalId(hospitalId) {
    this.lstContracts = [];
    this.masterContractService.GetContractAssetsByHospitalId(hospitalId, this.masterContractId).subscribe(assets => {
      this.lstContracts = assets;
    });
  }

  getContractById(masterId: number) {
    this.display = true;
    this.masterContractService.MasterContractById(masterId).subscribe(
      (data) => {
        this.contractObj = data;

        var supplier = this.lang == 'en' ? this.contractObj.supplierName : this.contractObj.supplierNameAr;
        this.contractTitle = this.contractObj.subject + " - " + supplier;

        this.masterContractService.GetContractAttachmentByMasterContractId(this.contractObj.id).subscribe(lstdocs => {
          this.lstContractAttachment = lstdocs;
        });

        this.supplierService.GetSupplierById(this.contractObj.supplierId).subscribe(sup => {
          if (this.lang == "en")
            this.supplierName = sup.name;
          else
            this.supplierName = sup.nameAr;
        })
      },
      (error) => console.log(error)
    );

  }


  downloadFile(fileName) {
    var filePath = `${environment.Domain}UploadedAttachments/`;
    this.uploadService.downloadMasterContractFile(fileName).subscribe(file => {
      var dwnldFile = filePath + 'MasterContractFiles/' + fileName;
      if (fileName != "" || fileName != null)
        window.open(dwnldFile);
    })
  }




  viewDetail(id: number) {
    const dialogRef2 = this.dialogService.open(DetailsComponent, {
      header: this.lang == "en" ? "Asset Details" : "بيانات الأصل",
      data: {
        id: id
      },
      width: '75%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl",
        "font-family": "sans-serif"
      }
    });
    dialogRef2.onClose.subscribe((res) => {
    });
  }

}
