import { CreatePMAssetTaskVM } from "./MasterAssetVM";

export class ListPMAssetTimeVM {
    id: number;
    pmDate: string;
}

export class EditPMAssetTimeVM {
    id: number;
    pmDate: Date;
    assetDetailId: number;
    hospitalId: number;
}

export class PmDateGroupVM {
    id: number;
    pmDate: Date;
    hospitalId: number;
    checked: boolean;
    assetDetailId: number;
    assetTasksList: CreatePMAssetTaskVM[];
    // listPMAssetTaskScheduleVM: ListPMAssetTaskScheduleVM[];

    //listPMAssetTaskScheduleVM: ListPMAssetTaskScheduleVM;
    assetSchduleList: ListPMAssetTaskScheduleVM[];
}


export class ListPMAssetTaskScheduleVM {
    id: number;
    pmAssetTimeId: number;
    pmAssetTaskId: number;
    checked: boolean;
    masterAssetId: number;
    taskName: string;
    taskNameAr: string;
}




