import { ViewAssetForReportVM } from "./assetDetailVM";

export class ListGovernorateVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;
    population: string;
    area: string;
    countAssets:number;
    logo:string;

}

export class CreateGovernorateVM {
    code: string;
    name: string;
    nameAr: string;
    population: number;
    area: number;
}

export class EditGovernorateVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;
    population: number;
    area: number;
}


export class GovernorateVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;
}

export class GroupGovernorateVM
{
    id:number;
    name:string;
    nameAr:string;
    countAssets:number;
    assetList:ViewAssetForReportVM[];

}
export class GetGovernorateWithHospitalsCount
{
    id: number;
    name :string;
    nameAr :string;
    hospitalsCount : number;
}


export class DepartmentGroupVM {
    id: number;
    name: string;
    nameAr: string;
    assetList: ViewAssetForReportVM[];
}
