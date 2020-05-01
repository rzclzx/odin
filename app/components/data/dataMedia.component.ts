import { Component,OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import "./dataMedia.less";
import { Page } from "../../models/page.model";

declare var $;
declare var require;
let path = require("./dataMedia.html");

@Component({
	selector: "data-Media",
	template: path
})

export class DataMediaComponent implements OnInit {

			// private status:string;
			private advertiserName:string;
			private name:string;
			private datas = [];
			private id:number;
			private ids:number;
			private status:string;
			private auditStatus:string;
			private obj;
			private startDate: number=new Date().getTime();
			private Date: number=new Date().getTime();
			private endDate: number=new Date().getTime();

	constructor(
		private router: Router,
		private publicService: PublicService,
		private chineseService: ChineseService,
		private route:ActivatedRoute,
	) {}

	ngOnInit() {
		this.refreshTable();
		this.dataInit()
	}
	private dataInit(){
		this.id = this.route.snapshot.params["id"];    
		this.publicService.timeRangePickerSet("singalTimeRangePicker",{
			locale: this.chineseService.config.TIMERANGEPICKER_CONFIG,
			autoUpdateInput: false,
			"singleDatePicker": true,
		},(start) => {
			this.Date = start._d.getTime() - start._d.getTime()%1000;
		});
		this.publicService.timeRangePickerSet("timeRangePicker",{
			locale: this.chineseService.config.TIMERANGEPICKER_CONFIG,
			autoUpdateInput: false,
		},(start,end) => {
			this.startDate = start._d.getTime() - start._d.getTime()%1000;
			this.endDate = end._d.getTime() - end._d.getTime()%1000;
		});
		}

		private refreshTable(obj?) {
			let options = {
				startDate: this.startDate,
				endDate: this.endDate,
				advertiseDate:this.Date,
				advertiserName: this.advertiserName,
				ids:this.ids,
				name:this.name,
				status:this.status,
				auditStatus:"02"
			}
			if(obj){
				for(let i in obj){
					options[i] = obj[i];
				}
			}
				
		}
	
		private selectedDate(e) {
			this.startDate = e.startDate._d.getTime();
			this.endDate = e.endDate._d.getTime() - e.endDate._d.getTime()%1000;
			this.refreshTable();
		}


	
	private dataData(){
		this.router.navigate(["/home/data/dataChart"]);
	}
	private dataAddress(){
		this.router.navigate(["/home/data/dataAddress"]);
    }
    private dataNetwork(){
		this.router.navigate(["/home/data/dataNetwork"]);
    }
    private dataAdvert(){
		this.router.navigate(["/home/data/dataAdvert"]);
    }
    private dataFacility(){
		this.router.navigate(["/home/data/dataFacility"]);
    }
    private dataPoints(){
        this.router.navigate(["/home/data/dataPoints"])
    }
}
