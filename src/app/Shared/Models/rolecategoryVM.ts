export class ListRoleCategoriesVM {
    id: number = 0;
    name: string = "";
    nameAr: string = "";
    orderId: number;

}
export class CreateRoleCategoryVM {
    name: string;
    nameAr: string;
    orderId: number;
}


export class EditRoleCategoryVM {
    id: number = 0;
    name: string = "";
    nameAr: string = "";
    orderId: number;
}


export class SortRoleCategoryVM {
    id: number = 0;
    name: string = "";
    nameAr: string = "";
    orderId: number;
    sortStatus: string;
}

export class MainClass {
    results: ListRoleCategoriesVM[];
    count: number;
}