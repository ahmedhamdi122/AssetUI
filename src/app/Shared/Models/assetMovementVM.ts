export class ListAssetMovementVM {
    id: number;
    assetDetailId: string;
    movementDate: string;
    floor: string;
    room: string;
    roomName: string;
    roomNameAr: string;
    floorName: string;
    floorNameAr: string;
    buildingName: string;
    buildingNameAr: string;
    assetName: string;
    assetNameAr: string;
    modelNumber: string;
    serialNumber: string;
    barCode: string;
}

export class CreateAssetMovementVM {
    assetDetailId: number;
    movementDate: string;
    moveDesc: string;
    buildingId: number;
    floorId: number;
    roomId: number;
    hospitalId: number;

    roomName: string;
    roomNameAr: string;
    floorName: string;
    floorNameAr: string;
    buildingName: string;
    buildingNameAr: string;


}

export class EditAssetMovementVM {
    id: number;
    assetDetailId: string;
    movementDate: string;
    floor: number;
    room: string;
    moveDesc: string;
    assetName: string;
    assetNameAr: string;
}



export class MainClass {
    results: ListAssetMovementVM[];
    count: number;
}

export class SearchAssetMovementVM {
    assetDetailId: number;
    ScrapNo: string;
    ScrapDate: string;
    departmentId: number;
    hospitalId: number;
    serialNumber: string;
    modelNumber: string;
    barCode: string;
    masterAssetId: number;
    periorityId: number;

    governorateId: number;
    cityId: number;
    subOrganizationId: number;
    organizationId: number;
    originId: number;
    supplierId: number;
    brandId: number;
    start: string;
    end: string;
    userId: string;
}
export class SortAssetMovementVM {


    sortStatus: string;
    sortBy: string;
}
export class SortAndFilterAssetMovementVM {
    sortObj: SortAssetMovementVM;
    searchObj: SearchAssetMovementVM;
}