import { Component,OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChannelRootService } from "../../services/channel.root.service";
import { ChineseService } from "../../services/chinese.service";
import { CreativeSizeManagementService } from "../../services/creativeSizeManagement.service";
import { MyModalService } from "../../services/myModal.service";

declare var $;
declare var require;
let path = require("./channelDetail.html");

@Component({
	selector: "ng-channelDetail",
	template: path
})

export class ChannelDetailComponent implements OnInit {

	public mainMenus = [
        {
            name: "渠道管理",
            value: undefined
        },
        {
            name: "程序化渠道",
            value: "/home/programmaticChannel/channelList"
        },
        {
            name: "程序化渠道详情",
            value: undefined
        },
    ];

	private adxId : number;
	private address:string;
	private admode:string;
	private advertiserAuditUrl:string;
	private advertiserSyncUrl:string;
	private advertiserUpdateUrl:string;
	private andrImageTmpl:string;
	private andrInfoflowTmpl:string;
	private andrVideoTmpl:string;
	private aurl:string;
	private campanyName:string;
	private contacts:string;
	private creativeAuditUrl:string;
	private creativeSyncUrl:string;
	private creativeUpdateUrl:string;
	private cturl:string;
	private domain:string;
	private email:string;
	private enable:string;
	private exchangeRate:string;
	private id:number;
	private imageAuditType:number;
	private infoflowAuditType:string;
	private iosImageTmpl:string;
	private iosInfoflowTmpl:string;
	private iosVideoTmpl:string;
	private iurl:string;
	private logoPath:string;
	private name:string;
	private needAdvertiserAudit:string;
	private needCreativeAudit:string;
	private nurl:string;
	private qualificationAuditUrl:string;
	private qualificationUpdateUrl:string;
	private securityKey;
	private sizes=[];
	private supportSsl:string;
	private videoAuditType:string;
	private securityKeyss=[];
	private  securityKeys={};
	
	constructor(
		private publicService: PublicService,
		private chineseService: ChineseService,
		private channelRootService: ChannelRootService,
		private router: Router,
		private route: ActivatedRoute,
		private creativeSizeManagementService : CreativeSizeManagementService,
		private myModalService:MyModalService
		
	) {
		this.adxId=this.route.snapshot.params["adxId"];
	}
	ngOnInit() {
		this.creativeSizeManagementService.adxId(this.adxId).subscribe(
			result => {
				this.name=result.body.name;
				this.logoPath=result.body.logoPath;
				this.id=result.body.id;
				this.exchangeRate=result.body.exchangeRate;
				this.cturl=result.body.cturl;
				this.iurl=result.body.iurl;
				this.aurl=result.body.aurl;
				this.nurl=result.body.nurl;
				this.sizes=result.body.sizes;
				this.iosImageTmpl=result.body.iosImageTmpl;
				this.andrImageTmpl=result.body.andrImageTmpl;
				this.andrVideoTmpl=result.body.andrVideoTmpl;
				this.iosVideoTmpl=result.body.iosVideoTmpl;
				this.andrInfoflowTmpl=result.body.andrInfoflowTmpl;
				this.iosInfoflowTmpl=result.body.iosInfoflowTmpl;
				this.advertiserAuditUrl=result.body.advertiserAuditUrl;
				this.qualificationAuditUrl=result.body.qualificationAuditUrl;
				this.advertiserSyncUrl=result.body.advertiserSyncUrl;
				this.advertiserUpdateUrl=result.body.advertiserUpdateUrl;
				this.advertiserUpdateUrl=result.body.advertiserUpdateUrl;
				this.creativeAuditUrl=result.body.creativeAuditUrl;
				this.creativeSyncUrl=result.body.creativeSyncUrl;
				this.creativeUpdateUrl=result.body.creativeUpdateUrl;
				this.needCreativeAudit=result.body.needCreativeAudit;
				this.supportSsl=result.body.supportSsl;
				this.needAdvertiserAudit=result.body.needAdvertiserAudit;
				this.securityKey=result.body.securityKey;
				this.securityKeys=JSON.parse(result.body.securityKey);
				// console.log(this.securityKeys)
				for(let key in this.securityKeys){
					this.securityKeyss.push({key:key,value:this.securityKeys[key]});
				}
				// console.log(this.securityKeyss)
			},
			error =>{
				this.myModalService.alert(error.message);
			}
		)
		
	}
	
	private goPricingContracts(){
		this.router.navigate(["/home/programmaticChannel/pricingContracts/"+this.adxId]);
	}
	
	private goMediaManagement(){
		this.router.navigate(["/home/programmaticChannel/mediaManagementProgram/"+this.adxId]);	
	}
	
	private goChannelDetail(){
		this.router.navigate(["/home/programmaticChannel/channelDetail/"+this.adxId]);
	}
	
	private goTrafficManagement(){
		this.router.navigate(["/home/programmaticChannel/trafficManagement/"+this.adxId]);
	}
	private edit(){
		this.router.navigate(["/home/programmaticChannel/createEditChannel/"+this.adxId]);
	}
	private back(){
		this.router.navigate(["/home/programmaticChannel/channelList"]);
	}
	
}