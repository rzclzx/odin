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
let path = require("./userList.html"); 


@Component({
	selector: "create-userList",
	template: path
})

export class UserListComponent implements OnInit {
		
		private advertiser:Advertiser=new Advertiser();
		private id: number;
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
	            name: "用户列表",
	            value: undefined
			}
	    ];
        constructor(
        	private router: Router,
            private publicService: PublicService,
            private chineseService: ChineseService,
			private route:ActivatedRoute,
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