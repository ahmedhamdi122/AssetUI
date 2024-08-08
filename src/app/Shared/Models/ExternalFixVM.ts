import { ListExternalFixFileVM } from "./externalFixFilesVM";

export class ListExternalFixVM {
    id: number;
    serialNumber: string;
    barcode: string;
    supplierName: string;
    supplierNameAr: string;
    departmentName: string;
    departmentNameAr: string;
    brand: string;
    brandAr: string;
    AssetName: string;
    AssetNameAr: string;
    modelNumber: string;
    comingDate: Date;

}

export class GenerateExternalFixNumberVM {
    outNumber: string;
}

export class CreateExternalFixVM {
    id: number;
    assetDetailId: number;
    masterAssetId: number;
    outDate: Date;
    comingNotes: string;
    hospitalId: number;
    supplierId: number;
    expectedDate: Date;
    notes: string;
    comingDate: string;
    outNumber: string;
    assetStatusId: number;

    strOutDate: string;
    strExpectedDate: string;
}



export class MainClass {
    results: ListExternalFixVM[];
    count: number;
}

export class ViewExternalFixVM {
    id: number;
    serialNumber: string;
    barcode: string;
    supplierName: string;
    supplierNameAr: string;
    departmentName: string;
    departmentNameAr: string;
    brandName: string;
    brandNameAr: string;
    assetName: string;
    assetNameAr: string;
    modelNumber: string;
    assetDetailId: number
    hospitalId: number;

    assetStatusId: number;
    outDate: Date;
    comingNotes: string;
    supplierId: number;
    expectedDate: Date;
    notes: string;
    comingDate: Date;
    outNumber: string;

    listExternalFixFiles: ListExternalFixFileVM[];

}
export class EditExternalFixVM {
    id: number;
    comingDate: Date;
    strComingDate: string;
    comingNotes: string;
    isChecked: boolean;
}

export class SearchExternalFixVM {
    barcode: string;
    modelNumber: string;
    serialNumber: string;
    serial: string;
    masterAssetId: number;
    governorateId: number;
    cityId: number;
    organizationId: number;
    subOrganizationId: number;
    hospitalId: number;
    start: string;
    end: string;
    userId: string;
    departmentId: number;
    strEndDate: string;
    strStartDate: string;
    brandId: number;
    supplierId: number;


    commingStart: string;
    commingEnd: string;

    expectedStart: string;
    expectedEnd: string;
}


export class SortExternalFixVM {
    sortStatus: string;
    outDate: string;
    barCode: string;
    assetName: string;
    assetNameAr: string;
    serial: string;
    model: string;
    brand: string;
    brandName: string;
    brandNameAr: string;
    supplierName: string;
    supplierNameAr: string;
    supplierId: number;
    brandId: number;
    hospitalId: number;
    masterAssetId: number;
    userId: string;
}
