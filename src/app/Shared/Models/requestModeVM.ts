import { IndexRequestTrackingVM } from "./RequestTrackingVM"
import { IndexWorkOrderTrackingVM } from "./WorkOrderTrackingVM";
import { IndexWorkOrderVM } from "./WorkOrderVM";

export class ListRequestModeVM {
    id: number;
    name: string;
    nameAr: string;
}


export class RequestModeVM {
    id: number;
    name: string;
    nameAr: string;
}

export class ListRequestVM {
    id: number;
    requestId: number
    subject: string
    code: string
    requestDate: Date
    masterAssetId: number
    assetDetailId: number
    serialNumber: string;
    periorityId: number
    periorityName: string;
    periorityNameAr: string;
    periorityColor: string;
    periorityIcon: string;
    createdById: string
    createdBy: string
    requestModeId: number
    modeName: string;
    modeNameAr: string;
    assetName: string;
    assetNameAr: string;
    barCode: string;
    barcode: string;
    description: string;
    requestTypeName: string;
    requestTypeNameAr: string;
    subProblemName: string;
    subProblemNameAr: string;
    requestCode: string;
    statusId: number;
    statusName: string;
    statusNameAr: string;
    statusColor: string;
    statusIcon: string;
    countListTracks: number;
    countWorkOrder: number;
    latestWorkOrderStatusId: number;
    elapsedTime: string;
    woLastTrackDescription: string;
    listTracks: IndexRequestTrackingVM[];
    listWorkOrder: IndexWorkOrderVM[] = [];
    assetCode: string;
    closedDate: string;
    workOrderSubject: string;
    workOrderNumber: string;
    creationDate: string;
    plannedStartDate: string;
    plannedEndDate: string;
    actualStartDate: string;
    actualEndDate: string;
    workOrderNote: string;
    assignedTo: string;
    woCreatedBy: string;
    woPeriorityName: string;
    woPeriorityNameAr: string;
    workOrderTypeName: string;
    workOrderTypeNameAr: string;
    workOrderStatusName: string;
    workOrderStatusNameAr: string;
    workOrderStatusIcon: string;
    workOrderStatusColor: string;
    modelNumber: string;
    supplierNameAr: string;
    supplierName: string;
    requestTrackDescription: string;
    count: number;

    brandName: string;
    brandNameAr: string;
    departmentName: string;
    departmentNameAr: string;



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

    bgColor: string;

    color: string;
    descriptionDate: Date;



    workOrderDate: string;
}


export class ExportRequestVM {
    id: number;
    requestId: number
    subject: string
    code: string
    requestDate: Date
    masterAssetId: number
    assetDetailId: number
    serialNumber: string;
    periorityId: number
    periorityName: string;
    periorityNameAr: string;
    periorityColor: string;
    periorityIcon: string;
    createdById: string
    createdBy: string
    requestModeId: number
    modeName: string;
    modeNameAr: string;
    assetName: string;
    assetNameAr: string;
    barCode: string;
    barcode: string;
    description: string;
    requestTypeName: string;
    requestTypeNameAr: string;
    subProblemName: string;
    subProblemNameAr: string;
    requestCode: string;
    statusId: number;
    statusName: string;
    statusNameAr: string;
    statusColor: string;
    statusIcon: string;
    countListTracks: number;
    countWorkOrder: number;
    latestWorkOrderStatusId: number;
    elapsedTime: string;
    woLastTrackDescription: string;
    listTracks: IndexRequestTrackingVM[];
    listWorkOrder: IndexWorkOrderVM[] = [];
    assetCode: string;
    closedDate: string;
    workOrderSubject: string;
    workOrderNumber: string;
    creationDate: string;
    plannedStartDate: string;
    plannedEndDate: string;
    actualStartDate: string;
    actualEndDate: string;
    workOrderNote: string;
    assignedTo: string;
    woCreatedBy: string;
    woPeriorityName: string;
    woPeriorityNameAr: string;
    workOrderTypeName: string;
    workOrderTypeNameAr: string;
    workOrderStatusName: string;
    workOrderStatusNameAr: string;
    workOrderStatusIcon: string;
    workOrderStatusColor: string;
    modelNumber: string;
    supplierNameAr: string;
    supplierName: string;
    requestTrackDescription: string;
    count: number;

    brandName: string;
    brandNameAr: string;
    departmentName: string;
    departmentNameAr: string;



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
    bgColor: string;
    lang: string;
    hospitalName: string;
    hospitalNameAr: string;
    printedBy: string;
}


export class SearchRequestVM {

    periorityId: number;
    code: string;
    barcode: string;
    modelNumber: string;
    serialNumber: string;
    statusId: number;
    modeId: number;
    assetDetailId: number;
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
    userName: string;
    assetOwnerId: number;
    departmentId: number;
    woLastTrackDescription: string;


    lang: string;
    hospitalName: string;
    hospitalNameAr: string;
    printedBy: string;
    strEndDate: string;
    strStartDate: string;
}

export class PrintServiceRequestVM {
    id: number;
    subject: string;
    masterAssetCode: string;
    assetCode: string;
    assetBarCode: string;
    workOrderNumber?: string
    creationDate?: Date
    plannedStartDate?: Date
    plannedEndDate?: Date
    note?: string;
    requestNote: string;
    createdBy?: string
    periorityName?: string;
    periorityNameAr?: string;
    typeName: string;
    typeNameAr: string;


    requestSubject: string;
    requestDate: string;
    lastRequestDate: string;

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

    workOrderSubject: string;

    assetSerial?: string;
    assetName?: string;
    assetNameAr?: string;
    hospitalName?: string;
    hospitalNameAr?: string;
    serialNumber?: string;


    brandName: string;
    brandNameAr: string;
    departmentName: string;
    departmentNameAr: string;
    buildingName: string;
    buildingNameAr: string;
    floorName: string;
    floorNameAr: string;
    roomName: string;
    roomNameAr: string;
    modelNumber: string;

    lstWorkOrderTracking: IndexWorkOrderTrackingVM[];
    requestTrackingList: IndexRequestTrackingVM[];
}


export class SearchRequestDateVM {
    userId: string;
    startDate: Date;
    endDate: Date;

    strStartDate: string;
    strEndDate: string;
    lang: string;

    hospitalName: string;
    hospitalNameAr: string;
    printedBy: string;
    statusId: number;
    hospitalId: number;
    statusName: string;
    statusNameAr: string;



}



export class SearchOpenRequestVM {
    strStartDate: string;
    strEndDate: string;

    startDate: Date;
    endDate: Date;

    printedBy: string;
    hospitalNameAr: string;
    hospitalName: string;
    lang: string;
    userId: string;
    hospitalId: number;
}
export class OpenRequestVM {


    id: number;
    requestDate: Date;
    requestCode: string;
    createdById: string;
    createdBy: string;
    assetName: string;
    assetNameAr: string;

    brandName: string;
    brandNameAr: string;
    bgColor: string;

    barcode: string;
    serialNumber: string;
    assetDetailId: number;
    hospitalId: number;
    modelNumber: string;
    fixCost: number;
    costPerDay: number;
    allDays: number;
    lastWOFixedDate: Date;
    totalCost: number;

    requestStatusId: number;
    requestStatusName: string;
    requestStatusNameAr: string;
    requestStatusColor: string;
    requestStatusIcon: string;

    workOrderStatusId: number;
    workOrderStatusName: string;
    workOrderStatusNameAr: string;
    workOrderStatusColor: string;
    workOrderStatusIcon: string;

    governorateId: number;
    cityId: number;
    organizationId: number;
    subOrganizationId: number;
}
