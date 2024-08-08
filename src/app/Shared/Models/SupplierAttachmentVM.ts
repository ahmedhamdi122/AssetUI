export class CreateSupplierAttachment {
    id: number
    title: string
    fileName: string
    supplierId: number;
    supplierFile: any;
}
export class EditSupplierAttachment {
    id: number
    title: string
    fileName: string
    supplierId: number;
}
export class ListSupplierAttachmentVM {
    id: number;
    title: string;
    fileName: string;
    supplierId: number;
}