import { EngineerService } from 'src/app/Shared/Services/engineer.service';
import { Component, OnInit } from '@angular/core';
import {  ViewEngineerVM } from 'src/app/Shared/Models/engineerVM';
import { DynamicDialogConfig } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-view',
  templateUrl: './view.component.html',
  styleUrls: ['./view.component.css']
})
export class ViewComponent implements OnInit {
  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  engObj:ViewEngineerVM;
  constructor(private engineerService:EngineerService,private config: DynamicDialogConfig
    ) { }

  ngOnInit(): void {
    if (this.lang == 'en') {
      this.textDir = 'ltr';
    } else if (this.lang == 'ar') {
      this.textDir = 'rtl';
    }
    this.engObj = {
      id: 0, code:'',name: '', nameAr: '', phone: '', cardId: '',whatsApp: '', dob: '',email: '',
      address:'',addressAr:'',gender:''    }
    if(this.config.data != null || this.config.data != undefined)
{
    let id = this.config.data.id;
   this.engineerService.ViewEngineerById(id).subscribe(
     data => {
        this.engObj = data;
      });
}
  }

}
