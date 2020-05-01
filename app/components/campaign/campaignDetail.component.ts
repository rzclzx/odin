import { Component,OnInit,ViewChild } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { MyModalService } from "../../services/myModal.service";
import { CampaignService } from "../../services/campaign.service";
import { Campaign,Kpi,Targeting,App,AppType,Region,Citys,Constract } from "../../models/campaign.model";
import { DetailService } from "../../services/detail.service";
import { RootService } from "../../services/root.service";
import { TargetModal } from "../../models/root.model";



// import "./campaignDetail.less";

declare var $;
declare var require;
let path = require("./campaignDetail.html");
let path1 = require("./campaignDetail.less");

@Component({
	selector: "ng-campaignDetail",
	template: path,
	styles:['path1']
})

export class CampaignDetailComponent implements OnInit {
	public mainMenus = [
        {
            name: "投放管理",
            value: undefined
        },
        {
            name: "推广活动管理",
            value: "/home/campaign/campaignAudited"
		},
		{
            name: "推广活动详情",
            value: undefined
		}
	];


	private targetModal: TargetModal;
	private campaign:Campaign= new Campaign();
	private targeting:Targeting = new Targeting();
	private apps1:App = new App();
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
	private apps= [];
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
	private populationType:string;
	private cycleType:string;
	private appTypes1;
	private apps11:string="不限";
	private citys:Citys[]=[];
	private citys1=[];
	private bidType:string;
	private frequencyType:string;
	private sceneRadius:string;
	private contracts;
	private contract=[];
	private contractName=[];
	

	private startDate: number;

	private endDate: number;

	constructor(
		private publicService: PublicService,
		private chineseService: ChineseService,
		private myModalService:MyModalService,
		private router: Router,
		private campaignService:CampaignService,
		private route:ActivatedRoute,
		private detailService:DetailService,
		private rootService:RootService
	) {}

	ngOnInit() {
		this.itemInit();
	}

	 //获取后台列表数据
	 private itemInit(){
		this.campaignId = this.route.snapshot.params["campaignId"]; 
		this.campaignService.getId(this.campaignId).subscribe(
			result => {
				this.campaign = result.body;
				// console.log(this.campaign)
				for(let i = 0;i < this.campaign.kpi.length;i++){
					this.campaign.kpi[i].dailyBudget =this.campaign.kpi[i].dailyBudget/100;
				}
				this.campaign.totalBudget = this.campaign.totalBudget /100;
				this.showDay();
                this.showHours();
				if(this.campaign.bidType=="0"){
					this.bidType="CPM"
				}else{
					this.bidType="CPC";
				}
				if(!this.campaign.targeting.app){
					this.campaign.targeting.app = new App();
                }
                if(!this.campaign.targeting.appType){
                    this.campaign.targeting.appType = new App();
				}
				if(this.campaign.cycleType=="2"){
					this.cycleType="每天";
				}else if(this.campaign.cycleType=="3"){
					this.cycleType="每周";
				}else if(this.campaign.cycleType=="4"){
					this.cycleType="每月";
				}else if(this.campaign.cycleType=="0"){
					this.cycleType="全投放周期";
				}
				this.populationType=this.campaign.populationType;
				if(this.populationType=="0"){
					this.populationType="不限";
				}	
				this.targeting=this.campaign.targeting;
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
								//this.myModalService.alert(error.message);
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
				if(this.adx.length==0){
					this.adxName.push("不限");
				}else{
					//渠道定向
					this.rootService.adxList().subscribe(
						result=>{
							this.adxs = result.body.items;
							for(var i=0;i<this.adx.length;i++){
								for(var j=0;j<this.adxs.length;j++){
									if(this.adx[i]==this.adxs[j].id){
										this.adxName.push(this.adxs[j].name+"竞价");		
									}
								}
							}
						},
						error => {
							//this.myModalService.alert(error.message);
						}
					)
				}
				//定价合约
				this.contract = this.targeting.contract;
				this.rootService.contractList().subscribe(
					result=>{
						this.contracts= result.body.items;
						for(var i=0;i<this.contract.length;i++){
							for(var j=0;j<this.contracts.length;j++){
								if(this.contract[i]==this.contracts[j].id){
									this.contractName.push(this.contracts[j].name+"定价");		
								}
							}
						}
					},
					error => {
						//this.myModalService.alert(error.message);
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
							//this.myModalService.alert(error.message);
						}
					)
				}
				//场景定向
				if(this.campaign.sceneRadius=="7"){
					this.sceneRadius="半径76m";
				}else if(this.campaign.sceneRadius=="6"){
					this.sceneRadius="半径610m";
				}else if(this.campaign.sceneRadius=="5"){
					this.sceneRadius="半径2.4km";
				}else  if(this.campaign.sceneRadius=="4"){
					this.sceneRadius="半径20km";
				}else if(this.campaign.sceneRadius=="8"){
					this.sceneRadius="半径19.11m";
				}else if(!this.campaign.sceneRadius){
					this.sceneRadius="不限";
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
					console.log(2);
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
							//this.myModalService.alert(error.message);
						}
					)
				}

				
				this.apps1=this.targeting.app;
				this.app = this.apps1.value;
				if(this.apps1.isInclude=="1"){
					this.apps11="选择";
				}else if(this.apps1.isInclude=="0"){
					this.apps11="排除"
				}else{
					this.apps11="不限"
				}
				if(!this.app){	
					// return;
					console.log(1);
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
							//this.myModalService.alert(error.message);
						}
					)
				}
				
				
				// if(this.campaign.bidType=="0"){
				// 	this.campaign.bidType="CPM"
				// }else{
				// 	this.campaign.bidType="CPC"
				// }
				
				
			},
			error => {
			//	this.myModalService.alert(error.message);
			}
		)	
	}

	 // day显示
	 private showDay(){
        let day = 0;
        let start = this.campaign.startDate;
        let end = this.campaign.endDate;
        let act = () => {
			for(let i = 0;i < this.campaign.kpi.length;i++){
				if(this.campaign.kpi[i].period !==0){
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
        for(let i = 0;i < this.campaign.kpi.length;i++){
            for(let j = 0;j < 24;j++){
                let str = this.campaign.kpi[i].period.toString(2);
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

	private gotopolicyList(){
		this.router.navigate(["/home/campaign/policy/policyList"]);
	}
	private gotopackageList (){
		this.router.navigate(["/home/campaign/package/packageList"]);
      }
	private gotocampaignDetail(id){
		this.router.navigate(["/home/campaign/campaignDetail",id]);
	}
	private gotocampaignAudited(){
		this.router.navigate(["/home/campaign/campaignAudited"]);
	}
	private gotocampaignForm(id){
		this.router.navigate(["/home/campaign/campaignForm",id]);
	}
	private back(id){
		this.router.navigate(["/home/project/campaignList",id]);
		// window.history.back()
	}
}