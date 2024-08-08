import { ListAssetDetailVM } from "./assetDetailVM";

export class ListMasterContractVM {
    id: number;
    contractNumber: string;
    contractDate: string;
    subject: string;
    startDate: string;
    endDate: string;
    strEndDate: string;

    supplierName: string;
    supplierNameAr: string;
}
export class MainClass {
    results: ListMasterContractVM[];
    count: number;
}
export class SortAndFilterContractVM {
    sortObj: SortContractsVM;
    searchObj: SearchMasterContractVM;
}
export class SearchMasterContractVM {
    contractNumber: string;
    contractDate: string;
    subject: string;
    start: string;
    end: string;

    hospitalId: number;
    selectedContractType: number;
    governorateId: number;
    cityId: number;
    subOrganizationId: number;
    organizationId: number;
    originId: number;
    supplierId: number;
    brandId: number;
    departmentId: number;
    masterAssetId: number;
    barCode: string;
    serialNumber: string;
    model: string;
}



export class CreateMasterContractVM {
    serial: string;
    contractNumber: string;
    contractDate: string;
    subject: string;
    from: string;
    to: string;
    cost: number;
    lstDetails: any[];
    supplierId: number;
    hospitalId: number;
    notes: string;
    totalVisits: number;
}

export class EditMasterContractVM {
    id: number;
    serial: string;
    contractDate: string;
    subject: string;
    from: string;
    to: string;
    cost: number;
    supplierId: number;
    hospitalId: number;
    notes: string;
    totalVisits: number;
}
export class DetailMasterContractVM {
    id: number;
    serial: string;
    contractDate: string;
    subject: string;
    from: string;
    to: string;
    cost: number;
    supplierId: number;
    hospitalId: number;
    notes: string;
    totalVisits: number;
    supplierName: string;
    supplierNameAr: string;
    listDetails: ContractDetailVM[];
}

export class ContractDetailVM {
    barCode: string;
    serialNumber: string;
    brandNameAr: string;
    brandName: string;
    departmentNameAr: string;
    departmentName: string;
    responseTime: number;
    hasSpareParts: boolean;
    assetName: string;
    assetNameAr: string;
    assetDetailId: number;
}















export class SortContractsVM {
    contractNumber: string;
    subject: string;
    contractDate: string;
    startDate: string;
    endDate: string;
    sortStatus: string;
}

export class GeneratedMasterContractNumberVM {
    contractSerial: string;
}