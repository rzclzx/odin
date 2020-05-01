import { Component,OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChannelRootService } from "../../services/channel.root.service";
import { MyModalService } from "../../services/myModal.service";
import { Page } from "../../models/page.model";
import { ChineseService } from "../../services/chinese.service";
import "./pricingContracts.less";
declare var $;
declare var require;
let path = require("./pricingContracts.html");

@Component({
	selector: "ng-pricingContracts",
	template: path
})

export class PricingContractsComponent implements OnInit {
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
            name: "定价合同",
            value: undefined
        },
    ];
	private errorMessage;
	private contracts : Array<object> = [];
	private adxId : number;
	private code: string;
	private name: string;
	private status: string = "";
	private adxName: string;
	constructor(
		private publicService: PublicService,
		private chineseService: ChineseService,
		private myModalService: MyModalService,
		private channelRootService: ChannelRootService,
		private router: Router,
		private route: ActivatedRoute,
		
	) {
		this.adxId=this.route.snapshot.params["adxId"];
	}

	ngOnInit() {
		this.channelRootService.findAdxDetail( this.adxId).subscribe(
	        result => {
	        	if(result.head.httpCode = 200){
	        		this.adxName = result.body.name;	
				}
			},
			error => this.errorMessage = <any>error
	    )

		this.refreshTable()
	}
	
	private refreshTable(obj ? ) {
		let options = {
			pageNo: this.page.pageNo + 1,
			pageSize: this.page.pageSize,
			code : this.code ? this.code : "",
			name : this.name ? this.name : "",
			status : this.status ? this.status : ""
		}
		if(obj) {
			for(let i in obj) {
				options[i] = obj[i];
			}
		}
		this.channelRootService.queryContracts(options.pageNo, options.pageSize, options.code, options.name, options.status).subscribe(
			result => {
				if(result.head.httpCode == 200) {
					let rows = [];
					for(let i = 0, len = result.body.items.length; i < len; i++) {
						rows[(options.pageNo - 1) * options.pageSize + i] = result.body.items[i];
						this.addIswrite(rows[(options.pageNo - 1) * options.pageSize + i]);
					}
					this.contracts = rows;
					
					if(result.body.pager) {
						this.page = result.body.pager;
						this.page.pageNo--;
						if(!this.contracts[this.page.pageSize * this.page.pageNo] && this.page.pageNo > 0) {
							this.page.pageNo--;
						}
					}
				} else if(result.head.httpCode == 404) {
					this.contracts = [];
				}
			},
			error => this.errorMessage = <any>error
		);			
	}
	
	private addIswrite(project){
		project.isWrite = false;
	}
	
	//监听分页
	private onPage(event){
		this.page.pageNo = event.offset;
		this.refreshTable();
	}
	
	private back(){
		this.router.navigate(["/home/programmaticChannel/channelList"]);
	}
	
	private goPricingContracts(){
		this.router.navigate(["/home/programmaticChannel/pricingContracts/"+this.adxId]);
	}
	
	private goMediaManagement(){
		this.router.navigate(["/home/programmaticChannel/mediaManagementProgram/"+this.adxId]);	
	}
	
	private goChannelDetail(){
		this.router.navigate(["/home/programmaticChannel/channelDetail/"+this.adxId]);
	}
	
	private goTrafficManagement(){
		this.router.navigate(["/home/programmaticChannel/trafficManagement/"+this.adxId]);
	}
	
	private goCreateEditContracts( id){
		if( id || id == 0 ){
			this.router.navigate(["/home/programmaticChannel/createEditPricing/"+this.adxId+"/"+id]);			
		}else{
			this.router.navigate(["/home/programmaticChannel/createEditPricing/"+this.adxId]);
		}
	}
}