import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { Breadcrumb } from 'src/app/Shared/Models/breadcrumb.model';
import { ListRequestVM } from 'src/app/Shared/Models/requestModeVM';
import { IndexRequestTrackingVM } from 'src/app/Shared/Models/RequestTrackingVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { RequestService } from 'src/app/Shared/Services/request.service';
import { ForgetPasswordComponent } from '../../authenticate/forget-password/forget-password.component'
import { DialogService } from 'primeng/dynamicdialog';
import { ListContractDetailVM } from 'src/app/Shared/Models/contractDetailVM';
import { MasterContractService } from 'src/app/Shared/Services/masterContract.service';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';

@Component({
  selector: 'app-topheader',
  templateUrl: './topheader.component.html',
  styleUrls: ['./topheader.component.scss']
})
export class TopheaderComponent implements OnInit {
  user: LoggedUser;
  currentUser: LoggedUser;
  lstRoleNames: string[] = [];
  lstOpenRequests: ListRequestVM[] = [];
  lstRequestTracks: IndexRequestTrackingVM[] = [];
  countRequests: number;

  Lang: any;
  href: any;
  textDir: string = "rtl";
  direction = localStorage.getItem('dir');
  lang = localStorage.getItem("lang");
  userName = "";
  breadcrumbs$: Observable<Breadcrumb[]>;

  isSuperAdmin: boolean = false;
  isAdmin: boolean = false;
  isDashboard: boolean = false;
  isHospital: boolean = false;
  isSetting: boolean = false;
  isMaintainance: boolean = false;
  isPMMaintainance: boolean = false;
  isCMMaintainance: boolean = false;
  isAsset: boolean = false;
  isAssetOwner: boolean = false;
  isEngManager: boolean = false;
  isHospitalManager: boolean = false;
  isMasterAsset: boolean = false;
  isHospitalAsset: boolean = false;
  isEmployee: boolean = false;
  isContract: boolean = false;
  isServiceRequest: boolean = false;
  isBuilding: boolean = false;
  isWorkOrder: boolean = false;
  isSupplier: boolean = false;
  isMember: boolean = false;
  isSupplierExeclude: boolean = false;
  isHospitalExeclude: boolean = false;
  isMemberlExeclude: boolean = false;
  isListHospitalAsset: boolean = false;
  isVisitEngineer: boolean = false;
  isVisitEngineerManager: boolean = false;
  isSRCreator: boolean = false;
  isSRReviewer: boolean = false;
  isAddSTSchedule: boolean = false;
  isAOSTAssets: boolean = false;
  isExternalFix: boolean = false;
  isContracts: boolean = false;
  isScrap: boolean = false;
  isQRReport: boolean = false;
  isAssetMovement: boolean = false;
  isHospitalAssetMovement: boolean = false;
  isExternalFixMovement: boolean = false;
  isBrandPMGenerateData: boolean = false;
  isBrandPMListData: boolean = false;
  isBrandPMCalender: boolean = false;
  isWNPMGenerateData: boolean = false;
  isWNPMListData: boolean = false;
  isWNPMCalender: boolean = false;
  isWNPMDelay: boolean = false;
  isWNPMFIX: boolean = false;
  isBrandPMFIX: boolean = false;
  isBrandPMDelay: boolean = false;
  isGEOReport: boolean = false;
  isSettingAdmin: boolean = false;
  selectedLang: string;
  lstContracts: ListContractDetailVM[] = [];
  contractSubject: string = "";
  title: string = "";
  hospitalName: string = "";
  showSR: boolean = false;
  showIncomeSR: boolean = false;
  showManufacturePM: boolean = false;
  showATSchedule: boolean = false;
  showAssetST: boolean = false;
  arrayLength: number = 0;
  constructor(public translate: TranslateService, private route: Router,
    private authenticationService: AuthenticationService,
    private requestService: RequestService, private masterContractService: MasterContractService,
    public breadcrumbService: BreadcrumbService, private cookieService: CookieService, public dialogService: DialogService,
  ) {
    this.currentUser = this.authenticationService.currentUserValue;

    translate.addLangs(['en', 'ar']);
    if (localStorage.getItem("lang") != null && localStorage.getItem("lang") != "") {

      this.lang = localStorage.getItem("lang");
      localStorage.setItem('lang', this.lang);
      localStorage.setItem('dir', this.direction);
      this.translate.use(this.lang);
    }
    else {

      this.lang = 'ar';
      this.textDir = 'rtl';
      this.translate.setDefaultLang('ar');
      localStorage.setItem('lang', 'ar');
      localStorage.setItem('dir', this.direction);
    }


    this.currentUser = this.authenticationService.currentUserValue;
    if (this.currentUser != null && this.currentUser.hospitalId != 0) {
      if (this.lang == "en") {
        if (this.currentUser["hospitalName"] != "") {
          this.hospitalName = this.currentUser["hospitalName"];
        }
        else {
          this.hospitalName = "";
        }
      }
      else {
        if (this.currentUser["hospitalNameAr"] != "") {
          this.hospitalName = this.currentUser["hospitalNameAr"];
        }
        else {
          this.hospitalName = "";
        }
      }

      this.masterContractService.GetContractByHospitalId(Number(this.currentUser["hospitalId"])).subscribe(list => {
        if (list.length !== 0) {
          this.lstContracts = list;
          this.contractSubject = this.lstContracts[0].contractName;
        }
      });
    }


  }
  selectLanguage(lang: string) {

    let currentUrl = this.route.url;
    localStorage.setItem('lang', lang);
    localStorage.setItem('dir', this.direction);
    this.translate.use(lang);
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }
  logout() {
    this.authenticationService.logout();
  }



  ngOnInit(): void {

    if (this.currentUser["supplierId"] > 0) {
      this.userName = this.currentUser["userNameAr"];
    }

    if (this.currentUser == null || this.currentUser == undefined) {
      this.lang = "ar";
      this.textDir = "rtl"
      this.route.navigate(['/']);
    }
    else {
      this.userName = this.currentUser["userName"];
    }


    if (this.breadcrumbService.breadcrumbs$) {
      this.breadcrumbs$ =this.breadcrumbService.breadcrumbs$;
    }


    this.onLoad();
  }
  onLoad() {
    this.requestService.GetTotalOpenRequest(this.currentUser.id).subscribe(c => {
      this.countRequests = c;
    });

    this.requestService.ListNewRequests(this.currentUser.hospitalId).subscribe(requests => {
      this.lstOpenRequests = requests;
    });


    this.requestService.ListOpenRequestTracks(this.currentUser.hospitalId).subscribe(requestTracks => {
      this.lstRequestTracks = requestTracks;
    });


    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });
      this.isEngManager = (['EngDepManager'].some(r => this.lstRoleNames.includes(r)));
      this.isAdmin = (['Admin'].some(r => this.lstRoleNames.includes(r)));
      this.isDashboard = (['Admin', 'SupplierManager', 'ExternalFix', 'Contracts', 'ScrapAsset', 'HospitalExcludeAsset', 'SupplierExcludeAsset', 'AOSTAssets', 'SRCreator', 'SRReviewer', 'AssetOwner', 'EngDepManager', 'AddSTSchedule', 'Eng', 'TLHospitalManager', 'Supplier', 'Member', 'VisitManagerEngineer', 'VisitEngineer'].some(r => this.lstRoleNames.includes(r)));
      this.isBuilding = (['Admin'].some(r => this.lstRoleNames.includes(r)));
      this.isHospital = (['Admin', 'TLHospitalManager', 'TLGovManager', 'TLCityManager', 'TLOrgManager', 'TLSubOrgMananger'].some(r => this.lstRoleNames.includes(r)));
      this.isSupplier = (['Admin', 'Member', 'Supplier'].some(r => this.lstRoleNames.includes(r)));
      this.isMember = (['Admin', 'Member'].some(r => this.lstRoleNames.includes(r)));
      this.isSetting = (['Admin'].some(r => this.lstRoleNames.includes(r)));
      this.isSRCreator = (['Admin', 'SRCreator'].some(r => this.lstRoleNames.includes(r)));
      this.isSRReviewer = (['Admin', 'SRReviewer'].some(r => this.lstRoleNames.includes(r)));
      this.isServiceRequest = (['Admin', 'AssetOwner', 'EngDepManager', 'SRCreator'].some(r => this.lstRoleNames.includes(r)));
      this.isMaintainance = (['Admin', 'Eng', 'EngDepManager'].some(r => this.lstRoleNames.includes(r)));
      this.isAsset = (['Admin', 'EngDepManager', 'AssetOwner', 'TLGovManager', 'TLCityManager', 'TLOrgManager', 'TLSubOrgMananger', 'TLHospitalManager'].some(r => this.lstRoleNames.includes(r)));
      this.isAssetOwner = (['Admin', 'AssetOwner'].some(r => this.lstRoleNames.includes(r)));
      this.isEngManager = (['Admin', 'EngDepManager'].some(r => this.lstRoleNames.includes(r)));
      this.isHospitalManager = (['TLHospitalManager'].some(r => this.lstRoleNames.includes(r)));
      this.isCMMaintainance = (['Admin', 'Eng'].some(r => this.lstRoleNames.includes(r)));
      this.isMasterAsset = (['Admin'].some(r => this.lstRoleNames.includes(r)));
      this.isHospitalAsset = (['Admin', 'SRCreator', 'SRReviewer', 'TLHospitalManager', 'AssetOwner', 'EngDepManager', 'TLGovManager', 'TLCityManager', 'TLOrgManager', 'TLSubOrgMananger', 'TLHospitalManager'].some(r => this.lstRoleNames.includes(r)));
      this.isPMMaintainance = (['Admin', 'TLHospitalManager'].some(r => this.lstRoleNames.includes(r)));
      this.isWorkOrder = (['Admin', 'Eng', 'EngDepManager'].some(r => this.lstRoleNames.includes(r)));
      this.isSupplierExeclude = (['Admin', 'Supplier', 'SupplierExcludeAsset', 'SupplierManager'].some(r => this.lstRoleNames.includes(r)));
      this.isHospitalExeclude = (['Admin', 'HospitalExcludeAsset'].some(r => this.lstRoleNames.includes(r)));
      this.isScrap = (['Admin', 'ScrapAsset'].some(r => this.lstRoleNames.includes(r)));
      this.isMemberlExeclude = (['Admin', 'Member'].some(r => this.lstRoleNames.includes(r)));
      this.isListHospitalAsset = (['Admin', 'AssetOwner'].some(r => this.lstRoleNames.includes(r)));
      this.isVisitEngineer = (['Admin', 'VisitEngineer'].some(r => this.lstRoleNames.includes(r)));
      this.isVisitEngineerManager = (['Admin', 'VisitManagerEngineer'].some(r => this.lstRoleNames.includes(r)));
      this.isAddSTSchedule = (['Admin', 'AddSTSchedule'].some(r => this.lstRoleNames.includes(r)));
      this.isAOSTAssets = (['Admin', 'AOSTAssets'].some(r => this.lstRoleNames.includes(r)));
      this.isExternalFix = (['Admin', 'ExternalFix'].some(r => this.lstRoleNames.includes(r)));
      this.isContracts = (['Admin', 'Contracts'].some(r => this.lstRoleNames.includes(r)));
      this.isQRReport = (['Admin', 'QRReport'].some(r => this.lstRoleNames.includes(r)));
      this.isAssetMovement = (['Admin', 'AssetMovement'].some(r => this.lstRoleNames.includes(r)));
      this.isHospitalAssetMovement = (['Admin', 'HospitalAssetMovement'].some(r => this.lstRoleNames.includes(r)));
      this.isExternalFixMovement = (['Admin', 'ExternalFixMovement'].some(r => this.lstRoleNames.includes(r)));
      this.isBrandPMGenerateData = (['Admin', 'BrandPMGenerateData'].some(r => this.lstRoleNames.includes(r)));
      this.isBrandPMListData = (['Admin', 'BrandPMListData'].some(r => this.lstRoleNames.includes(r)));
      this.isBrandPMCalender = (['Admin', 'BrandPMCalender'].some(r => this.lstRoleNames.includes(r)));
      this.isWNPMListData = (['Admin', 'WNPMListData'].some(r => this.lstRoleNames.includes(r)));
      this.isWNPMGenerateData = (['Admin', 'WNPMGenerateData'].some(r => this.lstRoleNames.includes(r)));
      this.isWNPMCalender = (['Admin', 'WNPMCalender'].some(r => this.lstRoleNames.includes(r)));
      this.isWNPMDelay = (['Admin', 'WNPMDelay'].some(r => this.lstRoleNames.includes(r)));
      this.isWNPMFIX = (['Admin', 'WNPMFIX'].some(r => this.lstRoleNames.includes(r)));
      this.isBrandPMFIX = (['Admin', 'BrandPMFIX'].some(r => this.lstRoleNames.includes(r)));
      this.isBrandPMDelay = (['Admin', 'BrandPMDelay'].some(r => this.lstRoleNames.includes(r)));
      this.isGEOReport = (['Admin', 'GEOReport'].some(r => this.lstRoleNames.includes(r)));
      this.isSettingAdmin = (['SettingAdmin'].some(r => this.lstRoleNames.includes(r)));
    }

    if (this.isSRCreator || this.isAssetOwner || this.isSRReviewer || this.isServiceRequest || this.isAdmin) {
      this.showSR = true;
      this.showIncomeSR = false;
    }
    if (this.isEngManager || this.isHospitalManager) {
      this.showSR = false;
      this.showIncomeSR = true;
    }

    if (this.isSupplier) {
      this.showManufacturePM = false;
    }
    else {
      this.showManufacturePM = true;
    }


  }

  forgetPassword() {
    const dialogRef2 = this.dialogService.open(ForgetPasswordComponent, {
      header: this.lang == "en" ? 'Change Password' : "تغيير كلمة المرور",
      width: '40%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });
    dialogRef2.onClose.subscribe((res) => {
      //this.reload();
    });


  }


  openRequest(requestId) {
    this.requestService.UpdateOpenedRequest(requestId).subscribe(requests => {
      let currentUrl = this.route.url;
      this.route.routeReuseStrategy.shouldReuseRoute = () => false;
      this.route.onSameUrlNavigation = 'reload';
      this.route.navigate([currentUrl]);
    });

    this.onLoad();
  }

  openRequestTrack(trackId) {
    this.requestService.UpdateOpenedRequestTrack(trackId).subscribe(requests => {
      let currentUrl = this.route.url;
      this.route.routeReuseStrategy.shouldReuseRoute = () => false;
      this.route.onSameUrlNavigation = 'reload';
      this.route.navigate([currentUrl]);
    });
    this.onLoad();
  }


}

export interface MenuItem {
  label: string;
  icon: string;
  showOnMobile: boolean;
  showOnTablet: boolean;
  showOnDesktop: boolean;
}
