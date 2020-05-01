import { Component,OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";

declare var $;
declare var require;
let path = require("./p.html");

@Component({
	selector: "ng-p",
	template: path
})

export class PComponent implements OnInit {

	private datas = [];

	private shows = [
		{
			name:1,
			value: true
		},
		{
			name:1,
			value: true
		},
		{
			name:1,
			value: true
		},
		{
			name:1,
			value: true
		},{
			name:1,
			value: false
		},{
			name:1,
			value: false
		},{
			name:1,
			value: false
		}
	];

	private isShowScroll;

	private page = {
		pageNo: 0,
		pageSize: 10,
		total:0,
		currentShow: 1
	};

	private startDate;

	private endDate;

	constructor(
		private publicService: PublicService,
		private chineseService: ChineseService
	) {}

	ngOnInit() {
		this.publicService.timeRangePickerSet("timeRangePicker",{
			locale: this.chineseService.config.TIMERANGEPICKER_CONFIG,
            autoUpdateInput: false
		},(start,end) => {
            this.startDate = start._d.getTime() - start._d.getTime()%1000;
			this.endDate = end._d.getTime() - end._d.getTime()%1000;
		},() => {
            if(!this.startDate && !this.endDate){
				this.startDate = this.publicService.getTodayStartandEnd().startDate;
				this.endDate = this.publicService.getTodayStartandEnd().endDate;
			}
		});
		for(let i = 0;i < 11;i++){
			this.datas.push({
				name: "呵呵哒",
				id: "123123fdsafdasfdsa",
				adx: "汽车之家"
			});
		}
		this.page.total = this.datas.length;
		this.refesh();
	}
	private onPage(e){
		if(e === 1){
			for(let i = 0;i < 11;i++){
				this.datas.push({
					name: "呵呵哒",
					id: "123123fdsafdasfdsa",
					adx: "汽车之家"
				});
			}
			this.page.pageNo = 0;
			this.page.currentShow = 1;
		}
	}
	private refesh(){
		console.log(this.shows)
		let count = 0;
		for(let i = 0;i < this.shows.length;i++){
			this.shows[i].value && count++;
		}
		this.isShowScroll = count <= 4 ? false : true;
	}
}