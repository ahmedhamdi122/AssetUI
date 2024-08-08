import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { ListAssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';
import { CreateRequestTracking } from 'src/app/Shared/Models/RequestTrackingVM';
import { CreateRequest } from 'src/app/Shared/Models/requestVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { RequestTrackingService } from 'src/app/Shared/Services/request-tracking.service';
import { RequestService } from 'src/app/Shared/Services/request.service';
import { CreaterequestComponent } from '../../requests/createrequest/createrequest.component';

@Component({
  selector: 'app-listhorizontal',
  templateUrl: './listhorizontal.component.html',
  styleUrls: ['./listhorizontal.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ListhorizontalComponent implements OnInit {

  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  reqObj: CreateRequest;
  requestId: number;

  createRequestTrackingObj: CreateRequestTracking;

  requestTrackingId: CreateRequestTracking;
  lstAssets: ListAssetDetailVM[] = [];
  lstAssets2: ListAssetDetailVM[] = [];
  lstRoleNames: string[] = [];
  responsiveOptions: any;
  src: string;
  constructor(private authenticationService: AuthenticationService, private assetDetailService: AssetDetailService, private route: Router,
    private requestTrackingService: RequestTrackingService, private requestService: RequestService, public dialogService: DialogService) {
    this.currentUser = this.authenticationService.currentUserValue;
    this.responsiveOptions = [
      {
        breakpoint: '1024px',
        numVisible: 3,
        numScroll: 3
      },
      {
        breakpoint: '768px',
        numVisible: 2,
        numScroll: 2
      },
      {
        breakpoint: '560px',
        numVisible: 1,
        numScroll: 1
      }
    ];
  }

  ngOnInit(): void {
    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });
    }

    this.reqObj = { departmentId: 0, strRequestDate: '', assetDetailId: 0, createdById: '', description: '', masterAssetId: 0, problemId: 0, requestCode: '', requestDate: new Date, requestModeId: 0, requestPeriorityId: 0, requestStatusId: 0, requestTime: '', requestTypeId: 0, serialNumber: "", subProblemId: 0, subject: '', hospitalId: 0 };
    this.createRequestTrackingObj = { strDescriptionDate: '', id: 0, createdById: "", description: '', descriptionDate: new Date(), requestId: 0, requestStatusId: 0, hospitalId: 0 };

    this.requestService.GenerateRequestNumber().subscribe(num => {
      this.reqObj.requestCode = num.requestCode;
    });
    this.assetDetailService.ListAssetDetailCarouselByUserId(this.currentUser.id).subscribe(items => {
      this.lstAssets = items;
    });

    this.assetDetailService.ListAssetDetailCarouselByUserId(this.currentUser.id).subscribe(items => {
      this.lstAssets2 = items;
    });

  }
  addRequest(assetId: number) {
    const dialogRef2 = this.dialogService.open(CreaterequestComponent, {
      data: {
        assetId: assetId != undefined ? assetId : 0
      },
      width: '50%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });

    dialogRef2.onClose.subscribe((res) => {
      this.reload();
    })
  }
  reload() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }

}
