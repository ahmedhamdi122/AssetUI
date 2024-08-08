export class IndexWorkOrderAssignVM {
    id: number
    comment: string
    assetWorkOrderAssignId: number
    workOrderId: number
    workOrderSubject: string
    assetWorkOrderAssignName: string
}
export class EditWorkOrderAssignVM {
    id: number
    comment: string
    assetWorkOrderAssignId: number
    workOrderId: number
}
export class CreateWorkOrderAssignVM {
    wOTId: number
    supplierId: number
    userId: string
    createdDate: Date
    createdBy: string
    notes: string
}
export class CreateAssigns {
    assetWorkOrderAssignId: number
    comment: string
}