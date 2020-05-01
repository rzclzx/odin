import { Component,OnInit,ViewChild,TemplateRef } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { Package } from "../../models/package.model";
import { PackageService } from "../../services/package.service";
import { Advertiser } from "../../models/advertiser.model";
import { Page } from "../../models/page.model";

import { AdvertiserService } from "../../services/advertiser.service";
import { MyModalService } from "../../services/myModal.service";
import { ChineseService } from "../../services/chinese.service";
import { PublicService } from "../../services/public.service";

import "./advertiserList.less";

declare var $;
declare var require;
let path = require("./advertiserList.html"); 


@Component({
	selector: "advertiser-list",
	template: path
})

export class AdvertiserListComponent implements OnInit {
	@ViewChild("mydatatable") mydatatable;
    public mainMenus = [
        {
            name: "客户管理",
            value: undefined
        },
        {
            name: "广告主管理",
            value: undefined
		}
    ];
	
	private name : string;
	private contacts : string;
	private companyName : string;
    private datas = [];
	private advertiser=new Advertiser();
	private advertisers:Advertiser[]=[];
	private packages:Package[] = [];
	private id:number;
	private errorMessage;
	private isProtected:string;
    // private pager=new Page();
        private page:Page = {
            pageNo: 0,
            pageSize: 10,
            total:0
        };
    
        constructor(
            private publicService: PublicService,
            private chineseService: ChineseService,
            private advertiserService:AdvertiserService,
            private myModalService:MyModalService,
            private packageService:PackageService,
            private router:Router,
        ) {}
    
        ngOnInit() {
			this. refreshTable();
			// this.dateInit;
		}
		

	//表格条件初始化
	private dateInit(){
		for(var i=0;i<this.advertisers.length;i++){
			if(this.advertisers[i].isProtected=="0"){
				this.advertisers[i].isProtected="否";
			}else if(this.advertisers[i].isProtected=="1"){
				this.advertisers[i].isProtected="是";
			}
		}
	}


	// 刷新表格数据
	private refreshTable(obj?) {
		let options = {
			pageNo: this.page.pageNo + 1,
            pageSize: this.page.pageSize,
            name:this.name,
            companyName:this.companyName,
			contacts:this.contacts,
		}
		if(obj){
			for(let i in obj){
				options[i] = obj[i];
			}
		}
		this.advertiserService.list(options)
			.subscribe(
				result => {
					if (result.head.httpCode == 200) {
						let rows = [];
						for (let i = 0,len = result.body.items.length; i < len; i++) {
							rows[(options.pageNo - 1)*options.pageSize+i] = result.body.items[i];
							this.addIswrite(rows[(options.pageNo - 1)*options.pageSize+i]);
						}
						this.advertisers = rows;
						if(result.body.pager){
							this.page = result.body.pager;
							this.page.pageNo--;
							if(!this.advertisers[this.page.pageSize*this.page.pageNo] && this.page.pageNo > 0){
								this.page.pageNo--;
							}
						}
					}else if(result.head.httpCode == 404){
						this.advertisers = [];
					}
				},
				error => this.errorMessage = <any>error);
	}

	//advertiser添加iswrite属性
	private addIswrite(advertiser){
		advertiser.isWrite = false;
	}
	//监听分页
	private onPage(event){
		this.page.pageNo = event.offset;
		this.refreshTable();
	}

     //获取后台列表数据
    private gotocreateAdvertisers(){
        this.router.navigate(["/home/advertiser/createAdvertisers"]);
	}
	private gotoAdvertiserDetali(id){
        this.router.navigate(["/home/advertiser/advertiserDetail",id]);
    }
    private gocreateAdvertisers(id){
        this.router.navigate(["/home/advertiser/createAdvertisers",id]);
    }
    private gotocreateUsers(){
        this.router.navigate(["/home/advertiser/createUsers"]);
	}
	
}