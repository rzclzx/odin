import { Component, OnInit, ViewChild, TemplateRef } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { ChannelRootService } from "../../services/channel.root.service";
import { Page } from "../../models/page.model";
import { MyModalService } from "../../services/myModal.service";

import { CampaignService } from "../../services/campaign.service";
import "../campaign/campaignDetail.less";
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
//		this.channelRootService.batchQueryChannel(0,10).subscribe(
//			result => {
//				if(result.head.httpCode == 200) {
//					this.channel = result.body.item;
//				} else if(result.head.httpCode == 404) {
//					this.channel = [];
//				}
//			},
//			error => this.errorMessage = <any>error
//		);
		this.refreshTable()
	}
	/*开关*/
	private switchChange(row) {
		let enable = row.enable ? row.enable : "0";
		let id = row.id;
//				if(enable == "1"){	//如果状态为启动（1），再次点击需要暂停。
//					this.channelRootService.getStatus(id,{enable:"0"}).subscribe(
//						result => {
//							this.refreshTable()
//						},
//						error => {
//							this.myModalService.alert(error.message);
//						}
//					)
//		
//				} else {
//					this.channelRootService.getStatus(id,{enable:"1"}).subscribe(
//						result => {
//							this.refreshTable()
//						},
//						error => {
//							this.myModalService.alert(error.message);
//						}
//					)
//				}
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
					// console.log(this.channel)
					
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
			error => this.errorMessage = <any>error
		);			
	}
	
	private addIswrite(project){
		project.isWrite = false;
	}
	
	private goCreateEditChannel(id){
		if( id || id == 0){
			this.router.navigate(["/home/channel/createEditChannel/"+id]);
		}else{
			this.router.navigate(["/home/channel/createEditChannel"]);
		}

	}
	
	
}