export class ListSubOrganizationVM {
    id:number=0;
    code:string;
    name:string;
    nameAr:string;
    mobile:string;
    orgName:string;
}

export class CreateSubOrganizationVM {
    code:string;
    name:string;
    nameAr:string;
    mobile:string;
    email:string;
    address:string;
    addressAr:string;
    directorName:string;
    directorNameAr:string;
    organizationId:number;
}

export class EditSubOrganizationVM {
    id:number=0;
    code:string;
    name:string;
    nameAr:string;
    mobile:string;
    email:string;
    address:string;
    addressAr:string;
    directorName:string;
    directorNameAr:string;
    organizationId:number=0;
}






