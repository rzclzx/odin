import { Component, OnInit, ViewChild, TemplateRef,ElementRef } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { ValidationService } from "../../services/validation.service"
import { MyModalService } from "../../services/myModal.service";
import { PolicyService } from "../../services/policy.service";
import { ProjectService } from "../../services/project.service";
import { CampaignService } from "../../services/campaign.service";
import { Campaign,Kpi,Targeting,App,AppType } from "../../models/campaign.model";
import { DetailService } from "../../services/detail.service";
import { RootService } from "../../services/root.service";
import { Project } from "../../models/project.model";
import { Policy } from "../../models/policy.model";
import { Page } from "../../models/page.model";



// import "../campaign/campaignDetail.less";

declare var $;
declare var require;
let path = require("./policyList.html");
let path1 = require("../campaign/campaignDetail.less")

@Component({
	selector: "ng-policyList",
	template: path,
	styles:['path1']
})

export class PolicyListComponent implements OnInit {
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
            name: "投放策略",
            value: undefined
		}
    ];

	private enable:string;
	private advertiserName:string;
	private campaign:Campaign= new Campaign();
    private errorMessage;
	private id:number;
	private policyId;
	private name:string;
	private status:string;
	private campaignId:number;
    private policys:Policy[] = [];
	private policy:Policy[] = [];
	private advertisers = [];
	private advertiser;
	private projects=[];
	private options = [];
	private kpi=[];
	private page= {
		pageNo: 0,
		pageSize: 50,
		total:0,
		currentShow: 1
	};
	private zhi:string="";
	private bid:number;

	private startDate: number = new Date().getTime();
	private Date: number;
	private endDate: number = new Date().getTime();
	private startDate1: number;
	private endDate1: number;

	constructor(
		private publicService: PublicService,
		private chineseService: ChineseService,
		private myModalService:MyModalService,
        private router: Router,
        private policyService:PolicyService,
		private projectService:ProjectService,
		private route:ActivatedRoute,
		private campaignService:CampaignService,
		private validationService:ValidationService
	) {}

	ngOnInit() {
		this.status="00";
		// this.id = this.route.snapshot.params["id"]; 
		let date = this.publicService.getTodayStartandEnd();
        this.startDate = date.startDate;
        this.endDate = date.endDate;
		this.campaignId = this.route.snapshot.params["campaignId"];
		this.refreshTable();
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
			locale: this.chineseService.config.TIMERANGEPICKER_CONFIG
		},(start,end) => {
			this.startDate = start._d.getTime() - start._d.getTime()%1000;
			this.endDate = end._d.getTime() - end._d.getTime()%1000;
		})
		this.campaignService.getId(this.campaignId).subscribe(
			result => {
				this.campaign = result.body;
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)
		//点击自动生成策略
		this.policyService.list(this.campaignId).subscribe(
			result => {
				this.policy = result.body.items;
				$(".empty-row").hide()
				for(var i=0;i<this.policy.length;i++){
					if(this.campaignId==this.policy[i].campaignId){
						if(!this.policy[i].id){
							$("#noDatepolicy").show()
						}else if(this.policy[i].id){
							$("#noDatepolicy").hide()
						}	
					}
					this.id=this.policy[i].id;		
				}
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)
		$("#autoPolicy").hide();
		
	}
	private autoPolicyShow(){
		$("#autoPolicy").show();
	}
	private autoPolicyHide(){
		$("#autoPolicy").hide();
	}
	//出价
	private toggle(row,isShow,isValue){
		var reg = /^[1,9]{1}[0,9]{0,9}$/;
		if(isValue){
			let obj = this.publicService.clone(row);
			obj.bid = $("#bid" + row.$$index).val();
			if(obj.bid &&　parseFloat(obj.bid) >9999.99){
				this.myModalService.alert("最大值为9999.99"); 
				return false;
			}
			if( !reg.test(obj.bid)){
				this.myModalService.alert("必须为正数且最多保留两位小数");
				return false;
			}
			// if(!reg.test(obj.bid)){
			// 	this.myModalService.alert("必须为正数且最大值为9999.99");
			// }
			let option={
				id:row.id,
				bid:obj.bid*100
			}
			this.policyService.policybid(row.id,option).subscribe(
				result => {
					row.bid = $("#bid" + row.$$index).val();
					row.show = isShow;
				},
				error => {
					this.myModalService.alert(error.message);
				}
			)
		}else{
			row.show = isShow;
		}
		
	}
    // 刷新表格数据
	private refreshTable(obj?) {
		if(this.status=="00"){
			let options = {
				startDate: this.startDate,
				adStartDate:this.startDate1,
				adEndDate:this.endDate1,
				endDate: this.endDate,
				pageNo: this.page.pageNo + 1,
				pageSize: this.page.pageSize,
				advertiserName:this.advertiserName,
				id:this.policyId,
				name:this.name,
				campaignId:this.campaignId
			}
			if(obj){
				for(let i in obj){
					options[i] = obj[i];
				}
			}
			this.policyService.list(options)
				.subscribe(
					result => {
						if (result.head.httpCode == 200) {
							let rows = [];
							for (let i = 0,len = result.body.items.length; i < len; i++) {
								rows[(options.pageNo - 1)*options.pageSize+i] = result.body.items[i];
								this.addIswrite(rows[(options.pageNo - 1)*options.pageSize+i]);
							}
							this.policys = rows;
							if(result.body.pager){
								this.page.pageNo = result.body.pager.pageNo;
								this.page.pageSize = result.body.pager.pageSize;
								this.page.total = result.body.pager.total;
								this.page.pageNo--;
								if(!this.policys[this.page.pageSize*this.page.pageNo] && this.page.pageNo > 0){
									this.page.pageNo--;
								}
							}
						}else if(result.head.httpCode == 404){
							this.policys = [];
						}
					},
					error => this.errorMessage = <any>error);
		}else{
			let options = {
				startDate: this.startDate,
				AdvertiseDate:this.Date,
				endDate: this.endDate,
				pageNo: this.page.pageNo + 1,
				pageSize: this.page.pageSize,
				// advertiserName:this.advertiserName,
				id:this.policyId,
				name:this.name,
				status:this.status,
				campaignId:this.campaignId
			}
			if(obj){
				for(let i in obj){
					options[i] = obj[i];
				}
			}
			this.policyService.list(options)
				.subscribe(
					result => {
						if (result.head.httpCode == 200) {
							let rows = [];
							for (let i = 0,len = result.body.items.length; i < len; i++) {
								rows[(options.pageNo - 1)*options.pageSize+i] = result.body.items[i];
								this.addIswrite(rows[(options.pageNo - 1)*options.pageSize+i]);
							}
							this.policys = rows;
							if(result.body.pager){
								this.page.pageNo = result.body.pager.pageNo;
								this.page.pageSize = result.body.pager.pageSize;
								this.page.total = result.body.pager.total;
								this.page.pageNo--;
								if(!this.policys[this.page.pageSize*this.page.pageNo] && this.page.pageNo > 0){
									this.page.pageNo--;
								}
							}
						}else if(result.head.httpCode == 404){
							this.policys = [];
						}
					},
					error => this.errorMessage = <any>error);
		}		
    }
    //project添加iswrite属性
	addIswrite(policy){
		policy.isWrite = false;
    }
    

    private update(e): void{
		this.page.pageSize = e;
		this.refreshTable({pageNo: 1});
	}

	//监听分页
	onPage(event){
		if(event === 1){
            this.page.pageNo = 0;
            this.page.currentShow = 1;       
		} 
		this.refreshTable();
	}
	
	// 广告主选择
	private selectedAdvertiser(){
        if(!this.advertiser){
            this.projects = [];
        }else{
            this.projectService.list(this.advertiser.id).subscribe(
                result => {
                    this.projects = result.body.items;
                },
                error => {
                    this.myModalService.alert(error.message);
                }
            )
        }
	}
	
	//策略下开关修改
	switchChange(row) {
		let enable=row.enable?row.enable:"0";
		let id = row.id;
		// let obj1={
		// 	enable:row.policyEnable?row.policyEnable:"0"
		// };
		if(enable == "1"){	//如果状态为启动（1），再次点击需要暂停。
			this.policyService.policyEnable(id,{enable:"0"}).subscribe(
				result => {
					this.refreshTable()
				},
				error => {
					this.myModalService.alert(error.message);
				}
			)

		} else {
			this.policyService.policyEnable(id,{enable:"1"}).subscribe(
				result => {
					this.refreshTable()
				},
				error => {
					this.myModalService.alert(error.message);
				}
			)
		}
	}
	
	//输入单价保存自动生成策略
	save(obj){
		let options={
			bid: this.bid*100,
			campaignId:this.campaignId-0
		}
		if(obj){
			for(let i in obj){
				options[i] = obj[i];
			}
		}
			this.policyService.policyAuto(options).subscribe(
				result => {
						this.id=result.body.id;
						this.autoPolicyHide();
						$("#noDatepolicy").hide()
						this.refreshTable();
				},
				error => {
					this.myModalService.alert(error.message)
				}
			)
	}

	
    //路由跳转
    private gotopolicyList (){
		this.router.navigate(["/home/campaign/policy/policyList"]);
	}
	private gotopackageList (){
		this.router.navigate(["/home/campaign/package/packageList"]);
	  }
	private gotopolicyDetail(campaignId,id){
		this.router.navigate(["/home/campaign/policy/policyDetail",this.campaignId,id]);
	}
	private gotopolicyCreate(campaignId,id){
		this.router.navigate(["/home/campaign/policy/policyCreate",this.campaignId,id]);
    }
    private gotocampaignDetail(id){
		this.router.navigate(["/home/campaign/campaignDetail",id]);
	}
	private gotopolicyEdit(campaignId,id){
		this.router.navigate(["/home/campaign/policy/policyForm",this.campaignId,id])
	}
	private gotopolicyForm(campaignId){
		this.router.navigate(["/home/campaign/policy/policyForm",this.campaignId])
	}
	private gotopolicyCopy(campaignId,id){
		this.router.navigate(["/home/campaign/policy/copypolicy",campaignId,id]);
	}
	private goback(){
		this.router.navigate(["/home/campaign/campaignAudited"]);
	}
}