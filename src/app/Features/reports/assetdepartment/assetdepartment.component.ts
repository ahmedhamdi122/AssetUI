import { Component, OnInit } from '@angular/core';
import { ListDepartmentVM } from '../../../Shared/Models/departmentVM';
import { Paging } from '../../../Shared/Models/paging';
import { LoggedUser } from '../../../Shared/Models/userVM';
import { AuthenticationService } from '../../../Shared/Services/guards/authentication.service';
import { ListAssetDetailVM, SearchHospitalAssetVM } from '../../../Shared/Models/assetDetailVM';
import { AssetDetailService } from '../../../Shared/Services/assetDetail.service';
import { DepartmentService } from '../../../Shared/Services/department.service';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';

@Component({
  selector: 'app-assetdepartment',
  templateUrl: './assetdepartment.component.html',
  styleUrls: ['./assetdepartment.component.css']
})
export class AssetdepartmentComponent implements OnInit {


  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  lstRoleNames: string[] = [];
  page: Paging;
  lstHospitalAssets: ListAssetDetailVM[] = [];
  lstDepartments: ListDepartmentVM[] = [];
  searchObj: SearchHospitalAssetVM;
  count: number;
  loading: boolean = true;

  constructor(private authenticationService: AuthenticationService, private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute, private assetDetailService: AssetDetailService, private departmentService: DepartmentService) {
    this.currentUser = this.authenticationService.currentUserValue;
  }

  ngOnInit(): void {
    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });
    }
    this.page = { pagenumber: 1, pagesize: 10 }
    this.searchObj = { masterAssetName: '', masterAssetNameAr: '', contractTypeId: 0, contractDate: '', contractEnd: '', contractStart: '', end: '', start: '', warrantyTypeId: 0, assetId: 0, assetName: '', barCode: '', brandId: 0, cityId: 0, code: '', departmentId: 0, governorateId: 0, hospitalId: 0, masterAssetId: 0, model: '', organizationId: 0, originId: 0, serial: '', statusId: 0, subOrganizationId: 0, supplierId: 0, userId: '' }

    this.departmentService.DepartmentsByHospitalId(this.currentUser.hospitalId).subscribe(departments => { this.lstDepartments = departments });



    const translationKeys = ['Asset.Reports', 'Asset.Assets', 'Asset.Departments'];
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);

  }

  clicktbl(event) {
    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;
    this.loading = true;
    this.assetDetailService.SearchHospitalAssetsByDepartmentId(this.searchObj.departmentId, this.currentUser.id, this.page.pagenumber, this.page.pagesize).subscribe(hospitalAssetList => {
      this.lstHospitalAssets = hospitalAssetList.results;
      this.count = hospitalAssetList.count;
      this.loading = false;
    });
  }
  onSubmit() {
    this.loading = true;
    this.assetDetailService.SearchHospitalAssetsByDepartmentId(this.searchObj.departmentId, this.currentUser.id, this.page.pagenumber, this.page.pagesize).subscribe(hospitalAssetList => {
      this.lstHospitalAssets = hospitalAssetList.results;
      this.count = hospitalAssetList.count;
      this.loading = false;
    });
  }
}
