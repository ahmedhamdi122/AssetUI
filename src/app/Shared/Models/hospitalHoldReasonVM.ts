import { HospitalApplicationAttachmentVM } from "./HospitalApplicationVM";

export class ListHospitalHoldReasonVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;
    lstHospitalDocuments: HospitalApplicationAttachmentVM[];
}

export class CreateHospitalHoldReasonVM {
    code: string;
    name: string;
    nameAr: string;
    governorateId: number;

}

export class EditHospitalHoldReasonVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;
    governorateId: number;
}






