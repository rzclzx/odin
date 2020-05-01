import { Component,OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { MyModalService } from "../../services/myModal.service";
import { CampaignService } from "../../services/campaign.service";
import { Campaign,Kpi,Targeting,App,AppType } from "../../models/campaign.model";
import { DetailService } from "../../services/detail.service";
import { RootService } from "../../services/root.service";
import { TargetModal } from "../../models/root.model";



// import "./campaignDetail.less";

declare var $;
declare var require;
let path = require("./auditDetail.html");
let path1 = require('./campaignDetail.less');

@Component({
	selector: "ng-auditDetail",
	template: path,
	styles:['path1']
})

export class AuditDetailComponent implements OnInit {
	public mainMenus = [
        {
            name: "投放管理",
            value: undefined
        },
        {
            name: "推广活动管理",
            value: "/home/campaign/campaignList"
		},
		{
            name: "待审核",
            value: "/home/campaign/campaignAudit"
        },
        {
            name: "活动详情",
            value: undefined
        }
    ];
	
	private targetModal: TargetModal;
	private campaign:Campaign= new Campaign();
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
	private app = [];
	private apps = [];
	private adxId:any=0;
	private name: string = "";
	private searchType: string = "0";
	private appName = [];
	private network;
	private networks=[];
	private carrier;
	private carriers=[];
	private device;
	private devices=[];



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
				this.targeting=this.campaign.targeting;
				this.adx = this.targeting.adx;
				this.brand = this.targeting.brand;
				this.appTypesName = this.targeting.appType.value;
				this.region = this.targeting.region;
				this.app = this.targeting.app.value;
				if(this.campaign.bidType=="0"){
					this.campaign.bidType="CPM"
				}else{
					this.campaign.bidType="CPC"
				}
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
				//媒体分类
				this.detailService.appTypesName().subscribe(
					result=>{
						this.appTypes = result.body.items;
						for(var i=0;i<this.brand.length;i++){
							for(var j=0;j<this.appTypes.length;j++){
								if(this.appTypesName[i]==this.appTypes[j].id){
									this.appTypesNames.push(this.appTypes[j].name);				
								}
							}
						}
					},
					error => {
						//this.myModalService.alert(error.message);
					}
				)
				//地域定向
					this.rootService.regionList().subscribe(
						result=>{
							this.regions = result.body.items;
							for(var i=0;i<this.region.length;i++){
								for(var j=0;j<this.regions.length;j++){
									if(this.region[i]==this.regions[j].id){
										this.regionsName.push(this.regions[j].name);				
									}
								}
							}
						},
						error => {
							//this.myModalService.alert(error.message);
						}
					)
					//os定向,设备平台，联网环境，运营商
				this.targetModal = new TargetModal(this.campaign.targeting.network,this.campaign.targeting.carrier,this.campaign.targeting.device,this.campaign.targeting.os);
				this.network=this.targetModal.network;
				for(var i =0;i<this.network.length;i++){
					if(this.network[i].value==true){
						this.networks.push(this.network[i].name);
					}
				}
				this.carrier=this.targetModal.carrier;
				for(var i =0;i<this.carrier.length;i++){
					if(this.carrier[i].value==true){
						this.carriers.push(this.carrier[i].name);
					}
				}
				this.device=this.targetModal.device;
				for(var i =0;i<this.device.length;i++){
					if(this.device[i].value==true){
						this.devices.push(this.device[i].name);
					}
				}
				this.os=this.targetModal.os;
				for(var i =0;i<this.os.length;i++){
					if(this.os[i].value==true){
						this.oss.push(this.os[i].name);
					}
				}
				//app媒体名称定向
				let options = {
					names: this.name,
					adxId: this.adxId,
					searchType: this.searchType
				}
				this.rootService.appList(options).subscribe(
					result=>{
						this.apps= result.body.items;
						for(var i=0;i<this.app.length;i++){
							for(var j=0;j<this.apps.length;j++){
								if(this.app[i]==(this.apps[j].adxId+"|"+this.apps[j].id)){		
									this.appName.push(this.apps[j].name);				
								}
							}
						}
						
					},
					error => {
						//this.myModalService.alert(error.message);
					}
				)
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
						//this.myModalService.alert(error.message);
					}
				)
				this.showDay();
                this.showHours();
			},
			error => {
				//this.myModalService.alert(error.message);
			}
		)
		
		
		
		//渠道定向
		let options = {
			name: this.name,
            adxId: this.adxId,
            searchType: this.searchType
		}
		this.rootService.appList(options).subscribe(
			result=>{
				this.adxs = result.body.items;
				for(var i=0;i<this.adx.length;i++){
					for(var j=0;j<this.adxs.length;j++){
						if(this.adx[i]==this.adxs[j].adxId){
							this.adxName.push(this.adxs[j].adxName);		
						}
					}
				}
			},
			error => {
				//this.myModalService.alert(error.message);
			}
		)
	}

	 // day显示
	 private showDay(){
        let day = 0;
        let start = this.campaign.startDate;
        let end = this.campaign.endDate;
        let act = () => {
            day ++;
            start += 1000*60*60*24;
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
	private gotocampaignAudit(){
		this.router.navigate(["/home/campaign/campaignAudit"]);
	}
	private gotocampaignForm(id){
		this.router.navigate(["/home/campaign/campaignForm",id]);
	}
}