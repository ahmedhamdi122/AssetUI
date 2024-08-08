import { ListPMAssetTaskVM } from "./MasterAssetVM";

export class MainClass {
    results: ListManfacturerPMAssetVM[];
    count: number;
    totalCount: number;
    countDone: number;
    countNotDone: number;
}


export class ListManfacturerPMAssetVM {
    id: number;
    pmDate: string;
    isDone: boolean;
    doneDate: Date;
    dueDate: Date;
    assetDetailId: number;
    hospitalId: number;
    barCode: string;
    modelNumber: string;
    serialNumber: string;
    departmentName: string;
    departmentNameAr: string;
    assetName: string;
    assetNameAr: string;
}

export class SearchManfacturerAssetTimeVM {
    barcode: string;
    modelNumber: string;
    serialNumber: string;
    governorateId: number;
    cityId: number;
    organizationId: number;
    subOrganizationId: number;
    hospitalId: number;
    userId: string;
    departmentId: number;
    brandId: number;
    dueDate: string;
    doneDate: string;
    pmDate: string;
}


export class SortManfacturerPMAssetTimeVM {
    //barcode: string;
    barCode: string;
    modelNumber: string;
    serialNumber: string;
    assetName: string;
    assetNameAr: string;
    userId: string;
    departmentId: number;
    brandId: number;
    dueDate: string;
    doneDate: string;
    pmDate: string;
    isDone: string;


    strSerialNumber: string;
    strBarCode: string;
    strModelNumber: string;


    sortStatus: string;
}


export class ViewManfacturerPMAssetTimeVM {
    id: number;
    pmDate: string;
    isDone: boolean;
    doneDate: Date;
    dueDate: Date;
    assetDetailId: number;
    hospitalId: number;
    barCode: string;
    modelNumber: string;
    serialNumber: string;
    departmentName: string;
    departmentNameAr: string;
    assetName: string;
    assetNameAr: string;

    hospitalName: string;
    hospitalNameAr: string;

    supplierName: string;
    supplierNameAr: string;

    brandName: string;
    brandNameAr: string;
    listMasterAssetTasks: ListPMAssetTaskVM[];
}


export class ListUnScheduledManfacturerPMAssetVM {

    assetDetailId: number;
    unscheduledReason: string;
    unscheduledReasonAR: string;
    brandName: string;
    brandNameAR: string;
    brandCode: string;
    modelNumber: string;
    serialNumber: string;
    barcode: string;
    assetName: string;
    assetNameAR: string;

}

export class UnScheduledMainClass {
    results: ListUnScheduledManfacturerPMAssetVM[];
    count: number;
}




export class CalendarManfacturerPMAssetTimeVM {

    id: number;
    start: string;
    end: string;
    allDay: boolean;
    title: string;
    titleAr: string;
    textColor: string;
    color: string;
    listMasterAssetTasks: ListPMAssetTaskVM[];

}

export class EditManfacturerPMAssetTimeVM {
    id: number;
    pmDate: Date;
    isDone: boolean;
    doneDate: Date;
    dueDate: Date;
    assetDetailId: number;
    hospitalId: number;
    comment: string;
    agencyId: number;
    strDueDate: string;
    strDoneDate: string;
}

export class FilterAssetTimeVM {
    yearQuarter: any;
    isDone: boolean;
}
