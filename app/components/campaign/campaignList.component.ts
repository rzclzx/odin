import { Component,OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { MyModalService } from "../../services/myModal.service";
import { BaseService } from "../../services/base.service";
import { Campaign,Kpi } from "../../models/campaign.model";
import { CampaignService } from "../../services/campaign.service";
import { ProjectService } from "../../services/project.service";
import { Project } from "../../models/project.model";
import { Page } from "../../models/page.model";
// import "../projectDetail/projectDetail.less";


declare var $;
declare var require;
let path = require("./campaignList.html");
let path1= require("../campaign/campaignDetail.less")

@Component({
	selector: "ng-campaignList",
	template: path,
	styles:['path1']
})

export class CampaignListComponent implements OnInit {

	public mainMenus = [
        {
            name: "投放管理",
            value: undefined
        },
        {
			name: "广告项目管理",
            value: "/home/project/projectList"
		},
		{
            name: "推广活动",
            value: undefined
		}
    ];

	private id:number;
	private name:string;
	private projectId:number;
	private campaignId:number;
	private campaignIds;
	private errorMessage;
	private projectName:string;
	private datas = [];
	private campaign:Campaign[] = [];
	private campaigns:Campaign[]=[];
	private kpi:Kpi[]=[];
	private page= {
		pageNo: 0,
		pageSize: 50,
		total:0,
		currentShow: 1
	};
	private project =new Project();
	private startDate: number= new Date().getTime();
    
    private endDate: number= new Date().getTime();


	constructor(
		private router: Router,
		private publicService: PublicService,
		private chineseService: ChineseService,
		private campaignService:CampaignService,
		private myModalService:MyModalService,
		private route:ActivatedRoute,
		private projectService:ProjectService
	) {
}

	ngOnInit() {
		 this.itemInit();
		 this.refreshTable();
		
	 }

	 private itemInit(){
		this.projectId= this.route.snapshot.params["id"]; 
		// this.campaignId= this.route.snapshot.params["campaignId"]; 
		this.publicService.timeRangePickerSet("timeRangePicker",{
			locale: this.chineseService.config.TIMERANGEPICKER_CONFIG
		},(start,end) => {
			this.startDate = start._d.getTime() - start._d.getTime()%1000;
			this.endDate = end._d.getTime() - end._d.getTime()%1000;
		});
		this.projectService.getId(this.projectId).subscribe(
			result =>{
				this.project=result.body;
				if(this.project.totalAmount==0){
					$("#noDate").show();
					$(".empty-row").hide()
				}else{
					$("#noDate").hide()
		}
			}
		)
	
		
		
	}

	  // 刷新表格数据
	  private refreshTable(obj?) {
		let options = {
			startDate: this.startDate,
			endDate: this.endDate,
			pageNo: this.page.pageNo + 1,
			pageSize: this.page.pageSize,
			projectId:this.projectId
		}
		if(obj){
			for(let i in obj){
				options[i] = obj[i];
			}
		}
		this.campaignService.list(options)
			.subscribe(
				result => {
					if (result.head.httpCode == 200) {
						let rows = [];
						for (let i = 0,len = result.body.items.length; i < len; i++) {
							rows[(options.pageNo - 1)*options.pageSize+i] = result.body.items[i];
							this.addIswrite(rows[(options.pageNo - 1)*options.pageSize+i]);
						}
						this.campaigns = rows;	
						if(result.body.pager){
							this.page.pageNo = result.body.pager.pageNo;
							this.page.pageSize = result.body.pager.pageSize;
							this.page.total = result.body.pager.total;
							this.page.pageNo--;
							if(!this.campaigns[this.page.pageSize*this.page.pageNo] && this.page.pageNo > 0){
								this.page.pageNo--;
							}
						}
					}else if(result.head.httpCode == 404){
						this.campaigns = [];
					}
				},
				error => this.errorMessage = <any>error);
	}
//表格条件初始化
    private update(e): void{
		this.page.pageSize = e;
		this.refreshTable({pageNo: 1});
	}

	 //project添加iswrite属性
	 addIswrite(campaign){
		campaign.isWrite = false;
	}
	//监听分页
	onPage(event){
		if(event === 1){
            this.page.pageNo = 0;
            this.page.currentShow = 1;       
		} 
		this.refreshTable();
	}

		//活动下开关修改
		switchChange(row) {
			let enable=row.enable?row.enable:"0";
			let id = row.id;
			if(enable == "1"){	//如果状态为启动（1），再次点击需要暂停。
				this.campaignService.getStatus(id,{enable:"0"}).subscribe(
					result => {
						this.refreshTable()
					},
					error => {
					//	this.myModalService.alert(error.message);
					}
				)
	
			} else {
				this.campaignService.getStatus(id,{enable:"1"}).subscribe(
					result => {
						this.refreshTable()
					},
					error => {
						//this.myModalService.alert(error.message);
					}
				)
			}
		};
	
	

	 //返回
	 private  back(){
		this.router.navigate(["/home/project/projectList"]);
	}
	//编辑
	private gotoEditItem(id){
		this.router.navigate(["/home/project/projectEdit",id]);
	}
	private gotocampaignDetail(id){
		this.router.navigate(["/home/campaign/campaignDetail",id]);
	}
	private gotocampaignForm(id){
		this.router.navigate(["/home/campaign/campaignForm",id]);
	}
	private gotopolicyList(id){
		this.router.navigate(["/home/campaign/policy/policyList",id]);
	}
	private gotopackageList(id){
		this.router.navigate(["/home/campaign/package/packageList",id]);
	}
	private gocampaignForm(projectId){
		this.router.navigate(["/home/campaign/campaignForm",this.projectId,true]);
	}
	private gotocopyAudited(row){
		this.router.navigate(["/home/campaign/copyAudited",this.projectId,row.id]);
	}

	
}