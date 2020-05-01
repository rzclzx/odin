import { Component,OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { ValidationService } from "../../services/validation.service";
import { MyModalService } from "../../services/myModal.service";
import { PackageService } from "../../services/package.service";
import { Package } from "../../models/package.model";


declare var $;
declare var require;
let path = require("./packageForm.html");

@Component({
	selector: "ng-packageForm",
	template: path
})

export class PackageFormComponent implements OnInit {
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
            name: "物料包",
            value: "/home/campaign/package/packageList/"+this.route.snapshot.params["campaignId"]
		},
		{
            name: "物料包新建",
            value: undefined
		}
    ];

	private datas = [];
	private package:Package=new Package();
	private errorMessage;
	private id:number;
	private packageId:number;
	private campaignId:number;

	constructor(
		private publicService: PublicService,
		private chineseService: ChineseService,
		private packageService:PackageService,
		private router:Router,
		private validationService:ValidationService,
		private myModalService:MyModalService,
		private route:ActivatedRoute
	) {}

	ngOnInit() {
		this.campaignId = this.route.snapshot.params["campaignId"]; 
		this.package.needMonitorCode="1";
	}
	
	cancel(campaignId) {
		this.router.navigate(["home/campaign/package/packageList",campaignId]); 
	}

	save(campaignId) {	
		if (this.validationService.validate()) {
			this.savePackage().subscribe(
				result => {
					if ((this.id && result.head.httpCode == 204) || (!this.id && result.head.httpCode == 201)){	
						this.id=result.body.id;
						this.packageId=this.id;	
						if(this.package.needMonitorCode=="1"){	
							this.router.navigate(["/home/campaign/package/packageMonitorCode",campaignId,this.packageId]); 
						}else if(this.package.needMonitorCode=="0"){
							this.router.navigate(["/home/campaign/package/packageCreative",campaignId,this.packageId]);
						}		
					}else{
						this.myModalService.alert(result.body.message);
					}
				},
				error => {
					this.myModalService.alert(error.message)
				}
			);
		} else {
			this.myModalService.alert(this.chineseService.config.FAIL_PLEASE_PERFECT_SUBMIT_MESSAGE);
		}
	}

	savePackage(){
		let options={
			campaignId:this.campaignId,
			clickUrl:this.package.clickUrl,
			deeplinkUrl:this.package.deeplinkUrl,
			impressionUrl1:this.package.impressionUrl1,
			impressionUrl2:this.package.impressionUrl2,
			landpageUrl:this.package.landpageUrl,
			name:this.package.name,
			needMonitorCode:this.package.needMonitorCode
		}
		return this.id ? this.packageService.update1(this.id, this.package) : this.packageService.create(options)
	}
	
}