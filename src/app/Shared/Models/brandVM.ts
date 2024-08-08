import { ViewAssetForReportVM } from "./assetDetailVM";

export class ListBrandVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;
}

export class CreateBrandVM {
    code: string;
    name: string;
    nameAr: string;
    governorateId: number;
    id: number;

}

export class EditBrandVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;
}
export class BrandGroupVM {
    id: number;
    name: string;
    nameAr: string;
    assetList: ViewAssetForReportVM[];
}

export class MainClass {
    count: number;
    results: ListBrandVM[];
}



export class SortAndFilterBrandVM {
    sortObj: SortBrandVM;
    searchObj: SearchBrandVM;
}
export class SearchBrandVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;
}

export class SortBrandVM {
    code: string;
    name: string;
    nameAr: string;
    sortStatus: string;
    sortBy: string;
}

export class GenerateBrandCode {
    code: string;
}