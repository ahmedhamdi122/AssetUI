import { Component, OnInit } from '@angular/core';
import { DialogService } from 'primeng/dynamicdialog';
import { MatDialog } from '@angular/material/dialog';

import { ListOrganizationVM, OrganizationVM } from 'src/app/Shared/Models/organizationVM';
import { ListSubOrganizationVM } from 'src/app/Shared/Models/subOrganizationVM';
import { OrganizationService } from 'src/app/Shared/Services/organization.service';
import { SubOrganizationService } from 'src/app/Shared/Services/subOrganization.service';
import { EditComponent } from '../edit/edit.component';
import { CreateComponent } from '../create/create.component';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { EditsuborganizationComponent } from '../../sub-organizations/editsuborganization/editsuborganization.component';
import { CreatesuborganizationComponent } from '../../sub-organizations/createsuborganization/createsuborganization.component';
import { DeleteconfirmationComponent } from '../deleteconfirmation/deleteconfirmation.component';
import { DeleteSubOrgConfirmationComponent } from '../../sub-organizations/delete-sub-org-confirmation/delete-sub-org-confirmation.component';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {


  public lang = localStorage.getItem("lang");
  dir: string = "ltr";
  lstOrganizations: ListOrganizationVM[] = [];
  lstSubOrganizations: ListSubOrganizationVM[] = [];
  display: boolean = false;
  errorDisplay: boolean = false;

  errorMessage: string = "";
  selectedObj: OrganizationVM;
  selectedSubOrgId: number;
  selectedOrgId: number;
  currentUser: LoggedUser;
  lstRoleNames: string[] = [];
  isSuperAdmin: boolean = false;

  constructor(private organizationService: OrganizationService, private subOrganizationService: SubOrganizationService, private dialog: MatDialog,
    private authenticationService: AuthenticationService, public dialogService: DialogService, private route: ActivatedRoute,
    private breadcrumbService: BreadcrumbService) {
    this.currentUser = this.authenticationService.currentUserValue;


  }

  ngOnInit(): void {

    if (this.lang == "en") {
      this.dir = "ltr";
    }
    else {
      this.dir = "rtl";
    }


    const translationKeys = ['Asset.heirarchicalstructure', 'Asset.Organizations']; // Array of translation keys
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.route.snapshot, parentUrlArray, translationKeys);




    this.loadOrganizations();



    if (this.currentUser) {
      this.currentUser["roleNames"].forEach(element => {
        this.lstRoleNames.push(element["name"]);
      });
      this.isSuperAdmin = (['SuperAdmin'].some(r => this.lstRoleNames.includes(r)));
    }

  }
  loadOrganizations() {
    this.organizationService.GetOrganizations().subscribe(items => {
      this.lstOrganizations = items;
    });


  }

  filterProjectByOrganizationId(orgId: number) {
    this.lstSubOrganizations = [];
    this.subOrganizationService.GetSubOrganizationByOrgId(orgId).subscribe(items => {
      this.lstSubOrganizations = items;
    })
  }

  addOrg() {
    const ref = this.dialogService.open(CreateComponent, {
      header: this.lang == "en" ? 'Add Organization' : "إضافة هيئة",
      width: '50%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });

    ref.onClose.subscribe(() => {
      this.ngOnInit();
    });
  }


  editOrg(id: number) {
    const ref = this.dialogService.open(EditComponent, {
      header: this.lang == "en" ? 'Edit Organization' : "تعديل هيئة",
      data: {
        id: id
      },
      width: '50%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });

    ref.onClose.subscribe(() => {
      this.ngOnInit();
    });
  }


  addSubOrganization() {
    if (this.selectedOrgId != null) {
      const ref2 = this.dialogService.open(CreatesuborganizationComponent, {
        header: this.lang == "en" ? 'Add Sub-Organization' : "إضافة هيئة فرعية",
        data: {
          orgId: this.selectedOrgId
        },
        width: '50%',
        style: {
          'dir': this.lang == "en" ? 'ltr' : "rtl",
          "text-align": this.lang == "en" ? 'left' : "right",
          "direction": this.lang == "en" ? 'ltr' : "rtl"
        }
      });
      ref2.onClose.subscribe(res => {
        this.ngOnInit();
        this.filterSubByOrganizationId(this.selectedOrgId)
      });
    }
    else {
      const ref3 = this.dialogService.open(CreatesuborganizationComponent, {
        header: this.lang == "en" ? 'Add Sub-Organization' : "إضافة هيئة فرعية",
        width: '50%',
        style: {
          'dir': this.lang == "en" ? 'ltr' : "rtl",
          "text-align": this.lang == "en" ? 'left' : "right",
          "direction": this.lang == "en" ? 'ltr' : "rtl"
        }
      });

      ref3.onClose.subscribe(res => {
        this.ngOnInit();
        this.filterSubByOrganizationId(this.selectedOrgId);
      });
    }
  }


  editSubOrganization(id: number) {

    const ref = this.dialogService.open(EditsuborganizationComponent, {
      header: this.lang == "en" ? 'Edit Sub-Organization' : "تعديل هيئة فرعية",
      data: {
        id: id
      },
      width: '50%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });

    ref.onClose.subscribe(res => {
      this.ngOnInit();
    });
  }


  filterSubByOrganizationId(orgId: number) {
    this.selectedOrgId = orgId;


    this.subOrganizationService.GetSubOrganizationByOrgId(orgId).subscribe(items => {
      this.lstSubOrganizations = items;
    })
  }

  deleteOrg(id: number) {

    this.organizationService.GetOrganizationById(id).subscribe((data) => {
      this.selectedObj = data;

      const orgDialog = this.dialog
        .open(DeleteconfirmationComponent, {
          width: '30%',
          autoFocus: true,
          data: {
            id: this.selectedObj.id,
            name: this.selectedObj.name,
            nameAr: this.selectedObj.nameAr
          },
        });
      orgDialog.afterClosed().subscribe(redir => {
        this.ngOnInit();

        this.filterSubByOrganizationId(id);
      })
    });
  }



  deleteSubOrganization(id: number) {

    this.subOrganizationService.GetSubOrganizationById(id).subscribe((data) => {
      this.selectedObj = data;

      const orgDialog = this.dialog
        .open(DeleteSubOrgConfirmationComponent, {
          width: '30%',
          autoFocus: true,
          data: {
            id: this.selectedObj.id,
            name: this.selectedObj.name,
            nameAr: this.selectedObj.nameAr
          },
        });

      orgDialog.afterClosed().subscribe(redir => {
        this.ngOnInit();
        this.filterSubByOrganizationId(this.selectedOrgId);
      })
    });
  }
}
