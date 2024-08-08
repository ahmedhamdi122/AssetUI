import { ViewAssetForReportVM } from "./assetDetailVM";

export class ListCityVM {
    id:number;
    code:string;
    name:string;
    nameAr:string;
}

export class CreateCityVM {
    code:string;
    name:string;
    nameAr:string;
    governorateId:number;

}

export class EditCityVM {
    id:number;
    code:string;
    name:string;
    nameAr:string;
    governorateId:number;
}
export class GroupcityVM
{
    id:number;
    name:string;
    nameAr:string;
    countAssets:number;
    assetList:ViewAssetForReportVM[];
}






