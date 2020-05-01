import { Component,OnInit,ViewChild } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { PolicyService } from "../../services/policy.service";
import { CreativeService } from "../../services/creative.service";
import { Creative,Materials } from "../../models/creative.model";
import { MyModalService } from "../../services/myModal.service";
import { CampaignService } from "../../services/campaign.service";
import { Page } from "../../models/page.model";
import { Campaign } from "../../models/campaign.model";
import { PackageService } from "../../services/package.service";
import { Package,ImageCreatives, InfoflowCreatives,VideoCreatives } from "../../models/package.model";
// import  "../campaign/campaignDetail.less";

declare var $;
declare var require;
let path = require("./policyCreate.html");
let path1= require("../campaign/campaignDetail.less")

@Component({
	selector: "ng-policyCreate",
	template: path,
	styles:['path1']
})

export class PolicyCreateComponent implements OnInit {
	public mainMenus = [
        {
            name: "投放管理",
            value: undefined
        },
        {
            name: "投放策略管理",
            value: "/home/campaign/policy/policyList/"+this.route.snapshot.params["campaignId"]
		},
		{
            name: "创意",
            value: undefined
		}
	];
	 private creativeType:string="undefined";
	 private creativeType11:string;
	 
	 private creativeType1:string="undefined";
	
	@ViewChild("packageDatatable") packageDatatable;
	@ViewChild("createDatatable") createDatatable;
	private materials:Materials[]=[];
	// private materials:Materials=new Materials();
	private width;
	private height;
	private imageId=[];
	private infoflowId=[];
	private videoId=[];
	private infoflowCreatives:InfoflowCreatives[]=[];
	private imageCreatives:ImageCreatives[]=[];
	private imageCreativess=[];
	private videoCreatives:VideoCreatives[]=[];
	private packages:Package[]=[];
	private packages1:Package[]=[];
	private packagess:Package=new Package();
	private package:Package=new Package();
	private campaign:Campaign= new Campaign();
	private creative:Creative=new Creative();
	private creative1:Creative=new Creative();
	private creatives:Creative[]=[];
	private creates:Creative[]=[];
	private datas = [];
	private policyId:number;
	private packageId:number=0;
	private packageIds = [];
	private campaignId:number;
	private id:number;
	private creativeIds = [];
	private errorMessage;
	private options;
	private packageSelected = [];
	private createSelected = [];
	private startDate: number = new Date().getTime();
	private packageAllcheck: boolean = false;
	private createAllcheck: boolean = false;
	private type:string;
	private name:string;    
	private packageId1:number=0;
	private name1:string;
	private path;
	private bid:number;
	
	private endDate: number = new Date().getTime();

	private page= {
		pageNo: 0,
		pageSize: 50,
		total:0,
		currentShow: 1
	};
	private page1 = {
		pageNo: 0,
		pageSize: 10,
		total:0
	};
	private page2= {
		pageNo: 0,
		pageSize: 10,
		total:0
	};

	constructor(
		private publicService: PublicService,
		private chineseService: ChineseService,
		private creativeService:CreativeService,
		private myModalService:MyModalService,
		private router:Router,
		private route:ActivatedRoute,
		private policyService:PolicyService,
		private campaignService:CampaignService,
		private packageService:PackageService,
	) {}

	ngOnInit() {
		this.dateInit();
		this.refreshCreativeTable();
		$("#create").hide();
		//获取物料包的名称
		let optionss={
			campaignId:this.campaignId
		}
		this.packageService.list(optionss).subscribe(
			result =>{
				this.packages1=result.body.items
			}
		)
		
	}
	//创意弹出框
	private show(){
		$(".creative").removeClass("hide");
		$(".active2").removeClass("active");
		$(".active1").addClass("active");
		$("#active22").removeClass("active");
		$("#active11").addClass("active");
		this.refreshPackageTable();		
		// this. refreshCreateTable();
		
	}
	private show1(){
		$("#active22").removeClass("active");
		$(".active2").removeClass("active");
		$(".active1").addClass("active");
		this.refreshPackageTable();
	}
	private show2(){
		$("#active11").removeClass("active");
		$(".active1").removeClass("active");
		$(".active2").addClass("active");
		this.packageId1=0;
		this.creativeType1="undefined"
		this. refreshCreateTable();
		
	}
	private hide(){
		$(".creative").addClass("hide");
	}
	//小弹窗
	private createHide(id){	
		$("#create").hide();
	}
	private createShow(path,name1,id){
		// console.log(this.name1)
		this.path=path;
		this.name1=name1;
		$("#create").show();
	}
	
	private dateInit(){
		this.policyId= this.route.snapshot.params["id"]-0;
		// console.log(this.policyId)
		this.campaignId= this.route.snapshot.params["campaignId"];
		this.publicService.timeRangePickerSet("timeRangePicker",{
			locale: this.chineseService.config.TIMERANGEPICKER_CONFIG
		},(start,end) => {
			this.startDate = start._d.getTime() - start._d.getTime()%1000;
			this.endDate = end._d.getTime() - end._d.getTime()%1000;
		})
		this.campaignService.getId(this.campaignId).subscribe(
			result => {
				this.campaign=result.body;
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)
		
		
	}



    //弹窗物料包导入
	private input0(){
		this.packageIds=[];
		if(this.packageSelected.length === 0){
			return this.myModalService.alert("请选择需要导入的物料包");
		}
		// console.log(this.packageSelected)	
		for(let i =0;i < this.packageSelected.length;i++){
					this.packageIds.push(this.packageSelected[i].id);		
		}			
					let options={	
						packageIds:this.packageIds,
						id:this.policyId-0
					}
					this.creativeService.putPackage(this.policyId-0,options).subscribe(
						result=>{
							this.refreshCreativeTable();
							this.refreshPackageTable();
							// this.datas=result.body.items;
							this.packageSelected=[];
							this.packageAllcheck=false;
							this.myModalService.alert('导入成功');
						},
						error => {
								this.myModalService.alert('请选择审核通过的物料包');
							
						}
					)
		
	}
	//弹窗创意导入
	private input1(){
		// this.creativeIds=[];
		if(this.createSelected.length === 0){
			return this.myModalService.alert("请选择需要导入的创意");
		}
		for(let i  =0;i < this.createSelected.length;i++){
					this.creativeIds.push(this.createSelected[i].id);	
		}
		let options={
			id:this.policyId-0,
			creativeIds:this.creativeIds
		}
		this.creativeService.putCreative(this.policyId-0,options).subscribe(
			result=>{
				this.refreshCreativeTable();
				this.refreshCreateTable();
				this.createSelected=[];
				this.createAllcheck=false;
				this.myModalService.alert('导入成功');
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)
	}

	private onSelect(event,value){		
		if(!event.selected){
			return;
		}
		if(!value){		
			this.packageAllcheck = event.selected.length === this.packages.length ? true : false;
		}else{
			this.createAllcheck = event.selected.length === this.creates.length ? true : false;
		}		
	}
	private allCheckFire(value){
		if(!value){
			this.allToggle(this.packageDatatable,this.packageAllcheck,this.packages);
		}else{
			this.allToggle(this.createDatatable,this.createAllcheck,this.creates);
		}
	}
	//全选切换
	private allToggle(table,allcheck,data){
		table.selected.splice(0,table.selected.length)
		if(allcheck){
			for(let i = 0;i < data.length;i++){
				table.selected.push(data[i]);
			}
		}
	}

	// 刷新创意表格数据
	private refreshCreativeTable(obj?) {
		if(this.creativeType=="undefined"){
			let options = {
				startDate:this.startDate,
				endDate:this.endDate,
				pageNo: this.page.pageNo + 1,
				pageSize: this.page.pageSize,
				campaignId:this.campaignId,
				policyId:this.policyId,
				packageId:this.packageId,
				// auditStatus:"02"
				// creativeType:this.creativeType          
			}
			if(obj){
				for(let i in obj){
					options[i] = obj[i];
				}
			}
			this.creativeService.list(options)
				.subscribe(
					result => {
						if (result.head.httpCode == 200) {
							let rows = [];
							for (let i = 0,len = result.body.items.length; i < len; i++) {
								rows[(options.pageNo - 1)*options.pageSize+i] = result.body.items[i];
								this.addIswrite(rows[(options.pageNo - 1)*options.pageSize+i]);
							}
							this.creatives = rows;
							if(result.body.pager){
								this.page.pageNo = result.body.pager.pageNo;
								this.page.pageSize = result.body.pager.pageSize;
								this.page.total = result.body.pager.total;
								this.page.pageNo--;
								if(!this.creatives[this.page.pageSize*this.page.pageNo] && this.page.pageNo > 0){
									this.page.pageNo--;
								}
							}
						}else if(result.head.httpCode == 404){
							this.creatives = [];
						}
					},
					error => this.errorMessage = <any>error);
		}else{
			let options = {
				startDate:this.startDate,
				endDate:this.endDate,
				pageNo: this.page.pageNo + 1,
				pageSize: this.page.pageSize,
				campaignId:this.campaignId,
				policyId:this.policyId,
				// packageId:this.packageId,
				// auditStatus:"02",
				creativeType:this.creativeType          
			}
			if(obj){
				for(let i in obj){
					options[i] = obj[i];
				}
			}
			this.creativeService.list(options)
				.subscribe(
					result => {
						if (result.head.httpCode == 200) {
							let rows = [];
							for (let i = 0,len = result.body.items.length; i < len; i++) {
								rows[(options.pageNo - 1)*options.pageSize+i] = result.body.items[i];
								this.addIswrite(rows[(options.pageNo - 1)*options.pageSize+i]);
							}
							this.creatives = rows;
							if(result.body.pager){
								this.page.pageNo = result.body.pager.pageNo;
								this.page.pageSize = result.body.pager.pageSize;
								this.page.total = result.body.pager.total;
								this.page.pageNo--;
								if(!this.creatives[this.page.pageSize*this.page.pageNo] && this.page.pageNo > 0){
									this.page.pageNo--;
								}
							}
						}else if(result.head.httpCode == 404){
							this.creatives = [];
						}
					},
					error => this.errorMessage = <any>error);
		}
	}
	//project添加iswrite属性
	addIswrite(creative){
		creative.isWrite = false;
	}

	//监听分页
	onPage(event){
		if(event === 1){
            this.page.pageNo = 0;
            this.page.currentShow = 1;       
		} 
		this.refreshCreativeTable();
	}

	//策略下创意开关修改
	switchChange(row) {
		let enable=row.policyEnable?row.policyEnable:"0";
		let id = row.mapId;
		if(enable == "1"){	//如果状态为启动（1），再次点击需要暂停。
			this.policyService.policyCreativeEnable(id,{enable:"0"}).subscribe(
				result => {
					this.refreshCreativeTable()
				},
				error => {
					this.myModalService.alert(error.message);
				}
			)

		} else {
			this.policyService.policyCreativeEnable(id,{enable:"1"}).subscribe(
				result => {
					this.refreshCreativeTable()
				},
				error => {
					this.myModalService.alert(error.message);
				}
			)
		}
	}

//出价
	private toggle(row,isShow,isValue){
		var reg =  /^([1-9]*[1-9][0-9]*(.[0-9]{0,2})?|0.[0-9]?[1-9]|0.[1-9][0-9]?)$/;
		if(isValue){
			let obj = this.publicService.clone(row);
			obj.bid = $("#bid" + row.$$index).val();
			if(obj.bid &&　parseFloat(obj.bid) >9999.99){
				this.myModalService.alert("最大值为9999.99");
				return false;
			}
			let options={
				id:row.mapId,
				bid:obj.bid*100
			}
			if( !reg.test(obj.bid)){
				this.myModalService.alert("必须为正数且最多保留两位小数");
				return false;
			}else{
				this.creativeService.putbid(row.mapId,options).subscribe(
					result => {
						row.bid = $("#bid" + row.$$index).val() *100;
						row.show = isShow;
					},
					error => {
						this.myModalService.alert(error.message);
					}
				)
			}
			
		}else{
			row.show = isShow;
		}
		
	}
	//路由跳转
	private gotoPolicyList(){
		this.router.navigate(["/home/campaign/policy/policyList",this.campaignId])
	}

	//按物料包导入
	private refreshPackageTable(obj?) {
		let options = {
			campaignId:this.campaignId,
			pageNo: this.page2.pageNo + 1,
			pageSize: this.page2.pageSize,
			// creativeType:this.creativeType1
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
								this.addIswritepackage(rows[(options.pageNo - 1)*options.pageSize+i]);
							}
							this.packages = rows;
							this.page2.total = this.packages.length;
						}else if(result.head.httpCode == 404){
							this.packages = [];
						}
					},
					error => this.errorMessage = <any>error);	
	}
	//project添加iswrite属性
	addIswritepackage(packagess){
		packagess.isWrite = false;
	}

	//按创意导入
	private refreshCreateTable(obj?) {
		//创意表格
		if(this.packageId1==0 && this.creativeType1=="undefined"){
			let options = {
				campaignId:this.campaignId,
				pageNo: this.page1.pageNo + 1,
				pageSize: this.page1.pageSize,
				auditStatus:"02",
			}
			if(obj){
				for(let i in obj){
					options[i] = obj[i];
				}
			}
			this.creativeService.list(options)
				.subscribe(
					result => {
						if (result.head.httpCode == 200) {
							let rows = [];
							for (let i = 0,len = result.body.items.length; i < len; i++) {
								rows[(options.pageNo - 1)*options.pageSize+i] = result.body.items[i];
								this.addIswritectreate(rows[(options.pageNo - 1)*options.pageSize+i]);								
							}
							this.creates=rows;
							this.page1.total = this.creates.length;
							let optionss={
								campaignId:this.campaignId
							}
							this.packageService.list(optionss).subscribe(
								result =>{
									this.packages1=result.body.items;
									for(let i=0;i<this.packages1.length;i++){
										for(var j=0;j<this.creates.length;j++){
											if(this.creates[j].packageId==this.packages1[i].id){
												this.name=this.packages1[i].name;
											}
										}
									}
								}
							)
							
						}else if(result.head.httpCode == 404){
							this.creates = [];
						}
					},
					error => this.errorMessage = <any>error);
		}else if(this.packageId1 == 0 && this.creativeType1 != "undefined"){
			let options = {
				campaignId:this.campaignId,
				pageNo: this.page1.pageNo + 1,
				pageSize: this.page1.pageSize,
				auditStatus:"02",
				creativeType:this.creativeType1
			}
			if(obj){
				for(let i in obj){
					options[i] = obj[i];
				}
			}
			this.creativeService.list(options)
				.subscribe(
					result => {
						if (result.head.httpCode == 200) {
							let rows = [];
							for (let i = 0,len = result.body.items.length; i < len; i++) {
								// if( result.body.items[i].auditStatus=="2"){
								// 	this.datas.push(result.body.items[i])
								// }
								// result.body.items=this.datas
								rows[(options.pageNo - 1)*options.pageSize+i] = result.body.items[i];
								this.addIswritectreate(rows[(options.pageNo - 1)*options.pageSize+i]);								
							}
							this.creates=rows;
							let optionss={
								campaignId:this.campaignId
							}
							this.packageService.list(optionss).subscribe(
								result =>{
									this.packages1=result.body.items;
									for(let i=0;i<this.packages1.length;i++){
										for(var j=0;j<this.creates.length;j++){
											if(this.creates[j].packageId==this.packages1[i].id){
												this.name=this.packages1[i].name;
											}
										}
									}
								}
							)
							this.page1.total = this.creates.length;
						}else if(result.head.httpCode == 404){
							this.creates = [];
						}
					},
					error => this.errorMessage = <any>error);
		}else if(this.packageId1 != 0 && this.creativeType1 == "undefined"){
			let options = {
				campaignId:this.campaignId,
				pageNo: this.page1.pageNo + 1,
				pageSize: this.page1.pageSize,
				packageId:this.packageId1,
				auditStatus:"02",
			}
			if(obj){
				for(let i in obj){
					options[i] = obj[i];
				}
			}
			this.creativeService.list(options)
				.subscribe(
					result => {
						if (result.head.httpCode == 200) {
							let rows = [];
							for (let i = 0,len = result.body.items.length; i < len; i++) {
								rows[(options.pageNo - 1)*options.pageSize+i] = result.body.items[i];
								this.addIswritectreate(rows[(options.pageNo - 1)*options.pageSize+i]);								
							}
							this.creates=rows; 
							// for(let i=0;i<this.packages1.length;i++){
							// 	for(var j=0;j<this.creates.length;j++){
							// 		if(this.creates[j].packageId==this.packages1[i].id){
							// 			this.name=this.packages1[i].name;
							// 		}
							// 	}
							// }
							let optionss={
								campaignId:this.campaignId
							}
							this.packageService.list(optionss).subscribe(
								result =>{
									this.packages1=result.body.items;
									for(let i=0;i<this.packages1.length;i++){
										for(var j=0;j<this.creates.length;j++){
											if(this.creates[j].packageId==this.packages1[i].id){
												this.name=this.packages1[i].name;
											}
										}
									}
								}
							)
							this.page1.total = this.creates.length;
						}else if(result.head.httpCode == 404){
							this.creates = [];
						}
					},
					error => this.errorMessage = <any>error);	
				}else if(this.packageId1 != 0 && this.creativeType1  != "undefined"){
					let options = {
						campaignId:this.campaignId,
						pageNo: this.page1.pageNo + 1,
						pageSize: this.page1.pageSize,
						packageId:this.packageId1,
						auditStatus:"02",
						creativeType:this.creativeType1
					}
				 console.log(this.packageId1)
					if(obj){
						for(let i in obj){
							options[i] = obj[i];
						}
					}
					this.creativeService.list(options)
						.subscribe(
							result => {
								if (result.head.httpCode == 200) {
									let rows = [];
									for (let i = 0,len = result.body.items.length; i < len; i++) {
										// if( result.body.items[i].auditStatus=="2"){
										// 	this.datas.push(result.body.items[i])
										// }
										// result.body.items=this.datas
										rows[(options.pageNo - 1)*options.pageSize+i] = result.body.items[i];
										this.addIswritectreate(rows[(options.pageNo - 1)*options.pageSize+i]);								
									}
									this.creates=rows;
									let optionss={
										campaignId:this.campaignId
									}
									this.packageService.list(optionss).subscribe(
										result =>{
											this.packages1=result.body.items;
											for(let i=0;i<this.packages1.length;i++){
												for(var j=0;j<this.creates.length;j++){
													if(this.creates[j].packageId==this.packages1[i].id){
														this.name=this.packages1[i].name;
													}
												}
											}
										}
									)
									this.page1.total = this.creates.length;
								}else if(result.head.httpCode == 404){
									this.creates = [];
								}
							},
							error => this.errorMessage = <any>error);	
						}
					
			
	}
	private isWrite;
	//project添加iswrite属性
	addIswritectreate(creative1){
		creative1.isWrite = false;
	}
}