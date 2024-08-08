export class ListEmployeeVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;
    email: string;
    hospitalName: string;
    hospitalNameAr: string;
    departmentName: string;
    departmentNameAr: string;
    userId: string;
}

export class CreateEmployeeVM {
    code: string;
    name: string;
    nameAr: string;
    cardId: string;
    phone: string;
    whatsApp: string;
    dob: string;
    empImg: string;
    email: string;
    address: string;
    addressAr: string;
    genderId: number;
    hospitalId: number;
    departmentId: number;
    classificationId: number;



    governorateId: number;
    cityId: number;
    organizationId: number;
    subOrganizationId: number;
}

export class EditEmployeeVM {
    id: number;
    code: string;
    name: string;
    nameAr: string;
    cardId: string;
    phone: string;
    whatsApp: string;
    dob: string;
    empImg: string;
    email: string;
    address: string;
    addressAr: string;
    genderId: number;
    departmentId: number;
    classificationId: number;


    governorateId: number;
    cityId: number;
    subOrganizationId: number;
    organizationId: number;
    hospitalId: number;
}


export class ListGender {
    id: number;
    name: string;
    nameAr: string;
}

export class ListEmployees {
    id: number;
    name: string;
    nameAr: string;
}

export class SortEmployeeVM {
    code: string;
    name: string;
    nameAr: string;
    email: string;
    hospitalName: string;
    hospitalNameAr: string;
    departmentName: string;
    departmentNameAr: string;
    sortStatus: string;
}