import { Component,OnInit,ViewChild } from "@angular/core";
import { Router,ActivatedRoute } from "@angular/router";
import { PublicService } from "../../services/public.service";
import { ChineseService } from "../../services/chinese.service";
import { BaseService } from "../../services/base.service";
import { CreativeSizeManagementService } from "../../services/creativeSizeManagement.service";
import { Page } from "../../models/page.model";
import { MyModalService } from "../../services/myModal.service";
import { InfoflowTmpl } from "../../models/advertiser.model";

declare var $;
declare var require;
let path = require("./inflowPoses.html");
let path1= require("./imageSize.less")

@Component({
	selector: "ng-inflowPoses",
	template: path,
	styles:['path1']
})

export class InflowPosesComponent implements OnInit {
	@ViewChild("inflowPosesDatatable") inflowPosesDatatable;
	private adtypeId:string;
	private adxId:number;
	private adxName:string;
	private code:string;
	private enable:string;
	private duration:string;
	private frameHeight:number;
	private id:number;
	private infoflowTmpl:InfoflowTmpl= new InfoflowTmpl();
	private ctaDescMaxLen:number;
	private ctaDescRequire:string;
	private descriptionMaxLen:number;
	private descriptionRequire:string;
	private imageTmpls=[];
	private imageFormats=[];
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
	private inflows=[];
	private inflows1=[];
	private imagePoses=[];
	private inflowPosesSelected = [];
	private errorMessage;
	private inflowPosesAllcheck: boolean = false;
	private infoflowTmpls=[];
	private option=[];


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
		// this.creativeSizeManagementService.infoflowTmpls().subscribe(
		// 	result => {
		// 			this.infoflowTmpls=result.body.items;
		// 	},
		// 	error => {
		// 			this.myModalService.alert(error.message);
		// 	}
		// )
		
	}

 private infoflowTmpl1(v){
	return v.name;
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
	this.creativeSizeManagementService.inflowList(options.pageNo,options.pageSize)
		.subscribe(
			result => {
				if (result.head.httpCode == 200) {
					let rows = [];
					for (let i = 0,len = result.body.items.length; i < len; i++) {
						rows[(options.pageNo - 1)*options.pageSize+i] = result.body.items[i];
						this.addIswrite(rows[(options.pageNo - 1)*options.pageSize+i]);
					}
					this.inflows = rows;
					if(result.body.pager){
						this.page = result.body.pager;
						this.page.pageNo--;
						if(!this.inflows[this.page.pageSize*this.page.pageNo] && this.page.pageNo > 0){
							this.page.pageNo--;
						}
					}
				}else if(result.head.httpCode == 404){
					this.inflows = [];
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

    //全选切换
	private allToggle(table,allcheck,data){
		table.selected.splice(0,table.selected.length)
		if(allcheck){
			for(let i = 0;i < data.length;i++){
				table.selected.push(data[i]);
			}
		}
	}
	private onSelect(event,value){		
		if(!event.selected){
			return;
		}
		this.inflowPosesAllcheck = event.selected.length === this.inflows.length ? true : false;	
	}
	private allCheckFire(value){
	this.allToggle(this.inflowPosesDatatable,this.inflowPosesAllcheck,this.inflows);
	}
	//点击开始
	private start(){
		if(this.inflowPosesSelected.length===0){
			return;
		}
		for(let i =0;i<this.inflowPosesSelected.length;i++){
			this.option.push(this.inflowPosesSelected[i].id)
		}	
		
		this.creativeSizeManagementService.flowEnable(this.option).subscribe(
			result => {
				this.refreshTable();
				this.inflowPosesSelected=[];
				this.inflowPosesAllcheck=false;
			},
			error => {
			//	this.myModalService.alert(error.message);
			}
		)
	}
	//点击暂停
	private stop(){
		if(this.inflowPosesSelected.length===0){
			return;
		}
		for(let i =0;i<this.inflowPosesSelected.length;i++){
			this.option.push(this.inflowPosesSelected[i].id)
		}	
		
		this.creativeSizeManagementService.flowdisable(this.option).subscribe(
			result => {
				this.refreshTable();
				this.inflowPosesSelected=[];
				this.inflowPosesAllcheck=false;
			},
			error => {
			//	this.myModalService.alert(error.message);
			}
		)
	}


	//开关修改
	switchChange(row) {
		this.option=[];
		let enable=row.enable?row.enable:"0";
		this.option.push(row.id);
		if(enable == "1"){	//如果状态为启动（1），再次点击需要暂停。
			this.creativeSizeManagementService.flowdisable(this.option).subscribe(
				result => {
					this.refreshTable()
				},
				error => {
				//	this.myModalService.alert(error.message);
				}
			)
		} else {
			this.creativeSizeManagementService.flowEnable(this.option).subscribe(
				result => {
					this.refreshTable()
				},
				error => {
				//	this.myModalService.alert(error.message);
				}
			)
		}
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
	private gotoaddinflowPoses(){
		this.router.navigate(["/home/creativeSizeManagement/addinflowPoses"]);
	}
	private gotovideoPoses(){
		this.router.navigate(["/home/creativeSizeManagement/videoPoses"]);
	}
	private gotoinfoflowTmpls(){
		this.router.navigate(["/home/creativeSizeManagement/inflowTmpls"]);
	}
 }