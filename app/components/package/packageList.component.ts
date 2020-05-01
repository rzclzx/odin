import { Component,OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { PackageService } from "../../services/package.service";
import { ChineseService } from "../../services/chinese.service";
import { MyModalService } from "../../services/myModal.service";
import { ProjectService } from "../../services/project.service";
import { Project } from "../../models/project.model";
import { CampaignService } from "../../services/campaign.service";
import { Campaign,Kpi,Targeting,App,AppType } from "../../models/campaign.model";
import { Package,ImageCreatives,InfoflowCreatives } from "../../models/package.model";
import { Page } from "../../models/page.model";
import "../campaign/campaignDetail.less";

declare var $;
declare var require;
let path = require("./packageList.html");

@Component({
	selector: "ng-packageList",
	template: path
})

export class PackageListComponent implements OnInit {
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
            value: undefined
		}
    ];

	private datas = [];
	private campaign:Campaign= new Campaign();
	private imageCreatives:ImageCreatives[] = [];
	private infoflowCreatives:InfoflowCreatives[]=[];
	private project:Project[]=[];
	private projects;
	private id: number;
	private packageId:number;
	private projectName:string;
	private projectId:number;
	private campaignId:number;
	private packages: Package[] = [];
	private packagess: Package[] = [];
	private errorMessage;
	private needMonitorCode:string;
	private package:Package = new Package();
	private page= {
		pageNo: 0,
		pageSize: 50,
		total:0,
		currentShow: 1
	};

	constructor(
		private publicService: PublicService,
        private chineseService: ChineseService,
		private router:Router,
		private packageService:PackageService,
		private myModalService:MyModalService,
		private route:ActivatedRoute,
		private projectService:ProjectService,
		private campaignService:CampaignService,
	) {}

	ngOnInit() {
		this.dataInit();
		this.campaignId= this.route.snapshot.params["campaignId"];
		this.refreshTable();
		
	}
	private length(v){
		return v?v.length:0;
	}
	private dataInit(){ 
		// this.packageId= this.route.snapshot.params["id"];
		this.campaignId= this.route.snapshot.params["campaignId"];
		this.campaignService.getId(this.campaignId).subscribe(
			result => {
				this.campaign = result.body;
				this.projectId=this.campaign.projectId;
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)
		// this.packageService.list({campaignId:this.campaignId}).subscribe(
		// 	result =>{
		// 		this.packagess=result.body.items;
		// 		
		// 		for(var i=0;i<this.packagess.length;i++){
						// if(!this.packagess[i].id){
						// 	$("#noDatepackage").show();		
						// }else if(this.packagess[i].id){
						// 	$("#noDatepackage").hide()
						// }	
		// 			}
		// 	},
		// )
		$(".empty-row").hide();

	}

	//project添加iswrite属性
	addIswrite(project){
		project.isWrite = false;
	}

	onPage(event){
		if(event === 1){
            this.page.pageNo = 0;
            this.page.currentShow = 1;       
		} 
		this.refreshTable();
	}

	// 刷新表格数据
private refreshTable(obj?) {
	let options = {
		pageNo: this.page.pageNo + 1,
		pageSize: this.page.pageSize,
		campaignId:this.campaignId
	}
	if(obj){
		for(let i in obj){
			options[i] = obj[i];
		}
	}
	this.packageService.list(options)
		.subscribe(
			result => {
				if (result.head.httpCode == 200) {
					let rows = [];
					for (let i = 0,len = result.body.items.length; i < len; i++) {
						rows[(options.pageNo - 1)*options.pageSize+i] = result.body.items[i];
						this.addIswrite(rows[(options.pageNo - 1)*options.pageSize+i]);
					}
					this.packages = rows;	
					if(this.packages.length==0){
						$("#noDatepackage").show();		
					}else if(this.packages.length !=0){
						$("#noDatepackage").hide()
					}								
					if(result.body.pager){
						this.page.pageNo = result.body.pager.pageNo;
						this.page.pageSize = result.body.pager.pageSize;
						this.page.total = result.body.pager.total;
						this.page.pageNo--;
						if(!this.packages[this.page.pageSize*this.page.pageNo] && this.page.pageNo > 0){
							this.page.pageNo--;
						}
					}
				}else if(result.head.httpCode == 404){
					this.packages = [];
				}
			},
			error => this.errorMessage = <any>error);
}

private update(e): void{
	this.page.pageSize = e;
	this.refreshTable({pageNo: 1});
}

    
      //路由跳转
        private gotopolicyList (){
		  this.router.navigate(["/home/campaign/policy/policyList"]);
        }
        private gotopackageList (){
		  this.router.navigate(["/home/campaign/package/packageList"]);
	    }
	    private gotopackageDetail(campaignId,id){
		  this.router.navigate(["/home/campaign/package/packageDetail",+this.campaignId,id]);
        }
		private gotocampaignDetail(campaignId){
			this.router.navigate(["/home/campaign/campaignDetail",campaignId]);
		}
		private gotocampaignForm(){
			this.router.navigate(["/home/campaign/campaignForm"]);
		}
		private gotopackageForm(campaignId){
			this.router.navigate(["/home/campaign/package/packageForm",campaignId]);
		}
		private gotopackageEdit (id){
			this.router.navigate(["/home/campaign/package/packageEdit",id]);
		}
		private gotoprojectDetail(id){
			this.router.navigate(["/home/project/projectDetail",id]);
		}
		private gotocampaignAudited(){
			this.router.navigate(["/home/campaign/campaignAudited"]);
		}
}