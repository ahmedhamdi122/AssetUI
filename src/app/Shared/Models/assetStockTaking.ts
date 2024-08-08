export class ListAssetStockTaking {
    userName: string;
    hospitalName: string;
    hospitalNameAr: string;
    assetName: string;
    assetNameAr: string;
    brandName: string;
    brandNameAr: string;
    supplierName: string;
    supplierNameAr: string;
    departmentName: string;
    departmentNameAr: string;
    barCode: string;
    serialNumber: string;
    captureDate: string;
}

export class MainClass {
    results: ListAssetStockTaking[];
    count: number;
}

export class SortAssetStockTakingVM {
    sortStatus: string;
    hospitalName: string;
    hospitalNameAr: string;
    assetName: string;
    assetNameAr: string;
    brandName: string;
    brandNameAr: string;
    departmentName: string;
    departmentNameAr: string;
    barCode: string;
    serialNumber: string;
    captureDate: string;
    stCode: string;

}
export class SearchAssetStockTakingVM {
    periorityId: number;
    code: string;
    barCode: string;
    modelNumber: string;
    serialNumber: string;
    statusId: number;
    modeId: number;
    masterAssetId: number;
    governorateId: number;
    cityId: number;
    organizationId: number;
    subOrganizationId: number;
    hospitalId: number;
    start: string;
    end: string;
    subject: string;
    userId: string;
    assetOwnerId: number;
    departmentId: number;
    lang: string;
    hospitalName: string;
    hospitalNameAr: string;
    strEndDate: string;
    strStartDate: string;
    assetName: string;
    serial: string;
    supplierId: number;
    brandId: number;
    originId: number;
}