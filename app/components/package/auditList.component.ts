import { Component,OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { PackageService } from "../../services/package.service";
import { ProjectService } from "../../services/project.service";
import { Project } from "../../models/project.model";
import { ChineseService } from "../../services/chinese.service";
import { MyModalService } from "../../services/myModal.service";
import { Package } from "../../models/package.model";
import { Page } from "../../models/page.model";
import "../campaign/campaignDetail.less";

declare var $;
declare var require;
let path = require("./auditList.html");

@Component({
	selector: "ng-auditList",
	template: path
})

export class AuditListComponent implements OnInit {
	public mainMenus = [
        {
            name: "运营支撑",
            value: undefined
        },
        {
            name: "推广活动管理",
            value: "/home/campaign/campaignAudited"
		},
		{
            name: "待审核",
            value: "/home/campaign/campaignAudit"
        },
        {
            name: "物料包",
            value: undefined
        }
    ];


	private campaignId:number;
	private project;
	private packagss:Package = new Package();
	private package;
	private packages:Package[]=[];
	private page:Page= {
		pageNo: 0,
		pageSize: 10,
		total:0
	};
	private id:number;
	private errorMessage ;
	private projectId:number;
	private projectName:string;
	private needMonitorCode:string;
	private campaignName:string;
	

	constructor(
		private publicService: PublicService,
        private chineseService: ChineseService,
		private router:Router,
		private packageService:PackageService,
		private myModalService:MyModalService,
		private route:ActivatedRoute,
		private projectService:ProjectService
	) {}

	ngOnInit() {
		this.campaignId = this.route.snapshot.params["campaignId"];
		this.refreshTable();
		this.dataInit();
	}
	
	private dataInit(){	
		this.packageService.list().subscribe(
			result => {
				this.package= result.body.items;
				for(var i=0;i<this.package.length;i++){
					this.id=this.package[i].id;
					this.projectName=this.package[i].projectName;
					
				}
			},
			error => {
                this.myModalService.alert(error.message);
            }
		)
		this.projectService.list().subscribe(
			result => {
				this.project= result.body.items;
				for(var i=0;i<this.project.length;i++){
						if(this.project[i].name==this.projectName){
							this.projectId=this.project[i].id
						}
					}		
			},
			error => {
                this.myModalService.alert(error.message);
            }
		)
	}
	// 刷新表格数据
	private refreshTable(obj?) {
		let options = {
			pageNo: this.page.pageNo + 1,
			pageSize: this.page.pageSize,
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
						// console.log(this.packages)
						for(var i=0;i<this.packages.length;i++){
							this.needMonitorCode=this.packages[i].needMonitorCode;
							if(this.needMonitorCode=="1"){
								this.needMonitorCode="是";
							}else{
								this.needMonitorCode="否";
							}
							this.campaignName=this.packages[i].campaignName;
						}	
						if(result.body.pager){
							this.page = result.body.pager;
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

	//package添加iswrite属性
	addIswrite(packagess){
		packagess.isWrite = false;
	}
    
      //路由跳转
        private gotopolicyList (){
		  this.router.navigate(["/home/campaign/policy/policyList"]);
        }
        private gotopackageList (){
		  this.router.navigate(["/home/campaign/package/packageList"]);
	    }
	    private gotopackageDetail(){
		  this.router.navigate(["/home/campaign/package/packageDetail",this.campaignId,this.id]);
        }
		private gotocampaignDetail(){
			this.router.navigate(["/home/campaign/campaignDetail",this.campaignId]);
		}
		private gotocampaignAudit(){
			this.router.navigate(["/home/campaign/campaignAudit"]);
		}
		private gotopackageEdit (){
			this.router.navigate(["/home/campaign/package/packageEdit",this.campaignId,this.id]);
		}
		private gotoprojectDetail(projectId){
			this.router.navigate(["/home/project/projectDetail",projectId]);
		}
}