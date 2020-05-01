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
import "./copyAudited.component.less";

declare var $;
declare var require;
let path = require("./copyAudited.html");

@Component({
	selector: "ng-copyAudit",
	template: path
})

export class CopyAuditedComponent implements OnInit {

	campaignId;
	private datas = [];
	id;
	private mainMenus = [];
	private campaigns=[];
	realBid=undefined;
	obj={
		package:false,
		policy:false
	};
	campaign;


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

		this.id = this.route.snapshot.params["id"];
		this.campaignId = this.route.snapshot.params["campaignId"];

		this.mainMenus = [
			{
				name: "投放管理",
				value: undefined
			},
			{
				name: "广告项目管理",
				value: "/home/project/projectList/"+this.id
			},
			{
				name: "复制推广活动",
				value: undefined
			}
		];
    }

	ngAfterViewInit(): void {
		$("#policy").attr("disabled","disabled")
		$("#policy").css("background","#ddd")
	}

	ngOnInit() {
        this.itemInit();
    }

	packageCheckbox(event,v){
		if(v == true){
			$("#policy").removeAttr("disabled")
			$("#policy").css("background","#fff")
		}
		else{
			$("#policy").attr("disabled","disabled")
			$("#policy").css("background","#ddd")
		}
	}

    //初始化查询广告项目
	itemInit(){
		let paramAdvertise = {
		}
		//查询广告项目
		this.packageRootService.queryadvertise(paramAdvertise).subscribe(
			result => {
				this.campaigns = result.body.items;
				for(let i = 0;i<result.body.items.length;i++){
					if(result.body.items[i].id == this.id){
						this.campaign = result.body.items[i];
					}
				}
			},
			error => {
			//	this.myModalService.alert(error.message);
			}
		)
	}


	private save(){
		if(this.validationService.validate()){
			let options={
				copyId:Number(this.campaignId),
				name:this.realBid,
				packageFlag:this.obj.package?"1":"0",
				policyFlag:this.obj.policy?"1":"0",
				projectId:this.campaign.id,
			}
			this.packageRootService.copypolicy(options).subscribe(
				result => {
					this.router.navigate(["/home/campaign/campaignList",this.id]);
				},
				error => {
					//this.myModalService.alert(error.message);
				}
			)
		} else {
			this.myModalService.alert(this.chineseService.config.FAIL_PLEASE_PERFECT_SUBMIT_MESSAGE);
		}
	}
    private cancel(){
        this.router.navigate(["/home/campaign/campaignList",this.id]);
    }
}