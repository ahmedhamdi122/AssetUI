import { ListRequestVM, OpenRequestVM, SearchRequestVM } from "./requestModeVM"

export class lstRequests {
    id: number
    subject: string
    requestCode: string
    description: string
    requestDate: Date
    requestTime: any
    problemId: number
    subProblemId: number
    subProblemName: string
    masterAssetId: number
    assetDetailId: number
    serialNumber: string
    requestPeriorityId: number;
    periorityName: string
    createdById: string
    createdBy: string
    requestModeId: number
    modeName: string
    requestTypeId: number
    requestTypeName: string
    requestTrackingId: number;
    requestStatusId: number;
}
export class CreateRequest {
    // id: number
    subject: string
    requestCode: string
    description: string
    requestDate: Date;
    strRequestDate: string;
    requestTime: any
    problemId: number
    subProblemId?: number
    masterAssetId: number
    assetDetailId: number
    serialNumber: string;
    hospitalId: number;
    requestStatusId: number;
    requestPeriorityId: number
    createdById: string
    requestModeId: number
    requestTypeId: number;
    departmentId: number;
}
export class EditRequest {
    id: number
    subject: string
    requestCode: string
    description: string
    requestDate: Date
    requestTime: any
    problemId: number
    subProblemId: number
    subProblemName: string
    masterAssetId: number
    assetDetailId: number
    serialNumber: string
    requestPeriorityId: number;
    requestStatusId: number;
    periorityName: string
    createdById: string
    createdBy: string
    requestModeId: number
    modeName: string
    requestTypeId: number
    requestTypeName: string
    requestTrackingId: number;
    assetCode: string;
    barcode: string;
    hospitalId: number;
}
export class RequestVM {
    id: number;
    subject: string;
    requestCode: string;
    description: string;
    requestDate: Date;
    requestTime: any;
    problemId: number;
    subProblemId: number;
    subProblemName: string;
    subProblemNameAr: string;
    requestTypeNameAr: string;
    masterAssetId: number;
    assetDetailId: number;
    serialNumber: string;
    requestPeriorityId: number;
    periorityName: string;
    createdById: string;
    createdBy: string;
    requestModeId: number;
    modeName: string;
    requestTypeId: number;
    requestTypeName: string;
    requestTrackingId: number;
    requestStatusId: number;
    hospitalId: number;
    assetName: string;
    assetNameAr: string;
    assetCode: string;
    barcode: string;
}
export class ViewRequestVM {
    id: number
    description: string
    descriptionDate: Date
    statusName: string;
    statusNameAr: string
    createdById: string
    userName: string
    subject: string
    requestCode: string
    requestDate: Date
    modeName: string;
    modeNameAr: string
    serialNumber: string
    periorityName: string;
    periorityNameAr: string
    subProblemName: string;
    subProblemNameAr: string;
    requestTypeName: string;
    requestTypeNameAr: string
    assetName: string;
    assetNameAr: string;
    assetDetailId: number;
}

export class GeneratedRequestNumberVM {
    requestCode: string;
}
export class SortRequestVM {
    userId: string;
    requestCode: string;
    barCode: string;
    assetId: number;
    hospitalId: number;
    assetName: string;
    assetNameAr: string;
    subject: string;
    requestDate: string;
    periorityNameAr: string;
    periorityName: string;
    statusName: string;
    statusNameAr: string;
    modeName: string;
    modeNameAr: string;
    sortStatus: string;
    closedDate: string;
    createdBy: string;
    serial: string;
    description: string;
    strSerial: string;
    strSubject: string;
    strRequestCode: string;
    strBarCode: string;
    strModel: string;
    periorityId: number;
    statusId: number;
    masterAssetId: number;
    woLastTrackDescription: string;
    sortBy: string;
}

export class ReportRequestVM {
    id: number;
    requestNumber: string;
    startRequestDate: string;
    initialWorkOrderDate: string;
    startWorkOrderDate: string;
    durationBetweenStartRequestWorkOrder: string;
    firstStepInTrackWorkOrderInProgress: string;
    lastStepInTrackWorkOrderInProgress: string;
    durationBetweenWorkOrders: string;
    closedWorkOrderDate: string;
    closeRequestDate: string;
    durationTillCloseDate: string;
}

export class MainClass {
    results: ListRequestVM[];
    count: number;
    countClosed: number;


    highCount: number;
    mediumCount: number;
    normalCount: number;
    medicalCount: number;
    productionCount: number;
    totalCount: number;
}



export class MainClass2 {
    results: OpenRequestVM[];
    count: number;
}
export class SortAndFilterRequestVM {
    sortObj: SortRequestVM;
    searchObj: SearchRequestVM;
}