import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListMasterAssetVM } from 'src/app/Shared/Models/masterAssetVM';
import { CreateProblemVM } from 'src/app/Shared/Models/ProblemVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { MasterAssetService } from 'src/app/Shared/Services/masterAsset.service';
import { ProblemService } from 'src/app/Shared/Services/problem.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser
  probObj: CreateProblemVM;
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  lstMasterAssets: ListMasterAssetVM[] = [];
  masterAssetObj: any;

  constructor(private authenticationService: AuthenticationService, private problemService: ProblemService,
    private route: Router, private masterAssetService: MasterAssetService
  ) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.probObj = { code: '', name: '', nameAr: '', masterAssetId: 0 }
  }
  onSubmit() {

    this.problemService.CreateProblem(this.probObj).subscribe(addedObj => {
      this.display = true;
      this.route.navigate(['/problems/'])
    },
      (error) => {
        this.errorDisplay = true;
        if (this.lang == 'en') {
          if (error.error.status == 'code') {
            this.errorMessage = error.error.message;
          }
          if (error.error.status == 'name') {
            this.errorMessage = error.error.message;
          } if (error.error.status == 'nameAr') {
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
      });
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
    this.probObj.masterAssetId = event["id"];
  }
}
