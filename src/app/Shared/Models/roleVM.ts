export class ListRolesVM {
    id: string = "";
    name: string = "";
    displayName: string = "";
    categoryName:string="";

}
export class CreateRoleVM {
    name: string = "";
    roleCategoryId: number = 0;
    displayName: string = "";
}


export class EditRoleVM {
    id: string = "";
    roleCategoryId: number = 0;
    name: string = "";
    displayName: string = "";
}
