import { ViewAssetForReportVM } from "./assetDetailVM";

export class ListDepartmentVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;
    isActive: boolean;
}

export class CreateDepartmentVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;
    hospitalId: number;
    isActive: boolean;
}

export class EditDepartmentVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;
    isActive: boolean;
}

export class GenerateDepartmentCodeVM {
    code: string;
}


export class DepartmentVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;
    isActive: boolean;
}


export class SortDepartmentVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;
    sortStatus: string;
}


export class DepartmentGroupVM {
    id: number;
    name: string;
    nameAr: string;
    assetList: ViewAssetForReportVM[];
}
