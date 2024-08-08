import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IndexProblemVM } from 'src/app/Shared/Models/ProblemVM';
import { CreateSubProblemVM } from 'src/app/Shared/Models/SubProblemVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { ProblemService } from 'src/app/Shared/Services/problem.service';
import { SubProblemService } from 'src/app/Shared/Services/sub-problem.service';

@Component({
  selector: 'app-create-sub-problem',
  templateUrl: './create-sub-problem.component.html',
  styleUrls: ['./create-sub-problem.component.css']
})
export class CreateSubProblemComponent implements OnInit {
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser
  subProblemObj: CreateSubProblemVM
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  lstProblems: IndexProblemVM[] = [];

  constructor(private authenticationService: AuthenticationService, private subProblemService: SubProblemService,
    private problemService: ProblemService,
    private route: Router, private config: DynamicDialogConfig
  ) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.load();
    if (this.config.data != undefined) {
      let problemId = this.config.data.probId;
      if (problemId != null) {
        this.subProblemObj.problemId = problemId;
      }
      else {
        this.subProblemObj.problemId = 0;
      }
    }
  }

  load() {
    this.subProblemObj = { code: '', name: '', nameAr: '', problemId: 0 }
    this.problemService.GetAllProblems().subscribe(problems => { this.lstProblems = problems })
  }
  onChange($event) {
    this.subProblemObj.problemId = $event.target.value;
  }
  onSubmit() {
    this.subProblemService.inserSubProblem(this.subProblemObj).subscribe(addedObj => {
      this.display = true;
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
}
