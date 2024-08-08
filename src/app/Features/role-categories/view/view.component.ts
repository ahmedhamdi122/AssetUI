import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { EditRoleCategoryVM } from 'src/app/Shared/Models/rolecategoryVM';
import { RoleCategoryService } from 'src/app/Shared/Services/rolecategory.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  roleCategoryObj: EditRoleCategoryVM;
  constructor(private roleCategoryService: RoleCategoryService, private route: Router, private config: DynamicDialogConfig, private ref: DynamicDialogRef) { }

  ngOnInit(): void {

    if (this.config.data != null || this.config.data != undefined) {
      let id = this.config.data.id;
      this.roleCategoryService.GetRoleCategoryById(id).subscribe(
        (data => {
          this.roleCategoryObj = data;
        }), (error => console.log(error)));
    }

  }
  back() { this.ref.close(); }
}
