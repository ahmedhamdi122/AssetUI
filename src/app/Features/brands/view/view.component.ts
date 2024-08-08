import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EditBrandVM } from 'src/app/Shared/Models/brandVM';
import { LoggedUser } from 'src/app/Shared/Models/userVM';
import { BrandService } from 'src/app/Shared/Services/brand.service';
import { AuthenticationService } from 'src/app/Shared/Services/guards/authentication.service';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {

  brandObj: EditBrandVM
  lang = localStorage.getItem("lang");
  currentUser: LoggedUser
  errorMessage: string;
  constructor(private brandService: BrandService, private authenticationService: AuthenticationService,
    private activeRoute: ActivatedRoute, private route: Router) { this.currentUser = this.authenticationService.currentUserValue; }

  ngOnInit(): void {
    this.brandObj = { code: '', id: 0, name: '', nameAr: '' }
    let id = this.activeRoute.snapshot.params['id'];
    this.brandService.GetBrandById(id).subscribe(
      data => {
        this.brandObj = data;
      });
  }

  back() { this.route.navigate(['/dash/brands']); }
}
