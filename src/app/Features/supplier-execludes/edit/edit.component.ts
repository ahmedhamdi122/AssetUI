import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateSupplierExecludeAssetAttachmentVM, EditSupplierExecludeAssetVM, SupplierExecludeAssetAttachmentVM } from 'src/app/Shared/Models/supplierExecludeAssetVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { ApplicationTypeService } from 'src/app/Shared/Services/applicationtype.service';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { CityService } from 'src/app/Shared/Services/city.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';
import { SupplierExecludeAssetService } from 'src/app/Shared/Services/supplierexecludeasset.service';
import { SupplierExecludeReasonService } from 'src/app/Shared/Services/supplierexecludereason.service';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { ViewAssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { ListSupplierExecludeReasonVM } from 'src/app/Shared/Models/supplierExecludeReasonVM';
import { ListApplicationTypeVM } from 'src/app/Shared/Models/applicationtype';
import { environment } from 'src/environments/environment';
import { ListSupplierHoldReasonVM } from 'src/app/Shared/Models/SupplierHoldReasonVM';
import { SupplierHoldReasonService } from 'src/app/Shared/Services/supplierholdreason.service';

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
  supplierExecludeAssetObj: EditSupplierExecludeAssetVM;
  //hospitalApplicationObj: EditHospitalApplicationVM;
  lstGovernorates: ListGovernorateVM[];
  lstCities: ListCityVM[];
  lstOrganizations: ListOrganizationVM[];
  lstSubOrganizations: ListSubOrganizationVM[];
  lstHospitals: ListHospitalVM[] = [];
  lstAssets: ViewAssetDetailVM[] = [];
  lstReasons: ListSupplierExecludeReasonVM[] = [];
  lstSupplierHoldReasons: ListSupplierHoldReasonVM[] = [];



  lstTypes: ListApplicationTypeVM[] = [];

  lstSupplierDocuments: SupplierExecludeAssetAttachmentVM[] = [];



  // hospitalApplicationDocument: CreateHospitalApplicationAttachmentVM;
  // lstHospitalApplicationDocuments: CreateHospitalApplicationAttachmentVM[] = [];


  suplierExecludeAssetDocument: CreateSupplierExecludeAssetAttachmentVM;
  lstSuplierExecludeAssetDocuments: CreateSupplierExecludeAssetAttachmentVM[] = [];


  showGovCity: boolean = false;
  showOrgAndSub: boolean = false;
  showType: boolean = false;
  showExclude: boolean = false;
  showHold: boolean = false;
  isSupplierSaved: boolean = false;
  selectedAppType: number = 1;

  addReasons: number[] = [];
  addHoldReasons: number[] = [];



  fileToUpload: File;
  uploadFileName: string;
  errorMessage: string;
  errorDisplay: boolean = false;
  savedfilesdisplay: boolean = false;
  display: boolean = false;
  selectedItem: string = "supplier"
  constructor(private authenticationService: AuthenticationService, private activeRoute: ActivatedRoute,
    private supplierExecludeReasonService: SupplierExecludeReasonService,
    private supplierExecludeAssetService: SupplierExecludeAssetService,
    private supplierHoldReasonService: SupplierHoldReasonService,
    private route: Router,

    private governorateService: GovernorateService,
    private cityService: CityService,
    private organizationService: OrganizationService,
    private subOrganizationService: SubOrganizationService,
    private assetDetailService: AssetDetailService,
    private applicationTypeService: ApplicationTypeService,
    private hospitalService: HospitalService, private uploadService: UploadFilesService) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.supplierExecludeAssetObj = { memberId: '', date: '', assetId: 0, exNumber: '', statusId: 0, userId: '', cityId: 0, execludeDate: '', governorateId: 0, hospitalId: 0, id: 0, organizationId: 0, appTypeId: 0, reasonIds: [], holdReasonIds: [], subOrganizationId: 0, assetName: '', assetNameAr: '', comment: '' }
    this.suplierExecludeAssetDocument = { fileName: '', supplierExecludeId: 0, title: '', file: File, hospitalId: 0 };

    let id = this.activeRoute.snapshot.params['id'];
    this.selectedItem = this.activeRoute.snapshot.params['type'];
    this.id = id;



    if (this.currentUser.supplierId > 0) {
      this.showGovCity = true;
      this.showOrgAndSub = true;
      // this.showExclude = true;
      // this.showType = false;
      // this.showHold = false;
      //   this.isSupplierSaved = true;
      this.onLoad();

      this.supplierExecludeAssetService.GetSupplierExecludeAssetById(id).subscribe(
        data => {
          this.supplierExecludeAssetObj = data;

          this.supplierExecludeAssetObj.exNumber = data["exNumber"];
          this.selectedAppType = data["appTypeId"];
          if (this.selectedAppType == 2) {
            this.showHold = true;
          }
          if (this.selectedAppType == 1) {
            this.showExclude = true;
          }
          this.supplierExecludeAssetObj.reasonIds.forEach(element => {
            this.addReasons.push(element);
          });

          this.supplierExecludeAssetObj.holdReasonIds.forEach(element => {
            this.addHoldReasons.push(element);
          });

          this.assetDetailService.GetAssetById(this.supplierExecludeAssetObj.assetId).subscribe(assetHospital => {

            this.supplierExecludeAssetObj.hospitalId = assetHospital["hospitalId"];

            this.assetDetailService.GetListOfAssetDetailsByHospitalId(this.supplierExecludeAssetObj.hospitalId).subscribe(assets => {
              this.lstAssets = assets;
            })
            this.supplierExecludeAssetObj.assetId = data["assetId"];

            this.hospitalService.GetSubOrganizationsByHospitalId(assetHospital["hospitalId"]).subscribe(items => {
              this.lstSubOrganizations = items;
            });


            this.hospitalService.GetHospitalById(assetHospital["hospitalId"]).subscribe(item => {
              this.supplierExecludeAssetObj.subOrganizationId = item["subOrganizationId"];
              this.hospitalService.GetHospitalsBySubOrganizationId(item["subOrganizationId"]).subscribe(lstHosts => {
                this.lstHospitals = lstHosts;
              });

              this.cityService.GetCitiesByGovernorateId(Number(item["governorateId"])).subscribe(cities => {
                this.lstCities = cities;
              });


              this.supplierExecludeAssetObj.organizationId = item["organizationId"];
              this.supplierExecludeAssetObj.governorateId = item["governorateId"];

              this.supplierExecludeAssetObj.cityId = item["cityId"];
              this.supplierExecludeAssetObj.hospitalId = item["id"];
            });



          });

        });



      this.supplierExecludeAssetService.GetAttachmentBySupplierExecludeAssetId(id).subscribe(docs => {
        this.lstSupplierDocuments = docs;
      });
    }



  }
  onTypeChange($event) {
    let typeId = $event.value;
    this.selectedAppType = typeId;
    if (this.selectedAppType == 1) {
      this.showExclude = true;
      this.showHold = false;
      this.supplierExecludeReasonService.GetSupplierExecludeReasons().subscribe(items => {
        this.lstReasons = items;
      });
    }
    if (this.selectedAppType == 2) {
      this.showHold = true;
      this.showExclude = false;
      this.supplierHoldReasonService.GetSupplierHoldReasons().subscribe(items => {
        this.lstSupplierHoldReasons = items;
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


    this.applicationTypeService.GetApplicationTypes().subscribe(types => {
      this.lstTypes = types;
    });

    this.supplierExecludeReasonService.GetSupplierExecludeReasons().subscribe(items => {
      this.lstReasons = items;
    });

    this.supplierHoldReasonService.GetSupplierHoldReasons().subscribe(items => {
      this.lstSupplierHoldReasons = items;
    });
  }


  toggleExcludeReasons(elementId) {
    return (this.supplierExecludeAssetObj.reasonIds.indexOf(elementId) != -1) ? true : false;
  }
  toggleHoldReasons(elementId) {
    return (this.supplierExecludeAssetObj.holdReasonIds.indexOf(elementId) != -1) ? true : false;
  }
  downloadFile(fileName) {
    var filePath = `${environment.Domain}UploadedAttachments/`;

    this.uploadService.downloadSupplierExecludeAssetFile(fileName).subscribe(file => {
      var dwnldFile = filePath + 'SupplierExecludeAssets/' + fileName;
      if (fileName != "" || fileName != null)
        window.open(dwnldFile);
    })
  }
  downloadHFile(fileName) {
    var filePath = `${environment.Domain}UploadedAttachments/`;

    this.uploadService.downloadHospitalApplicationFile(fileName).subscribe(file => {
      var dwnldFile = filePath + 'HospitalApplications/' + fileName;
      if (fileName != "" || fileName != null)
        window.open(dwnldFile);
    })
  }
  selectedSupplierExcludeReasons($event) {
    if ($event.checked) {
      this.addReasons.push($event.source.value);
    }
    else {
      var index = this.addReasons.indexOf($event.source.value);
      this.addReasons.splice(index, 1);
    }
  }
  selectedSupplierHoldReasons($event) {
    if ($event.checked) {
      this.addHoldReasons.push($event.source.value);
    }
    else {
      var index = this.addHoldReasons.indexOf($event.source.value);
      this.addHoldReasons.splice(index, 1);
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

    if (this.supplierExecludeAssetObj.assetId == 0) {
      if (this.lang == "en") {
        this.errorDisplay = true;
        this.errorMessage = 'Please select asset';
      }
      else {
        this.errorDisplay = true;
        this.errorMessage = 'اختر أصل من الأصول';
      }
      return false;
    }
    if (this.selectedAppType == 1) {
      if (this.addReasons.length == 0) {
        if (this.lang == "en") {
          this.errorDisplay = true;
          this.errorMessage = 'Please select at least one reason';
        }
        else {
          this.errorDisplay = true;
          this.errorMessage = 'من فضلك اختر أحد الأسباب';
        }
        return false;
      }
    }
    if (this.selectedAppType == 2) {
      if (this.addHoldReasons.length == 0) {
        if (this.lang == "en") {
          this.errorDisplay = true;
          this.errorMessage = 'Please select at least one reason';
        }
        else {
          this.errorDisplay = true;
          this.errorMessage = 'من فضلك اختر أحد الأسباب';
        }
        return false;
      }
    }
    else {
      this.supplierExecludeAssetObj.reasonIds = this.addReasons;
      this.supplierExecludeAssetObj.userId = this.currentUser.id;
      this.supplierExecludeAssetObj.exNumber = this.supplierExecludeAssetObj.exNumber;
      this.supplierExecludeAssetObj.appTypeId = this.selectedAppType;

      this.supplierExecludeAssetService.UpdateSupplierExecludeAsset(this.supplierExecludeAssetObj).subscribe(returnedId => {
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
    let supplierDocument = new CreateSupplierExecludeAssetAttachmentVM();
    supplierDocument.supplierExecludeId = Number(this.id);
    supplierDocument.fileName = this.uploadFileName;
    supplierDocument.title = this.suplierExecludeAssetDocument.title;
    supplierDocument.file = this.fileToUpload;
    this.lstSuplierExecludeAssetDocuments.push(supplierDocument);
    this.suplierExecludeAssetDocument.title = "";
  }
  saveFilesToDB() {






    this.lstSuplierExecludeAssetDocuments.forEach(elemnt => {
      this.supplierExecludeAssetService.CreateSupplierExecludeAssetAttachments(elemnt).subscribe(lstfiles => {
        this.uploadService.uploadSupplierExecludeAssetFiles(elemnt.file, elemnt.file.name).subscribe(
          (event) => {
            this.savedfilesdisplay = true;

            this.supplierExecludeAssetService.GetAttachmentBySupplierExecludeAssetId(this.id).subscribe(docs => {
              this.lstSupplierDocuments = docs;
            });
          },
          (err) => {
            this.errorDisplay = true;
            this.errorMessage = 'Could not upload the file: ' + this.fileToUpload.name;
          });
      });
    });
    this.lstSuplierExecludeAssetDocuments = [];
  }


  removeSFileFromObjectArray(doc) {
    const index: number = this.lstSuplierExecludeAssetDocuments.indexOf(doc);
    if (index !== -1) {
      this.lstSuplierExecludeAssetDocuments.splice(index, 1);
    }
  }




}
