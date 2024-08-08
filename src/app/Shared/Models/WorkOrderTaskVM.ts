export class IndexWorkOrderTaskVM{
    id:number
    comment:string
    assetWorkOrderTaskId:number
    workOrderId:number
    workOrderSubject:string
    assetWorkOrderTaskName:string
}
export class EditWorkOrderTaskVM{
    id:number
    comment:string
    assetWorkOrderTaskId:number
    workOrderId:number
}
export class CreateWorkOrderTaskVM{
    workOrderId:number
    lstCreateTasks:CreateTasks[]
}
export class CreateTasks {
    assetWorkOrderTaskId:number
    comment:string
}