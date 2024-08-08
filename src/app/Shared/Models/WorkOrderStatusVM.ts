export class ListWorkOrderStatusVM {
    id: number;
    name: string;
    nameAr: string;
    code: string;
    color: string;
    icon: string;

    countAssigned: number;
    countInProgress: number;
    countExternalSupport: number;
    countSparePart: number;
    countEscalate: number;
    countPending: number;
    countDone: number;
    countReview: number;
    countReAssigned: number;
    countTechApprove: number;
    countUserApprove: number;
    countClosed: number;
    countAll: number;


    listStatus: WorkOrderStatus[];


}
export class EditWorkOrderStatusVM {
    id: number
    name: string
    nameAr: string
    code: string;
    color: string;
    icon: string;
}
export class CreateWorkOrderStatusVM {
    name: string
    nameAr: string
    code: string;
    color: string;
    icon: string;
}

export class WorkOrderStatus {
    name: string
    nameAr: string
    code: string;
    color: string;
    icon: string;
}


export class SortWOStatusVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;
    sortStatus: string;
}
