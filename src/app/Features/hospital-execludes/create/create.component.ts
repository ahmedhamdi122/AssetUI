import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FileUpload } from 'primeng/fileupload';
import { ListApplicationTypeVM } from 'src/app/Shared/Models/applicationtype';
import { AssetDetailVM, ViewAssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { HospitalApplicationTransactionVM } from 'src/app/Shared/Models/hospitalApplicationTransactionVM';
import { CreateHospitalApplicationAttachmentVM, CreateHospitalApplicationVM, HospitalApplicationAttachmentVM } from 'src/app/Shared/Models/HospitalApplicationVM';
import { ListHospitalExecludeReasonVM } from 'src/app/Shared/Models/hospitalExecludeReasonVM';
import { ListHospitalHoldReasonVM } from 'src/app/Shared/Models/hospitalHoldReasonVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { ListMasterAssetVM } from 'src/app/Shared/Models/masterAssetVM';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { ApplicationTypeService } from 'src/app/Shared/Services/applicationtype.service';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { CityService } from 'src/app/Shared/Services/city.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { HospitalApplicationService } from 'src/app/Shared/Services/hospitalapplication.service';
import { HospitalApplicationTransactionService } from 'src/app/Shared/Services/hospitalapplicationtransaction.service';
import { HospitalExecludeReasonService } from 'src/app/Shared/Services/hospitalexecludereason.service';
import { HospitalHoldReasonService } from 'src/app/Shared/Services/hospitalholdreason.service';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  currentUser: LoggedUser;
  hospitalApplicationObj: CreateHospitalApplicationVM;
  lstHospitalExecludeReasons: ListHospitalExecludeReasonVM[] = [];
  lstHospitalHoldReasons: ListHospitalHoldReasonVM[] = [];
  lstGovernorates: ListGovernorateVM[];
  lstCities: ListCityVM[];
  lstOrganizations: ListOrganizationVM[];
  lstSubOrganizations: ListSubOrganizationVM[];
  lstHospitals: ListHospitalVM[] = [];
  lstAssets: ViewAssetDetailVM[] = [];


  lstTypes: ListApplicationTypeVM[] = [];
  addReasons: number[] = [];
  addHEReasons: number[] = [];
  addHHReasons: number[] = [];

  hospitalApplicationDocument: CreateHospitalApplicationAttachmentVM;
  lstHospitalApplicationDocuments: CreateHospitalApplicationAttachmentVM[] = [];

  lstHospitalDocuments: HospitalApplicationAttachmentVM[] = [];

  selectedAppType: number = 1;

  showHExeclude: boolean = false;
  showHHold: boolean = false;
  isHospitalSaved: boolean = false;
  hospitalApplicationId: number;
  fileToUpload: File;
  excludeFileToUpload: File;
  uploadFileName: string;
  excludeUploadFileName: string;

  errorMessage: string;
  errorDisplay: boolean = false;
  savedfilesdisplay: boolean = false;
  display: boolean = false;
  selectedAssetId: number = 0;

  uploadControlName: FileUpload;
  lstExcludFile: ExcludFile[] = [];
  isShown: boolean = true;
  visibleId: number = 0;
  assetBarCodeObj: AssetDetailVM;
  lstassetDetailBarcodes: AssetDetailVM[] = [];
  lstassetDetails: AssetDetailVM[] = [];
  hospitalId: number = 0;
  transExcludeId: number;
  isFound: boolean = false;

  applicationStatus: string = "";
  isDisabled: boolean = false;
  assetStatusId: number = 0;

  isGov: boolean = false;
  isCity: boolean = false;
  isOrg: boolean = false;
  isSubOrg: boolean = false;
  isHospital: boolean = false;
  lstMasterAssets: ListMasterAssetVM[] = [];
  departmentName: string = "";

  constructor(private authenticationService: AuthenticationService, private hospitalExecludeReasonService: HospitalExecludeReasonService,
    private hospitalHoldeReasonService: HospitalHoldReasonService, private masterAssetService: MasterAssetService, private hospitalApplicationTransactionService: HospitalApplicationTransactionService,
    private hospitalApplicationService: HospitalApplicationService, private governorateService: GovernorateService, private cityService: CityService, private organizationService: OrganizationService,
    private subOrganizationService: SubOrganizationService, private assetDetailService: AssetDetailService, private applicationTypeService: ApplicationTypeService,
    private hospitalService: HospitalService, private uploadService: UploadFilesService, private route: Router, private ref: DynamicDialogRef) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.onLoad();

    this.hospitalApplicationObj = { masterAssetId: 0, id: 0, assetId: 0, statusId: 0, appTypeId: 0, appNumber: '', dueDate: '', userId: '', reasonIds: [], comment: '', hospitalId: 0, governorateId: 0, cityId: 0, organizationId: 0, subOrganizationId: 0 }

    this.governorateService.GetGovernorates().subscribe(items => {
      this.lstGovernorates = items;
    });

    this.applicationTypeService.GetApplicationTypes().subscribe(types => {
      this.lstTypes = types;
    });

    this.lstMasterAssets = [];
    this.masterAssetService.GetMasterAssets().subscribe(res => { this.lstMasterAssets = res });


    this.onLoadByLogIn();

  }
  onLoad() {

    this.hospitalApplicationDocument = { fileName: '', hospitalReasonTransactionId: 0, title: '', file: File, hospitalId: 0 };
    this.governorateService.GetGovernorates().subscribe(items => {
      this.lstGovernorates = items;
    });
    this.organizationService.GetOrganizations().subscribe(items => {
      this.lstOrganizations = items;
    });
    this.selectedAppType = 1;
    this.showHExeclude = true;
    this.showHHold = false;
    this.hospitalExecludeReasonService.GetHospitalExecludeReasons().subscribe(items => {
      this.lstHospitalExecludeReasons = items;
    });
    this.hospitalApplicationService.GenerateHospitalApplicationNumber().subscribe(hospitalApp => {
      this.hospitalApplicationObj.appNumber = hospitalApp["appNumber"];
    });


    this.hospitalService.GetHospitals().subscribe(hospitals => {
      this.lstHospitals = hospitals;
    });
  }


  onLoadByLogIn() {
    if (this.currentUser.hospitalId > 0 && this.currentUser.organizationId > 0 && this.currentUser.subOrganizationId > 0) {
      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
        if (this.currentUser.organizationId > 0) {
          this.hospitalApplicationObj.organizationId = this.currentUser.organizationId;
          this.isOrg = true;
          this.subOrganizationService.GetSubOrganizationByOrgId(this.currentUser.organizationId).subscribe(suborgs => {
            this.lstSubOrganizations = suborgs;

            if (this.currentUser.subOrganizationId > 0) {
              this.hospitalApplicationObj.subOrganizationId = this.currentUser.subOrganizationId;
              this.isSubOrg = true;

              this.hospitalService.GetHospitalsBySubOrganizationId(this.currentUser.organizationId).subscribe(hosts => {
                this.lstHospitals = hosts;
                if (this.currentUser.hospitalId != 0) {
                  this.hospitalApplicationObj.hospitalId = this.currentUser.hospitalId;
                  this.isHospital = true;
                }
              });
            }
          });
        }
      });
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
      });
      this.hospitalService.GetHospitalById(this.currentUser.hospitalId).subscribe(hospitalObj => {
        this.hospitalApplicationObj.governorateId = hospitalObj.governorateId;
        this.isGov = true;
        this.cityService.GetCitiesByGovernorateId(this.hospitalApplicationObj.governorateId).subscribe((cities) => {
          this.lstCities = cities;
        });
        this.hospitalApplicationObj.cityId = hospitalObj.cityId;
        this.isCity = true;
      });
    }
    else if (this.currentUser.hospitalId > 0 && this.currentUser.governorateId > 0 && this.currentUser.cityId > 0) {
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
        if (this.currentUser.governorateId > 0) {
          this.hospitalApplicationObj.governorateId = this.currentUser.governorateId;
          this.isGov = true;
          this.cityService.GetCitiesByGovernorateId(this.currentUser.governorateId).subscribe(cities => {
            this.lstCities = cities;

            if (this.currentUser.cityId > 0) {
              this.hospitalApplicationObj.cityId = this.currentUser.cityId;
              this.isCity = true;

              this.hospitalService.GetHospitalsByCityId(this.currentUser.cityId).subscribe(hosts => {
                this.lstHospitals = hosts;
                if (this.currentUser.hospitalId != 0) {
                  this.hospitalApplicationObj.hospitalId = this.currentUser.hospitalId;
                  this.isHospital = true;
                }
              });
            }
          });
        }
      });
      this.hospitalService.GetHospitalById(this.currentUser.hospitalId).subscribe(hospitalObj => {
        this.hospitalApplicationObj.organizationId = hospitalObj.organizationId;
        this.isOrg = true;
        this.subOrganizationService.GetSubOrganizationByOrgId(this.hospitalApplicationObj.organizationId).subscribe((subs) => {
          this.lstSubOrganizations = subs;
        });
        this.hospitalApplicationObj.subOrganizationId = hospitalObj.subOrganizationId;
        this.isSubOrg = true;
      });
    }
    else if (this.currentUser.governorateId > 0 && this.currentUser.cityId == 0 && this.currentUser.hospitalId == 0) {
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
        if (this.currentUser.governorateId > 0) {
          this.hospitalApplicationObj.governorateId = this.currentUser.governorateId;
          this.isGov = true;
          this.cityService.GetCitiesByGovernorateId(this.currentUser.governorateId).subscribe(cities => {
            this.lstCities = cities;
          });
        }
      });
      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
      });
    }
    else if (this.currentUser.governorateId > 0 && this.currentUser.cityId > 0 && this.currentUser.hospitalId == 0) {
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
        if (this.currentUser.governorateId > 0) {
          this.hospitalApplicationObj.governorateId = this.currentUser.governorateId;
          this.isGov = true;
          this.cityService.GetCitiesByGovernorateId(this.currentUser.governorateId).subscribe(cities => {
            this.lstCities = cities;
            this.hospitalApplicationObj.cityId = this.currentUser.cityId;
            this.isCity = true;
          });
        }
      });
      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
      });
    }
    else if (this.currentUser.hospitalId == 0 && this.currentUser.organizationId > 0 && this.currentUser.subOrganizationId == 0) {
      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
        if (this.currentUser.organizationId > 0) {
          this.hospitalApplicationObj.organizationId = this.currentUser.organizationId;
          this.isOrg = true;
          this.subOrganizationService.GetSubOrganizationByOrgId(this.currentUser.organizationId).subscribe(suborgs => {
            this.lstSubOrganizations = suborgs;

            if (this.currentUser.subOrganizationId > 0) {
              this.hospitalApplicationObj.subOrganizationId = this.currentUser.subOrganizationId;
            }
          });
        }
      });
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
      });
    }
    else if (this.currentUser.hospitalId == 0 && this.currentUser.organizationId > 0 && this.currentUser.subOrganizationId > 0) {

      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
        if (this.currentUser.organizationId > 0) {
          this.hospitalApplicationObj.organizationId = this.currentUser.organizationId;
          this.isOrg = true;
          this.subOrganizationService.GetSubOrganizationByOrgId(this.currentUser.organizationId).subscribe(suborgs => {
            this.lstSubOrganizations = suborgs;

            if (this.currentUser.subOrganizationId > 0) {
              this.hospitalApplicationObj.subOrganizationId = this.currentUser.subOrganizationId;
              this.isSubOrg = true;

              this.hospitalService.GetHospitalsBySubOrganizationId(this.currentUser.subOrganizationId).subscribe(hosts => {
                this.lstHospitals = hosts;
                this.hospitalApplicationObj.hospitalId = this.currentUser.hospitalId;
              });
            }
          });
        }
      });

      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
      });

    }
    else if (this.currentUser.hospitalId == 0 && this.currentUser.organizationId == 0 && this.currentUser.subOrganizationId == 0 && this.currentUser.governorateId == 0 && this.currentUser.cityId == 0) {
      this.organizationService.GetOrganizations().subscribe(items => {
        this.lstOrganizations = items;
      });
      this.governorateService.GetGovernorates().subscribe(items => {
        this.lstGovernorates = items;
      });

    }
  }
  selectedHEReasons($event, reasonId: number, itm: ListHospitalExecludeReasonVM) {
    if ($event.checked) {
      {
        this.addHEReasons.push($event.source.value);
        if (this.visibleId !== reasonId) {
          this.visibleId = reasonId;
        }
        this.show();
      }
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
  show() {
    var div, i, id;
    if (this.selectedAppType == 1) {
      for (i = 0; i < this.lstHospitalExecludeReasons.length; i++) {
        id = this.lstHospitalExecludeReasons[i].id;
        div = document.getElementById(id);
        if (this.visibleId === id) {
          div.style.display = "block";
        }

      }
    }
    if (this.selectedAppType == 2) {
      for (i = 0; i < this.lstHospitalHoldReasons.length; i++) {
        id = this.lstHospitalHoldReasons[i].id;
        div = document.getElementById(id);
        if (this.visibleId === id) {
          div.style.display = "block";
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
      for (i = 0; i < this.lstHospitalHoldReasons.length; i++) {
        id = this.lstHospitalHoldReasons[i].id;
        div = document.getElementById(id);
        if ($event.source.value === id) {
          div.style.display = "none";
        }
      }
    }
  }
  getHospitalsByCityId($event) {
    this.hospitalService.getHosByCityId($event.target.value).subscribe(hospitals => {
      this.lstHospitals = hospitals;
    });
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
    this.hospitalId = $event.target.value;
    this.assetDetailService.GetListOfAssetDetailsByHospitalId($event.target.value).subscribe(assets => {
      this.lstAssets = assets;
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
  onSubmit() {
    const itmIndex = [];
    if (this.hospitalApplicationObj.appNumber == '') {
      if (this.lang == "en") {
        this.errorDisplay = true;
        this.errorMessage = 'Please add application number';
      }
      else {
        this.errorDisplay = true;
        this.errorMessage = 'من فضلك أضف رقم الاستبعاد أو الإيقاف';
      }
      return false;
    }
    if (this.hospitalApplicationObj.assetId == 0) {
      if (this.lang == "en") {
        this.errorDisplay = true;
        this.errorMessage = 'Please select asset';
      }
      else {
        this.errorDisplay = true;
        this.errorMessage = 'من فضلك اختر أصل';
      }
      return false;
    }
    if (this.selectedAppType == 1) {
      if (this.addHEReasons.length == 0) {
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
      else {
        this.hospitalApplicationObj.reasonIds = this.addHEReasons;
        this.hospitalApplicationObj.userId = this.currentUser.id;
        this.hospitalApplicationObj.appTypeId = this.selectedAppType;
        this.hospitalApplicationObj.hospitalId = this.currentUser.hospitalId;

        this.hospitalApplicationService.CreateHospitalApplication(this.hospitalApplicationObj).subscribe(addedId => {
          this.hospitalApplicationId = addedId;

          this.hospitalApplicationObj.reasonIds.forEach(element => {
            var transObj = new HospitalApplicationTransactionVM();
            transObj.reasonId = element;
            transObj.hospitalApplicationId = this.hospitalApplicationId;
            transObj.hospitalId = this.currentUser.hospitalId;

            this.hospitalApplicationTransactionService.CreateHospitalTransaction(transObj).subscribe(transId => {
              this.transExcludeId = transId;

              const grouped = this.groupBy(this.lstExcludFile, fl => fl.reasonId);

              let groupFiles = grouped.get(element);
              if (groupFiles == null || groupFiles == undefined) {
                if (this.lang == "en") {
                  this.hospitalExecludeReasonService.GetHospitalExecludeReasonById(element).subscribe(elem => {
                    this.errorDisplay = true;
                    this.errorMessage = 'Please select at least one file for reason ' + elem.name;
                    this.isFound = true;
                    this.display = false;
                  });
                }
                else {
                  this.hospitalExecludeReasonService.GetHospitalExecludeReasonById(element).subscribe(elem => {
                    this.errorDisplay = true;
                    this.errorMessage = 'من فضلك اختر أحد الملفات ' + elem.nameAr;
                    this.isFound = true;
                    this.display = false;
                  });
                }
                this.hospitalApplicationService.DeleteHospitalApplication(this.hospitalApplicationId).subscribe(item => { });
              }
              else if (groupFiles !== null || groupFiles !== undefined) {

                groupFiles.forEach((fileobj, index) => {
                  if (index == 0 && itmIndex.length === 0) {
                    last_element = 1;
                  }
                  else if (index == 0 && itmIndex.length > 0) {
                    var last_element = itmIndex[itmIndex.length - 1];
                    last_element = last_element + 1;
                  }
                  else if (index != 0 && itmIndex.length > 0) {
                    var last_element = itmIndex[itmIndex.length - 1];
                    last_element = last_element + 1;
                  }
                  itmIndex.push(last_element);



                  if (fileobj.reasonId == element) {
                    this.isFound = true;
                    let hospitalApplicationDocument = new CreateHospitalApplicationAttachmentVM();
                    hospitalApplicationDocument.hospitalReasonTransactionId = Number(transId);
                    hospitalApplicationDocument.hospitalId = this.currentUser.hospitalId;
                    let ext = fileobj.file.files[index].name.split('.').pop();
                    var hCode = this.pad(this.currentUser.hospitalCode, 4);
                    var appNum = this.pad(this.hospitalApplicationObj.appNumber, 10);
                    var last = itmIndex[itmIndex.length - 1];
                    let newIndex = this.pad((last).toString(), 2);
                    let EXHospitalFileName = hCode + "EH" + appNum + newIndex;
                    hospitalApplicationDocument.fileName = EXHospitalFileName + "." + ext;

                    this.hospitalApplicationService.CreateHospitalApplicationAttachments(hospitalApplicationDocument).subscribe(lstfiles => {
                      this.uploadService.uploadHospitalApplicationFiles(fileobj.file.files[index], hospitalApplicationDocument.fileName).subscribe(
                        (event) => {
                          this.isDisabled = true;
                        },
                        (err) => {

                          if (this.lang == "en") {
                            this.errorDisplay = true;
                            this.errorMessage = 'Could not upload the file:' + fileobj.file.files[index].name;
                          }
                          else {
                            this.errorDisplay = true;
                            this.errorMessage = 'لا يمكن رفع ملف ' + fileobj.file.files[index].name;
                          }
                        });
                    });
                  }
                });

                this.display = true;
              }
              this.hospitalApplicationService.SendHospitalExcludeEmail(Number(transId)).subscribe(done => {
              });
            });
          });
        });
        this.display = false;
      }
    }
    if (this.selectedAppType == 2) {
      if (this.addHHReasons.length == 0) {
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
      else {
        this.hospitalApplicationObj.reasonIds = this.addHHReasons;
        this.hospitalApplicationObj.userId = this.currentUser.id;
        this.hospitalApplicationObj.appTypeId = this.selectedAppType;
        this.hospitalApplicationObj.hospitalId = this.currentUser.hospitalId;
        this.hospitalApplicationService.CreateHospitalApplication(this.hospitalApplicationObj).subscribe(addedId => {
          this.hospitalApplicationId = addedId;
          const grouped = this.groupBy(this.lstExcludFile, fl => fl.reasonId);

          this.hospitalApplicationObj.reasonIds.forEach(element => {
            var transObj = new HospitalApplicationTransactionVM();
            transObj.reasonId = element;
            transObj.hospitalApplicationId = this.hospitalApplicationId;
            this.hospitalApplicationTransactionService.CreateHospitalTransaction(transObj).subscribe(transId => {
              this.transExcludeId = transId;
              let groupFiles = grouped.get(element);
              if (groupFiles === null || groupFiles === undefined) {
                if (this.lang == "en") {
                  this.hospitalHoldeReasonService.GetHospitalHoldReasonById(element).subscribe(elem => {
                    this.errorDisplay = true;
                    this.errorMessage = 'Please select at least one file for reason ' + elem.name;
                    this.isFound = true;
                    this.display = false;
                  });
                }
                else {
                  this.hospitalHoldeReasonService.GetHospitalHoldReasonById(element).subscribe(elem => {
                    this.errorDisplay = true;
                    this.errorMessage = 'من فضلك اختر أحد الملفات ' + elem.nameAr;
                    this.isFound = true;
                    this.display = false;
                  });

                }
                this.hospitalApplicationService.DeleteHospitalApplication(this.hospitalApplicationId).subscribe(item => { });
              }
              else if (groupFiles !== null || groupFiles !== undefined) {
                groupFiles.forEach((fileobj, index) => {


                  if (index == 0 && itmIndex.length === 0) {
                    last_element = 1;
                  }
                  else if (index == 0 && itmIndex.length > 0) {
                    var last_element = itmIndex[itmIndex.length - 1];
                    last_element = last_element + 1;
                  }
                  else if (index != 0 && itmIndex.length > 0) {
                    var last_element = itmIndex[itmIndex.length - 1];
                    last_element = last_element + 1;
                  }
                  itmIndex.push(last_element);

                  if (fileobj.reasonId == element) {
                    this.isFound = true;
                    let hospitalApplicationDocument = new CreateHospitalApplicationAttachmentVM();
                    hospitalApplicationDocument.hospitalReasonTransactionId = Number(transId);
                    hospitalApplicationDocument.hospitalId = this.currentUser.hospitalId;
                    let ext = fileobj.file.files[index].name.split('.').pop();
                    var hCode = this.pad(this.currentUser.hospitalCode, 4);
                    var appNum = this.pad(this.hospitalApplicationObj.appNumber, 10);
                    var last = itmIndex[itmIndex.length - 1];
                    let newIndex = this.pad((last).toString(), 2);
                    let EXHospitalFileName = hCode + "HH" + appNum + newIndex;
                    hospitalApplicationDocument.fileName = EXHospitalFileName + "." + ext;
                    this.hospitalApplicationService.CreateHospitalApplicationAttachments(hospitalApplicationDocument).subscribe(lstfiles => {
                      this.uploadService.uploadHospitalApplicationFiles(fileobj.file.files[index], hospitalApplicationDocument.fileName).subscribe(
                        (event) => {
                          this.isDisabled = true;
                        },
                        (err) => {
                          if (this.lang == "en") {
                            this.errorDisplay = true;
                            this.errorMessage = 'Could not upload the file:' + fileobj.file.files[index].name;
                          }
                          else {
                            this.errorDisplay = true;
                            this.errorMessage = 'لا يمكن رفع ملف' + fileobj.file.files[index].name;
                          }
                        });
                    });
                  }
                });
                this.display = true;
              }
              this.hospitalApplicationService.SendHospitalExcludeEmail(Number(transId)).subscribe(done => {

                // var statusObj = new AssetStatusTransactionVM();
                // statusObj.assetDetailId =   this.hospitalApplicationObj.assetId;
                // statusObj.hospitalId = this.currentUser.hospitalId;
                // statusObj.assetStatusId = 4;
                // this.assetStatusTransactionService.AddAssetStatusTransaction(statusObj).subscribe(addedStatus => {
                // });

              });
            });
          });
        });
        this.display = false;
      }
    }
  }


  downloadFile(fileName) {
    var filePath = `${environment.Domain}UploadedAttachments/`;
    this.uploadService.downloadHospitalApplicationFile(fileName).subscribe(file => {
      var dwnldFile = filePath + 'HospitalApplications/' + fileName;
      if (fileName != "" || fileName != null)
        window.open(dwnldFile);
    });
  }
  myUploader(event, reasonId: number) {

    event.files.forEach(element => {
      let obj = new ExcludFile();
      obj.reasonId = reasonId;
      obj.file = event;
      this.lstExcludFile.push(obj);
    });
  }

  groupBy(list, keyGetter) {
    const map = new Map();
    list.forEach((item) => {
      const key = keyGetter(item);
      const collection = map.get(key);
      if (!collection) {
        map.set(key, [item]);
      } else {
        collection.push(item);
      }
    });
    return map;
  }

  pad(num: string, size: number): string {
    while (num.length < size) num = "0" + num;
    return num;
  }

  getBarCode(event) {
    this.assetBarCodeObj.barCode = event["barCode"];
    this.isDisabled = false;
    this.assetDetailService.GetAssetNameByMasterAssetIdAndHospitalId(Number(event["masterAssetId"]), this.currentUser.hospitalId).subscribe(
      res => {
        this.lstassetDetails = res;
        this.hospitalApplicationObj.assetId = event["id"];
        this.hospitalApplicationObj.masterAssetId = event["masterAssetId"];
        this.departmentName = this.lang == 'en' ? event["departmentName"] : event["departmentNameAr"];



        this.assetDetailService.GetHospitalAssetById(this.hospitalApplicationObj.assetId).subscribe(assetObj => {
          this.assetBarCodeObj = assetObj;

          this.applicationStatus = this.lang == "en" ? this.assetBarCodeObj["assetStatus"] : this.assetBarCodeObj["assetStatusAr"];
          this.assetBarCodeObj.name = assetObj["barcode"];
          this.assetStatusId = this.assetBarCodeObj["assetStatusId"];

          var isWorking = this.findAssetStatusByStatusId(this.assetStatusId);
          if (isWorking == false) {
            return false;
          }
          else {
            this.isDisabled = false;
          }
        });
      });


  }
  onSelectionChanged(event) {
    if (this.currentUser.hospitalId != 0) {
      this.assetDetailService.AutoCompleteAssetBarCode(event.query, this.currentUser.hospitalId).subscribe(assets => {
        this.lstassetDetailBarcodes = assets;
        this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
      });
    }
    else {
      this.assetDetailService.AutoCompleteAssetBarCode(event.query, this.hospitalId).subscribe(assets => {
        this.lstassetDetailBarcodes = assets;
        this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
      });
    }
  }
  GetAssetSerialBySelectedAsset($event) {
    this.assetDetailService.GetHospitalAssetById($event.target.value).subscribe(assetObj => {
      this.assetBarCodeObj = assetObj;
      this.assetBarCodeObj.name = assetObj["barcode"];
    });

  }

  closeDialogue() {
    this.ref.close();
  }

  findAssetStatusByStatusId(assetStatusId: number): boolean {
    switch (assetStatusId) {
      case 1:
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it Needs Repair";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه يحتاج لإصلاح ";
        }
        this.isDisabled = true;
        break;
      case 2:
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Scrap";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه مكهن ";
        }
        this.isDisabled = true;
        break;
      case 4:
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Under Maintenance";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه تحت الصيانة";
        }
        this.isDisabled = true;
        break;
      case 5:
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Under Installation";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه  تحت الإنشاء";
        }
        this.isDisabled = true;
        break;
      case 6:
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is not working ";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه لا يعمل ";
        }
        this.isDisabled = true;
        break;
      case 7:
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Shut Down";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه متوقف ";
        }
        this.isDisabled = true;
        break;
      case 8:
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Excluded";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه مستبعد ";
        }
        this.isDisabled = true;
        break;
      case 9:
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Hold";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه في حالة إيقاف مؤقت ";
        }
        this.isDisabled = true;
        break;
    }
    return false;
  }
}


export class ExcludFile {
  reasonId: number;
  file: FileUpload;
}