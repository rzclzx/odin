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
let path = require("./createUsers.html"); 


@Component({
	selector: "create-users",
	template: path
})

export class CreateUsersComponent implements OnInit {
private datas = [];
    private advertiser=new Advertiser();
	private advertiseId :number;
	private email :string;
	private name :string;
	private password :string;
	private phoneNum :string;
	private realName :string;
	private remark :string;
	private role :string;
        constructor(
        	private router: Router,
            private publicService: PublicService,
            private chineseService: ChineseService,
            private advertiserService:AdvertiserService,
			private advertiserRootService:AdvertiserRootService,
            private myModalService:MyModalService,
        ) {}
    
        ngOnInit() {
//          
        }

	private back(){
		this.router.navigate(["/home/advertiser/advertiserList"]);
	}
	
	private save(){
		this.advertiserRootService.createUsers({
			advertiseId : this.advertiseId ? this.advertiseId : 121,
			email : this.email ? this.email : "1669433915@qq.com",
			name : this.name ? this.name : "sadas",
			password : this.password ? this.password : "zdasdasdas858",
			phoneNum : this.phoneNum ? this.phoneNum : "15010018454",
			realName : this.realName ? this.realName : "aaa",
			remark : this.remark ? this.remark : "",
			role : this.role? this.role : ""
		}).subscribe(
			result => {
	            console.log(result)
			},
			error => {
				console.log(error.message);
			}
		)
	}
}