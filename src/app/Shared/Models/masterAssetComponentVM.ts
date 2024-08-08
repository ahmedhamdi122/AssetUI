export class ListMasterAssetComponentVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;
    assetName: string;
    assetNameAr: string;
    price: string;
    partNo: string;
}

export class CreateMasterAssetComponentVM {
    compCode: string;
    compName: string;
    compNameAr: string;
    partNo: string;
    compDescription: string;
    compDescriptionAr: string;
    masterAssetId: number;
    price?: number;
}

export class EditMasterAssetComponentVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;
    partNo: string;
    description: string;
    descriptionAr: string;
    masterAssetId: number;
    price?: number;
}



export class ViewMasterAssetComponentVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;
    partNo: string;
    description: string;
    descriptionAr: string;
    masterAssetId: number;
    price?: number;
}



