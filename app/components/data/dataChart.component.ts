import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import "./dataChart.less";
import { DataService } from "../../services/data.service"

declare var $;
declare var require;
let path = require("./dataChart.html");

@Component({
	selector: "data-chart",
	template: path
})

export class DataChartComponent implements OnInit {

	datas;

	// showloading:boolean = true;
	private advertisers = [];
	private projects = [];
	private campaigns = [];
	private policys = []

	private page = {
		pageNo: 0,
		pageSize: 10,
		total: 0
	};

	constructor(
		private router: Router,
		private publicService: PublicService,
		private chineseService: ChineseService,
		private dataService: DataService,


	) {
	}

	ngOnInit() {
		this.dataInit()
	}

	dataInit() {
		this.datas = [
			{ name: "00:00:00" },
			{ name: "01:00:00" },
			{ name: "02:00:00" },
			{ name: "03:00:00" }

		]
		this.page.total = this.datas.length;

		//客户名称
		this.dataService.brandList().subscribe(
			result => {
				if (result.head.httpCode == 200) {
					this.advertisers = result.body.items;

				} else if (result.head.httpCode == 404) {
					// this.advertisers = [];
				}
			},
			error => {
				// this.dataService.alert(error.message);
			}
		)

		//项目名称
		this.dataService.dataProject().subscribe(
			result => {
				// console.log(result)
				this.projects = result.body.items
			},
			error => {
				// this.dataService.alert(error.message);
			}
		)
		//推广活动
		this.dataService.dataCampaigns().subscribe(
			result => {
				console.log(result)
				this.campaigns = result.body.items 
			},
			error => {
				// this.dataService.alert(error.message);
			}
		)

		//投放策略
		this.dataService.dataCampaigns().subscribe(
			result => {
				console.log(result)
				this.campaigns = result.body.items 
			},
			error => {
				// this.dataService.alert(error.message);
			}
		)
	}



	private dataAddress() {
		this.router.navigate(["/home/data/dataAddress"]);
	}

	private dataNekwork() {
		this.router.navigate(["/home/data/dataNetwork"]);
	}
	private dataAdvert() {
		this.router.navigate(["/home/data/dataAdvert"]);
	}
	private dataFacility() {
		this.router.navigate(["/home/data/dataFacility"]);
	}
	private dataMedia() {
		this.router.navigate(["/home/data/dataMedia"]);
	}
	private dataPoints() {
		this.router.navigate(["/home/data/dataPoints"]);
	}

}
