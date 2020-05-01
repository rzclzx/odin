import { Component,OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { MyModalService } from "../../services/myModal.service";
import { PublicService } from "../../services/public.service";
import { AdvertiserRootService } from "../../services/advertiser.root.service";
import { ChineseService } from "../../services/chinese.service";
import { AdvertiserService } from "../../services/advertiser.service";
import { Advertiser } from "../../models/advertiser.model";
import { IndustryService} from "../../services/industry.service";
import { Industry } from "../../models/industry.model";
import { Page } from "../../models/page.model";
import "./advertiserDetail.less";
import "./advertiserDetail.less"

declare var $;
declare var Clipboard;
declare var require;
let path = require("./advertiserDetail.html");

@Component({
	selector: "ng-advertiserDetail",
	template: path
})

export class AdvertiserDetailComponent implements OnInit {
	
	public mainMenus = [
        {
            name: "客户管理",
            value: undefined
        },
        {
            name: "广告主管理",
            value: "/home/advertiser/advertiserList"
		},
		{
            name: "广告主详情",
            value: undefined
		}
    ];

	private datas = [];
	private advertiser:Advertiser=new Advertiser();
	private industry:Industry[] = [];
	// private advertiser={};
	private errorMessage;
	private id:number;
	private industryName:string;
	private name:string;
	private elseIndustry = [];
	
	constructor(
		private publicService: PublicService,
        private chineseService: ChineseService,
        private advertiserService:AdvertiserService,
		private router:Router,
		private myModalService:MyModalService,
		private route:ActivatedRoute,
		private industryService:IndustryService,
		private advertiserRootService : AdvertiserRootService
	) {}

	ngOnInit() {
		this.id = this.route.snapshot.params["id"]; 
		this.detailInit();
	}
	
	//数据初始化
	private detailInit(){	
		this.advertiserService.getId(this.id).subscribe(
			result => {
				 this.advertiser = result.body;
				
				//批量查询行业
		        this.advertiserRootService.industryQuery().subscribe(
					result => {
						this.elseIndustry = result.body.items;      
						for(let i in this.elseIndustry){
							if(this.elseIndustry[i].id == this.advertiser.industryId){
								this.industryName = this.elseIndustry[i].name 
							}
						}
					},
					error => {
						//this.myModalService.alert(error.message);
					}
				)
			},
			error => {
				//this.myModalService.alert(error.message);
			}
		)
		
	}

	
	//路由跳转
	private gocreateAdvertisers(id){
		this.router.navigate(["/home/advertiser/createAdvertisers",id]);
    }
	private gotoadvertiserList(){
		this.router.navigate(["/home/advertiser/advertiserList"]);
	}
	private goAdvertiserDetail(){
		this.router.navigate(["/home/advertiser/advertiserDetail/"+this.id]);
	}
	private goUserList(){
		this.router.navigate(["/home/advertiser/userList/"+this.id]);
	}
	private goChannelAudit(){
		this.router.navigate(["/home/advertiser/channelAudit/"+this.id]);
	}
	private goTopUpDetail(){
		this.router.navigate(["/home/advertiser/topUpDetail/"+this.id]);
	}
}