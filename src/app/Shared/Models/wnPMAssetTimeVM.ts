import { ListPMAssetTaskVM } from "./MasterAssetVM";

export class MainClass {
    results: ListWNPMAssetTimeVM[];
    count: number;

    countDone: number;
    countNotDone: number;
}
export class ListWNPMAssetTimeVM {
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

export class CreateWNPMAssetTimeVM {
    id: number;
    pmDate: Date;
    isDone: boolean;
    doneDate: Date;
    dueDate: Date;
    assetDetailId: number;
    hospitalId: number;
}

export class EditWNPMAssetTimeVM {
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

export class SearchAssetTimeVM {
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


export class SortAssetTimeVM {
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


export class YearQuarters {
    quarterOfYearName: string;
    quarterName: string;
    yearQuarter: number;


    firstDayStart: string;
    year: number;
    baseYear: number;
}


export class ViewWNPMAssetTimeVM {
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

export class FilterAssetTimeVM {
    yearQuarter: any;
    isDone: boolean;
}



export class CalendarWNPMAssetTimeVM {
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

export class CreateWNPMAssetTimeAttachment {

    id: number
    title: string
    fileName: string
    wnpmAssetTimeId: number;
    wnpmFile: any;
    hospitalId: number;

}

export class ListWNPMAssetTimeAttachment {

    id: number;
    title: string;
    fileName: string;
    wnpmAssetTimeId: number;
    hospitalId: number;
}

export class FiscalYearQuarters {
    quarterName: string;
    yearQuarter: number;
    year: number;
    firstDayStart: string;
    yearValue: number;
}

export class SearchWNPMDateVM {
    userId: string;
    startDate: Date;
    endDate: Date;
    start: string;
    end: string;
    hospitalId: number;
}