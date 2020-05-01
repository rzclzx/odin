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
let path = require("./campaignAudit.html");
let path1 = require('../campaign/campaignDetail.less');
let path2 = require("../projectList/projectList.less")

@Component({
	selector: "ng-campaignAudit",
	template: path,
	styles:['path1','path2']
})

export class CampaignAuditComponent implements OnInit {
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
            name: "待审核",
            value: undefined
        },
    ];

	private errorMessage;
	private campaigns: Campaign[] = [];
	private campaign:Campaign = new Campaign();
	private advertiserName:string;
	private datas = [];
	private campaignss=[];
	private id;
	private ids:number;
	private name:string;
	private enable:string;
	private auditStatus:string;
	private auditStatusing:string;
	private page= {
		pageNo: 0,
		pageSize: 50,
		total:0,
		currentShow: 1
	};
	private zhi:string="" ;

	private Date: number;
	private startDate: number=new Date().getTime();
	private endDate: number= new Date().getTime();
	private startDate1: number;
	private endDate1: number;

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
	}
	private show(){
		$(".red").removeClass("hide");
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
		// this.publicService.timeRangePickerSet("singalTimeRangePicker",{
		// 	locale: this.chineseService.config.TIMERANGEPICKER_CONFIG,
		// 	autoUpdateInput: false,
		// 	"singleDatePicker": true,
		// },(start) => {
		// 	this.Date = start._d.getTime() - start._d.getTime()%1000;
		// });    
		this.publicService.timeRangePickerSet("timeRangePicker",{
			locale: this.chineseService.config.TIMERANGEPICKER_CONFIG,
			autoUpdateInput: false,
		},(start,end) => {
			this.startDate = start._d.getTime() - start._d.getTime()%1000;
			this.endDate = end._d.getTime() - end._d.getTime()%1000;
		});
		for(var i=0;i<this.campaigns.length;i++){
			this.id=this.campaigns[i].id;
			//审核状态
			if(this.campaigns[i].auditStatus=="01"){
				this.campaigns.push(this.campaigns[i]);
				this.auditStatusing="待审核";
			}
		}
	}

	
	// 刷新表格数据
	private refreshTable(obj?) {
		let options = {
			adStartDate:this.startDate1,
			adEndDate:this.endDate1,
			pageNo: this.page.pageNo + 1,
			pageSize: this.page.pageSize,
			advertiserName: this.advertiserName,
			name:this.name,
			// auditStatus:this.auditStatus,
			auditStatus:"01",
			id:this.ids
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

	private selectedDate(e) {
		// this.startDate = e.startDate._d.getTime();
		this.endDate = e.endDate._d.getTime() - e.endDate._d.getTime()%1000;
		this.refreshTable();
	}

	//监听分页
	private onPage(event){
		if(event === 1){
            this.page.pageNo = 0;
            this.page.currentShow = 1;       
        } 
		this.refreshTable();
	}

	 //campaign添加iswrite属性
	 addIswrite(campaign){
		campaign.isWrite = false;
	}
	//去新建项目页面
	private gotoprojectForm(){
		this.router.navigate(["/home/project/projectForm"]);
	}
	private gotocampaignForm(){
		this.router.navigate(["/home/campaign/campaignForm"]);
	}
	private gotoprojectDetail(id){
		this.router.navigate(["/home/project/projectDetail",id])
	}
	private gotoauditList(id){
		this.router.navigate(["/home/campaign/package/auditList",id]);
	}
	private gotopackageList(id){
		this.router.navigate(["/home/campaign/package/packageList",id]);
	}
	private gotoauditDetail(id){
		this.router.navigate(["/home/campaign/auditDetail",id]);
	}
	private gotodetailAudit(id){
		this.router.navigate(["home/campaign/audit/detailAudit",id]);
	}
}