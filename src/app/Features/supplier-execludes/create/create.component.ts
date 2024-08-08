import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListApplicationTypeVM } from 'src/app/Shared/Models/applicationtype';
import { AssetDetailVM, ViewAssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { ListCityVM } from 'src/app/Shared/Models/cityVM';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { CreateHospitalApplicationAttachmentVM, CreateHospitalApplicationVM } from 'src/app/Shared/Models/hospitalApplicationVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { ListMasterAssetVM } from 'src/app/Shared/Models/masterAssetVM';
import { ListOrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { CreateSupplierExecludeAssetAttachmentVM, CreateSupplierExecludeAssetVM, SupplierExecludeAssetAttachmentVM } from 'src/app/Shared/Models/supplierExecludeAssetVM';
import { ListSupplierExecludeReasonVM } from 'src/app/Shared/Models/supplierExecludeReasonVM';
import { SupplierExecludeVM } from 'src/app/Shared/Models/supplierExecludeVM';
import { ListSupplierHoldReasonVM } from 'src/app/Shared/Models/supplierHoldReasonVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { ApplicationTypeService } from 'src/app/Shared/Services/applicationtype.service';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { CityService } from 'src/app/Shared/Services/city.service';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';
import { SupplierExecludeService } from 'src/app/Shared/Services/supplierexeclude.service';
import { SupplierExecludeAssetService } from 'src/app/Shared/Services/supplierexecludeasset.service';
import { SupplierExecludeReasonService } from 'src/app/Shared/Services/supplierexecludereason.service';
import { SupplierHoldReasonService } from 'src/app/Shared/Services/supplierholdreason.service';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { ExcludFile } from '../../hospital-execludes/create/create.component';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {

  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  currentUser: LoggedUser;
  supplierExecludeObj: CreateSupplierExecludeAssetVM;
  hospitalApplicationObj: CreateHospitalApplicationVM;
  lstReasons: ListSupplierExecludeReasonVM[] = [];
  lstSupplierHoldReasons: ListSupplierHoldReasonVM[] = [];
  lstExcludFile: ExcludFile[] = [];

  lstGovernorates: ListGovernorateVM[];
  lstCities: ListCityVM[];
  lstOrganizations: ListOrganizationVM[];
  lstSubOrganizations: ListSubOrganizationVM[];
  lstHospitals: ListHospitalVM[] = [];
  lstAssets: ViewAssetDetailVM[] = [];

  lstMasterAssets: ListMasterAssetVM[] = [];

  lstTypes: ListApplicationTypeVM[] = [];
  addReasons: number[] = [];
  addHoldReasons: number[] = [];

  hospitalApplicationDocument: CreateHospitalApplicationAttachmentVM;
  lstHospitalApplicationDocuments: CreateHospitalApplicationAttachmentVM[] = [];


  suplierExecludeAssetDocument: CreateSupplierExecludeAssetAttachmentVM;
  lstSuplierExecludeAssetDocuments: CreateSupplierExecludeAssetAttachmentVM[] = [];
  lstSupplierDocuments: SupplierExecludeAssetAttachmentVM[] = [];

  selectedAppType: number = 1;
  showGovCity: boolean = false;
  showOrgAndSub: boolean = false;
  showHospital: boolean = false;
  showType: boolean = false;
  showExclude: boolean = false;
  showHold: boolean = false;
  supplierExecludeAssetId: number;

  fileToUpload: File;
  uploadFileName: string;
  errorMessage: string;
  errorDisplay: boolean = false;
  isSaved: boolean = false;
  isHospital: boolean = false;
  isSupplier: boolean = false;
  savedfilesdisplay: boolean = false;
  display: boolean = false;
  isFound: boolean = false;
  isDisabled: boolean = false;
  transExcludeId: number;
  visibleId: number = 0;
  isShown: boolean = true;
  savedObj: SupplierExecludeVM;
  hospitalCode: string = "";
  assetBarCodeObj: AssetDetailVM;
  lstassetDetailBarcodes: AssetDetailVM[] = [];

  // lstassetDetailBarcodes: ViewAssetDetailVM[] = [];
  applicationStatus: string = "";
  assetStatusId: number = 0;

  selectedMasterAssetId: number;
  constructor(private authenticationService: AuthenticationService, private supplierExecludeReasonService: SupplierExecludeReasonService,
    private supplierHoldReasonService: SupplierHoldReasonService, private supplierExecludeAssetService: SupplierExecludeAssetService,
    private masterAssetService: MasterAssetService,
    private supplierExecludeService: SupplierExecludeService, private governorateService: GovernorateService, private cityService: CityService,
    private organizationService: OrganizationService, private subOrganizationService: SubOrganizationService, private assetDetailService: AssetDetailService,
    private applicationTypeService: ApplicationTypeService, private route: Router, private hospitalService: HospitalService, private uploadService: UploadFilesService) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.onLoad();
    this.isSaved = false;

    this.showGovCity = true;
    this.showOrgAndSub = true;
    this.showExclude = true;
    this.showHold = false;
    this.isSupplier = true;
    this.supplierExecludeReasonService.GetSupplierExecludeReasons().subscribe(items => {
      this.lstReasons = items;
    });
    this.applicationTypeService.GetApplicationTypes().subscribe(types => {
      this.lstTypes = types;
    });
  }
  onLoad() {
    this.savedObj = { id: 0, reasonId: 0, supplierExecludeAssetId: 0, hospitalId: 0 }
    this.supplierExecludeObj = { masterAssetId: 0, hospitalId: 0, id: 0, assetId: 0, statusId: 0, exNumber: '', execludeDate: '', userId: '', reasonIds: [], appNumber: '', appTypeId: 0, comment: '' }
    this.suplierExecludeAssetDocument = { fileName: '', supplierExecludeId: 0, title: '', file: File, hospitalId: 0 };
    this.governorateService.GetGovernorates().subscribe(items => {
      this.lstGovernorates = items;
    });
    this.organizationService.GetOrganizations().subscribe(items => {
      this.lstOrganizations = items;
    });


    this.selectedAppType = 1;
    this.showExclude = true;
    this.showHold = false;

    this.supplierExecludeAssetService.GenerateSupplierExecludeAssetNumber().subscribe(supplier => {
      this.supplierExecludeObj.exNumber = supplier["exNumber"];
    });

  }
  selectedSupplierExcludeReasons($event, reasonId: number) {
    if ($event.checked) {
      this.addReasons.push($event.source.value);
      if (this.visibleId !== reasonId) {
        this.visibleId = reasonId;
      }
      this.show();
    }
    else {
      var index = this.addReasons.indexOf($event.source.value);
      this.addReasons.splice(index, 1);

      var div, i, id;
      for (i = 0; i < this.lstReasons.length; i++) {
        id = this.lstReasons[i].id;
        div = document.getElementById(id);
        if ($event.source.value === id) {
          div.style.display = "none";
        }
      }
    }
  }
  selectedSupplierHoldReasons($event, reasonId: number) {
    if ($event.checked) {
      this.addHoldReasons.push($event.source.value);
      if (this.visibleId !== reasonId) {
        this.visibleId = reasonId;
      }
      this.show();
    }
    else {
      var index = this.addHoldReasons.indexOf($event.source.value);
      this.addHoldReasons.splice(index, 1);

      var div, i, id;
      for (i = 0; i < this.lstSupplierHoldReasons.length; i++) {
        id = this.lstSupplierHoldReasons[i].id;
        div = document.getElementById(id);
        if ($event.source.value === id) {
          div.style.display = "none";
        }
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

  getHospitalsByCityId($event) {
    this.hospitalService.getHosByCityId($event.target.value).subscribe(hospitals => {
      this.lstHospitals = hospitals;
    });
  }
  getAssetsofHospital($event) {
    this.assetDetailService.GetSupplierNoneExcludedAssetsByHospitalId($event.target.value).subscribe(assets => {
      this.lstAssets = assets;
    });
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
  onSubmit() {
    const itmIndex = [];
    if (this.supplierExecludeObj.assetId == 0) {
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
    else if (this.selectedAppType == 1) {

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
      else {
        this.supplierExecludeObj.reasonIds = this.addReasons;
        this.supplierExecludeObj.appTypeId = this.selectedAppType;
        this.supplierExecludeObj.userId = this.currentUser.id;
        if (this.currentUser.hospitalId != 0)
          this.supplierExecludeObj.hospitalId = this.currentUser.hospitalId;
        else
          this.supplierExecludeObj.hospitalId = this.supplierExecludeObj.hospitalId;

        this.supplierExecludeObj.assetId = this.assetBarCodeObj.id;

        this.supplierExecludeAssetService.CreateSupplierExecludeAsset(this.supplierExecludeObj).subscribe(returnedId => {
          this.supplierExecludeAssetId = returnedId;
          this.supplierExecludeObj.reasonIds.forEach(element => {
            var transObj = new SupplierExecludeVM();
            transObj.reasonId = element;
            transObj.supplierExecludeAssetId = this.supplierExecludeAssetId;

            if (this.currentUser.hospitalId != 0)
              transObj.hospitalId = this.currentUser.hospitalId;
            else
              transObj.hospitalId = this.supplierExecludeObj.hospitalId;


            this.supplierExecludeService.CreateSupplierExeclude(transObj).subscribe(transId => {
              this.transExcludeId = transId;

              const grouped = this.groupBy(this.lstExcludFile, fl => fl.reasonId);
              let groupFiles = grouped.get(element);
              if (groupFiles == null || groupFiles == undefined) {
                if (this.lang == "en") {
                  this.supplierExecludeReasonService.GetSupplierExecludeReasonById(element).subscribe(elem => {
                    this.errorDisplay = true;
                    this.errorMessage = 'Please select at least one file for reason ' + elem.name;
                    this.isFound = true;
                    this.display = false;

                  });
                }
                else {
                  this.supplierExecludeReasonService.GetSupplierExecludeReasonById(element).subscribe(elem => {
                    this.errorDisplay = true;
                    this.errorMessage = 'من فضلك اختر أحد الملفات ' + elem.nameAr;
                    this.isFound = true;
                    this.display = false;
                  });
                }
                this.supplierExecludeAssetService.DeleteSupplierExecludeAsset(this.supplierExecludeAssetId).subscribe(item => { });
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
                    let supplierDocument = new CreateSupplierExecludeAssetAttachmentVM();
                    supplierDocument.supplierExecludeId = Number(this.transExcludeId);
                    supplierDocument.hospitalId = this.supplierExecludeObj.hospitalId;
                    let ext = fileobj.file.files[index].name.split('.').pop();
                    var hCode = this.pad(this.hospitalCode, 4);
                    var appNum = this.pad(this.supplierExecludeObj.exNumber, 10);

                    var last = itmIndex[itmIndex.length - 1];
                    let newIndex = this.pad((last).toString(), 2);

                    let EXSupplierlFileName = hCode + "ES" + appNum + newIndex;
                    supplierDocument.fileName = EXSupplierlFileName + "." + ext;


                    this.supplierExecludeAssetService.CreateSupplierExecludeAssetAttachments(supplierDocument).subscribe(lstfiles => {
                      this.uploadService.uploadSupplierExecludeAssetFiles(fileobj.file.files[index], supplierDocument.fileName).subscribe(
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
                //this.display = true;
                this.supplierExecludeAssetService.SendSupplierExcludeEmail(Number(transId)).subscribe(done => {
                  this.display = true;
                });
              }
            });
          });
        });
        this.display = false;
      }
    }
    else if (this.selectedAppType == 2) {
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
      else if (this.supplierExecludeObj.exNumber == '') {
        if (this.lang == "en") {
          this.errorDisplay = true;
          this.errorMessage = 'Please add hold number';
        }
        else {
          this.errorDisplay = true;
          this.errorMessage = 'من فضلك ادخل رقم الإيقاف المؤقت';
        }
        return false;
      }

      this.supplierExecludeObj.reasonIds = this.addHoldReasons;
      this.supplierExecludeObj.appTypeId = this.selectedAppType;
      this.supplierExecludeObj.userId = this.currentUser.id;
      this.supplierExecludeObj.assetId = this.assetBarCodeObj.id;
      this.supplierExecludeAssetService.CreateSupplierExecludeAsset(this.supplierExecludeObj).subscribe(returnedId => {
        this.supplierExecludeAssetId = returnedId;
        let reasoncount = this.supplierExecludeObj.reasonIds.length;
        this.supplierExecludeObj.reasonIds.forEach(element => {
          var transObj = new SupplierExecludeVM();
          transObj.reasonId = element;
          transObj.supplierExecludeAssetId = this.supplierExecludeAssetId;
          this.supplierExecludeService.CreateSupplierExeclude(transObj).subscribe(transId => {

            this.transExcludeId = transId;

            const grouped = this.groupBy(this.lstExcludFile, fl => fl.reasonId);
            let groupFiles = grouped.get(element);
            if (groupFiles == null || groupFiles == undefined) {
              if (this.lang == "en") {
                this.supplierHoldReasonService.GetSupplierHoldReasonById(element).subscribe(elem => {
                  this.errorDisplay = true;
                  this.errorMessage = 'Please select at least one file for reason ' + elem.name;
                  this.isFound = true;
                  this.display = false;
                });
              }
              else {
                this.supplierHoldReasonService.GetSupplierHoldReasonById(element).subscribe(elem => {
                  this.errorDisplay = true;
                  this.errorMessage = 'من فضلك اختر أحد الملفات ' + elem.nameAr;
                  this.isFound = true;
                  this.display = false;
                });
              }
              this.supplierExecludeAssetService.DeleteSupplierExecludeAsset(this.supplierExecludeAssetId).subscribe(item => { });
              return false;
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
                  let supplierDocument = new CreateSupplierExecludeAssetAttachmentVM();
                  supplierDocument.supplierExecludeId = Number(this.transExcludeId);
                  supplierDocument.hospitalId = this.supplierExecludeObj.hospitalId;
                  let ext = fileobj.file.files[index].name.split('.').pop();
                  var hCode = this.pad(this.hospitalCode, 4);
                  var appNum = this.pad(this.supplierExecludeObj.exNumber, 10);
                  var last = itmIndex[itmIndex.length - 1];
                  let newIndex = this.pad((last).toString(), 2);
                  let EXSupplierlFileName = hCode + "HS" + appNum + newIndex;
                  supplierDocument.fileName = EXSupplierlFileName + "." + ext;
                  this.supplierExecludeAssetService.CreateSupplierExecludeAssetAttachments(supplierDocument).subscribe(lstfiles => {
                    this.uploadService.uploadSupplierExecludeAssetFiles(fileobj.file.files[index], supplierDocument.fileName).subscribe(
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
                else {
                  this.isFound = false;
                }
              });
              //this.display = true;
              this.supplierExecludeAssetService.SendSupplierExcludeEmail(Number(transId)).subscribe(done => {
                this.display = true;
              });
            }
          });
        });

      });
      this.display = false;
    }
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
  getHospitalCode($event) {
    this.assetDetailService.GetAssetById($event.target.value).subscribe(assetObj => {
      this.hospitalService.GetHospitalById(assetObj["hospitalId"]).subscribe(hospital => {
        this.hospitalCode = hospital.code;
      })
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

  show() {
    var div, i, id;
    if (this.selectedAppType == 1) {
      for (i = 0; i < this.lstReasons.length; i++) {
        id = this.lstReasons[i].id;
        div = document.getElementById(id);
        if (this.visibleId === id) {
          div.style.display = "block";
        }
      }
    }
    if (this.selectedAppType == 2) {
      for (i = 0; i < this.lstSupplierHoldReasons.length; i++) {
        id = this.lstSupplierHoldReasons[i].id;
        div = document.getElementById(id);
        if (this.visibleId === id) {
          div.style.display = "block";
        }
      }
    }
  }


  getBarCode(event) {


    this.assetDetailService.GetAutoCompleteSupplierExcludedAssetsByHospitalId(event.query, this.supplierExecludeObj.hospitalId).subscribe(assets => {
      if (assets.length == 0) { }
    });


    this.supplierExecludeObj.assetId = event["id"];
    this.supplierExecludeObj.masterAssetId = event["masterAssetId"];
    this.selectedMasterAssetId = event["masterAssetId"];
    this.supplierExecludeObj.masterAssetId = this.selectedMasterAssetId;
    this.assetDetailService.GetHospitalAssetById(Number(event["id"])).subscribe(assetObj => {
      this.assetBarCodeObj = assetObj;

      this.assetBarCodeObj.name = event["barCode"];
      this.applicationStatus = this.lang == "en" ? this.assetBarCodeObj["assetStatus"] : this.assetBarCodeObj["assetStatusAr"];

      this.assetStatusId = this.assetBarCodeObj["assetStatusId"];
      if (this.assetStatusId == 1) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it Needs Repair";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه يحتاج لإصلاح ";
        }
        this.isDisabled = true;
      }
      if (this.assetStatusId == 2) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is InActive";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه غير فعال";
        }
        this.isDisabled = true;
      }
      if (this.assetStatusId == 4) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Under Maintenance";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه تحت الصيانة";
        }
        this.isDisabled = true;

      }
      if (this.assetStatusId == 5) {

        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Under Installation";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه  تحت الإنشاء";
        }
        this.isDisabled = true;

      }
      if (this.assetStatusId == 6) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is not working ";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه لا يعمل ";
        }
        this.isDisabled = true;

      }
      if (this.assetStatusId == 7) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Shut Down";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه متوقف ";
        }
        this.isDisabled = true;

      }
      if (this.assetStatusId == 8) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Excluded";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه مستبعد ";
        }
        this.isDisabled = true;

      }
      if (this.assetStatusId == 9) {
        this.errorDisplay = true;
        if (this.lang == "en") {
          this.errorMessage = "You cannot make ticket for this asset because it is Hold";
        }
        else {
          this.errorMessage = "لا يمكن عمل بلاغ لهذا الأصل لأنه في حالة إيقاف مؤقت ";
        }
        this.isDisabled = true;

      }
      else {
        this.isDisabled = false;
      }


    });


  }
  onSelectionChanged(event) {

    if (this.supplierExecludeObj.hospitalId != 0) {
      // this.assetDetailService.GetAutoCompleteSupplierExcludedAssetsByHospitalId(event.query, this.supplierExecludeObj.hospitalId).subscribe(assets => {
      //   this.lstassetDetailBarcodes = assets;
      //   if (this.lang == "en") {
      //     this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
      //   }
      //   else {
      //     this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
      //   }
      // },
      //   error => {
      //     // this.errorDisplay = true;
      //     // if (this.lang == 'en') {
      //     //   if (error.error.status == 'assetId') {
      //     //     this.errorDisplay = true;
      //     //     this.errorMessage = error.error.message;
      //     //   }
      //     // } else {
      //     //   if (error.error.status == 'assetId') {
      //     //     this.errorDisplay = true;
      //     //     this.errorMessage = error.error.messageAr;
      //     //   }
      //     // }
      //     // this.isDisabled = true;
      //     // return false;
      //   });





      this.assetDetailService.GetAutoCompleteSupplierNoneExcludedAssetsByHospitalId(event.query, this.supplierExecludeObj.hospitalId).subscribe(assets => {
        this.lstassetDetailBarcodes = assets;
        if (this.lang == "en") {
          this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
        }
        else {
          this.lstassetDetailBarcodes.forEach(item => item.name = item.barCode);
        }
      });



    }
    else {
      this.errorDisplay = true;
      this.errorMessage = "من فضلك اختر مستشفى";

      return false;
    }

  }



  closeDialogue() {
    this.route.navigate(['/dash/supplierexecludes']);
  }
}
