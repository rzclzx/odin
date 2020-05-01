import { Component,OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { PolicyService } from "../../services/policy.service";
import { MyModalService } from "../../services/myModal.service";
import { Policy,Kpi,Targeting,App,AppType,Region,Citys } from "../../models/policy.model";
import { DetailService } from "../../services/detail.service";
import { RootService } from "../../services/root.service";
import { TargetModal } from "../../models/root.model";
import { CampaignService } from "../../services/campaign.service";
import { Campaign } from "../../models/campaign.model";
// import  "../campaign/campaignDetail.less";

declare var $;
declare var require;
let path = require("./policyDetail.html");
let path1= require("../campaign/campaignDetail.less")
@Component({
	selector: "ng-policyDetail",
	template: path,
	styles:['path1']
})

export class PolicyDetailComponent implements OnInit {
	public mainMenus = [
        {
            name: "投放管理",
            value: undefined
        },
        {
            name: "投放策略管理",
            value: "/home/campaign/policy/policyList/"+this.route.snapshot.params["campaignId"]
		},
		{
            name: "策略详情",
            value: undefined
		}
    ];

	private campaign:Campaign= new Campaign();
	private targetModal: TargetModal;
	private policy:Policy= new Policy();
	private targeting:Targeting = new Targeting();
	// private app:App = new App();
	private appType:AppType = new AppType();
	private kpi=[];
	private id:number;
	private campaignId:number;
	private isShowKpi: boolean = false;
	private adx=[];
	private adxs=[];
	private adxName=[];
	private brand=[];
	private days: any;
	private hours: any;
	private brands;
	private appTypes;
	private brandsName=[];
	private appTypesName=[];
	private appTypesNames=[];
	private cnName:string;
	private regions=[];
	private region=[];
	private regionsName=[];
	private options;
	private os;
	private oss = [];
	private osss= [];
	private app = [];
	private apps = [];
	private adxId:any=0;
	private name: string = "";
	private searchType: string = "0";
	private appName = [];
	private network;
	private networks=[];
	private networkss=[];
	private carrier;
	private carriers=[];
	private carrierss=[];
	private device;
	private devices=[];
	private devicess=[];
	private isUniform:string;
	private cycleType:string;
	private populationType:string;
	private appTypes1;
	private apps11:string="不限";
	private apps1:App = new App();
	private citys:Citys[]=[];
	private citys1=[];
	private bidType:string;
	private totalBudget:number;
	private sceneRadius:String;
	private contracts;
	private contract=[];
	private contractName=[];

	private startDate: number;

	private endDate: number;
	
	
	constructor(
		private publicService: PublicService,
		private chineseService: ChineseService,
		private route:ActivatedRoute,
		private policyService:PolicyService,
		private detailService:DetailService,
		private rootService:RootService,
		private myModalService:MyModalService,
		private campaignService:CampaignService,
		private router:Router
	) {}

	ngOnInit() {
		this.itemInit(); 
	}
	

	private itemInit(){
		this.id = this.route.snapshot.params["id"];
		this.campaignId = this.route.snapshot.params["campaignId"]; 
		this.campaignService.getId(this.campaignId).subscribe(
			result => {
				this.campaign=result.body;
				// console.log(this.campaign)
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)
		this.policyService.getId(this.id).subscribe(
			result => {
				this.policy = result.body;
				// console.log(this.policy)
				
				if(!this.policy.targeting.app){
					this.policy.targeting.app = new App();
                }
                if(!this.policy.targeting.appType){
                    this.policy.targeting.appType = new App();
				}
				this.showDay();
                this.showHours();
				for(let i = 0;i < this.policy.kpi.length;i++){
					this.policy.kpi[i].dailyBudget =this.policy.kpi[i].dailyBudget/100;
				}
				this.policy.totalBudget = this.policy.totalBudget /100;
				if(this.policy.isUniform=="0"){
					this.isUniform="否";
				}else{
					this.isUniform="是";
				}
				// console.log(this.policy.cycleType)		
				if(this.policy.cycleType==="2"){
					this.cycleType="每天";
				}else if(this.policy.cycleType==="3"){
					this.cycleType="每周";
				}else if(this.policy.cycleType==="4"){
					this.cycleType="每月";
				}else if(this.policy.cycleType==="0"){
					this.cycleType="全投放周期";
				}
				this.populationType=this.policy.populationType;
				if(this.populationType=="0"){
					this.populationType="不限";
				}	
				this.targeting=this.policy.targeting;
				this.region = this.targeting.region;
				if(this.region.length===0){
					this.regionsName.push("全部");
				}else if(this.region.length !=0){
						//地域定向
						this.rootService.regionList().subscribe(
							result=>{
								this.regions = result.body.items;
								for(var i=0;i<this.regions.length;i++){
									for(var j=0;j<this.region.length;j++){
										if(this.region[j]==this.regions[i].id){
											this.regionsName.push(this.regions[i].name);
											// console.log(this.regionsName)		
										}
										
									}
									this.citys=this.regions[i].citys;
									if(this.citys!=null){
										for(var m=0;m<this.citys.length;m++){
											for(var n=0;n<this.region.length;n++){
												if(this.region[n]==this.citys[m].id){
													this.regionsName.push(this.citys[m].name);
													// console.log(this.regionsName)
												}
											}
										}
									}
								}
							},
							error => {
								this.myModalService.alert(error.message);
							}
						)
				}
				// this.networkss=this.campaign.targeting.network;
				// if(this.networkss.length==0){
				// 	this.networks.push("不限");
				// }
				// this.carrierss=this.campaign.targeting.carrier;
				// if(this.carrierss.length==0){
				// 	this.carriers.push("不限");
				// }
				// this.devicess=this.campaign.targeting.device;
				// if(this.devicess.length==0){
				// 	this.devices.push("不限");
				// }
				this.osss=this.targeting.os;
				if(this.osss.length==0){
					this.oss.push("不限");
				}

				//os定向,设备平台，联网环境，运营商
				this.targetModal = new TargetModal(this.targeting.network,this.targeting.carrier,this.targeting.device,this.targeting.os);
				this.os=this.targetModal.os;
				for(var i =0;i<this.os.length;i++){
					if(this.os[i].value==true){
						this.oss.push(this.os[i].name);
					}
				}
				if(this.os.length==0){
					this.oss.push("不限");
				}
				this.network=this.targetModal.network;
					for(var i =0;i<this.network.length;i++){
						if(this.network[i].value==true){
							this.networks.push(this.network[i].name);
						}
					}
					if(this.networks.length==0){
						this.networks.push("不限");
					}
				
				this.carrier=this.targetModal.carrier;
				for(var i =0;i<this.carrier.length;i++){
					if(this.carrier[i].value==true){
						this.carriers.push(this.carrier[i].name);
					}
				}
				if(this.carriers.length==0){
					this.carriers.push("不限");
				}
				this.device=this.targetModal.device;
				for(var i =0;i<this.device.length;i++){
					if(this.device[i].value==true){
						this.devices.push(this.device[i].name);
					}
				}
				if(this.devices.length==0){
					this.devices.push("不限");
				}
				


				this.adx = this.targeting.adx;
				// if(this.adx.length==0){
				// 	this.adxName.push("不限");
				// }else{
					//渠道定向
					this.rootService.adxList().subscribe(
						result=>{
							this.adxs = result.body.items;
							for(var i=0;i<this.adx.length;i++){
								for(var j=0;j<this.adxs.length;j++){
									if(this.adx[i]==this.adxs[j].id){
										this.adxName.push(this.adxs[j].name);		
									}
								}
							}
						},
						error => {
							this.myModalService.alert(error.message);
						}
					)
				// }
				//定价合约
				this.contract = this.targeting.contract;
				this.rootService.contractList().subscribe(
					result=>{
						this.contracts= result.body.items;
						// console.log(this.contracts);
						for(var i=0;i<this.contract.length;i++){
							for(var j=0;j<this.contracts.length;j++){
								if(this.contract[i]==this.contracts[j].id){
									this.contractName.push(this.contracts[j]);		
								}
							}
						}
					},
					error => {
						this.myModalService.alert(error.message);
					}
				)
				this.brand = this.targeting.brand;
				if(this.brand.length==0){
					this.brandsName.push("不限");
				}else{
					//手机品牌
					this.detailService.brandsName().subscribe(
						result=>{
							this.brands = result.body.items;
								for(var i=0;i<this.brand.length;i++){
									for(var j=0;j<this.brands.length;j++){
										if(this.brand[i]==this.brands[j].id){
											this.brandsName.push(this.brands[j].cnName);				
										}
									}
							}
		
						},
						error => {
							this.myModalService.alert(error.message);
						}
					)
				}
				this.appType=this.targeting.appType;	
				this.appTypesName = this.appType.value;				
				if(this.appType.isInclude=="1"){
					this.appTypes1="选择";
				}else if(this.appType.isInclude=="0"){
					this.appTypes1="排除"
				}else{
					this.appTypes1="不限"
				}
				if(!this.appTypesName){	
					// return;
					console.log(1);
				}else{
					//媒体分类
					this.detailService.appTypesName().subscribe(
						result=>{
							this.appTypes = result.body.items;
							for(var i=0;i<this.appTypes.length;i++){
								for(var j=0;j<this.appTypesName.length;j++){
									if(this.appTypesName[j]==this.appTypes[i].id){
										this.appTypesNames.push(this.appTypes[i].name);		
									}
								}
							}
							
						},
						error => {
							this.myModalService.alert(error.message);
						}
					)
				}
				
				this.apps1=this.targeting.app;
				this.app = this.apps1.value;
				// console.log(this.campaign.targeting.app)
				if(this.apps1.isInclude=="1"){
					this.apps11="选择";
				}else if(this.apps1.isInclude=="0"){
					this.apps11="排除"
				}else{
					this.apps11="不限"
				}
				if(!this.app){	
					// return;
					console.log(0);
				}else{
					//app媒体名称定向
					let options = {
						// names: this.name,
						adxId: this.adxId,
						searchType: this.searchType
					}
					this.rootService.appList(options).subscribe(
						result=>{
							this.apps= result.body.items;
							for(var i=0;i<this.app.length;i++){
								for(var j=0;j<this.apps.length;j++){
									if(this.app[i]==(this.apps[j].adxId+"|"+this.apps[j].id)){		
										this.appName.push(this.apps[j].name+"媒体");				
									}
								}
							}							
						},
						
						error => {
							this.myModalService.alert(error.message);
						}
					)
				}
				//场景定向
				if(this.policy.sceneRadius=="7"){
					this.sceneRadius="半径76m";
				}else if(this.policy.sceneRadius=="6"){
					this.sceneRadius="半径610m";
				}else if(this.policy.sceneRadius=="5"){
					this.sceneRadius="半径2.4km";
				}else  if(this.policy.sceneRadius=="4"){
					this.sceneRadius="半径20km";
				}else if(this.policy.sceneRadius=="8"){
					this.sceneRadius="半径19.11m";
				}else if(!this.policy.sceneRadius){
					this.sceneRadius="不限";
				}
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)	
	}
	 // day显示
	 private showDay(){
        let day = 0;
        let start = this.policy.startDate;
        let end = this.policy.endDate;
        let act = () => {
			for(let i = 0;i < this.policy.kpi.length;i++){
				if(this.policy.kpi[i].period !==0){
					day++;
				}
				start += 1000*60*60*24;	
			}
            // day ++;
            if(start < end){
				act();
			}
        }
        act();
        this.days = day;
    }
    // hours显示
    private showHours(){
        let hours = 0;
        for(let i = 0;i < this.policy.kpi.length;i++){
            for(let j = 0;j < 24;j++){
                let str = this.policy.kpi[i].period.toString(2);
                str = this.publicService.addLength(str);
                str.charAt(j) === "1" && hours++;
            }
        }
        this.hours = hours;
    }
	 // kpi切换
	 private toggleKpi(){
        this.isShowKpi = !this.isShowKpi;
    }
    // kpi接收数据
    private onmessage(e){ 
        this.isShowKpi = false;
	}
	

	//路由跳转
	private gopolicyForm(){
		this.router.navigate(["/home/campaign/policy/policyForm",this.campaignId,this.id]);
	}
	private gopolicyList(){
		this.router.navigate(["/home/campaign/policy/policyList",this.campaignId]);
	}
}