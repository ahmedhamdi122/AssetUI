import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router'; import { MessageService } from 'primeng/api';
import { AssetDetailVM, ListAssetDetailVM, SearchHospitalAssetVM } from 'src/app/Shared/Models/assetDetailVM';
import { ListBrandVM } from 'src/app/Shared/Models/brandVM';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { CreateContractAttachmentVM } from 'src/app/Shared/Models/contractAttachmentVM';
import { CreateContractDetailVM } from 'src/app/Shared/Models/contractDetailVM';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { HospitalVM, ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { CreateMasterContractVM } from 'src/app/Shared/Models/masterContractVM';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { ListOriginVM } from 'src/app/Shared/Models/originVM';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { ListSupplierVM } from 'src/app/Shared/Models/supplierVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { BrandService } from 'src/app/Shared/Services/brand.service';
import { CityService } from 'src/app/Shared/Services/city.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { MasterContractService } from 'src/app/Shared/Services/masterContract.service';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { OriginService } from 'src/app/Shared/Services/origin.service';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';
import { SupplierService } from 'src/app/Shared/Services/supplierService.service';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CreateComponent implements OnInit {
  lang = localStorage.getItem('lang');
  dir: string = "ltr";
  currentUser: LoggedUser;
  contractObj: CreateMasterContractVM;
  searchObj: SearchHospitalAssetVM;
  contractAttachmentObj: CreateContractAttachmentVM;

  lstContractAttachments: CreateContractAttachmentVM[] = [];
  hospitals: ListHospitalVM[] = [];

  //select list of hospital Ids
  selectedHospitals: number[] = [];

  lstAssets: ListAssetDetailVM[] = [];
  selectedAsset: ListAssetDetailVM[] = [];
  lstGovernorates: ListGovernorateVM[] = [];
  lstCities: ListCityVM[] = [];
  lstOrganizations: ListOrganizationVM[] = [];
  lstSubOrganizations: ListSubOrganizationVM[] = [];
  lstSuppliers: ListSupplierVM[] = [];
  lstSelectSuppliers: ListSupplierVM[] = [];
  lstOrigins: ListOriginVM[] = [];
  lstBrands: ListBrandVM[] = [];
  isValidDate: any;
  isValidContractDate: any;
  error: any = { isError: false, errorMessage: '' };
  dateError: boolean = false;
  errorDisplay: boolean = false;
  display: boolean = false;
  errorMessage: string = "";

  itmIndex: any[] = [];
  formData = new FormData();

  statusId: number = 0;
  masterContractId: number = 0;

  lstassetDetailBarcodes: AssetDetailVM[] = [];
  lstAssetSerailNumberObj: AssetDetailVM[] = [];
  assetSerailNumberObj: AssetDetailVM;
  assetBarCodeObj: AssetDetailVM;


  isDisabled: boolean = false;
  constructor(private authenticationService: AuthenticationService, private assetDetailService: AssetDetailService,
    private masterContractService: MasterContractService, private hospitalService: HospitalService,
    private governorateService: GovernorateService, private cityService: CityService,
    private organizationService: OrganizationService, private subOrganizationService: SubOrganizationService,
    private supplierService: SupplierService, private originService: OriginService, private uploadService: UploadFilesService,
    private brandService: BrandService, private datePipe: DatePipe, private messageService: MessageService,
    private route: Router) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    if (this.lang == "en") {
      this.dir = "ltr";
    }
    else {
      this.dir = "rtl";
    }
    this.searchObj = {
      masterAssetName: '', masterAssetNameAr: '',
      model: '', userId: '', barCode: '', masterAssetId: 0, statusId: 0, departmentId: 0, contractDate: '', contractEnd: '', contractStart: '',
      code: '', cityId: 0, governorateId: 0, organizationId: 0, subOrganizationId: 0, originId: 0, supplierId: 0,
      brandId: 0, hospitalId: 0, assetName: '', serial: '', assetId: 0, end: '', start: '', warrantyTypeId: 0, contractTypeId: 0
    }

    this.hospitalService.GetHospitals().subscribe(allhosts => {
      this.hospitals = allhosts;


      //List of hospital ids
      if (this.currentUser.hospitalId != 0) {
        this.isDisabled = true;
        //  this.selectedHospitals = this.hospitals.slice(0, 2).map(a => a.id == this.currentUser.hospitalId);

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
    this.onLoad();

    this.contractObj = { totalVisits: 0, contractNumber: '', contractDate: '', from: '', lstDetails: [], serial: '', subject: '', to: '', cost: 0, supplierId: 0, hospitalId: 0, notes: '' };
    this.contractAttachmentObj = { id: 0, fileName: '', masterContractId: 0, documentName: '', contractFile: File, hospitalId: 0 };

    this.masterContractService.GenerateMasterContractSerial().subscribe(num => {
      this.contractObj.serial = num.contractSerial;
    });
  }

  AddAssets(e) {
    // this.lstAssets = [];
    // this.selectedHospitals.forEach(hospitalId => {
    //   this.assetDetailService.GetListOfAssetDetailsByHospitalNotInContract(Number(hospitalId)).subscribe(items => {
    //     if (items.length > 0) {
    //       this.lstAssets = [...this.lstAssets, ...items];
    //     }
    //   });
    // });
  }
  onSubmit() {
    this.selectedAsset.forEach(element => {
      if (element.hasSpareParts == undefined)
        element.hasSpareParts = false;
      if (element.responseTime == undefined)
        element.responseTime = "0";

      const model = new CreateContractDetailVM();
      model.assetDetailId = element.id;
      if (this.currentUser.hospitalId == 0)
        model.hospitalId = element.hospitalId;
      else
        model.hospitalId = this.currentUser.hospitalId;


      model.hasSpareParts = element.hasSpareParts;
      model.responseTime = element.responseTime;
      this.contractObj.lstDetails.push(model);

    });

    let from = this.datePipe.transform(this.contractObj.from, "yyyy-MM-dd");
    let to = this.datePipe.transform(this.contractObj.to, "yyyy-MM-dd");

    this.isValidDate = this.validateDates(from, to);
    if (!this.isValidDate) {
      this.dateError = true;
      return false;
    }



    let contractDate = this.datePipe.transform(this.contractObj.contractDate, "yyyy-MM-dd");
    let start = this.datePipe.transform(this.contractObj.from, "yyyy-MM-dd");

    this.isValidContractDate = this.validateContactDates(contractDate, start);
    if (!this.isValidContractDate) {
      this.dateError = true;
      return false;
    }
    if (this.contractObj.subject == "") {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please add subject";
      }
      else {
        this.errorMessage = "من فضلك اكتب عنوان للعقد";
      }
      return false;
    }
    if (this.contractObj.serial == "") {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please add contract number";
      }
      else {
        this.errorMessage = "من فضلك اكتب رقم للعقد";
      }
      return false;
    }
    if (this.contractObj.lstDetails.length == 0) {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select Asset";
      }
      else {
        this.errorMessage = "من فضلك اختر الجهاز";
      }
      return false;
    }
    if (this.currentUser.hospitalId == 0)
      this.contractObj.hospitalId = this.contractObj.hospitalId;
    else
      this.contractObj.hospitalId = this.currentUser.hospitalId;

    if (this.contractObj.lstDetails.length > 0 && this.contractObj.serial != "" && this.contractObj.subject != "" && this.isValidContractDate && this.isValidDate) {
      this.masterContractService.CreateMasterContract(this.contractObj).subscribe(contractObj => {
        if (this.currentUser.hospitalId == 0)
          this.contractAttachmentObj.hospitalId = contractObj["hospitalId"];
        else
          this.contractAttachmentObj.hospitalId = this.currentUser.hospitalId;
        this.contractAttachmentObj.masterContractId = contractObj["masterContractId"];
        if (this.lstContractAttachments.length > 0) {
          this.lstContractAttachments.forEach((item, index) => {
            item.masterContractId = contractObj["masterContractId"];
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
        }
        else {
          this.display = true;
        }
      });
      this.route.navigate(['/dash/hospitalcontract']);
    }
  }
  onLoad() {
    this.governorateService.GetGovernorates().subscribe(items => {
      this.lstGovernorates = items;

    });

    this.organizationService.GetOrganizations().subscribe(items => {
      this.lstOrganizations = items;
    });

    this.supplierService.GetSuppliers().subscribe(items => {
      this.lstSuppliers = items;
    });

    this.supplierService.GetSuppliers().subscribe(items => {
      this.lstSelectSuppliers = items;
    });


    this.originService.GetOrigins().subscribe(items => {
      this.lstOrigins = items;
    });
    this.brandService.GetBrands().subscribe(items => {
      this.lstBrands = items;
    });

  }
  getCitiesByGovId(govId: number) {
    this.cityService.GetCitiesByGovernorateId(govId).subscribe(cities => {
      this.lstCities = cities;
    });
  }
  getSubOrgByOrgId($event) {
    this.subOrganizationService.GetSubOrganizationByOrgId($event.target.value).subscribe(suborgs => {
      this.lstSubOrganizations = suborgs;
    });
  }
  onSearch() {
    if (this.currentUser.hospitalId != 0) {
      this.searchObj.hospitalId = this.currentUser.hospitalId;
      this.assetDetailService.SearchAssetDetailsByHospitalId(this.searchObj).subscribe(results => {
        this.lstAssets = results;
      });
    }
    else {
      this.assetDetailService.SearchAssetDetailsByHospitalId(this.searchObj).subscribe(results => {
        this.lstAssets = results;
      });
    }
  }
  reset() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }
  validateDates(sDate: string, eDate: string) {
    this.isValidDate = true;
    if ((sDate != null && eDate != null) && (eDate) < (sDate)) {
      if (this.lang == "en") {
        this.error = { isError: true, errorMessage: 'Contract start date should be less than end date.' };
      }
      else {
        this.error = { isError: true, errorMessage: 'ناريخ بداية العقد لابد أن يكون قبل تاريخ النهاية' };
      }
      this.isValidDate = false;
    }
    return this.isValidDate;
  }
  validateContactDates(sDate: string, eDate: string) {
    this.isValidDate = true;
    if ((sDate != null && eDate != null) && (eDate) < (sDate)) {
      if (this.lang == "en") {
        this.error = { isError: true, errorMessage: 'Contract date should be less than start date.' };
      }
      else {
        this.error = { isError: true, errorMessage: 'ناريخ العقد لابد أن يكون نفس تاريخ البداية أو قبلها' };
      }
      this.isValidDate = false;
    }
    return this.isValidDate;
  }
  uploadMultipleFile = (event: any) => {
    const files: FileList = event.target.files;
    if (files.length === 0) {
      return;
    }
    if (this.selectedHospitals.length == 0) {
      this.errorDisplay = true;
      if (this.lang == "en") {
        this.errorMessage = "Please select Hospital";
      }
      else {
        this.errorMessage = "من فضلك اختر مستشفى";
      }
      return false;
    }
    else {
      for (var i = 0; i < files.length; i++) {
        let fileToUpload = <File>files[i];
        var contractAttachmentObj = new CreateContractAttachmentVM();
        this.formData.append('file', fileToUpload, fileToUpload.name);
        contractAttachmentObj.fileName = fileToUpload.name;
        contractAttachmentObj.contractFile = fileToUpload;
        contractAttachmentObj.documentName = fileToUpload.name.split('.')[0];
        this.lstContractAttachments.push(contractAttachmentObj);
      }
      this.addMultiFilesToList();
    }
  }
  addMultiFilesToList() {
    var contractSerial = this.contractObj.serial;
    this.lstContractAttachments.forEach((element, index) => {
      element.masterContractId = Number(this.masterContractId);
      this.selectedHospitals.forEach(selectedHospital => {
        this.hospitalService.GetHospitalById(selectedHospital).subscribe(result => {
          let ext = element.fileName.split('.').pop();
          var hCode = this.pad(selectedHospital.toString(), 4);
          contractSerial = this.pad(contractSerial, 10);
          const incrementedIndex = index + 1;
          let newIndex = this.pad((incrementedIndex).toString(), 2);
          let newFileName = hCode + "CON" + contractSerial + newIndex;
          element.fileName = newFileName + "." + ext;
          element = { id: 0, fileName: '', masterContractId: 0, documentName: '', contractFile: File, hospitalId: 0 };
        });
      });
    });

  }
  removeFileFromObjectArray(rowIndex) {
    var contractSerial = this.contractObj.serial;
    if (rowIndex >= 0 && rowIndex < this.lstContractAttachments.length) {
      this.lstContractAttachments.splice(rowIndex, 1);

      this.lstContractAttachments.forEach((element, index) => {
        element.masterContractId = Number(this.masterContractId);
        this.selectedHospitals.forEach(selectedHospital => {
          this.hospitalService.GetHospitalById(selectedHospital).subscribe(result => {
            let ext = element.fileName.split('.').pop();
            var hCode = this.pad(selectedHospital.toString(), 4);
            contractSerial = this.pad(contractSerial, 10);
            const incrementedIndex = index + 1;
            let newIndex = this.pad((incrementedIndex).toString(), 2);
            let newFileName = hCode + "CON" + contractSerial + newIndex;
            element.fileName = newFileName + "." + ext;
            element = { id: 0, fileName: '', masterContractId: 0, documentName: '', contractFile: File, hospitalId: 0 };
          });
        });
      });
    }
  }
  pad(num: string, size: number): string {
    while (num.length < size) num = "0" + num;
    return num;
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
      this.assetDetailService.GetListOfAssetDetailsByHospitalNotInContract2(event["barCode"], Number(hospitalId)).subscribe(items => {
        if (items.length > 0) {
          this.lstAssets = [...this.lstAssets, ...items];
        }
      });
    });
  }
  onSelectionChanged(event) {
    if (this.currentUser.hospitalId != 0) {
      this.selectedHospitals.forEach(hospitalId => {
        this.assetDetailService.AutoCompleteAssetBarCode(event.query, this.currentUser.hospitalId).subscribe(assets => {
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
