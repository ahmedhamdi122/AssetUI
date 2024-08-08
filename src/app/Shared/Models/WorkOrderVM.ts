import { IndexWorkOrderTrackingVM } from "./WorkOrderTrackingVM"

export class IndexWorkOrderVM {
    id: number
    subject: string
    workOrderNumber: string;
    barCode: string;
    creationDate: Date;
    closedDate: Date;
    plannedStartDate: Date
    plannedEndDate: Date
    actualStartDate: Date
    actualEndDate: Date
    note: string
    createdById: string
    createdBy: string
    workOrderPeriorityId: number
    workOrderPeriorityName: string;
    workOrderPeriorityNameAr: string;
    workOrderTypeId: number
    workOrderTypeName: string
    requestId: number
    requestSubject: string;
    requestNumber: string;
    workOrderSubject: string
    workOrderTrackingId: number
    workOrderStatusId: number;
    masterAssetId: number;
    hospitalId: number;

    periorityName: string;
    periorityNameAr: string;

    typeName: string;
    typeNameAr: string;

    governorateId: number;
    cityId: number;
    subOrganizationId: number;
    organizationId: number;

    assetName: string;
    assetNameAr: string;

    statusNameAr: string;
    statusName: string;

    brandNameAr: string;
    brandName: string;

    departmentNameAr: string;
    departmentName: string;
    supplierNameAr: string;
    supplierName: string;
    modelNumber: string;
    serialNumber: string;
    workOrderTypeNameAr: string;
    listTracks: IndexWorkOrderTrackingVM[];




    warrantyStart: string;
    warrantyEnd: string;
    warrantyExpires: string;
    purchaseDate: string;
    installationDate: string;
    operationDate: string;
    receivingDate: string;
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


    lang: string;
    printedBy: string;
    hospitalName: string;
    hospitalNameAr: string;


    userName: string;

    departmentId:number;
    brandId:number;
    
}

export class PrintPDFWorkOrderVM {
    lang: string;
    printedBy: string;
    hospitalName: string;
    hospitalNameAr: string;
}
export class ExportWorkOrderVM {
    id: number
    subject: string
    workOrderNumber: string;
    barCode: string;
    creationDate: Date;
    closedDate: Date;
    plannedStartDate: Date
    plannedEndDate: Date
    actualStartDate: Date
    actualEndDate: Date
    note: string
    createdById: string
    createdBy: string
    workOrderPeriorityId: number
    workOrderPeriorityName: string;
    workOrderPeriorityNameAr: string;
    workOrderTypeId: number
    workOrderTypeName: string
    requestId: number
    requestSubject: string;
    requestNumber: string;
    workOrderSubject: string
    workOrderTrackingId: number
    workOrderStatusId: number;
    masterAssetId: number;
    hospitalId: number;
    periorityName: string;
    periorityNameAr: string;
    typeName: string;
    typeNameAr: string;
    governorateId: number;
    cityId: number;
    subOrganizationId: number;
    organizationId: number;
    assetName: string;
    assetNameAr: string;
    statusNameAr: string;
    statusName: string;
    brandNameAr: string;
    brandName: string;
    departmentNameAr: string;
    departmentName: string;
    supplierNameAr: string;
    supplierName: string;
    modelNumber: string;
    serialNumber: string;
    workOrderTypeNameAr: string;
    listTracks: IndexWorkOrderTrackingVM[];
    warrantyStart: string;
    warrantyEnd: string;
    warrantyExpires: string;
    purchaseDate: string;
    installationDate: string;
    operationDate: string;
    receivingDate: string;
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
    lang: string;
    printedBy: string;
    hospitalName: string;
    hospitalNameAr: string;
}
export class EditWorkOrderVM {
    id: number
    subject: string
    workOrderNumber: string
    creationDate: Date
    plannedStartDate: Date
    plannedEndDate: Date
    actualStartDate: Date
    actualEndDate: Date
    note: string
    createdById: string
    workOrderPeriorityId: number
    workOrderTypeId: number
    requestId: number
    workOrderStatusId: number
    workOrderTrackingId: number;
    masterAssetId: number;
    hospitalId: number;
    barCode: string;
    periorityName: string;
    periorityNameAr: string;
    typeName: string;
    typeNameAr: string;
    governorateId: number;
    cityId: number;
    subOrganizationId: number;
    organizationId: number;
    workOrderTypeName: string;
    workOrderTypeNameAr: string;
}
export class CreateWorkOrderVM {
    id: number;
    subject: string;
    workOrderNumber: string;
    //creationDate: Date;
    creationDate: string;
    plannedStartDate: string;
    plannedEndDate: string;
    actualStartDate: string;
    actualEndDate: string;
    note: string;
    createdById: string
    workOrderPeriorityId: number
    workOrderTypeId: number
    requestId: number;
    assignedTo: string;
    barCode: string;
    hospitalId: number;
}
export class GeneratedWorkOrderNumberVM {
    woNumber: string;
}
export class ListWorkOrderVM {
    id: number
    subject: string;
    requestSubject: string;
    workOrderNumber: string
    creationDate: Date;
    firstTrackDate: Date;
    closedDate: Date;
    plannedStartDate: Date
    plannedEndDate: Date
    actualStartDate: Date
    actualEndDate: Date
    note: string
    createdById: string
    createdBy: string
    periorityName: string;
    periorityNameAr: string;
    workOrderTypeId: number
    typeName: string;
    typeNameAr: string;
    statusName: string;
    statusNameAr: string;
    statusColor: string;
    statusId: number;
    requestId: number;
    workOrderTrackingId: number
    workOrderStatusId: number;
    existStatusId: boolean;
    elapsedTime: string;
    barCode: string;
    serialNumber: string;
    modelNumber: string;
    supplierName: string;
    supplierNameAr: string;
    assetName: string;
    assetNameAr: string;
    brandName: string;
    brandNameAr: string;
    departmentName: string;
    departmentNameAr: string;
    listTracks: IndexWorkOrderTrackingVM[];
    warrantyStart: string;
    warrantyEnd: string;
    warrantyExpires: string;
    purchaseDate: string;
    installationDate: string;
    operationDate: string;
    receivingDate: string;
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
}
export class PrintWorkOrderVM {
    id: number
    subject?: string;
    masterAssetCode: string;
    assetCode: string;
    barCode: string;
    assetBarCode: string;
    workOrderNumber?: string
    creationDate: Date;
    closedDate: string;
    creationDate1: string;
    plannedStartDate?: Date
    plannedEndDate?: Date
    note?: string;
    createdBy?: string
    periorityName?: string;
    periorityNameAr?: string;
    typeName?: string;
    typeNameAr?: string;
    brandName: string;
    brandNameAr: string;
    requestSubject?: string;
    requestDate?: string;
    requestCode?: string;
    requestTypeName?: string;
    requestTypeNameAr?: string;
    modeName?: string;
    modeNameAr?: string;
    problemName?: string;
    problemNameAr?: string;
    subProblemName?: string;
    subProblemNameAr?: string;
    requestTypeNameName?: string;
    requestTypeNameNameAr?: string;
    assetSerial?: string;
    assetName?: string;
    assetNameAr?: string;
    hospitalName?: string;
    hospitalNameAr?: string;
    serialNumber?: string;
    modelNumber: string;
    firstRequest: string;
    lastWorkOrder: string;
    lstWorkOrderTracking: IndexWorkOrderTrackingVM[]
}
export class SearchWorkOrderVM {
    //periorityId: number;
    woNumber: string;
    statusId: number;
    modeId: number;
    assetDetailId: number;
    masterAssetId: number;
    barCode: string;
    serialNumber: string;
    modelNumber: string;
    governorateId: number;
    cityId: number;
    organizationId: number;
    subOrganizationId: number;
    hospitalId: number;
    requestSubject: string;
    start: string;
    end: string;
    subject: string;
    userId: string;
    departmentId: number;
}
export class sortWorkOrdersVM {
    workOrderNumber: string;
    statusName: string;
    statusNameAr: string;
    subject: string;
    createdBy: string;
    note: string;
    creationDate: string;
    closedDate: string;
    requestSubject: string;
    sortStatus: string;
    barCode: string;
    masterAssetId: number;
    assetName: string;
    assetNameAr: string;
    serialNumber: string;
    modelNumber: string;
    elapsedTime: string;
    strSerial: string;
    strSubject: string;
    strRequestSubject: string;
    strWorkOrderNumber: string;
    strBarCode: string;
    strModel: string;
    periorityId: number;
    statusId: number;
}


export class SortWorkOrderVM {
    workOrderNumber: string;
    statusName: string;
    statusNameAr: string;
    subject: string;
    createdBy: string;
    note: string;
    creationDate: string;
    closedDate: string;
    requestSubject: string;
    sortStatus: string;
    barCode: string;
    masterAssetId: number;
    assetName: string;
    assetNameAr: string;
    serialNumber: string;
    modelNumber: string;
    elapsedTime: string;
    strSerial: string;
    strSubject: string;
    strRequestSubject: string;
    strWorkOrderNumber: string;
    strBarCode: string;
    strModel: string;
    periorityId: number;
    statusId: number;
    sortBy: string;
}
export class SearchWorkOrderDateVM {
    userId: string;
    startDate: Date;
    endDate: Date;
    statusId: number;
    strStartDate: string;
    strEndDate: string;
    lang: string;
    printedBy: string;
    hospitalName: string;
    hospitalNameAr: string;
    statusName: string;

    governorateId: number;
    cityId: number;
    organizationId: number;
    subOrganizationId: number;
    hospitalId: number;

}
export class MainClass {
    results: ListWorkOrderVM[];
    count: number;
}

export class SortAndFilterWorkOrderVM {
    sortObj: SortWorkOrderVM;
    searchObj: SearchWorkOrderVM;
}