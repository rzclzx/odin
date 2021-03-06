import { Component,OnInit,ViewChild } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { Page } from "../../models/page.model";
import * as echarts from "echarts";
import "./landingPageTracking.less";
declare var $;
declare var require;
let path = require("./duringAnalysis.html");

@Component({
	selector: "ng-duringAnalysis",
	template: path
})

export class DuringAnalysisComponent implements OnInit {
    @ViewChild("duringAnalysisEcharts") duringAnalysisEcharts;
    
	@ViewChild("duringAnalysisTable") duringAnalysisTable;
	
    private duringAnalysisData : Array<object> = [];
    
    private duringAnalysisObject;
    
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
        this.duringAnalysisObject = echarts.init(this.duringAnalysisEcharts.nativeElement);
        
		
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