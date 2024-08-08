import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { ActivatedRoute, Router } from '@angular/router';
import { DataTableDirective } from 'angular-datatables';
import { ConfirmationService } from 'primeng/api';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { Subject } from 'rxjs';
import { ListAssetDetailVM, AssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { CreateContractAttachmentVM, ListContractAttachmentVM } from 'src/app/Shared/Models/contractAttachmentVM';
import { CreateContractDetailVM, ListContractDetailVM } from 'src/app/Shared/Models/contractDetailVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { EditMasterContractVM } from 'src/app/Shared/Models/masterContractVM';
import { ListSupplierVM } from 'src/app/Shared/Models/supplierVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { MasterContractService } from 'src/app/Shared/Services/masterContract.service';
import { SupplierService } from 'src/app/Shared/Services/supplierService.service';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class EditComponent implements OnInit {
  lang = localStorage.getItem('lang');
  dir: string = 'ltr';
  currentUser: LoggedUser;
  contractObj: EditMasterContractVM;
  lstContracts: ListContractDetailVM[] = [];
  lstSuppliers: ListSupplierVM[];
  showAddNewAssetToContract: boolean = false;
  hospitals: ListHospitalVM[];
  lstAssetsHospital: ListHospitalVM[];
  hospitalId: number;
  selectctedHospitalIds: number[] = [];
  contractAttachmentObj: CreateContractAttachmentVM;

  lstContractAttachments: CreateContractAttachmentVM[] = [];

  //select list of hospital Ids
  selectedHospitals: number[] = [];

  errorDisplay: boolean = false;
  errorMessage: string = "";
  itmIndex: any[] = [];
  formData = new FormData();

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

  lstAssets: ListAssetDetailVM[] = [];
  lstFilteredAssets: ListAssetDetailVM[] = [];
  selectedAsset: ListAssetDetailVM[] = [];
  contractDate: string;
  fromDate: string;
  toDate: string;
  display: boolean = false;
  displayMaximizable: boolean;
  displayModal: boolean;

  itemName: string = '';
  masterContractId: number;
  lstContractAttachment: ListContractAttachmentVM[] = [];

  lstassetDetailBarcodes: AssetDetailVM[] = [];
  lstAssetSerailNumberObj: AssetDetailVM[] = [];
  assetSerailNumberObj: AssetDetailVM;
  assetBarCodeObj: AssetDetailVM;

  isDisabled: boolean = false;

  constructor(
    private authenticationService: AuthenticationService,
    private masterContractService: MasterContractService,
    private assetDetailService: AssetDetailService,
    private hospitalService: HospitalService,
    private supplierService: SupplierService,
    private route: Router, private datePipe: DatePipe, private activeRoute: ActivatedRoute, private config: DynamicDialogConfig,
    private confirmationService: ConfirmationService, private uploadService: UploadFilesService,
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    if (this.lang == 'en') {
      this.dir = 'ltr';
    } else {
      this.dir = 'rtl';
    }
    this.contractObj = { totalVisits: 0, contractDate: '', from: '', serial: '', subject: '', to: '', id: 0, cost: 0, supplierId: 0, hospitalId: 0, notes: '' };
    this.contractAttachmentObj = { id: 0, fileName: '', masterContractId: 0, documentName: '', contractFile: File, hospitalId: 0 };

    // let id = this.activeRoute.snapshot.params['id'];
    if (this.config.data != null || this.config.data != undefined) {


      let id = this.config.data.id;

      this.masterContractId = id;
      this.masterContractService.GetMasterContractById(id).subscribe(
        (data) => {
          this.contractObj = data;
          this.masterContractService.GetContractAttachmentByMasterContractId(this.contractObj.id).subscribe(lstdocs => {
            this.lstContractAttachment = lstdocs;
          });
        },
        (error) => console.log(error)
      );

      this.masterContractService
        .GetListofHospitalsFromAssetContractDetailByMasterContractId(id)
        .subscribe((items) => {
          this.lstAssetsHospital = items;
        });
    }

    this.hospitalService.GetHospitals().subscribe(allhosts => {
      this.hospitals = allhosts;

      // this.selectedHospitals = this.hospitals.slice(0, 2).map(a => a.id);

      if (this.currentUser.hospitalId != 0) {
        this.isDisabled = true;
        //  this.selectedHospitals = this.hospitals.slice(0, 2).map(a => a.id);
        this.selectedHospitals = this.hospitals.filter(x => x.id > 0 && x.id == this.currentUser.hospitalId).map(x => x.id);
        this.lstAssets = [];
        this.selectedHospitals.forEach(hospitalId => {
          this.assetDetailService.GetListOfAssetDetailsByHospitalNotInContract(Number(hospitalId)).subscribe(items => {
            if (items.length > 0) {
              this.lstAssets = [...this.lstAssets, ...items];
            }
          });
        });

      }
      else {
        this.isDisabled = false;

        this.selectedHospitals = this.hospitals.filter(x => x.id > 0 && x.id == this.currentUser.hospitalId).map(x => x.id);
        this.lstAssets = [];
        this.selectedHospitals.forEach(hospitalId => {
          this.assetDetailService.GetListOfAssetDetailsByHospitalNotInContract(Number(hospitalId)).subscribe(items => {
            if (items.length > 0) {
              this.lstAssets = [...this.lstAssets, ...items];
            }
          });
        });

      }

    });

    this.supplierService.GetSuppliers().subscribe(items => {
      this.lstSuppliers = items;
    });


  }


  getContractAssetsByHospitalId(hospitalId) {
    this.masterContractService.GetContractAssetsByHospitalId(hospitalId, this.masterContractId).subscribe(assets => {
      this.lstContracts = assets;
    });
  }
  onSubmit() {
    this.selectedAsset.forEach((element) => {
      const model = new CreateContractDetailVM();
      if (element.hasSpareParts == undefined) element.hasSpareParts = false;
      if (element.responseTime == undefined) element.responseTime = '0';

      model.assetDetailId = element.id;
      model.hasSpareParts = element.hasSpareParts;
      model.responseTime = element.responseTime;
      model.contractDate = this.contractObj.contractDate;
      model.masterContractId = this.contractObj.id;
      this.masterContractService
        .CreateContract(model)
        .subscribe((itemId) => { });
    });

    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);

  }

  public uploadFile = (files) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    this.formData.append('file', fileToUpload, fileToUpload.name);
    this.contractAttachmentObj.fileName = fileToUpload.name;
    this.contractAttachmentObj.contractFile = fileToUpload;
    this.addFileToList();
  }
  removeFileFromObjectArray(doc) {
    const index: number = this.lstContractAttachments.indexOf(doc);
    if (index !== -1) {
      this.lstContractAttachments.splice(index, 1);
    }
  }
  addFileToList() {
    if (this.contractAttachmentObj.documentName != "" && this.contractAttachmentObj.fileName != "") {
      this.contractAttachmentObj.masterContractId = Number(this.masterContractId);
      let ext = this.contractAttachmentObj.fileName.split('.').pop();
      let lastdocumentName = "";
      let imageIndex = "";
      if (this.itmIndex.length == 0) {
        this.masterContractService.GetLastDocumentForMasterContractId(Number(this.masterContractId)).subscribe(lastDoc => {
          lastdocumentName = lastDoc.fileName;
          if (lastdocumentName == null) {

            var last_element = 1;
            this.itmIndex.push(last_element);
            let ext = this.contractAttachmentObj.fileName.split('.').pop();
            var hCode = this.pad(this.currentUser.hospitalCode, 4);
            //var srCode = this.pad(this.assetObj.barcode, 10);
            let newIndex = this.pad((last_element).toString(), 2);
            let WOFileName = hCode + "CO" + newIndex;
            this.contractAttachmentObj.fileName = WOFileName + "." + ext;
          }
          else if (lastdocumentName != "") {
            imageIndex = lastdocumentName.split('.').slice(0, -1).join('.');
            imageIndex = imageIndex.substring(imageIndex.length - 2);
            this.itmIndex.push(imageIndex);

            var newImageIndex = parseInt(imageIndex) + 1;
            this.itmIndex.push(newImageIndex);

            var hCode = this.pad(this.currentUser.hospitalCode, 4);
            //var srCode = this.pad(this.assetObj.barcode, 10);
            var last = this.itmIndex[this.itmIndex.length - 1];
            let newIndex = this.pad((last).toString(), 2);
            let woRFileName = hCode + "CO" + newIndex + "." + ext;
            this.contractAttachmentObj.fileName = woRFileName;

          }
          else if (lastdocumentName == "") {

            var last_element = 1;
            this.itmIndex.push(last_element);
            let ext = this.contractAttachmentObj.fileName.split('.').pop();
            var hCode = this.pad(this.currentUser.hospitalCode, 4);
            //   var srCode = this.pad(this.assetObj.barcode, 10);
            let newIndex = this.pad((last_element).toString(), 2);
            let WOFileName = hCode + "CO" + newIndex;
            this.contractAttachmentObj.fileName = WOFileName + "." + ext;
          }
          this.lstContractAttachments.push(this.contractAttachmentObj);
          this.contractAttachmentObj = { id: 0, fileName: '', masterContractId: 0, documentName: '', contractFile: File, hospitalId: 0 };
        });
      }
      else if (this.itmIndex.length > 0) {
        var last_element = this.itmIndex[this.itmIndex.length - 1];
        last_element = parseInt(last_element) + 1;
        this.itmIndex.push(last_element);

        var hCode = this.pad(this.currentUser.hospitalCode, 4);
        // var srCode = this.pad(this.assetObj.barcode, 10);
        let newIndex = this.pad((last_element).toString(), 2);
        let SRFileName = hCode + "CO" + newIndex;
        this.contractAttachmentObj.fileName = SRFileName + "." + ext;
        this.lstContractAttachments.push(this.contractAttachmentObj);
        this.contractAttachmentObj = { id: 0, fileName: '', masterContractId: 0, documentName: '', contractFile: File, hospitalId: 0 };
      }
    }
  }
  pad(num: string, size: number): string {
    while (num.length < size) num = "0" + num;
    return num;
  }
  changeContractDate(event: MatDatepickerInputEvent<Date>) {
    this.contractDate = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    this.contractObj.contractDate = this.contractDate;
  }

  changeFromDate(event: MatDatepickerInputEvent<Date>) {
    this.fromDate = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    this.contractObj.from = this.fromDate;
  }
  changeToDate(event: MatDatepickerInputEvent<Date>) {
    this.toDate = this.datePipe.transform(event.value, 'yyyy-MM-dd');
    this.contractObj.to = this.toDate;
  }
  deleteContract(id: number) {
    this.lstContracts.forEach((element) => {
      if (element.id == id) {
        if (this.lang == 'en') {
          this.confirmationService.confirm({
            message:
              'Are you sure that you want to delete this item ' +
              element['assetName'] +
              ' ?',
            header: 'Delete Item Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.masterContractService.DeleteContract(id).subscribe(deletedId => {
                let currentUrl = this.route.url;
                this.route.routeReuseStrategy.shouldReuseRoute = () => false;
                this.route.onSameUrlNavigation = 'reload';
                this.route.navigate([currentUrl]);
              });
            },
            reject: () => {
              this.confirmationService.close();
              this.ngOnInit();
            },
          });
        }

        if (this.lang == 'ar') {
          this.confirmationService.confirm({
            message:
              'هل أنت متأكد من مسح هذا العنصر ' +
              element['assetNameAr'] +
              ' ?',
            header: 'تأكيد المسح',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.masterContractService.DeleteContract(id).subscribe(deletedId => {
                let currentUrl = this.route.url;
                this.route.routeReuseStrategy.shouldReuseRoute = () => false;
                this.route.onSameUrlNavigation = 'reload';
                this.route.navigate([currentUrl]);
              });
            },
            reject: () => {
              this.confirmationService.close();
              this.ngOnInit();
            },
          });
        }
      }
    });
  }

  onUpdate() {
    this.masterContractService
      .UpdateMasterContract(this.contractObj)
      .subscribe((savedItem) => {
        //  this.display = true;

        if (this.lstContractAttachments.length > 0) {
          this.lstContractAttachments.forEach((item, index) => {
            item.masterContractId = this.masterContractId;
            item.hospitalId = this.currentUser.hospitalId;
            this.masterContractService.CreateContractAttachments(item).subscribe(fileObj => {
              this.uploadService.uploadContractFiles(item.contractFile, item.fileName).subscribe(
                (event) => {
                  this.display = true;
                },
                (err) => {

                  if (this.lang == "en") {
                    this.errorDisplay = true;
                    this.errorMessage = 'Could not upload the file:' + item[index].fileName;
                  }
                  else {
                    this.errorDisplay = true;
                    this.errorMessage = 'لا يمكن رفع ملف ' + item[index].fileName;
                  }
                });
            });
          });

          this.lstContractAttachments = [];
          this.display = true;
        }
        else {
          this.display = true;
        }
      });

    // let currentUrl = this.route.url;
    // this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    // this.route.onSameUrlNavigation = 'reload';
    //      this.route.navigate([currentUrl]);
    this.route.navigate(['/dash/hospitalcontract']);
  }

  deleteFile(id: number) {
    if (this.lang == 'en') {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to delete this file?',
        header: 'Delete Item Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.masterContractService.DeleteContractAttachment(id).subscribe(result => {
          });
          this.lstContractAttachment = [];
          this.masterContractService.GetContractAttachmentByMasterContractId(this.contractObj.id).subscribe(lstdocs => {
            this.lstContractAttachment = lstdocs;
          });
        },
        reject: () => {
          this.confirmationService.close();
        }
      });
    }
    else {
      this.confirmationService.confirm({
        message: 'هل أنت متأكد من مسح هذا الملف',
        header: "تأكيد المسح",
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.masterContractService.DeleteContractAttachment(id).subscribe(result => {
          });
          this.lstContractAttachment = [];
          this.masterContractService.GetContractAttachmentByMasterContractId(this.contractObj.id).subscribe(lstdocs => {
            this.lstContractAttachment = lstdocs;
          });
        },
        reject: () => {
          this.confirmationService.close();
        }
      });
    }
  }
  addAssetToContract() {
    this.showAddNewAssetToContract = true;
  }
  ngOnDestroy(): void {
    this.dtTrigger.unsubscribe();
    $.fn['dataTable'].ext.search.pop();
  }
  downloadFile(fileName) {
    var filePath = `${environment.Domain}UploadedAttachments/`;
    this.uploadService.downloadMasterContractFile(fileName).subscribe(file => {
      var dwnldFile = filePath + 'MasterContractFiles/' + fileName;
      if (fileName != "" || fileName != null)
        window.open(dwnldFile);
    })
  }
  onMoveAssetToTarget($event) {
    const uniqueIds = new Set();
    const unique = this.selectedAsset.filter(element => {
      const isDuplicate = uniqueIds.has(element.id);
      uniqueIds.add(element.id);
      if (!isDuplicate) {
        return true;
      }
      return false;
    });
    this.selectedAsset = [];
    this.selectedAsset = unique;
  }
  getBarCode(event) {
    this.lstAssets = [];
    this.selectedHospitals.forEach(hospitalId => {
      this.assetDetailService.GetListOfAssetDetailsByHospitalNotInContract2(event["barCode"], Number(event["hospitalId"])).subscribe(items => {
        if (items.length > 0) {
          this.lstAssets = [...this.lstAssets, ...items];
        }
      });
    });
  }
  onSelectionChanged(event) {
    if (this.currentUser.hospitalId != 0) {
      this.selectedHospitals.forEach(hospitalId => {
        this.assetDetailService.AutoCompleteAssetBarCode(event.query, Number(this.currentUser.hospitalId)).subscribe(assets => {
          this.lstassetDetailBarcodes = assets;
          this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
        });
      });
    }
    else {

      this.selectedHospitals.forEach(hospitalId => {
        this.assetDetailService.AutoCompleteAssetBarCode(event.query, Number(hospitalId)).subscribe(assets => {
          this.lstassetDetailBarcodes = assets;
          this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
        });
      });
    }
  }
  getSerialNumber(event) {
    this.lstAssets = [];
    this.selectedHospitals.forEach(hospitalId => {
      this.assetDetailService.GetListOfAssetDetailsByHospitalNotInContractBySerialNumber(event["serialNumber"], Number(hospitalId)).subscribe(items => {
        if (items.length > 0) {
          this.lstAssets = [...this.lstAssets, ...items];
        }
      });
    });
  }
  onSerialNumberSelectionChanged(event) {
    if (this.currentUser.hospitalId != 0) {
      this.selectedHospitals.forEach(hospitalId => {
        this.assetDetailService.AutoCompleteAssetSerial(event.query, Number(hospitalId)).subscribe(assets => {
          this.lstAssetSerailNumberObj = assets;
          this.lstAssetSerailNumberObj.forEach(item => item.serialNumber = item.serialNumber);

        });
      });
    }
    else {
      this.selectedHospitals.forEach(hospitalId => {
        this.assetDetailService.AutoCompleteAssetSerial(event.query, Number(hospitalId)).subscribe(assets => {
          this.lstAssetSerailNumberObj = assets;
          this.lstAssetSerailNumberObj.forEach(item => item.serialNumber = item.serialNumber);
        });
      });
    }
  }

  clearAssetSerailNumber() {
    this.assetSerailNumberObj = null;
  }
  clearAssetBarCode() {
    this.assetSerailNumberObj = null;
  }


}
