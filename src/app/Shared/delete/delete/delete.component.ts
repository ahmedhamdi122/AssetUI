import { Component, Input, OnInit } from '@angular/core';
import { AssetStatusService } from '../../Services/assetStatus.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.css']
})
export class DeleteComponent implements OnInit {
  @Input() name: string;
  @Input() close: () => void;
  @Input() delete: () => void;
 
  lang = localStorage.getItem("lang");
  textDir: string = 'ltr';
  constructor() {

   
   }

  ngOnInit(): void {
    if(this.lang=="en"){
      this.textDir="ltr";
    }else{
      this.textDir='rtl' ;
    }
  }
  closeFunc(): void {
    if (this.close) {
      this.close();
    }
  }
  deleteFunc():void{
    if (this.delete) {
      this.delete();
    }

  }
}
