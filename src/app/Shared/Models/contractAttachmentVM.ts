export class CreateContractAttachmentVM {
    id: number
    documentName: string
    fileName: string
    masterContractId: number;
    contractFile: any;
    hospitalId: number;
}
export class EditContractAttachmentVM {
    id: number
    documentName: string
    fileName: string
    contractId: number
}
export class ListContractAttachmentVM {
    id: number
    documentName: string
    fileName: string
    masterContractId: number;
}