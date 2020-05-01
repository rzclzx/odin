import { Component,OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChannelRootService } from "../../services/channel.root.service";
import { MyModalService } from "../../services/myModal.service";
import { ValidationService } from "../../services/validation.service";
import { ChineseService } from "../../services/chinese.service";
import "./pricingContracts.less"
declare var $;
declare var require;
let path = require("./createEditPricing.html");

@Component({
	selector: "ng-createEditPricing",
	template: path
})

export class CreateEditPricingComponent implements OnInit {
	private startDate: number=new Date().getTime();
	private Date: number=new Date().getTime();
	private endDate: number=new Date().getTime();
	public mainMenus = [
        {
            name: "渠道管理",
            value: undefined
        },
        {
            name: "程序化渠道",
            value: "/home/programmaticChannel/channelList"
        },
        {
            name: "定价合同管理",
            value: "/home/programmaticChannel/pricingContracts/" + this.route.snapshot.params["adxId"]
        },
        {
            name: this.route.snapshot.params["contractId"] ? "编辑定价合同" : "新建定价合同",
            value: undefined
        },
    ];

	private adxId: number;
	private contractId: number;
	private code: string;
	private name: string;
	private bid: number;
	private bidType: string = "1";
	constructor(
		private publicService: PublicService,
		private chineseService: ChineseService,
		private validationService: ValidationService,
		private myModalService: MyModalService,
		private channelRootService: ChannelRootService,
		private router: Router,
		private route: ActivatedRoute,
		
	) {
		this.adxId = this.route.snapshot.params["adxId"];
		this.contractId = this.route.snapshot.params["contractId"];
	}
	
	ngOnInit() {
		this.publicService.timeRangePickerSet("timeRangePicker",{
			locale: this.chineseService.config.TIMERANGEPICKER_CONFIG,
			autoUpdateInput: false,
		},(start,end) => {
			this.startDate = start._d.getTime() - start._d.getTime()%1000;
			this.endDate = end._d.getTime() - end._d.getTime()%1000;
		});
		
		if( this.contractId){
			this.channelRootService.queryContract( this.contractId).subscribe(
				result => {
					this.code = result.body.code;
					this.name = result.body.name;
					this.startDate = result.body.startDate;
					this.endDate = result.body.endDate;
					this.bid = result.body.bid/100; 
					this.bidType = result.body.bidType;
				},
				error => {
					this.myModalService.alert(error.message);
				}
			);
		}
	}
	
	private goCreateEditPricing(){
		this.router.navigate(["/home/programmaticChannel/pricingContracts/"+this.adxId]);
	}
	
	private save(){
		if( this.validationService.validate()){
			if( this.contractId){
				this.channelRootService.editContract( this.contractId,{
					id : this.contractId,
					endDate : this.publicService.FormalTimeLine(this.endDate),
					name : this.name,
					startDate :  this.publicService.FormalTimeLine(this.startDate)
				}).subscribe(
					result => {
						if(result.head.httpCode == 204){
							this.goCreateEditPricing()
						}
					},
					error => {
						this.myModalService.alert(error.message);
					}
				);
			}else{
				this.channelRootService.createContract({
					bid : this.bid*100,
					bidType : this.bidType,
					code : this.code,
					endDate : this.publicService.FormalTimeLine(this.endDate),
					name : this.name,
					startDate : this.publicService.FormalTimeLine(this.startDate)
				}).subscribe(
					result => {
						if(result.body.id){
							this.goCreateEditPricing()
						}
					},
					error => {
						this.myModalService.alert(error.message);
					}
				)
			}
		}else{
			this.validationService.validate()
		}
	}
	
}