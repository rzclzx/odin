import { Component,OnInit } from "@angular/core";
import { Router,ActivatedRoute,Route } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { ValidationService } from "../../services/validation.service";
import { MyModalService } from "../../services/myModal.service";
import { PackageService } from "../../services/package.service";
import { Package } from "../../models/package.model";
import { AdvertiserService } from "../../services/advertiser.service";
import { Advertiser } from "../../models/advertiser.model";
import { Project } from "../../models/project.model";
import { ProjectService } from "../../services/project.service";

declare var $;
declare var require;
let path = require("./packageEdit.html");

@Component({
	selector: "ng-packageEdit",
	template: path
})

export class PackageEditComponent implements OnInit {
	public mainMenus = [
        {
            name: "投放管理",
            value: undefined
        },
        {
            name: "推广活动管理",
            value: "/home/campaign/campaignAudit"
		},
		{
            name: "物料包",
            value: "/home/campaign/package/packageList"+this.route.snapshot.params["campaignId"]
		},
		{
            name: "物料包编辑",
            value: undefined
		}
    ];

	private datas = [];
	private package:Package=new Package();
	private errorMessage;
	private id:number;
	private campaignId:number;
	private advertisers:Advertiser[];
	private advertiser: Advertiser;
	private projects:Project[];
	private project:Project = new Project();
	private needMonitorCode:string;


	constructor(
		private publicService: PublicService,
		private chineseService: ChineseService,
		private packageService:PackageService,
		private router:Router,
		private validationService:ValidationService,
		private myModalService:MyModalService,
		private advertiserService:AdvertiserService,
		private route:ActivatedRoute,
		private projectService:ProjectService,
	) {}

	ngOnInit() {
		this.id = this.route.snapshot.params["id"];
		this.campaignId= this.route.snapshot.params["campaignId"];
			//所有项目
			this.projectService.list().subscribe(
				result => {
					if (result.head.httpCode == 200) {
						let items = result.body.items || [];
						if(items.length === 0){
							this.myModalService.alert(this.chineseService.config.PLEASE_CREATE_ADVERTISER);
							return;
						}
						this.projects = items;
						if (this.id) this.getProject();
					}
				},
				error => this.errorMessage = <any>error
			);
	}

	getProject() {
		this.packageService.getId(this.id).subscribe(
			result => {
				if (result.head.httpCode == 200) {
					this.package = result.body;
					console.log(this.package);
						for(var i= 0;i<this.projects.length;i++){
							if(this.id==this.package.id){
								this.project= this.projects[i];
							}
						}
				 }
			},
			error => this.errorMessage = <any>error
		);
	}



	cancel() {
		this.router.navigate(["home/campaign/package/packageDetail",+this.campaignId,this.id]); 
	}

	save() {
		if (this.validationService.validate()) {
			this.savePackage().subscribe(
				result => {
					if ((this.id && result.head.httpCode == 204) || (!this.id && result.head.httpCode == 201)){
						this.router.navigate(["home/campaign/package/packageDetail",+this.campaignId,this.id]);
						// console.log(this.id);
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
		return this.id ? this.packageService.update1(this.id, this.package) : this.packageService.create(this.package)
	}


}	


	