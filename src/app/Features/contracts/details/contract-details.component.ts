import { Component, OnInit, ViewChild } from '@angular/core';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { DetailMasterContractVM } from 'src/app/Shared/Models/masterContractVM';
import { ListContractAttachmentVM } from 'src/app/Shared/Models/contractAttachmentVM';
import { MasterContractService } from 'src/app/Shared/Services/masterContract.service';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
import { SupplierService } from 'src/app/Shared/Services/supplierService.service';
import { ListSupplierVM } from 'src/app/Shared/Models/supplierVM';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
@Component({
  selector: 'app-contract-details',
  templateUrl: './contract-details.component.html',
  styleUrls: ['./contract-details.component.css']
})
export class ContractDetailsComponent implements OnInit {

  lang = localStorage.getItem('lang');
  dir: string = 'ltr';
  currentUser: LoggedUser;
  contractObj: DetailMasterContractVM;
  lstAssetsHospital: ListHospitalVM[];
  lstSuppliers: ListSupplierVM[] = [];
  lstContractAttachments: ListContractAttachmentVM[] = [];

  id: number = 0;
  masterId: number = 0;
  @ViewChild(DataTableDirective, { static: false })
  datatableElement: DataTableDirective;
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings = {
    pagingType: 'full_numbers',
    pageLength: 10,
    lengthMenu: [10, 25, 50, 100, 'All'],
    order: [],
    info: false,
    paging: false,
    responsive: true,
    language: this.lang == 'ar' ?
      {
        "emptyTable": "ليست هناك بيانات متاحة في الجدول",
        "loadingRecords": "جارٍ التحميل...",
        "lengthMenu": "أظهر _MENU_ مدخلات",
        "zeroRecords": "لم يعثر على أية سجلات",
        "info": "إظهار _START_ إلى _END_ من أصل _TOTAL_ مدخل",
        "infoEmpty": "يعرض 0 إلى 0 من أصل 0 سجل",
        "infoFiltered": "(منتقاة من مجموع _MAX_ مُدخل)",
        "search": "ابحث:",
        "paginate": {
          "first": "الأول",
          "previous": "السابق",
          "next": "التالي",
          "last": "الأخير"
        },
        "aria": {
          "sortAscending": ": تفعيل لترتيب العمود تصاعدياً",
          "sortDescending": ": تفعيل لترتيب العمود تنازلياً"
        },
        "processing": "جارٍ المعالجة..."
      } : {
        "emptyTable": "No data available in table",
        "info": "Showing _START_ to _END_ of _TOTAL_ entries",
        "infoEmpty": "Showing 0 to 0 of 0 entries",
        "infoFiltered": "(filtered from _MAX_ total entries)",
        "lengthMenu": "Show _MENU_ entries",
        "loadingRecords": "Loading...",
        "processing": "Processing...",
        "search": "Search:",
        "zeroRecords": "No matching records found",
        "thousands": ",",
        "paginate": {
          "first": "First",
          "last": "Last",
          "next": "Next",
          "previous": "Previous"
        },
        "aria": {
          "sortAscending": ": activate to sort column ascending",
          "sortDescending": ": activate to sort column descending"
        },
      }
  };


  constructor(
    private authenticationService: AuthenticationService, private masterContractService: MasterContractService,
    private supplierService: SupplierService, private activeRoute: ActivatedRoute, private config: DynamicDialogConfig) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    if (this.lang == 'en') {
      this.dir = 'ltr';
    } else {
      this.dir = 'rtl';
    }
    this.contractObj = { supplierName: '', supplierNameAr: '', totalVisits: 0, contractDate: '', from: '', serial: '', subject: '', to: '', id: 0, cost: 0, supplierId: 0, hospitalId: 0, notes: '', listDetails: [] };



    this.supplierService.GetSuppliers().subscribe(items => {
      this.lstSuppliers = items;
    });


    if (this.activeRoute.snapshot != null || this.activeRoute.snapshot != undefined) {
      this.id = this.activeRoute.snapshot.params['id'];
      this.masterId = this.activeRoute.snapshot.params['id'];
      this.masterContractService.MasterContractById(this.id).subscribe(
        (data) => {
          this.contractObj = data;
          this.masterContractService.GetContractAttachmentByMasterContractId(this.contractObj.id).subscribe(lstdocs => {
            this.lstContractAttachments = lstdocs;
          });
        },
        (error) => console.log(error));

      this.masterContractService.GetListofHospitalsFromAssetContractDetailByMasterContractId(this.masterId)
        .subscribe((items) => {
          this.lstAssetsHospital = items;
        });
    }
    if (this.config.data != null || this.config.data != undefined) {
      this.id = this.config.data.masterId;
      this.masterId = this.config.data.masterId;


      this.masterContractService.MasterContractById(this.masterId).subscribe(
        (data) => {
          this.contractObj = data;
          this.masterContractService.GetContractAttachmentByMasterContractId(this.contractObj.id).subscribe(lstdocs => {
            this.lstContractAttachments = lstdocs;
          });
        },
        (error) => console.log(error));

      this.masterContractService.GetListofHospitalsFromAssetContractDetailByMasterContractId(this.masterId)
        .subscribe((items) => {
          this.lstAssetsHospital = items;
        });
    }



  }


  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    $.fn['dataTable'].ext.search.pop();
  }
}
