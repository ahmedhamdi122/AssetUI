export class ListScrapVM {
  id: number;
  scrapDate: string;
  assetName: string;
  assetNameAr: string;
  serialNumber: string;
  barcode: string;
  scrapNo: string;
  departmentName: string;
  departmentNameAr: string;
  model: string;
  brandName: string;
  brandNameAr: string;
  assetId: number;
  lang: string;
  printedBy: string;
  hospitalName: string;
  hospitalNameAr: string;
  strStartDate: string;
  strEndDate: string;

}
export class DetailScrapVM {
  id: number;
  scrapDate: string;
  assetName: string;
  assetNameAr: string;
  serialNumber: string;
  barcode: string;
  model: string;
  brandName: string;
  brandNameAr: string;
  comment: string;
  reasonName: string;
  reasonNameAr: string;
  scrapNo: string;

  departmentName: string;
  departmentNameAr: string;
}
export class ViewScrapVM {
  id: number;
  scrapDate: string;
  assetName: string;
  assetNameAr: string;
  serialNumber: string;
  barcode: string;
  model: string;
  brandName: string;
  brandNameAr: string;
  comment: string;
  reasonName: string;
  reasonNameAr: string;
  scrapReasonName: string;
  scrapReasonNameAr: string;
  scrapNo: string;
  assetId: number;

  departmentName: string;
  departmentNameAr: string;


  lang: string;
  printedBy: string;
  hospitalName: string;
  hospitalNameAr: string;
  strStartDate: string;
  strEndDate: string;
}
export class GeneratedScrapNumberVM {
  scrapNo: string;
}

export class CreateScrapVM {
  //id: number;
  assetDetailId: number;
  scrapNo: string;
  scrapDate: Date;
  strScrapDate: string;
  sysDate: string;
  departmentId: number;
  masterAssetId: number;
  model: string;
  brandName: string;
  brandNameAr: string;

  departmentName: string;
  departmentNameAr: string;


  hospitalId: number;
  comment: string;
  reasonIds: number[];

}


export class SortScrapsVM {
  scrapDate: string;
  assetName: string;
  assetNameAr: string;
  serialNumber: string;
  barcode: string;
  scrapNo: string;
  departmentName: string;
  departmentNameAr: string;
  sortStatus: string;
  sortBy:string;

}
export class SearchScrapVM {
  AssetDetailId: number;
  ScrapNo: string;
  ScrapDate: string;
  departmentId: number;
  hospitalId: number;
  serialNumber: string;
  modelNumber: string;
  barCode: string;
  masterAssetId: number;
  periorityId: number;
userId:string;
  governorateId: number;
  cityId: number;
  subOrganizationId: number;
  organizationId: number;
  originId: number;
  supplierId: number;
  brandId: number;
  startDate: string;
  endDate: string;
  lang: string;
  printedBy: string;
  hospitalName: string;
  hospitalNameAr: string;
  start: string;
  end: string;
  startDate2: string;
  endDate2: string;
  scrapEndDate: Date;
  scrapStartDate: Date;
}
export class EditScrapVM {
  id: number;
  scrapDate: string;
  AssetDetailId: number;
  ScrapNo: string;
  SysDate: string;
  comment: string;

}
export class ScrapVM {
  id: number;
}
export class MainClass {
  results: ListScrapVM[];
  count: number;
}

export class SortAndFilterScrapVM
{
  sortObj:SortScrapsVM;
  searchObj:SearchScrapVM;
}