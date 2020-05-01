import { Component,OnInit,ViewChild } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChannelRootService } from "../../services/channel.root.service";
import { Page } from "../../models/page.model";
import { MyModalService } from "../../services/myModal.service";
import { ChineseService } from "../../services/chinese.service";
import { Campaign,Kpi,App } from "../../models/campaign.model";
import "./pricingContracts.less";

declare var $;
declare var require;
let path = require("./trafficManagement.html");
let documentTemplate = require("../../resources/pricingContractsTemplate.xlsx");
@Component({
	selector: "ng-trafficManagement",
	template: path
})

export class TrafficManagementComponent implements OnInit {

	@ViewChild("appModal") appModal;
	@ViewChild("mydatatable") mydatatable;
	private documentTemplate = documentTemplate;
	private page: Page = {
		pageNo: 0,
		pageSize: 10,
		total: 0
	};
	
	
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
            name: "无设备ID流量管理",
            value: undefined
        },
    ];

	private adxId : number;
	private adxName: string;
	private isShowApp: boolean = false;
	private app : any;
	private trafficManagement: Array<object> = [];

	private appId: string = "";
	private appName: string = "";
	private enable: any = undefined;
	private type: any = undefined;

	constructor(
		private publicService: PublicService,
		private myModalService: MyModalService,
		private chineseService: ChineseService,
		private channelRootService: ChannelRootService,
		private router: Router,
		private route: ActivatedRoute,

	) {
		this.adxId=this.route.snapshot.params["adxId"];
	}

	ngOnInit() {
		this.app = new App();
		
		this.channelRootService.findAdxDetail( this.adxId).subscribe(
	        result => {
	        	if(result.head.httpCode = 200){
	        		this.adxName = result.body.name;	
				}
			},
			error => {
				this.myModalService.alert(error.message);
			}
	   )	
		this.refreshTable()
	}                                                                                                                                                                                         

	private onPage(event) {
		this.page.pageNo = event.offset;
		this.refreshTable();
	}
	// 刷新表格数据
	private refreshTable(obj ? ) {
		let options = {
			adxId : this.adxId,
			appId : this.appId ? this.appId : "",
			appName : this.appName ? this.appName : "",
			enable : this.enable ? this.enable : "",
			type : this.type ? this.type : "",
			pageNo: this.page.pageNo + 1,
			pageSize: this.page.pageSize,
		}
		let postData = {};
		for(let i in options){
			if(options[i]){
				postData[i] = options[i]
			}
		}
		
		if(obj) {
			for(let i in obj) {
				options[i] = obj[i];
			}
		}
		this.channelRootService.BatchQueryNoDeviceID(postData).subscribe(
			result => {
				if(result.head.httpCode == 200) {
					let rows = [];
					for(let i = 0, len = result.body.items.length; i < len; i++) {
						rows[(options.pageNo - 1) * options.pageSize + i] = result.body.items[i];
						this.addIswrite(rows[(options.pageNo - 1) * options.pageSize + i]);
					}
					this.trafficManagement = rows;
					
					if(result.body.pager) {
						this.page = result.body.pager;
						this.page.pageNo--;
						if(!this.trafficManagement[this.page.pageSize * this.page.pageNo] && this.page.pageNo > 0) {
							this.page.pageNo--;
						}
					}
				} else if(result.head.httpCode == 404) {
					this.trafficManagement = [];
				}
			},
			error => {
				this.myModalService.alert(error.message);
			}
		);			
	}
	
	private addIswrite(project){
		project.isWrite = false;
	}
	
	private switchChange( row){
		let enable = row.enable ? row.enable : "0";
		this.channelRootService.noEquipmentFlowSwitch( row.id, this.adxId,{ enable: enable == '0' ? '1' : '0'}).subscribe(
			result => {
				if( result.head.httpCode == 204 ){
					this.refreshTable()
				}	
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)
		
		
	}

	private showApp(){
        this.isShowApp = true;
        this.appModal.open();
    }

	private onAppMessage(){
        this.appModal.close();
        this.isShowApp = false;
        this.refreshTable()
    }

	private goPricingContracts(){
		this.router.navigate(["/home/programmaticChannel/pricingContracts/" + this.adxId]);
	}

	private goMediaManagement(){
		this.router.navigate(["/home/programmaticChannel/mediaManagementProgram/" + this.adxId]);	
	}

	private goChannelDetail(){
		this.router.navigate(["/home/programmaticChannel/channelDetail/" + this.adxId]);
	}

	private goTrafficManagement(){
		this.router.navigate(["/home/programmaticChannel/trafficManagement/" + this.adxId]);
	}

	private back(){
		this.router.navigate(["/home/programmaticChannel/channelList"]);
	}
}