
export class ListStockTakingScheduleVM {
    id: number;
    relatedHospitals: RelatedHospital[];
    startDate: string;
    endDate: string;
    creationDate: Date;
    userName: string;
    stCode: string;


}

export class CreateStockTakingScheduleVM {
    id: number;
    startDate: Date;
    endDate: Date;
    creationDate: Date;
    userId: string;
    listHospitalIds: number[];
    stCode: string;
}
export class MainClass {
    results: ListStockTakingScheduleVM[];
    count: number;
}

export class GenerateStockScheduleTakingNumberVM {
    outNumber: string;
}

export class RelatedHospital {
    name: string;
    nameAr: string;
}




export class SortStockTakingScheduleVM {
    sortStatus: string;

}
export class SearchStockTakingScheduleVM {
    periorityId: number;
    code: string;
    barcode: string;
    modelNumber: string;
    serialNumber: string;
    statusId: number;
    modeId: number;
    masterAssetId: number;
    governorateId: number;
    cityId: number;
    organizationId: number;
    subOrganizationId: number;
    hospitalId: number;
    start: string;
    end: string;
    subject: string;
    userId: string;
    assetOwnerId: number;
    departmentId: number;
    lang: string;
    hospitalName: string;
    hospitalNameAr: string;
    printedBy: string;
    strEndDate: string;
    strStartDate: string
}