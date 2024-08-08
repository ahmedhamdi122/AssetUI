
export class ListAssetStatusVM {
    id: number;
    name: string;
    nameAr: string;
    code: string;






}

export class CreateAssetStatusVM {
    name: string;
    nameAr: string;
    code: string;
}

export class EditAssetStatusVM {
    id: number;
    name: string;
    nameAr: string;
    code: string;
}


export class SortAssetStatusVM {
    id: number;
    name: string;
    nameAr: string;
    code: string;
    sortStatus: string;
}


export class MainClass {
    listStatus: ListAssetStatusVM[];
    countNeedRepair: number;
    countInActive: number;
    countWorking: number;
    countUnderMaintenance: number;
    countUnderInstallation: number;
    countNotWorking: number;
    countShutdown: number;
    countExecluded: number;
    countHold: number;
    totalCount: number;
   lstStatus10: number;
   lstStatus11: number;
   lstStatus12: number;
   lstStatus13: number;
   lstStatus14: number;
   lstStatus15: number;
   lstStatus16: number;
   lstStatus17: number;
   lstStatus18: number;
   lstStatus19: number;
}