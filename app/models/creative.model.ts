export class Creative {
    id:number;
    name:string;
    packageId:number;
    packageName:string;
    type:string;
    materials:Array<Materials>=[];
}
export class Materials{
    width:string;
    height:string;
}