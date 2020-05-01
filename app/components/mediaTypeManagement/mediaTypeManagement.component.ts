import { Component,OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChannelRootService } from "../../services/channel.root.service";
import { ChineseService } from "../../services/chinese.service";
import "./mediaTypeManagement.less";

declare var $;
declare var require;
let path = require("./mediaTypeManagement.html");
let documentTemplate = require("../../resources/mediaTypeManagementTemplate.xlsx");
@Component({
	selector: "ng-mediaTypeManagement",
	template: path
})

export class MediaTypeManagementComponent implements OnInit {
	private channelManagement : Array<object> = [];
	private documentTemplate = documentTemplate;
	
	private page = {
		pageNo: 0,
		pageSize: 10,
		total:1
	};
	
	private errorMessage;
	
	public mainMenus = [
        {
            name: "渠道管理",
            value: undefined
        },
        {
            name: "媒体分类管理",
            value: undefined
        }
    ];

	constructor(
		private publicService: PublicService,
		private channelRootService: ChannelRootService,
		private chineseService: ChineseService,
		private router: Router,
		
		
	) {
		
	}

	ngOnInit() {
		this.refreshTable()	
	}
	
	private goNewLevel( level, id){
		if( id){
			this.router.navigate(["/home/mediaTypeManagement/newLevelMedia/"+level+"/"+id]);
		}else{
			this.router.navigate(["/home/mediaTypeManagement/newLevelMedia/"+level]);
		}
		
	}
	
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
		this.channelRootService.queryAppTypes(options).subscribe(
			result => {
				if(result.head.httpCode == 200) {
					let rows = [];
					for(let i = 0, len = result.body.items.length; i < len; i++) {
						rows[(options.pageNo - 1) * options.pageSize + i] = result.body.items[i];
						this.addIswrite(rows[(options.pageNo - 1) * options.pageSize + i]);
					}
					this.channelManagement = rows;
					
					if(result.body.pager) {
						this.page = result.body.pager;
						this.page.pageNo--;
						if(!this.channelManagement[this.page.pageSize * this.page.pageNo] && this.page.pageNo > 0) {
							this.page.pageNo--;
						}
					}
				} else if(result.head.httpCode == 404) {
					this.channelManagement = [];
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
}