import { Component,OnInit } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { BaseService } from "../../services/base.service";
import { CreativeSizeManagementService } from "../../services/creativeSizeManagement.service";
import { Page } from "../../models/page.model";

declare var $;
declare var require;
let path = require("./imageSize.html");
let path1= require("./imageSize.less")

@Component({
	selector: "ng-imageSize",
	template: path,
	styles:['path1']
})

export class ImageSizeComponent implements OnInit {
	private adtypeId:string;
	private height:number;
	private id:number;
	private remark:string;
	private width:number;
	private pageNo:number;
	private pageSize:number;
	private total:number;
	private sizes=[];
	private errorMessage;

	public mainMenus = [
        {
            name: "渠道管理",
            value: undefined
        },
        {
            name: "创意规格管理",
            value: "/home/creativeSizeManagement/imageSize"
		},
		{
            name: "图片尺寸管理",
            value: undefined
        }
    ];

	private datas = [];

	private page = {
		pageNo: 0,
		pageSize: 10,
		total:0
	};



	constructor(
		private publicService: PublicService,
		private chineseService: ChineseService,
		private creativeSizeManagementService:CreativeSizeManagementService,
		private router:Router
	) {}

	ngOnInit() {
		this.refreshTable();
	}


 // 刷新表格数据
 private refreshTable(obj?) {
	let options = {
		pageNo: this.page.pageNo + 1,
		pageSize: this.page.pageSize,
	}
	if(obj){
		for(let i in obj){
			options[i] = obj[i];
		}
	}
	this.creativeSizeManagementService.sizeList(options.pageNo,options.pageSize)
		.subscribe(
			result => {
				if (result.head.httpCode == 200) {
					let rows = [];
					for (let i = 0,len = result.body.items.length; i < len; i++) {
						rows[(options.pageNo - 1)*options.pageSize+i] = result.body.items[i];
						this.addIswrite(rows[(options.pageNo - 1)*options.pageSize+i]);
					}
					this.sizes = rows;
					if(result.body.pager){
						this.page = result.body.pager;
						this.page.pageNo--;
						if(!this.sizes[this.page.pageSize*this.page.pageNo] && this.page.pageNo > 0){
							this.page.pageNo--;
						}
					}
				}else if(result.head.httpCode == 404){
					this.sizes = [];
				}
			},
			error => this.errorMessage = <any>error);
}

  //project添加iswrite属性
  addIswrite(project){
	project.isWrite = false;
}


// private update(e): void{
// 	this.page.pageSize = e;
// 	this.refreshTable({pageNo: 1});
// }

// 监听分页
	private onPage(event){
		this.page.pageNo = event.offset;
		this.refreshTable();
	}

	private gotoaddSize(){
		this.router.navigate(["/home/creativeSizeManagement/addimageSize"]);
	}
	private gotoimagePoses(){
		this.router.navigate(["/home/creativeSizeManagement/imagePoses"]);
	}
	private gotovideoPoses(){
		this.router.navigate(["/home/creativeSizeManagement/videoPoses"]);
	}
	private gotoinfoflowPoses(){
		this.router.navigate(["/home/creativeSizeManagement/inflowPoses"]);
	}
 }