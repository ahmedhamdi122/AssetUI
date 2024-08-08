export class ListContractDetailVM {
    id: number;
    masterContractId: string;
    ContractDetailId: string;
    contractDate: string;
    hasSpareParts: boolean;
    responseTime: string;
    barCode: string;
    contractName: string;
    serialNumber: string;
    hospitalNameAr: string;
    hospitalName: string;
    notes: string;
    brandName: string;
    brandNameAr: string;
    departmentName: string;
    departmentNameAr: string;
}

export class CreateContractDetailVM {
    masterContractId: number;
    assetDetailId: number;
    contractDate: string;
    hasSpareParts: boolean;
    responseTime: string;
    hospitalId: number;

}

export class EditContractDetailVM {
    id: number;
    masterContractId: string;
    ContractDetailId: string;
    contractDate: string;
    hasSpareParts: boolean;
    responseTime: string;
    hospitalId: number;
}





export class ContractDetailVM {
    id: number;
    name: string;
}
