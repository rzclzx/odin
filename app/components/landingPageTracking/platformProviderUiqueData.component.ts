import { Component,OnInit,ViewChild } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { Page } from "../../models/page.model";
import * as echarts from "echarts";
import "./landingPageTracking.less";
declare var $;
declare var require;
let path = require("./platformProviderUniqueData.html");
let path1 = require("./analysisOfRetentionData.less");

@Component({
	selector: "ng-platformUniqueData",
	template: path,
	styles:['path1']
})

export class PlatformProviderUniqueDataComponent implements OnInit {
    // @ViewChild("analysisOfRetentionDataEcharts") analysisOfRetentionDataEcharts;

	@ViewChild("analysisOfRetentionDataTable") analysisOfRetentionDataTable;

    private analysisOfRetentionDataData : Array<object> = [];

    private analysisOfRetentionDataObject;
    
	private startDate: number=new Date().getTime();
	private Date: number=new Date().getTime();
	private endDate: number=new Date().getTime();
	public mainMenus = [
        {
            name: "数据中心",
            value: undefined
        },
        {
            name: "落地页跟踪",
            value: undefined
        },
    ];
	private page:Page = {
        pageNo: 0,
        pageSize: 10,
        total:0
    };
	constructor(
		private publicService: PublicService,
		private chineseService: ChineseService,
		private router: Router,
		private route: ActivatedRoute,
	) {}

	ngOnInit() {
        // this.analysisOfRetentionDataObject = echarts.init(this.analysisOfRetentionDataEcharts.nativeElement);      
		
		this.publicService.timeRangePickerSet("timeRangePicker",{
			locale: this.chineseService.config.TIMERANGEPICKER_CONFIG,
			autoUpdateInput: false,
		},(start,end) => {
			this.startDate = start._d.getTime() - start._d.getTime()%1000;
			this.endDate = end._d.getTime() - end._d.getTime()%1000;
		});
		
//		this.amountEchartsObject.setOption(,true);
	}
	
	private goRouter( path){
		this.router.navigate(["/home/landingPageTracking/" + path]);		
	}
}