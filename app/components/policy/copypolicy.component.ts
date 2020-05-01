import { Component,OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { MyModalService } from "../../services/myModal.service";
import { PackageService} from "../../services/package.service";
import { BaseService } from "../../services/base.service";
import { ValidationService } from "../../services/validation.service";
import { PackageRootService } from "../../services/package.root.service";
import {Http,Response,RequestOptions,Headers,HttpModule} from '@angular/http';

declare var $;
declare var require;
let path = require("./copypolicy.html");

@Component({
	selector: "ng-copyAudit",
	template: path
})

export class CopypolicyComponent implements OnInit {

	realBid=undefined;
	private allCheck:boolean;
    private datas = [];
    private id:number;
	mainMenus = [];
	campaignId;

	constructor(
		private publicService: PublicService,
		private chineseService: ChineseService,
		private myModalService: MyModalService,
        private router:Router,
        private baseService:BaseService,
        private route:ActivatedRoute,
		private packageRootService:PackageRootService,
		private http:Http,
		private validationService:ValidationService,

	) {
		this.allCheck = false;
		this.id = this.route.snapshot.params["id"];
		this.campaignId = this.route.snapshot.params["campaignId"];
		this.mainMenus = [
			{
				name: "投放管理",
				value: undefined
			},
			{
				name: "推广活动管理",
				value: "/home/campaign/policy/policyList/"+this.campaignId
			},
			{
				name: "复制投放策略",
				value: undefined
			}
		];
    }

	ngOnInit() {

    }

	private save(){
		if(this.validationService.validate()){
			let options={
				copyId:Number(this.id),
				creativeFlag:this.allCheck?"1":"0",
				name:this.realBid
			}
			this.packageRootService.copypolicy(options).subscribe(
				result => {
					this.router.navigate(["/home/campaign/policy/policyList",this.campaignId]);
				},
				error => {
					this.myModalService.alert(error.message);
				}
			)
		} else {
			this.myModalService.alert(this.chineseService.config.FAIL_PLEASE_PERFECT_SUBMIT_MESSAGE);
		}
	}
    private cancel(){
        this.router.navigate(["/home/campaign/policy/policyList",this.campaignId]);
    }
}