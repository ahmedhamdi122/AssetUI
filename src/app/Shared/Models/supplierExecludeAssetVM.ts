import { ListSupplierExecludeReasonVM } from "./supplierExecludeReasonVM";
import { ListSupplierHoldReasonVM } from "./supplierHoldReasonVM";

export class ListSupplierExecludeAssetVM {
    id: number;
    assetName: string;
    assetNameAr: string;

    barCode: string;
    modelNumber: string;
    serialNumber: string;

    statusId: string;
    execludeDate: string;
    exNumber: string;
    userName: string;
    reasonExTitles: string;
    reasonExTitlesAr: string;

    reasonHoldTitles: string;
    reasonHoldTitlesAr: string;
    appTypeId: number;

    statusIcon: string;
    statusColor: string;
    statusName: string;
    statusNameAr: string;

    isMoreThan3Months: boolean;
    diffMonths: number;

    hospitalName: string;
    hospitalNameAr: string;

    typeName: string;
    typeNameAr: string;


    brandName: string;
    brandNameAr: string;

    fixCost: number;
    costPerDay: number;
    allDays: number;
    totalCost: number;

    assetId: number;
}

export class CreateSupplierExecludeAssetVM {
    assetId: number;
    statusId: number;
    execludeDate: string;
    exNumber: string;
    userId: string;
    appNumber: string;
    reasonIds: number[];
    appTypeId: number;
    comment: string;
    id: number;
    hospitalId: number;
    masterAssetId: number;

}

export class EditSupplierExecludeAssetVM {
    id: number;
    assetId: number;
    statusId: number;
    execludeDate: string;
    date: string;
    exNumber: string;
    userId: string;
    memberId: string;
    reasonIds: number[];
    holdReasonIds: number[];
    appTypeId: number;

    assetName: string;
    assetNameAr: string;
    comment: string;
    hospitalId: number;
    governorateId: number;
    cityId: number;
    subOrganizationId: number;
    organizationId: number;
}

export class ViewSupplierExecludeAssetVM {
    id: number;
    execludeDate: string;
    date: string;
    exNumber: string;
    reasonNames: ListSupplierExecludeReasonVM[];
    holdReasonNames: ListSupplierHoldReasonVM[];
    //holdReasonNames: string[];
    hospitalId: number;
    assetName: string;
    assetNameAr: string;
    serialNumber: string;
    barCode: string;
    hospitalName: string;
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
    comment: string;
}

export class CreateSupplierExecludeAssetAttachmentVM {
    hospitalId: number;
    supplierExecludeId: number;
    fileName: string;
    title: string;
    file: any;
}
export class SupplierExecludeAssetAttachmentVM {
    id: number;
    supplierExecludeId: number;
    fileName: string;
    title: string;
}

export class SortSupplierExecludeAssetVM {
    assetName: string;
    assetNameAr: string;
    appNumber: string;
    date: string;
    statusId: number;
    statusName: string;
    statusNameAr: string;
    execludeDate: string;
    ReasonHoldTitles: string;
    ReasonHoldTitlesAr: string;
    sortStatus: string;
    reasonExTitles: string;
    reasonExTitlesAr: string;
    barCode: string;
    modelNumber: string;
    serialNumber: string;
    sortBy: string;
}
// export class ViewSupplierExecludeAssetAttachmentVM {
//     reasonId: number;
//     reasonName: string;
//     reasonNameAr: string;
//     attachments: any[];
// }

export class SearchSupplierExecludeAssetDateVM {
    userId: string;
    startDate: Date;
    endDate: Date;
    lang: string;
    strStartDate: string;
    strEndDate: string;
}

export class MainClass {
    results: ListSupplierExecludeAssetVM[];
    count: number;
}

export class SearchSupplierExecludeAssetVM {
    periorityId: number;
    code: string;
    barCode: string;
    modelNumber: string;
    serialNumber: string;
    statusId: number;
    masterAssetId: number;
    governorateId: number;
    cityId: number;
    hospitalId: number;
    start: string;
    end: string;
    subject: string;
    userId: string;
    departmentId: number;
    lang: string;
    assetName: string;
    serial: string;
    supplierId: number;
    brandId: number;
    originId: number;
    printedBy: string;
    hospitalNameAr: string;
    hospitalName: string;
    strStartDate: string;
    strEndDate: string;
    appTypeId: number;
}


export class SortAndFilterSupplierExecludeAssetVM {
    sortObj: SortSupplierExecludeAssetVM;
    searchObj: SearchSupplierExecludeAssetVM;
}