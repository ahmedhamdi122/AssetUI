import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from 'primeng/dynamicdialog';
import { EditProblemVM, IndexProblemVM } from 'src/app/Shared/Models/ProblemVM';
import { EditSubProblemVM, IndexSubProblemVM } from 'src/app/Shared/Models/SubProblemVM';
import { ProblemService } from 'src/app/Shared/Services/problem.service';
import { SubProblemService } from 'src/app/Shared/Services/sub-problem.service';
import { DeletesubProblemConfirmationComponent } from '../../sub-problem/deletesub-problem-confirmation/deletesub-problem-confirmation.component';
import { CreateComponent } from '../create/create.component';
import { CreateSubProblemComponent } from 'src/app/Features/sub-problem/create-sub-problem/create-sub-problem.component';
import { DeleteProblemsConfirmationComponent } from '../delete-problems-confirmation/delete-problems-confirmation.component';
import { EditComponent } from '../edit/edit.component';
import { EditSubProblemComponent } from '../../sub-problem/edit-sub-problem/edit-sub-problem.component';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { ListMasterAssetVM } from 'src/app/Shared/Models/masterAssetVM';
import { BreadcrumbService } from 'src/app/Shared/Services/Breadcrumb.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  lang = localStorage.getItem("lang");
  dir: string = "ltr";
  lstMasterAssets: ListMasterAssetVM[] = [];
  problemsList: IndexProblemVM[] = [];
  subProblemsList: IndexSubProblemVM[] = [];
  display: boolean = false;
  errorDisplay: boolean = false;
  errorMessage: string = "";
  selectedProbObj: EditProblemVM;
  selectedSubProbObj: EditSubProblemVM;
  selectedprobId: number;
  selectedMasterAssetId: number;
  masterAssetObj: any;
  constructor(private problemService: ProblemService, private masterAssetService: MasterAssetService, private breadcrumbService: BreadcrumbService, private activateRoute: ActivatedRoute,
    private subproblemService: SubProblemService, private dialog: MatDialog, public dialogService: DialogService, private route: Router) { }

  ngOnInit(): void {
    if (this.lang == "en") {
      this.dir = "ltr";
    }
    else {
      this.dir = "rtl";
    }
    this.load();
  }
  load() {

    this.masterAssetService.GetMasterAssets().subscribe(masters => { this.lstMasterAssets = masters });

    const translationKeys = ['Asset.Maintainance', 'Asset.Problems']; // Array of translation keys
    const parentUrlArray = this.breadcrumbService.getParentUrlSegments();
    this.breadcrumbService.addBreadcrumb(this.activateRoute.snapshot, parentUrlArray, translationKeys);
  }



  onSelectionChanged(event) {
    this.masterAssetService.AutoCompleteMasterAssetName2(event.query).subscribe(masters => {
      this.lstMasterAssets = masters;
      if (this.lang == "en") {
        this.lstMasterAssets.forEach(item => item.name = item.code + "-" + item.name + "-" + item.brandName + "-" + item.modelNumber);
      }
      else {
        this.lstMasterAssets.forEach(item => item.name = item.code + "-" + item.nameAr + "-" + item.brandNameAr + "-" + item.modelNumber);
      }
    });
  }

  getObject(event) {
    this.selectedMasterAssetId = event["id"];
    this.problemService.GetProblemByMasterAssetId(Number(event["id"])).subscribe(problems => {
      this.problemsList = problems
    })
  }


  filterSubProblemsByProblemId(probId: number) {

    this.subproblemService.GetAllSubProblemsByProblemId(probId).subscribe(items => {
      this.subProblemsList = items;
    })
    this.selectedprobId = probId;


  }
  addProblem() {
    const ref = this.dialogService.open(CreateComponent, {
      header: this.lang == 'en' ? 'Add Problem' : 'إضافة مشكلة',
      width: '50%',
      style: {
        'dir': this.lang == "en" ? 'ltr' : "rtl",
        "text-align": this.lang == "en" ? 'left' : "right",
        "direction": this.lang == "en" ? 'ltr' : "rtl"
      }
    });

    ref.onClose.subscribe(() => {
      this.ngOnInit();


      this.problemService.GetProblemByMasterAssetId(this.selectedMasterAssetId).subscribe(problems => {
        this.problemsList = problems
      });
    });
  }


  editProblems(id: number) {
    const ref = this.dialogService.open(EditComponent, {
      header: this.lang == 'en' ? 'Edit Problem' : 'تعديل مشكلة',
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

      this.problemService.GetProblemByMasterAssetId(this.selectedMasterAssetId).subscribe(problems => {
        this.problemsList = problems
      });
    });
  }


  addSubProblem() {
    if (this.selectedprobId != null) {
      const ref2 = this.dialogService.open(CreateSubProblemComponent, {
        header: this.lang == 'en' ? 'Add Sub Problem' : 'إضافة مشكلة فرعية',
        data: {
          probId: this.selectedprobId
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

        this.problemService.GetProblemByMasterAssetId(this.selectedMasterAssetId).subscribe(problems => {
          this.problemsList = problems
        });
        this.filterSubProblemsByProblemId(this.selectedprobId);
      });
    }
    else {
      const ref3 = this.dialogService.open(CreateSubProblemComponent, {
        header: this.lang == 'en' ? 'Add Sub Problem' : 'إضافة مشكلة فرعية',
        width: '50%',
        style: {
          'dir': this.lang == "en" ? 'ltr' : "rtl",
          "text-align": this.lang == "en" ? 'left' : "right",
          "direction": this.lang == "en" ? 'ltr' : "rtl"
        }
      });

      ref3.onClose.subscribe(res => {
        this.ngOnInit();
        this.problemService.GetProblemByMasterAssetId(this.selectedMasterAssetId).subscribe(problems => {
          this.problemsList = problems
        });
      });
    }
  }


  editSubProblem(id: number) {

    const ref = this.dialogService.open(EditSubProblemComponent, {
      header: this.lang == 'en' ? 'Edit Sub Problem' : 'تعديل مشكلة فرعية',
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

      this.problemService.GetProblemByMasterAssetId(this.selectedMasterAssetId).subscribe(problems => {
        this.problemsList = problems
      });
      this.filterSubProblemsByProblemId(this.selectedprobId);
    });
  }



  deleteProblem(id: number) {

    this.problemService.GetProblemById(id).subscribe((data) => {
      this.selectedProbObj = data;

      const deleteDialog = this.dialog
        .open(DeleteProblemsConfirmationComponent, {
          width: '30%',
          autoFocus: true,
          data: {
            id: this.selectedProbObj.id,
            name: this.selectedProbObj.name,
            nameAr: this.selectedProbObj.nameAr
          },
        });
      deleteDialog.afterClosed().subscribe(result => {
        this.ngOnInit();
        this.problemService.GetProblemByMasterAssetId(this.selectedMasterAssetId).subscribe(problems => {
          this.problemsList = problems
        });
      });
    });

  }



  deleteSubProblem(id: number) {

    this.subproblemService.GetSubProblemById(id).subscribe((data) => {
      this.selectedSubProbObj = data;

      const deleteDialog = this.dialog
        .open(DeletesubProblemConfirmationComponent, {
          width: '30%',

          autoFocus: true,
          data: {
            id: this.selectedSubProbObj.id,
            name: this.selectedSubProbObj.name,
            nameAr: this.selectedSubProbObj.nameAr,
          }
        });
      deleteDialog.afterClosed().subscribe(result => {

        this.problemService.GetProblemByMasterAssetId(this.selectedMasterAssetId).subscribe(problems => {
          this.problemsList = problems
        });
        this.filterSubProblemsByProblemId(this.selectedprobId);
      });
    });


  }


  reload() {
    let currentUrl = this.route.url;
    this.route.routeReuseStrategy.shouldReuseRoute = () => false;
    this.route.onSameUrlNavigation = 'reload';
    this.route.navigate([currentUrl]);
  }

}
