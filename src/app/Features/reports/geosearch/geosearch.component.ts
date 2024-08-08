import { Component, OnInit } from '@angular/core';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { Paging } from 'src/app/Shared/Models/paging';
import { GovernorateService } from 'src/app/Shared/Services/governorate.service';
import { HospitalService } from 'src/app/Shared/Services/hospital.service';
import { EditAssetDetailVM, ListAssetDetailVM, SearchHospitalAssetVM, SortAssetDetailVM } from 'src/app/Shared/Models/assetDetailVM';


import { AssetDetailService } from 'src/app/Shared/Services/assetDetail.service';


import { ListHospitalDepartmentVM } from 'src/app/Shared/Models/hospitaldepartmentVM';
import { environment } from 'src/environments/environment';
import { ListGovernorateVM } from 'src/app/Shared/Models/governorateVM';
import { ListHospitalVM } from 'src/app/Shared/Models/hospitalVM';
import { ActivatedRoute } from '@angular/router';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';

@Component({
  selector: 'app-geosearch',
  templateUrl: './geosearch.component.html',
  styleUrls: ['./geosearch.component.css']
})
export class GeosearchComponent implements OnInit {
  sortObj: SortAssetDetailVM;
  sortStatus: string = "descending";
  errorDisplay: boolean = false;
  errorMessage: string;
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  lstRoleNames: string[] = [];
  isHospital: boolean = false;
  loading: boolean = true;
  page: Paging;
  statusId: number = 0;
  count: number;
  showDiv1: boolean = false;
  showDiv2: boolean = false;
  showDiv3: boolean = false;
  deptId: number = 0;
  hospitalId: number = 0;
  governorateId: number = 0;
  imgURL: string;
  lstAssets: ListAssetDetailVM[] = [];
  lstGovernorates: ListGovernorateVM[] = [];
  lstHospitals: ListHospitalVM[] = [];
  lstDepartments: ListHospitalDepartmentVM[] = [];
  selectedObj: EditAssetDetailVM;
  searchObj: SearchHospitalAssetVM;
  field2: any = null;

  govname: string = "";
  govnameAr: string = "";
  hosname: string = "";
  hosnameAr: string = "";
  DeptName: string = "";
  DeptNameAr: string = "";



  constructor(private authenticationService: AuthenticationService,
    private assetDetailService: AssetDetailService, private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute,
    private hospitalService: HospitalService, private governorateService: GovernorateService) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {

    this.page = {
      pagenumber: 1,
      pagesize: 10,
    };
    this.sortObj = {
      model: '', sortBy: '',
      masterAssetId: 0, brand: "", supplier: '', userId: '', barCodeValue: '', barCode: '', statusId: 0, hospitalId: 0, governorateId: 0, cityId: 0, subOrganizationId: 0, organizationId: 0, originId: 0, supplierId: 0, brandId: 0,
      serialValue: '', serial: '', Id: 0, assetName: '', assetNameAr: '', orgName: '', orgNameAr: '', cityName: '', cityNameAr: '', sortStatus: '', supplierName: '', supplierNameAr: '',
      governorateName: '', governorateNameAr: '', hospitalName: '', hospitalNameAr: '', Code: '', departmentId: 0, subOrgName: '', subOrgNameAr: '', brandName: '', brandNameAr: ''

    }
    this.showDiv1 = false;
    this.showDiv2 = false;



    const translationKeys = ['Asset.Reports', 'Asset.Assets', 'Asset.Geo'];
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);
    this.getGovernorates();
  }

  getGovernorates() {
    this.governorateService.GetGovernorates().subscribe(data => {
      this.lstGovernorates = data;
      this.imgURL = `${environment.Domain}UploadedAttachments/GovernorateLogo/`;


    });
    this.assetDetailService.GetAssetDetailsByGovIdAndHospitalIdAndDepartmentId2(this.deptId, this.governorateId, this.hospitalId, this.currentUser.id, this.page.pagenumber, this.page.pagesize).subscribe(data => {
      this.lstAssets = data.results;
      this.count = data.count;
    });
    this.showDiv3 = true;
  }

  getHospitalsByGovernorateId(govId: number, name: string, nameAr: string) {

    this.govname = name;
    this.hosname = "";
    this.hosnameAr = "";
    this.govnameAr = nameAr;


    this.hospitalService.getHospitalByGovId(govId).subscribe(data => {
      this.lstHospitals = data;
    });

    this.governorateId = govId;
    this.assetDetailService.GetAssetDetailsByGovIdAndHospitalIdAndDepartmentId2(this.deptId, govId, this.hospitalId, this.currentUser.id, this.page.pagenumber, this.page.pagesize).subscribe(data => {
      this.lstAssets = data.results;
      this.count = data.count;
    });
    this.showDiv1 = true;
    this.showDiv2 = false;
    this.showDiv3 = true;


  }
  getDepartmentByHospitalId(hospitalId: number, name, nameAr) {

    this.DeptName = "";
    this.DeptNameAr = "";
    this.hosname = name;
    this.hosnameAr = nameAr;

    this.governorateId = 0;
    this.hospitalService.GetHospitalDepartmentByHospitalId2(hospitalId).subscribe(data => {
      this.lstDepartments = data;
    });
    this.assetDetailService.GetAssetDetailsByGovIdAndHospitalIdAndDepartmentId2(this.deptId, this.governorateId, hospitalId, this.currentUser.id, this.page.pagenumber, this.page.pagesize).subscribe(data => {
      this.lstAssets = data.results;
      this.count = data.count;
    });
    this.hospitalId = hospitalId;
    this.showDiv2 = true;
    this.showDiv3 = true;

    this.governorateId = 0;
  }
  getAssetsByDeptId(departmentId: number, name, nameAr) {


    this.DeptName = name;
    this.DeptNameAr = nameAr;
    this.showDiv3 = false;

    this.deptId = departmentId;

    this.governorateId = 0;
    this.assetDetailService.GetAssetDetailsByGovIdAndHospitalIdAndDepartmentId2(this.deptId, this.governorateId, this.hospitalId, this.currentUser.id, this.page.pagenumber, this.page.pagesize).subscribe(data => {
      this.lstAssets = data.results;
      this.count = data.count;
    });
    this.showDiv3 = true;
  }

  reset() {
    this.assetDetailService.GetAssetDetailsByGovIdAndHospitalIdAndDepartmentId2(0, 0, 0, this.currentUser.id, this.page.pagenumber, this.page.pagesize).subscribe(data => {
      this.lstAssets = data.results;
      this.count = data.count;
    });
  }

  sort(field) {

    this.field2 = field;
    this.sortObj.governorateId = this.governorateId;
    this.sortObj.departmentId = this.deptId;
    this.sortObj.barCode = '';
    this.sortObj.assetName = '';
    this.sortObj.assetNameAr = '';
    this.sortObj.brandName = '';
    this.sortObj.brandNameAr = '';
    this.sortObj.hospitalName = '';
    this.sortObj.hospitalNameAr = '';
    this.sortObj.supplierNameAr = '';
    this.sortObj.supplierName = '';
    this.sortObj.serial = '';
    this.sortObj.hospitalId = this.hospitalId;
    this.sortObj.model = '';


    if (this.sortStatus == "descending") {
      this.sortStatus = "ascending";
      this.sortObj.sortStatus = this.sortStatus;
    }
    else {
      this.sortStatus = "descending"
      this.sortObj.sortStatus = this.sortStatus;
    }


    if (field.currentTarget.id == "Barcode") {
      this.sortObj.barCode = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "الباركود") {
      this.sortObj.barCode = field.currentTarget.id;
    }

    else if (field.currentTarget.id == "Name") {
      this.sortObj.assetName = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "الاسم") {
      this.sortObj.assetNameAr = field.currentTarget.id;
    }

    else if (field.currentTarget.id == "Hospital") {
      this.sortObj.hospitalName = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "المستشفى") {
      this.sortObj.hospitalNameAr = field.currentTarget.id;
    }

    else if (field.currentTarget.id == "Model") {
      this.sortObj.model = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "رقم الموديل") {
      this.sortObj.model = field.currentTarget.id;
    }





    else if (field.currentTarget.id == "Serial") {
      this.sortObj.serial = field.currentTarget.id
    }
    else if (field.currentTarget.id == "السيريال") {
      this.sortObj.serial = field.currentTarget.id;
    }

    else if (field.currentTarget.id == "Supplier") {
      this.sortObj.supplierName = field.currentTarget.id
    }
    else if (field.currentTarget.id == "المورد") {
      this.sortObj.supplierNameAr = field.currentTarget.id
    }

    else if (field.currentTarget.id == "Brand") {
      this.sortObj.brandName = field.currentTarget.id
    }
    else if (field.currentTarget.id == "Hospital") {
      this.sortObj.hospitalName = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "مستشفى") {
      this.sortObj.hospitalNameAr = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "الماركة") {
      this.sortObj.brandNameAr = field.currentTarget.id;
    }




    this.assetDetailService.geoSortAssetsWithoutSearch(this.sortObj, this.page.pagenumber, this.page.pagesize).subscribe(data => {
      this.lstAssets = [];
      this.lstAssets = data.results;
      this.count = data.count;

      this.sortStatus = this.sortObj.sortStatus;
    });


  }
  sort2(field) {
    this.sortObj.governorateId = this.governorateId;
    this.sortObj.departmentId = this.deptId;
    this.sortObj.hospitalId = this.hospitalId;
    this.sortObj.sortStatus = this.sortStatus;



    if (field.currentTarget.id == "Barcode") {
      this.sortObj.barCode = field.currentTarget.id
    }
    else if (field.currentTarget.id == "الباركود") {
      this.sortObj.barCode = field.currentTarget.id
    }

    else if (field.currentTarget.id == "Name") {
      this.sortObj.assetName = field.currentTarget.id
    }
    else if (field.currentTarget.id == "الاسم") {
      this.sortObj.assetNameAr = field.currentTarget.id
    }

    else if (field.currentTarget.id == "Hospital") {
      this.sortObj.hospitalName = field.currentTarget.id
    }
    else if (field.currentTarget.id == "المستشفى") {
      this.sortObj.hospitalNameAr = field.currentTarget.id
    }





    else if (field.currentTarget.id == "Model") {
      this.sortObj.model = field.currentTarget.id;
    }
    else if (field.currentTarget.id == "رقم الموديل") {
      this.sortObj.model = field.currentTarget.id;
    }


    else if (field.currentTarget.id == "Serial") {
      this.sortObj.serial = field.currentTarget.id
    }
    else if (field.currentTarget.id == "السيريال") {
      this.sortObj.serial = field.currentTarget.id;
    }

    else if (field.currentTarget.id == "Supplier") {
      this.sortObj.supplierName = field.currentTarget.id
    }
    else if (field.currentTarget.id == "المورد") {
      this.sortObj.supplierNameAr = field.currentTarget.id
    }

    else if (field.currentTarget.id == "Brand") {
      this.sortObj.brandName = field.currentTarget.id
    }
    else if (field.currentTarget.id == "Hospital") {
      this.sortObj.hospitalName = field.currentTarget.id
    }
    else if (field.currentTarget.id == "مستشفى") {
      this.sortObj.hospitalNameAr = field.currentTarget.id
    }
    else if (field.currentTarget.id == "الماركة") {
      this.sortObj.brandNameAr = field.currentTarget.id
    }




    this.assetDetailService.geoSortAssetsWithoutSearch(this.sortObj, this.page.pagenumber, this.page.pagesize).subscribe(data => {
      this.lstAssets = data.results;
      this.count = data.count;

      this.sortStatus = this.sortObj.sortStatus;
    });


  }
  clicktbl(event) {

    this.page.pagenumber = (event.first + 10) / 10;
    this.page.pagesize = event.rows;
    this.lstAssets = [];

    this.assetDetailService.GetAssetDetailsByGovIdAndHospitalIdAndDepartmentId2(this.deptId, this.governorateId, this.hospitalId, this.currentUser.id, this.page.pagenumber, this.page.pagesize).subscribe(data => {
      this.lstAssets = data.results;
      this.count = data.count;
    });
    this.showDiv3 = true;

    if (this.field2 != null) {
      this.sort2(this.field2);
    }


  }
}