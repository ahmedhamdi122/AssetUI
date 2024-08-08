import { IndexWorkOrderVM } from "./WorkOrderVM"
import { ListRequestVM } from "./requestModeVM";
import { RequestVM } from "./requestVM"
export class MainClass {
    results: ListAssetDetailVM[];
    count: number;
}

export class RequestMainClass {
    results: ListRequestVM[];
    count: number;
}

export class SortAssetVM {
    Id: number;
    Code: string;
    barCode: string;
    assetName: string;
    assetNameAr: string;
    hospitalName: string;
    hospitalNameAr: string;
    governorateName: string;
    governorateNameAr: string;
    cityName: string;
    cityNameAr: string;
    orgName: string;
    orgNameAr: string;
    subOrgName: string;
    subOrgNameAr: string;
    sortStatus: string;
    serial: string;
    brand: string;
    brandName: string;
    brandNameAr: string;
    supplier: string;
    supplierName: string;
    supplierNameAr: string;

    statusId: number;
    hospitalId: number;
    governorateId: number;
    cityId: number;
    subOrganizationId: number;
    organizationId: number;
    originId: number;
    supplierId: number;
    brandId: number;
    masterAssetId: number;
    barCodeValue: string;
    serialValue: string;
    model: string;
    userId: string;
    departmentId: number;
}


export class ListAssetDetailVM {

    id: number;
    code: string;
    barCode: string;
    barcode: string;
    assetName: string;
    serialNumber: string;
    assetNameAr: string;
    hospitalId: number;
    hospitalName: string;
    hospitalNameAr: string;
    governorateName: string;
    governorateNameAr: string;
    cityName: string;
    cityNameAr: string;
    masterAssetId: number;
    responseTime: string;
    hasSpareParts: boolean;
    isChecked: boolean;
    serial: string;
    qrFilePath: string;
    supplierName: string;
    supplierNameAr: string;
    brandName: string;
    brandNameAr: string;
    model: string;
    masterImg: string;
    endWarrantyDate: string;
    departmentNameAr: string;
    departmentName: string;
    warrantyStart: string;
    warrantyEnd: string;
    warrantyExpires: string;
    purchaseDate: string;
    installationDate: string;
    operationDate: string;
    receivingDate: string;
    strReceivingDate: string;
    buildingName: string;
    buildingNameAr: string;
    floorName: string;
    floorNameAr: string;
    roomName: string;
    roomNameAr: string;
    depreciationRate: string;
    poNumber: string;
    costCenter: string;
    price: string;
    remarks: string;
    createdBy: string;

    // new added 
    masterCode: string;
    room: string;
    floor: string;
    departmentId: number;
    brandId: number;
    originName: string;
    categoryName: string;
    subCategoryName: string;
    orgName: string;
    orgNameAr: string;
    subOrgName: string;
    length: string;
    height: string;
    width: string;
    weight: string;
    modelNumber: string;
    versionNumber: string;
    description: string;
    descriptionAr: string;
    expectedLifeTime: string;
    buildName: string;
    buildNameAr: string;
    assetImg: string;



    strPurchaseDate: string;
    strInstallationDate: string;
    strOperationDate: string;
    inContractAr: String;
    inContract: String;

    contractFrom: String;
    contractTo: String;

    
}
export class CreateAssetDetailVM {
    code: string;
    serialNumber: string;
    price: number;
    purchaseDate: string;
    remarks: string;
    barcode: string;
    installationDate?: string;
    operationDate?: string;
    receivingDate?: string;
    poNumber: string;
    warrantyExpires: string;
    departmentId: number;
    supplierId: number;
    hospitalId: number;
    masterAssetId: number;
    warrantyStart: string;
    warrantyEnd: string;
    buildingId?: number;
    floorId?: number;
    roomId?: number;
    depreciationRate: number;
    costCenter: string;
    listOwners: number[];

    governorateId: number;
    cityId: number;
    subOrganizationId: number;
    organizationId: number;
    assetStatusId: number;
    assetConditionId: number;

    dtWarrantyStart?: Date;
    dtWarrantyEnd?: Date;

    createdBy: string;
}
export class EditAssetDetailVM {
    id: number;
    code: string;
    assetName: string;
    assetNameAr: string;
    serialNumber: string;
    price: number;
    purchaseDate: string;
    remarks: string;
    barcode: string;
    // purchaseDateString: string;
    // installationDateString: string;
    installationDate: string;
    operationDate: string;
    receivingDate: string;
    poNumber: string;
    warrantyExpires: string;
    departmentId: number;
    supplierId: number;
    hospitalId?: number;
    governorateId: number;
    cityId: number;
    subOrganizationId: number;
    organizationId: number;
    masterAssetId: number;
    warrantyStart: string;
    warrantyEnd: string;
    buildingId: number;
    floorId: number;
    roomId: number;
    depreciationRate: number;
    costCenter: string;
    qrFilePath: string;
    assetStatusId: number;
    createdBy: string;
    listOwners: number[];
}
export class AssetDetailVM {
    id: number;
    name: string;
    nameAr: string;
    serialNumber: string;
    //assetBarCode: string;
    barCode: string;
    barcode: string;
    masterAssetName: string;
    masterAssetNameAr: string;
    masterAssetId: number;
    roomNameAr: string;
    roomName: string;
    floorNameAr: string;
    floorName: string
    buildNameAr: string;
    buildName: string;
    assetStatus: string;
    assetStatusAr: string;
    assetStatusId: number;
    createdBy: string;
    model: string;
    brandName: string;
    brandNameAr: string;
}
export class GeneratedAssetDetailBCVM {
    barCode: string;
}
export class ViewAssetDetailVM {
    id: number;
    code: string;
    masterAssetId: number;
    masterCode: string;
    purchaseDate: string;
    price: string;
    serialNumber: string;
    remarks: string;
    barcode: string;
    barCode: string;
    installationDate: string;
    warrantyExpires: string;
    warrantyExpiresAr: string;
    room: string;
    floor: string;
    assetName: string;
    assetNameAr: string;
    supplierName: string;
    supplierNameAr: string;
    brandName: string;
    brandNameAr: string;
    hospitalName: string;
    originName: string;

    originNameAr: string;
    categoryName: string;
    subCategoryName: string;
    governorateName: string;
    governorateNameAr: string;
    cityName: string;
    cityNameAr: string;
    orgName: string;
    orgNameAr: string;
    subOrgName: string;
    subOrgNameAr: string;
    length: string;
    height: string;
    width: string;
    weight: string;
    modelNumber: string;
    versionNumber: string;
    description: string;
    descriptionAr: string;
    expectedLifeTime: string;
    hospitalNameAr: string;
    departmentName: string;
    departmentNameAr: string;
    buildId: number;
    buildName: string;
    buildNameAr: string;
    roomId: number;
    roomName: string;
    roomNameAr: string;
    floorId: number;
    floorName: string;
    floorNameAr: string;
    operationDate: string;
    receivingDate: string;
    poNumber: string;
    warrantyEnd: string;
    warrantyStart: string;
    depreciationRate: string;
    costCenter: string;
    assetImg: string;
    assetStatus: string;
    assetStatusAr: string;
    qrFilePath: string;
    hospitalId: number;
    createdBy: string;
    categoryNameAr: string;
    periorityName: string;
    periorityNameAr: string;
    remainWarrantyExpires: string;
    remainWarrantyExpiresAr: string;
    contractDate: string;
    contractStartDate: string;
    contractEndDate: string;
    listRequests: RequestVM[] = [];
    listWorkOrders: IndexWorkOrderVM[] = [];



    strPurchaseDate: string;
    strInstallationDate: string;
    strOperationDate: string;
    inContractAr: String;
    inContract: String;


    contractFrom: String;
    contractTo: String;

}
export class ViewAssetForReportVM {
    id: number;
    code: string;
    createdBy: string;
    masterCode: string;
    purchaseDate: string;
    price: string;
    serialNumber: string;
    remarks: string;
    barcode: string;
    installationDate: string;
    warrantyExpires: string;
    room: string;
    floor: string;
    assetName: string;
    assetNameAr: string;
    supplierName: string;
    supplierNameAr: string;
    brandName: string;
    brandNameAr: string;
    hospitalId: number;
    departmentId: number;
    brandId: number;
    hospitalName: string;
    originName: string;
    categoryName: string;
    subCategoryName: string;
    governorateName: string;
    governorateNameAr: string;
    cityName: string;
    cityNameAr: string;
    orgName: string;
    orgNameAr: string;
    subOrgName: string;
    length: string;
    height: string;
    width: string;
    weight: string;
    modelNumber: string;
    versionNumber: string;
    description: string;
    descriptionAr: string;
    expectedLifeTime: string;
    hospitalNameAr: string;
    departmentName: string;
    departmentNameAr: string;
    buildName: string;
    buildNameAr: string;
    roomName: string;
    roomNameAr: string;
    floorName: string;
    floorNameAr: string;
    operationDate: string;
    receivingDate: string;
    strReceivingDate: string;
    poNumber: string;
    warrantyEnd: string;
    warrantyStart: string;
    depreciationRate: string;
    costCenter: string;
    assetImg: string;

    // new added
    barCode: string;
    masterAssetId: number;
    responseTime: string;
    hasSpareParts: boolean;
    isChecked: boolean;
    serial: string;
    qrFilePath: string;
    model: string;
    masterImg: string;
    endWarrantyDate: string;
    buildingName: string;
    buildingNameAr: string;




    strPurchaseDate: string;
    strInstallationDate: string;
    strOperationDate: string;
    inContractAr: String;
    inContract: String;

    contractFrom: String;
    contractTo: String;

}
export class CreateAssetDetailAttachmentVM {
    assetDetailId: number;
    fileName: string;
    title: string;
    assetFile: any;
    hospitalId: number;
}
export class AssetDetailAttachmentVM {
    id: number;
    assetDetailId: number;
    fileName: string;
    title: string;
}
export class SearchHospitalAssetVM {
    governorateId: number;
    cityId: number;
    subOrganizationId: number;
    organizationId: number;
    originId: number;
    supplierId: number;
    brandId: number;
    hospitalId: number;
    departmentId: number;
    code: string;
    barCode: string;
    model: string;
    assetId: number;
    assetName: string;
    serial: string;
    userId: string;
    masterAssetId: number;

    masterAssetName: string;
    masterAssetNameAr: string;


    statusId: number;
    warrantyTypeId: number;
    contractTypeId: number;
    start: string;
    end: string;


    contractDate: string;
    contractStart: string;
    contractEnd: string;
}
export class AssetOwnerVM {
    assetDetailId: number;
    employeeId: number;
    hospitalId: number;
}
export class filterDto {
    id: number;
    name: string;
    brandName: string;
    cityName: string;
    hosName: string;
    govName: string;
    assetPeriorityName: string;
    categoryName: string;
    supplierName: string;
    purchaseDate: Date;
}
export class ListPMAssetTaskScheduleVM {
    id: number;
    assetName: string;
    assetNameAr: string;
    listTasks: any[];
    start: string;
    end: string;
    allDay: boolean;
    title: string;
    titleAr: string;
    textColor: string;
    color: string;
}
export class CountAssetVM {

    assetName: string;
    assetNameAr: string;
    assetPrice: number;
    countAssetsByHospital: number;

}
export class SortAssetDetailVM {
    Id: number;
    Code: string;
    barCode: string;
    assetName: string;
    assetNameAr: string;
    hospitalName: string;
    hospitalNameAr: string;
    governorateName: string;
    governorateNameAr: string;
    cityName: string;
    cityNameAr: string;
    orgName: string;
    orgNameAr: string;
    subOrgName: string;
    subOrgNameAr: string;
    sortStatus: string;
    serial: string;
    brand: string;
    brandName: string;
    brandNameAr: string;
    supplier: string;
    supplierName: string;
    supplierNameAr: string;

    statusId: number;
    hospitalId: number;
    governorateId: number;
    cityId: number;
    subOrganizationId: number;
    organizationId: number;
    originId: number;
    supplierId: number;
    brandId: number;
    masterAssetId: number;
    barCodeValue: string;
    serialValue: string;
    model: string;
    userId: string;
    departmentId: number;
    sortBy: string;
}
export class HospitalAssetAge {

    ageGroup: string;
    count: number;
}
export class FilterAssetDetail {
    id: number;
    name: string;
    statusId: number;
    categoryId: number;
    periorityId: number;
    brandId: number;
    supplierId: number;
    departmentId: number;
    masterAssetId: number;
    purchaseDateFrom: Date;
    purchaseDateTo: Date;
    start: string;
    end: string;
    userId: string;
    lang: string;
    printedBy: string;
    hospitalName: string;
    hospitalNameAr: string;
    selectedElement: string;

    // new added 
    assetName: String;
    assetNameAr: string;

    governorateId: number;
    cityId: number;
    hospitalId: number;
    hospitalIds: number[];
}
export class SearchHospitalAssetByGovernorateVM {
    userId: string;
    departmentId: number;
    governorateId: number;
    hospitalId: number;
}
export class SortAssetDetailsVM {
    assetName: string;
    assetNameAr: string;
    sortStatus: string;
    sortBy: string;
}
export class SortAndFilterVM {
    sortObj: SortAssetDetailVM;
    searchObj: SearchHospitalAssetVM;
    isSearchAndSort: boolean;

}