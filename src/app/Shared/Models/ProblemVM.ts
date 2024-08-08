export class CreateProblemVM {
    code: string;
    name: string;
    nameAr: string;
    masterAssetId?: number;
}

export class EditProblemVM {
    id: number
    code: string;
    name: string;
    nameAr: string;
    masterAssetId: number
}

export class IndexProblemVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;
    masterAssetId: number;
    masterAssetName: string;
}
