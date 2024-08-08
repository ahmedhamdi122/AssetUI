import { ListSupplierExecludeReasonVM } from "./supplierExecludeReasonVM";
import { ListSupplierHoldReasonVM } from "./SupplierHoldReasonVM";

export class ListSupplierExecludeVM {
    id: number;
    assetName: string;
    assetNameAr: string;
    statusId: string;
    execludeDate: string;
    exNumber: string;
    userName: string;
    reasonExTitles: string;
    reasonExTitlesAr: string;

    reasonHoldTitles: string;
    reasonHoldTitlesAr: string;
    appTypeId: number;

    statusName: string;
    statusNameAr: string;

    isMoreThan3Months: boolean;
    diffMonths: number;

}

export class CreateSupplierExecludeVM {
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

}

export class EditSupplierExecludeVM {
    id: number;
    assetId: number;
    statusId: number;
    execludeDate: string;
    date: string;
    exNumber: string;
    userId: string;

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

export class ViewSupplierExecludeVM {
    id: number;
    execludeDate: string;
    exNumber: string;
    reasonNames: ListSupplierExecludeReasonVM[];
    holdReasonNames: ListSupplierHoldReasonVM[];
    hospitalId: number;
    assetName: string;
    assetNameAr: string;
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


export class CreateSupplierExecludeAttachmentVM {
    supplierExecludeAssetId: number;
    fileName: string;
    title: string;
    file: any;
}


export class SupplierExecludeAttachmentVM {
    id: number;
    supplierExecludeId: number;
    fileName: string;
    title: string;
}

export class SortSupplierExecludeVM {
    assetName: string;
    assetNameAr: string;
    appNumber: string;
    date: string;
    statusName: string;
    statusNameAr: string;
    execludeDate: string;
    ReasonHoldTitles: string;
    ReasonHoldTitlesAr: string;
    sortStatus: string;
    reasonExTitles: string;
    reasonExTitlesAr: string;
}



export class SupplierExecludeVM {

    id: number;
    supplierExecludeAssetId: number;
    reasonId: number;
    hospitalId: number;
}