export class ListEngineerVM {
  id: number;
  code: string;
  name: string;
  nameAr: string;
  cardId: string;
  phone: string;
  whatsApp: string;
  dob: string;
  email: string;
  address: string;
  addressAr: string;
  genderId: number;
}

export class EngineerVM {
  id: number;
  genderId: number;
}

export class ViewEngineerVM {
  id: number;
  code: string;
  name: string;
  nameAr: string;
  cardId: string;
  phone: string;
  whatsApp: string;
  dob: string;
  email: string;
  address: string;
  addressAr: string;
  gender:string ;
}
export class CreateEngineerVM {
  code: string;
  name: string;
  nameAr: string;
  cardId: string;
  phone: string;
  whatsApp: string;
  dob: string;

  email: string;
  address: string;
  addressAr: string;
  genderId: number;
}
export class EditEngineerVM {
  id: number;
  code: string;
  name: string;
  nameAr: string;
  cardId: string;
  phone: string;
  whatsApp: string;
  dob: string;

  email: string;
  address: string;
  addressAr: string;
  genderId: number;
}
export class SortEngineerVM {
  code: string;
  name: string;
  nameAr: string;
  email: string;

  sortStatus: string;
}

