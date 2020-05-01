



export class Policy{
    items:Array<object>=[];
    advertiseDate:number;
    click:number;
    creativeAmount:number;
    ctr:number;
    ecpc:number;
    ecpm:number;
    enable:string;
    endDate:number;
    id:number;
    impression:number;
    kpi: Array<Kpi> = [];
    name:string;
    realBid:number;
    score:number;
    startData:number;
    status:string;
    advertiserName:string;
    campaignName:string;
    cycleType:string;
    frequencyAmount:number;
    frequencyType:string;
    isUniform:string;
    objectType:string;
    populationRatio:number;
    campaignId:number;
    projectName:string;
    startDate:number;
    targeting: Targeting = new Targeting();
    populationType:string;
    totalBudget:number;
    totalClick;
    totalImpression;
    sceneRadius:string;
}
export class Kpi {
    dailyBudget: number;
    dailyClick: number;
    dailyImpression: number;
    day: any;
    isLock: string = "0";
    period: number = 16777215;
}
export class Targeting {
    adx: Array<string> = [];
    brand: Array<string> = [];
    carrier: Array<string> = [];
    contract: Array<string> = [];
    device: Array<string> = [];
    app: App = new App();
    appType: AppType = new AppType();
    network: Array<string> = [];
    os: Array<string> = [];
    population: Array<string> = [];
    region: Array<string> = [];
}

export class App {
    isInclude: string = "0";
    value: Array<string> = [];
}

export class AppType {
    isInclude: string = "0";
    value: Array<string> = [];
}


export class Region {
    citys:Array<string> = [];
    id:number;
    latitude:number;
    longitude:number;
    name:string;
}
export class Citys{
    id:number;
    latitude:number;
    longitude:number;
    name:string;
}

