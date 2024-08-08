export class CreateExternalAssetMovementAttachmentVM {
    id: number
    title: string
    fileName: string
    externalAssetMovementId: number;
    externalAssetMovementFile: any;
    hospitalId: number;
}
export class ExternalAssetMovementAttachmentVM {
    id: number
    title: string
    fileName: string
    externalAssetMovementId: number;
    hospitalId: number;
}
export class ListExternalAssetMovementAttachmentVM {
    id: number
    title: string
    fileName: string
    externalAssetMovementId: number
    requestName: string;
    hospitalId: number;
}

export class SearchExternalAssetMovementVM {
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
}