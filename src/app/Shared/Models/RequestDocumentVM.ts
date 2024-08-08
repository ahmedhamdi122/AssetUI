export class CreateRequestDocument {
    id: number
    documentName: string
    fileName: string
    requestTrackingId: number;
    requestFile: any;
    hospitalId: number;
}
export class EditRequestDocument {
    id: number
    documentName: string
    fileName: string
    requestTrackingId: number;
    hospitalId: number;
}
export class ListRequestDocumentVM {
    id: number
    documentName: string
    fileName: string
    requestTrackingId: number
    requestName: string;
    hospitalId: number;
}