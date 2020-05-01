
// import { Kpi } from "./kpi.model";

export class Advertiser {
    name:string;
    // pageNo:number;
    // pageSize:number;
    // items: Array<object>=[];
    accountLicencePath:string;
    address:string;
    brand:string;
    businessLicencePath:string;
    contactNum:string;
    contacts:string;
    email:string;
    icpPath:string;
    id:number;
    industryId:number;
    isProtected:string;
    licenceDeadline:string;
    licenceNo:string;
    logoPath:string;
    organizationCode:string;
    organizationCodePath:string;
    qq:string;
    telephone:string;
    userNum:number=0;
    websiteName:string;
    websiteUrl:string;
    zip:string;
    companyName:string;
    licenceDeadLine:string;
    saleman:string;
}

export class Audit {
    id: string;
    adxId: string;
    name: string;
    status: string;
    enable: string;
    message: string;
}
export class InfoflowTmpl {
    name:string;
}