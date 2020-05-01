import { Component,OnInit,ViewChild,TemplateRef } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { AdvertiserRootService } from "../../services/advertiser.root.service";
import { Page } from "../../models/page.model";
import { Advertiser } from "../../models/advertiser.model";

import { AdvertiserService } from "../../services/advertiser.service";
import { MyModalService } from "../../services/myModal.service";
import { ChineseService } from "../../services/chinese.service";
import { PublicService } from "../../services/public.service";

import "./createUsers.less";

declare var $;
declare var require;
let path = require("./channelAudit.html"); 


@Component({
	selector: "create-channelAudit",
	template: path
})

export class ChannelAuditComponent implements OnInit {
		@ViewChild("mydatatable") mydatatable;
		
		private channelAllcheck: boolean = false;
		private channelSelected: Array<string> = [];
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
	            name: "渠道审核",
	            value: undefined
			}
	    ];
		private id: number;
		private page:Page = {
	        pageNo: 0,
	        pageSize: 10,
	        total:0
	    };
	    private channel: Array<object>;
		private advertiser:Advertiser=new Advertiser();
	    
        constructor(
        	private router: Router,
            private publicService: PublicService,
			private route:ActivatedRoute,
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
			
	        this.advertiserRootService.advertiserAudits( this.id).subscribe(
				result => {
					if( result.head.httpCode == 200){
						this.channel = result.body.items;
						this.page.pageSize = this.channel.length;
						this.page.total = this.channel.length;
					}
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
	
	private allCheckFire(){
		
	}
	
	private onSelect(){
		
	}
	
}