import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditClassVM } from 'src/app/Shared/Models/classVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { ClassifyService } from 'src/app/Shared/Services/classify.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit {
  classObj: EditClassVM
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser
  errorMessage: string;
  errorDisplay: boolean = false;
  display: boolean = false;
  constructor(private classificationService: ClassifyService, private authenticationService: AuthenticationService,
    private route: Router, private activeRoute: ActivatedRoute) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.classObj = { code: '', id: 0, name: '', nameAr: '' }
    let id = this.activeRoute.snapshot.params['id'];
    this.classificationService.GetClassificationById(id).subscribe(
      data => {
        this.classObj = data;
      });
  }
  onSubmit() {

    this.classificationService.UpdateClassification(this.classObj).subscribe(addedObj => {
      this.display = true;
      this.route.navigate(['/Classifications/'])
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
  back() { this.route.navigate(['/dash/Classifications']); }
}
