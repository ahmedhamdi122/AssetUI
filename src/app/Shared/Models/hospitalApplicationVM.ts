import { ListHospitalExecludeReasonVM } from "./hospitalExecludeReasonVM";
import { ListHospitalHoldReasonVM } from "./hospitalHoldReasonVM";

export class ListHospitalApplicationVM {
    id: number;
    assetId: number;
    assetName: string;
    assetNameAr: string;
    statusId: string;
    dueDate: string;
    date: string;
    appNumber: string;
    userName: string;
    barCode: string;
    code: string;
    modelNumber: string;
    serialNumber: string;
    appTypeId: number;
    hospitalId: number;

    reasonExTitles: string;
    reasonExTitlesAr: string;

    reasonHoldTitles: string;
    reasonHoldTitlesAr: string;

    statusIcon: string;
    statusColor: string;
    statusName: string;
    statusNameAr: string;

    typeName: string;
    typeNameAr: string;


    brandName: string;
    brandNameAr: string;

    fixCost: number;
    costPerDay: number;
    allDays: number;
    totalCost: number;
}

export class CreateHospitalApplicationVM {
    assetId: number;
    statusId: number;
    appTypeId: number;
    dueDate: string;
    appNumber: string;
    userId: string;
    comment: string;
    reasonIds: number[];
    id: number;
    hospitalId: number;
    governorateId: number;
    cityId: number;
    organizationId: number;
    subOrganizationId: number;
    masterAssetId: number;
}

export class EditHospitalApplicationVM {
    id: number;
    assetId: number;
    statusId: number;
    execludeDate: string;
    appDate: string;
    exNumber: string;
    hospitalId: number;
    dueDate: string;
    appNumber: string;
    comment: string;

    userId: string;
    appTypeId: number;
    reasonIds: number[];
    holdReasonIds: number[];
}

export class CreateHospitalApplicationAttachmentVM {
    hospitalReasonTransactionId: number;
    fileName: string;
    title: string;
    file: any;
    hospitalId: number;
}


export class HospitalApplicationAttachmentVM {
    id: number;
    hospitalReasonTransactionId: number;
    fileName: string;
    title: string;
    hospitalId: number;
    reasonNames: ListHospitalExecludeReasonVM[];
    holdReasonNames: ListHospitalHoldReasonVM[];

}
export class SortHospitalAppVM {
    assetName: string;
    assetNameAr: string;
    appNumber: string;
    date: string;
    statusName: string;
    statusNameAr: string;
    dueDate: string;
    ReasonHoldTitles: string;
    ReasonHoldTitlesAr: string;
    sortStatus: string;
    sortBy: string;
    typeName: string;
    typeNameAr: string;
    appDate: string;
    reasonExTitles: string;
    reasonExTitlesAr: string;
    barCode: string;
    modelNumber: string;
    serialNumber: string;

}

export class ViewHospitalApplicationVM {
    id: number;
    execludeDate: string;
    appNumber: string;
    reasonNames: ListHospitalExecludeReasonVM[];
    holdReasonNames: ListHospitalHoldReasonVM[];
    appDate: string;
    comment: string;
    hospitalId: number;
    assetName: string;
    assetNameAr: string;
    hospitalName: string;
    barCode: string;
    serialNumber: string;
    hospitalNameAr: string;
    govName: string;
    govNameAr: string;
    cityName: string;
    cityNameAr: string;
    subOrgName: string;
    subOrgNameAr: string;
    orgName: string;
    orgNameAr: string;
    appTypeName: string;
    appTypeNameAr: string;

    departmentName: string;
    departmentNameAr: string;
}


export class SearchHospitalApplicationDateVM {
    userId: string;
    startDate: Date;
    endDate: Date;
    lang: string;
    strStartDate: string;
    strEndDate: string;
    statusId: number;



    periorityId: number;
    code: string;
    barCode: string;
    modelNumber: string;
    serialNumber: string;
    masterAssetId: number;
    governorateId: number;
    cityId: number;
    hospitalId: number;
    start: string;
    end: string;
    subject: string;
    departmentId: number;
    assetName: string;
    serial: string;
    supplierId: number;
    brandId: number;
    originId: number;
    printedBy: string;
    hospitalNameAr: string;
    hospitalName: string;
    appTypeId: number;
}

export class MainClass {
    results: ListHospitalApplicationVM[];
    count: number;
}
export class SortAndFilterHospitalApplicationVM {
    searchObj: SearchHospitalApplicationDateVM;
    sortObj: SortHospitalAppVM;

}