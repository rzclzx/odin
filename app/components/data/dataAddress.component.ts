import { Component,OnInit,ViewChild } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { MyModalService } from "../../services/myModal.service";
import { DataService } from "../../services/data.service";
import { AdvertiserService } from "../../services/advertiser.service";
import { ProjectService } from "../../services/project.service";
import { CampaignService } from "../../services/campaign.service";
import { PolicyService } from "../../services/policy.service";
import { CreativeService } from "../../services/creative.service";

import { Page } from "../../models/page.model";
import * as echarts from "echarts";
import "../../../node_modules/echarts/map/js/china.js";
declare var $;
declare var require;

@Component({
	selector: "data-address",
	template: require("./dataAddress.html"),
	styles: [require("./dataAddressMy.less")]
})

export class DataAddressComponent implements OnInit {

	@ViewChild("myChart") myChart;

	private startDate: any;

	private endDate: any;

	private datas = [];

	private dataCharts = [];

	private page = {
		pageNo: 0,
		pageSize: 10,
		total: 0,
		currentShow: 1
	}

	onPage(event){
		if(event === 1){
            this.page.pageNo = 0;
            this.page.currentShow = 1;       
		} 
		this.refreshTable();
	}

	private fieldArr = ["advertiser","project","campaign","policy","creative"];

	private advertisers = [];

	private advertiserId: string;

	private projects = [];

	private projectId: string;

	private campaigns = [];

	private campaignId: string;

	private policys = [];

	private policyId: string;

	private creatives = [];

	private creativeId: string;

	private type: number = 1;

	private current: boolean = true;

	private myChartObj;

	private mapData = [];

	constructor(
		private router: Router,
		private publicService: PublicService,
		private chineseService: ChineseService,
		private myModalService: MyModalService,
		private route:ActivatedRoute,
		private dataService: DataService,
		private advertiserService: AdvertiserService,
		private projectService: ProjectService,
		private campaignService: CampaignService,
		private policyService: PolicyService,
		private creativeService: CreativeService
	) {}

	ngOnInit() {
		this.dataInit()
	}

	private dataInit(){
		this.myChartObj = echarts.init(this.myChart.nativeElement);
		// 时间插件初始化
		let date = this.publicService.getTodayStartandEnd();
		this.startDate = date.startDate;
		this.endDate = date.endDate;
		this.publicService.timeRangePickerSet("timeRangePicker",{
			locale: this.chineseService.config.TIMERANGEPICKER_CONFIG,
            autoUpdateInput: false
		},(start,end) => {
            this.startDate = start._d.getTime() - start._d.getTime()%1000;
			this.endDate = end._d.getTime() - end._d.getTime()%1000;
		});
		// 客户数据获取
		this.advertiserService.list().subscribe(
			result => {
				this.advertisers = result.body.items;
			},
			error => {
			//	this.myModalService.alert(error.message);
			}
		)
	}
	// 查询
	private search(){
		this.page.pageNo = 0;
		this.page.currentShow = 1;
		this.refreshChart();
		this.refreshTable();
	}
	// 刷新表格
	private refreshTable(obj?:any) {
		this.datas = [];
		for(let i = 0;i < 10;i++){
			this.datas.push({
				click: i*100,
				cost: i*10,
				ctr: i*6,
				ecpc: i*7,
				ecpm: i*8,
				id: i,
				impression: i*400,
				latitude: i*5,
				longitude: i*4,
				name: "广州"
			})
		}
		this.page.total = 10;
	}
	// 查询图标
	private refreshChart() {
		this.dataCharts  = [];
		for(let i = 0;i < 10;i++){
			this.dataCharts.push({
				click: i*100,
				cost: i*10,
				ctr: i*6,
				ecpc: i*7,
				ecpm: i*8,
				id: i,
				impression: i*400,
				latitude: 30.2936 + i*1.2,
				longitude: 120.1614 - i*5,
				name: "广州"
			})
		}
		for(var i=0;i<this.dataCharts.length;i++){
			let mdata = { 
				name:this.dataCharts[i].province,
				value:[
					this.dataCharts[i].longitude,
													this.dataCharts[i].latitude,
													this.dataCharts[i].impression
				],
				index:i,
			}
			this.mapData.push(mdata);
		}
		this.drawChart();
	}

	private drawChart(){
		if(this.dataCharts.length !== 0){
            this.myChartObj.setOption(this.getChartOptions(),true);
		}else{
			this.myChartObj.clear();
		}
	}

	private getChartOptions(){
		let that = this;
		let max;
		let impressionArr = [];
		for(let i = 0;i < this.dataCharts.length;i++){
			impressionArr.push(this.dataCharts[i].impression);
		}
		max = Math.max(...impressionArr);
		return {
	    	backgroundColor: '#fff',
	        visualMap: {
	            min: 0,
	            max: max,
	            left: 'left',
	            top: 'bottom',
	            color:['#498fd3','#7d59c8','#e84c3c','#ff9901'],
	            text: ['高','低'],           // 文本，默认为数值文本
	            calculable: true
	        },
	        tooltip : {
	        	formatter: function(param){
					return that.dataCharts[param.data.index].name
					+'</br>展现数:' + that.dataCharts[param.data.index].impression
					+'</br>点击数:' + that.dataCharts[param.data.index].click	
					+'</br>CTR:' + that.dataCharts[param.data.index].ctr	
					+'</br>成本:' + that.dataCharts[param.data.index].cost	
					+'</br>eCPM:' + that.dataCharts[param.data.index].ecpm	
					+'</br>eCPC:' + that.dataCharts[param.data.index].ecpc		
                }
	        },
	        geo: {
	            map: 'china',
	            label: {
	                emphasis: {
	                    show: false
	                }
	            },
	            roam: true,
	            itemStyle: {
	                normal: {
	                    areaColor: '#eee',
	                    borderColor: 'rgba(73,143,211,0.3)'
	                },
	                emphasis: {
	                    areaColor: '#feec21',
	                    borderColor: '#498fd3'
	                }
	            }
	        },
	        series : [{
	                type: 'effectScatter',
	                coordinateSystem: 'geo',
	                data: this.mapData,
	                symbolSize: 6, 
	                showEffectOn: 'render',
	                rippleEffect: {
	                    brushType: 'stroke'
	                },
	                itemStyle: {
	                    normal: {
	                        color: '#ddb926',
	                    }
	                }
	            }
	        ]
	    };
	}

	// 选择筛选条件
	private selected(value){
		if(value === 4){
			return;
		}
		if(!this[this.fieldArr[value] + "Id"]){
			for(let i = value + 1;i < this.fieldArr.length;i++){
				this[this.fieldArr[i] + "Id"] = undefined;
				this[this.fieldArr[i] + "s"] = [];
			}
        }else{
			let obj = new Object();
			obj[this.fieldArr[value] + "Id"] = this[this.fieldArr[value] + "Id"];
            this[this.fieldArr[value + 1] + "Service"].list(obj).subscribe(
                result => {
					this[this.fieldArr[value + 1] + "s"] = result.body.items;
					this[this.fieldArr[value + 1] + "Id"] = undefined;
					for(let i = value + 2;i < this.fieldArr.length;i++){
						this[this.fieldArr[i] + "Id"] = undefined;
				        this[this.fieldArr[i] + "s"] = [];
					}
                },
                error => {
                  //  this.myModalService.alert(error.message);
                }
            )
        }
	}
	// 城市省切换
	private toggle(){
		this.current = !this.current;
		this.type = this.current ? 1 : 2;
		this.page.pageNo = 0;
		this.page.currentShow = 1;
		this.refreshChart();
		this.refreshTable();
	}

	private dataData(){
		this.router.navigate(["/home/data/dataChart"]);
	}
	private dataAdvert(){
		this.router.navigate(["/home/data/dataAdvert"]);
    }
    private dataNetwork(){
		this.router.navigate(["/home/data/dataNetwork"]);
    }
	private dataFacility(){
		this.router.navigate(["/home/data/dataFacility"]);
	}
	private dataMedia(){
		this.router.navigate(["/home/data/dataMedia"]);
	}
	private dataPoints(){
		this.router.navigate(["/home/data/dataPoints"]);
	}
	
}
