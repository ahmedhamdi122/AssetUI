import { Time } from "@angular/common"
import { ListRequestDocumentVM } from "./RequestDocumentVM"

export class CreateRequestTracking {
    id: number
    description: string
    descriptionDate: Date;
    strDescriptionDate: string;
    requestStatusId: number;
    requestId: number;
    createdById: string;
    hospitalId: number;
}

export class EditRequestTracking {
    id: number
    description: string
    descriptionDate: Date
    requestStatusId: number
    requestId: number
    createdById: string;
    hospitalId: number;
}

export class IndexRequestTracking {
    id: number
    description: string
    descriptionDate: Date
    requestStatusId: number
    statusName: string
    createdById: string
    userName: string
    requestId: number
    subject: string
    requestCode: string
    requestDate: Date
    requestTime: Time
    requestModeId: number
    modeName: string
    assetDetailId: number
    serialNumber: string
    requestPeriorityId: number
    periorityName: string
    subProblemId: number
    subProblemName: string
    requestTypeId: number
    requestTypeName: string;

    assetNameAr: string;
    assetName: string;

}
export class RequestTrackingView {
    id: number
    description: string
    descriptionDate: Date
    requestStatusId: number
    statusName: string;
    statusNameAr: string;
    statusColor: string;
    statusIcon: string;
    createdById: string
    userName: string;
    assetName: string;
    assetNameAr: string;
}
export class RequestDetails {
    id: number
    description: string
    descriptionDate: Date
    requestStatusId: number
    statusName: string;
    statusNameAr: string;
    createdById: string;
    userName: string
    requestId: number
    subject: string
    requestCode: string
    requestDate: Date
    requestModeId: number
    modeName: string;
    modeNameAr: string
    assetDetailId: number
    serialNumber: string
    requestPeriorityId: number
    periorityName: string;
    periorityNameAr: string;
    problemId: number;
    problemName: string;
    problemNameAr: string;
    subProblemId: number
    subProblemName: string;
    subProblemNameAr: string;
    requestTypeId: number
    requestTypeName: string;
    requestTypeNameAr: string
    assetName: string;
    assetNameAr: string;
    assetCode: string;
    barcode: string;
    hospitalId: number;
    wONotes: string;

    departmentName: string;
    departmentNameAr: string;


    lstTracking: RequestTrackingView[]
}




export class IndexRequestTrackingVM {
    id: number;
    description: string;
    date: string;
    descriptionDate: string;
    requestDate: Date;
    statusId: string;
    statusName: string;
    statusNameAr: string;
    isExpanded: boolean;
    listDocuments: ListRequestDocumentVM[];
}