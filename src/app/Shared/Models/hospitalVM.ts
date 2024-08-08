import { ViewAssetForReportVM } from "./assetDetailVM";
export class ListHospitalVM {
    id: number;
    code: number;
    //  codeNum: number;
    name: string;
    nameAr: string;
    governorateName: string;
    governorateNameAr: string;
    cityName: string;
    cityNameAr: string;
    subOrgName: string;
    subOrgNameAr: string;
    orgName: string;
    orgNameAr: string;
}

export class CreateHospitalVM {
    code: string;
    name: string;
    nameAr: string;
    mobile: string;
    email: string;
    address: string;
    addressAr: string;
    managerName: string;
    managerNameAr: string;
    latitude: number;
    longtitude: number;
    governorateId: number;
    cityId: number;
    subOrganizationId: number;
    organizationId: number;
    contractName: string;
    contractStart: Date;
    contractEnd: Date;
    strContractStart: string;
    strContractEnd: string;
    departments: number[];
}

export class EditHospitalVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;
    mobile: string;
    email: string;
    address: string;
    addressAr: string;
    managerName: string;
    managerNameAr: string;
    latitude: number;
    longtitude: number;
    governorateId: number;
    cityId: number;
    subOrganizationId: number;
    organizationId: number;
    departments: number[];
    enableDisableDepartments: any[];
    contractName: string;
    contractStart: Date;
    contractEnd: Date;
    strContractStart: string;
    strContractEnd: string;

}
export class HospitalGroupVM {
    id: number;
    name: string;
    nameAr: string;
    assetList: ViewAssetForReportVM[];
}


export class HospitalVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;
}




export class DetailHospitalVM {
    id: number;
    type: string;
    code: string;
    name: string;
    nameAr: string;
    email: string;
    mobile: string;
    managerName: string;
    managerNameAr: string;
    latitude: string;
    longtitude: string;
    address: string;
    addressAr: string;
    governorateName: string;
    governorateNameAr: string;
    cityName: string;
    cityNameAr: string;
    organizationName: string;
    organizationNameAr: string;
    subOrganizationName: string;
    subOrganizationNameAr: string;
    contractName: string;
    contractStart: Date;
    contractEnd: Date;
    strContractStart: string;
    strContractEnd: string;
    departments: number[];
}

export class EditHospitalDepartmentVM {
    id: number;
    hospitalId: number;
    departmentId: number;
}

export class MapTable {
    lat: number;
    lng: number;
    address: string;
}

export class CountHospitalVM {
    //  cities
    cityName: string;
    cityNameAr: string;
    countOfHospitals: number;

}


export class SearchHospitalVM {
    governorateId: number;
    cityId: number;
    subOrganizationId: number;
    organizationId: number;
    name: string;
    nameAr: string;
    userId: string;
    code: string;
}

export class SortHospitalVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;
    hospitalName: string;
    hospitalNameAr: string;
    governorateName: string;
    governorateNameAr: string;
    cityName: string;
    cityNameAr: string;
    orgName: string;
    orgNameAr: string;
    subOrgName: string;
    subOrgNameAr: string;
    sortStatus: string;
    userId: string;
}
export class HospitalWithAssetVM {
    id: number;
    name: string;
    nameAr: string;
    assetCount: number;
    assetprice?: number;
}

export class GenerateHospitalCode {
    code: string;
}


export class MainClass {
    count: number;
    results: ListHospitalVM[];
}