export class ListVisitVM {
  id: number;
  hospitalName: string;
  hospitalNameAr: string;
  engineerName: string;
  visitDate:string;
  visitTypeName:string;
  visitTypeNameAr:string;
  verified:boolean;
  statusId:number;
}
export class VisitVM {
  id: number;
  hospitalId: number;
  visitTypeId:number;
}

export class DetailVisitVM {
  id: number;
  hospitalName: string;
  hospitalNameAr: string;
  engineerName: string;
  visitDate:string;
  visitDescr:string;
  visitTypeName:string;
  visitTypeNameAr:string;
  verified:boolean;
}
export class ViewVisitVM {
  id: number;
  hospitalName: string;
  hospitalNameAr: string;
  engineerName: string;
  visitDate:string;
  visitDescr:string;
  visitTypeName:string;
  visitTypeNameAr:string;
  verified:boolean;
}
export class CreateVisitVM {
  id: number;
  hospitalId: number;
  engineerId: string;
  visitDate:string;
  visitDescr:string;
  visitTypeId:number;
  userId:string;
  code:string;
 }
 export class SearchVisitVM {
  hospitalId: number;
  fromVisitDate:string;
  toVisitDate:string;
  visitTypeId:number;
  userId: string;
  engineerId:number;
 }
 export class EditVisitVM {
  id: number;
  hospitalId: number;
  engineerId:string;
  visitDate:string;
  visitDescr:string;
  visitTypeId:number;
  code:string;
  userId:string;
  statusId:number;
 }
 export class SortVisitsVM{
  hospitalName: string;
  hospitalNameAr: string;
  engineerName: string;
  engineerNameAr: string;
  visitDate:string;
  visitTypeName:string;
  visitTypeNameAr:string;
  sortStatus: string;

 }



 export class GeneratedVisitCodeVM {
  visitCode: string;
}
