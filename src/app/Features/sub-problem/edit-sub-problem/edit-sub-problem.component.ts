import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { IndexProblemVM } from 'src/app/Shared/Models/ProblemVM';
import { EditSubProblemVM } from 'src/app/Shared/Models/SubProblemVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';
import { ProblemService } from 'src/app/Shared/Services/problem.service';
import { SubProblemService } from 'src/app/Shared/Services/sub-problem.service';

@Component({
  selector: 'app-edit-sub-problem',
  templateUrl: './edit-sub-problem.component.html',
  styleUrls: ['./edit-sub-problem.component.css']
})
export class EditSubProblemComponent implements OnInit {

  public lang = localStorage.getItem("lang");
  currentUser: LoggedUser;
  errorMessage: string = '';
  errorDisplay: boolean = false;
  display: boolean = false;
  form: FormGroup;
  subProblemObj: EditSubProblemVM;
  submitted: boolean = false;
  isValidEMail: boolean = false;
  textDir: string = 'ltr';
  lstProblems: IndexProblemVM[] = [];


  constructor(private authenticationService: AuthenticationService, private subProblemService: SubProblemService,
    private problemService: ProblemService, private route: Router,
    private ref: DynamicDialogRef, private config: DynamicDialogConfig) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }
    this.subProblemObj = { code: '', problemId: 0, id: 0, name: '', nameAr: '' }

    this.problemService.GetAllProblems().subscribe(items => {
      this.lstProblems = items;
    });


    let id = this.config.data.id;
    this.subProblemService.GetSubProblemById(id).subscribe(
      data => {
        this.subProblemObj = data
      });
  }

  onChange($event) {
    this.subProblemObj.problemId = $event.target.value;
  }
  onSubmit() {

    if (this.subProblemObj.code == '') {
      this.submitted = false;
      return false;
    }
    if (this.subProblemObj.name == '') {
      this.submitted = false;
      return false;
    } else {
      this.subProblemService.UpdateSubProblem(this.subProblemObj).subscribe(result => {
        this.display = true;
        this.ref.close();
      }, (error) => {
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
        } if (this.lang == 'ar') {
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


  reset() {
    this.subProblemObj = {
      id: 0,
      code: '',
      name: '',
      nameAr: '',
      problemId: 0
    };
  }


}
