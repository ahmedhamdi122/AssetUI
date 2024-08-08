import { Component, OnInit } from '@angular/core';
import { ListOriginVM } from 'src/app/Shared/Models/originVM';
import { ListSubCategoryVM } from 'src/app/Shared/Models/subCategoryVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AssetPeriorityService } from 'src/app/Shared/Services/assetperiority.service';
import { BrandService } from 'src/app/Shared/Services/brand.service';
import { CategoryService } from 'src/app/Shared/Services/category.service';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { OriginService } from 'src/app/Shared/Services/origin.service';
import { SubCategoryService } from 'src/app/Shared/Services/subcategory.service';
import { UploadFilesService } from 'src/app/Shared/Services/uploadfilesservice';
import { Observable } from 'rxjs';
import { DialogService, DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CreateMasterAssetAttachmentVM, CreatePMAssetTaskVM, EditMasterAssetVM, ListPMAssetTaskVM, MasterAssetAttachmentVM } from 'src/app/Shared/Models/masterAssetVM';
import { ListCategoryVM } from 'src/app/Shared/Models/categoryVM';
import { ListBrandVM } from 'src/app/Shared/Models/brandVM';
import { ListAssetPeriorityVM } from 'src/app/Shared/Models/assetPeriorityVM';
import { FormGroup } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ConfirmationService } from 'primeng/api';
import { ECRIService } from 'src/app/Shared/Services/ecri.service';
import { ListECRIVM } from 'src/app/Shared/Models/ecriVM';
import { PMTimeService } from 'src/app/Shared/Services/pmtime.service';
import { ListPMTimeVM } from 'src/app/Shared/Models/pmTimeVM';
import { CreateAssetWorkOrderTaskVM, IndexAssetWorkOrderTaskVM } from 'src/app/Shared/Models/AssetWorkOrderTaskVM';
import { AssetWorkOrderTaskService } from 'src/app/Shared/Services/asset-work-order-task.service';
import { CreateMasterAssetComponentVM, ListMasterAssetComponentVM } from 'src/app/Shared/Models/masterAssetComponentVM';
import { MasterAssetComponentService } from 'src/app/Shared/Services/masterAssetComponent.service';
import { Router } from '@angular/router';
import { ListCategoryTypeVM } from 'src/app/Shared/Models/categoryTypeVM';
import { CategoryTypeService } from 'src/app/Shared/Services/categoryType.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { CreateBrandComponent } from '../../brands/create-brand/create-brand.component';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit {
  currentUser: LoggedUser;
  public lang = localStorage.getItem('lang');
  textDir: string = 'ltr';
  form: FormGroup;
  masterAssetObj: EditMasterAssetVM;
  lstTypes: ListCategoryTypeVM[] = [];
  lstCategories: ListCategoryVM[] = [];
  lstSubCategories: ListSubCategoryVM[] = [];
  lstBrands: ListBrandVM[] = [];
  lstOrigins: ListOriginVM[] = [];
  lstPeriorities: ListAssetPeriorityVM[] = [];
  lstECRIs: ListECRIVM[] = [];
  lstPMTaskItems: ListPMAssetTaskVM[] = [];
  pmTaskObj: CreatePMAssetTaskVM;
  lstPMTasks: CreatePMAssetTaskVM[] = [];
  lstTasks: CreatePMAssetTaskVM[] = [];




  lstWOTaskItems: IndexAssetWorkOrderTaskVM[] = [];
  woTaskObj: CreateAssetWorkOrderTaskVM;
  lstWOTasks: CreateAssetWorkOrderTaskVM[] = [];
  lstAddWOTasks: CreateAssetWorkOrderTaskVM[] = [];
  lstPMTimes: ListPMTimeVM[] = [];
  radioPerioritySelected: number;
  selectedPMTime: any;
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  savedfilesdisplay: boolean = false;
  masterAssetId: number;
  selectedFiles: FileList;
  progressInfos = [];
  message = '';
  abbr: any;
  fname = '';
  fileInfos: Observable<any>;
  masterId: number;
  lstAttachment: MasterAssetAttachmentVM[] = [];
  masterAssetDocument: CreateMasterAssetAttachmentVM;
  lstMasterAssetDocuments: CreateMasterAssetAttachmentVM[] = [];
  createTask: CreatePMAssetTaskVM;
  fileName = '';
  imgURL: string = "";

  itmIndex: any[] = [];
  formData = new FormData();
  public file: File;
  compObj: CreateMasterAssetComponentVM;
  lstComponents: CreateMasterAssetComponentVM[] = [];
  lstSavedComponents: ListMasterAssetComponentVM[] = [];
  canAddBrand: boolean = false;
  isAdmin: boolean = false;
  isHospitalManager: boolean = false;
  lstRoleNames: string[] = [];
  uploadFileName: string;
  fileToUpload: File;
  incremant: number = 0;
  constructor(
    private authenticationService: AuthenticationService, private masterAssetService: MasterAssetService, private masterAssetComponentService: MasterAssetComponentService, private uploadService: UploadFilesService, private categoryTypeService: CategoryTypeService, private categoryService: CategoryService, private subCategoryService: SubCategoryService, private originService: OriginService, private brandService: BrandService, private ecriService: ECRIService, private assetPeriorityService: AssetPeriorityService,
    private pmTimeService: PMTimeService, private config: DynamicDialogConfig, private ref: DynamicDialogRef, private assetWorkOrderTaskService: AssetWorkOrderTaskService,
    private confirmationService: ConfirmationService, private dialogService: DialogService, private route: Router
  ) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }
    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });

      this.isAdmin = (['Admin'].some(r => this.lstRoleNames.includes(r)));
      this.isHospitalManager = (['TLHospitalManager'].some(r => this.lstRoleNames.includes(r)));
      this.canAddBrand = (['AddBrand'].some(r => this.lstRoleNames.includes(r)));
    }
    this.masterAssetDocument = {
      fileName: '', masterAssetId: 0, title: '', masterFile: File
    };
    this.pmTaskObj = { tasknameAr: '', taskname: '', masterAssetId: 0 }
    this.woTaskObj = { name: '', nameAr: '', code: '', masterAssetId: 0, id: 0 }
    this.compObj = { compCode: '', compName: '', compNameAr: '', partNo: "", price: 0, masterAssetId: 0, compDescription: '', compDescriptionAr: '' }
    this.masterAssetObj = {
      ecriId: 0, id: 0, brandId: 0, categoryId: 0, expectedLifeTime: 0, height: 0, length: 0, originId: 0, periorityId: 0, subCategoryId: 0, weight: 0, width: 0, brandName: '', brandNameAr: '', model: '',
      code: '', description: '', descriptionAr: '', modelNumber: '', name: '', nameAr: '', versionNumber: '', title: '', power: '', voltage: '', ampair: '', frequency: '', electricRequirement: '', pmTimeId: 0, assetImg: ''
    };

    this.createTask = { taskname: '', tasknameAr: '', masterAssetId: 0 };
    this.onLoad();

    let id = this.config.data.id;
    this.masterId = id;
    this.masterAssetService.GetMasterAssetById(id).subscribe((data) => {
      this.masterAssetObj = data;
      this.masterAssetId = this.masterAssetObj.id;

      if (this.masterAssetObj.assetImg == null) {
        this.imgURL = `${environment.Domain}UploadedAttachments/MasterAssets/UploadMasterAssetImage/UnknownAsset.png`;
      }
      else if (this.masterAssetObj.assetImg == "") {
        this.imgURL = `${environment.Domain}UploadedAttachments/MasterAssets/UploadMasterAssetImage/UnknownAsset.png`;
      }
      else {
        this.imgURL = `${environment.Domain}UploadedAttachments/MasterAssets/UploadMasterAssetImage/` + data["assetImg"];
      }

      this.selectedPMTime = Number(data['pmTimeId']);


      this.radioPerioritySelected = this.masterAssetObj.periorityId;//.toString();

      if (this.masterAssetObj.categoryId != null) {
        this.subCategoryService
          .GetSubCategoriesByCategoryId(this.masterAssetObj.categoryId)
          .subscribe((subs) => {
            this.lstSubCategories = subs;
          });
        this.categoryService.GetCategoryById(this.masterAssetObj.categoryId).subscribe(categoryObj => {
          this.masterAssetObj.categoryTypeId = categoryObj["categoryTypeId"]
        })


      }

      this.masterAssetService
        .GetAttachmentByMasterAssetId(this.masterId)
        .subscribe(
          (files) => {
            this.lstAttachment = files;
          },
          (error) => console.log(error)
        );

      this.masterAssetService
        .GetPMAssetTaskByMasterAssetId(id)
        .subscribe((tasks) => {
          this.lstPMTaskItems = tasks;
        });


      this.assetWorkOrderTaskService.GetAllAssetWorkOrderTasksByMasterAssetId(this.masterId)
        .subscribe((tasks) => {
          this.lstWOTasks = tasks;
        });

      this.masterAssetComponentService.ListMasterAssetComponentsByMasterAssetId(this.masterId)
        .subscribe((components) => {
          this.lstSavedComponents = components;
        });


    });
  }
  onLoad() {
    this.categoryService.GetCategories().subscribe((categories) => {
      this.lstCategories = categories;
    });

    this.originService.GetOrigins().subscribe((origins) => {
      this.lstOrigins = origins;
    });

    this.assetPeriorityService
      .GetAssetPeriorities()
      .subscribe((periorities) => {
        this.lstPeriorities = periorities;


      });
    this.brandService.GetBrands().subscribe((brands) => {
      this.lstBrands = brands;
    });

    this.ecriService.GetECRIS().subscribe((ecris) => {
      this.lstECRIs = ecris;
    });


    this.pmTimeService.GetPMTimes().subscribe((pmtimes) => {
      this.lstPMTimes = pmtimes;
    });

    this.categoryTypeService.GetCategoryTypes().subscribe(types => { this.lstTypes = types })
  }
  GetCategoriesByCategoryTypeId($event) {
    this.categoryService.GetCategoryByCategoryTypeId($event.target.value).subscribe(categories => { this.lstCategories = categories })
  }
  onFileSelected(event) {
    this.file = event.target.files[0];
  }
  deleteFile(id: number) {
    this.masterAssetService.DeleteMasterAssetImage(id).subscribe((saved) => {
      this.display = true;
      this.ref.close();
    });
  }
  getSelecteditem() {
    this.masterAssetObj.periorityId = Number(this.radioPerioritySelected);
  }
  GetSubCategoryByCategoryId($event) {
    this.subCategoryService
      .GetSubCategoriesByCategoryId($event.target.value)
      .subscribe((subs) => {
        this.lstSubCategories = subs;
      });
  }
  onTimeChange($event) {
    this.selectedPMTime = $event.value;
  }
  deleteWOTask(id: number) {
    this.lstWOTasks.forEach((element) => {
      if (element.id == id) {
        if (this.lang == 'en') {
          this.confirmationService.confirm({
            message:
              'Are you sure that you want to delete this item ' +
              element['name'] +
              ' ?',
            header: 'Delete Item Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.assetWorkOrderTaskService.DeleteAssetWorkOrderTask(id).subscribe(taskObj => {

                this.assetWorkOrderTaskService
                  .GetAllAssetWorkOrderTasksByMasterAssetId(this.masterId)
                  .subscribe((tasks) => {
                    this.lstWOTasks = tasks;
                  });
              })

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
              element['nameAr'] +
              ' ?',
            header: 'تأكيد المسح',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.assetWorkOrderTaskService.DeleteAssetWorkOrderTask(id).subscribe(taskObj => {
                this.assetWorkOrderTaskService
                  .GetAllAssetWorkOrderTasksByMasterAssetId(this.masterId)
                  .subscribe((tasks) => {
                    this.lstWOTasks = tasks;
                  });
              })

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
  deleteTask(id: number) {
    this.lstPMTaskItems.forEach((element) => {
      if (element.id == id) {
        if (this.lang == 'en') {
          this.confirmationService.confirm({
            message:
              'Are you sure that you want to delete this item ' +
              element['Name'] +
              ' ?',
            header: 'Delete Item Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.masterAssetService.GetPMAssetTaskByTaskIdAndMasterAssetId(this.masterId, id).subscribe(taskObj => {
                this.masterAssetService.DeletePMAssetTask(taskObj.id).subscribe(deleted => {

                  this.masterAssetService
                    .GetPMAssetTaskByMasterAssetId(this.masterId)
                    .subscribe((tasks) => {
                      this.lstPMTaskItems = tasks;
                    });
                })
              })
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
              element['NameAr'] +
              ' ?',
            header: 'تأكيد المسح',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.masterAssetService.GetPMAssetTaskByTaskIdAndMasterAssetId(this.masterId, id).subscribe(taskObj => {
                this.masterAssetService.DeletePMAssetTask(taskObj.id).subscribe(deleted => {
                  this.masterAssetService
                    .GetPMAssetTaskByMasterAssetId(this.masterId)
                    .subscribe((tasks) => {
                      this.lstPMTaskItems = tasks;
                    });
                })
              })
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
  onSubmit() {

    this.masterAssetObj.pmTimeId = this.selectedPMTime;
    if (this.file) {
      let ext = this.file.name.split('.').pop();
      var hCode = this.pad(this.currentUser.hospitalCode, 4);
      var srCode = this.pad(this.masterAssetObj.code, 10);
      let newIndex = this.pad((this.masterAssetObj.id).toString(), 2);
      let HospitalAssetFileName = hCode + "MA" + srCode + newIndex;
      let masterFileName = HospitalAssetFileName + "." + ext;
      this.masterAssetObj.assetImg = masterFileName;
    }
    else {
      this.masterAssetObj.assetImg = this.masterAssetObj.assetImg;
    }
    this.masterAssetService.UpdateMasterAsset(this.masterAssetObj).subscribe(assetObj => {
      if (this.file) {
        let ext = this.file.name.split('.').pop();
        var hCode = this.pad(this.currentUser.hospitalCode, 4);
        var srCode = this.pad(this.masterAssetObj.code, 10);
        let newIndex = this.pad((this.masterAssetObj.id).toString(), 2);
        let HospitalAssetFileName = hCode + "MA" + srCode + newIndex;
        let masterFileName = HospitalAssetFileName + "." + ext;

        this.uploadService
          .uploadMasterAssetImage(this.file, masterFileName)
          .subscribe(
            (event) => { },
            (err) => {
              this.message = 'Could not upload the file:' + masterFileName;
            });
      }

      if (this.lstMasterAssetDocuments.length > 0) {
        this.lstMasterAssetDocuments.forEach((elemnt, index) => {
          elemnt.masterAssetId = this.masterAssetId;
          this.masterAssetService.CreateMasterAssetAttachments(elemnt).subscribe(lstfiles => {
            this.uploadService.uploadMasterAssetFiles(elemnt.masterFile, elemnt.fileName).subscribe(
              (event) => {
                this.display = true;
              },
              (err) => {
                if (this.lang == "en") {
                  this.errorDisplay = true;
                  this.errorMessage = 'Could not upload the file:' + elemnt[index].fileName;
                }
                else {
                  this.errorDisplay = true;
                  this.errorMessage = 'لا يمكن رفع ملف ' + elemnt[index].fileName;
                }
              });
          });
        });

        this.lstMasterAssetDocuments = [];
      }
      if (this.lstAddWOTasks.length > 0) {
        this.lstAddWOTasks.forEach((elemnt) => {
          elemnt.masterAssetId = this.masterAssetObj.id;
          this.assetWorkOrderTaskService.CreateAssetWorkOrderTask(elemnt)
            .subscribe(() => {
            });
        });
      }
      if (this.lstComponents.length > 0) {
        this.lstComponents.forEach((elemnt) => {
          elemnt.masterAssetId = this.masterAssetObj.id;

          this.masterAssetComponentService.CreateMasterAssetComponent(elemnt)
            .subscribe(() => {
              this.display = true;
            }, error => {
              this.errorDisplay = true;
              if (this.lang == "en") {
                if (error.error.status == 'code') {
                  this.errorMessage = error.error.message;
                }
              }
              else {
                if (error.error.status == 'code') {
                  this.errorMessage = error.error.messageAr;
                }
              }
              return false;
            });
        });
      }
      if (this.lstPMTasks.length > 0) {
        this.lstPMTasks.forEach((elemnt) => {
          elemnt.masterAssetId = this.masterAssetId;
          this.masterAssetService.AddPMAssetTask(elemnt)
            .subscribe(() => {
            });
        });
      }
      this.display = true;
      this.ref.close();
      this.reload();

    },
      (error) => {
        this.errorDisplay = true;
        if (this.lang == 'en') {
          if (error.error.status == 'code') {
            this.errorMessage = error.error.message;
          }
          if (error.error.status == 'name') {
            this.errorMessage = error.error.message;
          }

          if (error.error.status == 'nameAr') {
            this.errorMessage = error.error.message;
          }
        }
        if (this.lang == 'ar') {
          if (error.error.status == 'code') {
            this.errorMessage = error.error.messageAr;
          }
          if (error.error.status == 'name') {
            this.errorMessage = error.error.messageAr;
          }

          if (error.error.status == 'nameAr') {
            this.errorMessage = error.error.messageAr;
          }
        }
        return false;
      }
    );
  }
  reload() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }
  DeleteFile(id: number) {
    if (this.lang == 'en') {
      this.confirmationService.confirm({
        message: 'Are you sure that you want to delete this file?',
        header: 'Delete Item Confirmation',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.masterAssetService
            .DeleteMasterAssetAttachmentById(id)
            .subscribe((result) => {
              this.ngOnInit();
            });
        },
        reject: () => {
          this.confirmationService.close();
        },
      });
    } else {
      this.confirmationService.confirm({
        message: 'هل أنت متأكد من مسح هذا الملف',
        header: 'تأكيد المسح',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.masterAssetService
            .DeleteMasterAssetAttachmentById(id)
            .subscribe((result) => {
              this.ngOnInit();
            });
        },
        reject: () => {
          this.confirmationService.close();
        },
      });
    }
  }
  downloadFile(fileName) {
    var filePath = `${environment.Domain}UploadedAttachments/`;

    this.uploadService.downloadMasterAssetFile(fileName).subscribe((file) => {
      var dwnldFile = filePath + 'MasterAssets/' + fileName;
      if (fileName != '' || fileName != null) window.open(dwnldFile);
    });
  }
  pad(num: string, size: number): string {
    while (num.length < size) num = "0" + num;
    return num;
  }
  addComponentToList() {
    if (this.compObj.compName == "") {
      this.errorDisplay = true;
      if (this.lang == "en")
        this.errorMessage = "Please insert name";
      else
        this.errorMessage = "أدخل اسم المكون";
      return false;
    }
    if (this.compObj.compNameAr == "") {
      this.errorDisplay = true;
      if (this.lang == "en")
        this.errorMessage = "Please insert component name in arabic";
      else
        this.errorMessage = "ادخل اسم المكون بالعربي";
      return false;
    }
    if (this.compObj.compCode == "") {
      this.errorDisplay = true;
      if (this.lang == "en")
        this.errorMessage = "Please insert component code";
      else
        this.errorMessage = "ادخل كود المكون";
      return false;
    }
    else {
      let componentObj = new CreateMasterAssetComponentVM();
      componentObj.masterAssetId = Number(this.masterId);
      componentObj.compName = this.compObj.compName;
      componentObj.compNameAr = this.compObj.compNameAr;
      componentObj.compDescription = this.compObj.compDescription;
      componentObj.compDescriptionAr = this.compObj.compDescriptionAr;
      componentObj.compCode = this.compObj.compCode;
      componentObj.price = this.compObj.price;
      componentObj.partNo = this.compObj.partNo;
      this.lstComponents.push(componentObj);
    }
  }
  saveComponentToDB() {
    this.lstComponents.forEach((elemnt) => {
      this.masterAssetComponentService.CreateMasterAssetComponent(elemnt)
        .subscribe(() => {
          this.display = true;
          this.ref.close();
          this.route.navigate(['/dash/assets']);
        }, error => {
          this.errorDisplay = true;
          if (this.lang == "en") {
            if (error.error.status == 'code') {
              this.errorMessage = error.error.message;
            }
          }
          else {
            if (error.error.status == 'code') {
              this.errorMessage = error.error.messageAr;
            }
          }
          return false;
        });
    });
  }
  deleteComponent(id: number) {
    this.lstSavedComponents.forEach((element) => {
      if (element.id == id) {
        if (this.lang == 'en') {
          this.confirmationService.confirm({
            message:
              'Are you sure that you want to delete this item ' +
              element['name'] +
              ' ?',
            header: 'Delete Item Confirmation',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.masterAssetComponentService.DeleteMasterAssetComponent(id).subscribe(deletedObj => {

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
              element['nameAr'] +
              ' ?',
            header: 'تأكيد المسح',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
              this.masterAssetComponentService.DeleteMasterAssetComponent(id).subscribe(deletedObj => {
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
  removeComponentItem(doc) {
    const index: number = this.lstComponents.indexOf(doc);
    if (index !== -1) {
      this.lstComponents.splice(index, 1);
    }
  }
  addBrand() {
    const dialogRef2 = this.dialogService.open(CreateBrandComponent, {
      width: '50%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });
    dialogRef2.onClose.subscribe((res) => {
      if (res != this.masterAssetObj.brandId) {
        this.lstBrands = [];
        this.brandService.GetBrands().subscribe(brands => {
          this.lstBrands = brands;
          this.masterAssetObj.brandId = res;
        });
      }
      else {
        this.masterAssetObj.brandId = this.masterAssetObj.brandId;
      }
    });
  }
  removeFileFromObjectArray(doc) {
    const index: number = this.lstMasterAssetDocuments.indexOf(doc);
    this.lstMasterAssetDocuments.splice(index, 1);
  }
  uploadMultipleFile = (event: any) => {
    const files: FileList = event.target.files;

    if (files.length === 0) {
      return;
    }
    else {

      for (var i = 0; i < files.length; i++) {
        let fileToUpload = <File>files[i];
        var masterAssetDoc = new CreateMasterAssetAttachmentVM();
        this.formData.append('file', fileToUpload, fileToUpload.name);
        masterAssetDoc.fileName = fileToUpload.name;
        masterAssetDoc.masterFile = fileToUpload;
        masterAssetDoc.title = fileToUpload.name.split('.')[0];
        this.lstMasterAssetDocuments.push(masterAssetDoc);
      }
    }
    this.addMultiFilesToList();
  }
  addMultiFilesToList() {

    this.lstMasterAssetDocuments.forEach(masterAssetDocument => {
      masterAssetDocument.masterAssetId = Number(this.masterAssetId);
      let ext = masterAssetDocument.fileName.split('.').pop();
      let lastdocumentName = "";
      let imageIndex = "";

      if (this.itmIndex.length == 0) {
        this.masterAssetService.GetLastDocumentForMsterAssetId(Number(this.masterAssetId)).subscribe(lastDoc => {
          lastdocumentName = lastDoc.fileName;
          if (lastdocumentName == null) {
            var last_element = ++this.incremant;
            this.itmIndex.push(last_element);
            let ext = masterAssetDocument.fileName.split('.').pop();
            var hCode = this.pad(this.currentUser.hospitalCode, 4);
            var srCode = this.pad(this.masterAssetObj.code, 10);
            let newIndex = this.pad((last_element).toString(), 2);
            let WOFileName = hCode + "MA" + srCode + newIndex;
            masterAssetDocument.fileName = WOFileName + "." + ext;
          }
          else if (lastdocumentName != "") {

            imageIndex = lastdocumentName.split('.').slice(0, -1).join('.');
            imageIndex = imageIndex.substring(imageIndex.length - 2);
            this.itmIndex.push(imageIndex);
            //
            var newImageIndex = parseInt(imageIndex) + (++this.incremant);
            this.itmIndex.push(newImageIndex);

            var srCode = this.pad(this.masterAssetObj.code, 10);
            var last = this.itmIndex[this.itmIndex.length - 1];
            let newIndex = this.pad((last).toString(), 2);
            let woRFileName = "MA" + srCode + newIndex + "." + ext;
            masterAssetDocument.fileName = woRFileName;
          }
          else if (lastdocumentName == "") {

            var last_element = 1;
            this.itmIndex.push(last_element);
            let ext = masterAssetDocument.fileName.split('.').pop();
            var srCode = this.pad(this.masterAssetObj.code, 10);
            let newIndex = this.pad((last_element).toString(), 2);
            let WOFileName = "HA" + srCode + newIndex;
            masterAssetDocument.fileName = WOFileName + "." + ext;
          }
          masterAssetDocument = { fileName: '', masterAssetId: 0, title: '', masterFile: File };
        });
      }
      else if (this.itmIndex.length > 0) {
        var last_element = this.itmIndex[this.itmIndex.length - 1];
        last_element = parseInt(last_element) + (++this.incremant);
        this.itmIndex.push(last_element);

        var hCode = this.pad(this.currentUser.hospitalCode, 4);
        var srCode = this.pad(this.masterAssetObj.code, 10);
        let newIndex = this.pad((last_element).toString(), 2);
        let SRFileName = hCode + "MA" + srCode + newIndex;
        masterAssetDocument.fileName = SRFileName + "." + ext;
        masterAssetDocument = { fileName: '', masterAssetId: 0, title: '', masterFile: File };
      }
    });
  }
  addWOTaskToList() {
    let woObj = new CreateAssetWorkOrderTaskVM();
    woObj.masterAssetId = Number(this.masterAssetId);
    woObj.name = this.woTaskObj.name;
    woObj.nameAr = this.woTaskObj.nameAr;
    woObj.code = '';
    this.lstAddWOTasks.push(woObj);
  }
  removeItemFromTasks(tsk) {
    const index: number = this.lstAddWOTasks.indexOf(tsk);
    if (index !== -1) {
      this.lstAddWOTasks.splice(index, 1);
    }
  }
  removePMItem(idx) {
    const index: number = this.lstPMTasks.indexOf(idx);
    if (index !== -1) {
      this.lstPMTasks.splice(index, 1);
    }
  }
  addTaskToList() {
    let pmObj = new CreatePMAssetTaskVM();
    pmObj.masterAssetId = Number(this.masterAssetId);
    pmObj.taskname = this.pmTaskObj.taskname;
    pmObj.tasknameAr = this.pmTaskObj.tasknameAr;
    this.lstPMTasks.push(pmObj);
  }
}
