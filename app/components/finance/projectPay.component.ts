import { Component,OnInit,ViewChild,ElementRef,ViewChildren } from "@angular/core";
import { Http,Response,RequestOptions,Headers,HttpModule} from '@angular/http';
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { MyModalService } from "../../services/myModal.service";
import { mediaManagementRootService } from "../../services/mediaManagement.root.service";

import "./projectPay.component.less";
declare var $;
declare var require;
let path = require("./projectPay.html");

@Component({
	selector: "ng-projectPay",
	template: path
})

export class projectPayComponent implements OnInit {

	datas;
	datas2;
	id;
	headtitletext = {
		advertiserName:"",
		projectName:"",
		campaignName:""
	}
	private startDate: number=new Date().getTime();
	private endDate: number=new Date().getTime();

	public mainMenus = [
		{
			name: "财务报表",
			value: undefined
		},
		{
			name: "项目估算",
			value: undefined
		},
		{
			name: "项目支出表",
			value: undefined
		},
	];

	private page = {
		pageNo: 0,
		pageSize: 10,
		total:0
	};

	@ViewChild("mydatatable") mydatatable;
	@ViewChild("mydatatable2") mydatatable2;
	@ViewChild("regionModal") regionModal;
	@ViewChild("regionModalpay") regionModalpay;

	constructor(
		private route:ActivatedRoute,
		private router: Router,
		private publicService: PublicService,
		private chineseService: ChineseService,
		private myModalService:MyModalService,
	) {
		this.id = this.route.snapshot.params["id"];
	}

	ngOnInit() {
		this.dataInit()
	}

	dataInit(){
		this.datas = [
			{name:"123"}
		]
		this.page.total = this.datas.length;

		this.datas2 = [
			{name:"123"}
		]
	}

	// 日历初始化
	calenderInit(){
		this.publicService.timeRangePickerSet("timeRangePicker",{
			locale: this.chineseService.config.TIMERANGEPICKER_CONFIG,
			autoUpdateInput: false
		},(start,end) => {
			this.startDate = start._d.getTime() - start._d.getTime()%1000;
			this.endDate = end._d.getTime() - end._d.getTime()%1000;
		});
	}

	editpay(){
		this.regionModalpay.open();
		this.calenderInit();
	}


	edit(){
		this.regionModal.open();
	}
	regionCancel(){
		this.regionModal.close();
		this.regionModalpay.close();
	}

	regionModalSubmit(){
		this.regionModal.close();
		this.regionModalpay.close();
	}

}