import { Component,OnInit,ViewChild } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { BaseService } from "../../services/base.service";
import { CreativeSizeManagementService } from "../../services/creativeSizeManagement.service";
import { Page } from "../../models/page.model";
import { MyModalService } from "../../services/myModal.service";

declare var $;
declare var require;
let path = require("./inflowTmpls.html");
let path1= require("./imageSize.less")

@Component({
	selector: "ng-inflowTmpls",
	template: path,
	styles:['path1']
})

export class InflowTmplsComponent implements OnInit {
	private adtypeId:string;
	private adxId:number;
	private adxName:string;
	private code:string;
	private enable:string;
	private duration:string;
	private frameHeight:number;
	private id:number;
	// private infoflowTmpl;
	private ctaDescMaxLen:number;
	private ctaDescRequire:string;
	private descriptionMaxLen:number;
	private descriptionRequire:string;
	private imageTmpls=[];
	private imageFormats=[];
	private iconImageSizes=[];
	private bigImageSizes=[];
	private height:number;
	private maxVolume:number;
	private orderNo:number;
	private sizeId:number;
	private type:string;
	private width:number;
	private needDiscountPrice:string;
	private needGoodsStar:string;
	private needOriginalPrice:string;
	private needSalesVolume:string;
	private name:string;
	private pageNo:number;
	private pageSize:number;
	private total:number;
	private inflowTmpls=[];
	private inflows1=[];
	private imagePoses=[];
	private inflowPosesSelected = [];
	private errorMessage;
	private inflowPosesAllcheck: boolean = false;
	private infoflowTmpls=[];

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
            name: "原生广告位",
            value: undefined
        }
    ];


	private page = {
		pageNo: 0,
		pageSize: 10,
		total:0
	};



	constructor(
		private publicService: PublicService,
		private chineseService: ChineseService,
		private creativeSizeManagementService:CreativeSizeManagementService,
		private router:Router,
		private myModalService:MyModalService,
	) {}

	ngOnInit() {
		this.refreshTable();
		//原生广告位模板
		this.creativeSizeManagementService.infoflowTmpls().subscribe(
			result => {
					this.infoflowTmpls=result.body.items;
			},
			error => {
			//		this.myModalService.alert(error.message);
			}
		)
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
	this.creativeSizeManagementService.inflowTmplsList(options.pageNo,options.pageSize)
		.subscribe(
			result => {
				if (result.head.httpCode == 200) {
					let rows = [];
					for (let i = 0,len = result.body.items.length; i < len; i++) {
						rows[(options.pageNo - 1)*options.pageSize+i] = result.body.items[i];
						this.addIswrite(rows[(options.pageNo - 1)*options.pageSize+i]);
					}
					this.inflowTmpls = rows;
					if(result.body.pager){
						this.page = result.body.pager;
						this.page.pageNo--;
						if(!this.inflowTmpls[this.page.pageSize*this.page.pageNo] && this.page.pageNo > 0){
							this.page.pageNo--;
						}
					}
				}else if(result.head.httpCode == 404){
					this.inflowTmpls = [];
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

	private gotoimagePoses(){
		this.router.navigate(["/home/creativeSizeManagement/imagePoses"]);
	}
	private gotoimageSize(){
		this.router.navigate(["/home/creativeSizeManagement/imageSize"]);
	}
	private gotoeditinflowPoses(id){
		this.router.navigate(["/home/creativeSizeManagement/editinflowPoses",id]);
	}
	private gotoinfoflowPoses(){
		this.router.navigate(["/home/creativeSizeManagement/inflowPoses"]);
	}
	private gotovideoPoses(){
		this.router.navigate(["/home/creativeSizeManagement/videoPoses"]);
	}
	private gotoaddinflowTmpls(){
		this.router.navigate(["/home/creativeSizeManagement/addinflowTmpls"]);
	}
 }