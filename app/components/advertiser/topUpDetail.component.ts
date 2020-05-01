import { Component,OnInit,ViewChild,TemplateRef } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { AdvertiserRootService } from "../../services/advertiser.root.service";
import { Advertiser } from "../../models/advertiser.model";

import { AdvertiserService } from "../../services/advertiser.service";
import { MyModalService } from "../../services/myModal.service";
import { ChineseService } from "../../services/chinese.service";
import { PublicService } from "../../services/public.service";

import "./createUsers.less";

declare var $;
declare var require;
let path = require("./topUpDetail.html"); 


@Component({
	selector: "create-topUpDetail",
	template: path
})

export class TopUpDetailComponent implements OnInit {
		
		private id: number;
		private advertiser:Advertiser=new Advertiser();
		
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
	            name: "充值明细",
	            value: undefined
			}
	    ];
        constructor(
        	private router: Router,
			private route:ActivatedRoute,
            private publicService: PublicService,
            private chineseService: ChineseService,
            private advertiserService:AdvertiserService,
			private advertiserRootService:AdvertiserRootService,
            private myModalService:MyModalService,
        ) {}
    
        ngOnInit() {
			this.id = this.route.snapshot.params["id"]; 
          
          	this.advertiserService.getId(this.id).subscribe(
				result => {
					this.advertiser = result.body;
				},
				error => {
					//this.myModalService.alert(error.message);
				}
			)
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