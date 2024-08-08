import { ViewAssetForReportVM } from "./assetDetailVM";

export class ListOrganizationVM {
    id:number=0;
    code:string;
    name:string;
    nameAr:string;
    mobile:string;
}

export class CreateOrganizationVM {
    code:string;
    name:string;
    nameAr:string;
    mobile:string;
    email:string;
    address:string;
    addressAr:string;
    directorName:string;
    directorNameAr:string;
}

export class EditOrganizationVM {
    id:number;
    code:string;
    name:string;
    nameAr:string;
    mobile:string;
    email:string;
    address:string;
    addressAr:string;
    directorName:string;
    directorNameAr:string;
}



export class OrganizationVM {
    id:number;
    code:string;
    name:string;
    nameAr:string;
    mobile:string;
    email:string;
    address:string;
    addressAr:string;
    directorName:string;
    directorNameAr:string;
}
export class GroupOrganizationVM
{
    id:number;
    name:string;
    nameAr:string;
    assetList:ViewAssetForReportVM[];
}




