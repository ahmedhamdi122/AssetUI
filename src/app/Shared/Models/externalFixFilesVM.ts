export class CreateExternalFixFileVM{
    id: number
    title: string
    fileName: string
    externalFixId: number;
    externalFixFile: any;
    hospitalId: number;
}
export class EditExternalFixFileVM {
    id: number
    title: string
    fileName: string
    externalFixId: number;
    hospitalId: number;
}
export class ListExternalFixFileVM {
    id: number
    title: string
    fileName: string
    externalFixId: number
    requestName: string;
    hospitalId: number;
    
}
