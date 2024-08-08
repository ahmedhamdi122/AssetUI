export class ListMasterAssetVM {
    id: number;
    code: string;
    name: string;
    master: string;
    masterName: string;
    nameAr: string;
    originName: string;
    originNameAr: string;
    brandName: string;
    brandNameAr: string;
    model: string;
    modelNumber: string;
    ecriName: string;
    ecriNameAr: string;

    serialNumber: string;
    barCode: string;
}

export class CreateMasterAssetVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    expectedLifeTime?: number;
    modelNumber: string;
    versionNumber: string;

    periorityId?: number;
    originId?: number;
    brandId?: number;
    categoryId?: number;
    subCategoryId?: number;
    ecriId?: number;


    length: number;
    height: number;
    width: number;
    weight: number;
    title: string;

    power: string;
    voltage: string;
    ampair: string;
    frequency: string;
    electricRequirement: string;
    assetImg: string;
    createPMAssetTaskVM?: CreatePMAssetTaskVM[];
    pmTimeId: number;
    // createPMAssetTaskVM:any[];
}

export class EditMasterAssetVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;

    brandName: string;
    brandNameAr: string;

    description: string;
    descriptionAr: string;
    expectedLifeTime: number;
    ecriId?: number;
    modelNumber: string;
    model: string;
    versionNumber: string;
    periorityId: number;
    originId?: number;
    brandId?: number;
    categoryTypeId?: number;
    categoryId?: number;
    subCategoryId?: number;
    length: number;
    height: number;
    width: number;
    weight: number;
    title: string;
    power: string;
    voltage: string;
    ampair: string;
    frequency: string;
    electricRequirement: string;
    pmTimeId: number;
    assetImg: string;
}



export class ViewMasterAssetVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;
    description: string;
    descriptionAr: string;
    expectedLifeTime: number;

    modelNumber: string;
    versionNumber: string;
    ecriId: number;
    ecriName: string;
    ecriNameAr: string;
    periorityId: number;
    periorityName: string;
    periorityNameAr: string;
    originId: number;
    originName: string;
    originNameAr: string;
    brandId: number;
    brandName: string;
    brandNameAr: string;
    categoryId: number;
    categoryName: string;
    categoryNameAr: string;
    subCategoryId: number;
    subCategoryName: string;
    subCategoryNameAr: string;
    length: number;
    height: number;
    width: number;
    weight: number;
    title: string;
    power: string;
    voltage: string;
    ampair: string;
    frequency: string;
    electricRequirement: string;
    //  pmTimeId: number;
    assetImg: string;
}



export class MasterAssetVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;
}


export class CreateMasterAssetAttachmentVM {
    masterAssetId: number;
    fileName: string;
    title: string;
    masterFile: any;
}


export class MasterAssetAttachmentVM {
    id: number;
    masterAssetId: number;
    fileName: string;
    title: string;
}


export class CreatePMAssetTaskVM {
    taskname: string;
    tasknameAr: string;
    masterAssetId: number;
}


export class ListPMAssetTaskVM {
    id: number;
    name: string;
    nameAr: string;
    masterAssetId: number;



    taskName: string;
    taskNameAr: string;
}




export class CreatePMAssetTaskScheduleVM {
    pmDate: string;
    lstSelectedTasks: any[];
    taskId: number;
    hospitalId: number;
}

export class CountMasterAssetByBrandVM {

    brandName: string;
    brandNameAr: string;
    countOfMasterAssets: number;

}

export class CountMasterAssetBySupplierVM {

    supplierName: string;
    supplierNameAr: string;
    countOfMasterAssets: number;

}



export class SearchMasterAssetVM {

    originId: number;
    brandId: number;
    ecriId: number;
    categoryId: number;
    subCategoryId: number;
    assetName: string;
    assetNameAr: string;
    modelNumber: string;
    code: string;
}

export class SortMasterAssetVM {

    originName: string;
    originNameAr: string;
    brandName: string;
    brandNameAr: string;
    ecriName: string;
    ecriNameAr: string;
    categoryName: string;
    categoryNameAr: string;
    subCategoryName: string;
    subCategoryNameAr: string;
    assetName: string;
    assetNameAr: string;
    modelNumber: string;
    code: string;
    sortStatus: string;
    sortBy: string;
}
export class MainClass {
    results: ListMasterAssetVM[];
    count: number;
}

export class SortAndFilterMasterAssetVM {
    sortObj: SortMasterAssetVM;
    searchObj: SearchMasterAssetVM;
}