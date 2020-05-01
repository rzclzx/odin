import { Component,OnInit,ViewChild,ElementRef,ViewChildren } from "@angular/core";
import { Http,Response,RequestOptions,Headers,HttpModule} from '@angular/http';
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { MyModalService } from "../../services/myModal.service";
import { mediaManagementRootService } from "../../services/mediaManagement.root.service";

import "./projectEstimate.component.less";
declare var $;
declare var require;
let path = require("./projectEstimate.html");

@Component({
	selector: "ng-projectEstimate",
	template: path
})

export class projectEstimateComponent implements OnInit {

	datas;
	private startDate: number=new Date().getTime();
	private Date: number=new Date().getTime();
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
	];

	private page = {
		pageNo: 0,
		pageSize: 10,
		total:0
	};

	constructor(
		private router: Router,
		private publicService: PublicService,
		private chineseService: ChineseService,
	) {

	}

	ngOnInit() {
		this.dataInit()
	}

	// 日历初始化
	/*private calenderInit(){
		this.publicService.timeRangePickerSet("timeRangePicker",{
			locale: this.chineseService.config.TIMERANGEPICKER_CONFIG,
			autoUpdateInput: false,
		},(start,end) => {
			this.startDate = start._d.getTime() - start._d.getTime()%1000;
			this.endDate = end._d.getTime() - end._d.getTime()%1000;
		});
	}
*/
	dataInit(){
		this.datas = [
			{name:"ewrfwef"}
		]
		this.page.total = this.datas.length;
	}

	gotocampaigncost(row){
		this.router.navigate(["/home/finance/projectPay",row.id]);
	}
}