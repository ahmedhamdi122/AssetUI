import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AutoComplete } from 'primeng/autocomplete';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { ListMasterAssetVM } from 'src/app/Shared/Models/MasterAssetVM';
import { EditProblemVM } from 'src/app/Shared/Models/ProblemVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { ProblemService } from 'src/app/Shared/Services/problem.service';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  public lang = localStorage.getItem('lang');
  currentUser: LoggedUser;
  errorMessage: string = '';
  errorDisplay: boolean = false;
  display: boolean = false;
  form: FormGroup;
  probObj: EditProblemVM;
  submitted: boolean = false;
  isValidEMail: boolean = false;
  textDir: string = 'ltr';
  @ViewChild('autoItems', { static: false }) public autoItems: AutoComplete;

  lstMasterAssets: ListMasterAssetVM[] = [];
  masterAssetObj: any;
  constructor(private authenticationService: AuthenticationService,
    private problemService: ProblemService, private masterAssetService: MasterAssetService,
    private ref: DynamicDialogRef, private config: DynamicDialogConfig) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {


    this.load();

    let id = this.config.data.id;
    this.problemService.GetProblemById(id).subscribe((data) => {
      this.probObj = data;
      this.probObj.id = id;
      this.masterAssetService.GetMasterAssetById(this.probObj.masterAssetId).subscribe(masterObj => {
        this.masterAssetObj = masterObj;

        if (this.lang == "en") {
          this.masterAssetObj.name = masterObj.code + "-" + masterObj.name;
        }
        else {
          this.masterAssetObj.name = masterObj.code + "-" + masterObj.nameAr;
        }
      })
    });


  }
  load() {
    this.probObj = { id: 0, code: '', name: '', nameAr: "", masterAssetId: 0 }
    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }

    this.masterAssetService.GetMasterAssets().subscribe(masters => {
      this.lstMasterAssets = masters;
      if (this.lang == "en") {
        this.lstMasterAssets.forEach(item => item.name = item.code + "-" + item.name);
      }
      else {
        this.lstMasterAssets.forEach(item => item.name = item.code + "-" + item.nameAr);
      }
    });
  }
  onSubmit() {
    if (this.probObj.code == '') {
      this.submitted = false;
      return false;
    }
    if (this.probObj.name == '') {
      this.submitted = false;
      return false;
    } else {
      this.problemService.UpdateProblem(this.probObj).subscribe(
        (result) => {
          this.display = true;
          this.ref.close();
          this.ngOnInit();
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
  }
  onSelectionChanged(event) {
    this.masterAssetService.AutoCompleteMasterAssetName(event.query).subscribe(masters => {
      this.lstMasterAssets = masters;
      if (this.lang == "en") {
        this.lstMasterAssets.forEach(item => item.name = item.code + "-" + item.name);
      }
      else {
        this.lstMasterAssets.forEach(item => item.name = item.code + "-" + item.nameAr);
      }
    });

  }

  getObject(event) {
    this.probObj.masterAssetId = event["id"];
  }
}