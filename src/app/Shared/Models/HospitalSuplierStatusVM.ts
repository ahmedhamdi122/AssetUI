export class ListHospitalSuplierStatusVM {
    id: number
    name: string;
    nameAr: string;
    color: string;
    icon: string;

    openStatus: number;
    approveStatus: number;
    rejectStatus: number;
    systemRejectStatus: number;
    totalStatus: number;

    listStatus: HospitalSuplierStatus[];
}

export class ListHospitalSuplierStatusVM2 {
    openStatus: number;
    approveStatus: number;
    rejectStatus: number;
    systemRejectStatus: number;
    listStatus: HospitalSuplierStatus[];
}


export class HospitalSuplierStatus {
    id: number;
    name: string;
    nameAr: string;
    color: string;
    icon: string;
}


