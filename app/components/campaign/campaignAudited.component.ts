import { Component,OnInit,ViewChild,TemplateRef,ElementRef} from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { CampaignService } from "../../services/campaign.service";
import { Campaign } from "../../models/campaign.model";
import { Page } from "../../models/page.model";
import { MyModalService } from "../../services/myModal.service";
// import "../projectList/projectList.less";
// import "../campaign/campaignDetail.less";


declare var $;
declare var require;
let path = require("./campaignAudited.html");
let path1 = require('../campaign/campaignDetail.less');
let path2 = require("../projectList/projectList.less")

@Component({
	selector: "ng-campaignAudited",
	template: path,
	styles:['path1','path2']
})

export class CampaignAuditedComponent implements OnInit {
	public mainMenus = [
        {
            name: "投放管理",
            value: undefined
        },
        {
            name: "推广活动管理",
            value: "/home/campaign/campaignList"
		},
		{
            name: "已审核",
            value: undefined
        },
    ];

	private errorMessage;
	private campaigns = [];
	private campaign:Campaign = new Campaign();
	private campaignss=[];
	private advertiserName:string;
	private name:string;
	private datas = [];
	private id:number;
	private ids;
	private status:string="00";
	private enable:string;
	private auditStatus:string;
	private auditStatused:string;
	private page= {
		pageNo: 0,
		pageSize: 10,
		total:0,
		currentShow: 1
	};
	private obj;
	private zhi:string="" ;

	private startDate: number=new Date().getTime();
	private Date: number;
	private endDate: number=new Date().getTime();
	private startDate1:number;
	private endDate1:number;

	constructor(
		private publicService: PublicService,
		private chineseService: ChineseService,
		private router: Router,
		private route:ActivatedRoute,
		private campaignService:CampaignService,
		private myModalService:MyModalService
	) {}

	

	ngOnInit() {
		this.dataInit();
		this.refreshTable();
		$("#timeRangePicker1").attr("value",'')
	}
	private show(){
		$(".red").removeClass("hide");
		// $("#timeRangePicker1").attr("value",'')
	}
	    // 数据初始化
		private dataInit(){
			this.id = this.route.snapshot.params["id"];    
			this.publicService.timeRangePickerSet("timeRangePicker1",{
				locale: this.chineseService.config.TIMERANGEPICKER_CONFIG,
				autoUpdateInput: false,
				// "autoApply": true,
			},(start,end) => {
				this.startDate1 = start._d.getTime() - start._d.getTime()%1000;
				this.endDate1 = end._d.getTime() - end._d.getTime()%1000;
				this.zhi = "至";
			},() => {
				if(!this.startDate1 && !this.endDate1){
					this.startDate1 = this.publicService.getTodayStartandEnd().startDate;
					this.endDate1 = this.publicService.getTodayStartandEnd().endDate;
					this.zhi = "至";
				}
			});
			
			this.publicService.timeRangePickerSet("timeRangePicker",{
				locale: this.chineseService.config.TIMERANGEPICKER_CONFIG,
				autoUpdateInput: false,
			},(start,end) => {
				this.startDate = start._d.getTime() - start._d.getTime()%1000;
				this.endDate = end._d.getTime() - end._d.getTime()%1000;
			});
			// for(var i =0;i<this.campaigns.length;i++){
			// 	//审核状态
			// if(this.campaigns[i].auditStatus=="02"){
			// 	this.campaignss.push(this.campaigns[i]);
			// 	this.auditStatused="已审核";
			// }
			// }
		}
		//已审核活动下开关修改
	switchChange(row) {
		let enable=row.enable?row.enable:"0";
		let id = row.id;
		if(enable == "1"){	//如果状态为启动（1），再次点击需要暂停。
			this.campaignService.getStatus(id,{enable:"0"}).subscribe(
				result => {
					this.refreshTable()
				},
				error => {
					//this.myModalService.alert(error.message);
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

		
	// 刷新表格数据
	private refreshTable(obj?) {
		for(let i = 0;i < 25;i++){
			this.campaigns.push({
				enable: i % 2 === 0 ? "1" : "0",
				id:i,
				name: "活动名称" + i,
				startDate: 1510836770,
				endDate: new Date().getTime(),
				status: '0' + i%8,
				advertiserName: "广告主" + i,
				projectName: "项目" + i,
				advertisingAmount: i*2,
				packageAmount: i + 3,
				totalImpression: i*10,
				totalClick: i*15,
				totalBudget: i*9,
				impression: i*1000,
				click: i*100,
				ctr: i*14,
				cost: i*7,
				ecpm: i*34,
				ecpc: i* 6
			})
		}
		this.page.total = 25;
	}

	private selectedDate(e) {
		this.startDate = e.startDate._d.getTime();
		this.endDate = e.endDate._d.getTime() - e.endDate._d.getTime()%1000;
		this.refreshTable();
	}
	
	onPage(event){
		if(event === 1){
            this.page.pageNo = 0;
            this.page.currentShow = 1;       
		} 
		this.refreshTable();
	}

	 //project添加iswrite属性
	 addIswrite(campaign){
		campaign.isWrite = false;
	}

	
	
	//开关切换
	private switch(e,id){
		let value = e.target.checked;		
		if(value){
			this.changeStatus(id,"01");
		}else{
			this.changeStatus(id,"02");
     	}			
	}

	private changeStatus(id, enable){
		this.campaignService.status(id, {"status":enable}).subscribe(
			result => {
				if (result.head.httpCode == 204) {
					this.refreshTable();
				}else{
					this.refreshTable();
					this.myModalService.alert(result.body.message)
				}

			},
			error => this.errorMessage = <any>error);
	}

	//去新建项目页面
	private gotoprojectForm(){
		this.router.navigate(["/home/project/projectForm"]);
	}
	private gotoprojectDetail(id){
		this.router.navigate(["/home/project/projectDetail",id]);
	}
	private gotopolicyList(id){
		this.router.navigate(["/home/campaign/policy/policyList",id]);
	}
	private gotopackageList(id){
		this.router.navigate(["/home/campaign/package/packageList",id]);
	}
	private gotocampaignForm(id){
		this.router.navigate(["/home/campaign/campaignForm",id]);
	}
	private gocampaignForm(){
		this.router.navigate(["/home/campaign/campaignForm"]);
	}
	private gotocampaignDetail(id){
		this.router.navigate(["/home/campaign/campaignDetail",id]);
	}
	private gotocopyAudited(){
		this.router.navigate(["/home/campaign/copyAudited"]);
	}
}