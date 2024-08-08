export class ListAssetStatusTransactionVM {
    id: number;
    assetDetailId: string;
    statusDate: string;
    statusName: string;
    hospitalId: number;
}

export class CreateAssetStatusTransactionVM {
    assetDetailId: number;
    statusDate: string;
    assetStatusId: number;
    hospitalId: number;
}

export class EditAssetStatusTransactionVM {
    id: number;
    assetDetailId: string;
    statusDate: string;
    assetStatusId: number;
    hospitalId: number;
}

export class AssetStatusTransactionVM {
    id: number;
    assetDetailId: number;
    assetStatusId: number;
    statusDate: string;
    hospitalId: number;
}


