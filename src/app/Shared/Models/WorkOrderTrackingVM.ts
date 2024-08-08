export class IndexWorkOrderStatusVM {
    id: number
    workOrderDate: Date
    creationDate: Date
    notes: string
    createdById: string
    workOrderStatusId: number
    workOrderId: number
}
export class EditWorkOrderTrackingVM {
    id: number
    workOrderDate: Date
    creationDate: Date
    notes: string
    createdById: string
    workOrderStatusId: number
    workOrderId: number
}
export class WorkOrderTrackingVM {
    id: number
    notes: string
    createdById: string
    workOrderId: number
}


export class CreateWorkOrderTrackingVM {
    id: number;
    workOrderDate: Date
    strWorkOrderDate: string;
    creationDate: string;
    notes: string
    createdById: string
    workOrderStatusId: number
    workOrderId: number;
    assignedTo?: string;
    actualStartDate: string;
    actualEndDate: string;
    plannedStartDate: string;
    plannedEndDate: string;
    hospitalId: number;
}
export class IndexWorkOrderTrackingVM {
    id: number;
    trackId: number;
    workOrderDate: Date
    creationDate: Date
    notes: string
    createdById: string;
    createdBy: string;
    workOrderStatusId: number
    workOrderStatusName: string;
    workOrderStatusNameAr: string;

    statusId: number;
    statusName: string;
    statusNameAr: string;

    assignedToName: string;
    workOrderId: number
    workOrderSubject: string;
    createdTo: string;
    assignedTo: string;
    actualStartDate: string;
    actualEndDate: string;


    plannedStartDate: string;
    plannedEndDate: string;

    closedDate: string;

}
export class ListWorkOrderFromTrackingVM {
    id: number;
    trackId: number;
    workOrderDate: Date
    creationDate: Date
    notes: string
    createdById: string
    createdBy: string
    workOrderStatusId: number
    statusName: string;
    workOrderId: number
    workOrderSubject: string
    assignedTo: string;
    assignedToName: string;
    subject: string
    workOrderNumber: string
    plannedStartDate: Date
    plannedEndDate: Date
    actualStartDate: Date
    actualEndDate: Date
    note: string
    workOrderPeriorityId: number
    workOrderPeriorityName: string
    workOrderTypeId: number
    workOrderTypeName: string
    requestId: number
    requestSubject: string
    workOrderTrackingId: number;
    serialNumber: string
}
export class WorkOrderDetails {
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
    createdBy: string
    workOrderPeriorityId: number
    workOrderPeriorityName: string;
    workOrderPeriorityNameAr: string;
    workOrderTypeId: number
    workOrderTypeName: string
    requestId: number
    requestSubject: string
    workOrderSubject: string
    workOrderTrackingId: number
    masterAssetId: number
    lstWorkOrderTracking: IndexWorkOrderTrackingVM[]

}