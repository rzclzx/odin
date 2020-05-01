import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { ChannelRootService } from "../../services/channel.root.service";
import { Page } from "../../models/page.model";
import { MyModalService } from "../../services/myModal.service";

import { CampaignService } from "../../services/campaign.service";
import "../campaign/campaignDetail.less";
import "./programmaticChannel.less";
declare var $;
declare var require;
let path = require("./programmaticChannel.html");

@Component({
	selector: "ng-programmaticChannel",
	template: path
})

export class ProgrammaticChannelComponent implements OnInit {
	@ViewChild("mydatatable") mydatatable;
	public mainMenus = [{
			name: "渠道管理",
			value: undefined
		},
		{
			name: "程序化渠道",
			value: undefined
		}
	];
	private page: Page = {
		pageNo: 0,
		pageSize: 10,
		total: 0
	};
	private errorMessage;
	private channel: Array < object > = [];
	constructor(
		private router: Router,
		private route: ActivatedRoute,
		private publicService: PublicService,
		private chineseService: ChineseService,
		private myModalService: MyModalService,
		private channelRootService: ChannelRootService,
	) {

	}

	ngOnInit() {	
		this.refreshTable()
	}
	/*开关*/
	private switchChange( row) {
		let enable = row.enable ? row.enable : "0";
		this.channelRootService.enableChange( row.id,{ enable: enable == '0' ? '1' : '0'}).subscribe(
			result => {
				if( result.head.httpCode == 204 ){
					this.refreshTable()
				}	
			},
			error => {
				this.myModalService.alert(error.message);
			}
		)

	};

	private onPage(event) {
		this.page.pageNo = event.offset;
		this.refreshTable();
	}
	// 刷新表格数据
	private refreshTable(obj ? ) {
		let options = {
			pageNo: this.page.pageNo + 1,
			pageSize: this.page.pageSize,
		}
		if(obj) {
			for(let i in obj) {
				options[i] = obj[i];
			}
		}
		this.channelRootService.batchQueryChannel(options.pageNo, options.pageSize).subscribe(
			result => {
				if(result.head.httpCode == 200) {
					let rows = [];
					for(let i = 0, len = result.body.items.length; i < len; i++) {
						rows[(options.pageNo - 1) * options.pageSize + i] = result.body.items[i];
						this.addIswrite(rows[(options.pageNo - 1) * options.pageSize + i]);
					}
					this.channel = rows;
					
					if(result.body.pager) {
						this.page = result.body.pager;
						this.page.pageNo--;
						if(!this.channel[this.page.pageSize * this.page.pageNo] && this.page.pageNo > 0) {
							this.page.pageNo--;
						}
					}
				} else if(result.head.httpCode == 404) {
					this.channel = [];
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
	
	private goCreateEditChannel(id){
		if( id || id == 0){
			this.router.navigate(["/home/programmaticChannel/createEditChannel/"+id]);
		}else{
			this.router.navigate(["/home/programmaticChannel/createEditChannel"]);
		}

	}
	
	private goPricingContracts( id){
		this.router.navigate(["/home/programmaticChannel/pricingContracts/"+id]);
	}
	
	private goMediaManagement( id){
		this.router.navigate(["/home/programmaticChannel/mediaManagementProgram/"+id]);	
	}
	
	private goChannelDetail( id){
		this.router.navigate(["/home/programmaticChannel/channelDetail/"+id]);
	}
	
	private goTrafficManagement( id){
		this.router.navigate(["/home/programmaticChannel/trafficManagement/"+id]);
	}
}