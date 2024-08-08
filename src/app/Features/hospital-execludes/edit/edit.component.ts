import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { ApplicationTypeService } from 'src/app/Shared/Services/applicationtype.service';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { CityService } from 'src/app/Shared/Services/city.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { HospitalApplicationService } from 'src/app/Shared/Services/hospitalapplication.service';
import { HospitalExecludeReasonService } from 'src/app/Shared/Services/hospitalexecludereason.service';
import { HospitalHoldReasonService } from 'src/app/Shared/Services/hospitalholdreason.service';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { AssetDetailVM, ViewAssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { ListSupplierExecludeReasonVM } from 'src/app/Shared/Models/supplierExecludeReasonVM';
import { ListHospitalExecludeReasonVM } from 'src/app/Shared/Models/HospitalExecludeReasonVM';
import { ListHospitalHoldReasonVM } from 'src/app/Shared/Models/HospitalHoldReasonVM';
import { ListApplicationTypeVM } from 'src/app/Shared/Models/applicationtype';
import { environment } from 'src/environments/environment';
import { CreateHospitalApplicationAttachmentVM, EditHospitalApplicationVM } from 'src/app/Shared/Models/HospitalApplicationVM';
import { HospitalApplicationTransactionService } from 'src/app/Shared/Services/hospitalapplicationtransaction.service';
import { ListHospitalApplicationTransactionVM } from 'src/app/Shared/Models/hospitalApplicationTransactionVM';
import { ExcludFile } from '../create/create.component';
import { FileUpload } from 'primeng/fileupload';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {


  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  currentUser: LoggedUser;
  id: number;
  hospitalApplicationObj: EditHospitalApplicationVM;
  lstGovernorates: ListGovernorateVM[];
  lstCities: ListCityVM[];
  lstOrganizations: ListOrganizationVM[];
  lstSubOrganizations: ListSubOrganizationVM[];
  lstHospitals: ListHospitalVM[] = [];
  lstAssets: ViewAssetDetailVM[] = [];
  lstReasons: ListSupplierExecludeReasonVM[] = [];
  lstHospitalExecludeReasons: ListHospitalExecludeReasonVM[] = [];
  lstHospitalHoldReasons: ListHospitalHoldReasonVM[] = [];
  lstTypes: ListApplicationTypeVM[] = [];
  hospitalApplicationDocument: CreateHospitalApplicationAttachmentVM;
  lstHospitalApplicationDocuments: CreateHospitalApplicationAttachmentVM[] = [];
  isSaved: boolean = false;
  showGovCity: boolean = false;
  showOrgAndSub: boolean = false;
  showHospital: boolean = false;
  showType: boolean = false;
  showSExeclude: boolean = false;
  showHExeclude: boolean = false;
  showHHold: boolean = false;
  isSupplierSaved: boolean = false;
  isHospitalSaved: boolean = false;
  selectedAppType: number = 1;
  isSupplier: boolean = false;
  isHospital: boolean = false;

  addReasons: number[] = [];
  addHEReasons: number[] = [];
  addHHReasons: number[] = [];
  lstTransactions: ListHospitalApplicationTransactionVM[] = [];

  fileToUpload: File;
  uploadFileName: string;
  errorMessage: string;
  errorDisplay: boolean = false;
  savedfilesdisplay: boolean = false;
  display: boolean = false;
  selectedItem: string = "supplier";


  uploadControlName: FileUpload;
  lstExcludFile: ExcludFile[] = [];
  isShown: boolean = true;
  visibleId: number = 0;

  assetBarCodeObj: AssetDetailVM;
  lstassetDetailBarcodes: AssetDetailVM[] = [];

  constructor(private authenticationService: AuthenticationService, private activeRoute: ActivatedRoute,
    private hospitalExecludeReasonService: HospitalExecludeReasonService,
    private hospitalHoldeReasonService: HospitalHoldReasonService,
    private hospitalApplicationService: HospitalApplicationService,
    private hospitalApplicationTransactionService: HospitalApplicationTransactionService,
    private route: Router,
    private governorateService: GovernorateService,
    private cityService: CityService,
    private organizationService: OrganizationService,
    private subOrganizationService: SubOrganizationService,
    private assetDetailService: AssetDetailService,
    private applicationTypeService: ApplicationTypeService,
    private hospitalService: HospitalService, private uploadService: UploadFilesService) { this.currentUser = this.authenticationService.currentUserValue; }

  // ngAfterViewInit() {
  //   this.addHEReasons.forEach(element => {
  //     // var divId = document.getElementById("div_" + element);
  //     // if (element != 0) {

  //     //   divId.style.display = "block";
  //     // }
  //     // else {
  //     //   divId.style.display = "none";
  //     // }
  //   });
  // }
  ngOnInit(): void {

    this.hospitalApplicationObj = {
      hospitalId: 0, comment: '', appDate: '',
      id: 0, assetId: 0, statusId: 0, appTypeId: 0, appNumber: '', dueDate: '',
      exNumber: '', execludeDate: '', userId: '', reasonIds: [], holdReasonIds: []
    }

    this.hospitalApplicationDocument = { fileName: '', hospitalReasonTransactionId: 0, title: '', file: File, hospitalId: 0 };

    let id = this.activeRoute.snapshot.params['id'];
    this.selectedItem = this.activeRoute.snapshot.params['type'];
    this.id = id;

    if (this.currentUser.commetieeMemberId > 0) {

      this.isSupplier = false;
      this.isHospital = true;
      this.showGovCity = false;
      this.showOrgAndSub = false;
      this.showSExeclude = false;
      this.showHospital = false;
      this.showType = true;
      this.isHospitalSaved = true;
      this.isSupplierSaved = false;


      this.applicationTypeService.GetApplicationTypes().subscribe(types => {
        this.lstTypes = types;
      });

      this.hospitalExecludeReasonService.GetHospitalExecludeReasons().subscribe(items => {
        this.lstHospitalExecludeReasons = items;
      });


      this.hospitalHoldeReasonService.GetHospitalHoldReasons().subscribe(items => {
        this.lstHospitalHoldReasons = items;
      });
      this.assetDetailService.GetAllAssets().subscribe(assets => { this.lstAssets = assets });

      this.hospitalApplicationService.GetHospitalApplicationById(id).subscribe(
        data => {
          this.assetDetailService.GetAssetHospitalId(data["assetId"]).subscribe(hostId => {
            this.hospitalApplicationObj.hospitalId = hostId;
          });


          this.selectedAppType = data["appTypeId"];
          this.hospitalApplicationObj.assetId = data["assetId"];
          this.hospitalApplicationObj.appNumber = data["appNumber"];

          this.hospitalApplicationObj.reasonIds = data["reasonIds"];
          this.hospitalApplicationObj.holdReasonIds = data["holdReasonIds"];


          this.hospitalApplicationTransactionService.GetAttachmentsByApplicationId(id).subscribe(items => {
            this.lstTransactions = items;
          });

          if (data["appTypeId"] == 1) {
            this.showHExeclude = true;
            this.showHHold = false;
            this.hospitalApplicationObj.reasonIds.forEach(element => {
              this.addHEReasons.push(element);
            });

          }
          if (data["appTypeId"] == 2) {

            this.showHHold = true;
            this.showHExeclude = false;

            this.hospitalApplicationObj.holdReasonIds.forEach(element => {
              this.addHHReasons.push(element);
            });
          }
        });



    }
    this.showGovCity = false;
    this.showOrgAndSub = false;
    this.showSExeclude = false;
    this.showHospital = false;
    this.showType = true;
    this.isHospitalSaved = true;
    this.isSupplierSaved = false;
    this.hospitalApplicationObj.hospitalId = this.currentUser.hospitalId;

    this.assetDetailService.GetListOfAssetDetailsByHospitalId(this.currentUser.hospitalId).subscribe(assets => {
      this.lstAssets = assets;
    });
    this.applicationTypeService.GetApplicationTypes().subscribe(types => {
      this.lstTypes = types;
    });
    this.hospitalExecludeReasonService.GetHospitalExecludeReasons().subscribe(items => {
      this.lstHospitalExecludeReasons = items;
    });
    this.hospitalHoldeReasonService.GetHospitalHoldReasons().subscribe(items => {
      this.lstHospitalHoldReasons = items;
    });
    this.hospitalApplicationService.GetHospitalApplicationById(id).subscribe(
      data => {
        this.selectedAppType = data["appTypeId"];
        this.hospitalApplicationObj.assetId = data["assetId"];
        this.hospitalApplicationObj.appNumber = data["appNumber"];
        this.hospitalApplicationObj.reasonIds = data["reasonIds"];
        this.hospitalApplicationObj.holdReasonIds = data["holdReasonIds"];
        this.hospitalApplicationTransactionService.GetAttachmentsByApplicationId(id).subscribe(items => {
          this.lstTransactions = items;
        });
        this.assetDetailService.GetHospitalAssetById(data["assetId"]).subscribe(assetObj => {
          this.assetBarCodeObj = assetObj;
          this.assetBarCodeObj.name = assetObj["barcode"];
        });
        if (data["appTypeId"] == 1) {
          this.showHExeclude = true;
          this.showHHold = false;
          this.hospitalApplicationObj.reasonIds.forEach(element => {
            this.addHEReasons.push(element);

            var divId = document.getElementById("myfile_" + element.toString());
            // if (element == divId) {
            //   this.isShown = true;
            // }
            // else {
            //   this.isShown = false;
            // }
          });
        }
        if (data["appTypeId"] == 2) {
          this.showHHold = true;
          this.showHExeclude = false;
          this.hospitalApplicationObj.holdReasonIds.forEach(element => {
            this.addHHReasons.push(element);
          });
        }
      });
  }


  onTypeChange($event) {
    let typeId = $event.value;
    this.selectedAppType = typeId;
    if (this.selectedAppType == 1) {
      this.showHExeclude = true;
      this.showHHold = false;
      this.hospitalExecludeReasonService.GetHospitalExecludeReasons().subscribe(items => {
        this.lstHospitalExecludeReasons = items;
      });
    }
    if (this.selectedAppType == 2) {
      this.showHHold = true;
      this.showHExeclude = false;
      this.hospitalHoldeReasonService.GetHospitalHoldReasons().subscribe(items => {
        this.lstHospitalHoldReasons = items;
      });
    }
  }
  onLoad() {


    this.governorateService.GetGovernorates().subscribe(lstGovs => {
      this.lstGovernorates = lstGovs;
    });

    this.organizationService.GetOrganizations().subscribe(lstOrgs => {
      this.lstOrganizations = lstOrgs;
    });
  }


  toggleHEReasons(elementId) {

    return (this.hospitalApplicationObj.reasonIds.indexOf(elementId) != -1) ? true : false;
  }
  toggleHHReasons(elementId) {
    return (this.hospitalApplicationObj.holdReasonIds.indexOf(elementId) != -1) ? true : false;
  }

  downloadHFile(fileName) {
    var filePath = `${environment.Domain}UploadedAttachments/`;

    this.uploadService.downloadHospitalApplicationFile(fileName).subscribe(file => {
      var dwnldFile = filePath + 'HospitalApplications/' + fileName;
      if (fileName != "" || fileName != null)
        window.open(dwnldFile);
    })
  }

  selectedHEReasons($event, reasonId: number) {
    if ($event.checked) {
      this.addHEReasons.push($event.source.value);
      if (this.visibleId !== reasonId) {
        this.visibleId = reasonId;
      }
      this.show();
    }
    else {
      var index = this.addHEReasons.indexOf($event.source.value);
      this.addHEReasons.splice(index, 1);

      var div, i, id;
      for (i = 0; i < this.lstHospitalExecludeReasons.length; i++) {
        id = this.lstHospitalExecludeReasons[i].id;
        div = document.getElementById(id);
        if ($event.source.value === id) {
          div.style.display = "none";
        }
      }
    }
  }
  selectedHHReasons($event, reasonId: number) {
    if ($event.checked) {
      this.addHHReasons.push($event.source.value);
      if (this.visibleId !== reasonId) {
        this.visibleId = reasonId;
      }
      this.show();
    }
    else {
      var index = this.addHHReasons.indexOf($event.source.value);
      this.addHHReasons.splice(index, 1);

      var div, i, id;
      for (i = 0; i < this.lstHospitalExecludeReasons.length; i++) {
        id = this.lstHospitalExecludeReasons[i].id;
        div = document.getElementById(id);
        if ($event.source.value === id) {
          div.style.display = "none";
        }
      }
    }
  }

  show() {
    var div, i, id;
    for (i = 0; i < this.lstHospitalExecludeReasons.length; i++) {
      id = this.lstHospitalExecludeReasons[i].id;
      div = document.getElementById(id);
      if (this.visibleId === id) {
        div.style.display = "block";
      }
    }
  }
  getSubOrgByOrgId($event) {
    this.subOrganizationService.GetSubOrganizationByOrgId($event.target.value).subscribe(suborgs => {
      this.lstSubOrganizations = suborgs;
    });
  }
  getCitiesByGovId($event) {
    this.cityService.GetCitiesByGovernorateId($event.target.value).subscribe(cities => {
      this.lstCities = cities;
    });
  }
  getHospitalsBySubOrgId($event) {
    this.hospitalService.GetHospitalsBySubOrganizationId($event.target.value).subscribe(hospitals => {
      this.lstHospitals = hospitals;
    });
  }
  getAssetsofHospital($event) {
    this.assetDetailService.GetListOfAssetDetailsByHospitalId($event.target.value).subscribe(assets => {
      this.lstAssets = assets;
    });
  }

  onSubmit() {

    this.hospitalApplicationObj.id = this.id;
    this.hospitalApplicationObj.userId = this.currentUser.id;
    // this.hospitalApplicationObj.assetId = this.supplierExecludeAssetObj.assetId;
    // this.hospitalApplicationObj.appNumber = this.supplierExecludeAssetObj.exNumber;
    // this.hospitalApplicationObj.dueDate = this.supplierExecludeAssetObj.execludeDate;
    this.hospitalApplicationObj.appTypeId = this.selectedAppType;



    if (this.hospitalApplicationObj.assetId == 0) {
      if (this.lang == "en") {
        this.errorDisplay = true;
        this.errorMessage = 'Please select asset';
      }
      else {
        this.errorDisplay = true;
        this.errorMessage = 'اختر أصل من الأصول';
      }
    }
    else {

      if (this.selectedAppType == 1)
        this.hospitalApplicationObj.reasonIds = this.addHEReasons;
      if (this.selectedAppType == 2)
        this.hospitalApplicationObj.reasonIds = this.addHHReasons;
      this.hospitalApplicationService.UpdateHospitalApplication(this.hospitalApplicationObj).subscribe(addedId => {
        this.isSaved = true;
        this.display = true;
        let currentUrl = this.route.url;
        this.route.routeReuseStrategy.shouldReuseRoute = () => false;
        this.route.onSameUrlNavigation = 'reload';
        this.route.navigate([currentUrl]);
      });
    }


  }

  public uploadHAFile = (files) => {
    if (files.length === 0) {
      return;
    }
    this.fileToUpload = <File>files[0];
    this.uploadFileName = this.fileToUpload.name;
    this.addHAFileToList();
  }
  addHAFileToList() {
    let hospitalApplicationDocument = new CreateHospitalApplicationAttachmentVM();
    hospitalApplicationDocument.hospitalReasonTransactionId = Number(this.id);
    hospitalApplicationDocument.fileName = this.uploadFileName;
    hospitalApplicationDocument.hospitalId = this.currentUser.hospitalId;
    hospitalApplicationDocument.title = this.hospitalApplicationDocument.title;
    this.lstHospitalApplicationDocuments.push(hospitalApplicationDocument);
    this.hospitalApplicationDocument.title = "";

  }
  saveHAFilesToDB() {


    this.lstHospitalApplicationDocuments.forEach(elemnt => {
      elemnt.hospitalId = this.currentUser.hospitalId;
      this.hospitalApplicationService.CreateHospitalApplicationAttachments(elemnt).subscribe(lstfiles => {
        this.uploadService.uploadHospitalApplicationFiles(this.fileToUpload, this.fileToUpload.name).subscribe(
          (event) => {
            this.savedfilesdisplay = true;
          },
          (err) => {
            this.errorDisplay = true;
            this.errorMessage = 'Could not upload the file: ' + this.fileToUpload.name;
          });
      });
    });
    this.lstHospitalApplicationDocuments = [];


  }
  removeHFileFromObjectArray(doc) {
    const index: number = this.lstHospitalApplicationDocuments.indexOf(doc);
    if (index !== -1) {
      this.lstHospitalApplicationDocuments.splice(index, 1);
    }
  }


  myUploader(event, reasonId: number) {
    event.files.forEach(element => {
      let obj = new ExcludFile();
      obj.reasonId = reasonId;
      obj.file = event;
      this.lstExcludFile.push(obj);
    });
  }

  getBarCode(event) {
    this.hospitalApplicationObj.assetId = event["id"];
  }
  onSelectionChanged(event) {
    this.assetDetailService.AutoCompleteAssetBarCode(event.query, this.currentUser.hospitalId).subscribe(assets => {
      this.lstassetDetailBarcodes = assets;
      if (this.lang == "en") {
        this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
      }
      else {
        this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
      }
    });
  }

}
