export class ListExternalAssetMovementVM {
    id: number;
    assetDetailId: number;
    notes: string;
    movementDate: string;
    hospitalName: string;

    assetName: string;
    assetNameAr: string;
    barCode: string;
    serialNumber: string;
    modelNumber: string;
}

export class CreateExternalAssetMovementVM {
    assetDetailId: number;
    notes: string;
    movementDate: string;
    hospitalName: string;
    hospitalId:number;
}

export class EditExternalAssetMovementVM {
    id: number;
    assetDetailId: number;
    notes: string;
    movementDate: string;
    hospitalName: string;
    assetName: string;
    assetNameAr: string;
    barCode: string;
    serialNumber: string;
    modelNumber: string;
    listMovementAttachments: [];
}


export class MainClass {
    results: ListExternalAssetMovementVM[];
    count: number;
}

