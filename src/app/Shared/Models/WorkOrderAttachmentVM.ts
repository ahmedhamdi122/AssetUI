export class IndexWorkOrderAttachmentVM {
    id: number
    documentName: string
    fileName: string
    workOrderTrackingId: number
}
export class EditWorkOrderAttachmentVM {
    id: number
    documentName: string
    fileName: string
    workOrderTrackingId: number
}
export class CreateWorkOrderAttachmentVM {
    documentName: string
    fileName: string
    workOrderTrackingId: number;
    workOrderFile: any;
    hospitalId: number;
}