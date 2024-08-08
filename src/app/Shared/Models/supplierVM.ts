import { ViewAssetForReportVM } from "./assetDetailVM";

export class ListSupplierVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;

    mobile: string;
    email: string;
    eMail: string;
    website: string;
    address: string;
    addressAr: string;

    contactPerson: string;
    notes: string;
    fax: string;

    lang: string;
    printedBy: string;

    countAssets: number;
    sumPrices: number;
}
export class MainClass {
    results: ListSupplierVM[];
    count: number;
}
export class CreateSupplierVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;
    address: string;
    addressAr: string;
    email: string;
    mobile: string;
    website: string;
    contactPerson: string;
    notes: string;
    fax: string;
}

export class EditSupplierVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;
    address: string;
    addressAr: string;
    email: string;
    mobile: string;
    website: string;
    contactPerson: string;
    notes: string;
    fax: string;
    eMail: string;
    lang: string;
    printedBy: string;

    countAssets: number;
    sumPrices: number;
}


export class ViewSupplierVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;
    address: string;
    addressAr: string;
    mobile: string;
    website: string;
    contactPerson: string;
    notes: string;
    fax: string;
    email: string;
    eMail: string;
}
export class GroupSupplierVM {
    id: number;
    name: string;
    nameAr: string;
    assetList: ViewAssetForReportVM[];
}

export class SortSupplierVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;
    email: string;
    mobile: string;
    sortStatus: string;
    address: string;
    contactPerson: string;
    addressAr: string;
}


export class GenerateSupplierCode {
    code: string;
}

