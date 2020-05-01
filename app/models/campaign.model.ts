export class Campaign {
    advertiserName: string;
    auditStatus: string;
    bid: number;
    bidType: string = "0";
    click?: number;
    ctr?: number;
    cycleType: string = "0";   
    ecpc?: number;
    ecpm?: number;
    enable: string;
    endDate: number;
    frequencyAmount: number;
    frequencyType: string = "0";
    id: string;
    impression: number; 
    kpi: Array<Kpi> = [];
    name: string;
    objectType: string = "1";
    populationRatio: string;
    populationType: string = "0";
    projectName: string;
    projectId: any;
    sceneName?: string;
    scenePath?: string;
    sceneRadius: string;
    startDate: number;
    status: string;
    targeting: Targeting = new Targeting();
    todayClick: number;
    todayCtr: number;	
    todayEcpc: number;	
    todayEcpm: number;	
    todayImpression: number;	
    totalBudget: number;	
    totalClick: number;	
    totalImpression: number;
    isUniform: string = "1";
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
    isInclude?: string;
    value?: Array<string> = [];
}

export class AppType {
    isInclude?: string;
    value?: Array<string> = [];
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
export class Constract{
    bid:number;
    id:number;
    name:string;
    status:string;
}